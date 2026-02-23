# GrowthLens Changelog

All notable changes to the GrowthLens platform are documented here.

---

## [Build #441] — 23 February 2026
### Changes
- Show demo firms to all authenticated users

---


## [Build #440] — 23 February 2026
### Changes
- Fix garbled UTF-8 characters in score legend

---


## [Build #439] — 23 February 2026
### Changes
- Fix AnimatedCounter: use ref instead of state to prevent re-render loop

---


## [Build #438] — 23 February 2026
### Changes
- Update upgrade email: features now active in real-time

---


## [Build #437] — 23 February 2026
### Changes
- Add in-app toast notification for premium upgrade via realtime

---


## [Build #436] — 23 February 2026
### Changes
- Remove extra closing div from GapAnalysisPanel
- Fix missing closing div tags in ReadinessScoreBanner and GapAnalysisPanel
- Fix scoring algorithm, single-firm model, UI improvements (fixed JSX)

---


## [Build #433] — 23 February 2026
### Changes
- Revert App.jsx to last working build (afc4fa2) to fix broken deploy
- Add 2 missing closing div tags in ReadinessScoreBanner
- Fix unclosed p tag and div structure in ReadinessScoreBanner
- Add multi-user firm access implementation plan
- Add upgrade-notification Edge Function for premium tier emails
- Fix scoring algorithm, single-firm model, UI improvements from user feedback

---


## [Build #427] — 23 February 2026
### Changes
- Add upgrade notification email trigger on tier change to premium

---


## [Build #426] — 23 February 2026
### Changes
- Add real-time tier sync via Supabase Realtime subscription

---


## [Build #425] — 23 February 2026
### Changes
- Use isDemo DB flag instead of hardcoded name matching for firm limit

---


## [Build #424] — 23 February 2026
### Changes
- Include is_demo flag in firm data mapping

---


## [Build #423] — 23 February 2026
### Changes
- Filter out demo firms and assessments from admin dashboard

---


## [Build #422] — 23 February 2026
### Changes
- Remove system email filter that was hiding all firms from admin

---


## [Build #421] — 22 February 2026
### Changes
- Revert dropdown to absolute positioning, use inline z-index on header for stacking

---


## [Build #420] — 22 February 2026
### Changes
- Fix dropdown: use fixed positioning with inline styles to escape stacking context

---


## [Build #419] — 22 February 2026
### Changes
- Fix header z-index stacking so dropdown paints above content area

---


## [Build #418] — 22 February 2026
### Changes
- Fix profile dropdown translucent background for better readability

---


## [Build #417] — 22 February 2026
### Changes
- Fix mismatched closing tag in locked banner upgrade button
- Wire upgrade links to contact form, add 7-day time-based lock

---


## [Build #415] — 22 February 2026
### Changes
- Fix em dash rendering in free plan assessment limit banner

---


## [Build #414] — 22 February 2026
### Changes
- Fix JSX fragment close in FirmDetailView assessment limit
- Fix firm creation UUID, add free tier assessment limits and locking

---


## [Build #412] — 22 February 2026
### Changes
- Add detailed overhead cost categories to Overhead Ratio guidance

---


## [Build #411] — 22 February 2026
### Changes
- Fix firm limit gating: exclude demo firms by name for Supabase UUIDs

---


## [Build #410] — 22 February 2026
### Changes
- Update CLAUDE.md with 22 Feb session changes

---


## [Build #409] — 22 February 2026
### Changes
- Add cache-busting ?v=2 to OG image URLs

---


## [Build #408] — 22 February 2026
### Changes
- Add files via upload

---


## [Build #407] — 21 February 2026
### Changes
- Match dashboard heading font size to other section headings

---


## [Build #406] — 21 February 2026
### Changes
- Animate 20+ counter and add dashboard section heading

---


## [Build #405] — 21 February 2026
### Changes
- Redesign hero to white background with amber accents, move stats into hero

---


## [Build #404] — 21 February 2026
### Changes
- Add auto-changelog GitHub Actions workflow
- Add Changelog tab to Admin Dashboard
- Add CHANGELOG.md with backfilled milestones (Feb 14-21)
- QA polish: firm limit messaging, nav breakpoint, premium tab tooltips, tighter FirmDetail spacing
- Fix 10 metric audit issues: levels, questions, actions, currency
- Fix 9 metric questions: correct 5 mismatched, add 2 missing, align 2 minor
- Contact: match portrait exactly to in-app contact page (w-32, same image)
- Contact: Favikon badge inline with buttons, enlarge portrait
- Contact: two-column layout, fix portrait crop, bio left form right
- Contact: match in-app layout with portrait, bio, Website/LinkedIn buttons, Favikon badge
- Add files via upload
- Contact: amber ring portrait, strapline, Favikon purple hexagon badge
- Contact section: split layout with portrait, credentials and Favikon badge
- Carousel: bigger gap below stats, scale up WeShape logo
- Carousel: add separator gap, enlarge logo cards to 170x95

---


## [Build #401] — 21 February 2026
### QA Polish & Metric Audit
- **Fixed 10 metric audit issues** across Financial Performance, People, Services & Pricing, Sales & Pipeline, Clients & Relationships, and Market Profile themes — corrected question wording, rating labels, and descriptions to match assessment framework
- **Fixed 9 metric question errors** identified in QA review — ensured all 57 metrics have accurate, unambiguous question text
- **Updated firm limit messaging** — free plan badge and banner now clearly state "Free plan — 1 firm of your own" with explanation of demo firms
- **Improved nav responsiveness** — changed breakpoint from `md` to `lg` so hamburger menu activates on medium-width screens, preventing nav wrapping
- **Enhanced premium tab tooltips** — gated dashboard tabs (Roadmap, Scenarios, Export & Reports) now show "available with Premium" on hover
- **Tightened FirmDetailView spacing** — reduced padding, margins, and button sizes for a more compact layout

---

## [Build #395] — 20 February 2026
### Carousel Redesign & Visual Polish
- **Redesigned partner carousel** — dark background, larger logos, improved separator gap between carousel and hero section
- **Added Favikon badge** to landing page social proof section
- **Updated contact section layout** — improved spacing and alignment
- **Portrait photo matching** — refined portrait circle crop and positioning to match site branding

---

## [Build #380] — 19 February 2026
### Email Infrastructure & Account Management
- **Configured custom SMTP** via Resend for all auth emails (verification, password reset) from `noreply@growthlens.app`
- **Built welcome email Edge Function** — sends branded HTML welcome email to new users on verification, plus admin notification to site owner
- **Added Change Password feature** — accessible from user profile dropdown, modal with validation and show/hide toggle
- **Admin account email updated** from `admin@growthlens.app` to `richard@gooldy.com` to enable password recovery
- **3C Filled Glass logo** — replaced previous logo throughout the app with refined version
- **Benchmark tagline** added to dashboard header
- **Landing page counter** — added live user/assessment count to landing page
- **ISS-013 pricing structure** integrated into premium tier configuration

---

## [Build #350] — 18 February 2026
### Supabase Integration & Custom Domain
- **Wired up Supabase data layer** — all firms, assessments, and profiles now persist to Supabase (PostgreSQL) with Row Level Security
- **Custom domain live** — `growthlens.app` configured via GoDaddy DNS → GitHub Pages, replacing `richardgoold.github.io/maturity-framework`
- **Password reset flow** — implemented via Supabase Auth with recovery link emails
- **Email verification** — new signups require email confirmation before access
- **Profile dropdown** — user avatar, name, email, plan badge, and sign-out in top-right header
- **Contact view** built — in-app contact form with message submission
- **How It Works** section added to landing page
- **Score thresholds** — colour-coded readiness levels (green ≥90%, amber ≥70%, red <70%)
- **GrowthLens rebrand** — renamed from "Maturity Framework" throughout the codebase and UI

---

## [Build #320] — 17 February 2026
### Landing Page & Public-Facing Features
- **Landing page redesigned** with hero section, feature highlights, and call-to-action
- **Lead capture form** — email collection on landing page for interested prospects
- **Favicon & PWA manifest** — app icon and Progressive Web App support added
- **Free tier firm limit** — free accounts limited to 1 user-created firm plus 3 demo firms
- **Demo firms pre-populated** — Apex Consulting Partners (72%), TechBridge Solutions (61%), Phoenix Advisory Group (40%)
- **PDF export** — generate downloadable PDF assessment reports
- **Carousel partner logos** — rotating logo display on landing page

---

## [Build #290] — 16 February 2026
### Admin Dashboard & Phase 3
- **Admin Dashboard (Phase 3)** — full admin panel with Overview, Users, Firms, Contacts, Settings, and Audit Log sections
- **AdminRoute guard** — route protection for admin-only pages
- **useAdminData hook** — centralised data fetching for admin views
- **Contact tab** — in-app messaging system between users and admin
- **Supabase data layer foundations** — `useSupabaseData.js` hook for firm and assessment CRUD operations
- **Portrait and carousel** initial implementation on landing page

---

## [Build #250] — 15 February 2026
### Freemium Gating & Phase 2
- **Freemium gating system (Phase 2)** — `gating.js` with `GATED_TABS`, `TIER_LIMITS`, and `PREMIUM_FEATURES` constants
- **Upgrade prompts** — `UpgradePrompt.jsx` modal shown when free users access premium features
- **Nav badges** — visual indicators for premium-only sections
- **Contact modal** — `ContactModal.jsx` for user inquiries
- **Language unification** — standardised terminology across all 57 metrics and 10 themes

---

## [Initial Release] — 14 February 2026
### Core Platform
- **10 growth themes, 57 metrics** — comprehensive M&A readiness assessment framework for professional services firms
- **Assessment workflow** — theme-by-theme metric rating with 3-level scale (Foundational, Evolving, Optimised)
- **Dashboard views** — radar chart, bar chart, heatmap, gap analysis, improvement roadmap, scenario modelling
- **M&A-Ready benchmarks** — evidence-based benchmark percentages across all themes (overall average 67%)
- **React SPA** with Vite, Tailwind CSS, Recharts, and Lucide icons
- **GitHub Pages deployment** via GitHub Actions CI/CD pipeline
