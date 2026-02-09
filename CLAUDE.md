# Growth Drivers Maturity Framework

## Project Overview

An M&A due diligence assessment platform that evaluates professional services firms (PSFs) across 10 growth themes and 47 metrics, benchmarked against M&A-ready industry standards. Built as a single-page React application deployed to GitHub Pages.

- **Repo:** richardgoold/maturity-framework
- **Live site:** https://richardgoold.github.io/maturity-framework/
- **Owner:** Richard Goold (richard@richardgoold.com)
- **Latest commit:** cc8c110 - "Improve radar chart contrast, add benchmark methodology, fix demo dates"
- **Last updated:** 9 February 2026

## Tech Stack

- React 19 + Vite
- Tailwind CSS (via CDN in index.html)
- Recharts (radar charts, bar charts)
- Lucide React (icons)
- GitHub Pages deployment via GitHub Actions

## Architecture

**Single-file application.** Nearly all code lives in src/App.jsx (~2169 lines, ~182KB). This is intentional - the app is self-contained with no component splitting.

### File Structure

```
.github/workflows/deploy.yml   # GitHub Actions: build + deploy to Pages
index.html                      # Entry point (loads Tailwind CDN)
vite.config.js                  # Vite config with base path
package.json
src/
  main.jsx                      # React DOM root
  App.jsx                       # THE application (~2169 lines)
  App.css                       # Minimal styles
  index.css                     # Global styles
CLAUDE.md                       # This file
```

## App.jsx Structure (top to bottom)

- **Imports:** React, Recharts, Lucide icons
- **FRAMEWORK constant (~lines 1-380):** All 10 themes with 47 metrics, each with id, name, question, weight, and 3 maturity level descriptions
- **Demo data (~lines 383-450):** Pre-populated firms and assessments (Apex, TechBridge, Phoenix)
- **BENCHMARKS constant (~line 115):** M&A-Ready benchmark percentages per theme
- **Helper functions:** calculateScores, getStrengths, getImprovements, etc.
- **exportToPDF function (~line 953):** Generates a print-ready HTML document

### Key Constants

**BENCHMARKS** (M&A-Ready values, evidence-based from 20+ industry sources):
```
financial: 70, people: 68, services: 66, vision: 64, sales: 65,
clients: 68, leadership: 67, cost: 65, delivery: 70, market: 65
Overall average: 67%
```

These represent top-quartile PSF performance levels that acquirers price for at M&A transactions. Sources include Hinge Research, Deltek, SPI Research, Mercer, and others. Full methodology documented in PSF_Benchmark_Methodology.xlsx.

### UI Components (all defined in App.jsx)

- **MetricCard** - Individual metric rating card
- **ThemeSidebar** - Left sidebar showing theme list
- **HeatmapGrid** - Two-column maturity heatmap (all 47 metrics)
- **StrengthsWeaknesses** - Top strengths and key improvement areas with weight indicators
- **ExportPanel** - PDF/CSV export buttons
- **RadarOverview** - Radar chart for theme scores (Your Firm navy #1B4F72 + M&A-Ready amber #D97706)
- **BenchmarkComparison** - Horizontal bar chart vs M&A-Ready benchmarks with methodology note
- **TemplateSelector** - Pre-built assessment templates
- **Breadcrumbs** - Navigation breadcrumbs
- **LandingPage** - Home page
- **FirmListView** - List of firms with direct dashboard navigation
- **FirmDetailView** - Firm detail with assessments and dashboard access
- **AssessmentView** - The assessment interface (rate metrics)
- **DashboardView** - Dashboard with charts, heatmap, strengths/weaknesses, export

### Key Prop Threading

```
App (manages firms, assessments, navigation state)
  DashboardView ({ assessment, firmName, firmSector, onBack })
    RadarOverview
    BenchmarkComparison
    StrengthsWeaknesses
    HeatmapGrid
    ExportPanel ({ assessment, firmName, firmSector, scores })
      calls exportToPDF(assessment, firmName, firmSector, scores)
```

## Dashboard Colour Scheme

**Radar chart (Maturity Overview):**
- Your Firm: navy #1B4F72, fillOpacity 0.3, strokeWidth 2, solid line
- M&A-Ready: amber #D97706, fillOpacity 0.05, strokeWidth 2, dashed line

**Bar chart (M&A-Ready Benchmark):**
- Above benchmark: green
- Near benchmark: orange
- Below benchmark: red
- M&A-Ready reference markers: amber #D97706

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

## Data Persistence

All data stored in localStorage under key `gdmf_app_state`:
```
{
  firms: [ { id, name, sector, createdAt } ],
  assessments: { [assessmentId]: { id, firmId, createdAt, ratings } },
  view: "landing" | "firms" | "firm" | "assess" | "dashboard"
}
```

Demo firms pre-populated: Apex Consulting Partners (72%), TechBridge Solutions (61%), Phoenix Advisory Group (40%).

## Deployment

- Push to main triggers GitHub Actions workflow (.github/workflows/deploy.yml)
- Runs npm ci && npm run build then deploys dist/ to GitHub Pages
- Typically completes in ~20-25 seconds
- Build uses Vite with base: '/maturity-framework/'

## Editing via GitHub Web Editor

The GitHub web editor (github.com/.../edit/...) uses CodeMirror 6:

```javascript
// Access the EditorView
const view = document.querySelector('.cm-content').cmTile.view;

// Read document
const content = view.state.doc.toString();

// Make targeted replacements
view.dispatch({
  changes: { from: startPos, to: endPos, insert: newText }
});
```

**IMPORTANT:** Use the regular GitHub edit page (github.com/.../edit/...), NOT github.dev. The github.dev VS Code editor has sync issues that can corrupt files.

**Content filter note:** JavaScript execution results containing source code may be blocked. Extract specific data points (line numbers, counts, booleans) rather than raw code.

## PDF Export

The exportToPDF function (~line 953) generates a professional print-ready HTML document with:
- Header with firm name, assessment date, sector, overall score badge
- Theme maturity scores (5x2 grid)
- M&A-Ready Benchmark comparison table with horizontal bar charts
- Strengths and improvement areas tables
- Full 47-metric maturity heatmap
- benchmarkSectorDisplay (~line 1120) maps sector to 'M&A-Ready' for the PDF heading

## Recent Commit History

- cc8c110 Improve radar chart contrast, add benchmark methodology, fix demo dates
- 03d40ed Update benchmarks to evidence-based M&A-Ready values
- d8d7c95 Update CLAUDE.md with current project context
- a94552e Revert sync corruption, add firmSector prop to ExportPanel
- 0806271 Improve PDF export with professional formatting and benchmarks
- 3d46b95 Add direct dashboard navigation from Firms and Firm Detail views
- a96da0e Replace Professional Services labels with PSF abbreviation
- 9f79b9a Show weight indicators in Strengths/Weaknesses sections

## M&A-Ready Benchmark Methodology

Benchmarks represent top-quartile PSF performance (the level that acquirers price for at transaction events). Values were synthesised from 20+ industry sources across all 47 metrics, then aggregated to theme level.

**Key sources:** Hinge Research Institute, Deltek Clarity, SPI Research, Mercer, Deloitte, PwC, McKinsey, Harvard Business Review, Bain & Company, KPMG.

**Methodology spreadsheet:** PSF_Benchmark_Methodology.xlsx (4 tabs: Methodology, Benchmark Data, Theme Summary, Sources) contains the full evidence base with metric-level definitions for each maturity level, distribution data, and source citations.

**Previous values (PSF General Population averages):**
```
financial: 58, people: 55, services: 58, vision: 56, sales: 49,
clients: 58, leadership: 58, cost: 51, delivery: 61, market: 51
Overall: 56%
```

## Potential Future Enhancements

- Add metric-level benchmarks (currently only theme-level)
- Add dual benchmark lines (General Population + M&A-Ready)
- Add detailed "About the Benchmarks" expandable section
- Multi-assessment trend tracking
- Sector-specific benchmark adjustments
