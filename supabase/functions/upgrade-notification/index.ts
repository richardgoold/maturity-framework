/**
 * GrowthLens â Upgrade Notification Edge Function
 *
 * Called from the Admin Dashboard when a user's tier is changed to "premium".
 * Sends a branded email via Resend informing the user of their upgrade.
 *
 * DEPLOYMENT:
 *   supabase functions deploy upgrade-notification --project-ref xbrywtjahuidaufcdvti
 *
 * SECRETS (already set for welcome-email):
 *   RESEND_API_KEY â Resend API key with sending access for growthlens.app
 *   APP_URL â https://growthlens.app (optional, defaults to this)
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const APP_URL = Deno.env.get("APP_URL") || "https://growthlens.app";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UpgradePayload {
  userId: string;
  email: string;
  fullName: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userId, email, fullName }: UpgradePayload = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Missing email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const greeting = fullName ? `Hi ${fullName}` : "Great news";

    // Send upgrade notification email
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "GrowthLens <hello@growthlens.app>",
        reply_to: "richard@richardgoold.com",
        to: [email],
        subject: "You've been upgraded to GrowthLens Premium",
        html: buildUpgradeHtml(greeting),
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", err);
      return new Response(JSON.stringify({ error: err }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Notify admin
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "GrowthLens <hello@growthlens.app>",
        to: ["richard@richardgoold.com"],
        subject: `Premium upgrade sent: ${email}`,
        html: `<p>Upgrade notification sent to <strong>${email}</strong> (${fullName || "no name"}).</p>
               <p>User ID: ${userId}</p>`,
      }),
    });

    return new Response(JSON.stringify({ sent: true, to: email }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Upgrade notification error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function buildUpgradeHtml(greeting: string): string {
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
                ${greeting} &mdash; you&rsquo;re now on Premium!
              </h1>
              <p style="margin:0 0 24px; font-size:15px; color:#4a5568; line-height:1.7;">
                Your GrowthLens account has been upgraded to <strong style="color:#f2a71b;">Premium</strong>. You now have full access to all features, including gap analysis, improvement roadmaps, scenario modelling, and detailed PDF reports.
              </p>

              <!-- Action Required Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px; background-color:#fef9f0; border-radius:8px; border-left:4px solid #f2a71b;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 8px; font-size:14px; font-weight:700; color:#1a1a2e;">To activate your Premium access:</p>
                    <p style="margin:0; font-size:14px; color:#4a5568; line-height:1.6;">
                      Please <strong>log out</strong> of GrowthLens and <strong>log back in</strong>. Your Premium features will be available immediately on your next login.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Premium Features -->
              <p style="margin:0 0 12px; font-size:14px; font-weight:700; color:#1a1a2e;">What&rsquo;s included with Premium:</p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                <tr><td style="padding:4px 8px 4px 0; color:#f2a71b; font-size:14px;">&#10003;</td><td style="padding:4px 0; font-size:14px; color:#4a5568;">Full Gap Analysis &amp; Improvement Roadmap</td></tr>
                <tr><td style="padding:4px 8px 4px 0; color:#f2a71b; font-size:14px;">&#10003;</td><td style="padding:4px 0; font-size:14px; color:#4a5568;">Scenario Modelling (what-if analysis)</td></tr>
                <tr><td style="padding:4px 8px 4px 0; color:#f2a71b; font-size:14px;">&#10003;</td><td style="padding:4px 0; font-size:14px; color:#4a5568;">Detailed PDF &amp; CSV Reports</td></tr>
                <tr><td style="padding:4px 8px 4px 0; color:#f2a71b; font-size:14px;">&#10003;</td><td style="padding:4px 0; font-size:14px; color:#4a5568;">All benchmark profiles</td></tr>
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

              <p style="margin:0; font-size:14px; color:#4a5568; line-height:1.7;">
                If you have any questions, just reply to this email.
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
                Confidential &mdash; for authorised use only.
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
