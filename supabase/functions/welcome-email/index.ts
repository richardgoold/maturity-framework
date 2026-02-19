/**
 * GrowthLens — Welcome Email Edge Function
 *
 * Triggered by a Supabase Database Webhook on the `auth.users` table
 * when `email_confirmed_at` changes from NULL to a timestamp.
 *
 * SETUP STEPS:
 * 1. Deploy this function:
 *      supabase functions deploy welcome-email --project-ref xbrywtjahuidaufcdvti
 *
 * 2. Set the Resend API key as a secret:
 *      supabase secrets set RESEND_API_KEY=re_xxxxx --project-ref xbrywtjahuidaufcdvti
 *
 * 3. Create a Database Webhook in Supabase Dashboard:
 *      - Go to Database → Webhooks → Create
 *      - Table: auth.users
 *      - Events: UPDATE
 *      - Type: Supabase Edge Function
 *      - Function: welcome-email
 *
 *    Alternatively, use a Postgres trigger + pg_net (see bottom of file).
 *
 * 4. (Optional) Set the app URL secret:
 *      supabase secrets set APP_URL=https://growthlens.app --project-ref xbrywtjahuidaufcdvti
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const APP_URL = Deno.env.get("APP_URL") || "https://growthlens.app";

interface WebhookPayload {
  type: "UPDATE";
  table: string;
  schema: string;
  record: {
    id: string;
    email: string;
    email_confirmed_at: string | null;
    raw_user_meta_data: Record<string, unknown>;
  };
  old_record: {
    id: string;
    email: string;
    email_confirmed_at: string | null;
  };
}
serve(async (req) => {
  try {
    const payload: WebhookPayload = await req.json();

    // Only fire when email_confirmed_at transitions from null to a value
    const wasUnconfirmed = !payload.old_record?.email_confirmed_at;
    const isNowConfirmed = !!payload.record?.email_confirmed_at;

    if (!wasUnconfirmed || !isNowConfirmed) {
      return new Response(JSON.stringify({ skipped: true, reason: "Not a new confirmation" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userEmail = payload.record.email;
    const userName = (payload.record.raw_user_meta_data?.full_name as string) || "";
    const greeting = userName ? `Hi ${userName}` : "Welcome";

    // ── Send welcome email to user ──────────────────────────────────
    const userEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "GrowthLens <hello@growthlens.app>",
        to: [userEmail],
        subject: "Welcome to GrowthLens — let's get started",
        html: buildWelcomeHtml(greeting, userName),
      }),
    });

    if (!userEmailRes.ok) {
      const err = await userEmailRes.text();
      console.error("Resend error (user):", err);
    }

    // ── Notify Richard of new signup ────────────────────────────────
    const notifyRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "GrowthLens <hello@growthlens.app>",
        to: ["richard@richardgoold.com"],
        subject: `New GrowthLens signup: ${userEmail}`,
        html: `<p>A new user has verified their GrowthLens account:</p>
               <p><strong>Email:</strong> ${userEmail}<br>
               <strong>Name:</strong> ${userName || "(not provided)"}<br>
               <strong>Confirmed at:</strong> ${payload.record.email_confirmed_at}</p>
               <p><a href="https://xbrywtjahuidaufcdvti.supabase.co">Open Supabase Dashboard</a></p>`,
      }),
    });

    if (!notifyRes.ok) {
      const err = await notifyRes.text();
      console.error("Resend error (notify):", err);
    }

    return new Response(JSON.stringify({ sent: true, to: userEmail }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Welcome email error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
/**
 * Builds the branded welcome email HTML.
 */
function buildWelcomeHtml(greeting: string, _userName: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family:Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background-color:#1a1a2e; padding:32px 40px; text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="vertical-align:middle; padding-right:10px;">
                    <img src="https://growthlens.app/email-logo.svg" alt="GrowthLens" width="36" height="36" style="display:block; border-radius:8px;" />
                  </td>
                  <td style="vertical-align:middle;">
                    <span style="color:#ffffff; font-size:22px; font-weight:700; letter-spacing:-0.3px;">GrowthLens</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 16px;">
              <h1 style="margin:0 0 16px; font-size:22px; font-weight:700; color:#1a1a2e; line-height:1.3;">
                ${greeting}, you're in.
              </h1>
              <p style="margin:0 0 24px; font-size:15px; color:#4a5568; line-height:1.7;">
                Your GrowthLens account is now active. You can start assessing your firm's M&amp;A readiness across 57 metrics and 10 growth themes, benchmarked against what acquirers actually look for.
              </p>

              <!-- Quick Start Steps -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px; background-color:#fef9f0; border-radius:8px; border-left:4px solid #f2a71b;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 12px; font-size:14px; font-weight:700; color:#1a1a2e;">Quick Start</p>
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:4px 12px 4px 0; font-size:14px; color:#f2a71b; font-weight:700; vertical-align:top;">1.</td>
                        <td style="padding:4px 0; font-size:14px; color:#4a5568; line-height:1.5;"><strong>Add your firm</strong> — name and sector</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 12px 4px 0; font-size:14px; color:#f2a71b; font-weight:700; vertical-align:top;">2.</td>
                        <td style="padding:4px 0; font-size:14px; color:#4a5568; line-height:1.5;"><strong>Run an assessment</strong> — rate each metric as Foundational, Evolving, or Optimised</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 12px 4px 0; font-size:14px; color:#f2a71b; font-weight:700; vertical-align:top;">3.</td>
                        <td style="padding:4px 0; font-size:14px; color:#4a5568; line-height:1.5;"><strong>Review your dashboard</strong> — see how you compare to M&amp;A-Ready benchmarks</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <!-- CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 28px 0;">
                <tr>
                  <td style="background-color:#f2a71b; border-radius:8px;">
                    <a href="${APP_URL}" target="_blank" style="display:inline-block; padding:14px 32px; color:#ffffff; font-size:15px; font-weight:600; text-decoration:none; letter-spacing:0.3px;">
                      OPEN GROWTHLENS
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Advisory note -->
              <p style="margin:0 0 0; font-size:14px; color:#4a5568; line-height:1.7;">
                If you'd like a guided walkthrough or want to discuss advisory support, just reply to this email or book time at
                <a href="https://richardgoold.com" style="color:#f2a71b; text-decoration:none; font-weight:500;">richardgoold.com</a>.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none; border-top:1px solid #e2e8f0; margin:24px 0 0;">
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px 32px; text-align:center;">
              <p style="margin:0 0 4px; font-size:12px; color:#94a3b8; line-height:1.5;">
                &copy; 2026 GrowthLens. All rights reserved.
              </p>
              <p style="margin:0; font-size:11px; color:#cbd5e1; line-height:1.5;">
                Confidential — for authorised use only.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
/*
 * ── ALTERNATIVE: Postgres Trigger (if you prefer not to use Database Webhooks) ──
 *
 * Run this SQL in the Supabase SQL Editor:
 *
 * CREATE OR REPLACE FUNCTION notify_welcome_email()
 * RETURNS trigger AS $$
 * BEGIN
 *   IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
 *     PERFORM net.http_post(
 *       url := 'https://xbrywtjahuidaufcdvti.supabase.co/functions/v1/welcome-email',
 *       headers := jsonb_build_object(
 *         'Content-Type', 'application/json',
 *         'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
 *       ),
 *       body := jsonb_build_object(
 *         'type', 'UPDATE',
 *         'table', 'users',
 *         'schema', 'auth',
 *         'record', row_to_json(NEW),
 *         'old_record', row_to_json(OLD)
 *       )
 *     );
 *   END IF;
 *   RETURN NEW;
 * END;
 * $$ LANGUAGE plpgsql SECURITY DEFINER;
 *
 * CREATE TRIGGER on_user_confirmed
 *   AFTER UPDATE ON auth.users
 *   FOR EACH ROW
 *   EXECUTE FUNCTION notify_welcome_email();
 */
