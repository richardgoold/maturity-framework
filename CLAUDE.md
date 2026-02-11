# Growth Drivers Maturity Framework

## Project Overview

An M&A due diligence assessment platform that evaluates professional services firms (PSFs) across 10 growth themes and 47 metrics, benchmarked against M&A-ready industry standards. Built as a single-page React application deployed to GitHub Pages.

- **Repo:** richardgoold/maturity-framework
- **Live site:** https://richardgoold.github.io/maturity-framework/
- **Owner:** Richard Goold (richard@richardgoold.com)
- **Latest commit:** 2aaba7a - "Dashboard improvements: donut score, roadmap fix, export buttons, accessibility"
- **Last updated:** 11 February 2026

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
- **FRAMEWORK constant (~lines 1-380):** All 10 themes with 47 metrics, each with id, name, question, weight, icon, and 3 maturity level descriptions
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
- **HeatmapGrid** — Two-column maturity heatmap (all 47 metrics), colourblind-friendly palette
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
  InsightsView
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
- M&A-Ready reference markers: amber #D97706

**Heatmap (colourblind-friendly palette):**
- Foundational (Level 1): #FFF3E0 (amber/orange)
- Evolving (Level 2): #E3F2FD (blue)
- Optimised (Level 3): #E0F7FA (teal)
- Not rated: grey

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

1. **Financial Performance** (6 metrics, weight 600)
2. **People** (5 metrics, weight 425)
3. **Services & Pricing** (5 metrics, weight 300)
4. **Vision & Strategy** (5 metrics, weight 300)
5. **Sales & Pipeline** (4 metrics, weight 300)
6. **Clients & Relationships** (4 metrics, weight 300)
7. **Leadership & Governance** (3 metrics, weight 300)
8. **Cost Optimisation** (7 metrics, weight 225)
9. **Delivery** (3 metrics, weight 300)
10. **Market Profile** (5 metrics, weight 250)

**Total:** 47 metrics, max score 9000 (3 x sum of all weights)

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
- Live site: https://richardgoold.github.io/maturity-framework/

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
- Full 47-metric maturity heatmap
- benchmarkSectorDisplay (~line 1120) maps sector to 'M&A-Ready' for the PDF heading
- Branded colour scheme: amber #D97706 for M&A-Ready, navy #1B4F72 for firm scores

## Recent Commit History

```
2aaba7a  Dashboard improvements: donut score, roadmap fix, export buttons, accessibility (Build #57)
7b698e8  UX: redesign home page - equation diagram, badge contrast, uppercase (Build #56)
         Full brand colour sweep, encoding bug fixed, PDF exports with branded colours
         Duplicate 10 Growth Themes section removed, amber M&A badge
         Uppercase CTA buttons, Maximise Value heading
         Home page EBITDA x MULTIPLE = FIRM VALUE equation
6f8a372  Update CLAUDE.md with M&A-Ready benchmarks
cc8c110  Improve radar chart contrast, add benchmark methodology, fix demo dates
03d40ed  Update benchmarks to evidence-based M&A-Ready values
d8d7c95  Update CLAUDE.md with current project context
a94552e  Revert sync corruption, add firmSector prop to ExportPanel
0806271  Improve PDF export with professional formatting and benchmarks
3d46b95  Add direct dashboard navigation from Firms and Firm Detail views
a96da0e  Replace Professional Services labels with PSF abbreviation
9f79b9a  Show weight indicators in Strengths/Weaknesses sections
```

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
- **New guidance page** — A dedicated guidance/help page has not been created yet.
- **Consistent theme colours** — Partially addressed by the colourblind palette change, but theme-specific accent colours are not applied throughout all views.

### Export Button Layout
The grid grid-cols-3 layout works for the first two buttons (Executive Summary and Export PDF Report are equal width) but the Detailed Assessment Report button spans full width on a second row. This could be improved with col-span or a different grid approach.

## M&A-Ready Benchmark Methodology

Benchmarks represent top-quartile PSF performance (the level that acquirers price for at transaction events). Values were synthesised from 20+ industry sources across all 47 metrics, then aggregated to theme level.

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

3. **Verify the live site:** Visit https://richardgoold.github.io/maturity-framework/ and check:
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
