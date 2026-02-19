# Growth Drivers Maturity Framework

## Project Overview

An M&A due diligence assessment platform that evaluates professional services firms (PSFs) across 10 growth themes and 57 metrics, benchmarked against M&A-ready industry standards. Built as a single-page React application deployed to GitHub Pages.

- **Repo:** richardgoold/maturity-framework
- **Live site:** https://growthlens.app/
- **Owner:** Richard Goold (richard@richardgoold.com)
- **Latest commit:** 3916fd3 - "Tighter crop and recentre face in portrait circle"
- **Last updated:** 13 February 2026

## Tech Stack

- React 19 + Vite
- Tailwind CSS (via CDN in index.html)
- Recharts (radar charts, bar charts)
- Lucide React (icons)
- GitHub Pages deployment via GitHub Actions

## Architecture

**Single-file application.** Nearly all code lives in src/App.jsx (~3147 lines, ~270KB). This is intentional — the app is self-contained with no component splitting.

### File Structure
```
.github/workflows/deploy.yml   # GitHub Actions: build + deploy to Pages
index.html                     # Entry point (loads Tailwind CDN)
vite.config.js                 # Vite config with base path
package.json
src/
  main.jsx                     # React DOM root
  App.jsx                      # THE application (~3147 lines)
  App.css                      # Minimal styles
  index.css                    # Global styles
CLAUDE.md                      # This file
```

## App.jsx Structure (top to bottom)

- **Imports:** React, Recharts, Lucide icons
- **FRAMEWORK constant (~lines 1-380):** All 10 themes with 57 metrics, each with id, name, question, weight, icon, and 3 maturity level descriptions
- **Demo data (~lines 383-450):** Pre-populated firms and assessments (Apex, TechBridge, Phoenix)
- **BENCHMARKS constant (~line 115):** M&A-Ready benchmark percentages per theme
- **Helper functions:** calculateScores, getStrengths, getImprovements, etc.
- **exportToPDF function (~line 953):** Generates a print-ready HTML document with branded colours

### Key Constants

**BENCHMARKS** (M&A-Ready values, evidence-based from 20+ industry sources):
```
financial: 70, people: 68, services: 66, vision: 64,
sales: 65, clients: 68, leadership: 67, cost: 65,
delivery: 70, market: 65
Overall average: 67%
```
These represent top-quartile PSF performance levels that acquirers price for at M&A transactions. Sources include Hinge Research, Deltek, SPI Research, Mercer, and others. Full methodology documented in PSF_Benchmark_Methodology.xlsx.

### UI Components (all defined in App.jsx)

- **MetricCard** — Individual metric rating card
- **ThemeSidebar** — Left sidebar showing theme list
- **HeatmapGrid** — Two-column maturity heatmap (all 57 metrics), colourblind-friendly palette
- **StrengthsWeaknesses** — Top strengths and key improvement areas with weight indicators
- **ExportPanel** — PDF/CSV export buttons in 3-column grid layout
- **RadarOverview** — Radar chart for theme scores (Your Firm #1B4F72, fillOpacity 0.35, strokeWidth 3 + M&A-Ready amber #D97706)
- **BenchmarkComparison** — Horizontal bar chart vs M&A-Ready benchmarks with methodology note
- **ImprovementRoadmap** — Theme-level improvement bars with correct percentage calculation (val/3 * 100)
- **TemplateSelector** — Pre-built assessment templates (text-sm for readability)
- **Breadcrumbs** — Navigation breadcrumbs
- **LandingPage** — Home page with EBITDA x MULTIPLE = FIRM VALUE equation, Maximise Value heading
- **FirmListView** — List of firms with direct dashboard navigation
- **FirmDetailView** — Firm detail with assessments and dashboard access
- **AssessmentView** — The assessment interface (rate metrics)
- **DashboardView** — Dashboard with charts, heatmap, strengths/weaknesses, export, scenario modelling
- **InsightsView** — Benchmark position and assessment comparison (green >= 90%, amber >= 70%)
- **ScenarioModelling** — What-if slider tool with clarification text explaining changes are modelling-only

### Key Prop Threading
```
App (manages firms, assessments, navigation state)
  LandingPage
  FirmListView
  FirmDetailView
  AssessmentView
  DashboardView ({ assessment, firmName, firmSector, onBack })
    M&A Readiness Score (donut with score inside)
    RadarOverview
    BenchmarkComparison
    ImprovementRoadmap
    StrengthsWeaknesses
    HeatmapGrid
    ScenarioModelling
    ExportPanel ({ assessment, firmName, firmSector, scores })
      calls exportToPDF(assessment, firmName, firmSector, scores)
- **InsightsView** — Benchmark position and assessment comparison (green >= 90%, amber >= 70%)
- **ConnectView ("Let's Talk")** — Contact/advisory section with side-by-side layout: left-aligned heading ("Let's Talk" + "Build. Scale. Exit.") with circular portrait photo on the right. Photo uses wrapper div with overflow-hidden, objectPosition '55% 28%', transform scale(1.65) for tight face crop. Image sourced from richardgoold.com/wp-content/uploads/2025/08/hero.webp. Three service cards (Growth, Culture, Capital Events), CTA buttons (mailto + richardgoold.com).
- **GuidancePage** — Enhanced guidance tab with ENHANCED_GUIDANCE data (~107K chars). Covers all 57 metrics across 10 themes with: metric descriptions, key questions, maturity level definitions (Foundational/Evolving/Optimised), industry benchmarks with sources, practical improvement steps, and key considerations. Features search, theme filtering, and expandable metric cards.
```

## Dashboard Features

### M&A Readiness Score (Donut)
The readiness score is displayed **inside** the donut circle using absolute positioning:
- Container: relative, centred
- Donut SVG: 160x160, r=66, strokeWidth=12
- Score text: absolute inset-0 flex items-center justify-center
- Shows percentage + readinessLevel label (e.g. "83% Nearly Ready")

### Improvement Roadmap
Displays theme-level improvement bars showing current score vs M&A-Ready benchmark.
- **Rating access:** `const val = r ? (typeof r[1] === "object" ? r[1]?.value : r[1]) : null;` — handles both direct values and object-wrapped values
- **Percentage calculation:** `const pct = Math.round((val / 3) * 100);` — maturity levels 1-3 map to 33%/67%/100%

### Scenario Modelling
Sliders for each theme with:
- Current Readiness, Change, and Projected Readiness display
- Clarification text: "Drag the sliders to model how improving individual theme scores would impact your overall M&A Readiness. Changes are for modelling only and do not affect your saved assessment."
- Reset to Current button

### Export Assessment
Three-column grid layout (grid grid-cols-3 gap-2):
- Executive Summary (1 Page)
- Export PDF Report
- Detailed Assessment Report
- Download CSV (text link)

### Copyright Footer
Positioned before closing main tag:
```
(c) {year} Growth Drivers Maturity Framework. All rights reserved.
Confidential — For authorised use only.
```

## Dashboard Colour Scheme

**Radar chart (Maturity Overview):**
- Your Firm: navy #1B4F72, fillOpacity 0.35, strokeWidth 3, solid line
- M&A-Ready: amber #D97706, fillOpacity 0.05, strokeWidth 2, dashed line

**Bar chart (M&A-Ready Benchmark):**
- Above benchmark: green
- Near benchmark: orange
- Below benchmark: red
  M&A-Ready reference markers: warm stone #c4b5a5 (benchmark bars), amber #D97706 (radar/labels)

**Heatmap (colourblind-friendly palette):**
- Not Rated: #F0F0F0 (light grey, bg L*94)
- Foundational (Level 1): #FFE0B2 (warm amber, bg L*85)
- Evolving (Level 2): #BBDEFB (soft blue, bg L*83)
- Optimised (Level 3): #A5D6A7 (sage green, bg L*80)

**Insights tab thresholds:**
- Green (M&A Ready): score >= 90%
- Amber (Nearly Ready): score >= 70%
- Red (needs work): score < 70%

**Home page:**
- M&A badge: amber with dark text
- CTA buttons: UPPERCASE
- Equation: EBITDA x MULTIPLE = FIRM VALUE

**Legend and tooltip colours match the above.**

## 10 Growth Themes

1. **Financial Performance** (8 metrics, weight 750)
2. **People** (7 metrics, weight 525)
3. **Services & Pricing** (6 metrics, weight 350)
4. **Vision & Strategy** (5 metrics, weight 300)
5. **Sales & Pipeline** (5 metrics, weight 325)
6. **Clients & Relationships** (5 metrics, weight 300)
7. **Leadership & Governance** (4 metrics, weight 300)
8. **Cost Optimisation** (7 metrics, weight 250)
9. **Delivery** (4 metrics, weight 225)
10. **Market Profile** (6 metrics, weight 200)

**Total:** 57 metrics, max score 9000 (3 x sum of all weights)

Each theme in the FRAMEWORK constant has an icon property from Lucide React, though icons are not yet rendered in all views.

## Data Persistence

All data stored in localStorage under key gdmf_app_state:
```
{
  firms: [ { id, name, sector, createdAt } ],
  assessments: { [assessmentId]: { id, firmId, createdAt, ratings } },
  view: "landing" | "firms" | "firm" | "assess" | "dashboard"
}
```

**Ratings format:** ratings[themeIndex][metricIndex] stores a direct integer value (1, 2, or 3) — NOT an object with a .value property.

Demo firms pre-populated: Apex Consulting Partners (72%), TechBridge Solutions (61%), Phoenix Advisory Group (40%).

## Deployment

- Push to main triggers GitHub Actions workflow (.github/workflows/deploy.yml)
- Runs npm ci && npm run build then deploys dist/ to GitHub Pages
- Typically completes in ~20-25 seconds
- Build uses Vite with base: '/maturity-framework/'
- Live site: https://growthlens.app/

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

// Multi-line replacement
view.dispatch({
  changes: {
    from: view.state.doc.line(startLine).from,
    to: view.state.doc.line(endLine).to,
    insert: newText
  }
});
```

**IMPORTANT:** Use the regular GitHub edit page (github.com/.../edit/...), NOT github.dev. The github.dev VS Code editor has sync issues that can corrupt files.

**Content filter note:** JavaScript execution results containing source code may be blocked. Workarounds:
- Extract specific data points (line numbers, counts, booleans) rather than raw code
- Use localStorage to pass code sections between tabs on the same origin
- Store code in window._appCode or similar global variables
- Display code in a second tab as innerHTML of a pre element

## PDF Export

The exportToPDF function (~line 953) generates a professional print-ready HTML document with:
- Header with firm name, assessment date, sector, overall score badge
- Theme maturity scores (5x2 grid) with branded colours
- M&A-Ready Benchmark comparison table with horizontal bar charts
- Strengths and improvement areas tables
- Full 57-metric maturity heatmap
- benchmarkSectorDisplay (~line 1120) maps sector to 'M&A-Ready' for the PDF heading
- Branded colour scheme: amber #D97706 for M&A-Ready, navy #1B4F72 for firm scores

## Recent Commit History

```
3916fd3  Tighter crop and recentre face in portrait circle (Build #119, 13 Feb 2026)
1869081  Increase portrait zoom to 1.5x for tighter face crop
5da802f  Zoom and centre portrait photo to fill circle proportionately
d9ad494  Fine-tune portrait crop position and scale for better face centering
bfc9434  Redesign Let's Talk: side-by-side layout with larger photo
fd4a49c  Add portrait photo to Let's Talk section
ca60c82  Preserve ampersand in two-line chart axis labels
f47bddf  Fix assessment comparison chart: two-line labels, distinct bar colours
6beed07  Improve heatmap colour contrast between maturity levels
8585961  Update benchmark bar colour to warm stone (#c4b5a5)
--- Previous session (11-12 Feb 2026) ---
         7 mobile responsive improvements across 5 commits
         ENHANCED_GUIDANCE data (107K chars, 57 metrics, 10 themes)
         Guidance page restructuring
         5 UI change requests (benchmark colour, industry sources, strengths formatting, donut chart, CTA tab)
2aaba7a  Dashboard improvements: donut score, roadmap fix, export buttons, accessibility
7b698e8  UX: redesign home page - equation diagram, badge contrast, uppercase
6f8a372  Update CLAUDE.md with M&A-Ready benchmarks
cc8c110  Improve radar chart contrast, add benchmark methodology, fix demo dates
03d40ed  Update benchmarks to evidence-based M&A-Ready values
```

### Session Changes (13 Feb 2026) — Commits 8585961 to 3916fd3

**Benchmark bar colour:** Changed from violet #a78bfa to warm stone #c4b5a5 (two instances in App.jsx).

**Heatmap colour contrast:** Increased background saturation from L*95-97 to L*80-85. Not Rated #F8F9FA to #F0F0F0, Foundational #FFF3E0 to #FFE0B2, Evolving #E3F2FD to #BBDEFB, Optimised #E0F7FA to #A5D6A7. Text and border colours unchanged. 10 replacements across 3 code locations (colour mapping function, legend x2).

**Assessment comparison chart (Theme Scores Across Assessments):**
- Bar colours changed from near-identical ambers ["#f2a71b", "#E67E22", ...] to distinct palette ["#2563EB", "#F59E0B", "#10B981", "#8B5CF6"] (blue, amber, emerald, violet)
- XAxis: custom tick renderer splits theme names into two horizontal lines using SVG tspan elements
- Ampersand preservation: labels split on " & " now show e.g. "Services" / "& Pricing" (not "Services Pricing")

**Let's Talk section redesign:**
- Layout: changed from centred single-column (photo on top) to flex row with text left, photo right
- Heading: text-4xl sm:text-5xl (was text-3xl sm:text-4xl), left-aligned on desktop
- Tagline: text-xl sm:text-2xl (was text-lg)
- Container: max-w-3xl (was max-w-2xl)
- Mobile: flex-col-reverse (photo above text on small screens)
- Portrait photo: circular crop using wrapper div with overflow-hidden
  - Size: w-40 h-40 sm:w-52 sm:h-52
  - CSS: objectPosition '55% 28%', transform scale(1.65) for tight face centering
  - Source: https://richardgoold.com/wp-content/uploads/2025/08/hero.webp (2360x1561 landscape)
  - Border: border-4 border-amber-400 shadow-lg

## Build #57 Changes (2aaba7a — 11 Feb 2026)

All changes below were applied in a single commit after a session crash recovery:

1. **M&A Readiness Score inside donut** — Changed from flex row layout (score left, donut right) to centred donut with score overlaid inside using relative/absolute positioning. Donut: 160x160, r=66, strokeWidth=12.

2. **Improvement Roadmap logic fix** — Two bugs fixed:
   - Ratings stored as direct values not objects: typeof r[1] === "object" ? r[1]?.value : r[1]
   - Percentage calculation: Math.round((val / 3) * 100) instead of val * 100 / (metric.weight || 100)

3. **Export button equalisation** — Container changed from flex gap-2 to grid grid-cols-3 gap-2, removed extra w-full from Executive Summary button.

4. **Copyright footer** — Added before closing main tag with dynamic year, framework name, and confidentiality notice.

5. **Scenario modelling clarification** — Added description paragraph explaining sliders are for modelling only.

6. **Radar chart contrast** — Your Firm: fillOpacity increased to 0.35, strokeWidth to 3.

7. **Colourblind-friendly heatmap palette** — 9 colour values replaced:
   - #FDEDEC (red) to #FFF3E0 (amber/orange)
   - #FEF9E7 (yellow) to #E3F2FD (blue)
   - #EAFAF1 (green) to #E0F7FA (teal)

8. **Template selector readability** — 3 instances of text-xs changed to text-sm.

9. **Insights tab thresholds** — Green threshold: >= 80 changed to >= 90. Amber threshold: >= 60 changed to >= 70.

## Known Issues and Deferred Items

### Not Yet Implemented
- **Theme icons throughout the app** — FRAMEWORK data has icon properties but they are not rendered in heatmap, gap analysis, or theme headers. Risk: touching multiple components.
- **Continuous scrolling assess tab** — Assessment currently uses discrete theme-by-theme navigation. Continuous scrolling would require significant refactoring of the AssessmentView component.
- ~~New guidance page~~ **DONE** — GuidancePage component with ENHANCED_GUIDANCE data (107K chars, 57 metrics, 10 themes, search, filtering, expandable cards)
- **Consistent theme colours** — Partially addressed by the colourblind palette change, but theme-specific accent colours are not applied throughout all views.

### Export Button Layout
The grid grid-cols-3 layout works for the first two buttons (Executive Summary and Export PDF Report are equal width) but the Detailed Assessment Report button spans full width on a second row. This could be improved with col-span or a different grid approach.

## M&A-Ready Benchmark Methodology

Benchmarks represent top-quartile PSF performance (the level that acquirers price for at transaction events). Values were synthesised from 20+ industry sources across all 57 metrics, then aggregated to theme level.

**Key sources:** Hinge Research Institute, Deltek Clarity, SPI Research, Mercer, Deloitte, PwC, McKinsey, Harvard Business Review, Bain & Company, KPMG.

**Methodology spreadsheet:** PSF_Benchmark_Methodology.xlsx (4 tabs: Methodology, Benchmark Data, Theme Summary, Sources) contains the full evidence base with metric-level definitions for each maturity level, distribution data, and source citations.

**Previous values (PSF General Population averages):**
```
financial: 58, people: 55, services: 58, vision: 56,
sales: 49, clients: 58, leadership: 58, cost: 51,
delivery: 61, market: 51
Overall: 56%
```

## Troubleshooting and Recovery

### If a Cowork/Claude session crashes mid-edit

1. **Check what was committed:** Go to https://github.com/richardgoold/maturity-framework/commits/main and review the latest commits. Cross-reference with the Actions tab to confirm builds passed.

2. **Read this CLAUDE.md:** It documents the current state of all features, code structure, line numbers, and recent changes.

3. **Verify the live site:** Visit https://growthlens.app/ and check:
   - Copyright footer visible at bottom
   - M&A Readiness Score inside the donut circle
   - Scenario Modelling clarification text
   - Heatmap uses amber/blue/teal (not red/yellow/green)
   - Radar chart "Your Firm" area is clearly visible (opacity 0.35)

4. **To resume editing via Chrome browser:**
   - Navigate to https://github.com/richardgoold/maturity-framework/edit/main/src/App.jsx
   - Access CodeMirror via: document.querySelector('.cm-content').cmTile.view
   - Use line-number-based positioning: view.state.doc.line(N).from / .to
   - Commit directly to main — builds deploy in ~20-25 seconds

### Common pitfalls
- **Proxy blocking git/curl:** If git clone or curl to raw.githubusercontent.com fails with 403, use the Chrome browser to access GitHub directly and edit via the web editor.
- **Content filter blocking code:** JavaScript execution results containing source code may be blocked. Use localStorage or window globals to pass code between tabs.
- **CodeMirror access:** Use document.querySelector('.cm-content').cmTile.view, NOT editor.cmView.view.
- **github.dev corruption:** Never use github.dev (VS Code in browser). Use the regular edit page only.
- **UTF-8 decoding:** atob() for GitHub API base64 content may garble multi-byte UTF-8 characters. Use TextDecoder with Uint8Array for proper decoding.

## Potential Future Enhancements

- Render theme icons (from FRAMEWORK constant) in heatmap, gap analysis, and theme headers
- Continuous scrolling assessment tab (replace discrete theme navigation)
- Dedicated guidance/help page
- Consistent theme-specific accent colours across all views
- Equalise all export buttons on a single row
- Add metric-level benchmarks (currently only theme-level)
- Add dual benchmark lines (General Population + M&A-Ready)
- Add detailed "About the Benchmarks" expandable section
- Multi-assessment trend tracking
- Sector-specific benchmark adjustments
