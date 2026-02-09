# Growth Drivers Maturity Framework

## Project Overview

An M&A due diligence assessment platform that evaluates professional services firms across 10 growth themes and 47 metrics, benchmarked against industry standards. Built as a single-page React application deployed to GitHub Pages.

- **Repo**: `richardgoold/maturity-framework`
- **Live site**: https://richardgoold.github.io/maturity-framework/
- **Owner**: Richard Goold (richard@richardgoold.com)

## Tech Stack

- React 19 + Vite
- Tailwind CSS (via CDN in index.html)
- Recharts (radar charts, bar charts)
- Lucide React (icons)
- GitHub Pages deployment via GitHub Actions

## Architecture

**Single-file application.** Nearly all code lives in `src/App.jsx` (~1650 lines, ~131KB). This is intentional — the app is self-contained with no component splitting.

### File Structure

```
├── .github/workflows/deploy.yml   # GitHub Actions: build + deploy to Pages
├── index.html                      # Entry point (loads Tailwind CDN)
├── vite.config.js                  # Vite config with base path
├── package.json
├── src/
│   ├── main.jsx                    # React DOM root
│   ├── App.jsx                     # THE APPLICATION (everything is here)
│   ├── App.css
│   └── index.css
└── public/
```

### App.jsx Structure (top to bottom)

1. **Imports** (lines 1-3): React, Recharts, Lucide icons
2. **FRAMEWORK constant**: All 10 themes with 47 metrics (id, name, question, weight, foundational/evolving/optimised descriptions)
3. **BENCHMARKS constant**: Professional services industry benchmark scores per theme
4. **Helper functions**: `calcScores`, `levelColor`, `levelLabel`, `generatePDFReport`, `generateCSV`
5. **UI Components** (19 total, in order):
   - `AnimatedNumber` — Animated counter
   - `CompletionPulse` — Pulsing completion indicator
   - `AnimatedProgressRing` — SVG ring progress
   - `LiveAssessmentPanel` — Live progress sidebar during assessment
   - `ScoreGauge` — Donut chart score display
   - `MetricCard` — Individual metric rating card
   - `ThemeSidebar` — Left sidebar showing theme list
   - `HeatmapGrid` — Two-column maturity heatmap (all 47 metrics)
   - `StrengthsWeaknesses` — Top strengths and key improvement areas
   - `ExportPanel` — PDF/CSV export buttons
   - `RadarOverview` — Radar chart for theme scores
   - `BenchmarkComparison` — Horizontal bar chart vs industry benchmarks
   - `TemplateSelector` — Pre-built assessment templates
   - `Breadcrumbs` — Navigation breadcrumbs
   - `LandingPage` — Home page
   - `FirmListView` — List of firms
   - `FirmDetailView` — Firm detail with assessments
   - `AssessmentView` — The assessment interface (rate metrics)
   - `DashboardView` — Dashboard with charts, heatmap, strengths/weaknesses, export
6. **Main App function**: Router/state management using `useState`, renders views based on navigation state

### 10 Growth Themes

1. Financial Performance (6 metrics, weight 600)
2. People (5 metrics, weight 425)
3. Services & Pricing (5 metrics, weight 300)
4. Vision & Strategy (5 metrics, weight 375)
5. Sales & Pipeline (4 metrics, weight 350)
6. Clients & Relationships (4 metrics, weight 350)
7. Leadership & Governance (3 metrics, weight 225)
8. Cost Optimisation (7 metrics, weight 350)
9. Delivery (3 metrics, weight 225)
10. Market Profile (5 metrics, weight 250)

### Rating System

Each metric is rated 1 (Foundational), 2 (Evolving), or 3 (Optimised), with 0.5 increments. Scores are weighted by metric weight and summed per theme and overall.

### Data Persistence

All data (firms, assessments, ratings) is stored in `localStorage`. There is no backend.

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`:
1. Checkout → Install deps → `npm run build` → Deploy to GitHub Pages

Typical deploy time: 20-30 seconds for the build, then ~25 seconds for Pages deployment.

**Known issue**: GitHub Actions occasionally returns 500 Internal Server errors on `actions/checkout@v4`. Fix: re-run the workflow (usually succeeds on retry).

## Editing via GitHub Web Editor

When editing through github.com's web editor, be aware:

- The editor uses **CodeMirror 6** which virtualizes content — only visible lines exist in the DOM
- Standard select-all / DOM manipulation only affects visible content (~15K chars), not the full ~131K file
- **Working approach for programmatic edits**: Access CM6's EditorView via `document.querySelector('.cm-content').cmTile.view`, then use `view.dispatch({ changes: [{ from, to, insert }] })` to replace content
- For small edits: Use Selection API + `document.execCommand('insertText')` on visible text nodes
- The web editor may struggle with files this large; consider using `github.dev` (VS Code web) as an alternative

## Common Tasks

### Adding a new metric
Add to the relevant theme in the `FRAMEWORK.themes` array. Each metric needs: `id`, `name`, `question`, `weight`, `foundational`, `evolving`, `optimised` descriptions.

### Modifying the dashboard
Edit the `DashboardView` function. It uses `calcScores()` to compute all scores, then renders: header → theme score strip → radar + benchmark charts → strengths/weaknesses → heatmap → export panel.

### Changing benchmark data
Edit the `BENCHMARKS` object. Keys are theme IDs, values are benchmark percentages.

## Recent Changes (Feb 2026)

- Fixed missing `X` icon import (commit 025edce)
- Fixed `LayoutDashboard` typo in import (commit 6d223d3)
- Dashboard improvements: two-column heatmap layout + theme score summary strip (commit 149eae0)
