# Multi-User Firm Access â Implementation Plan

## Problem Statement

Currently, GrowthLens operates on a single-user-per-firm model. In practice, an M&A readiness assessment benefits from input across multiple stakeholders within a firm (e.g., CEO, CFO, Head of Operations, HR Director). Each person brings a different perspective on the firm's maturity across the 57 metrics.

This plan describes how to enable multiple users from the same firm to provide individual assessments, which are then aggregated into the premium account holder's dashboard.

---

## Business Model

### Access & Billing

- **Firm owner (premium)**: The person who created the firm and holds the premium account â typically the CEO or engagement lead. Only they can invite team members, and only they see the aggregated results.
- **Team members (free)**: People invited by the firm owner. They sign up for free accounts, complete their 57-question assessment, and their input feeds into the owner's aggregated view. They do not need premium access â their role is contribution only.
- **Team invitations are a premium-only feature**: The "Invite Team" button only appears for premium account holders. Free users see only their own single assessment.

### What Each Role Sees

| Capability | Firm Owner (Premium) | Team Member (Free) |
|---|---|---|
| Complete 57-question assessment | Yes | Yes |
| View own assessment results | Yes | Yes (basic score only) |
| View aggregated team results | Yes | No |
| See variance / divergence analysis | Yes | No |
| Access gap analysis, roadmaps, scenarios | Yes | No |
| Export PDF / CSV reports | Yes | No |
| Invite / manage team members | Yes | No |

---

## Recommended Approach: Invite Links

### How It Works

1. **Firm owner (on premium) creates a firm** and completes their own assessment as they do today
2. **Owner clicks "Invite Team"** on their firm's page â generates a unique link like `growthlens.app/join/abc123`
3. **Owner shares the link** with colleagues via email, Slack, Teams, etc.
4. **Each colleague clicks the link**, signs up for a free account (or logs into an existing one), and is automatically joined to the firm
5. **Each team member completes their own assessment** â rating all 57 metrics from their perspective, privately
6. **The firm owner's dashboard shows an aggregated view** â median scores across all responses, plus variance indicators highlighting where people disagree
7. **Individual responses remain private** â team members cannot see each other's ratings; the owner sees aggregate statistics, not who said what

### Why This Approach

- **Low friction for team members**: No premium account needed, no codes to remember â just click a link and complete the assessment
- **Value accrues to the premium holder**: The aggregated insights are a premium feature, reinforcing the upgrade value
- **Privacy by default**: Individual assessments stay private; aggregation happens server-side
- **Scalable**: Works for 2 people or 20 people
- **Familiar pattern**: Similar to how survey tools (SurveyMonkey, Culture Amp) handle multi-respondent assessments

---

## User Journey: End to End

### Step 1: Solo Assessment (Free)
Richard signs up free. Creates "Acme Consulting." Completes his own 57-question assessment. Gets his personal M&A Readiness Score â say 67%, "In Progress." This is the existing flow, unchanged.

### Step 2: Upgrade to Premium
Richard contacts GrowthLens (or is upgraded by admin). His account moves to premium. He now sees the full dashboard with gap analysis, roadmaps, scenario modelling, and a new "Invite Team" button.

### Step 3: Invite Colleagues
Richard clicks "Invite Team" and gets a shareable link. He sends it to his CFO, COO, and HR Director.

### Step 4: Team Members Contribute
The CFO clicks the link, creates a free account, and is taken directly into an assessment for "Acme Consulting." She completes all 57 questions from her perspective. The COO and HR Director do the same independently. Each sees only their own results â a basic score summary ("You scored 72%").

### Step 5: Aggregated Dashboard
Richard opens his dashboard and sees a new toggle: "My Assessment" vs "Team View." The Team View shows the median score for each metric across all 4 respondents. A variance panel highlights where opinions diverge most â for example, if Richard rated Financial Performance as Optimised but the CFO rated it Foundational, that metric gets flagged for discussion.

### Step 6: Actionable Insights
Richard uses the divergence data to facilitate a leadership conversation. The areas of greatest disagreement often reveal blind spots â exactly the kind of thing acquirers will probe during due diligence.

---

## Data Model Changes

### New Tables

#### `teams`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | |
| firm_id | UUID (FK â firms) | One team per firm |
| owner_id | UUID (FK â auth.users) | Must be a premium user |
| invite_code | TEXT (unique) | 8-char alphanumeric, used in invite URL |
| invite_active | BOOLEAN DEFAULT true | Can be disabled by owner |
| max_members | INTEGER DEFAULT 20 | Configurable cap |
| created_at | TIMESTAMPTZ | |

#### `team_members`
| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | |
| team_id | UUID (FK â teams) | |
| user_id | UUID (FK â auth.users) | Free account |
| role | TEXT | 'owner' or 'contributor' |
| display_name | TEXT | For admin visibility only |
| status | TEXT | 'active', 'completed', 'removed' |
| joined_at | TIMESTAMPTZ | |
| completed_at | TIMESTAMPTZ | When assessment was finished |

### Modified Tables

#### `assessments` (existing)
Add columns:
- `team_id` UUID (FK â teams, nullable) â links assessment to team context
- `is_team_contribution` BOOLEAN DEFAULT false â TRUE for team member assessments, FALSE for the owner's own assessment

### RLS Policies

- **Team contributors** can read/write only their own assessment
- **Firm owner** can read all assessments linked to their team (for aggregation)
- **Admin** can read everything
- Contributors CANNOT read other contributors' individual assessments
- Contributors CANNOT see aggregate data (premium-only feature)
- Aggregated views are computed server-side via Postgres functions

---

## Aggregation Logic

### Postgres Function: `get_team_aggregate(p_team_id UUID)`

Returns aggregated scores per metric across all team member assessments:

```sql
CREATE OR REPLACE FUNCTION get_team_aggregate(p_team_id UUID)
RETURNS JSONB AS $$
  SELECT jsonb_object_agg(
    metric_id,
    jsonb_build_object(
      'mean', ROUND(AVG(level)::numeric, 1),
      'median', PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY level),
      'min', MIN(level),
      'max', MAX(level),
      'responses', COUNT(*),
      'spread', MAX(level) - MIN(level),
      'std_dev', ROUND(STDDEV(level)::numeric, 2)
    )
  )
  FROM assessments a,
  LATERAL jsonb_each(a.ratings) AS r(metric_id, metric_data),
  LATERAL jsonb_extract_path_text(metric_data, 'level') AS level_text(level_str)
  CROSS JOIN LATERAL (SELECT level_str::integer AS level) parsed
  WHERE a.team_id = p_team_id
    AND a.is_team_contribution = true
  GROUP BY metric_id;
$$ LANGUAGE sql SECURITY DEFINER;
```

### Dashboard Display for Owner

The aggregated dashboard shows:

- **Consensus score** (median) as the primary value per metric
- **Spread indicator**: colour-coded when `max - min >= 2` (full disagreement across all three levels)
- **Response tracker**: "4 of 6 team members have completed their assessment"
- **Top divergences panel**: The 10 metrics with the highest standard deviation, ranked â these are the discussion starters
- **Owner's score vs team median**: Side-by-side comparison showing where the owner's view aligns with or differs from the team

### What Team Members See

After completing their assessment, a team member sees:
- Their own overall score (e.g., "72%") and readiness level
- A message: "Your assessment has been submitted. The firm owner will receive the aggregated results."
- They do NOT see charts, gap analysis, roadmaps, or other premium features

---

## User Flows

### Flow 1: Owner Enables Team Assessment

1. Owner (premium) goes to their firm's page
2. Clicks "Invite Team" button (only visible to premium users)
3. System creates a `teams` record and generates an invite link
4. Owner copies the link and shares it
5. Owner can see a "Team Members" panel showing who has joined and who has completed

### Flow 2: Team Member Joins and Contributes

1. Clicks invite link â lands on `/join/abc123`
2. If not logged in: sees a signup/login page with context ("You've been invited to assess Acme Consulting")
3. After auth: automatically added to the team as a contributor
4. Redirected to their assessment â all 57 questions, same interface as the owner's assessment
5. On completion: sees their personal score summary and a confirmation that their input has been submitted

### Flow 3: Owner Reviews Aggregated Results

1. Owner opens their firm's dashboard
2. Sees a toggle: "My Assessment" / "Team View"
3. Team View shows:
   - Overall aggregated M&A Readiness Score (median across all respondents)
   - Per-theme breakdown with team median vs owner's own score
   - Divergence panel with the most contested metrics
4. Owner can export the aggregated view as a PDF report

---

## Implementation Phases

### Phase 1: Database & Backend (~15 hours)
- Create `teams` and `team_members` tables with RLS policies
- Add `team_id` and `is_team_contribution` columns to assessments
- Create `get_team_aggregate` Postgres function
- Invite code generation (8-char alphanumeric, collision-resistant)
- API/RPC endpoints for: create team, join team, get team status

### Phase 2: Invite Flow (~15 hours)
- Build `/join/:code` route in React
- Join page with auth flow (signup/login â auto-join â redirect to assessment)
- "Invite Team" button on firm detail page (premium-only, gated)
- Copy-to-clipboard invite link
- Team members panel for owner (list of members + completion status)

### Phase 3: Aggregated Dashboard (~20 hours)
- "My Assessment" / "Team View" toggle on dashboard
- Aggregated scoring display using `get_team_aggregate` RPC
- Per-metric variance indicators (spread bars or colour coding)
- Divergence highlights panel (top 10 most contested metrics)
- Owner vs Team comparison view
- Response progress indicator ("4 of 6 completed")

### Phase 4: Polish & Edge Cases (~10 hours)
- Email notification to owner when a team member completes their assessment
- Ability to remove team members
- Regenerate or disable invite link
- Handle edge cases: what if owner downgrades from premium? (team data preserved but aggregated view locked)
- Admin dashboard: team visibility, member counts, completion rates
- Minimum response threshold (3 responses) before showing aggregated results

**Total estimate: ~60 hours across 4 phases**

---

## Alternatives Considered

### Option B: Invite Codes (manual entry)
- Owner generates a 6-digit code (e.g., "ACME-7X3K")
- Team members enter the code on a "Join a Team" page
- Slightly higher friction but avoids link-sharing concerns (e.g., links forwarded to unintended recipients)
- Could be offered as an alternative alongside invite links

### Option C: Email Invitations
- Owner enters team members' email addresses
- System sends branded invite emails with personalised links
- More polished experience but significantly more complex (email delivery, tracking, reminder sequences)
- Better suited as a Phase 5 enhancement

### Recommendation
Start with **Option A (invite links)** for simplicity and speed. The link-based approach has the lowest friction for team members and requires no email infrastructure beyond what already exists. Add email invitations later if customers request a more managed experience.

---

## Security Considerations

- Invite codes should be rate-limited (max 20 joins per code by default, configurable)
- Codes can be disabled by owner at any time
- Team members' individual responses are NEVER exposed to other team members
- Aggregated view requires minimum 3 completed responses before showing results (prevents individual identification)
- RLS enforces all access controls at the database level
- Invite links expire after 30 days by default (owner can regenerate)
- If owner's premium lapses, team data is preserved but aggregated view is locked until premium is restored

---

## Open Questions for Richard

1. **Team member visibility**: Should contributors be able to see their own per-theme breakdown, or only an overall score?
2. **Owner identity**: Should team members know who the firm owner is, or is it anonymous?
3. **Re-assessment**: Can team members update their assessment, or is it one-shot?
4. **Team size cap**: What's a reasonable maximum? 20 seems sensible for a PSF leadership team.
5. **Multiple rounds**: Should there be support for a "Round 2" assessment (e.g., 6 months later) with the same team, to track progress?
