# Growth Drivers Maturity Framework

## Project Overview

An M&A due diligence assessment platform that evaluates professional services firms (PSFs) across 10 growth themes and 47 metrics, benchmarked against industry standards. Built as a single-page React application deployed to GitHub Pages.

- **Repo**: `richardgoold/maturity-framework`
- **Live site**: https://richardgoold.github.io/maturity-framework/
- **Owner**: Richard Goold (richard@richardgoold.com)
- **Latest commit**: `a94552e` — "Revert sync corruption, add firmSector prop to ExportPanel"

## Tech Stack

- React 19 + Vite
- Tailwind CSS (via CDN in index.html)
- Recharts (radar charts, bar charts)
- Lucide React (icons)
- GitHub Pages deployment via GitHub Actions

## Architecture

**Single-file application.** Nearly all code lives in `src/App.jsx` (~2167 lines, ~182KB). This is intentional — the app is self-contained with no component splitting.

### File Structure

```
├── .github/workflows/deploy.yml   # GitHub Actions: build + deploy to Pages
├── index.html                      # Entry point (loads Tailwind CDN)
├── vite.config.js                  # Vite config with base path
├── package.json
├── src/
│   ├── main.jsx                    # React DOM root
│   ├── App.jsx                     # THE application (~2167 lines)
│   ├── App.css                     # Minimal styles
│   └── index.css                   # Global styles
└── CLAUDE.md                       # This file
```

### App.jsx Structure (top to bottom)

1. **Imports**: React, Recharts, Lucide icons
2. **FRAMEWORK constant** (~lines 1-450): All 10 themes with 47 metrics, each with id, name, question, weight, and 3 maturity level descriptions (foundational/evolving/optimised)
3. **PSF_BENCHMARKS constant**: Industry benchmark percentages per theme
4. **Helper functions**: `calculateScores`, `getStrengths`, `getImprovements`, etc.
5. **exportToPDF function** (~line 953): Generates a print-ready HTML document in a new window
6. **UI Components** (all defined in this file):
   - `MetricCard` — Individual metric rating card
   - `ThemeSidebar` — Left sidebar showing theme list
   - `HeatmapGrid` — Two-column maturity heatmap (all 47 metrics)
   - `StrengthsWeaknesses` — Top strengths and key improvement areas with weight indicators
   - `ExportPanel` — PDF/CSV export buttons (receives assessment, firmName, firmSector, scores)
   - `RadarOverview` — Radar chart for theme scores
   - `BenchmarkComparison` — Horizontal bar chart vs PSF industry benchmarks
   - `TemplateSelector` — Pre-built assessment templates
   - `Breadcrumbs` — Navigation breadcrumbs
   - `LandingPage` — Home page
   - `FirmListView` — List of firms with direct dashboard navigation
   - `FirmDetailView` — Firm detail with assessments and dashboard access
   - `AssessmentView` — The assessment interface (rate metrics)
   - `DashboardView` — Dashboard with charts, heatmap, strengths/weaknesses, export
7. **Main App function**: Router/state management using `useState`, renders views based on navigation state

### Key Prop Threading

```
App (manages firms, assessments, navigation state)
  └─ DashboardView ({ assessment, firmName, firmSector, onBack })
       ├─ RadarOverview
       ├─ BenchmarkComparison
       ├─ StrengthsWeaknesses
       ├─ HeatmapGrid
       └─ ExportPanel ({ assessment, firmName, firmSector, scores })
            └─ calls exportToPDF(assessment, firmName, firmSector, scores)
```

### 10 Growth Themes

1. Financial Performance (6 metrics, weight 600)
2. People (5 metrics, weight 425)
3. Services & Pricing (5 metrics, weight 300)
4. Vision & Strategy (5 metrics, weight 300)
5. Sales & Pipeline (4 metrics, weight 300)
6. Clients & Relationships (4 metrics, weight 300)
7. Leadership & Governance (3 metrics, weight 300)
8. Cost Optimisation (7 metrics, weight 225)
9. Delivery (3 metrics, weight 300)
10. Market Profile (5 metrics, weight 250)

Total: 47 metrics, max score 9000 (3 × sum of all weights)

## PDF Export (exportToPDF function)

Generates a professional print-ready HTML document with:
- **Header**: Firm name, assessment date, sector, completion status, overall score badge (color-coded)
- **Theme Maturity Scores**: 5×2 grid of all 10 theme percentages
- **PSF Benchmark Comparison**: Table with horizontal bar charts showing firm score vs PSF average
- **Strengths & Opportunities**: Two side-by-side tables (Top 5 Strengths, Top 5 Improvement Areas)
- **Maturity Heatmap**: All 47 metrics in 2-column layout with color-coded cells (green/amber/red)
- Print CSS: A4 page size, 0.5in margins, page-break rules, Inter font

**Not included in PDF** (acceptable for print):
- Radar chart (replaced by theme score cards)
- Interactive charts (replaced by HTML tables/bars)
- Maturity ratings (e.g., "3/3") and weight indicators ("wt ×100") in strengths/improvements tables

## Data Persistence

All data stored in `localStorage`:
- `maturityFirms` — Array of firm objects
- `maturityAssessments` — Object keyed by firm ID, each containing assessment arrays
- Template assessments pre-populate from built-in data

## Deployment

- Push to `main` triggers GitHub Actions workflow (`.github/workflows/deploy.yml`)
- Runs `npm ci && npm run build` then deploys `dist/` to GitHub Pages
- Typically completes in ~20-25 seconds
- Build uses Vite with `base: '/maturity-framework/'`

## Editing via GitHub Web Editor

### CodeMirror 6 Access (github.com/edit)

The GitHub web editor uses CodeMirror 6. To programmatically edit content:

```javascript
// Access the EditorView
const view = document.querySelector('.cm-content').cmTile.view;

// Read document
const content = view.state.doc.toString();

// Replace entire document
view.dispatch({
  changes: { from: 0, to: view.state.doc.length, insert: newContent }
});
```

### CRITICAL WARNING: github.dev Sync Issues

**DO NOT use github.dev (VS Code web) if it shows uncommitted changes from a previous session.** The sync mechanism can corrupt files — it merges stale uncommitted changes with the latest version, causing:
- Encoding corruption (thousands of stray characters injected throughout)
- Code fragments merging across lines (e.g., comment + function keyword fusing)
- Build may pass but site renders broken (code fragments leak into UI)

**Safe approach**: Always use the simple GitHub web editor (`github.com/.../edit/...`) for changes, or ensure github.dev has no stale uncommitted changes before editing.

**Recovery approach if corruption occurs**: Fetch the clean file from the last known good commit via `raw.githubusercontent.com/{owner}/{repo}/{commit_sha}/src/App.jsx`, apply fixes in JavaScript, then push via the GitHub web editor.

## Common Tasks

### Adding a new metric
Add to the relevant theme in the `FRAMEWORK.themes` array. Each metric needs: `id`, `name`, `question`, `weight`, `foundational`, `evolving`, `optimised` descriptions.

### Modifying the dashboard
Edit the `DashboardView` component. It receives `assessment`, `firmName`, `firmSector`, and `onBack` props. Child components are rendered inline.

### Updating PDF export
Edit the `exportToPDF` function (~line 953). It constructs an HTML string with inline CSS and writes it to a new window. The function signature is:
`exportToPDF(assessment, firmName, firmSector, scores)`

### Changing benchmarks
Edit the `PSF_BENCHMARKS` object. Keys are theme IDs, values are percentages.

## Recent Commit History

```
a94552e Revert sync corruption, add firmSector prop to ExportPanel
0806271 Improve PDF export with professional formatting and benchmarks
3d46b95 Add direct dashboard navigation from Firms and Firm Detail views
a96da0e Replace Professional Services labels with PSF abbreviation
9f79b9a Show weight indicators in Strengths/Weaknesses sections
89a2cf2 Fix chart label truncation: full theme names with multi-line wrapping
913c482 Add CLAUDE.md project context for persistent AI assistance
149eae0 Improve dashboard: two-column heatmap and theme score summary strip
```

Note: Commits `f6fd474` and `592f2b5` were corrupted by a github.dev sync and superseded by `a94552e`.
