// ─── Freemium Gating Configuration ──────────────────────────────
// Central config for all tier-based feature gating.
// Adjust limits and features here without touching component code.

export const TIER_LIMITS = {
  free:    { maxFirms: 1, maxAssessmentsPerFirm: 1 },
  premium: { maxFirms: Infinity, maxAssessmentsPerFirm: Infinity },
};

// Dashboard tabs that require premium
export const GATED_TABS = ['roadmap', 'scenario', 'export'];

// Premium feature descriptions (used in upgrade prompts)
export const PREMIUM_FEATURES = {
  roadmap: {
    label: 'Improvement Roadmap',
    desc: 'Get a prioritised action plan showing exactly which gaps to close first for the biggest impact on your firm\'s value.',
  },
  scenario: {
    label: 'Scenario Modelling',
    desc: 'Model what-if scenarios to see how improving individual themes would impact your overall M&A readiness score.',
  },
  export: {
    label: 'Export Reports',
    desc: 'Download professional PDF reports, executive summaries, and CSV data exports to share with your team and stakeholders.',
  },
  comparison: {
    label: 'Assessment Comparison',
    desc: 'Compare multiple assessments over time to track your firm\'s progress and see trends across every dimension.',
  },
};

// Contextual upgrade banner messages
export const UPGRADE_BANNERS = {
  gaps: 'Want a prioritised improvement roadmap based on these gaps?',
  scores: 'Model different scenarios and see how improvements impact your M&A readiness.',
};
