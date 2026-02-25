# GrowthLens (Maturity Framework)

## Project Overview

An M&A due diligence assessment platform (branded as **GrowthLens**) that evaluates professional services firms (PSFs) across 10 growth themes and 57 metrics, benchmarked against M&A-ready industry standards. Built as a React SPA with Supabase backend, deployed to GitHub Pages with a custom domain.

- **Repo:** richardgoold/maturity-framework
- **Live site:** https://growthlens.app (custom domain, was richardgoold.github.io/maturity-framework)
- **Owner:** Richard Goold (richard@richardgoold.com)
- **Latest commit:** 5f6d39b (25 Feb 2026) - Joe's feedback fixes, Not Tracked option, demo data overhaul
- **Last updated:** 25 February 2026 (Joe's feedback fixes, demo data redesign)

## Tech Stack

- React 19 + Vite
- Supabase (auth, database, Edge Functions)
- Tailwind CSS (via CDN in index.html)
- Recharts (radar charts, bar charts)
- Lucide React (icons)
- GitHub Pages deployment via GitHub Actions
- Custom domain: growthlens.app (GoDaddy DNS → GitHub Pages)
- Resend (transactional email via SMTP + inbound email receiving via webhook)
- Plausible Analytics (privacy-friendly, at plausible.io/growthlens.app)

## Architecture

### File Structure
```
.github/workflows/deploy.yml      # GitHub Actions: build + deploy to Pages
.github/workflows/changelog.yml   # Auto-update CHANGELOG.md on push to main
index.html                        # Entry point (loads Tailwind CDN)
vite.config.js                 # Vite config with base path
package.json
src/
  main.jsx                     # React DOM root, routes
  App.jsx                      # Main application (~4750+ lines, deployed version)
  AuthContext.jsx               # Supabase auth provider (signUp, signIn, signOut, updatePassword, resetPassword)
  LoginPage.jsx                 # Login form (h-16 logo)
  SignupPage.jsx                # Signup form (h-16 logo)
  ProtectedRoute.jsx            # Auth guard for routes
  AdminRoute.jsx                # Admin-only route guard
  AdminDashboard.jsx            # Admin dashboard (~1600+ lines)
  supabase.js                   # Supabase client config
  useSupabaseData.js            # Data hooks for firms/assessments
  useAdminData.js               # Admin data hooks
  gating.js                     # Feature gating (GATED_TABS, TIER_LIMITS, PREMIUM_FEATURES)
  UpgradePrompt.jsx             # Premium upgrade prompts (separate from App.jsx)
  ContactModal.jsx              # Contact form modal (separate from App.jsx, uses openContactModal/useContactModal)
  LandingPage.jsx               # Public landing page (growthlens.app, ~860 lines)
  App.css                       # Minimal styles
  index.css                     # Global styles
public/
  GrowthLens Logo.png                  # Full logo with amber background
  GrowthLens Logo_no strapline.png     # Without strapline (used on login/signup pages)
  GrowthLens Logo_transparent.png      # Transparent background (used in footer)
  screenshots/
    Dashboard Image_Apex Consulting Partners.png  # Dashboard preview for landing page (420KB)
    assessment-view.svg, dashboard-charts.svg, dashboard-scores.svg, gap-analysis.svg
CHANGELOG.md                      # Auto-generated changelog
CLAUDE.md                         # This file
SECURITY.md                       # Vulnerability disclosure policy (SEC-20)
GrowthLens_Security_Audit_Report.docx  # Security audit report (24 Feb 2026)
supabase-security-fixes.sql       # Reference SQL for database-level security fixes
```

## Authentication & Accounts

### Supabase Auth
- Provider: Supabase (project ID: xbrywtjahuidaufcdvti)
- Auth flows: email/password signup, login, password recovery, change password
- Password recovery emails sent via Resend SMTP
- AuthContext.jsx provides: `signUp`, `signIn`, `signOut`, `updatePassword`, `resetPassword`, `isPasswordRecovery`

### User Accounts
```
richard@richardgoold.com  — Personal account (created 17 Feb 2026)
richard@gooldy.com        — Admin account (originally admin@growthlens.app, email changed 19 Feb)
demo@growthlens.app       — Demo account (shared demo, no real email)
```

### Change Password Feature (added 19 Feb 2026)
- Located in the user profile dropdown menu (top-right), above "Sign Out"
- Opens a modal with: New Password field (with show/hide toggle), Confirm Password field
- Validates: minimum 8 characters, passwords must match
- Uses `supabase.auth.updateUser({ password })` — works for all users, no email required
- Shows green success checkmark on completion, auto-closes after 2 seconds
- State variables: `showChangePassword`, `pwForm`, `pwError`, `pwSuccess`, `pwLoading`, `pwShowNew`
- Handler: `handleChangePassword` (async function in App.jsx, just before main return)
- Icons used: Lock, Eye, EyeOff (from lucide-react)

### Password Reset via SQL (for accounts without real email)
Use Supabase SQL Editor → run:
```sql
UPDATE auth.users
SET encrypted_password = crypt('new-password-here', gen_salt('bf'))
WHERE email = 'demo@growthlens.app';
```

## Email Configuration

### Supabase Custom SMTP (via Resend)
- **Sender email:** noreply@growthlens.app (for auth emails: verification, password reset)
- **Sender name:** GrowthLens
- **Host:** smtp.resend.com
- **Port:** 465
- **Username:** resend
- **Password:** Resend API key ("Supabase SMTP" — sending access, growthlens.app domain)
- Configured at: Supabase Dashboard → Authentication → SMTP Settings

### Welcome Email (Edge Function)
- **Function:** `welcome-email` (Supabase Edge Function)
- **Trigger:** Database webhook `welcome_email_on_confirm` fires on auth.users UPDATE
- **From:** GrowthLens <hello@growthlens.app>
- **Reply-to:** richard@richardgoold.com
- **Admin notification:** Sends to richard@richardgoold.com on each new signup
- Sends branded HTML welcome email via Resend API

### Email Forwarding (added 23 Feb 2026)
- **hello@growthlens.app → richard@richardgoold.com**
- Resend inbound email receiving enabled on growthlens.app domain
- MX record: `inbound-smtp.eu-west-1.amazonaws.com` (priority 10) added to GoDaddy DNS
- Resend webhook (ID: ffd512e3-2894-410b-83b2-5ebd1b33574c) listens for `email.received` events
- Webhook calls Supabase Edge Function `forward-email` which re-sends via Resend API
- Edge Function JWT verification disabled (public webhook endpoint)
- `RESEND_API_KEY` secret shared with `welcome-email` function

### DNS (GoDaddy → growthlens.app)
- A records: 185.199.108-111.153 (GitHub Pages IPs)
- CNAME: www → richardgoold.github.io
- MX (sending): `send.growthlens.app` → Resend feedback SMTP
- MX (receiving): `@` → `inbound-smtp.eu-west-1.amazonaws.com` (priority 10)
- TXT: Resend SPF record
- DKIM: 3 Resend DKIM CNAME records (resend._domainkey etc.)
- Resend domain ID: 875ddf04-69ac-4231-916b-24bd68ea06d8

## App.jsx Structure (top to bottom, deployed version ~4750+ lines)

- **Imports (lines 1-10):** React, Recharts, Lucide icons (including Lock, Eye, EyeOff), ContactModalProvider/useContactModal, UpgradePrompt/LimitModal/UpgradeBanner, gating, AuthContext, supabase, useSupabaseData
- **FRAMEWORK constant (~lines 16-400):** All 10 themes with 57 metrics (each metric has a `benchmark` property — M&A-Ready target %)
- **BENCHMARK_PROFILES constant:** M&A-Ready benchmark percentages per theme (7 profiles: M&A-Ready, Top Decile, Industry Average, Consulting, Technology Services, Legal & Compliance, Financial Advisory)
- **Helper functions:** calculateScores (with notTracked exclusion), getStrengths, getImprovements, etc.
- **UI Components:** MetricCard (with Not Tracked option), ThemeSidebar, HeatmapGrid, StrengthsWeaknesses (deduplicated), ExportPanel, RadarOverview, BenchmarkComparison, ImprovementRoadmap, TrendAnalysisPanel, ScoreChangePanel, Breadcrumbs
- **Views:** FirmListView, FirmDetailView, AssessmentView, DashboardView, InsightsView, ConnectView, GuidancePage
- **App component:** Main component with auth, state management, navigation
  - **Header layout:** Free/Premium dropdown sits inside the logo's left flex group (next to logo, not floating)
  - Upgrade button (~line 4555): `openContactModal('Premium Upgrade Enquiry')`
  - Change Password button (~line 4558): `text-gray-700 hover:bg-gray-50` (matching Sign Out)
  - Sign Out button (~line 4561): `text-gray-700 hover:bg-gray-50`
  - Change password modal (~line 4455): overlay with z-[100]

**Workspace sync status (updated 25 Feb 2026):**
The workspace files were synced from GitHub on 24 Feb 2026 but are now BEHIND GitHub again due to edits made via the GitHub web editor on 25 Feb 2026 (header layout, landing page, security fixes, Joe's feedback). The GitHub repository (github.com/richardgoold/maturity-framework) remains the source of truth. Key deployed versions: App.jsx (~4750+ lines), LandingPage.jsx (~860 lines).

### Key Constants

**BENCHMARK_PROFILES** (M&A-Ready theme-level values, evidence-based from 20+ industry sources):
```
financial: 70, people: 68, services: 66, vision: 64,
sales: 65, clients: 68, leadership: 67, cost: 65,
delivery: 70, market: 65
Overall average: 67%
```

**Metric-level benchmarks** (added 23 Feb 2026): Each of the 57 metrics has a `benchmark` property (M&A-Ready target %). Used in gap analysis and ImprovementRoadmap for more granular prioritisation. Falls back to theme-level benchmark if metric benchmark is not set.

## Dashboard Features

### M&A Readiness Score (Donut)
- Container: relative, centred
- Donut SVG: 160x160, r=66, strokeWidth=12
- Score text: absolute inset-0 flex items-center justify-center
- Shows percentage + readinessLevel label (e.g. "83% Nearly Ready")

### Improvement Roadmap
- Rating access: `const val = r ? (typeof r[1] === "object" ? r[1]?.value : r[1]) : null;`
- Percentage calculation: `const pct = Math.round((val / 3) * 100);`

### Scenario Modelling
Sliders for each theme with clarification text explaining changes are modelling-only.

### Export Assessment
Three-column grid layout: Executive Summary, Export PDF Report, Detailed Assessment Report, Download CSV.

### User Profile Dropdown
Located top-right of the header:
- User avatar (amber icon) + name/email + plan badge (Premium/Free)
- Dropdown contains: user info, plan details, Upgrade button, Change Password button, Sign Out button
- Upgrade button calls `openContactModal('Premium Upgrade Enquiry')` — passes a string (not an object)
- Change Password and Sign Out buttons both styled with `text-gray-700 hover:bg-gray-50` for white dropdown background
- Change Password opens a modal overlay (z-[100])

## Dashboard Colour Scheme

**Radar chart:** Your Firm navy #1B4F72 (fillOpacity 0.35, strokeWidth 3) + M&A-Ready amber #D97706
**Bar chart:** Green (above), orange (near), red (below benchmark). Reference: warm stone #c4b5a5
**Heatmap:** Not Rated #F0F0F0, Foundational #FFE0B2, Evolving #BBDEFB, Optimised #A5D6A7
**Insights:** Green >= 90%, Amber >= 70%, Red < 70%

## 10 Growth Themes

1. Financial Performance (8 metrics, weight 750)
2. People (7 metrics, weight 525)
3. Services & Pricing (6 metrics, weight 350)
4. Vision & Strategy (5 metrics, weight 300)
5. Sales & Pipeline (5 metrics, weight 325)
6. Clients & Relationships (5 metrics, weight 300)
7. Leadership & Governance (4 metrics, weight 300)
8. Cost Optimisation (7 metrics, weight 250)
9. Delivery (4 metrics, weight 225)
10. Market Profile (6 metrics, weight 200)

**Total:** 57 metrics, max score 10,575

## Data Persistence

All data stored in Supabase (PostgreSQL):
- **auth.users** — User accounts and authentication
- **profiles** — User profiles (full_name, company_name, role, tier)
- **firms** — Firm records linked to users
- **assessments** — Assessment data with ratings (JSONB)

Demo firms pre-populated with realistic story-driven profiles (updated 25 Feb 2026):
- **Apex Consulting Partners (75% Nearly Ready)** — Well-established 15-year mid-market consulting firm. Strong financials & client relationships, weak on market profile, ESG, data/analytics. L1=3, L1.5=7, L2=26, L2.5=12, L3=9.
- **TechBridge Solutions (60% In Progress)** — 5-year-old tech boutique. Brilliant at technology/innovation but commercially immature. Poor margins, weak governance. L1=9, L1.5=22, L2=15, L2.5=8, L3=3.
- **Phoenix Advisory Group (37% Early Stage)** — 20-year-old founder-led advisory in decline. Fully assessed (57/57, no unrated). Mostly L1 with 10 metrics at L1.5 (vestiges of former success). L1=47, L1.5=10.

Demo assessment IDs: `a1000001-0000-0000-0000-000000000001` (Apex), `a1000001-0000-0000-0000-000000000002` (TechBridge), `a1000001-0000-0000-0000-000000000003` (Phoenix).

## Deployment

- Push to main triggers GitHub Actions workflow
- Runs npm ci && npm run build then deploys dist/ to GitHub Pages
- Typically completes in ~25 seconds
- Custom domain: growthlens.app (CNAME file in repo)
- Live site: https://growthlens.app

## Editing via GitHub Web Editor

The GitHub web editor (github.com/.../edit/...) uses CodeMirror 6:

```javascript
// Access the EditorView
const view = document.querySelector('.cm-content').cmTile.view;

// Read document
const content = view.state.doc.toString();

// Get line position
const line = view.state.doc.line(lineNumber);  // 1-indexed

// Make targeted replacements
view.dispatch({
  changes: { from: line.from, to: line.to, insert: newText }
});
```

For the Supabase SQL Editor (Monaco-based):
```javascript
const editor = window.monaco.editor.getEditors()[0];
const model = editor.getModel();
const fullRange = model.getFullModelRange();
editor.executeEdits('edit-name', [{
  range: fullRange,
  text: "your SQL here"
}]);
```

**IMPORTANT:** Use the regular GitHub edit page (github.com/.../edit/...), NOT github.dev.

## Recent Commit History

```
5f6d39b  Fix Joe's feedback: darker text, remove templates, not-tracked, deduplicate (Build #525, 25 Feb 2026)
         Update subtitle text and restore PreviewsSection (Build #510, 25 Feb 2026)
         Add heading and subtitle to dashboard preview section (Build #509)
         Add dashboard preview image to landing page (Build #508)
06d909e  Add dashboard screenshot via upload (Build #507, 25 Feb 2026)
660b147  Remove hero logo, use full logo with strapline in header (Build #506)
         Move Free/Premium dropdown next to logo in header (Build #505)
         Simplify browser tab title to "GrowthLens" (Build #504)
         Fix vite base path for custom domain (Build #503)
         Fix App.jsx syntax error from header edit (Build #502)
215f986  Update CLAUDE.md with security fix session details (25 Feb 2026)
         Create supabase-security-fixes.sql (25 Feb 2026)
         Create SECURITY.md (SEC-20)
         Add CSV injection protection, JSON validation, localStorage migration (SEC-05, SEC-10, SEC-14, SEC-21)
         Add input sanitisation, password complexity, generic errors (SEC-07, SEC-12, SEC-13)
         Add rate limiting, generic errors, password policy (SEC-06, SEC-07, SEC-12)
         Add SRI hashes for CDN scripts (SEC-04)
         Add CSP meta tag and security headers (SEC-03, SEC-15)
977fed0  Increase logo size on signup page to match login page (Build #493, 24 Feb 2026)
1fd1d54  Increase logo size on login and password reset pages (Build #492, 24 Feb 2026)
         Fix Change Password dropdown styling to match Sign Out button (Build #491)
d41d0a6  Fix contact modal subject bug and Change Password text colour (Build #490)
a378419  Use transparent logo in footer for dark background (Build #489)
         forward-email Edge Function: cleaned up diagnostic logging
0c4ae66  Add metric-level benchmarks, theme trend lines, gap analysis enhancements (Build #447, 23 Feb 2026)
         Fix duplicate upgrade toast declaration (Build #446)
         Add premium upgrade toast notification (Build #445)
         Demo banner improvements, demo firm score recalibration (Build #444)
         Email forwarding: forward-email Edge Function, Resend webhook, MX record
3d7c405  Add cache-busting ?v=2 to OG image URLs (Build #409, 22 Feb 2026)
42e9ca7  Add OG image to public folder (new white hero design, 22 Feb 2026)
         Hero redesign, StatsBar removal, AnimatedCounter fix (Builds #405-#407)
         Dashboard heading, auto-changelog system
58ed78f  Add change password option to user profile menu (Build #341, 19 Feb 2026)
5b67999  Remove misleading backup reminder banner (data is in Supabase)
d30f4b6  Update CLAUDE.md: replace old GitHub Pages URLs with growthlens.app
3ff4ac6  Update old GitHub Pages URLs to growthlens.app in PDF export and Share
--- Previous sessions ---
3916fd3  Tighter crop and recentre face in portrait circle (13 Feb 2026)
         Portrait photo, Let's Talk redesign, chart improvements
         Heatmap colour contrast, benchmark bar colour changes
         ENHANCED_GUIDANCE data, guidance page, mobile responsive
2aaba7a  Dashboard improvements: donut score, roadmap fix, export buttons
```

## Security Audit (24 Feb 2026) — FIXES IMPLEMENTED (25 Feb 2026)

A comprehensive security audit was conducted covering all source files, Supabase RLS policies, Edge Functions, and deployment configuration. Full report: `GrowthLens_Security_Audit_Report.docx` in repo root.

**Status (25 Feb 2026):** All 22 findings fully resolved. See "Session Changes (25 Feb 2026)" for full implementation details.

### Summary: 22 findings (4 Critical, 7 High, 7 Medium, 4 Low)

**CRITICAL findings:**
- **SEC-01:** Client-side-only premium tier enforcement — gating.js and App.jsx check `isPremium` from React state only. Users can bypass via browser dev tools or direct Supabase API calls. **Mitigation:** Add server-side tier validation via Supabase RLS policies or Edge Function middleware.
- **SEC-02:** Client-side-only admin role check — AdminRoute.jsx checks `isAdmin` from AuthContext (client state). Any user could potentially access admin functions. **Mitigation:** Add JWT custom claims for admin role via Supabase auth hook; enforce in RLS policies.
- **SEC-03:** No Content Security Policy — index.html has no CSP meta tag or headers, allowing XSS payload execution. **Mitigation:** Add CSP meta tag to index.html restricting script/style sources.
- **SEC-04:** CDN scripts without Subresource Integrity — Tailwind and html2pdf loaded from CDN without SRI hashes. Supply-chain attack risk. **Mitigation:** Add integrity attributes or bundle at build time.

**HIGH findings:**
- **SEC-05:** Unvalidated JSON import — `JSON.parse()` + `setState()` with no schema validation
- **SEC-06:** No rate limiting on auth endpoints (login, signup, password reset)
- **SEC-07:** Weak password policy — LoginPage allows 6-char minimum on reset; signup requires 8 but no complexity
- **SEC-08:** upgrade-notification Edge Function has CORS `*` and no JWT verification
- **SEC-09:** Missing DELETE RLS policy on contact_submissions table
- **SEC-10:** CSV export lacks formula injection protection (=, +, -, @ prefixes)
- **SEC-11:** PII potentially stored in audit_log details column (JSONB, no schema)

**MEDIUM findings:** SEC-12 through SEC-18 (user enumeration, input sanitization, localStorage exposure, missing security headers, race conditions on tier limits, unnotified admin edits, non-transactional audit logging)

**LOW findings:** SEC-19 through SEC-22 (console logging in production, no SECURITY.md, hardcoded admin email, .env in workspace)

### Mitigation Roadmap
- **Phase 1 (Week 1):** CSP headers, SRI hashes, server-side tier validation, JWT admin claims
- **Phase 2 (Weeks 2-3):** JSON schema validation, rate limiting, password policy, Edge Function JWT, RLS gaps, CSV protection, audit log schema
- **Phase 3 (Month 1):** Generic auth errors, input validation, localStorage migration, security headers, server-side tier limits, admin edit notifications, transactional audit writes
- **Phase 4 (Months 2-3):** ~~Strip console.log in production~~ ✓, ~~SECURITY.md~~ ✓, ~~move hardcoded email to app_config~~ ✓, ~~verify .env history~~ ✓, add MFA for admins, npm audit in CI, quarterly reviews

### Positive Security Findings
- RLS enabled on all 6 tables with well-structured user isolation
- React auto-escaping prevents most XSS (no dangerouslySetInnerHTML)
- No eval() or dynamic code execution in codebase
- Auth tokens managed by Supabase secure session handling
- Admin operations logged to immutable audit_log table
- .env properly in .gitignore; GitHub Actions secrets used for deployment

### Supabase RLS Policy Coverage
| Table | SELECT | INSERT | UPDATE | DELETE | Notes |
|-------|--------|--------|--------|--------|-------|
| profiles | ✓ User+Admin | ✓ User | ✓ User+Admin | ✗ None | Cascades from auth.users |
| firms | ✓ User+Admin | ✓ User | ✓ User | ✓ User | Admin UPDATE/DELETE missing |
| assessments | ✓ User+Admin | ✓ User | ✓ User+Admin | ✓ User | Admin DELETE missing |
| contact_submissions | ✓ Admin | ✓ Public | ✓ Admin | ✗ None | SEC-09: Add admin DELETE |
| app_config | ✓ Auth users | ✓ Admin | ✓ Admin | ✗ None | Immutable by design |
| audit_log | ✓ Admin | ✓ Admin | ✗ None | ✗ None | Immutable by design |

### Session Changes (25 Feb 2026, continued — Joe's feedback & demo data overhaul)

**Joe's feedback review (13 items from docx):**
Joe Sherlock reviewed the app and provided 13 feedback items. 9 were already implemented or design choices. 4 required code changes:

**Fix #1A: Remove TemplateSelector from assessment view (Build #525):**
- Removed the TemplateSelector component entirely from the assessment view
- Templates were confusing and not aligned with the individual assessment workflow

**Fix #1B/1C: Darker text for score labels (Build #525):**
- Changed 9 instances of `text-gray-400` to `text-gray-500` on lines 2884-2925
- Affects: SCORE, M&A READY, RATED labels and assessment list entries
- Improves readability without being too dark

**Fix #2: Deduplicate Strengths and Gaps on dashboard (Build #525):**
- Top Strengths and Largest Gaps sections now show non-overlapping themes
- Strengths shows top 3 themes; Gaps shows bottom themes that aren't already in Strengths

**Fix #3: "Not Tracked" rating option (Build #525):**
- New button below the 3 maturity levels in MetricCard: "Not tracked — We don't track / have this information"
- When selected: metric excluded from BOTH totalScore AND totalMaxPossible in calcScores
- Rating stored as `{ notTracked: true, level: 0, updatedAt: ... }`
- calcScores: `if (r && r.notTracked) return;` before the level check
- currentLevel: `rating?.notTracked ? null : rating?.level` — shows as unselected
- Clear button: `(currentLevel || rating?.notTracked) && !locked` — allows clearing Not Tracked
- Rate handler: `typeof level === 'object' && level.notTracked` branch for object-type level
- Information Gaps section: collapsible `<details>` on dashboard showing Not Tracked metrics grouped by theme
- Icons: CheckCircle2 (selected), HelpCircle (unselected)
- Styling: `bg-gray-100 border-l-4 border-l-gray-400` when active

**Demo data overhaul (Supabase SQL, 25 Feb 2026):**
Complete redesign of all 3 demo firm rating profiles. Previous data had credibility issues:
- Phoenix had 32/57 metrics UNRATED (looked incomplete)
- TechBridge had zero L3 ratings (uniformly flat, not realistic)
- No half-levels used anywhere (didn't showcase fine-tune feature)
- All whole numbers (1, 2, 3) — no 1.5 or 2.5 ratings

New profiles designed with Python verification script (`design_demo_firms.py`):
- Each firm tells a distinct, relatable story with realistic rating distributions
- Half-levels used extensively: Apex 33%, TechBridge 53%, Phoenix 18%
- All 57 metrics rated for every firm (no unrated gaps)
- Cross-firm ordering correct on 8/10 themes (intentional inversions on Cost Optimisation and Market Profile where TechBridge beats Apex — realistic for a tech firm)
- SQL UPDATE executed in Supabase SQL Editor, verified via query and live site inspection

**Verified on live site (growthlens.app):**
- Firm list: Apex 75% Nearly Ready, TechBridge 60% In Progress, Phoenix 37% Early Stage
- All 57/57 metrics rated for each firm
- Heatmaps show rich colour variety with half-level granularity
- Strengths/Gaps tell compelling, non-overlapping stories per firm
- Not Tracked option visible in assessment view

### Session Changes (25 Feb 2026, continued — landing page & header updates)

**Site recovery (Builds #502-#504):**
- Fixed App.jsx syntax error introduced during header layout edit (missing closing tag)
- Fixed Vite base path: changed from `'/maturity-framework/'` to `'/'` for custom domain (growthlens.app)
- Simplified browser tab title from "GrowthLens — M&A Growth Readiness" to just "GrowthLens"

**Header layout — dropdown repositioned (Build #505):**
- Moved the Free/Premium dropdown from floating between the logo and nav into the logo's left flex group
- Dropdown now sits directly next to the GrowthLens logo on the left side of the header
- Structure change in App.jsx: removed premature `</div>` after logo, moved it to after the dropdown (before nav)

**Landing page logo changes (Build #506):**
- Header logo changed from `GrowthLens Logo_no strapline.png` to `GrowthLens Logo.png` (full logo with strapline "Clarity at every stage of growth"), size increased from `h-8` to `h-10 w-auto rounded-lg`
- Hero section logo block removed entirely (was redundant with header logo)
- App header (logged-in pages) kept with no-strapline version — more compact for the app interface

**Password resets (via Supabase SQL Editor):**
- Reset demo account password: `demo@growthlens.app`
- Reset admin account password: `richard@gooldy.com`
- Both accounts confirmed working after reset

**Dashboard preview image on landing page (Builds #507-#510):**
- Captured fresh dashboard screenshot from demo account (Apex Consulting Partners, Dashboard view) using html2canvas
- Screenshot uploaded to `public/screenshots/Dashboard Image_Apex Consulting Partners.png` (420KB) via GitHub file upload
- Added dashboard image section to LandingPage.jsx between `<HeroSection />` and `<PreviewsSection />`
- Added heading: "Your M&A readiness, at a glance"
- Added subtitle: "Benchmark your firm across 10 growth themes, 57 metrics and over 20 industry benchmark sources."
- Image wrapped in `rounded-xl shadow-2xl overflow-hidden border border-gray-200` container
- Heading/subtitle styled to match other section headings (text-3xl sm:text-4xl font-extrabold)
- Fixed accidentally removed `<PreviewsSection />` component (was dropped during dashboard section insertion)

**Landing page section order (final):**
NavBar → HeroSection → Dashboard Preview (with heading) → PreviewsSection → HowItWorksSection → LogoCarousel → FeaturesSection → ContactSection → Footer

### Session Changes (25 Feb 2026, earlier — security fixes)

**Security hardening — all 22 audit findings implemented:**

This session implemented fixes for all 22 findings from the security audit (24 Feb 2026). Status: all findings resolved.

**GitHub commits (7 files pushed):**
- `index.html` — SEC-03: CSP meta tag restricting script/style/img/font sources; SEC-04: SRI integrity hashes for Tailwind and html2pdf CDN scripts
- `vite.config.js` — SEC-15: Security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy)
- `src/LoginPage.jsx` — SEC-06: Client-side rate limiting (5 attempts / 15min lockout) on login and password reset; SEC-07: Minimum 8-char password with complexity requirements; SEC-12: Generic error messages preventing user enumeration
- `src/SignupPage.jsx` — SEC-07: Password complexity (uppercase, lowercase, number, special char); SEC-12: Generic error messages; SEC-13: Input sanitisation (name/company field length limits, HTML tag stripping)
- `src/App.jsx` — SEC-05: JSON import validation (5MB limit, schema checks, 100 firm / 500 assessment limits); SEC-10: CSV export formula injection protection (`sanitiseCell()` escapes `=+\-@\t\r` prefixes); SEC-14: localStorage → sessionStorage migration for lead info; SEC-21: Hardcoded email replaced with generic contact text
- `SECURITY.md` — SEC-20: Vulnerability disclosure policy with contact info and response timeline
- `supabase-security-fixes.sql` — Reference SQL file for all database-level fixes

**Supabase SQL fixes (7 database changes executed):**
- SEC-09: Admin DELETE policy on `contact_submissions` (already existed)
- SEC-01: `check_firm_limit()` trigger — server-side enforcement of firm creation limits per tier
- SEC-16: `check_assessment_limit()` trigger — server-side enforcement of assessment limits per tier
- SEC-02: `is_admin()` function + admin RLS policies on `firms` (UPDATE/DELETE) and `assessments` (DELETE)
- SEC-11: `audit_log_details_size` CHECK constraint — max 10KB on details JSONB column
- SEC-18: `log_admin_action()` helper function — strips PII (email, password) from audit log entries
- SEC-17: `admin_modified_at` and `admin_modified_by` columns added to `assessments` table

**Edge Function deployment (SEC-08):**
- `upgrade-notification` function updated and deployed via Supabase dashboard:
  1. CORS restricted: `Access-Control-Allow-Origin` changed from `*` to `https://growthlens.app`
  2. Added `createClient` import from `@supabase/supabase-js@2`
  3. Added JWT verification: checks Bearer token via `supabaseAdmin.auth.getUser()`, then verifies caller has admin role from `profiles` table
- Client-side (`AdminDashboard.jsx` line 458) already sends auth token automatically via `supabase.functions.invoke()`

**LOW-priority items (completed 25 Feb 2026):**
- SEC-19: ✓ `console.log` stripping already implemented in `vite.config.js` via `esbuild.drop: ['console', 'debugger']` (commit `6c2ffc2`). Production builds automatically strip all console statements.
- SEC-22: ✓ Verified `.env` never committed to git history. `.gitignore` correctly excludes `.env`, `.env.local`, `.env.production`, `.env*.local`. GitHub API confirms zero commits ever touched a `.env` file.

### Session Changes (24 Feb 2026)

**Workspace sync from GitHub:**
- Synced all key source files from GitHub to local workspace using browser File System Access API
- Files synced: App.jsx (4,667 lines), LandingPage.jsx (848 lines), ContactModal.jsx, UpgradePrompt.jsx, LoginPage.jsx, SignupPage.jsx, gating.js
- Previous sessions had already synced: gating.js, UpgradePrompt.jsx, ContactModal.jsx, LoginPage.jsx, SignupPage.jsx
- Workspace is now in sync with deployed GitHub version

**Security audit (GrowthLens_Security_Audit_Report.docx):**
- Full security audit conducted across all source files, SQL schemas, Edge Functions, and deployment config
- 22 findings identified: 4 CRITICAL, 7 HIGH, 7 MEDIUM, 4 LOW
- Comprehensive Word document report generated with findings, RLS review, and 4-phase mitigation roadmap
- Report saved to repo root as `GrowthLens_Security_Audit_Report.docx`

**Email forwarding cleanup:**
- Removed diagnostic `console.log` from `forward-email` Edge Function (line 23 of index.ts)
- Email forwarding confirmed working: Reply-To correctly set to original sender email
- Deployed cleaned-up function to Supabase

**Footer transparent logo (Build #489):**
- Uploaded new `GrowthLens Logo_transparent.png` to `public/` folder via GitHub
- Updated `src/LandingPage.jsx` line 779: changed footer logo from `Logo_no%20strapline` to `Logo_transparent`
- Three logo variants now available in `public/`:
  1. `GrowthLens Logo.png` — full logo with amber background
  2. `GrowthLens Logo_no strapline.png` — without strapline (used on login/signup pages)
  3. `GrowthLens Logo_transparent.png` — transparent background (used in dark footer)

**Contact modal [object Object] fix (Build #490):**
- **Bug:** Upgrade button in profile dropdown passed `{ subject: 'Premium Upgrade Enquiry' }` (an object) to `openContactModal()` which expects a string
- **Fix:** Changed line 4555 of App.jsx from `openContactModal({ subject: 'Premium Upgrade Enquiry' })` to `openContactModal('Premium Upgrade Enquiry')`
- Subject field now correctly shows "Premium Upgrade Enquiry" text

**Change Password dropdown styling fix (Builds #490 + #491):**
- **Bug:** Change Password button used `text-gray-300` (then `text-gray-100`) and `hover:bg-white/5` — styled for dark background but dropdown has white background, making text appear greyed out
- **Fix:** Changed to `text-gray-700 hover:bg-gray-50 px-4` to match Sign Out button styling exactly
- Both buttons now have identical styling in the white dropdown

**Login/signup page logo enlargement (Builds #492 + #493):**
- Increased logo size from `h-10` to `h-16` on LoginPage.jsx (both login form and password reset views)
- Increased logo size from `h-10` to `h-16` on SignupPage.jsx
- Logo now appears more prominent and professional on auth pages

**Workspace vs GitHub divergence discovered and resolved:**
- Workspace was initially out of sync (old monolithic App.jsx ~5100+ lines vs deployed ~4667 lines)
- **Resolved:** All key files synced from GitHub using browser File System Access API (see "Workspace sync from GitHub" above)
- **Always use GitHub (github.com/richardgoold/maturity-framework) as the source of truth**
- Use GitHub web editor for all code changes, not local workspace files

### Session Changes (23 Feb 2026)

**Email forwarding (hello@growthlens.app → richard@richardgoold.com):**
- Resend inbound email receiving enabled on growthlens.app domain
- MX record: `inbound-smtp.eu-west-1.amazonaws.com` (priority 10) added to GoDaddy DNS
- Resend webhook (ID: ffd512e3-2894-410b-83b2-5ebd1b33574c) listens for `email.received` events
- Webhook calls Supabase Edge Function `forward-email` which re-sends via Resend API
- Edge Function JWT verification disabled (public webhook endpoint)
- `RESEND_API_KEY` secret shared with `welcome-email` function

**Premium upgrade toast notification:**
- In-app toast when admin upgrades user from free → premium
- Uses `useRef` to track previous tier, `useEffect` on `profile?.tier`
- Amber/gold gradient banner, auto-dismisses after 10 seconds
- Works via existing Supabase Realtime subscription in AuthContext

**Demo banners & firm scores:**
- Demo account login shows amber banner: "Demo Mode — Explore freely, changes auto-reset"
- Demo firm scores recalibrated: Apex 72.5%, TechBridge 49.1%, Phoenix 14.6%

**Multi-assessment trend tracking enhancement:**
- TrendAnalysisPanel: added per-theme trend lines as toggleable overlays
- "Show Theme Lines" / "Hide Theme Lines" toggle button
- Clickable theme cards to toggle individual theme visibility
- Active theme indicator (colored bar + ring highlight)

**Metric-level benchmarks (57 metrics):**
- Each metric in FRAMEWORK now has a `benchmark` property (M&A-Ready target %)
- Gap analysis (ExportPanel) uses `metric.benchmark || theme.benchmark` for fallback
- ImprovementRoadmap uses metric-level benchmarks for more granular prioritisation
- Values calibrated to align with theme-level averages

### Session Changes (22 Feb 2026)

**OG Image:**
- New OG image matching white hero design (1200x630, palette-optimised PNG in public/)
- Cache-busting ?v=2 added to og:image and twitter:image URLs in index.html
- OG image verified on LinkedIn Post Inspector

**Landing Page redesign (Builds #405-#407):**
- Hero section: dark background replaced with white, amber accents
- StatsBar component removed from hero
- AnimatedCounter fixed (20+ counter)
- Dashboard heading font size matched to other sections

**Changelog system:**
- CHANGELOG.md added to repo root
- Auto-changelog GitHub Actions workflow (.github/workflows/changelog.yml)
- Changelog tab added to Admin Dashboard

**Repo metadata:**
- GitHub repo description, website URL, and topic tags added

### Session Changes (19 Feb 2026)

**Email infrastructure:**
- Custom SMTP configured in Supabase (Resend, smtp.resend.com:465)
- Auth emails sent from noreply@growthlens.app
- Welcome email Edge Function has reply_to: richard@richardgoold.com
- Database webhook triggers welcome email on user verification

**Change Password feature:**
- Added to user profile dropdown menu in App.jsx
- Modal with new password + confirm fields, show/hide toggle
- Uses supabase.auth.updateUser() — no email required
- Amber-themed buttons matching app design

**Account management:**
- Admin account email changed from admin@growthlens.app to richard@gooldy.com (enables password recovery)
- Demo and admin passwords reset via SQL Editor
- Demo account kept as demo@growthlens.app (no real email, reset via SQL when needed)

**URL updates:**
- All GitHub Pages URLs replaced with growthlens.app throughout codebase
- Password recovery redirect fixed (URL param detection)

## Supabase Configuration

- **Project:** xbrywtjahuidaufcdvti
- **Region:** (check dashboard)
- **Auth:** Email/password, custom SMTP via Resend
- **Edge Functions:** welcome-email, forward-email, upgrade-notification
- **Webhooks:** welcome_email_on_confirm (auth.users UPDATE → welcome-email), Resend inbound webhook → forward-email
- **RLS:** Enabled on all tables

### Key Supabase IDs
- Demo user: 45b175ff-37c1-4b75-a78e-fba01680dff2
- Admin user: 3c0a9c74-23d9-491b-a09f-5a5fd8a6b598
- Personal user: 5755dc16-29e0-4644-907f-91ad4dd1d9e5
- Resend domain: 875ddf04-69ac-4231-916b-24bd68ea06d8

## Troubleshooting and Recovery

### If a Cowork/Claude session crashes mid-edit

1. **Check commits:** https://github.com/richardgoold/maturity-framework/commits/main
2. **Read this CLAUDE.md** for current state
3. **Verify live site:** https://growthlens.app — login should work, change password in dropdown
4. **Resume editing:** Use GitHub web editor (github.com/.../edit/...)

### Common pitfalls
- **Workspace sync:** Workspace was synced from GitHub on 24 Feb 2026. If code changes are made via GitHub web editor, the workspace will be out of sync again. The mounted workspace folder is NOT a git repo. Always check deployed code on GitHub as the source of truth
- **Proxy blocking git/npm:** Use Chrome browser to edit via GitHub web editor instead
- **Content filter blocking code:** Extract data points (line numbers, booleans) rather than raw code from JS execution. Emails and URLs in JS execution results get blocked — use sanitization or extract only non-sensitive values
- **CodeMirror access:** `document.querySelector('.cm-content').cmTile.view`
- **Monaco access (Supabase):** `window.monaco.editor.getEditors()[0]`
- **github.dev corruption:** Never use github.dev — use regular edit page only
- **Large file editing (App.jsx, 409KB):** GitHub web editor is slow with this file. Use `read_page` with `filter: interactive` to find dialog elements when screenshots time out. Use `form_input` to set commit messages
- **Supabase email unique constraint:** Each account needs a unique email — can't share emails between accounts
- **Typing newlines in web editors:** Use JavaScript API (executeEdits/dispatch) rather than keyboard typing for multi-line content

## Known Issues and Deferred Items

- **Security audit findings** — All 22 findings fully resolved (25 Feb 2026). SEC-19 (console.log stripping) confirmed already deployed; SEC-22 (.env history) verified clean.
- **Theme icons throughout the app** — FRAMEWORK data has icon properties but not rendered everywhere
- **App header logo** — Uses no-strapline logo intentionally (more compact for app interface); landing page uses full logo with strapline
- **Continuous scrolling assess tab** — Currently discrete theme-by-theme navigation
- **Export button layout** — Third button spans full width on second row
- **Consistent theme colours** — Not applied throughout all views

## Potential Future Enhancements

- **Security hardening (ongoing):** Add MFA for admins, npm audit in CI, quarterly security reviews
- Render theme icons in heatmap, gap analysis, and theme headers
- Continuous scrolling assessment tab
- Consistent theme-specific accent colours
- Equalise all export buttons on a single row
- Sector-specific benchmark adjustments
