import { useState, useEffect, useMemo, useCallback } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { Building2, ClipboardCheck, LayoutDashboard, Plus, ChevronRight, CheckCircle2, Circle, AlertCircle, TrendingUp, Target, Award, MessageSquare, X, ArrowLeft, Trash2, Download, FileText, BarChart3, Copy, Sparkles } from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// FRAMEWORK DATA - All 47 metrics from the Growth Drivers spreadsheet
// ═══════════════════════════════════════════════════════════════
const FRAMEWORK = {
  themes: [
    {
      id: "financial", name: "Financial Performance", icon: "pound", totalWeight: 600, color: "#1B4F72",
      metrics: [
        { id: "fin_revenue", name: "Revenue Growth & Profitability", weight: 100, earnout: "X", foundational: "Revenue growth <5% per year, low or inconsistent profitability, reliance on a few large projects", evolving: "Revenue growth 5-10% per year, moderate profitability, some diversification of revenue streams", optimised: "Revenue growth >10% per year, strong profitability with predictable, diversified revenue streams and high-margin services" },
        { id: "fin_gm", name: "Gross Margin", weight: 100, earnout: "X", foundational: "Gross margin <40%, cost overruns are frequent, and pricing is reactive rather than strategic", evolving: "Gross margin 40-50%, some cost control measures in place, but efficiency improvements still needed", optimised: "Gross margin >50%, strong cost control, pricing strategy optimised for profitability and scalability" },
        { id: "fin_ebitda", name: "EBITDA %", weight: 100, earnout: "X", foundational: "EBITDA margin <10%, low cash generation, high cost-to-revenue ratio", evolving: "EBITDA margin 10-20%, improving operational efficiency, but some volatility in profitability", optimised: "EBITDA margin >20%, strong financial discipline, consistent year-over-year growth" },
        { id: "fin_cash", name: "Cash Flow", weight: 100, earnout: "X", foundational: "Free cash flow is negative or low, debtor days >60, frequent working capital constraints", evolving: "Free cash flow is positive but inconsistent, debtor days 45-60, some cash reserves maintained", optimised: "Free cash flow is consistently strong, debtor days <45, 80%+ cash flow conversion from EBITDA" },
        { id: "fin_quality", name: "Quality of Revenue", weight: 100, earnout: "X", foundational: "Recurring/repeat revenue <10%, heavy reliance on new business development, volatile income streams", evolving: "Recurring/repeat revenue 10-30%, some multi-year contracts, but still significant project-based work", optimised: "Recurring/repeat revenue >30%, long-term client contracts, high revenue predictability" },
        { id: "fin_rate", name: "Blended Rate Card", weight: 100, earnout: "X", foundational: "Average daily rate <\u00A31,000, frequent discounting, weak commercial discipline", evolving: "Average daily rate \u00A31,000-\u00A31,500, some rate consistency, but discounting still occurs", optimised: "Average daily rate >\u00A31,500, strong commercial discipline, pricing reflects market leadership and value" },
      ]
    },
    {
      id: "people", name: "People", icon: "users", totalWeight: 425, color: "#6C3483",
      metrics: [
        { id: "ppl_talent", name: "Talent & Competence Management", weight: 100, earnout: "X", foundational: "One or none of: detailed competency framework; consistent training and mentoring structure; annual appraisal system; clear role definitions", evolving: "2-3 of these: detailed competency framework; consistent training and mentoring structure; annual appraisal system; clear role definitions", optimised: "All of these: detailed competency framework; consistent training and mentoring structure; annual appraisal system; clear role definitions" },
        { id: "ppl_exp", name: "Employee Experience", weight: 100, earnout: "X", foundational: "Internal NPS below 40 (or not measured) and Glassdoor rating below 3.5", evolving: "Internal NPS rating below 40 (or not measured) OR Glassdoor rating below 4", optimised: "Internal NPS rating 40+ AND Glassdoor rating above 4" },
        { id: "ppl_recruit", name: "Recruitment", weight: 100, earnout: "X", foundational: "Low (0-3) qualified applicants per job. Vague or unarticulated Employee Value Proposition", evolving: "Medium (3-7) qualified applicants per job. Vague or unarticulated Employee Value Proposition", optimised: "High (7+) qualified applicants per job. Clear Employee Value Proposition" },
        { id: "ppl_churn", name: "Churn & Attrition", weight: 100, earnout: "X", foundational: "Attrition >25% annually", evolving: "Attrition between 15-25%", optimised: "Attrition <15%, strong retention strategies" },
        { id: "ppl_wf", name: "Workforce Composition", weight: 25, earnout: "X", foundational: ">50% of delivery team are contractors, low organisational knowledge retention", evolving: "30-50% of delivery team are contractors, some investment in permanent teams", optimised: "<30% of delivery team are contractors, strong internal capability and knowledge retention" },
      ]
    },
    {
      id: "services", name: "Services & Pricing", icon: "tag", totalWeight: 300, color: "#1A5276",
      metrics: [
        { id: "srv_prop", name: "Market Proposition", weight: 100, earnout: "X", foundational: "Vague market positioning, low differentiation from competitors, low focus on specific client pain points", evolving: "Some differentiation but client pain points or benefits are vague", optimised: "Clearly defined, differentiated value proposition(s) focus on clear client needs and benefits" },
        { id: "srv_innov", name: "Service Innovation", weight: 25, earnout: "X", foundational: "No structured investment (<2% of revenue)", evolving: "3-5% of revenue reinvested in service development", optimised: ">5% of revenue reinvested in service innovation" },
        { id: "srv_ip", name: "Service IP", weight: 100, earnout: "X", foundational: "<10% of delivery supported by proprietary IP", evolving: "10%-30% of delivery incorporates proprietary IP", optimised: ">30% of delivery is productised or IP-based" },
        { id: "srv_size", name: "Project Size", weight: 50, earnout: "X", foundational: "Average contract size less than \u00A350k", evolving: "Average project size \u00A350k-\u00A3250k", optimised: "Average project size \u00A3250k+" },
        { id: "srv_price", name: "Pricing Strategy", weight: 25, earnout: "X", foundational: "Ad-hoc pricing; low understanding of price elasticity", evolving: "Some structured pricing models but inconsistent", optimised: "Data-driven pricing strategy, strong market positioning" },
      ]
    },
    {
      id: "vision", name: "Vision & Strategy", icon: "compass", totalWeight: 300, color: "#117A65",
      metrics: [
        { id: "vis_market", name: "Market/Niche Focus", weight: 100, earnout: "X", foundational: "Low growth / cold sector (e.g. Project Management)", evolving: "Medium growth / warm sector (e.g. Environmental)", optimised: "High growth / hot sector (e.g. AI Consulting or Finance)" },
        { id: "vis_comp", name: "Competitors & Barriers to Entry", weight: 75, earnout: "X", foundational: "High competition with 10+ direct competitors offering similar services and low barriers to entry", evolving: "Moderate competition with 5-10 competitors, some differentiation through IP or niche specialisation", optimised: "Low competition with <5 competitors in the same niche, strong barriers to entry through proprietary IP or brand authority" },
        { id: "vis_align", name: "Strategic Alignment", weight: 50, earnout: "X", foundational: "Strategy is misaligned across teams", evolving: "Some alignment, but execution inconsistencies", optimised: "Strategy is well-defined and fully aligned" },
        { id: "vis_plan", name: "Business Planning", weight: 75, earnout: "X", foundational: "No formal business plan or planning occurs reactively, with no structured forecasting", evolving: "Business planning conducted annually, with some structured financial and strategic forecasting", optimised: "Business planning is a quarterly rolling process, with 3-5 year strategic plans and real-time performance tracking" },
        { id: "vis_esg", name: "ESG", weight: 0, earnout: "", foundational: "No formal ESG strategy, no tracking of environmental or social impact", evolving: "Basic ESG policy in place, some initiatives but no structured reporting", optimised: "Fully embedded ESG strategy with measurable KPIs and transparent annual reporting" },
      ]
    },
    {
      id: "sales", name: "Sales & Pipeline", icon: "trending-up", totalWeight: 275, color: "#B7950B",
      metrics: [
        { id: "sal_pipe", name: "Pipeline Visibility", weight: 75, earnout: "X", foundational: "<40% of next 12 months' revenue booked", evolving: "40-70% of next 12 months' revenue booked", optimised: ">70% of next 12 months' revenue booked" },
        { id: "sal_conv", name: "Conversion Ratios", weight: 50, earnout: "X", foundational: "<25% proposal conversion rate", evolving: "25%-50% proposal conversion rate", optimised: ">50% proposal conversion rate" },
        { id: "sal_mgmt", name: "Sales Management", weight: 75, earnout: "X", foundational: "Weak sales management: weak reporting or data. CRM not well integrated", evolving: "Improved sales management. CRM used, but not consistently by all", optimised: "Strong sales management by top-ranked senior. Weekly meetings driven by CRM-related data" },
        { id: "sal_skills", name: "Sales Skills & Processes", weight: 75, earnout: "50", foundational: "No structured sales training/processes", evolving: "Some structured sales processes, but inconsistently applied", optimised: "Highly structured, repeatable sales process" },
      ]
    },
    {
      id: "clients", name: "Clients & Relationships", icon: "handshake", totalWeight: 250, color: "#922B21",
      metrics: [
        { id: "cli_conc", name: "Client Concentration & Risk", weight: 100, earnout: "X", foundational: "Top 3 clients contribute >50% of total revenue, high dependency on a few key relationships", evolving: "Top 3 clients contribute 30-50% of total revenue, moderate diversification", optimised: "Top 3 clients contribute <30% of total revenue, well-diversified client base" },
        { id: "cli_long", name: "Client Longevity", weight: 100, earnout: "X", foundational: "Average client tenure <6 months, transactional relationships, low retention", evolving: "Average client tenure 6-24 months, some long-term relationships", optimised: "Average client tenure >2 years, high retention rate, strong account management" },
        { id: "cli_size", name: "Client Size", weight: 25, earnout: "X", foundational: "Majority of clients are small contracts (<\u00A350k annual spend)", evolving: "Mix of small and mid-sized clients, with 20%+ of revenue from mid-tier (\u00A350k-\u00A3250k)", optimised: "30%+ of revenue from large clients (\u00A3250k+ per year), strategic account penetration" },
        { id: "cli_part", name: "Partnerships & Alliances", weight: 25, earnout: "X", foundational: "No formal partnerships, occasional ad hoc collaborations", evolving: "1-3 strategic partnerships, contributing <10% of revenue", optimised: "3+ strong partnerships, contributing >15% of revenue, integrated into go-to-market" },
      ]
    },
    {
      id: "leadership", name: "Leadership & Governance", icon: "shield", totalWeight: 250, color: "#4A235A",
      metrics: [
        { id: "led_team", name: "Senior Leadership Team", weight: 100, earnout: "100", foundational: "Weak leadership team", evolving: "Improving leadership team", optimised: "Very experienced leadership team with experience of M&A" },
        { id: "led_deleg", name: "Delegation & Succession", weight: 100, earnout: "100", foundational: "Founders drive most key decisions", evolving: "Some delegation, but founder dependence remains", optimised: "CEO and leadership team operate independently" },
        { id: "led_gov", name: "Governance & Controls", weight: 50, earnout: "25", foundational: "One or none of: Strong advisory board; Strong governance for decision-making; Strong strategic reporting", evolving: "Two of these: Strong advisory board; Strong governance; Strong strategic reporting", optimised: "All three: Strong advisory board; Strong governance for decision-making; Strong strategic reporting" },
      ]
    },
    {
      id: "cost", name: "Cost Optimisation", icon: "calculator", totalWeight: 250, color: "#1E8449",
      metrics: [
        { id: "cos_deliv", name: "Delivery Model", weight: 25, earnout: "X", foundational: "Delivery is fully onshore, cost inefficiencies", evolving: "Some offshore delivery, but limited efficiency gains", optimised: "Optimised delivery mix with offshore efficiencies" },
        { id: "cos_tech", name: "Technology Maturity", weight: 75, earnout: "X", foundational: "Limited use of CRM, PSA, or automation", evolving: "Basic adoption of CRM, PSA, and some automation", optimised: "Fully integrated digital ecosystem (CRM, PSA, AI)" },
        { id: "cos_scale", name: "Scaling Infrastructure", weight: 75, earnout: "X", foundational: "<20% of core business processes automated or AI-supported", evolving: "20-50% of core business processes automated, with partial AI-driven analytics", optimised: ">50% of processes automated, with AI and RPA fully embedded in operations" },
        { id: "cos_data", name: "Data Maturity", weight: 75, earnout: "X", foundational: "Data fragmented, manual reporting", evolving: "Some structured reporting, data inconsistencies", optimised: "Automated, real-time data-driven reporting" },
        { id: "cos_lever", name: "Leverage", weight: 0, earnout: "", foundational: "Leverage ratio >3.5x EBITDA, high debt burden", evolving: "Leverage ratio 2.0-3.5x EBITDA, manageable debt", optimised: "Leverage ratio <2.0x EBITDA, strong financial flexibility" },
        { id: "cos_know", name: "Knowledge", weight: 0, earnout: "", foundational: "<20% of knowledge is codified, minimal documentation", evolving: "20-50% of knowledge is documented, some use of knowledge management tools", optimised: ">50% of knowledge is structured and documented, KM systems fully integrated" },
        { id: "cos_resrc", name: "Resourcing", weight: 0, earnout: "", foundational: "Utilisation <60%, poor visibility on resource allocation", evolving: "Utilisation 60-75%, some workforce planning but reactive deployment", optimised: "Utilisation >75%, proactive resource planning and demand forecasting" },
      ]
    },
    {
      id: "delivery", name: "Delivery", icon: "check-square", totalWeight: 175, color: "#2E86C1",
      metrics: [
        { id: "del_sat", name: "Client Satisfaction", weight: 75, earnout: "X", foundational: "No structured feedback mechanisms (NPS <20)", evolving: "Periodic feedback collection, NPS 20-50", optimised: "Advanced feedback mechanisms, NPS >50" },
        { id: "del_util", name: "Utilisation", weight: 50, earnout: "X", foundational: "Utilisation <60%", evolving: "Utilisation 60-75%", optimised: "Utilisation >75%" },
        { id: "del_qa", name: "Quality Assurance", weight: 50, earnout: "X", foundational: "No formal QA standards", evolving: "Some QA standards in place, inconsistent adherence", optimised: "Robust QA framework throughout project delivery, consistently applied" },
      ]
    },
    {
      id: "market", name: "Market Profile", icon: "globe", totalWeight: 175, color: "#CA6F1E",
      metrics: [
        { id: "mkt_size", name: "Market Size & Growth Potential", weight: 25, earnout: "X", foundational: "Small maximum market (less than $500m)", evolving: "Medium maximum market ($500m-1bn)", optimised: "Large maximum market (>$1bn)" },
        { id: "mkt_mktg", name: "Marketing Influence on Revenue", weight: 50, earnout: "X", foundational: "<5% of revenue influenced by marketing", evolving: "5-15% of revenue influenced by marketing", optimised: "15%+ of revenue driven by marketing" },
        { id: "mkt_award", name: "Awards & Recognition", weight: 50, earnout: "X", foundational: "No national or industry awards won in the past three years", evolving: "1-2 national or industry awards won in the past three years", optimised: "3+ national or industry awards, with external validation from major industry bodies" },
        { id: "mkt_thought", name: "Thought Leadership", weight: 50, earnout: "X", foundational: "No thought leadership content published in past 6 months", evolving: "2-3 pieces of thought leadership content published monthly", optimised: "Recognised industry thought leader, 4+ high-impact pieces monthly with significant recognition" },
        { id: "mkt_brand", name: "Branding", weight: 0, earnout: "", foundational: "No defined brand strategy, weak recognition outside existing clients", evolving: "Some brand recognition, 1-2 external PR initiatives annually", optimised: "Recognised industry brand with strong external presence driving inbound opportunities" },
      ]
    },
  ]
};

const TOTAL_MAX_SCORE = FRAMEWORK.themes.reduce((sum, t) => sum + t.metrics.reduce((s, m) => s + m.weight * 3, 0), 0);
const TOTAL_WEIGHTED_POINTS = FRAMEWORK.themes.reduce((sum, t) => sum + t.totalWeight, 0); // 3000

// ═══════════════════════════════════════════════════════════════
// INDUSTRY BENCHMARKS - Average scores by sector
// ═══════════════════════════════════════════════════════════════
const BENCHMARKS = {
  "Consulting": {
    financial: 55, people: 60, services: 50, vision: 55, sales: 50,
    clients: 55, leadership: 60, cost: 45, delivery: 60, market: 50
  },
  "Technology Services": {
    financial: 60, people: 55, services: 65, vision: 65, sales: 55,
    clients: 50, leadership: 55, cost: 70, delivery: 65, market: 60
  },
  "Legal & Compliance": {
    financial: 65, people: 50, services: 55, vision: 50, sales: 45,
    clients: 70, leadership: 65, cost: 40, delivery: 55, market: 45
  },
  "Engineering & Design": {
    financial: 50, people: 55, services: 60, vision: 55, sales: 45,
    clients: 55, leadership: 50, cost: 50, delivery: 65, market: 50
  }
};

// ═══════════════════════════════════════════════════════════════
// ASSESSMENT TEMPLATES - Pre-configured starting points
// ═══════════════════════════════════════════════════════════════
const TEMPLATES = {
  "Top Performer": {
    description: "High-performing firm ready for acquisition",
    icon: "🏆",
    ratings: {
      fin_revenue: 3, fin_gm: 3, fin_ebitda: 2.5, fin_cash: 3, fin_quality: 2.5, fin_rate: 3,
      ppl_talent: 3, ppl_exp: 2.5, ppl_recruit: 3, ppl_churn: 3, ppl_wf: 3,
      srv_prop: 3, srv_innov: 2.5, srv_ip: 3, srv_size: 3, srv_price: 2.5,
      vis_market: 3, vis_comp: 2.5, vis_align: 3, vis_plan: 3, vis_esg: 2,
      sal_pipe: 3, sal_conv: 2.5, sal_mgmt: 3, sal_skills: 3,
      cli_conc: 3, cli_long: 3, cli_size: 2.5, cli_part: 2.5,
      led_team: 3, led_deleg: 3, led_gov: 3,
      cos_deliv: 2.5, cos_tech: 3, cos_scale: 2.5, cos_data: 3, cos_lever: 3, cos_know: 2.5, cos_resrc: 3,
      del_sat: 3, del_util: 3, del_qa: 3,
      mkt_size: 3, mkt_mktg: 2.5, mkt_award: 3, mkt_thought: 2.5, mkt_brand: 2.5
    }
  },
  "Typical Mid-Market": {
    description: "Average professional services firm",
    icon: "📊",
    ratings: {
      fin_revenue: 2, fin_gm: 2, fin_ebitda: 2, fin_cash: 1.5, fin_quality: 1.5, fin_rate: 2,
      ppl_talent: 2, ppl_exp: 2, ppl_recruit: 1.5, ppl_churn: 2, ppl_wf: 2,
      srv_prop: 2, srv_innov: 1.5, srv_ip: 1.5, srv_size: 2, srv_price: 1.5,
      vis_market: 2, vis_comp: 2, vis_align: 1.5, vis_plan: 2, vis_esg: 1,
      sal_pipe: 2, sal_conv: 2, sal_mgmt: 1.5, sal_skills: 2,
      cli_conc: 1.5, cli_long: 2, cli_size: 2, cli_part: 1.5,
      led_team: 2, led_deleg: 1.5, led_gov: 2,
      cos_deliv: 1.5, cos_tech: 2, cos_scale: 1.5, cos_data: 2, cos_lever: 2, cos_know: 1.5, cos_resrc: 2,
      del_sat: 2, del_util: 2, del_qa: 2,
      mkt_size: 2, mkt_mktg: 1.5, mkt_award: 1.5, mkt_thought: 1.5, mkt_brand: 1.5
    }
  },
  "Turnaround Target": {
    description: "Firm with significant improvement potential",
    icon: "🔧",
    ratings: {
      fin_revenue: 1, fin_gm: 1.5, fin_ebitda: 1, fin_cash: 1, fin_quality: 1, fin_rate: 1.5,
      ppl_talent: 1.5, ppl_exp: 1, ppl_recruit: 1, ppl_churn: 1, ppl_wf: 1.5,
      srv_prop: 1.5, srv_innov: 1, srv_ip: 1, srv_size: 1.5, srv_price: 1,
      vis_market: 1.5, vis_comp: 1, vis_align: 1, vis_plan: 1.5, vis_esg: 1,
      sal_pipe: 1, sal_conv: 1.5, sal_mgmt: 1, sal_skills: 1,
      cli_conc: 1, cli_long: 1.5, cli_size: 1, cli_part: 1,
      led_team: 1.5, led_deleg: 1, led_gov: 1,
      cos_deliv: 1, cos_tech: 1.5, cos_scale: 1, cos_data: 1.5, cos_lever: 1.5, cos_know: 1, cos_resrc: 1,
      del_sat: 1.5, del_util: 1, del_qa: 1.5,
      mkt_size: 1.5, mkt_mktg: 1, mkt_award: 1, mkt_thought: 1, mkt_brand: 1
    }
  },
  "Tech-Enabled Services": {
    description: "Strong on technology, developing other areas",
    icon: "💻",
    ratings: {
      fin_revenue: 2.5, fin_gm: 2.5, fin_ebitda: 2, fin_cash: 2, fin_quality: 2, fin_rate: 2,
      ppl_talent: 2, ppl_exp: 2.5, ppl_recruit: 2.5, ppl_churn: 2, ppl_wf: 2,
      srv_prop: 2.5, srv_innov: 3, srv_ip: 3, srv_size: 2, srv_price: 2,
      vis_market: 3, vis_comp: 2.5, vis_align: 2, vis_plan: 2.5, vis_esg: 1.5,
      sal_pipe: 2, sal_conv: 2, sal_mgmt: 2.5, sal_skills: 2,
      cli_conc: 2, cli_long: 2, cli_size: 2, cli_part: 2.5,
      led_team: 2, led_deleg: 2, led_gov: 2,
      cos_deliv: 3, cos_tech: 3, cos_scale: 3, cos_data: 3, cos_lever: 2.5, cos_know: 2.5, cos_resrc: 2.5,
      del_sat: 2.5, del_util: 2.5, del_qa: 2.5,
      mkt_size: 2.5, mkt_mktg: 2.5, mkt_award: 2, mkt_thought: 2.5, mkt_brand: 2
    }
  }
};

// ═══════════════════════════════════════════════════════════════
// STATE MANAGEMENT
// ═══════════════════════════════════════════════════════════════
const STORAGE_KEY = "gdmf_app_state";

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const saveState = (state) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { }
};

const genId = () => Math.random().toString(36).substr(2, 9);

// ═══════════════════════════════════════════════════════════════
// SCORING ENGINE (with Earnout Tracking)
// ═══════════════════════════════════════════════════════════════
const calcScores = (ratings) => {
  const themeScores = {};
  let totalScore = 0;
  let totalMaxPossible = 0;
  let ratedCount = 0;
  let totalMetrics = 0;

  // Earnout tracking
  let earnoutScore = 0;
  let earnoutMax = 0;
  const earnoutByTheme = {};

  FRAMEWORK.themes.forEach(theme => {
    let themeScore = 0;
    let themeMax = 0;
    let themeRated = 0;
    let themeEarnoutScore = 0;
    let themeEarnoutMax = 0;

    theme.metrics.forEach(m => {
      totalMetrics++;
      const r = ratings[m.id];
      const earnoutValue = m.earnout && m.earnout !== "X" && !isNaN(parseInt(m.earnout)) ? parseInt(m.earnout) : 0;

      if (r && r.level) {
        themeScore += r.level * m.weight;
        ratedCount++;
        themeRated++;

        // Earnout calculation - only for metrics with numeric earnout values
        if (earnoutValue > 0) {
          // Scale: level 3 = 100% of earnout, level 2 = 66%, level 1 = 33%
          const earnoutPct = r.level / 3;
          themeEarnoutScore += earnoutValue * earnoutPct;
        }
      }

      themeMax += 3 * m.weight;
      if (earnoutValue > 0) {
        themeEarnoutMax += earnoutValue;
      }
    });

    themeScores[theme.id] = {
      score: themeScore,
      max: themeMax,
      rated: themeRated,
      total: theme.metrics.length,
      pct: themeMax > 0 ? Math.round((themeScore / themeMax) * 100) : 0
    };

    earnoutByTheme[theme.id] = { score: Math.round(themeEarnoutScore), max: themeEarnoutMax };
    earnoutScore += themeEarnoutScore;
    earnoutMax += themeEarnoutMax;

    totalScore += themeScore;
    totalMaxPossible += themeMax;
  });

  return {
    themeScores,
    totalScore,
    totalMaxPossible,
    pct: totalMaxPossible > 0 ? Math.round((totalScore / totalMaxPossible) * 100) : 0,
    ratedCount,
    totalMetrics,
    earnout: {
      score: Math.round(earnoutScore),
      max: earnoutMax,
      pct: earnoutMax > 0 ? Math.round((earnoutScore / earnoutMax) * 100) : 0,
      byTheme: earnoutByTheme
    }
  };
};

// ═══════════════════════════════════════════════════════════════
// COLOUR HELPERS
// ═══════════════════════════════════════════════════════════════
const levelColor = (level) => {
  if (!level) return { bg: "#F8F9FA", text: "#6C757D", border: "#DEE2E6" };
  if (level <= 1.5) return { bg: "#FDEDEC", text: "#922B21", border: "#E6B0AA" };
  if (level <= 2.5) return { bg: "#FEF9E7", text: "#7D6608", border: "#F9E79F" };
  return { bg: "#EAFAF1", text: "#1E8449", border: "#A9DFBF" };
};

const levelLabel = (level) => {
  if (!level) return "Not Rated";
  if (level === 1) return "Foundational";
  if (level === 1.5) return "Found./Evolving";
  if (level === 2) return "Evolving";
  if (level === 2.5) return "Evolv./Optimised";
  if (level === 3) return "Optimised";
  return `Level ${level}`;
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════

function ScoreGauge({ score, max, label }) {
  const pct = max > 0 ? (score / max) * 100 : 0;
  const color = pct >= 66 ? "#1E8449" : pct >= 33 ? "#B7950B" : "#922B21";
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="52" fill="none" stroke="#E5E7EB" strokeWidth="12" />
          <circle cx="60" cy="60" r="52" fill="none" stroke={color} strokeWidth="12" strokeDasharray={`${pct * 3.267} 326.7`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold" style={{ color }}>{Math.round(pct)}%</span>
          <span className="text-xs text-gray-500">{Math.round(score)} / {max}</span>
        </div>
      </div>
      {label && <span className="text-sm font-medium text-gray-600 mt-2">{label}</span>}
    </div>
  );
}

function MetricCard({ metric, rating, onRate, onComment }) {
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState(rating?.comment || "");
  const levels = [
    { level: 1, label: "Foundational", text: metric.foundational, color: "#922B21", bg: "#FDEDEC", border: "#E6B0AA" },
    { level: 2, label: "Evolving", text: metric.evolving, color: "#7D6608", bg: "#FEF9E7", border: "#F9E79F" },
    { level: 3, label: "Optimised", text: metric.optimised, color: "#1E8449", bg: "#EAFAF1", border: "#A9DFBF" },
  ];
  const currentLevel = rating?.level;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-4 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <h4 className="font-semibold text-gray-800 text-sm">{metric.name}</h4>
          {metric.weight > 0 && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{metric.weight} pts</span>}
          {metric.weight === 0 && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Supplementary</span>}
          {metric.earnout && metric.earnout !== "X" && !isNaN(parseInt(metric.earnout)) && (
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
              <Sparkles size={10} /> £{metric.earnout}k earnout
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {currentLevel && (
            <button onClick={() => onRate(metric.id, null)} className="text-xs text-gray-400 hover:text-red-500 px-1" title="Clear rating">
              <X size={14} />
            </button>
          )}
          <button onClick={() => setShowComment(!showComment)} className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${comment ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
            <MessageSquare size={12} />
            {comment ? "Note" : "Add note"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-0">
        {levels.map(l => {
          const selected = currentLevel === l.level;
          return (
            <button key={l.level} onClick={() => onRate(metric.id, l.level)} className="relative text-left p-3 border-r last:border-r-0 border-gray-100 transition-all hover:shadow-inner" style={{ backgroundColor: selected ? l.bg : "white", borderBottom: selected ? `3px solid ${l.color}` : "3px solid transparent" }}>
              <div className="flex items-center gap-1.5 mb-1.5">
                {selected ? <CheckCircle2 size={14} style={{ color: l.color }} /> : <Circle size={14} className="text-gray-300" />}
                <span className="text-xs font-bold uppercase tracking-wide" style={{ color: selected ? l.color : "#9CA3AF" }}>{l.label}</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: selected ? l.color : "#6B7280" }}>{l.text}</p>
            </button>
          );
        })}
      </div>

      {/* Half-level selector */}
      {currentLevel && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
          <span className="text-xs text-gray-500">Fine-tune:</span>
          {[1, 1.5, 2, 2.5, 3].map(v => (
            <button key={v} onClick={() => onRate(metric.id, v)} className={`text-xs px-2 py-0.5 rounded-full transition-all ${currentLevel === v ? "bg-blue-600 text-white font-bold" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}>
              {v}
            </button>
          ))}
        </div>
      )}

      {showComment && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
          <textarea value={comment} onChange={e => { setComment(e.target.value); onComment(metric.id, e.target.value); }} placeholder="Add evidence notes, reasoning, or commentary..." className="w-full text-xs border border-gray-200 rounded p-2 h-16 resize-none focus:outline-none focus:ring-1 focus:ring-blue-400" />
        </div>
      )}
    </div>
  );
}

function ThemeSidebar({ themes, selectedTheme, onSelect, scores }) {
  return (
    <div className="w-64 min-w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-3 border-b border-gray-200 bg-gray-50">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Growth Themes</h3>
      </div>
      {themes.map(theme => {
        const s = scores?.themeScores?.[theme.id];
        const active = selectedTheme === theme.id;
        return (
          <button key={theme.id} onClick={() => onSelect(theme.id)} className={`w-full text-left px-3 py-2.5 border-b border-gray-100 transition-all flex items-center gap-2 ${active ? "bg-blue-50 border-l-4 border-l-blue-600" : "hover:bg-gray-50 border-l-4 border-l-transparent"}`}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-semibold truncate ${active ? "text-blue-700" : "text-gray-700"}`}>{theme.name}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full transition-all" style={{ width: `${s ? (s.rated / s.total) * 100 : 0}%`, backgroundColor: theme.color }} />
                </div>
                <span className="text-xs text-gray-400">{s?.rated || 0}/{s?.total || theme.metrics.length}</span>
              </div>
            </div>
            {s?.rated === s?.total && s?.total > 0 && <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}

function HeatmapGrid({ ratings }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-bold text-gray-700 mb-3">Maturity Heatmap (All Metrics)</h3>
      <div className="space-y-3">
        {FRAMEWORK.themes.map(theme => (
          <div key={theme.id}>
            <div className="text-xs font-semibold text-gray-500 mb-1">{theme.name}</div>
            <div className="flex flex-wrap gap-1">
              {theme.metrics.map(m => {
                const r = ratings[m.id];
                const lc = levelColor(r?.level);
                return (
                  <div key={m.id} title={`${m.name}: ${levelLabel(r?.level)}`} className="relative group">
                    <div className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold cursor-default border" style={{ backgroundColor: lc.bg, color: lc.text, borderColor: lc.border }}>
                      {r?.level || "-"}
                    </div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-10">
                      {m.name}: {levelLabel(r?.level)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-gray-100 border border-gray-300" /><span className="text-xs text-gray-500">Not rated</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{ backgroundColor: "#FDEDEC" }} /><span className="text-xs text-gray-500">Foundational</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{ backgroundColor: "#FEF9E7" }} /><span className="text-xs text-gray-500">Evolving</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{ backgroundColor: "#EAFAF1" }} /><span className="text-xs text-gray-500">Optimised</span></div>
      </div>
    </div>
  );
}

function StrengthsWeaknesses({ ratings }) {
  const scored = [];
  FRAMEWORK.themes.forEach(t => t.metrics.forEach(m => {
    const r = ratings[m.id];
    if (r?.level && m.weight > 0) scored.push({ ...m, level: r.level, theme: t.name, weightedScore: r.level * m.weight });
  }));
  scored.sort((a, b) => b.weightedScore - a.weightedScore);
  const strengths = scored.filter(m => m.level >= 2.5).slice(0, 5);
  const weaknesses = scored.filter(m => m.level <= 1.5).sort((a, b) => a.level - b.level || b.weight - a.weight).slice(0, 5);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white rounded-lg border border-green-200 p-4">
        <h3 className="text-sm font-bold text-green-700 mb-2 flex items-center gap-1"><Award size={14} /> Top Strengths</h3>
        {strengths.length === 0 ? <p className="text-xs text-gray-400 italic">Rate metrics to see strengths</p> : strengths.map((m, i) => (
          <div key={i} className="flex items-center justify-between py-1.5 border-b border-green-50 last:border-0">
            <div><span className="text-xs font-medium text-gray-700">{m.name}</span><span className="text-xs text-gray-400 ml-1">({m.theme})</span></div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{m.level}</span>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg border border-red-200 p-4">
        <h3 className="text-sm font-bold text-red-700 mb-2 flex items-center gap-1"><AlertCircle size={14} /> Key Improvement Areas</h3>
        {weaknesses.length === 0 ? <p className="text-xs text-gray-400 italic">Rate metrics to see areas for improvement</p> : weaknesses.map((m, i) => (
          <div key={i} className="flex items-center justify-between py-1.5 border-b border-red-50 last:border-0">
            <div><span className="text-xs font-medium text-gray-700">{m.name}</span><span className="text-xs text-gray-400 ml-1">({m.theme})</span></div>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{m.level}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// EXPORT FUNCTIONS
// ═══════════════════════════════════════════════════════════════
const exportToCSV = (assessment, firmName, ratings) => {
  const rows = [["Theme", "Metric", "Weight", "Earnout", "Level", "Label", "Comment"]];
  FRAMEWORK.themes.forEach(t => {
    t.metrics.forEach(m => {
      const r = ratings[m.id];
      rows.push([
        t.name,
        m.name,
        m.weight,
        m.earnout === "X" ? "" : m.earnout,
        r?.level || "",
        levelLabel(r?.level),
        (r?.comment || "").replace(/"/g, '""')
      ]);
    });
  });
  const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${firmName.replace(/\s+/g, "_")}_assessment_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const exportToPDF = (assessment, firmName, scores) => {
  // Create a simple HTML-based printable report
  const printWindow = window.open("", "_blank");
  const date = new Date(assessment.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const themeRows = FRAMEWORK.themes.map(t => {
    const s = scores.themeScores[t.id];
    const earnout = scores.earnout.byTheme[t.id];
    return `<tr>
      <td style="padding:8px;border:1px solid #ddd;">${t.name}</td>
      <td style="padding:8px;border:1px solid #ddd;text-align:center;">${s?.pct || 0}%</td>
      <td style="padding:8px;border:1px solid #ddd;text-align:center;">${s?.rated || 0}/${s?.total || 0}</td>
      <td style="padding:8px;border:1px solid #ddd;text-align:center;">${earnout?.max > 0 ? `£${earnout.score}k / £${earnout.max}k` : "-"}</td>
    </tr>`;
  }).join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Maturity Assessment - ${firmName}</title>
  <style>
    body { font-family: Inter, Arial, sans-serif; padding: 40px; max-width: 900px; margin: 0 auto; }
    h1 { color: #1B4F72; margin-bottom: 5px; }
    h2 { color: #333; border-bottom: 2px solid #1B4F72; padding-bottom: 8px; margin-top: 30px; }
    .subtitle { color: #666; margin-bottom: 30px; }
    .score-card { display: inline-block; padding: 20px 40px; background: #f8f9fa; border-radius: 12px; text-align: center; margin-right: 20px; }
    .score-value { font-size: 48px; font-weight: bold; color: ${scores.pct >= 66 ? "#1E8449" : scores.pct >= 33 ? "#B7950B" : "#922B21"}; }
    .score-label { color: #666; font-size: 14px; }
    .earnout-card { display: inline-block; padding: 20px 40px; background: #f3e8ff; border-radius: 12px; text-align: center; }
    .earnout-value { font-size: 36px; font-weight: bold; color: #7c3aed; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #1B4F72; color: white; padding: 10px; text-align: left; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <h1>Growth Drivers Maturity Assessment</h1>
  <p class="subtitle">${firmName} | ${date}</p>
  
  <div style="margin: 30px 0;">
    <div class="score-card">
      <div class="score-value">${scores.pct}%</div>
      <div class="score-label">Overall Maturity Score</div>
      <div style="font-size:12px;color:#888;margin-top:5px;">${Math.round(scores.totalScore)} / ${scores.totalMaxPossible} points</div>
    </div>
    ${scores.earnout.max > 0 ? `
    <div class="earnout-card">
      <div class="earnout-value">£${scores.earnout.score}k</div>
      <div class="score-label">Projected Earnout</div>
      <div style="font-size:12px;color:#888;margin-top:5px;">${scores.earnout.pct}% of £${scores.earnout.max}k max</div>
    </div>` : ""}
  </div>

  <h2>Theme Breakdown</h2>
  <table>
    <thead><tr><th>Theme</th><th>Score</th><th>Metrics Rated</th><th>Earnout Contribution</th></tr></thead>
    <tbody>${themeRows}</tbody>
  </table>

  <p style="color:#888;font-size:12px;margin-top:40px;text-align:center;">
    Generated by Growth Drivers Maturity Framework | ${new Date().toLocaleDateString("en-GB")}
  </p>
</body>
</html>`;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.print();
};

// ═══════════════════════════════════════════════════════════════
// NEW COMPONENTS - Export, Benchmarks, Earnout, Templates
// ═══════════════════════════════════════════════════════════════

function ExportPanel({ assessment, firmName, scores }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
        <Download size={14} /> Export Assessment
      </h3>
      <div className="flex gap-2">
        <button
          onClick={() => exportToPDF(assessment, firmName, scores)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <FileText size={14} /> Export PDF Report
        </button>
        <button
          onClick={() => exportToCSV(assessment, firmName, assessment.ratings)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          <Download size={14} /> Download CSV
        </button>
      </div>
    </div>
  );
}

function EarnoutSummary({ scores }) {
  if (scores.earnout.max === 0) return null;

  const pct = scores.earnout.pct;
  const color = pct >= 66 ? "#7c3aed" : pct >= 33 ? "#a855f7" : "#c084fc";

  return (
    <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg border border-purple-200 p-4">
      <h3 className="text-sm font-bold text-purple-800 mb-3 flex items-center gap-2">
        <Sparkles size={14} /> Earnout Projection
      </h3>
      <div className="flex items-center gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold" style={{ color }}>£{scores.earnout.score}k</div>
          <div className="text-xs text-purple-600">of £{scores.earnout.max}k potential</div>
        </div>
        <div className="flex-1">
          <div className="bg-purple-200 rounded-full h-3 mb-2">
            <div className="h-3 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
          </div>
          <div className="text-xs text-purple-600">{pct}% earnout achievement based on current ratings</div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-purple-100 grid grid-cols-3 gap-2">
        {FRAMEWORK.themes.filter(t => scores.earnout.byTheme[t.id]?.max > 0).map(t => (
          <div key={t.id} className="text-xs">
            <span className="text-purple-600">{t.name.split(" ")[0]}:</span>
            <span className="font-medium text-purple-800 ml-1">£{scores.earnout.byTheme[t.id].score}k</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BenchmarkComparison({ scores, sector }) {
  const [selectedSector, setSelectedSector] = useState(sector || Object.keys(BENCHMARKS)[0]);
  const benchmark = BENCHMARKS[selectedSector];

  const comparisonData = FRAMEWORK.themes.map(t => ({
    name: t.name.length > 12 ? t.name.substring(0, 11) + "..." : t.name,
    firm: scores.themeScores[t.id]?.pct || 0,
    benchmark: benchmark[t.id] || 50,
    color: t.color,
  }));

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <BarChart3 size={14} /> Industry Benchmark Comparison
        </h3>
        <select
          value={selectedSector}
          onChange={e => setSelectedSector(e.target.value)}
          className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
        >
          {Object.keys(BENCHMARKS).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={comparisonData} layout="vertical" margin={{ left: 10, right: 20 }}>
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
          <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 10 }} />
          <Tooltip formatter={(v, name) => [`${v}%`, name === "firm" ? "Your Firm" : "Industry Avg"]} />
          <Bar dataKey="firm" name="Your Firm" fill="#1B4F72" radius={[0, 4, 4, 0]} />
          <Bar dataKey="benchmark" name="Industry Avg" fill="#94A3B8" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-2 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{ backgroundColor: "#1B4F72" }} /><span className="text-xs text-gray-500">Your Firm</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{ backgroundColor: "#94A3B8" }} /><span className="text-xs text-gray-500">{selectedSector} Average</span></div>
      </div>
    </div>
  );
}

function TemplateSelector({ onSelect, onClose }) {
  return (
    <div className="bg-white rounded-lg border border-blue-200 p-4 mb-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <Copy size={14} /> Start from Template
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={14} /></button>
      </div>
      <p className="text-xs text-gray-500 mb-3">Choose a template to pre-fill ratings based on typical firm profiles:</p>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(TEMPLATES).map(([name, template]) => (
          <button
            key={name}
            onClick={() => onSelect(template.ratings)}
            className="text-left p-3 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{template.icon}</span>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700">{name}</span>
            </div>
            <p className="text-xs text-gray-500">{template.description}</p>
          </button>
        ))}
      </div>
      <button onClick={onClose} className="mt-3 text-xs text-gray-500 hover:text-gray-700">
        Or start with blank assessment →
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// VIEWS
// ═══════════════════════════════════════════════════════════════

function FirmListView({ firms, onCreateFirm, onSelectFirm, onDeleteFirm, assessments }) {
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [sector, setSector] = useState("");

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreateFirm({ id: genId(), name: name.trim(), sector: sector.trim(), createdAt: new Date().toISOString() });
    setName(""); setSector(""); setShowCreate(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Firms</h1>
          <p className="text-sm text-gray-500 mt-1">Select a firm to assess or create a new one</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus size={16} /> New Firm
        </button>
      </div>

      {showCreate && (
        <div className="bg-white rounded-lg border border-blue-200 p-4 mb-4 shadow-sm">
          <h3 className="text-sm font-bold text-gray-700 mb-3">Create New Firm</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Firm name" className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" autoFocus />
            <input value={sector} onChange={e => setSector(e.target.value)} placeholder="Sector (optional)" className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-blue-700">Create</button>
            <button onClick={() => setShowCreate(false)} className="text-gray-500 px-4 py-1.5 rounded text-sm hover:bg-gray-100">Cancel</button>
          </div>
        </div>
      )}

      {firms.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <Building2 size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No firms yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {firms.map(firm => {
            const firmAssessments = Object.values(assessments).filter(a => a.firmId === firm.id);
            const latest = firmAssessments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
            const latestScores = latest ? calcScores(latest.ratings) : null;
            return (
              <div key={firm.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group" onClick={() => onSelectFirm(firm.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: "#1B4F72" }}>
                      {firm.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{firm.name}</h3>
                      <p className="text-xs text-gray-400">{firm.sector || "No sector"} &middot; {firmAssessments.length} assessment{firmAssessments.length !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {latestScores && (
                      <div className="text-right">
                        <div className="text-lg font-bold" style={{ color: latestScores.pct >= 66 ? "#1E8449" : latestScores.pct >= 33 ? "#B7950B" : "#922B21" }}>{latestScores.pct}%</div>
                        <div className="text-xs text-gray-400">{latestScores.ratedCount}/{latestScores.totalMetrics} rated</div>
                      </div>
                    )}
                    <button onClick={e => { e.stopPropagation(); onDeleteFirm(firm.id); }} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 p-1 transition-all" title="Delete firm">
                      <Trash2 size={14} />
                    </button>
                    <ChevronRight size={16} className="text-gray-300" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FirmDetailView({ firm, assessments, onCreateAssessment, onSelectAssessment, onBack }) {
  const [showTemplates, setShowTemplates] = useState(false);
  const firmAssessments = Object.values(assessments).filter(a => a.firmId === firm.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleCreateWithTemplate = (templateRatings) => {
    onCreateAssessment(firm.id, templateRatings);
    setShowTemplates(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"><ArrowLeft size={14} /> Back to Firms</button>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{firm.name}</h1>
          <p className="text-sm text-gray-500">{firm.sector || "Professional Services"}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowTemplates(!showTemplates)} className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">
            <Copy size={16} /> From Template
          </button>
          <button onClick={() => onCreateAssessment(firm.id)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            <Plus size={16} /> New Assessment
          </button>
        </div>
      </div>

      {showTemplates && (
        <TemplateSelector
          onSelect={handleCreateWithTemplate}
          onClose={() => setShowTemplates(false)}
        />
      )}

      {firmAssessments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <ClipboardCheck size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No assessments yet. Start one to begin evaluating this firm.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {firmAssessments.map(a => {
            const scores = calcScores(a.ratings);
            return (
              <div key={a.id} onClick={() => onSelectAssessment(a.id)} className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">Assessment - {new Date(a.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{scores.ratedCount}/{scores.totalMetrics} metrics rated</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-lg font-bold" style={{ color: scores.pct >= 66 ? "#1E8449" : scores.pct >= 33 ? "#B7950B" : "#922B21" }}>{scores.pct}%</div>
                      <div className="text-xs text-gray-400">{scores.totalScore} / {scores.totalMaxPossible}</div>
                    </div>
                    <ChevronRight size={16} className="text-gray-300" />
                  </div>
                </div>
                <div className="mt-2 bg-gray-100 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-blue-500 transition-all" style={{ width: `${(scores.ratedCount / scores.totalMetrics) * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AssessmentView({ assessment, onRate, onComment, onBack }) {
  const [selectedTheme, setSelectedTheme] = useState(FRAMEWORK.themes[0].id);
  const scores = calcScores(assessment.ratings);
  const theme = FRAMEWORK.themes.find(t => t.id === selectedTheme);

  return (
    <div className="flex h-full">
      <ThemeSidebar themes={FRAMEWORK.themes} selectedTheme={selectedTheme} onSelect={setSelectedTheme} scores={scores} />
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-gray-400 hover:text-gray-600"><ArrowLeft size={16} /></button>
            <div>
              <h2 className="text-lg font-bold" style={{ color: theme.color }}>{theme.name}</h2>
              <p className="text-xs text-gray-400">{theme.metrics.length} metrics &middot; {theme.totalWeight} valuation points</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-gray-400">Theme Score</div>
              <div className="text-sm font-bold" style={{ color: theme.color }}>{scores.themeScores[theme.id]?.pct || 0}%</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">Overall</div>
              <div className="text-sm font-bold text-blue-600">{scores.pct}% ({scores.ratedCount}/{scores.totalMetrics})</div>
            </div>
          </div>
        </div>
        <div className="p-4">
          {theme.metrics.map(m => (
            <MetricCard key={m.id} metric={m} rating={assessment.ratings[m.id]} onRate={onRate} onComment={onComment} />
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardView({ assessment, firmName, firmSector, onBack }) {
  const scores = calcScores(assessment.ratings);

  const radarData = FRAMEWORK.themes.map(t => ({
    theme: t.name.length > 15 ? t.name.substring(0, 14) + "..." : t.name,
    fullName: t.name,
    score: scores.themeScores[t.id]?.pct || 0,
    fullMark: 100,
  }));

  const barData = FRAMEWORK.themes.map(t => ({
    name: t.name.length > 12 ? t.name.substring(0, 11) + "..." : t.name,
    score: scores.themeScores[t.id]?.score || 0,
    max: scores.themeScores[t.id]?.max || 0,
    pct: scores.themeScores[t.id]?.pct || 0,
    color: t.color,
  }));

  return (
    <div className="overflow-y-auto p-6">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"><ArrowLeft size={14} /> Back</button>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{firmName} - Maturity Dashboard</h1>
          <p className="text-sm text-gray-500">Assessment from {new Date(assessment.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
        <ScoreGauge score={scores.totalScore} max={scores.totalMaxPossible} label="Overall Maturity" />
      </div>

      {/* Earnout Summary - Only shows if there are earnout metrics */}
      {scores.earnout.max > 0 && (
        <div className="mb-4">
          <EarnoutSummary scores={scores} />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-bold text-gray-700 mb-2">Maturity Profile</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#E5E7EB" />
              <PolarAngleAxis dataKey="theme" tick={{ fontSize: 10, fill: "#6B7280" }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} />
              <Radar name="Score" dataKey="score" stroke="#1B4F72" fill="#1B4F72" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-bold text-gray-700 mb-2">Theme Scores</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
              <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
                {barData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Benchmark Comparison */}
      <div className="mb-4">
        <BenchmarkComparison scores={scores} sector={firmSector} />
      </div>

      <div className="mb-4">
        <StrengthsWeaknesses ratings={assessment.ratings} />
      </div>

      <div className="mb-4">
        <HeatmapGrid ratings={assessment.ratings} />
      </div>

      {/* Export Panel */}
      <ExportPanel assessment={assessment} firmName={firmName} scores={scores} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [state, setState] = useState(() => {
    const saved = loadState();
    return saved || { firms: [], assessments: {} };
  });
  const [view, setView] = useState("firms");
  const [selectedFirmId, setSelectedFirmId] = useState(null);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);
  const [dashboardAssessmentId, setDashboardAssessmentId] = useState(null);

  useEffect(() => { saveState(state); }, [state]);

  const createFirm = (firm) => setState(s => ({ ...s, firms: [...s.firms, firm] }));
  const deleteFirm = (id) => {
    setState(s => {
      const assessments = { ...s.assessments };
      Object.keys(assessments).forEach(k => { if (assessments[k].firmId === id) delete assessments[k]; });
      return { firms: s.firms.filter(f => f.id !== id), assessments };
    });
  };
  const createAssessment = (firmId, templateRatings = {}) => {
    const id = genId();
    // Convert template ratings to proper format with level property
    const ratings = {};
    Object.entries(templateRatings).forEach(([metricId, level]) => {
      ratings[metricId] = { level, updatedAt: new Date().toISOString() };
    });
    setState(s => ({ ...s, assessments: { ...s.assessments, [id]: { id, firmId, createdAt: new Date().toISOString(), ratings } } }));
    setSelectedAssessmentId(id);
    setView("assess");
  };
  const rateMetric = useCallback((metricId, level) => {
    setState(s => {
      const a = s.assessments[selectedAssessmentId];
      if (!a) return s;
      const ratings = { ...a.ratings };
      if (level === null) { delete ratings[metricId]; }
      else { ratings[metricId] = { ...ratings[metricId], level, updatedAt: new Date().toISOString() }; }
      return { ...s, assessments: { ...s.assessments, [selectedAssessmentId]: { ...a, ratings } } };
    });
  }, [selectedAssessmentId]);
  const commentMetric = useCallback((metricId, comment) => {
    setState(s => {
      const a = s.assessments[selectedAssessmentId];
      if (!a) return s;
      const ratings = { ...a.ratings };
      ratings[metricId] = { ...ratings[metricId], comment };
      return { ...s, assessments: { ...s.assessments, [selectedAssessmentId]: { ...a, ratings } } };
    });
  }, [selectedAssessmentId]);

  const selectedFirm = state.firms.find(f => f.id === selectedFirmId);
  const selectedAssessment = state.assessments[selectedAssessmentId];
  const dashboardAssessment = state.assessments[dashboardAssessmentId];
  const dashboardFirm = dashboardAssessment ? state.firms.find(f => f.id === dashboardAssessment.firmId) : selectedFirm;

  const navItems = [
    { id: "firms", label: "Firms", icon: Building2 },
    { id: "assess", label: "Assess", icon: ClipboardCheck, disabled: !selectedAssessmentId },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, disabled: !selectedAssessmentId },
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-900 flex items-center justify-center">
            <Target size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-800 leading-tight">Growth Drivers Maturity Framework</h1>
            <p className="text-xs text-gray-400">M&A Due Diligence Assessment Platform</p>
          </div>
        </div>
        <nav className="flex items-center gap-1">
          {navItems.map(n => (
            <button key={n.id} disabled={n.disabled} onClick={() => {
              if (n.id === "dashboard" && selectedAssessmentId) { setDashboardAssessmentId(selectedAssessmentId); }
              setView(n.id);
            }} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${view === n.id ? "bg-blue-50 text-blue-700" : n.disabled ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-100"}`}>
              <n.icon size={14} /> {n.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-hidden">
        {view === "firms" && !selectedFirmId && (
          <FirmListView firms={state.firms} onCreateFirm={createFirm} onSelectFirm={id => { setSelectedFirmId(id); setView("firmDetail"); }} onDeleteFirm={deleteFirm} assessments={state.assessments} />
        )}
        {view === "firmDetail" && selectedFirm && (
          <FirmDetailView firm={selectedFirm} assessments={state.assessments} onCreateAssessment={createAssessment} onSelectAssessment={id => { setSelectedAssessmentId(id); setView("assess"); }} onBack={() => { setSelectedFirmId(null); setView("firms"); }} />
        )}
        {view === "assess" && selectedAssessment && (
          <AssessmentView assessment={selectedAssessment} onRate={rateMetric} onComment={commentMetric} onBack={() => { setView("firmDetail"); }} />
        )}
        {view === "dashboard" && (dashboardAssessment || selectedAssessment) && (
          <DashboardView
            assessment={dashboardAssessment || selectedAssessment}
            firmName={dashboardFirm?.name || "Firm"}
            firmSector={dashboardFirm?.sector}
            onBack={() => setView("assess")}
          />
        )}
      </main>
    </div>
  );
}
