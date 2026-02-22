# GrowthLens (Maturity Framework)

## Project Overview

An M&A due diligence assessment platform (branded as **GrowthLens**) that evaluates professional services firms (PSFs) across 10 growth themes and 57 metrics, benchmarked against M&A-ready industry standards. Built as a React SPA with Supabase backend, deployed to GitHub Pages with a custom domain.

- **Repo:** richardgoold/maturity-framework
- **Live site:** https://growthlens.app (custom domain, was richardgoold.github.io/maturity-framework)
- **Owner:** Richard Goold (richard@richardgoold.com)
- **Latest commit:** 3d7c405 - "Add cache-busting ?v=2 to OG image URLs"
- **Last updated:** 22 February 2026

## Tech Stack

- React 19 + Vite
- Supabase (auth, database, Edge Functions)
- Tailwind CSS (via CDN in index.html)
- Recharts (radar charts, bar charts)
- Lucide React (icons)
- GitHub Pages deployment via GitHub Actions
- Custom domain: growthlens.app (GoDaddy DNS â GitHub Pages)
- Resend (transactional email via SMTP)
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
  App.jsx                      # Main application (~5100+ lines)
  AuthContext.jsx               # Supabase auth provider (signUp, signIn, signOut, updatePassword, resetPassword)
  LoginPage.jsx                 # Login form
  SignupPage.jsx                # Signup form
  ProtectedRoute.jsx            # Auth guard for routes
  AdminRoute.jsx                # Admin-only route guard
  AdminDashboard.jsx            # Admin dashboard (~1600+ lines)
  supabase.js                   # Supabase client config
  useSupabaseData.js            # Data hooks for firms/assessments
  useAdminData.js               # Admin data hooks
  gating.js                     # Feature gating (GATED_TABS, TIER_LIMITS, PREMIUM_FEATURES)
  UpgradePrompt.jsx             # Premium upgrade prompts
  ContactModal.jsx              # Contact form modal
  LandingPage.jsx               # Public landing page (growthlens.app)
  App.css                       # Minimal styles
  index.css                     # Global styles
CHANGELOG.md                      # Auto-generated changelog
CLAUDE.md                         # This file
```

## Authentication & Accounts

### Supabase Auth
- Provider: Supabase (project ID: xbrywtjahuidaufcdvti)
- Auth flows: email/password signup, login, password recovery, change password
- Password recovery emails sent via Resend SMTP
- AuthContext.jsx provides: `signUp`, `signIn`, `signOut`, `updatePassword`, `resetPassword`, `isPasswordRecovery`

### User Accounts
```
richard@richardgoold.com  â Personal account (created 17 Feb 2026)
richard@gooldy.com        â Admin account (originally admin@growthlens.app, email changed 19 Feb)
demo@growthlens.app       â Demo account (shared demo, no real email)
```

### Change Password Feature (added 19 Feb 2026)
- Located in the user profile dropdown menu (top-right), above "Sign Out"
- Opens a modal with: New Password field (with show/hide toggle), Confirm Password field
- Validates: minimum 8 characters, passwords must match
- Uses `supabase.auth.updateUser({ password })` â works for all users, no email required
- Shows green success checkmark on completion, auto-closes after 2 seconds
- State variables: `showChangePassword`, `pwForm`, `pwError`, `pwSuccess`, `pwLoading`, `pwShowNew`
- Handler: `handleChangePassword` (async function in App.jsx, just before main return)
- Icons used: Lock, Eye, EyeOff (from lucide-react)

### Password Reset via SQL (for accounts without real email)
Use Supabase SQL Editor â run:
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
- **Password:** Resend API key ("Supabase SMTP" â sending access, growthlens.app domain)
- Configured at: Supabase Dashboard â Authentication â SMTP Settings

### Welcome Email (Edge Function)
- **Function:** `welcome-email` (Supabase Edge Function)
- **Trigger:** Database webhook `welcome_email_on_confirm` fires on auth.users UPDATE
- **From:** GrowthLens <hello@growthlens.app>
- **Reply-to:** richard@richardgoold.com
- **Admin notification:** Sends to richard@richardgoold.com on each new signup
- Sends branded HTML welcome email via Resend API

### DNS (GoDaddy â growthlens.app)
- A records: 185.199.108-111.153 (GitHub Pages IPs)
- CNAME: www â richardgoold.github.io
- MX: Resend MX records for email sending
- TXT: Resend SPF record
- DKIM: 3 Resend DKIM CNAME records (resend._domainkey etc.)
- Resend domain ID: 875ddf04-69ac-4231-916b-24bd68ea06d8

## App.jsx Structure (top to bottom)

- **Imports:** React, Recharts, Lucide icons (including Lock, Eye, EyeOff)
- **FRAMEWORK constant (~lines 16-400):** All 10 themes with 57 metrics
- **BENCHMARKS constant:** M&A-Ready benchmark percentages per theme
- **Helper functions:** calculateScores, getStrengths, getImprovements, etc.
- **UI Components:** MetricCard, ThemeSidebar, HeatmapGrid, StrengthsWeaknesses, ExportPanel, RadarOverview, BenchmarkComparison, ImprovementRoadmap, TemplateSelector, Breadcrumbs
- **Views:** FirmListView, FirmDetailView, AssessmentView, DashboardView, InsightsView, ConnectView, GuidancePage
- **App component (~line 4644):** Main component with auth, state management, navigation
  - useAuth destructure includes `updatePassword`
  - Change password state and handler (~line 4940)
  - Change password modal (rendered inside main return, after opening div)
  - Profile dropdown menu with Change Password + Sign Out (~line 5000)

### Key Constants

**BENCHMARKS** (M&A-Ready values, evidence-based from 20+ industry sources):
```
financial: 70, people: 68, services: 66, vision: 64,
sales: 65, clients: 68, leadership: 67, cost: 65,
delivery: 70, market: 65
Overall average: 67%
```

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
- Dropdown contains: user info, plan details, Change Password button, Sign Out button
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
- **auth.users** â User accounts and authentication
- **profiles** â User profiles (full_name, company_name, role, tier)
- **firms** â Firm records linked to users
- **assessments** â Assessment data with ratings (JSONB)

Demo firms pre-populated: Apex Consulting Partners (72%), TechBridge Solutions (61%), Phoenix Advisory Group (40%).

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
- Uses supabase.auth.updateUser() â no email required
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
- **Edge Functions:** welcome-email
- **Webhooks:** welcome_email_on_confirm (auth.users UPDATE â welcome-email)
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
3. **Verify live site:** https://growthlens.app â login should work, change password in dropdown
4. **Resume editing:** Use GitHub web editor (github.com/.../edit/...)

### Common pitfalls
- **Proxy blocking git/npm:** Use Chrome browser to edit via GitHub web editor instead
- **Content filter blocking code:** Extract data points (line numbers, booleans) rather than raw code from JS execution
- **CodeMirror access:** `document.querySelector('.cm-content').cmTile.view`
- **Monaco access (Supabase):** `window.monaco.editor.getEditors()[0]`
- **github.dev corruption:** Never use github.dev â use regular edit page only
- **Supabase email unique constraint:** Each account needs a unique email â can't share emails between accounts
- **Typing newlines in web editors:** Use JavaScript API (executeEdits/dispatch) rather than keyboard typing for multi-line content

## Known Issues and Deferred Items

- **Theme icons throughout the app** â FRAMEWORK data has icon properties but not rendered everywhere
- **Continuous scrolling assess tab** â Currently discrete theme-by-theme navigation
- **Export button layout** â Third button spans full width on second row
- **Consistent theme colours** â Not applied throughout all views

## Potential Future Enhancements

- Render theme icons in heatmap, gap analysis, and theme headers
- Continuous scrolling assessment tab
- Consistent theme-specific accent colours
- Equalise all export buttons on a single row
- Add metric-level benchmarks
- Multi-assessment trend tracking
- Sector-specific benchmark adjustments
- Email forwarding for hello@growthlens.app (currently sending-only via Resend)
