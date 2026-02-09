import { useState, useEffect, useMemo, useCallback } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { Building2, ClipboardCheck, LayoutDashboard, Plus, ChevronRight, CheckCircle2, Circle, AlertCircle, Home, TrendingUp, Target, Award, MessageSquare, ArrowLeft, Trash2, Download, FileText, BarChart3, Copy, X } from "lucide-react";
// ÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂ
// FRAMEWORK DATA - All 47 metrics from the Growth Drivers spreadsheet
// ÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂ
const FRAMEWORK = {
  themes: [
    {
      id: "financial", name: "Financial Performance", icon: "pound", totalWeight: 600, color: "#1B4F72",
      metrics: [
        { id: "fin_revenue", name: "Revenue Growth & Profitability", question: "How consistently are you achieving year-over-year revenue growth and profitability?", weight: 100, foundational: "Revenue growth <5% per year, low or inconsistent profitability, reliance on a few large projects", evolving: "Revenue growth 5-10% per year, moderate profitability, some diversification of revenue streams", optimised: "Revenue growth >10% per year, strong profitability with predictable, diversified revenue streams and high-margin services" },
        { id: "fin_gm", name: "Gross Margin", question: "What is your current gross margin?", weight: 100, foundational: "Gross margin <40%, cost overruns are frequent, and pricing is reactive rather than strategic", evolving: "Gross margin 40-50%, some cost control measures in place, but efficiency improvements still needed", optimised: "Gross margin >50%, strong cost control, pricing strategy optimised for profitability and scalability" },
        { id: "fin_ebitda", name: "EBITDA %", question: "What is your EBITDA margin?", weight: 100, foundational: "EBITDA margin <10%, low cash generation, high cost-to-revenue ratio", evolving: "EBITDA margin 10-20%, improving operational efficiency, but some volatility in profitability", optimised: "EBITDA margin >20%, strong financial discipline, consistent year-over-year growth" },
        { id: "fin_cash", name: "Cash Flow", question: "How consistent and positive is your free cash flow?", weight: 100, foundational: "Free cash flow is negative or low, debtor days >60, frequent working capital constraints", evolving: "Free cash flow is positive but inconsistent, debtor days 45-60, some cash reserves maintained", optimised: "Free cash flow is consistently strong, debtor days <45, 80%+ cash flow conversion from EBITDA" },
        { id: "fin_quality", name: "Quality of Revenue", question: "How high-quality and recurring is your revenue base?", weight: 100, foundational: "Recurring/repeat revenue <10%, heavy reliance on new business development, volatile income streams", evolving: "Recurring/repeat revenue 10-30%, some multi-year contracts, but still significant project-based work", optimised: "Recurring/repeat revenue >30%, long-term client contracts, high revenue predictability" },
        { id: "fin_rate", name: "Blended Rate Card", question: "What is your average day rate and implementation of this?", weight: 100, foundational: "Average daily rate <\u00A31,000, frequent discounting, weak commercial discipline", evolving: "Average daily rate \u00A31,000-\u00A31,500, some rate consistency, but discounting still occurs", optimised: "Average daily rate >\u00A31,500, strong commercial discipline, pricing reflects market leadership and value" },
      ]
    },
    {
      id: "people", name: "People", icon: "users", totalWeight: 425, color: "#6C3483",
      metrics: [
        { id: "ppl_talent", name: "Talent & Competence Management", question: "How comprehensive and structured is your talent and competency management framework?", weight: 100, foundational: "One or none of: detailed competency framework; consistent training and mentoring structure; annual appraisal system; clear role definitions", evolving: "2-3 of these: detailed competency framework; consistent training and mentoring structure; annual appraisal system; clear role definitions", optimised: "All of these: detailed competency framework; consistent training and mentoring structure; annual appraisal system; clear role definitions" },
        { id: "ppl_exp", name: "Employee Experience", question: "What is your internal employee satisfaction or GlassDoor rating?", weight: 100, foundational: "Internal NPS below 40 (or not measured) and Glassdoor rating below 3.5", evolving: "Internal NPS rating below 40 (or not measured) OR Glassdoor rating below 4", optimised: "Internal NPS rating 40+ AND Glassdoor rating above 4" },
        { id: "ppl_recruit", name: "Recruitment", question: "How effectively structured and targeted is your recruitment process?", weight: 100, foundational: "Low (0-3) qualified applicants per job. Vague or unarticulated Employee Value Proposition", evolving: "Medium (3-7) qualified applicants per job. Vague or unarticulated Employee Value Proposition", optimised: "High (7+) qualified applicants per job. Clear Employee Value Proposition" },
        { id: "ppl_churn", name: "Churn & Attrition", question: "What is your annual attrition rate, and how effective are your retention strategies?", weight: 100, foundational: "Attrition >25% annually", evolving: "Attrition between 15-25%", optimised: "Attrition <15%, strong retention strategies" },
        { id: "ppl_wf", name: "Workforce Composition", question: "How reliant are you on delivery teams composed of contractors versus permanent employees?", weight: 25, foundational: ">50% of delivery team are contractors, low organisational knowledge retention", evolving: "30-50% of delivery team are contractors, some investment in permanent teams", optimised: "<30% of delivery team are contractors, strong internal capability and knowledge retention" },
      ]
    },
    {
      id: "services", name: "Services & Pricing", icon: "tag", totalWeight: 300, color: "#1A5276",
      metrics: [
        { id: "srv_prop", name: "Market Proposition", question: "How clearly is your market proposition defined and differentiated from competitors?", weight: 100, foundational: "Vague market positioning, low differentiation from competitors, low focus on specific client pain points", evolving: "Some differentiation but client pain points or benefits are vague", optimised: "Clearly defined, differentiated value proposition(s) focus on clear client needs and benefits" },
        { id: "srv_innov", name: "Service Innovation", question: "What percentage of your revenue is put towards service development / creation?", weight: 25, foundational: "No structured investment (<2% of revenue)", evolving: "3-5% of revenue reinvested in service development", optimised: ">5% of revenue reinvested in service innovation" },
        { id: "srv_ip", name: "Service IP", question: "To what extent is your delivery supported by proprietary or IP-based content?", weight: 100, foundational: "<10% of delivery supported by proprietary IP", evolving: "10%-30% of delivery incorporates proprietary IP", optimised: ">30% of delivery is productised or IP-based" },
        { id: "srv_size", name: "Project Size", question: "What is your average project size?", weight: 50, foundational: "Average contract size less than \u00A350k", evolving: "Average project size \u00A350k-\u00A3250k", optimised: "Average project size \u00A3250k+" },
        { id: "srv_price", name: "Pricing Strategy", question: "What percentage of your work is charged as value-based pricing or fixed price?", weight: 25, foundational: "Ad-hoc pricing; low understanding of price elasticity", evolving: "Some structured pricing models but inconsistent", optimised: "Data-driven pricing strategy, strong market positioning" },
      ]
    },
    {
      id: "vision", name: "Vision & Strategy", icon: "compass", totalWeight: 300, color: "#117A65",
      metrics: [
        { id: "vis_market", name: "Market/Niche Focus", question: "What is the current growth rate of your market/niche?", weight: 100, foundational: "Low growth / cold sector (e.g. Project Management)", evolving: "Medium growth / warm sector (e.g. Environmental)", optimised: "High growth / hot sector (e.g. AI Consulting or Finance)" },
        { id: "vis_comp", name: "Competitors & Barriers to Entry", question: "How intense is the competition or how high are barriers to entry in your market?", weight: 75, foundational: "High competition with 10+ direct competitors offering similar services and low barriers to entry", evolving: "Moderate competition with 5-10 competitors, some differentiation through IP or niche specialisation", optimised: "Low competition with <5 competitors in the same niche, strong barriers to entry through proprietary IP or brand authority" },
        { id: "vis_align", name: "Strategic Alignment", question: "To what extent is ESG integrated into your business strategy?", weight: 50, foundational: "Strategy is misaligned across teams", evolving: "Some alignment, but execution inconsistencies", optimised: "Strategy is well-defined and fully aligned" },
        { id: "vis_plan", name: "Business Planning", question: "How structured and regularly updated is your business planning process?", weight: 75, foundational: "No formal business plan or planning occurs reactively, with no structured forecasting", evolving: "Business planning conducted annually, with some structured financial and strategic forecasting", optimised: "Business planning is a quarterly rolling process, with 3-5 year strategic plans and real-time performance tracking" },
        { id: "vis_esg", name: "ESG", question: "How strong is your forward visibility of revenue, margin and utilisation?", weight: 0, foundational: "No formal ESG strategy, no tracking of environmental or social impact", evolving: "Basic ESG policy in place, some initiatives but no structured reporting", optimised: "Fully embedded ESG strategy with measurable KPIs and transparent annual reporting" },
      ]
    },
    {
      id: "sales", name: "Sales & Pipeline", icon: "trending-up", totalWeight: 275, color: "#B7950B",
      metrics: [
        { id: "sal_pipe", name: "Pipeline Visibility", question: "How much of the next 12 months' revenue do you currently have booked?", weight: 75, foundational: "<40% of next 12 months' revenue booked", evolving: "40-70% of next 12 months' revenue booked", optimised: ">70% of next 12 months' revenue booked" },
        { id: "sal_conv", name: "Conversion Ratios", question: "What is your typical proposal-to-project conversion ratio?", weight: 50, foundational: "<25% proposal conversion rate", evolving: "25%-50% proposal conversion rate", optimised: ">50% proposal conversion rate" },
        { id: "sal_mgmt", name: "Sales Management", question: "How structured and effective is your sales management system?", weight: 75, foundational: "Weak sales management: weak reporting or data. CRM not well integrated", evolving: "Improved sales management. CRM used, but not consistently by all", optimised: "Strong sales management by top-ranked senior. Weekly meetings driven by CRM-related data" },
        { id: "sal_skills", name: "Sales Skills & Processes", question: "How well-defined and effective are your sales mentoring and training systems?", weight: 75, foundational: "No structured sales training/processes", evolving: "Some structured sales processes, but inconsistently applied", optimised: "Highly structured, repeatable sales process" },
      ]
    },
    {
      id: "clients", name: "Clients & Relationships", icon: "handshake", totalWeight: 250, color: "#922B21",
      metrics: [
        { id: "cli_conc", name: "Client Concentration & Risk", question: "How concentrated is your revenue among your top three clients?", weight: 100, foundational: "Top 3 clients contribute >50% of total revenue, high dependency on a few key relationships", evolving: "Top 3 clients contribute 30-50% of total revenue, moderate diversification", optimised: "Top 3 clients contribute <30% of total revenue, well-diversified client base" },
        { id: "cli_long", name: "Client Longevity", question: "What is your average client tenure?", weight: 100, foundational: "Average client tenure <6 months, transactional relationships, low retention", evolving: "Average client tenure 6-24 months, some long-term relationships", optimised: "Average client tenure >2 years, high retention rate, strong account management" },
        { id: "cli_size", name: "Client Size", question: "What is the typical size of your client contracts?", weight: 25, foundational: "Majority of clients are small contracts (<\u00A350k annual spend)", evolving: "Mix of small and mid-sized clients, with 20%+ of revenue from mid-tier (\u00A350k-\u00A3250k)", optimised: "30%+ of revenue from large clients (\u00A3250k+ per year), strategic account penetration" },
        { id: "cli_part", name: "Partnerships & Alliances", question: "How structured and beneficial are your strategic partnerships and alliances?", weight: 25, foundational: "No formal partnerships, occasional ad hoc collaborations", evolving: "1-3 strategic partnerships, contributing <10% of revenue", optimised: "3+ strong partnerships, contributing >15% of revenue, integrated into go-to-market" },
      ]
    },
    {
      id: "leadership", name: "Leadership & Governance", icon: "shield", totalWeight: 250, color: "#4A235A",
      metrics: [
        { id: "led_team", name: "Senior Leadership Team", question: "How experienced and strategically skilled is your senior leadership team?", weight: 100, foundational: "Weak leadership team", evolving: "Improving leadership team", optimised: "Very experienced leadership team with experience of M&A" },
        { id: "led_deleg", name: "Delegation & Succession", question: "How clearly defined are your delegation and succession planning processes?", weight: 100, foundational: "Founders drive most key decisions", evolving: "Some delegation, but founder dependence remains", optimised: "CEO and leadership team operate independently" },
        { id: "led_gov", name: "Governance & Controls", question: "How robust are your governance and control mechanisms?", weight: 50, foundational: "One or none of: Strong advisory board; Strong governance for decision-making; Strong strategic reporting", evolving: "Two of these: Strong advisory board; Strong governance; Strong strategic reporting", optimised: "All three: Strong advisory board; Strong governance for decision-making; Strong strategic reporting" },
      ]
    },
    {
      id: "cost", name: "Cost Optimisation", icon: "calculator", totalWeight: 250, color: "#1E8449",
      metrics: [
        { id: "cos_deliv", name: "Delivery Model", question: "How efficient and optimised is your current delivery model?", weight: 25, foundational: "Delivery is fully onshore, cost inefficiencies", evolving: "Some offshore delivery, but limited efficiency gains", optimised: "Optimised delivery mix with offshore efficiencies" },
        { id: "cos_tech", name: "Technology Maturity", question: "What is the maturity level of your technology infrastructure (CRM, PSA, HCM)?", weight: 75, foundational: "Limited use of CRM, PSA, or automation", evolving: "Basic adoption of CRM, PSA, and some automation", optimised: "Fully integrated digital ecosystem (CRM, PSA, AI)" },
        { id: "cos_scale", name: "Scaling Infrastructure", question: "What is your average utilisation rate for consultants?", weight: 75, foundational: "<20% of core business processes automated or AI-supported", evolving: "20-50% of core business processes automated, with partial AI-driven analytics", optimised: ">50% of processes automated, with AI and RPA fully embedded in operations" },
        { id: "cos_data", name: "Data Maturity", question: "How mature is your approach to data management and analytics?", weight: 75, foundational: "Data fragmented, manual reporting", evolving: "Some structured reporting, data inconsistencies", optimised: "Automated, real-time data-driven reporting" },
        { id: "cos_lever", name: "Leverage", question: "What is your use of AI and Automation?", weight: 0, foundational: "Leverage ratio >3.5x EBITDA, high debt burden", evolving: "Leverage ratio 2.0-3.5x EBITDA, manageable debt", optimised: "Leverage ratio <2.0x EBITDA, strong financial flexibility" },
        { id: "cos_know", name: "Knowledge", weight: 0, foundational: "<20% of knowledge is codified, minimal documentation", evolving: "20-50% of knowledge is documented, some use of knowledge management tools", optimised: ">50% of knowledge is structured and documented, KM systems fully integrated" },
        { id: "cos_resrc", name: "Resourcing", weight: 0, foundational: "Utilisation <60%, poor visibility on resource allocation", evolving: "Utilisation 60-75%, some workforce planning but reactive deployment", optimised: "Utilisation >75%, proactive resource planning and demand forecasting" },
      ]
    },
    {
      id: "delivery", name: "Delivery", icon: "check-square", totalWeight: 175, color: "#2E86C1",
      metrics: [
        { id: "del_sat", name: "Client Satisfaction", question: "How structured and effective is your client satisfaction measurement (NPS)?", weight: 75, foundational: "No structured feedback mechanisms (NPS <20)", evolving: "Periodic feedback collection, NPS 20-50", optimised: "Advanced feedback mechanisms, NPS >50" },
        { id: "del_util", name: "Utilisation", question: "What percentage of your staff are billable?", weight: 50, foundational: "Utilisation <60%", evolving: "Utilisation 60-75%", optimised: "Utilisation >75%" },
        { id: "del_qa", name: "Quality Assurance", question: "How robust are your quality assurance standards?", weight: 50, foundational: "No formal QA standards", evolving: "Some QA standards in place, inconsistent adherence", optimised: "Robust QA framework throughout project delivery, consistently applied" },
      ]
    },
    {
      id: "market", name: "Market Profile", icon: "globe", totalWeight: 175, color: "#CA6F1E",
      metrics: [
        { id: "mkt_size", name: "Market Size & Growth Potential", question: "How clearly defined and executed is your branding strategy?", weight: 25, foundational: "Small maximum market (less than $500m)", evolving: "Medium maximum market ($500m-1bn)", optimised: "Large maximum market (>$1bn)" },
        { id: "mkt_mktg", name: "Marketing Influence on Revenue", question: "What percentage of your revenue is directly influenced by marketing activities?", weight: 50, foundational: "<5% of revenue influenced by marketing", evolving: "5-15% of revenue influenced by marketing", optimised: "15%+ of revenue driven by marketing" },
        { id: "mkt_award", name: "Awards & Recognition", question: "How many national or industry awards have you won in the past three years?", weight: 50, foundational: "No national or industry awards won in the past three years", evolving: "1-2 national or industry awards won in the past three years", optimised: "3+ national or industry awards, with external validation from major industry bodies" },
        { id: "mkt_thought", name: "Thought Leadership", question: "How active and recognised is your thought leadership?", weight: 50, foundational: "No thought leadership content published in past 6 months", evolving: "2-3 pieces of thought leadership content published monthly", optimised: "Recognised industry thought leader, 4+ high-impact pieces monthly with significant recognition" },
        { id: "mkt_brand", name: "Branding", question: "What is your brand awareness and market recognition level?", weight: 0, foundational: "No defined brand strategy, weak recognition outside existing clients", evolving: "Some brand recognition, 1-2 external PR initiatives annually", optimised: "Recognised industry brand with strong external presence driving inbound opportunities" },
      ]
    },
  ]
};

const TOTAL_MAX_SCORE = FRAMEWORK.themes.reduce((sum, t) => sum + t.metrics.reduce((s, m) => s + m.weight * 3, 0), 0);
const TOTAL_WEIGHTED_POINTS = FRAMEWORK.themes.reduce((sum, t) => sum + t.totalWeight, 0); // 3000

// ÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂ
// INDUSTRY BENCHMARKS - Average scores by sector
// ÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂ
const BENCHMARKS = {
  "Professional Services": {
    financial: 58, people: 55, services: 58, vision: 56, sales: 49,
    clients: 58, leadership: 58, cost: 51, delivery: 61, market: 51
  }
};

// ÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂ
// ASSESSMENT TEMPLATES - Pre-configured starting points
// ÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂ
const TEMPLATES = {
  "Top Performer": {
    description: "High-performing firm ready for acquisition",
    icon: "ÃÂÃÂ°ÃÂÃÂÃÂÃÂÃÂÃÂ",
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
    icon: "ÃÂÃÂ°ÃÂÃÂÃÂÃÂÃÂÃÂ",
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
    icon: "ÃÂÃÂ°ÃÂÃÂÃÂÃÂÃÂÃÂ§",
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
    icon: "ÃÂÃÂ°ÃÂÃÂÃÂÃÂÃÂÃÂ»",
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

// ÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂ
// STATE MANAGEMENT
// ÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂ
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

// ÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂ
// DEMO DATA - Sample firms and assessments for demonstration
// ÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂ
const generateDemoData = () => {
  // Helper to create ratings with timestamps
  const createRating = (level, comment = "") => ({
    level,
    comment,
    updatedAt: new Date(Date.now() - Math.random() * 86400000).toISOString()
  });

  // Demo Firm 1: Apex Consulting (Top Performer)
  const apexRatings = {
    // Financial Performance
    fin_revenue: createRating(3, "Strong 15% YoY growth with diversified revenue"),
    fin_gm: createRating(3, "Consistent 55% gross margin"),
    fin_ebitda: createRating(2.5, "EBITDA at 22%, improving trend"),
    fin_cash: createRating(3, "Excellent cash conversion, 35 day debtors"),
    fin_quality: createRating(2.5, "35% recurring revenue from retainers"),
    fin_rate: createRating(3, "Average day rate ÃÂÃÂÃÂÃÂ£1,800"),
    // People
    ppl_talent: createRating(3, "Full competency framework implemented"),
    ppl_exp: createRating(2.5, "Glassdoor 4.2, eNPS 45"),
    ppl_recruit: createRating(3, "Strong employer brand, 12 applicants per role"),
    ppl_churn: createRating(2.5, "Attrition at 18%, improving"),
    ppl_wf: createRating(3, "85% permanent staff"),
    // Services & Pricing
    srv_prop: createRating(2.5, "Clear differentiation in digital transformation"),
    srv_innov: createRating(2, "4% R&D investment"),
    srv_ip: createRating(3, "Proprietary methodology and tools"),
    srv_size: createRating(3, "Average deal size ÃÂÃÂÃÂÃÂ£320k"),
    srv_price: createRating(2.5, "Value-based pricing model"),
    // Vision & Strategy
    vis_market: createRating(3, "AI consulting - hot sector"),
    vis_comp: createRating(2.5, "Strong differentiation, 4 direct competitors"),
    vis_align: createRating(3, "Quarterly strategy reviews, full alignment"),
    vis_plan: createRating(3, "Rolling 5-year plan with quarterly updates"),
    vis_esg: createRating(2, "ESG policy in place"),
    // Sales & Pipeline
    sal_pipe: createRating(3, "78% of next 12 months booked"),
    sal_conv: createRating(2.5, "45% win rate"),
    sal_mgmt: createRating(3, "CRM driven, weekly pipeline reviews"),
    sal_skills: createRating(3, "MEDDIC methodology trained"),
    // Clients & Relationships
    cli_conc: createRating(2.5, "Top 3 clients at 28%"),
    cli_long: createRating(3, "Average tenure 4.2 years"),
    cli_size: createRating(3, "42% from ÃÂÃÂÃÂÃÂ£250k+ clients"),
    cli_part: createRating(2.5, "Microsoft and Salesforce partnerships"),
    // Leadership & Governance
    led_team: createRating(3, "Ex-Big 4 leadership with M&A experience"),
    led_deleg: createRating(2.5, "CEO stepping back, strong deputies"),
    led_gov: createRating(3, "Advisory board with PE representation"),
    // Cost Optimisation
    cos_deliv: createRating(2, "10% nearshore delivery"),
    cos_tech: createRating(3, "Fully integrated CRM, PSA, BI stack"),
    cos_scale: createRating(2.5, "45% process automation"),
    cos_data: createRating(3, "Real-time dashboards and reporting"),
    cos_lever: createRating(3, "Zero debt"),
    cos_know: createRating(2.5, "Confluence-based knowledge management"),
    cos_resrc: createRating(3, "82% utilisation"),
    // Delivery
    del_sat: createRating(3, "NPS 62, quarterly surveys"),
    del_util: createRating(3, "82% billable utilisation"),
    del_qa: createRating(2.5, "QA gates on all projects"),
    // Market Profile
    mkt_size: createRating(3, "Large addressable market ÃÂÃÂÃÂÃÂ£2bn+"),
    mkt_mktg: createRating(2.5, "12% of revenue marketing-influenced"),
    mkt_award: createRating(3, "MCA winner 2024, shortlisted 2025"),
    mkt_thought: createRating(3, "6 whitepapers, regular speaking slots"),
    mkt_brand: createRating(2.5, "Strong sector recognition")
  };

  // Demo Firm 2: TechBridge Solutions (Mid-Market)
  const techbridgeRatings = {
    fin_revenue: createRating(2, "8% growth, stable"),
    fin_gm: createRating(2, "Gross margin 44%"),
    fin_ebitda: createRating(2, "EBITDA 15%"),
    fin_cash: createRating(1.5, "Cash conversion needs work, 52 day debtors"),
    fin_quality: createRating(1.5, "15% recurring revenue"),
    fin_rate: createRating(2, "Day rate ÃÂÃÂÃÂÃÂ£1,150"),
    ppl_talent: createRating(2, "Competency framework exists, inconsistent"),
    ppl_exp: createRating(2, "Glassdoor 3.8"),
    ppl_recruit: createRating(1.5, "4 applicants per role"),
    ppl_churn: createRating(2, "22% attrition"),
    ppl_wf: createRating(2, "40% contractors"),
    srv_prop: createRating(2, "Good capability, weak messaging"),
    srv_innov: createRating(1.5, "Ad-hoc R&D"),
    srv_ip: createRating(2, "Some reusable accelerators"),
    srv_size: createRating(2, "Average deal ÃÂÃÂÃÂÃÂ£85k"),
    srv_price: createRating(1.5, "Cost-plus pricing"),
    vis_market: createRating(2, "Cloud migration - warm sector"),
    vis_comp: createRating(2, "Moderate differentiation"),
    vis_align: createRating(1.5, "Strategy exists but not cascaded"),
    vis_plan: createRating(2, "Annual planning cycle"),
    vis_esg: createRating(1, "Basic policy only"),
    sal_pipe: createRating(2, "55% visibility"),
    sal_conv: createRating(2, "35% win rate"),
    sal_mgmt: createRating(1.5, "CRM adoption patchy"),
    sal_skills: createRating(2, "Some sales training"),
    cli_conc: createRating(1.5, "Top 3 at 45%"),
    cli_long: createRating(2, "18 month average tenure"),
    cli_size: createRating(2, "Mix of SMB and mid-market"),
    cli_part: createRating(1.5, "One AWS partnership"),
    led_team: createRating(2, "Capable leadership"),
    led_deleg: createRating(1.5, "Founder still involved in sales"),
    led_gov: createRating(2, "Basic governance"),
    cos_deliv: createRating(1.5, "All onshore"),
    cos_tech: createRating(2, "Basic CRM and PSA"),
    cos_scale: createRating(1.5, "25% automation"),
    cos_data: createRating(2, "Monthly reporting pack"),
    cos_lever: createRating(2, "Manageable debt"),
    cos_know: createRating(1.5, "Informal knowledge sharing"),
    cos_resrc: createRating(2, "68% utilisation"),
    del_sat: createRating(2, "NPS 38"),
    del_util: createRating(2, "68% billable"),
    del_qa: createRating(2, "QA on larger projects"),
    mkt_size: createRating(2, "Medium market"),
    mkt_mktg: createRating(1.5, "Minimal marketing ROI tracking"),
    mkt_award: createRating(1.5, "Regional award winner"),
    mkt_thought: createRating(1.5, "Occasional blog posts"),
    mkt_brand: createRating(1.5, "Known locally")
  };

  // Demo Firm 3: Phoenix Advisory (Turnaround)
  const phoenixRatings = {
    fin_revenue: createRating(1, "Flat revenue, margin pressure"),
    fin_gm: createRating(1.5, "GM 38%"),
    fin_ebitda: createRating(1, "EBITDA 8%"),
    fin_cash: createRating(1, "Working capital challenges"),
    fin_quality: createRating(1, "Project-based revenue"),
    fin_rate: createRating(1.5, "Day rate ÃÂÃÂÃÂÃÂ£850"),
    ppl_talent: createRating(1.5, "Basic training"),
    ppl_exp: createRating(1, "Glassdoor 3.2"),
    ppl_recruit: createRating(1, "Difficulty attracting talent"),
    ppl_churn: createRating(1, "32% attrition"),
    ppl_wf: createRating(1.5, "Heavy contractor reliance"),
    srv_prop: createRating(1.5, "Generalist positioning"),
    srv_innov: createRating(1, "No formal R&D"),
    srv_ip: createRating(1, "No proprietary IP"),
    srv_size: createRating(1.5, "ÃÂÃÂÃÂÃÂ£40k average deal"),
    srv_price: createRating(1, "Heavy discounting"),
    vis_market: createRating(1.5, "Project management - cold sector"),
    vis_comp: createRating(1, "Highly commoditised"),
    vis_align: createRating(1, "No clear strategy"),
    vis_plan: createRating(1.5, "Annual budget only"),
    vis_esg: createRating(1, "No ESG consideration"),
    sal_pipe: createRating(1, "30% visibility"),
    sal_conv: createRating(1.5, "25% win rate"),
    sal_mgmt: createRating(1, "Spreadsheet based"),
    sal_skills: createRating(1, "No formal sales process"),
    cli_conc: createRating(1, "Top 3 at 65%"),
    cli_long: createRating(1.5, "8 month tenure"),
    cli_size: createRating(1, "Mostly small contracts"),
    cli_part: createRating(1, "No partnerships"),
    led_team: createRating(1.5, "Founder-led, limited depth"),
    led_deleg: createRating(1, "100% founder dependent"),
    led_gov: createRating(1, "Minimal governance"),
    cos_deliv: createRating(1, "100% onshore, high cost"),
    cos_tech: createRating(1.5, "Basic tools"),
    cos_scale: createRating(1, "Manual processes"),
    cos_data: createRating(1.5, "Quarterly reporting"),
    cos_lever: createRating(1.5, "Some debt"),
    cos_know: createRating(1, "Tribal knowledge"),
    cos_resrc: createRating(1, "55% utilisation"),
    del_sat: createRating(1.5, "NPS 18"),
    del_util: createRating(1, "55% billable"),
    del_qa: createRating(1.5, "Inconsistent QA"),
    mkt_size: createRating(1.5, "Niche market"),
    mkt_mktg: createRating(1, "No marketing function"),
    mkt_award: createRating(1, "No awards"),
    mkt_thought: createRating(1, "No thought leadership"),
    mkt_brand: createRating(1, "Limited brand awareness")
  };

  return {
    firms: [
      { id: "demo_apex", name: "Apex Consulting Partners", sector: "Consulting", createdAt: "2025-01-15T10:00:00Z" },
      { id: "demo_techbridge", name: "TechBridge Solutions", sector: "Technology Services", createdAt: "2025-02-01T14:30:00Z" },
      { id: "demo_phoenix", name: "Phoenix Advisory Group", sector: "Consulting", createdAt: "2025-02-05T09:00:00Z" }
    ],
    assessments: {
      "demo_apex_a1": { id: "demo_apex_a1", firmId: "demo_apex", createdAt: "2025-01-20T11:00:00Z", ratings: apexRatings },
      "demo_techbridge_a1": { id: "demo_techbridge_a1", firmId: "demo_techbridge", createdAt: "2025-02-03T16:00:00Z", ratings: techbridgeRatings },
      "demo_phoenix_a1": { id: "demo_phoenix_a1", firmId: "demo_phoenix", createdAt: "2025-02-06T10:30:00Z", ratings: phoenixRatings }
    }
  };
};

// Get initial state: load from storage, or use demo data
const getInitialState = () => {
  const saved = loadState();
  if (saved && saved.firms && saved.firms.length > 0) {
    return saved;
  }
  // No saved data - use demo data
  return generateDemoData();
};


// ÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂ
// SCORING ENGINE
// ÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂ
const calcScores = (ratings) => {
  const themeScores = {};
  let totalScore = 0;
  let totalMaxPossible = 0;
  let ratedCount = 0;
  let totalMetrics = 0;

  FRAMEWORK.themes.forEach(theme => {
    let themeScore = 0;
    let themeMax = 0;
    let themeRated = 0;

    theme.metrics.forEach(m => {
      totalMetrics++;
      const r = ratings[m.id];

      if (r && r.level) {
        themeScore += r.level * m.weight;
        ratedCount++;
        themeRated++;

        }
      themeMax += 3 * m.weight;
    });

    themeScores[theme.id] = {
      score: themeScore,
      max: themeMax,
      rated: themeRated,
      total: theme.metrics.length,
      pct: themeMax > 0 ? Math.round((themeScore / themeMax) * 100) : 0
    };


    totalScore += themeScore;
    totalMaxPossible += themeMax;
  });

  return {
    themeScores,
    totalScore,
    totalMaxPossible,
    pct: totalMaxPossible > 0 ? Math.round((totalScore / totalMaxPossible) * 100) : 0,
    ratedCount,
    totalMetrics
  };
};

// ÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂ
// COLOUR HELPERS
// ÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂ
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

// ÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂ
// ANIMATED COMPONENTS
// ÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂ

// Animated counting number
function AnimatedNumber({ value, suffix = "", prefix = "", duration = 500 }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const startValue = displayValue;
    const endValue = value;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(startValue + (endValue - startValue) * eased);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <>{prefix}{displayValue}{suffix}</>;
}

// Completion celebration pulse effect
function CompletionPulse({ children, isComplete }) {
  return (
    <div className={`transition-all duration-500 ${isComplete ? 'animate-pulse' : ''}`}>
      {children}
    </div>
  );
}

// Progress ring with animation
function AnimatedProgressRing({ progress, size = 80, strokeWidth = 6, color = "#1B4F72" }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#E5E7EB"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        className="transition-all duration-700 ease-out"
      />
    </svg>
  );
}

// Live Assessment Summary Panel (floating sidebar)
function LiveAssessmentPanel({ scores, ratings, onJumpToTheme }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [recentRatings, setRecentRatings] = useState([]);

  // Track recent ratings
  useEffect(() => {
    const rated = [];
    FRAMEWORK.themes.forEach(t => {
      t.metrics.forEach(m => {
        const r = ratings[m.id];
        if (r?.updatedAt) {
          rated.push({ metricId: m.id, metricName: m.name, themeName: t.name, themeId: t.id, level: r.level, updatedAt: r.updatedAt });
        }
      });
    });
    rated.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    setRecentRatings(rated.slice(0, 3));
  }, [ratings]);

  // Find incomplete themes
  const incompleteThemes = FRAMEWORK.themes.filter(t => {
    const s = scores.themeScores[t.id];
    return s?.rated < s?.total;
  });

  const completionPct = scores.totalMetrics > 0 ? Math.round((scores.ratedCount / scores.totalMetrics) * 100) : 0;
  const isAllComplete = scores.ratedCount === scores.totalMetrics;

  return (
    <div className={`fixed right-4 top-20 z-50 transition-all duration-300 ${isExpanded ? 'w-72' : 'w-12'}`}>
      {/* Toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -left-3 top-4 w-6 h-6 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center text-xs hover:bg-blue-700 transition-colors z-10"
      >
        {isExpanded ? '\u203A' : '\u2039'}
      </button>

      {isExpanded ? (
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className={`px-4 py-3 ${isAllComplete ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} text-white`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm">Live Progress</span>
              {isAllComplete && <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full"> Complete!</span>}
            </div>
          </div>

          {/* Main Stats */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="relative">
                <AnimatedProgressRing progress={completionPct} color={isAllComplete ? "#10B981" : "#1B4F72"} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-800">
                    <AnimatedNumber value={completionPct} suffix="%" />
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold text-gray-800">
                  <AnimatedNumber value={scores.pct} suffix="%" />
                </div>
                <div className="text-xs text-gray-500">Maturity Score</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {scores.ratedCount}/{scores.totalMetrics} metrics rated
                </div>
              </div>
            </div>

            
          </div>

          {/* Quick Jump to Incomplete */}
          {incompleteThemes.length > 0 && (
            <div className="p-3 border-b border-gray-100">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Quick Jump</div>
              <div className="space-y-1">
                {incompleteThemes.slice(0, 3).map(t => {
                  const s = scores.themeScores[t.id];
                  return (
                    <button
                      key={t.id}
                      onClick={() => onJumpToTheme(t.id)}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-blue-50 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                        <span className="text-xs text-gray-600 group-hover:text-blue-600 truncate">{t.name}</span>
                      </div>
                      <span className="text-xs text-gray-400">{s?.rated}/{s?.total}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          {recentRatings.length > 0 && (
            <div className="p-3">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Recent Activity</div>
              <div className="space-y-2">
                {recentRatings.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${r.level >= 2.5 ? 'bg-green-100 text-green-700' :
                      r.level >= 1.5 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                      {r.level}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-700 truncate">{r.metricName}</div>
                      <div className="text-xs text-gray-400">{r.themeName}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Collapsed State */
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-2">
          <div className="relative w-8 h-8 mx-auto">
            <AnimatedProgressRing progress={completionPct} size={32} strokeWidth={3} color={isAllComplete ? "#10B981" : "#1B4F72"} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-700">{completionPct}</span>
            </div>
          </div>
          <div className="text-center mt-2">
            <div className="text-xs font-bold text-gray-700">{scores.pct}%</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂ
// COMPONENTS
// ÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂ

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
  const [animatingLevel, setAnimatingLevel] = useState(null);
  const levels = [
    { level: 1, label: "Foundational", text: metric.foundational, color: "#922B21", bg: "#FDEDEC", border: "#E6B0AA" },
    { level: 2, label: "Evolving", text: metric.evolving, color: "#7D6608", bg: "#FEF9E7", border: "#F9E79F" },
    { level: 3, label: "Optimised", text: metric.optimised, color: "#1E8449", bg: "#EAFAF1", border: "#A9DFBF" },
  ];
  const currentLevel = rating?.level;

  const handleRate = (level) => {
    setAnimatingLevel(level);
    onRate(metric.id, level);
    setTimeout(() => setAnimatingLevel(null), 300);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-4 overflow-hidden hover-lift transition-all duration-200">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <h4 className="font-semibold text-gray-800 text-sm">{metric.name}</h4>
                          {metric.question && <p className="text-xs text-blue-600 italic mt-1 mb-1">{metric.question}</p>}
          {metric.weight > 0 && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium transition-transform hover:scale-105">{metric.weight} pts</span>}
          {metric.weight === 0 && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Supplementary</span>}
          
        </div>
        <div className="flex items-center gap-2">
          {currentLevel && (
            <button onClick={() => onRate(metric.id, null)} className="text-xs text-gray-400 hover:text-red-500 hover:scale-110 transition-all px-1" title="Clear rating">
              <X size={14} />
            </button>
          )}
          <button onClick={() => setShowComment(!showComment)} className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-all button-press ${comment ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
            <MessageSquare size={12} />
            {comment ? "Note" : "Add note"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-0">
        {levels.map(l => {
          const selected = currentLevel === l.level;
          const isAnimating = animatingLevel === l.level;
          return (
            <button
              key={l.level}
              onClick={() => handleRate(l.level)}
              className={`relative text-left p-3 border-r last:border-r-0 border-gray-100 transition-all duration-200 hover:bg-opacity-50 ${isAnimating ? 'animate-scale-pop' : ''}`}
              style={{
                backgroundColor: selected ? l.bg : "white",
                borderBottom: selected ? `3px solid ${l.color}` : "3px solid transparent",
              }}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className={`transition-transform duration-200 ${selected ? 'scale-110' : ''}`}>
                  {selected ? <CheckCircle2 size={14} style={{ color: l.color }} /> : <Circle size={14} className="text-gray-300 group-hover:text-gray-400" />}
                </div>
                <span className="text-xs font-bold uppercase tracking-wide transition-colors" style={{ color: selected ? l.color : "#9CA3AF" }}>{l.label}</span>
              </div>
              <p className="text-xs leading-relaxed transition-colors" style={{ color: selected ? l.color : "#6B7280" }}>{l.text}</p>
              {/* Selection indicator */}
              {selected && (
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: l.color }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Half-level selector with animations */}
      {currentLevel && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center gap-2 animate-fade-in">
          <span className="text-xs text-gray-500">Fine-tune:</span>
          {[1, 1.5, 2, 2.5, 3].map(v => (
            <button
              key={v}
              onClick={() => handleRate(v)}
              className={`text-xs px-2 py-0.5 rounded-full transition-all duration-200 button-press ${currentLevel === v
                ? "bg-blue-600 text-white font-bold scale-110 shadow-md"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300 hover:scale-105"
                }`}
            >
              {v}
            </button>
          ))}
        </div>
      )}

      {showComment && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 animate-fade-in">
          <textarea value={comment} onChange={e => { setComment(e.target.value); onComment(metric.id, e.target.value); }} placeholder="Add evidence notes, reasoning, or commentary..." className="w-full text-xs border border-gray-200 rounded p-2 h-16 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow" />
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
  const weaknesses = scored.filter(m => m.level <= 1.5).sort((a, b) => (b.weight * (3 - b.level)) - (a.weight * (3 - a.level))).slice(0, 5);

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

// ÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂ
// EXPORT FUNCTIONS
// ÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂ
const exportToCSV = (assessment, firmName, ratings) => {
  FRAMEWORK.themes.forEach(t => {
    t.metrics.forEach(m => {
      const r = ratings[m.id];
      rows.push([
        t.name,
        m.name,
        m.weight,
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
    return `<tr>
      <td style="padding:8px;border:1px solid #ddd;">${t.name}</td>
      <td style="padding:8px;border:1px solid #ddd;text-align:center;">${s?.pct || 0}%</td>
      <td style="padding:8px;border:1px solid #ddd;text-align:center;">${s?.rated || 0}/${s?.total || 0}</td>
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
    </div>
  </div>

  <h2>Theme Breakdown</h2>
  <table>
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

// ÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂ
// ÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂ

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


function RadarOverview({ radarData }) {
  const benchmark = BENCHMARKS["Professional Services"];
  const dataWithBenchmark = radarData.map(d => {
    const themeObj = FRAMEWORK.themes.find(t => t.name === d.fullName);
    return {
      ...d,
      benchmark: themeObj ? (benchmark[themeObj.id] || 50) : 50
    };
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-3">
        <Target size={14} /> Maturity Overview
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart data={dataWithBenchmark} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid strokeDasharray="3 3" />
          <PolarAngleAxis dataKey="theme" tick={{ fontSize: 9 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 8 }} />
          <Radar name="Your Firm" dataKey="score" stroke="#1B4F72" fill="#1B4F72" fillOpacity={0.3} strokeWidth={2} />
          <Radar name="Prof. Services Avg" dataKey="benchmark" stroke="#94A3B8" fill="#94A3B8" fillOpacity={0.1} strokeWidth={1} strokeDasharray="4 4" />
          <Tooltip formatter={(v, name) => [v + '%', name]} />
        </RadarChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-6 mt-1">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{backgroundColor:'#1B4F72'}} /><span className="text-xs text-gray-500">Your Firm</span></div>
        <div className="flex items-center gap-1.5"><div className="w-8 h-0 border-t-2 border-dashed" style={{borderColor:'#94A3B8'}} /><span className="text-xs text-gray-500">Prof. Services Avg</span></div>
      </div>
    </div>
  );
}

function BenchmarkComparison({ scores }) {
  const benchmark = BENCHMARKS["Professional Services"];

  const comparisonData = FRAMEWORK.themes.map(t => {
    const firm = scores?.themeScores?.[t.id]?.pct || 0;
    const bench = benchmark[t.id] || 50;
    const diff = firm - bench;
    // RAG: green if >5 above benchmark, red if >5 below, amber if within 5
    const firmFill = diff > 5 ? '#27AE60' : diff < -5 ? '#E74C3C' : '#F39C12';
    return {
      name: t.name.length > 12 ? t.name.substring(0, 11) + '...' : t.name,
      firm,
      benchmark: bench,
      firmFill,
      color: t.color
    };
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <BarChart3 size={14} /> Professional Services Benchmark
        </h3>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={comparisonData} layout="vertical" margin={{ left: 10, right: 20 }}>
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
          <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 10 }} />
          <Tooltip formatter={(v, name) => [v, name]} />
          <Bar dataKey="firm" name="Your Firm" radius={[0, 4, 4, 0]}>
            {comparisonData.map((entry, index) => (
              <Cell key={index} fill={entry.firmFill} />
            ))}
          </Bar>
          <Bar dataKey="benchmark" name="Prof. Services Avg" fill="#94A3B8" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-2 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{backgroundColor:'#27AE60'}} /><span className="text-xs text-gray-500">Above Benchmark</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{backgroundColor:'#F39C12'}} /><span className="text-xs text-gray-500">Near Benchmark</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{backgroundColor:'#E74C3C'}} /><span className="text-xs text-gray-500">Below Benchmark</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{backgroundColor:'#94A3B8'}} /><span className="text-xs text-gray-500">Prof. Services Avg</span></div>
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
        Or start with blank assessment ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ
      </button>
    </div>
  );
}

// ÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂ
// VIEWS
// ÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂ


function Breadcrumbs({ view, firmName, onNavigate }) {
  if (view === "landing") return null;

  const crumbs = [{ label: "Home", view: "landing" }];
  if (view === "firms") {
    crumbs.push({ label: "Firms", view: "firms" });
  }
  if (view === "firmDetail" || view === "assess" || view === "dashboard") {
    crumbs.push({ label: "Firms", view: "firms" });
    crumbs.push({ label: firmName || "Firm", view: "firmDetail" });
  }
  if (view === "assess" || view === "dashboard") {
    crumbs.push({ label: "Assessment", view: "assess" });
  }
  if (view === "dashboard") {
    crumbs.push({ label: "Dashboard", view: "dashboard" });
  }

  return (
    <div className="px-4 py-1.5 bg-gray-50 border-b border-gray-100 flex items-center gap-1.5 text-xs text-gray-400 flex-shrink-0">
      <Home size={12} />
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={10} />}
          {i < crumbs.length - 1 ? (
            <button onClick={() => onNavigate(c.view)} className="hover:text-blue-600 transition-colors">{c.label}</button>
          ) : (
            <span className="text-gray-600 font-medium">{c.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}

function LandingPage({ onGetStarted }) {
  const themeIcons = {
    "pound": "\u00A3", "users": "\u{1F465}", "tag": "\u{1F3F7}", "compass": "\u{1F9ED}",
    "trending-up": "\u{1F4C8}", "handshake": "\u{1F91D}", "shield": "\u{1F6E1}",
    "calculator": "\u{1F5A9}", "check-square": "\u2611", "globe": "\u{1F310}"
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Hero Section */}
      <div className="text-center py-12 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-blue-900 flex items-center justify-center mx-auto mb-6">
          <Target size={32} className="text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-3">Growth Drivers Maturity Framework</h1>
        <p className="text-lg text-gray-500 mb-2">Assess. Benchmark. Grow.</p>
        <p className="text-sm text-gray-400 max-w-2xl mx-auto mb-8">
          A structured M&A due diligence assessment platform that evaluates professional services firms
          across 10 growth themes and 47 metrics, benchmarked against industry standards.
        </p>
        <button
          onClick={onGetStarted}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
        >
          Get Started
        </button>
      </div>

      {/* How It Works */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { icon: ClipboardCheck, title: "1. Assess", desc: "Rate 47 metrics across 10 growth themes using a 3-level maturity scale" },
          { icon: BarChart3, title: "2. Benchmark", desc: "Compare performance against Professional Services industry averages" },
          { icon: TrendingUp, title: "3. Identify", desc: "Pinpoint strengths, improvement areas, and strategic priorities" }
        ].map((step, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-5 text-center">
            <step.icon size={24} className="text-blue-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-gray-700 mb-1">{step.title}</h3>
            <p className="text-xs text-gray-500">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* Growth Themes Grid */}
      <h2 className="text-lg font-bold text-gray-700 mb-4 text-center">10 Growth Themes</h2>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {FRAMEWORK.themes.map(t => (
          <div key={t.id} className="bg-white rounded-lg border border-gray-200 p-3 text-center hover:shadow-md transition-shadow">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2" style={{backgroundColor: t.color + '15'}}>
              <div className="text-sm" style={{color: t.color}}>
                {t.metrics.length}
              </div>
            </div>
            <p className="text-xs font-medium text-gray-700 leading-tight">{t.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{t.metrics.length} metrics</p>
          </div>
        ))}
      </div>
    </div>
  );
}

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

function FirmDetailView({ firm, assessments, onCreateAssessment, onDeleteAssessment, onSelectAssessment, onBack }) {
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
                  <button onClick={(e) => { e.stopPropagation(); onDeleteAssessment(a.id); }} className="p-1 text-gray-400 hover:text-red-500 transition-colors" title="Delete assessment"><Trash2 size={16} /></button>
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

  const handleJumpToTheme = (themeId) => {
    setSelectedTheme(themeId);
  };

  return (
    <div className="flex h-full">
      <ThemeSidebar themes={FRAMEWORK.themes} selectedTheme={selectedTheme} onSelect={setSelectedTheme} scores={scores} />
      <div className="flex-1 overflow-y-auto pr-80"> {/* Add padding for the floating panel */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-gray-400 hover:text-gray-600 transition-colors"><ArrowLeft size={16} /></button>
            <div>
              <h2 className="text-lg font-bold transition-colors" style={{ color: theme.color }}>{theme.name}</h2>
              <p className="text-xs text-gray-400">{theme.metrics.length} metrics &middot; {theme.totalWeight} valuation points</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-gray-400">Theme Score</div>
              <div className="text-sm font-bold transition-all" style={{ color: theme.color }}>
                <AnimatedNumber value={scores.themeScores[theme.id]?.pct || 0} suffix="%" />
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">Overall</div>
              <div className="text-sm font-bold text-blue-600">
                <AnimatedNumber value={scores.pct} suffix="%" /> ({scores.ratedCount}/{scores.totalMetrics})
              </div>
            </div>
          </div>
        </div>
        <div className="p-4">
          {theme.metrics.map((m, i) => (
            <div key={m.id} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
              <MetricCard metric={m} rating={assessment.ratings[m.id]} onRate={onRate} onComment={onComment} />
            </div>
          ))}
        </div>
      </div>

      {/* Live Assessment Panel */}
      <LiveAssessmentPanel
        scores={scores}
        ratings={assessment.ratings}
        onJumpToTheme={handleJumpToTheme}
      />
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
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{firmName} - Maturity Dashboard</h1>
          <p className="text-sm text-gray-500">Assessment from {new Date(assessment.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
        <ScoreGauge score={scores.totalScore} max={scores.totalMaxPossible} label="Overall Maturity" />
      </div>


      {/* Radar Overview & Benchmark side by side */}
      <div className="grid grid-cols-2 gap-6 mb-4">
        <RadarOverview radarData={radarData} />
        <BenchmarkComparison scores={scores} />
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

// ÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂ
// MAIN APP
// ÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂ
export default function App() {
  const [state, setState] = useState(() => {
    return getInitialState();
  });
  const [view, setView] = useState("landing");
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
  const deleteAssessment = (assessmentId) => {
    if (!confirm('Delete this assessment? This cannot be undone.')) return;
    setState(prev => {
      const newAssessments = { ...prev.assessments };
      delete newAssessments[assessmentId];
      return { ...prev, assessments: newAssessments };
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
            <h1 className="text-sm font-bold text-gray-800 leading-tight cursor-pointer hover:text-blue-700 transition-colors" onClick={() => { setView("landing"); setSelectedFirmId(null); setSelectedAssessmentId(null); }}>Growth Drivers Maturity Framework</h1>
            <p className="text-xs text-gray-400">M&A Due Diligence Assessment Platform</p>
          </div>
        </div>
        <nav className="flex items-center gap-1">
          {navItems.map(n => (
            <button key={n.id} disabled={n.disabled} onClick={() => {
              if (n.id === "dashboard" && selectedAssessmentId) { setDashboardAssessmentId(selectedAssessmentId); }
              if (n.id === 'firms') { setSelectedFirmId(null); setSelectedAssessmentId(null); }
                if (n.id === 'firms') { setSelectedFirmId(null); setSelectedAssessmentId(null); }
                setView(n.id);
            }} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${view === n.id ? "bg-blue-50 text-blue-700" : n.disabled ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-100"}`}>
              <n.icon size={14} /> {n.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Breadcrumbs */}
      <Breadcrumbs
        view={view}
        firmName={selectedFirm?.name}
        onNavigate={(v) => {
          if (v === "landing") { setView("landing"); setSelectedFirmId(null); setSelectedAssessmentId(null); }
          else if (v === "firms") { setView("firms"); setSelectedFirmId(null); setSelectedAssessmentId(null); }
          else if (v === "firmDetail") { setView("firmDetail"); setSelectedAssessmentId(null); }
          else if (v === "assess") { setView("assess"); }
          else setView(v);
        }}
      />

      {/* Content */}
      <main className="flex-1 overflow-auto">
        {view === "landing" && (
        <LandingPage onGetStarted={() => setView("firms")} />
      )}
      {view === "firms" && !selectedFirmId && (
          <FirmListView firms={state.firms} onCreateFirm={createFirm} onSelectFirm={id => { setSelectedFirmId(id); setView("firmDetail"); }} onDeleteFirm={deleteFirm} assessments={state.assessments} />
        )}
        {view === "firmDetail" && selectedFirm && (
          <FirmDetailView firm={selectedFirm} assessments={state.assessments} onCreateAssessment={createAssessment} onSelectAssessment={id => { setSelectedAssessmentId(id); setView("assess"); }} onBack={() => { setSelectedFirmId(null); setView("firms"); }}  onDeleteAssessment={deleteAssessment} />
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
