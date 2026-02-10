import { useState, useEffect, useMemo, useCallback } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell , LineChart, Line, CartesianGrid, Legend, ReferenceLine } from "recharts";
import { Building2, ChevronDown, ChevronUp, ClipboardCheck, LayoutDashboard, Plus, ChevronRight, CheckCircle2, Circle, AlertCircle, Home, TrendingUp, Target, Award, MessageSquare, ArrowLeft, Trash2, Download, FileText, BarChart3, Copy, X , Info, HelpCircle, TrendingUp as TrendUp } from "lucide-react";
// ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ
// FRAMEWORK DATA - All 47 metrics from the Growth Drivers spreadsheet
// ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ
const FRAMEWORK = {
  themes: [
    {
      id: "financial", name: "Financial Performance", icon: "pound", totalWeight: 600, color: "#1B4F72",
      metrics: [
        { id: "fin_revenue", name: "Revenue Growth & Profitability", question: "How consistently are you achieving year-over-year revenue growth and profitability?", weight: 100, foundational: "Revenue growth <5% per year, low or inconsistent profitability, reliance on a few large projects", evolving: "Revenue growth 5-10% per year, moderate profitability, some diversification of revenue streams", optimised: "Revenue growth >10% per year, strong profitability with predictable, diversified revenue streams and high-margin services", guidance: "Look for consistent YoY revenue growth of 10%+. Acquirers value predictable, compounding growth over one-off spikes. Consider organic vs acquisition-driven growth." , improvementAction: "Focus on recurring revenue models and multi-year contracts to demonstrate predictable growth trajectory" },
        { id: "fin_gm", name: "Gross Margin", question: "What is your current gross margin?", weight: 100, foundational: "Gross margin <40%, cost overruns are frequent, and pricing is reactive rather than strategic", evolving: "Gross margin 40-50%, some cost control measures in place, but efficiency improvements still needed", optimised: "Gross margin >50%, strong cost control, pricing strategy optimised for profitability and scalability", guidance: "Healthy PSFs target gross margins of 50-70%. Margins below 40% signal pricing pressure or delivery inefficiency. Track trends over 3+ years for stability." , improvementAction: "Review pricing strategy, reduce delivery cost leakage, and shift toward higher-margin service lines" },
        { id: "fin_ebitda", name: "EBITDA %", question: "What is your EBITDA margin?", weight: 100, foundational: "EBITDA margin <10%, low cash generation, high cost-to-revenue ratio", evolving: "EBITDA margin 10-20%, improving operational efficiency, but some volatility in profitability", optimised: "EBITDA margin >20%, strong financial discipline, consistent year-over-year growth", guidance: "EBITDA margins of 15-25% are typical for well-run PSFs. Margins above 20% indicate strong operational efficiency and pricing power attractive to acquirers." , improvementAction: "Audit overhead costs, improve utilization rates, and benchmark partner compensation against EBITDA targets" },
        { id: "fin_cash", name: "Cash Flow", question: "How consistent and positive is your free cash flow?", weight: 100, foundational: "Free cash flow is negative or low, debtor days >60, frequent working capital constraints", evolving: "Free cash flow is positive but inconsistent, debtor days 45-60, some cash reserves maintained", optimised: "Free cash flow is consistently strong, debtor days <45, 80%+ cash flow conversion from EBITDA", guidance: "Consistent positive free cash flow demonstrates business sustainability. Look for low debtor days (<45), predictable billing cycles, and minimal capital expenditure requirements." , improvementAction: "Implement stricter billing cycles, reduce debtor days below 45, and build 3-month cash reserves" },
        { id: "fin_quality", name: "Quality of Revenue", question: "How high-quality and recurring is your revenue base?", weight: 100, foundational: "Recurring/repeat revenue <10%, heavy reliance on new business development, volatile income streams", evolving: "Recurring/repeat revenue 10-30%, some multi-year contracts, but still significant project-based work", optimised: "Recurring/repeat revenue >30%, long-term client contracts, high revenue predictability", guidance: "High-quality revenue is recurring, predictable, and diversified. Retainer-based and subscription models score highest. Project-based revenue with strong repeat rates also scores well." , improvementAction: "Diversify revenue across clients (no single client >15%), grow recurring contracts to 40%+ of revenue" },
        { id: "fin_rate", name: "Blended Rate Card", question: "What is your average day rate and implementation of this?", weight: 100, foundational: "Average daily rate <\u00A31,000, frequent discounting, weak commercial discipline", evolving: "Average daily rate \u00A31,000-\u00A31,500, some rate consistency, but discounting still occurs", optimised: "Average daily rate >\u00A31,500, strong commercial discipline, pricing reflects market leadership and value", guidance: "Blended rate trends indicate pricing power. Rising rates with maintained utilisation signals market strength. Compare against sector benchmarks for your discipline." , improvementAction: "Implement value-based pricing, reduce discounting, and benchmark rates against market by grade level" },
      ]
    },
    {
      id: "people", name: "People", icon: "users", totalWeight: 425, color: "#6C3483",
      metrics: [
        { id: "ppl_talent", name: "Talent & Competence Management", question: "How comprehensive and structured is your talent and competency management framework?", weight: 100, foundational: "One or none of: detailed competency framework; consistent training and mentoring structure; annual appraisal system; clear role definitions", evolving: "2-3 of these: detailed competency framework; consistent training and mentoring structure; annual appraisal system; clear role definitions", optimised: "All of these: detailed competency framework; consistent training and mentoring structure; annual appraisal system; clear role definitions", guidance: "Comprehensive talent management includes structured career paths, regular development reviews, skills gap analysis, and leadership succession planning." , improvementAction: "Establish structured career pathways, implement 360-degree reviews, and create leadership development programs" },
        { id: "ppl_exp", name: "Employee Experience", question: "What is your internal employee satisfaction or GlassDoor rating?", weight: 100, foundational: "Internal NPS below 40 (or not measured) and Glassdoor rating below 3.5", evolving: "Internal NPS rating below 40 (or not measured) OR Glassdoor rating below 4", optimised: "Internal NPS rating 40+ AND Glassdoor rating above 4", guidance: "Employee satisfaction scores above 70% indicate a healthy culture. Track eNPS, exit interview themes, Glassdoor ratings, and participation in engagement surveys." , improvementAction: "Run quarterly eNPS surveys, act on feedback loops, and benchmark benefits against market leaders" },
        { id: "ppl_recruit", name: "Recruitment", question: "How effectively structured and targeted is your recruitment process?", weight: 100, foundational: "Low (0-3) qualified applicants per job. Vague or unarticulated Employee Value Proposition", evolving: "Medium (3-7) qualified applicants per job. Vague or unarticulated Employee Value Proposition", optimised: "High (7+) qualified applicants per job. Clear Employee Value Proposition", guidance: "Effective recruitment means <60 day time-to-hire, structured interview processes, diverse pipelines, and strong employer branding. Low offer-rejection rates signal market positioning." , improvementAction: "Build employer brand, reduce time-to-hire below 30 days, and establish graduate/intern pipelines" },
        { id: "ppl_churn", name: "Churn & Attrition", question: "What is your annual attrition rate, and how effective are your retention strategies?", weight: 100, foundational: "Attrition >25% annually", evolving: "Attrition between 15-25%", optimised: "Attrition <15%, strong retention strategies", guidance: "Annual attrition below 15% is healthy for PSFs. Distinguish between voluntary and involuntary turnover. High performer retention is the critical metric for acquirers." , improvementAction: "Implement stay interviews, address top 3 attrition drivers, and target voluntary attrition below 12%" },
        { id: "ppl_wf", name: "Workforce Composition", question: "How reliant are you on delivery teams composed of contractors versus permanent employees?", weight: 25, foundational: ">50% of delivery team are contractors, low organisational knowledge retention", evolving: "30-50% of delivery team are contractors, some investment in permanent teams", optimised: "<30% of delivery team are contractors, strong internal capability and knowledge retention", guidance: "Balanced workforce composition means no over-reliance on contractors or key individuals. Aim for a healthy mix of junior/mid/senior with clear development pathways." , improvementAction: "Reduce key-person dependency, cross-train teams, and build bench strength in critical delivery areas" },
      ]
    },
    {
      id: "services", name: "Services & Pricing", icon: "tag", totalWeight: 300, color: "#1A5276",
      metrics: [
        { id: "srv_prop", name: "Market Proposition", question: "How clearly is your market proposition defined and differentiated from competitors?", weight: 100, foundational: "Vague market positioning, low differentiation from competitors, low focus on specific client pain points", evolving: "Some differentiation but client pain points or benefits are vague", optimised: "Clearly defined, differentiated value proposition(s) focus on clear client needs and benefits", guidance: "A clear, differentiated value proposition articulates why clients choose you over alternatives. It should be specific, measurable, and consistently communicated across the firm." , improvementAction: "Define clear service tiers, retire underperforming offerings, and align portfolio to market demand" },
        { id: "srv_innov", name: "Service Innovation", question: "What percentage of your revenue is put towards service development / creation?", weight: 25, foundational: "No structured investment (<2% of revenue)", evolving: "3-5% of revenue reinvested in service development", optimised: ">5% of revenue reinvested in service innovation", guidance: "Active innovation includes regular service line reviews, R&D investment (2-5% of revenue), client co-creation, and a pipeline of new offerings in development." , improvementAction: "Allocate 5-10% of revenue to R&D, run quarterly innovation sprints, and track new service launch metrics" },
        { id: "srv_ip", name: "Service IP", question: "To what extent is your delivery supported by proprietary or IP-based content?", weight: 100, foundational: "<10% of delivery supported by proprietary IP", evolving: "10%-30% of delivery incorporates proprietary IP", optimised: ">30% of delivery is productised or IP-based", guidance: "Proprietary IP includes frameworks, tools, methodologies, and data assets. Documented, protected IP significantly increases firm valuation in M&A transactions." , improvementAction: "Codify delivery methodologies, create reusable frameworks, and protect intellectual property formally" },
        { id: "srv_size", name: "Project Size", question: "What is your average project size?", weight: 50, foundational: "Average contract size less than \u00A350k", evolving: "Average project size \u00A350k-\u00A3250k", optimised: "Average project size \u00A3250k+", guidance: "Optimal deal sizes balance profitability with risk. Growing average project size indicates market trust and capability maturity. Track trends over 12-24 months." , improvementAction: "Standardise delivery processes, invest in tooling/automation, and design services for delegation" },
        { id: "srv_price", name: "Pricing Strategy", question: "What percentage of your work is charged as value-based pricing or fixed price?", weight: 25, foundational: "Ad-hoc pricing; low understanding of price elasticity", evolving: "Some structured pricing models but inconsistent", optimised: "Data-driven pricing strategy, strong market positioning", guidance: "Value-based pricing, clear rate cards, and minimal discounting indicate pricing maturity. Firms that can articulate and defend their pricing command premium valuations." , improvementAction: "Implement tiered pricing models, shift from time-based to value-based pricing where possible" },
      ]
    },
    {
      id: "vision", name: "Vision & Strategy", icon: "compass", totalWeight: 300, color: "#117A65",
      metrics: [
        { id: "vis_market", name: "Market/Niche Focus", question: "What is the current growth rate of your market/niche?", weight: 100, foundational: "Low growth / cold sector (e.g. Project Management)", evolving: "Medium growth / warm sector (e.g. Environmental)", optimised: "High growth / hot sector (e.g. AI Consulting or Finance)", guidance: "Deep market understanding means documented analysis of market size, growth trends, competitive dynamics, and emerging opportunities. Updated annually at minimum." , improvementAction: "Conduct formal market analysis annually, track serviceable addressable market, and identify adjacencies" },
        { id: "vis_comp", name: "Competitors & Barriers to Entry", question: "How intense is the competition or how high are barriers to entry in your market?", weight: 75, foundational: "High competition with 10+ direct competitors offering similar services and low barriers to entry", evolving: "Moderate competition with 5-10 competitors, some differentiation through IP or niche specialisation", optimised: "Low competition with <5 competitors in the same niche, strong barriers to entry through proprietary IP or brand authority", guidance: "Know your top 5-10 competitors deeply: their positioning, pricing, strengths, and weaknesses. A competitive intelligence process that informs strategy scores highest." , improvementAction: "Document competitor strengths and weaknesses, define clear differentiators, and monitor win/loss patterns" },
        { id: "vis_align", name: "Strategic Alignment", question: "To what extent is ESG integrated into your business strategy?", weight: 50, foundational: "Strategy is misaligned across teams", evolving: "Some alignment, but execution inconsistencies", optimised: "Strategy is well-defined and fully aligned", guidance: "Strategic alignment means the entire leadership team can articulate the same vision and priorities. Measured through consistent messaging and aligned departmental goals." , improvementAction: "Ensure strategy is communicated to all levels, embed strategic goals in team OKRs, and review quarterly" },
        { id: "vis_plan", name: "Business Planning", question: "How structured and regularly updated is your business planning process?", weight: 75, foundational: "No formal business plan or planning occurs reactively, with no structured forecasting", evolving: "Business planning conducted annually, with some structured financial and strategic forecasting", optimised: "Business planning is a quarterly rolling process, with 3-5 year strategic plans and real-time performance tracking", guidance: "A robust strategic plan covers 3-5 years with clear milestones, resource allocation, and KPIs. Reviewed quarterly with documented progress tracking." , improvementAction: "Document a clear 3-5 year strategic plan with measurable milestones and board-approved targets" },
        { id: "vis_esg", name: "ESG", question: "How strong is your forward visibility of revenue, margin and utilisation?", weight: 0, foundational: "No formal ESG strategy, no tracking of environmental or social impact", evolving: "Basic ESG policy in place, some initiatives but no structured reporting", optimised: "Fully embedded ESG strategy with measurable KPIs and transparent annual reporting", guidance: "ESG and sustainability practices increasingly matter to acquirers. Documented policies, measurable targets, and annual reporting demonstrate maturity in this area." , improvementAction: "Establish ESG policy, report on sustainability metrics, and align with client procurement requirements" },
      ]
    },
    {
      id: "sales", name: "Sales & Pipeline", icon: "trending-up", totalWeight: 275, color: "#B7950B",
      metrics: [
        { id: "sal_pipe", name: "Pipeline Visibility", question: "How much of the next 12 months' revenue do you currently have booked?", weight: 75, foundational: "<40% of next 12 months' revenue booked", evolving: "40-70% of next 12 months' revenue booked", optimised: ">70% of next 12 months' revenue booked", guidance: "A healthy pipeline is 3-4x annual revenue target with balanced stage distribution. Track pipeline velocity, win rates by stage, and average deal cycle length." , improvementAction: "Implement CRM discipline, maintain 3x pipeline coverage, and track conversion rates by stage" },
        { id: "sal_conv", name: "Conversion Ratios", question: "What is your typical proposal-to-project conversion ratio?", weight: 50, foundational: "<25% proposal conversion rate", evolving: "25%-50% proposal conversion rate", optimised: ">50% proposal conversion rate", guidance: "Conversion rates above 30% from qualified opportunity to close indicate strong sales execution. Track by service line, client segment, and team member." , improvementAction: "Conduct win/loss analysis on every bid, improve proposal quality, and build sector-specific case studies" },
        { id: "sal_mgmt", name: "Sales Management", question: "How structured and effective is your sales management system?", weight: 75, foundational: "Weak sales management: weak reporting or data. CRM not well integrated", evolving: "Improved sales management. CRM used, but not consistently by all", optimised: "Strong sales management by top-ranked senior. Weekly meetings driven by CRM-related data", guidance: "Mature sales management includes CRM discipline, regular pipeline reviews, accurate forecasting (within 10%), and documented sales processes with clear stage gates." , improvementAction: "Map client account plans for cross-sell, train teams on full portfolio, and set cross-sell revenue targets" },
        { id: "sal_skills", name: "Sales Skills & Processes", question: "How well-defined and effective are your sales mentoring and training systems?", weight: 75, foundational: "No structured sales training/processes", evolving: "Some structured sales processes, but inconsistently applied", optimised: "Highly structured, repeatable sales process", guidance: "Sales capability goes beyond individual talent to include structured training, playbooks, proposal templates, and win/loss analysis feeding continuous improvement." , improvementAction: "Build inbound marketing engine, train sales teams on consultative selling, and measure pipeline quality" },
      ]
    },
    {
      id: "clients", name: "Clients & Relationships", icon: "handshake", totalWeight: 250, color: "#922B21",
      metrics: [
        { id: "cli_conc", name: "Client Concentration & Risk", question: "How concentrated is your revenue among your top three clients?", weight: 100, foundational: "Top 3 clients contribute >50% of total revenue, high dependency on a few key relationships", evolving: "Top 3 clients contribute 30-50% of total revenue, moderate diversification", optimised: "Top 3 clients contribute <30% of total revenue, well-diversified client base", guidance: "Client concentration below 20% for top client and below 50% for top 5 clients reduces acquirer risk. Active diversification strategy should be documented." , improvementAction: "Reduce largest client to below 15% of revenue, diversify across 3+ sectors, build mid-market pipeline" },
        { id: "cli_long", name: "Client Longevity", question: "What is your average client tenure?", weight: 100, foundational: "Average client tenure <6 months, transactional relationships, low retention", evolving: "Average client tenure 6-24 months, some long-term relationships", optimised: "Average client tenure >2 years, high retention rate, strong account management", guidance: "Long-term client relationships (3+ years average tenure) indicate service quality and switching costs. Track Net Revenue Retention and expansion revenue." , improvementAction: "Implement NPS tracking, conduct quarterly business reviews with top 20 clients, target 90%+ retention" },
        { id: "cli_size", name: "Client Size", question: "What is the typical size of your client contracts?", weight: 25, foundational: "Majority of clients are small contracts (<\u00A350k annual spend)", evolving: "Mix of small and mid-sized clients, with 20%+ of revenue from mid-tier (\u00A350k-\u00A3250k)", optimised: "30%+ of revenue from large clients (\u00A3250k+ per year), strategic account penetration", guidance: "Growing average client size indicates deepening relationships and cross-sell success. Track revenue per client trends and number of service lines per client." , improvementAction: "Develop structured account growth plans, set expansion targets per client, and track wallet share" },
        { id: "cli_part", name: "Partnerships & Alliances", question: "How structured and beneficial are your strategic partnerships and alliances?", weight: 25, foundational: "No formal partnerships, occasional ad hoc collaborations", evolving: "1-3 strategic partnerships, contributing <10% of revenue", optimised: "3+ strong partnerships, contributing >15% of revenue, integrated into go-to-market", guidance: "Strategic client partnerships include joint planning, executive sponsorship, multi-year contracts, and embedded team models. These create defensible revenue streams." , improvementAction: "Establish multi-stakeholder relationships at each key client, implement relationship mapping tools" },
      ]
    },
    {
      id: "leadership", name: "Leadership & Governance", icon: "shield", totalWeight: 250, color: "#4A235A",
      metrics: [
        { id: "led_team", name: "Senior Leadership Team", question: "How experienced and strategically skilled is your senior leadership team?", weight: 100, foundational: "Weak leadership team", evolving: "Improving leadership team", optimised: "Very experienced leadership team with experience of M&A", guidance: "A complete, capable leadership team has clear roles, complementary skills, and succession plans. No single point of failure. Board or advisory board adds governance strength." , improvementAction: "Build balanced leadership team across functions, invest in executive coaching, and conduct team reviews" },
        { id: "led_deleg", name: "Delegation & Succession", question: "How clearly defined are your delegation and succession planning processes?", weight: 100, foundational: "Founders drive most key decisions", evolving: "Some delegation, but founder dependence remains", optimised: "CEO and leadership team operate independently", guidance: "Effective delegation means the firm runs without founder dependency. Key decisions are made at appropriate levels with documented authority matrices." , improvementAction: "Document succession plans for all key roles, develop internal candidates, and test plans annually" },
        { id: "led_gov", name: "Governance & Controls", question: "How robust are your governance and control mechanisms?", weight: 50, foundational: "One or none of: Strong advisory board; Strong governance for decision-making; Strong strategic reporting", evolving: "Two of these: Strong advisory board; Strong governance; Strong strategic reporting", optimised: "All three: Strong advisory board; Strong governance for decision-making; Strong strategic reporting", guidance: "Strong governance includes regular board meetings, documented policies, risk management frameworks, compliance procedures, and clear reporting structures." , improvementAction: "Establish independent advisory board, implement formal board reporting, and define governance charter" },
      ]
    },
    {
      id: "cost", name: "Cost Optimisation", icon: "calculator", totalWeight: 250, color: "#1E8449",
      metrics: [
        { id: "cos_deliv", name: "Delivery Model", question: "How efficient and optimised is your current delivery model?", weight: 25, foundational: "Delivery is fully onshore, cost inefficiencies", evolving: "Some offshore delivery, but limited efficiency gains", optimised: "Optimised delivery mix with offshore efficiencies", guidance: "Delivery cost efficiency means optimal staff-to-project ratios, minimal rework, and consistent on-budget project delivery. Track cost variance against estimates." , improvementAction: "Track project profitability weekly, implement earned value management, and address margin erosion early" },
        { id: "cos_tech", name: "Technology Maturity", question: "What is the maturity level of your technology infrastructure (CRM, PSA, HCM)?", weight: 75, foundational: "Limited use of CRM, PSA, or automation", evolving: "Basic adoption of CRM, PSA, and some automation", optimised: "Fully integrated digital ecosystem (CRM, PSA, AI)", guidance: "Technology enablement includes modern tools for collaboration, project management, time tracking, and client delivery. Cloud-first, integrated platforms score highest." , improvementAction: "Consolidate technology stack, measure ROI on all platforms, and automate repetitive delivery tasks" },
        { id: "cos_scale", name: "Scaling Infrastructure", question: "What is your average utilisation rate for consultants?", weight: 75, foundational: "<20% of core business processes automated or AI-supported", evolving: "20-50% of core business processes automated, with partial AI-driven analytics", optimised: ">50% of processes automated, with AI and RPA fully embedded in operations", guidance: "Scalable operations can grow revenue faster than headcount. Look for automation, standardised processes, offshore/nearshore leverage, and technology-enabled delivery." , improvementAction: "Standardise delivery processes, build reusable assets, and invest in platforms that scale efficiently" },
        { id: "cos_data", name: "Data Maturity", question: "How mature is your approach to data management and analytics?", weight: 75, foundational: "Data fragmented, manual reporting", evolving: "Some structured reporting, data inconsistencies", optimised: "Automated, real-time data-driven reporting", guidance: "Data-driven decision making requires clean data, regular reporting dashboards, and evidence-based planning. Analytics capability is increasingly valued by acquirers." , improvementAction: "Implement BI dashboards for real-time visibility, track leading indicators, and automate reporting" },
        { id: "cos_lever", name: "Leverage", question: "What is your use of AI and Automation?", weight: 0, foundational: "Leverage ratio >3.5x EBITDA, high debt burden", evolving: "Leverage ratio 2.0-3.5x EBITDA, manageable debt", optimised: "Leverage ratio <2.0x EBITDA, strong financial flexibility", guidance: "Leverage in a PSF context means the ratio of junior to senior staff on projects. Higher leverage with maintained quality indicates scalable, profitable delivery." , improvementAction: "Optimize team pyramids, increase junior leverage ratios, and use offshore/nearshore where appropriate" },
        { id: "cos_know", name: "Knowledge", weight: 0, foundational: "<20% of knowledge is codified, minimal documentation", evolving: "20-50% of knowledge is documented, some use of knowledge management tools", optimised: ">50% of knowledge is structured and documented, KM systems fully integrated", guidance: "Knowledge management systems capture institutional knowledge, enable reuse, and accelerate onboarding. Documented methodologies and searchable knowledge bases score highest." , improvementAction: "Build knowledge management system, capture project learnings, and reduce reinvention across teams" },
        { id: "cos_resrc", name: "Resourcing", weight: 0, foundational: "Utilisation <60%, poor visibility on resource allocation", evolving: "Utilisation 60-75%, some workforce planning but reactive deployment", optimised: "Utilisation >75%, proactive resource planning and demand forecasting", guidance: "Resource management optimises utilisation while preventing burnout. Mature firms use forecasting tools, skills databases, and capacity planning 3-6 months ahead." , improvementAction: "Implement resource management tooling, forecast demand 90 days ahead, and reduce bench time below 10%" },
      ]
    },
    {
      id: "delivery", name: "Delivery", icon: "check-square", totalWeight: 175, color: "#2E86C1",
      metrics: [
        { id: "del_sat", name: "Client Satisfaction", question: "How structured and effective is your client satisfaction measurement (NPS)?", weight: 75, foundational: "No structured feedback mechanisms (NPS <20)", evolving: "Periodic feedback collection, NPS 20-50", optimised: "Advanced feedback mechanisms, NPS >50", guidance: "Client satisfaction scores (CSAT/NPS) above industry average demonstrate delivery quality. Regular measurement, trend tracking, and action on feedback score highest." , improvementAction: "Implement quality assurance checkpoints, track client satisfaction per project, and maintain scorecards" },
        { id: "del_util", name: "Utilisation", question: "What percentage of your staff are billable?", weight: 50, foundational: "Utilisation <60%", evolving: "Utilisation 60-75%", optimised: "Utilisation >75%", guidance: "Utilisation rates of 70-80% for senior staff and 80-85% for delivery teams are healthy. Track billable vs non-billable carefully and manage bench time productively." , improvementAction: "Target 75%+ billable utilization, implement real-time tracking, and address underperforming areas" },
        { id: "del_qa", name: "Quality Assurance", question: "How robust are your quality assurance standards?", weight: 50, foundational: "No formal QA standards", evolving: "Some QA standards in place, inconsistent adherence", optimised: "Robust QA framework throughout project delivery, consistently applied", guidance: "Quality assurance includes peer review processes, delivery standards, client acceptance procedures, and continuous improvement loops from project retrospectives." , improvementAction: "Standardize delivery methodology, train all staff, and measure methodology adherence on every project" },
      ]
    },
    {
      id: "market", name: "Market Profile", icon: "globe", totalWeight: 175, color: "#CA6F1E",
      metrics: [
        { id: "mkt_size", name: "Market Size & Growth Potential", question: "How clearly defined and executed is your branding strategy?", weight: 25, foundational: "Small maximum market (less than $500m)", evolving: "Medium maximum market ($500m-1bn)", optimised: "Large maximum market (>$1bn)", guidance: "Addressable market size should be clearly defined and large enough for growth ambitions. Document TAM, SAM, and SOM with credible bottom-up analysis." , improvementAction: "Define total addressable market, track market share trends, and identify growth white spaces" },
        { id: "mkt_mktg", name: "Marketing Influence on Revenue", question: "What percentage of your revenue is directly influenced by marketing activities?", weight: 50, foundational: "<5% of revenue influenced by marketing", evolving: "5-15% of revenue influenced by marketing", optimised: "15%+ of revenue driven by marketing", guidance: "Marketing effectiveness is measured by lead generation metrics, brand awareness, share of voice, and marketing-attributed pipeline. Track cost per qualified lead." , improvementAction: "Build content marketing pipeline, track cost per lead, and measure marketing-sourced pipeline quarterly" },
        { id: "mkt_award", name: "Awards & Recognition", question: "How many national or industry awards have you won in the past three years?", weight: 50, foundational: "No national or industry awards won in the past three years", evolving: "1-2 national or industry awards won in the past three years", optimised: "3+ national or industry awards, with external validation from major industry bodies", guidance: "Industry awards and recognition validate market positioning. Active award submissions, analyst relations, and industry body participation demonstrate thought leadership." , improvementAction: "Pursue relevant industry awards, build case study library, and manage online review presence actively" },
        { id: "mkt_thought", name: "Thought Leadership", question: "How active and recognised is your thought leadership?", weight: 50, foundational: "No thought leadership content published in past 6 months", evolving: "2-3 pieces of thought leadership content published monthly", optimised: "Recognised industry thought leader, 4+ high-impact pieces monthly with significant recognition", guidance: "Thought leadership includes regular publishing, speaking engagements, research reports, and media presence. Content should demonstrate deep domain expertise." , improvementAction: "Publish quarterly research/whitepapers, secure speaking slots at key events, and build analyst relationships" },
        { id: "mkt_brand", name: "Branding", question: "What is your brand awareness and market recognition level?", weight: 0, foundational: "No defined brand strategy, weak recognition outside existing clients", evolving: "Some brand recognition, 1-2 external PR initiatives annually", optimised: "Recognised industry brand with strong external presence driving inbound opportunities", guidance: "Brand strength is measured by unaided awareness, brand preference in target segments, and premium pricing ability. Consistent visual identity and messaging across channels." , improvementAction: "Build distinctive thought leadership program, measure share of voice, and invest in digital brand presence" },
      ]
    },
  ]
};

const TOTAL_MAX_SCORE = FRAMEWORK.themes.reduce((sum, t) => sum + t.metrics.reduce((s, m) => s + m.weight * 3, 0), 0);
const TOTAL_WEIGHTED_POINTS = FRAMEWORK.themes.reduce((sum, t) => sum + t.totalWeight, 0); // 3000

// ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ
// INDUSTRY BENCHMARKS - Average scores by sector
// ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ
const BENCHMARK_PROFILES = {
  "M&A-Ready (PSF)": { financial: 70, people: 68, services: 66, vision: 64, sales: 65, clients: 68, leadership: 67, cost: 65, delivery: 70, market: 65 },
  "Top Decile": { financial: 85, people: 82, services: 80, vision: 78, sales: 80, clients: 82, leadership: 80, cost: 78, delivery: 85, market: 78 },
  "Industry Average": { financial: 55, people: 52, services: 50, vision: 48, sales: 48, clients: 52, leadership: 50, cost: 48, delivery: 55, market: 48 },
  "Consulting": { financial: 72, people: 70, services: 68, vision: 66, sales: 67, clients: 70, leadership: 69, cost: 67, delivery: 72, market: 67 },
  "Technology Services": { financial: 68, people: 65, services: 70, vision: 68, sales: 63, clients: 65, leadership: 64, cost: 62, delivery: 74, market: 70 },
  "Legal & Compliance": { financial: 65, people: 62, services: 64, vision: 58, sales: 55, clients: 72, leadership: 70, cost: 60, delivery: 68, market: 58 },
  "Financial Advisory": { financial: 75, people: 66, services: 65, vision: 62, sales: 68, clients: 70, leadership: 68, cost: 64, delivery: 66, market: 62 }
};
// Default benchmark for backward compatibility
const BENCHMARKS = { "Professional Services": BENCHMARK_PROFILES["M&A-Ready (PSF)"] };
// Map firm sectors to benchmark profile keys
const SECTOR_BENCHMARK_MAP = { "Consulting": "Consulting", "Technology Services": "Technology Services", "Legal": "Legal & Compliance", "Legal & Compliance": "Legal & Compliance", "Financial Advisory": "Financial Advisory", "Financial Services": "Financial Advisory" };

// ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ
// ASSESSMENT TEMPLATES - Pre-configured starting points
// ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ
const TEMPLATES = {
  "Top Performer": {
    description: "High-performing firm ready for acquisition",
    icon: "ÃÂÃÂÃÂÃÂ°ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ",
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
    icon: "ÃÂÃÂÃÂÃÂ°ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ",
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
    icon: "ÃÂÃÂÃÂÃÂ°ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ§",
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
    icon: "ÃÂÃÂÃÂÃÂ°ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ»",
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

// ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ
// STATE MANAGEMENT
// ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ
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

// ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ
// DEMO DATA - Sample firms and assessments for demonstration
// ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ
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
    fin_rate: createRating(3, "Average day rate ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ£1,800"),
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
    srv_size: createRating(3, "Average deal size ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ£320k"),
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
    cli_size: createRating(3, "42% from ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ£250k+ clients"),
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
    mkt_size: createRating(3, "Large addressable market ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ£2bn+"),
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
    fin_rate: createRating(2, "Day rate ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ£1,150"),
    ppl_talent: createRating(2, "Competency framework exists, inconsistent"),
    ppl_exp: createRating(2, "Glassdoor 3.8"),
    ppl_recruit: createRating(1.5, "4 applicants per role"),
    ppl_churn: createRating(2, "22% attrition"),
    ppl_wf: createRating(2, "40% contractors"),
    srv_prop: createRating(2, "Good capability, weak messaging"),
    srv_innov: createRating(1.5, "Ad-hoc R&D"),
    srv_ip: createRating(2, "Some reusable accelerators"),
    srv_size: createRating(2, "Average deal ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ£85k"),
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
    fin_rate: createRating(1.5, "Day rate ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ£850"),
    ppl_talent: createRating(1.5, "Basic training"),
    ppl_exp: createRating(1, "Glassdoor 3.2"),
    ppl_recruit: createRating(1, "Difficulty attracting talent"),
    ppl_churn: createRating(1, "32% attrition"),
    ppl_wf: createRating(1.5, "Heavy contractor reliance"),
    srv_prop: createRating(1.5, "Generalist positioning"),
    srv_innov: createRating(1, "No formal R&D"),
    srv_ip: createRating(1, "No proprietary IP"),
    srv_size: createRating(1.5, "ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ£40k average deal"),
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
      { id: "demo_apex", name: "Apex Consulting Partners", sector: "Consulting", createdAt: "2026-01-15T10:00:00Z" },
      { id: "demo_techbridge", name: "TechBridge Solutions", sector: "Technology Services", createdAt: "2026-02-01T14:30:00Z" },
      { id: "demo_phoenix", name: "Phoenix Advisory Group", sector: "Consulting", createdAt: "2026-02-05T09:00:00Z" }
    ],
    assessments: {
      "demo_apex_a1": { id: "demo_apex_a1", firmId: "demo_apex", createdAt: "2026-01-20T11:00:00Z", ratings: apexRatings },
      "demo_techbridge_a1": { id: "demo_techbridge_a1", firmId: "demo_techbridge", createdAt: "2026-02-03T16:00:00Z", ratings: techbridgeRatings },
      "demo_phoenix_a1": { id: "demo_phoenix_a1", firmId: "demo_phoenix", createdAt: "2026-02-06T10:30:00Z", ratings: phoenixRatings }
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


// ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ
// SCORING ENGINE
// ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ
const calcScores = (ratings, benchmarkObj) => {
  const bm = benchmarkObj || BENCHMARK_PROFILES["M&A-Ready (PSF)"];
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


    // Calculate M&A Readiness Score (weighted average of theme scores vs benchmarks)
    let readyWeightedSum = 0;
    let readyTotalWeight = 0;
    const themeGaps = [];
    FRAMEWORK.themes.forEach(theme => {
      const ts = themeScores[theme.id];
      const benchPct = bm[theme.id] || 65;
      const tw = theme.metrics.reduce((s, m) => s + (m.weight || 100), 0);
      const currentPct = ts ? ts.pct : 0;
      readyWeightedSum += Math.min(currentPct / benchPct, 1) * 100 * tw;
      readyTotalWeight += tw;
      themeGaps.push({ themeId: theme.id, themeName: theme.name, color: theme.color, current: currentPct, target: benchPct, gap: benchPct - currentPct });
    });
    const readinessScore = readyTotalWeight > 0 ? Math.round(readyWeightedSum / readyTotalWeight) : 0;
    const readinessLevel = readinessScore >= 95 ? "M&A Ready" : readinessScore >= 80 ? "Nearly Ready" : readinessScore >= 60 ? "In Progress" : readinessScore >= 40 ? "Early Stage" : "Foundational";
    themeGaps.sort((a, b) => b.gap - a.gap);

  return {
    themeScores,
    totalScore,
    totalMaxPossible,
    pct: totalMaxPossible > 0 ? Math.round((totalScore / totalMaxPossible) * 100) : 0,
    ratedCount,
      totalMetrics,
      readinessScore,
      readinessLevel,
      themeGaps
  };
};

// ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ
// COLOUR HELPERS
// ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ
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

// ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ
// ANIMATED COMPONENTS
// ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ

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

// ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ
// COMPONENTS
// ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ

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

function MetricCard({ metric, rating, onRate, onComment, onConfidence, evidence, onEvidence }) {
  const [showComment, setShowComment] = useState(false);
  const [showGuidance, setShowGuidance] = useState(false);
  const confidence = rating?.confidence || null;
  const [showEvidence, setShowEvidence] = useState(false);
  const [evidenceType, setEvidenceType] = useState("link");
  const [evidenceLabel, setEvidenceLabel] = useState("");
  const [evidenceContent, setEvidenceContent] = useState("");
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
          {metric.guidance && (
            <div className="mt-1 mb-2">
              <button onClick={() => setShowGuidance(!showGuidance)} className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1">
                <HelpCircle size={12} />
                {showGuidance ? "Hide guidance" : "Scoring guidance"}
              </button>
              {showGuidance && (
                <div className="mt-2 bg-blue-50 border-l-4 border-blue-400 p-3 text-xs text-blue-900 rounded-r leading-relaxed">
                  {metric.guidance}
                </div>
              )}
            </div>
          )}
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
          {/* Confidence Indicator */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <label className="text-xs font-medium text-gray-500 block mb-1.5">Confidence</label>
            <div className="flex gap-1.5">
              {["low", "medium", "high"].map(lvl => (
                <button key={lvl} onClick={() => onConfidence && onConfidence(metric.id, lvl)}
                  className={`flex-1 py-1 px-2 text-xs font-medium rounded transition-colors ${
                    confidence === lvl
                    ? lvl === "high" ? "bg-green-600 text-white" : lvl === "medium" ? "bg-amber-500 text-white" : "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}>
                  {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                </button>
              ))}
            </div>
          </div>

      {/* Evidence Section */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <button onClick={() => setShowEvidence(!showEvidence)} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
          {showEvidence ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
          <span>Evidence ({(evidence||[]).length})</span>
        </button>
        {showEvidence && (
          <div className="mt-3 space-y-2">
            {(evidence||[]).map((item,idx) => (
              <div key={idx} className="flex items-start justify-between p-2 bg-gray-50 rounded text-sm">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800">{item.label}</p>
                  {item.type==="link" ? <a href={item.content} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{item.content}</a> : <p className="text-gray-600 whitespace-pre-wrap">{item.content}</p>}
                </div>
                <button onClick={() => onEvidence((evidence||[]).filter((_,i)=>i!==idx))} className="text-red-500 hover:text-red-700 text-xs ml-2">Remove</button>
              </div>
            ))}
            <div className="p-3 bg-blue-50 rounded space-y-2">
              <div className="flex gap-2">
                <select value={evidenceType} onChange={e=>setEvidenceType(e.target.value)} className="px-2 py-1 border border-gray-300 rounded text-sm">
                  <option value="link">Link</option><option value="note">Note</option>
                </select>
                <input type="text" placeholder="Label" value={evidenceLabel} onChange={e=>setEvidenceLabel(e.target.value)} className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"/>
              </div>
              {evidenceType==="link" ? <input type="url" placeholder="https://..." value={evidenceContent} onChange={e=>setEvidenceContent(e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded text-sm"/> : <textarea placeholder="Add notes..." value={evidenceContent} onChange={e=>setEvidenceContent(e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded text-sm" rows="2"/>}
              <button onClick={() => { if(evidenceLabel&&evidenceContent){onEvidence([...(evidence||[]),{type:evidenceType,label:evidenceLabel,content:evidenceContent}]);setEvidenceLabel("");setEvidenceContent("");}}} className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">Add</button>
            </div>
          </div>
        )}
      </div>
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
  const themes = FRAMEWORK.themes;
  const half = Math.ceil(themes.length / 2);
  const leftThemes = themes.slice(0, half);
  const rightThemes = themes.slice(half);

  const renderTheme = (theme) => (
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
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-bold text-gray-700 mb-3">Maturity Heatmap (All Metrics)</h3>
      <div className="grid grid-cols-2 gap-x-6 gap-y-0">
        <div className="space-y-3">{leftThemes.map(renderTheme)}</div>
        <div className="space-y-3">{rightThemes.map(renderTheme)}</div>
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
        <p className="text-xs text-green-600 opacity-70 mb-1 -mt-1">Ranked by weighted contribution (score Ã importance)</p>
        {strengths.length === 0 ? <p className="text-xs text-gray-400 italic">Rate metrics to see strengths</p> : strengths.map((m, i) => (
          <div key={i} className="flex items-center justify-between py-1.5 border-b border-green-50 last:border-0">
            <div><span className="text-xs font-medium text-gray-700">{m.name}</span><span className="text-xs text-gray-400 ml-1">({m.theme})</span></div>
            <div className="flex items-center gap-1.5 shrink-0"><span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">{m.level}/3</span><span className="text-xs text-gray-400 font-medium">wt Ã{m.weight}</span></div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg border border-red-200 p-4">
        <h3 className="text-sm font-bold text-red-700 mb-2 flex items-center gap-1"><AlertCircle size={14} /> Key Improvement Areas</h3>
        <p className="text-xs text-red-600 opacity-70 mb-1 -mt-1">Ranked by improvement potential â highest impact first</p>
        {weaknesses.length === 0 ? <p className="text-xs text-gray-400 italic">Rate metrics to see areas for improvement</p> : weaknesses.map((m, i) => (
          <div key={i} className="flex items-center justify-between py-1.5 border-b border-red-50 last:border-0">
            <div><span className="text-xs font-medium text-gray-700">{m.name}</span><span className="text-xs text-gray-400 ml-1">({m.theme})</span></div>
            <div className="flex items-center gap-1.5 shrink-0"><span className="text-xs font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">{m.level}/3</span><span className="text-xs text-gray-400 font-medium">wt Ã{m.weight}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ
// EXPORT FUNCTIONS
// ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ
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

const exportToPDF = (assessment, firmName, firmSector, scores) => {
  const printWindow = window.open('', '_blank');

  // Get benchmark data for the sector
  const sectorKey = Object.keys(BENCHMARKS).find(
    key => key.toLowerCase() === firmSector.toLowerCase()
  ) || Object.keys(BENCHMARKS)[0];
  const benchmarkData = (BENCHMARK_PROFILES[sectorKey] || BENCHMARK_PROFILES["M&A-Ready (PSF)"]) || {};

  // Format the assessment date
  const assessmentDate = new Date(assessment.createdAt);
  const dateStr = assessmentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calculate strengths and weaknesses
  const metricsWithScores = [];
  FRAMEWORK.themes.forEach(theme => {
    theme.metrics.forEach(metric => {
      const rating = assessment.ratings[metric.id];
      const level = rating ? rating.level : 0;
      metricsWithScores.push({
        metricId: metric.id,
        metricName: metric.name,
        themeName: theme.name,
        weight: metric.weight,
        level: level,
        strengthScore: level > 0 ? level * metric.weight : 0,
        weaknessScore: level < 3 ? metric.weight * (3 - level) : 0
      });
    });
  });

  const strengths = metricsWithScores
    .filter(m => m.level > 0)
    .sort((a, b) => b.strengthScore - a.strengthScore)
    .slice(0, 5);

  const weaknesses = metricsWithScores
    .filter(m => m.level < 3)
    .sort((a, b) => b.weaknessScore - a.weaknessScore)
    .slice(0, 5);

  // Build theme score cards HTML
  const themeCardsHtml = FRAMEWORK.themes.map(theme => {
    const themeScore = scores.themeScores[theme.id];
    const pct = themeScore ? Math.round(themeScore.pct) : 0;
    let scoreColor = '#922B21'; // red
    if (pct >= 66) scoreColor = '#1E8449'; // green
    else if (pct >= 33) scoreColor = '#B7950B'; // amber

    return `
      <div style="
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 16px;
        text-align: center;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      ">
        <div style="font-size: 14px; color: #666; margin-bottom: 8px;">${theme.name}</div>
        <div style="font-size: 32px; font-weight: bold; color: ${scoreColor};">${pct}%</div>
      </div>
    `;
  }).join('');

  // Build benchmark comparison table
  const benchmarkRows = FRAMEWORK.themes.map(theme => {
    const themeScore = scores.themeScores[theme.id];
    const firmPct = themeScore ? Math.round(themeScore.pct) : 0;
    const benchmarkPct = Math.round(benchmarkData[theme.id] || 0);

    let scoreColor = '#922B21';
    if (firmPct >= 66) scoreColor = '#1E8449';
    else if (firmPct >= 33) scoreColor = '#B7950B';

    return `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee; font-weight: 500;">
          ${theme.name}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          <div style="background: #f5f5f5; height: 24px; border-radius: 4px; position: relative; overflow: hidden;">
            <div style="
              background: ${scoreColor};
              height: 100%;
              width: ${firmPct}%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 12px;
              font-weight: 600;
            ">
              ${firmPct > 20 ? firmPct + '%' : ''}
            </div>
            ${firmPct <= 20 ? `<div style="position: absolute; left: ${firmPct}%; top: 0; height: 100%; display: flex; align-items: center; color: #333; font-size: 12px; font-weight: 600;">${firmPct}%</div>` : ''}
          </div>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; color: #666; font-size: 14px;">
          M&A-Ready: ${benchmarkPct}%
        </td>
      </tr>
    `;
  }).join('');

  // Build strengths and weaknesses section
  const strengthsHtml = strengths.map((m, idx) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${idx + 1}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${m.metricName}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666;">${m.themeName}</td>
    </tr>
  `).join('');

  const weaknessesHtml = weaknesses.map((m, idx) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${idx + 1}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${m.metricName}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; color: #666;">${m.themeName}</td>
    </tr>
  `).join('');

  // Build heatmap section
  const heatmapHtml = FRAMEWORK.themes.map((theme, idx) => {
    const metrics = theme.metrics.map(metric => {
      const rating = assessment.ratings[metric.id];
      const level = rating ? rating.level : 0;
      let cellColor = '#ddd';
      if (level === 3) cellColor = '#1E8449';
      else if (level === 2) cellColor = '#B7950B';
      else if (level === 1) cellColor = '#D35400';

      return `
        <div style="
          display: inline-block;
          width: 30px;
          height: 30px;
          background: ${cellColor};
          border: 1px solid #ccc;
          margin: 4px;
          border-radius: 4px;
          text-align: center;
          line-height: 30px;
          font-size: 12px;
          font-weight: bold;
          color: white;
        ">
          ${level}
        </div>
      `;
    }).join('');

    return `
      <div style="margin-bottom: 24px; page-break-inside: avoid;">
        <h4 style="margin: 0 0 12px 0; color: #1B4F72; font-size: 14px; font-weight: 600;">
          ${theme.name}
        </h4>
        <div style="display: flex; flex-wrap: wrap;">
          ${metrics}
        </div>
      </div>
    `;
  }).join('');

  // Get benchmark sector display name
  const benchmarkSectorDisplay = sectorKey === 'Professional Services' ? 'M&A-Ready' : 'Peer';

  // Build the complete HTML
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${firmName} Maturity Assessment Report</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        @page {
          size: A4;
          margin: 0.5in;
          margin-bottom: 0.75in;
        }

        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .page-break {
            page-break-before: always;
          }
          .no-break {
            page-break-inside: avoid;
          }
        }

        body {
          font-family: 'Inter', 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          background: white;
        }

        .header {
          border-bottom: 3px solid #1B4F72;
          padding-bottom: 24px;
          margin-bottom: 32px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .header-left h1 {
          font-size: 28px;
          color: #1B4F72;
          margin-bottom: 8px;
          font-weight: 700;
        }

        .header-left p {
          color: #666;
          font-size: 14px;
          margin: 4px 0;
        }

        .header-right {
          text-align: right;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .overall-score {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: #1E8449;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 48px;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        .overall-score.amber {
          background: #B7950B;
        }

        .overall-score.red {
          background: #922B21;
        }

        .header-right-text {
          font-size: 12px;
          color: #666;
          font-weight: 500;
        }

        .section {
          margin-bottom: 32px;
          page-break-inside: avoid;
        }

        .section h2 {
          font-size: 18px;
          color: #1B4F72;
          border-bottom: 2px solid #1B4F72;
          padding-bottom: 8px;
          margin-bottom: 16px;
          font-weight: 700;
        }

        .section h3 {
          font-size: 14px;
          color: #1B4F72;
          margin-bottom: 12px;
          font-weight: 600;
          margin-top: 16px;
        }

        .theme-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        .theme-grid-item {
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 16px;
          text-align: center;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .theme-grid-item-name {
          font-size: 13px;
          color: #666;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .theme-grid-item-score {
          font-size: 32px;
          font-weight: 700;
        }

        .benchmark-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 12px;
        }

        .benchmark-table thead tr {
          background: #f9f9f9;
        }

        .benchmark-table th {
          padding: 12px;
          text-align: left;
          font-weight: 600;
          color: #1B4F72;
          font-size: 13px;
          border-bottom: 2px solid #ddd;
        }

        .benchmark-table td {
          padding: 12px;
          border-bottom: 1px solid #eee;
          font-size: 13px;
        }

        .two-column {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .two-column-item {
          page-break-inside: avoid;
        }

        .two-column-item table {
          width: 100%;
          border-collapse: collapse;
        }

        .two-column-item th {
          background: #f9f9f9;
          padding: 10px;
          text-align: left;
          font-weight: 600;
          color: #1B4F72;
          font-size: 12px;
          border-bottom: 2px solid #ddd;
        }

        .two-column-item td {
          padding: 10px;
          border-bottom: 1px solid #eee;
          font-size: 12px;
        }

        .heatmap-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .heatmap-item {
          page-break-inside: avoid;
        }

        .heatmap-item h4 {
          margin: 0 0 12px 0;
          color: #1B4F72;
          font-size: 14px;
          font-weight: 600;
        }

        .metric-cells {
          display: flex;
          flex-wrap: wrap;
        }

        .metric-cell {
          display: inline-block;
          width: 30px;
          height: 30px;
          margin: 4px;
          border-radius: 4px;
          border: 1px solid #ccc;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          color: white;
        }

        .metric-cell.level0 {
          background: #ddd;
        }

        .metric-cell.level1 {
          background: #D35400;
        }

        .metric-cell.level2 {
          background: #B7950B;
        }

        .metric-cell.level3 {
          background: #1E8449;
        }

        @media screen {
          body {
            padding: 20px;
          }
        }

        @media print {
          .theme-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 10px;
          }

          .two-column {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }

          .heatmap-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
        }
      </style>
    </head>
    <body>
      <!-- Header -->
      <div class="header no-break">
        <div class="header-left">
          <h1>${firmName}</h1>
          <p><strong>Assessment Date:</strong> ${dateStr}</p>
          <p><strong>Sector:</strong> ${firmSector}</p>
          <p><strong>Status:</strong> ${scores.ratedCount} of ${scores.totalMetrics} metrics rated</p>
        </div>
        <div class="header-right">
          <div class="overall-score ${
            scores.pct >= 66 ? '' : scores.pct >= 33 ? 'amber' : 'red'
          }">
            ${Math.round(scores.pct)}%
          </div>
          <div class="header-right-text">Overall Score</div>
          <div class="header-right-text">${Math.round(scores.totalScore)} / ${scores.totalMaxPossible}</div>
        </div>
      </div>

      <!-- Theme Score Cards -->
      <div class="section no-break">
        <h2>Theme Maturity Scores</h2>
        <div class="theme-grid">
          ${themeCardsHtml}
        </div>
      </div>

      <!-- Benchmark Comparison -->
      <div class="section no-break">
        <h2>${benchmarkSectorDisplay} Benchmark Comparison</h2>
        <table class="benchmark-table">
          <thead>
            <tr>
              <th>Theme</th>
              <th style="width: 50%;">Score</th>
              <th>Average</th>
            </tr>
          </thead>
          <tbody>
            ${benchmarkRows}
          </tbody>
        </table>
      </div>

      <!-- Strengths and Weaknesses -->
      <div class="section no-break">
        <h2>Strengths & Opportunities</h2>
        <div class="two-column">
          <div class="two-column-item">
            <h3>Top 5 Strengths</h3>
            <table>
              <thead>
                <tr>
                  <th style="width: 30px;">Rank</th>
                  <th>Metric</th>
                  <th>Theme</th>
                </tr>
              </thead>
              <tbody>
                ${strengthsHtml || '<tr><td colspan="3" style="text-align: center; color: #999;">No rated metrics</td></tr>'}
              </tbody>
            </table>
          </div>
          <div class="two-column-item">
            <h3>Top 5 Improvement Areas</h3>
            <table>
              <thead>
                <tr>
                  <th style="width: 30px;">Rank</th>
                  <th>Metric</th>
                  <th>Theme</th>
                </tr>
              </thead>
              <tbody>
                ${weaknessesHtml || '<tr><td colspan="3" style="text-align: center; color: #999;">No unrated metrics</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Heatmap -->
      <div class="section">
        <h2>Maturity Heatmap</h2>
        <div class="heatmap-container">
          ${heatmapHtml}
        </div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.onload = () => { printWindow.print(); };
};

// ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ
// ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ


// ─── Executive Summary PDF Export ────────────────────────────────
const exportExecutiveSummary = (assessment, firmName, firmSector, scores) => {
  const w = window.open("", "_blank");
  if (!w) { alert("Please allow popups for PDF export."); return; }
  const date = new Date(assessment.createdAt).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });
  const { readinessScore, readinessLevel, themeGaps } = scores;
  const overallPct = scores.pct;
  // Get top strengths and gaps at metric level
  const metricScored = [];
  FRAMEWORK.themes.forEach(t => t.metrics.forEach(m => {
    const r = assessment.ratings[m.id];
    if (r && r.level) metricScored.push({ name: m.name, theme: t.name, level: r.level, weight: m.weight || 100 });
  }));
  const topStrengths = metricScored.filter(m => m.level >= 2.5).sort((a,b) => b.level * b.weight - a.level * a.weight).slice(0, 3);
  const topGapsMetric = metricScored.filter(m => m.level <= 1.5).sort((a,b) => a.level - b.level).slice(0, 3);
  const themeGridHtml = FRAMEWORK.themes.map(t => {
    const ts = scores.themeScores[t.id];
    const pct = ts ? Math.round(ts.pct) : 0;
    const bench = BENCHMARK_PROFILES["M&A-Ready (PSF)"][t.id] || 65;
    const color = pct >= bench ? "#059669" : pct >= bench - 10 ? "#d97706" : "#dc2626";
    return `<div style="border:1px solid #e2e8f0;border-radius:8px;padding:12px;text-align:center"><div style="font-size:10px;color:#64748b;margin-bottom:4px">${t.name}</div><div style="font-size:28px;font-weight:700;color:${color}">${pct}%</div><div style="font-size:9px;color:#94a3b8">Target: ${bench}%</div></div>`;
  }).join("");
  const strengthsHtml = topStrengths.length ? topStrengths.map((m, i) => `<tr><td style="padding:6px 8px;border-bottom:1px solid #f1f5f9;color:#334155;font-size:12px">${i + 1}. ${m.name}</td><td style="padding:6px 8px;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:11px">${m.theme}</td></tr>`).join("") : "<tr><td colspan=2 style=\"text-align:center;color:#94a3b8;padding:8px;font-size:12px\">No strong ratings yet</td></tr>";
  const gapsHtml = topGapsMetric.length ? topGapsMetric.map((m, i) => `<tr><td style="padding:6px 8px;border-bottom:1px solid #f1f5f9;color:#334155;font-size:12px">${i + 1}. ${m.name}</td><td style="padding:6px 8px;border-bottom:1px solid #f1f5f9;color:#64748b;font-size:11px">${m.theme}</td></tr>`).join("") : "<tr><td colspan=2 style=\"text-align:center;color:#94a3b8;padding:8px;font-size:12px\">No critical gaps identified</td></tr>";
  const levelColor = readinessLevel === "M&A Ready" ? "#059669" : readinessLevel === "Nearly Ready" ? "#2563eb" : readinessLevel === "In Progress" ? "#d97706" : "#ea580c";
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${firmName} - M&A Readiness Summary</title>
  <style>@page{size:A4;margin:0.6in}*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;color:#334155;background:#fff}</style></head><body>
  <div style="text-align:center;border-bottom:3px solid #1B4F72;padding-bottom:16px;margin-bottom:24px">
    <h1 style="font-size:22px;color:#1B4F72;margin-bottom:4px">M&A Readiness Executive Summary</h1>
    <p style="color:#64748b;font-size:12px">${firmName} | ${firmSector || "Professional Services"} | ${date}</p>
  </div>
  <div style="background:linear-gradient(135deg,#f0f9ff,#eff6ff);border:2px solid #1B4F72;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px">
    <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px">M&A Readiness Score</div>
    <div style="font-size:56px;font-weight:800;color:${levelColor};margin:8px 0">${readinessScore}%</div>
    <div style="font-size:16px;font-weight:600;color:${levelColor}">${readinessLevel}</div>
    <div style="font-size:11px;color:#94a3b8;margin-top:6px">Overall Maturity: ${overallPct}%</div>
  </div>
  <div style="margin-bottom:24px">
    <h2 style="font-size:14px;color:#1B4F72;border-bottom:2px solid #1B4F72;padding-bottom:4px;margin-bottom:12px">Theme Maturity Overview</h2>
    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px">${themeGridHtml}</div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px">
    <div>
      <h2 style="font-size:14px;color:#059669;border-bottom:2px solid #059669;padding-bottom:4px;margin-bottom:8px">Top Strengths</h2>
      <table style="width:100%;border-collapse:collapse"><thead><tr><th style="text-align:left;padding:6px 8px;font-size:11px;color:#1B4F72;border-bottom:2px solid #e2e8f0">Metric</th><th style="text-align:left;padding:6px 8px;font-size:11px;color:#1B4F72;border-bottom:2px solid #e2e8f0">Theme</th></tr></thead><tbody>${strengthsHtml}</tbody></table>
    </div>
    <div>
      <h2 style="font-size:14px;color:#dc2626;border-bottom:2px solid #dc2626;padding-bottom:4px;margin-bottom:8px">Priority Gaps</h2>
      <table style="width:100%;border-collapse:collapse"><thead><tr><th style="text-align:left;padding:6px 8px;font-size:11px;color:#1B4F72;border-bottom:2px solid #e2e8f0">Metric</th><th style="text-align:left;padding:6px 8px;font-size:11px;color:#1B4F72;border-bottom:2px solid #e2e8f0">Theme</th></tr></thead><tbody>${gapsHtml}</tbody></table>
    </div>
  </div>
  <div style="margin-top:20px;padding-top:16px;border-top:1px solid #e2e8f0;text-align:center;font-size:9px;color:#94a3b8">
    <p>Growth Drivers Maturity Framework | Confidential | Generated ${new Date().toLocaleDateString("en-GB")}</p>
    <p style="margin-top:2px">M&A-Ready benchmarks: top-quartile PSF performance from 20+ industry sources</p>
  </div>
  </body></html>`;
  w.document.write(html);
  w.document.close();
  setTimeout(() => w.print(), 500);
};


function exportDetailedReport(assessment, firmName, firmSector, scores, benchmarkProfile) {
  const benchValues = BENCHMARK_PROFILES[benchmarkProfile];
  const dateStr = new Date(assessment.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const pct = scores.pct;
  const readiness = scores.readinessScore;
  const readinessLevel = scores.readinessLevel;

  // Gather theme data
  const themeData = FRAMEWORK.themes.map(theme => {
    const ts = scores.themeScores[theme.id];
    const bp = benchValues[theme.id] || 65;
    const gap = ts ? ts.pct - bp : 0;
    const metrics = theme.metrics.map(m => {
      const r = assessment.ratings[m.id];
      return { name: m.name, score: r ? r.score : 0, max: 3, comment: r ? r.comment || "" : "", confidence: r ? r.confidence || "" : "", evidence: r ? r.evidence || [] : [], weight: m.weight, action: m.improvementAction || "" };
    });
    return { id: theme.id, name: theme.name, color: theme.color, pct: ts ? ts.pct : 0, benchmark: bp, gap, metrics };
  });

  // Improvement items
  const improvements = [];
  themeData.forEach(td => {
    td.metrics.forEach(m => {
      const metricPct = Math.round((m.score / m.max) * 100);
      const gapVal = td.benchmark - metricPct;
      if (gapVal > 0) improvements.push({ theme: td.name, metric: m.name, pct: metricPct, target: td.benchmark, gap: gapVal, action: m.action });
    });
  });
  improvements.sort((a, b) => b.gap - a.gap);

  // Top strengths and weaknesses
  const sortedThemes = [...themeData].sort((a, b) => b.gap - a.gap);
  const strengths = sortedThemes.filter(t => t.gap >= 0).slice(0, 3);
  const weaknesses = sortedThemes.filter(t => t.gap < 0).sort((a, b) => a.gap - b.gap).slice(0, 3);

  // Build HTML report
  const levelColor = readiness >= 80 ? "#16a34a" : readiness >= 60 ? "#d97706" : "#dc2626";
  let html = `<!DOCTYPE html><html><head><title>Detailed Assessment Report - ${firmName}</title>
  <style>
    @page { size: A4; margin: 20mm; }
    body { font-family: "Segoe UI", system-ui, sans-serif; color: #1e293b; line-height: 1.5; margin: 0; padding: 0; }
    .page { page-break-after: always; padding: 40px; min-height: 900px; }
    .page:last-child { page-break-after: auto; }
    h1 { color: #1e3a5f; font-size: 28px; margin: 0 0 8px; }
    h2 { color: #1e3a5f; font-size: 22px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin: 24px 0 16px; }
    h3 { color: #334155; font-size: 16px; margin: 16px 0 8px; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px; }
    th { background: #f1f5f9; text-align: left; padding: 8px 12px; border: 1px solid #e2e8f0; font-weight: 600; }
    td { padding: 8px 12px; border: 1px solid #e2e8f0; vertical-align: top; }
    .score-badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-weight: 600; font-size: 13px; }
    .bar { height: 16px; border-radius: 4px; display: inline-block; vertical-align: middle; }
    .priority-critical { color: #dc2626; font-weight: 600; }
    .priority-important { color: #d97706; font-weight: 600; }
    .priority-nice { color: #2563eb; }
    .footer { text-align: center; color: #94a3b8; font-size: 11px; margin-top: 24px; }
  </style></head><body>`;

  // Page 1: Cover
  html += `<div class="page" style="display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;">
    <div style="margin-bottom:40px;"><div style="width:80px;height:80px;background:#1e3a5f;border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;"><span style="color:white;font-size:36px;">&#9678;</span></div>
    <h1 style="font-size:36px;margin-bottom:4px;">Growth Drivers Maturity Framework</h1>
    <p style="color:#64748b;font-size:16px;">M&amp;A Due Diligence Assessment Report</p></div>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:40px;max-width:500px;width:100%;">
    <h2 style="border:none;margin:0 0 16px;font-size:28px;">${firmName}</h2>
    <p style="color:#64748b;margin:4px 0;">Sector: ${firmSector || "Professional Services"}</p>
    <p style="color:#64748b;margin:4px 0 24px;">Assessment Date: ${dateStr}</p>
    <div style="display:flex;gap:24px;justify-content:center;">
    <div><div style="font-size:48px;font-weight:700;color:#1e3a5f;">${pct}%</div><div style="color:#64748b;">Overall Maturity</div></div>
    <div><div style="font-size:48px;font-weight:700;color:${levelColor};">${readiness}%</div><div style="color:#64748b;">M&amp;A Readiness</div></div>
    </div><div style="margin-top:16px;"><span class="score-badge" style="background:${levelColor}22;color:${levelColor};">${readinessLevel}</span></div>
    </div>
    <p style="color:#94a3b8;margin-top:40px;font-size:12px;">Benchmark Profile: ${benchmarkProfile}</p>
  </div>`;

  // Page 2: Executive Summary
  html += `<div class="page">
    <h1>Executive Summary</h1>
    <p style="color:#64748b;">${firmName} | ${dateStr} | Benchmark: ${benchmarkProfile}</p>
    <div style="display:flex;gap:24px;margin:20px 0;">
    <div style="flex:1;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;text-align:center;"><div style="font-size:14px;color:#16a34a;font-weight:600;">OVERALL MATURITY</div><div style="font-size:36px;font-weight:700;color:#1e3a5f;">${pct}%</div><div style="color:#64748b;">${scores.ratedCount}/${scores.totalMetrics} metrics rated</div></div>
    <div style="flex:1;background:${levelColor}11;border:1px solid ${levelColor}44;border-radius:8px;padding:16px;text-align:center;"><div style="font-size:14px;color:${levelColor};font-weight:600;">M&amp;A READINESS</div><div style="font-size:36px;font-weight:700;color:${levelColor};">${readiness}%</div><div style="color:#64748b;">${readinessLevel}</div></div>
    </div>

    <div style="display:flex;gap:24px;margin:20px 0;">
    <div style="flex:1;"><h3 style="color:#16a34a;">Top Strengths</h3>
    ${strengths.map(s => `<div style="padding:6px 0;border-bottom:1px solid #f1f5f9;"><strong>${s.name}</strong> <span style="color:#16a34a;font-weight:600;">${s.pct}%</span> <span style="color:#94a3b8;">(+${s.gap}% vs benchmark)</span></div>`).join("")}
    </div>
    <div style="flex:1;"><h3 style="color:#dc2626;">Key Gaps</h3>
    ${weaknesses.length > 0 ? weaknesses.map(w => `<div style="padding:6px 0;border-bottom:1px solid #f1f5f9;"><strong>${w.name}</strong> <span style="color:#dc2626;font-weight:600;">${w.pct}%</span> <span style="color:#94a3b8;">(${w.gap}% vs benchmark)</span></div>`).join("") : "<div style=\"padding:6px 0;color:#16a34a;\">All themes meet or exceed benchmarks!</div>"}
    </div></div>

    <h2>Theme Overview</h2>
    <table><thead><tr><th>Theme</th><th>Score</th><th>Benchmark</th><th>Gap</th><th>Status</th></tr></thead><tbody>
    ${themeData.map(t => `<tr><td><strong>${t.name}</strong></td><td>${t.pct}%</td><td>${t.benchmark}%</td><td style="color:${t.gap >= 0 ? "#16a34a" : "#dc2626"};font-weight:600;">${t.gap >= 0 ? "+" : ""}${t.gap}%</td><td>${t.gap >= 0 ? "&#10003; Above" : "&#9888; Below"}</td></tr>`).join("")}
    </tbody></table>
    <div class="footer">Growth Drivers Maturity Framework - Confidential</div>
  </div>`;

  // Pages 3-4: Theme Detail
  for (let pageIdx = 0; pageIdx < 2; pageIdx++) {
    const pageThemes = themeData.slice(pageIdx * 5, (pageIdx + 1) * 5);
    html += `<div class="page">
    <h1>Theme Detail ${pageIdx === 0 ? "(1/2)" : "(2/2)"}</h1>
    <p style="color:#64748b;">${firmName} | ${dateStr}</p>`;

    pageThemes.forEach(td => {
      html += `<div style="margin:16px 0 12px;border-left:4px solid ${td.color};padding-left:12px;">
        <h3 style="margin:0;display:flex;justify-content:space-between;"><span>${td.name}</span><span style="color:${td.gap >= 0 ? "#16a34a" : "#dc2626"};font-size:14px;">${td.pct}% (${td.gap >= 0 ? "+" : ""}${td.gap}% vs ${td.benchmark}%)</span></h3>
      </div>
      <table><thead><tr><th style="width:35%;">Metric</th><th style="width:10%;">Score</th><th style="width:12%;">Confidence</th><th>Comments</th></tr></thead><tbody>
      ${td.metrics.map(m => `<tr><td>${m.name}</td><td><span class="score-badge" style="background:${m.score === 3 ? "#dcfce7" : m.score === 2 ? "#fef3c7" : "#fee2e2"};color:${m.score === 3 ? "#16a34a" : m.score === 2 ? "#d97706" : "#dc2626"};">${m.score}/${m.max}</span></td><td>${m.confidence || "-"}</td><td style="font-size:12px;color:#475569;">${m.comment || "-"}</td></tr>`).join("")}
      </tbody></table>`;

      // Evidence if any
      const withEvidence = td.metrics.filter(m => m.evidence && m.evidence.length > 0);
      if (withEvidence.length > 0) {
        html += `<div style="margin:4px 0 8px;font-size:12px;color:#64748b;"><strong>Evidence:</strong> `;
        withEvidence.forEach(m => {
          m.evidence.forEach(e => {
            html += `<span style="margin-right:8px;">[${m.name}] ${e.label || e.content || ""}</span>`;
          });
        });
        html += `</div>`;
      }
    });

    html += `<div class="footer">Growth Drivers Maturity Framework - Confidential</div></div>`;
  }

  // Page 5: Benchmark Comparison
  html += `<div class="page">
    <h1>Benchmark Comparison</h1>
    <p style="color:#64748b;">Comparing ${firmName} scores against all available benchmark profiles</p>
    <table><thead><tr><th>Theme</th><th>${firmName}</th>
    ${Object.keys(BENCHMARK_PROFILES).map(k => `<th>${k}</th>`).join("")}
    </tr></thead><tbody>
    ${themeData.map(td => `<tr><td><strong>${td.name}</strong></td><td style="font-weight:600;">${td.pct}%</td>
    ${Object.entries(BENCHMARK_PROFILES).map(([k, profile]) => {
      const bv = profile[td.id] || 0;
      const diff = td.pct - bv;
      return `<td style="color:${diff >= 0 ? "#16a34a" : "#dc2626"};">${bv}% <span style="font-size:11px;">(${diff >= 0 ? "+" : ""}${diff})</span></td>`;
    }).join("")}</tr>`).join("")}
    </tbody></table>

    <div style="margin-top:16px;padding:12px;background:#f8fafc;border-radius:8px;font-size:13px;">
    <strong>Reading this table:</strong> Each cell shows the benchmark target and the difference from ${firmName}'s score. 
    <span style="color:#16a34a;">Green</span> indicates the firm meets or exceeds the benchmark. 
    <span style="color:#dc2626;">Red</span> indicates a gap to close.
    </div>
    <div class="footer">Growth Drivers Maturity Framework - Confidential</div>
  </div>`;

  // Page 6: Improvement Roadmap
  html += `<div class="page">
    <h1>Improvement Roadmap</h1>
    <p style="color:#64748b;">Prioritised actions to close gaps against ${benchmarkProfile} benchmarks</p>`;

  if (improvements.length === 0) {
    html += `<div style="padding:24px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;text-align:center;margin:24px 0;">
    <div style="font-size:18px;color:#16a34a;font-weight:600;">All metrics meet or exceed benchmarks!</div>
    <p style="color:#64748b;">No improvement actions required against the selected benchmark profile.</p></div>`;
  } else {
    const critical = improvements.filter(i => i.gap >= 10);
    const important = improvements.filter(i => i.gap >= 5 && i.gap < 10);
    const nice = improvements.filter(i => i.gap > 0 && i.gap < 5);

    if (critical.length > 0) {
      html += `<h2 style="color:#dc2626;border-color:#fecaca;">Critical (Gap &ge; 10%)</h2>
      <table><thead><tr><th>Theme</th><th>Metric</th><th>Current</th><th>Target</th><th>Gap</th><th>Recommended Action</th></tr></thead><tbody>
      ${critical.map(i => `<tr><td>${i.theme}</td><td>${i.metric}</td><td>${i.pct}%</td><td>${i.target}%</td><td class="priority-critical">${i.gap}%</td><td style="font-size:12px;">${i.action}</td></tr>`).join("")}
      </tbody></table>`;
    }
    if (important.length > 0) {
      html += `<h2 style="color:#d97706;border-color:#fde68a;">Important (Gap 5-9%)</h2>
      <table><thead><tr><th>Theme</th><th>Metric</th><th>Current</th><th>Target</th><th>Gap</th><th>Recommended Action</th></tr></thead><tbody>
      ${important.map(i => `<tr><td>${i.theme}</td><td>${i.metric}</td><td>${i.pct}%</td><td>${i.target}%</td><td class="priority-important">${i.gap}%</td><td style="font-size:12px;">${i.action}</td></tr>`).join("")}
      </tbody></table>`;
    }
    if (nice.length > 0) {
      html += `<h2 style="color:#2563eb;border-color:#bfdbfe;">Nice to Have (Gap 1-4%)</h2>
      <table><thead><tr><th>Theme</th><th>Metric</th><th>Current</th><th>Target</th><th>Gap</th><th>Recommended Action</th></tr></thead><tbody>
      ${nice.map(i => `<tr><td>${i.theme}</td><td>${i.metric}</td><td>${i.pct}%</td><td>${i.target}%</td><td class="priority-nice">${i.gap}%</td><td style="font-size:12px;">${i.action}</td></tr>`).join("")}
      </tbody></table>`;
    }
  }
  html += `<div class="footer">Growth Drivers Maturity Framework - Confidential</div></div>`;

  // Page 7: Appendix - Full Metric Scores
  html += `<div class="page">
    <h1>Appendix: Full Metric Scores</h1>
    <p style="color:#64748b;">Complete assessment data for ${firmName} - ${dateStr}</p>
    <table><thead><tr><th>Theme</th><th>Metric</th><th>Score</th><th>Weight</th><th>Confidence</th></tr></thead><tbody>`;

  themeData.forEach(td => {
    td.metrics.forEach((m, idx) => {
      html += `<tr${idx === 0 ? ` style="border-top:2px solid ${td.color};"` : ""}>
        <td>${idx === 0 ? `<strong style="color:${td.color};">${td.name}</strong>` : ""}</td>
        <td>${m.name}</td>
        <td><span class="score-badge" style="background:${m.score === 3 ? "#dcfce7" : m.score === 2 ? "#fef3c7" : "#fee2e2"};color:${m.score === 3 ? "#16a34a" : m.score === 2 ? "#d97706" : "#dc2626"};">${m.score}/${m.max}</span></td>
        <td>${m.weight}</td>
        <td>${m.confidence || "-"}</td></tr>`;
    });
  });

  html += `</tbody></table>
    <div style="margin-top:16px;padding:12px;background:#f8fafc;border-radius:8px;font-size:13px;">
    <strong>Scoring:</strong> 1 = Foundational, 2 = Evolving, 3 = Optimised. Weight determines impact on theme score.
    </div>
    <div class="footer" style="margin-top:32px;">
    <div>Growth Drivers Maturity Framework - Confidential</div>
    <div style="margin-top:8px;">Generated on ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</div>
    </div>
  </div>`;

  html += `</body></html>`;

  // Open and print
  const w = window.open("", "_blank");
  w.document.write(html);
  w.document.close();
  setTimeout(() => w.print(), 500);
}

function ExportPanel({ assessment, firmName, firmSector, scores, benchmarkProfile }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
        <Download size={14} /> Export Assessment
      </h3>
      <div className="flex gap-2">
        <button onClick={() => exportExecutiveSummary(assessment, firmName, firmSector, scores)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-medium text-sm transition shadow-sm">
          <FileText size={16} />
          Executive Summary (1 Page)
        </button>
        <button onClick={() => exportToPDF(assessment, firmName, firmSector, scores)}
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
        <button
          onClick={() => exportDetailedReport(assessment, firmName, firmSector, scores, benchmarkProfile)}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all shadow-sm font-medium text-sm col-span-full"
        >
          <FileText size={14} /> Detailed Assessment Report
        </button>
      </div>
    </div>
  );
}


function RadarOverview({ radarData , benchmarkProfile }) {
  const benchmark = BENCHMARK_PROFILES[benchmarkProfile || "M&A-Ready (PSF)"];
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
          <PolarAngleAxis dataKey="theme" tick={({ x, y, payload, textAnchor }) => {
              const n = payload.value;
              let lines;
              if (n.length <= 14) { lines = [n]; }
              else {
                const a = n.indexOf("&");
                if (a > 0) { lines = [n.substring(0, a + 1).trim(), n.substring(a + 2).trim()]; }
                else { const s = n.lastIndexOf(" ", Math.ceil(n.length / 2)); lines = s > 0 ? [n.substring(0, s), n.substring(s + 1)] : [n]; }
              }
              return (<text x={x} y={y} textAnchor={textAnchor} fontSize={9} fill="#666">{lines.map((l, i) => (<tspan key={i} x={x} dy={i === 0 ? -(lines.length - 1) * 5 : 11}>{l}</tspan>))}</text>);
            }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 8 }} />
          <Radar name="Your Firm" dataKey="score" stroke="#1B4F72" fill="#1B4F72" fillOpacity={0.3} strokeWidth={2} />
          <Radar name="M&A-Ready" dataKey="benchmark" stroke="#D97706" fill="#D97706" fillOpacity={0.05} strokeWidth={2} strokeDasharray="4 4" />
          <Tooltip formatter={(v, name) => [v + '%', name]} />
        </RadarChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-6 mt-1">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{backgroundColor:'#1B4F72'}} /><span className="text-xs text-gray-500">Your Firm</span></div>
        <div className="flex items-center gap-1.5"><div className="w-8 h-0 border-t-2 border-dashed" style={{borderColor:'#D97706'}} /><span className="text-xs text-gray-500">M&A-Ready</span></div>
      </div>
    </div>
  );
}

function BenchmarkComparison({ scores , benchmarkProfile }) {
  const benchmark = BENCHMARK_PROFILES[benchmarkProfile || "M&A-Ready (PSF)"];

  const comparisonData = FRAMEWORK.themes.map(t => {
    const firm = scores?.themeScores?.[t.id]?.pct || 0;
    const bench = benchmark[t.id] || 50;
    const diff = firm - bench;
    // RAG: green if >5 above benchmark, red if >5 below, amber if within 5
    const firmFill = diff > 5 ? '#27AE60' : diff < -5 ? '#E74C3C' : '#F39C12';
    return {
      name: t.name,
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
          <BarChart3 size={14} /> M&A-Ready Benchmark
        </h3>
        <p style={{ fontSize: "11px", color: "#64748b", margin: "4px 0 8px 0", lineHeight: "1.4" }}>Top-quartile PSF performance levels associated with premium M&A valuations. Synthesised from 20+ industry sources including Hinge Research, Deltek, SPI Research &amp; Mercer.</p>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={comparisonData} layout="vertical" margin={{ left: 20, right: 20 }}>
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
          <YAxis dataKey="name" type="category" width={130} tick={({ x, y, payload }) => {
                const n = payload.value;
                let lines;
                if (n.length <= 14) { lines = [n]; }
                else {
                  const a = n.indexOf("&");
                  if (a > 0) { lines = [n.substring(0, a + 1).trim(), n.substring(a + 2).trim()]; }
                  else { const s = n.lastIndexOf(" ", Math.ceil(n.length / 2)); lines = s > 0 ? [n.substring(0, s), n.substring(s + 1)] : [n]; }
                }
                return (<text x={x} y={y} textAnchor="end" fontSize={9} fill="#666" dy={lines.length > 1 ? -4 : 4}>{lines.map((l, i) => (<tspan key={i} x={x} dy={i === 0 ? 0 : 11}>{l}</tspan>))}</text>);
              }} />
          <Tooltip formatter={(v, name) => [v, name]} />
          <Bar dataKey="firm" name="Your Firm" radius={[0, 4, 4, 0]}>
            {comparisonData.map((entry, index) => (
              <Cell key={index} fill={entry.firmFill} />
            ))}
          </Bar>
          <Bar dataKey="benchmark" name="M&A-Ready" fill="#D97706" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-2 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{backgroundColor:'#27AE60'}} /><span className="text-xs text-gray-500">Above Benchmark</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{backgroundColor:'#F39C12'}} /><span className="text-xs text-gray-500">Near Benchmark</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{backgroundColor:'#E74C3C'}} /><span className="text-xs text-gray-500">Below Benchmark</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{backgroundColor:'#D97706'}} /><span className="text-xs text-gray-500">M&A-Ready</span></div>
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
        Or start with blank assessment ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ
      </button>
    </div>
  );
}

// ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ
// VIEWS
// ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ


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


// ─── Onboarding Overlay ─────────────────────────────────────────
function OnboardingOverlay({ onComplete }) {
  const [step, setStep] = useState(0);
  const steps = [
    { title: "Welcome to Growth Drivers", desc: "This tool evaluates your firm\u2019s M&A readiness across 10 key growth themes, each with detailed metrics based on industry best practice.", icon: "\ud83c\udfaf" },
    { title: "10 Growth Themes", desc: "From Financial Performance and People to Market Profile \u2014 each theme groups related metrics that acquirers and investors evaluate during due diligence.", icon: "\ud83d\udcca" },
    { title: "Simple 1\u20133 Scoring", desc: "Rate each metric: Level 1 (Foundational), Level 2 (Evolving), or Level 3 (Optimised). Use fine-tune adjustments for nuance. Add notes to explain your rationale.", icon: "\u2b50" },
    { title: "M&A-Ready Benchmarks", desc: "Your scores are compared against M&A-Ready benchmarks \u2014 top-quartile performance levels that command premium valuations. Synthesised from 20+ industry sources.", icon: "\ud83d\udcc8" },
    { title: "Actionable Insights", desc: "The dashboard shows your readiness score, gap analysis, trends over time, and an exportable executive summary for board presentations.", icon: "\ud83d\udca1" }
  ];
  const s = steps[step];
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in">
        <div className="text-5xl mb-5 text-center">{s.icon}</div>
        <h2 className="text-xl font-bold text-slate-900 mb-3 text-center">{s.title}</h2>
        <p className="text-sm text-gray-600 mb-8 leading-relaxed text-center">{s.desc}</p>
        <div className="flex items-center justify-center gap-1.5 mb-8">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? "w-8 bg-blue-600" : "w-1.5 bg-gray-300"}`} />
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={() => { localStorage.setItem("gdmf_onboarding_complete", "true"); onComplete(); }}
            className="flex-1 px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-medium text-sm transition">
            Skip
          </button>
          <button onClick={() => { if (step < steps.length - 1) setStep(step + 1); else { localStorage.setItem("gdmf_onboarding_complete", "true"); onComplete(); } }}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium text-sm transition shadow-sm">
            {step === steps.length - 1 ? "Get Started" : "Next"}
          </button>
        </div>
        <p className="text-[10px] text-gray-400 text-center mt-4">Step {step + 1} of {steps.length}</p>
      </div>
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
          { icon: BarChart3, title: "2. Benchmark", desc: "Compare performance against M&A-ready PSF benchmarks" },
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

function FirmListView({ firms, onCreateFirm, onSelectFirm, onDeleteFirm, onViewDashboard, assessments }) {
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
                    {firmAssessments.length > 0 && <button onClick={e => { e.stopPropagation(); onViewDashboard(firm.id, firmAssessments[0].id); }} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-blue-600 p-1 transition-all" title="View Dashboard"><LayoutDashboard size={14} /></button>}
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

function FirmDetailView({ firm, assessments, onCreateAssessment, onDeleteAssessment, onSelectAssessment, onViewDashboard, onBack }) {
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
                  <button onClick={(e) => { e.stopPropagation(); onViewDashboard(a.id); }} className="p-1 text-gray-400 hover:text-blue-600 transition-colors" title="View Dashboard"><LayoutDashboard size={16} /></button>
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

function AssessmentView({ assessment, onRate, onComment, onBack, onConfidence, onEvidence }) {
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
              <MetricCard metric={m} rating={assessment.ratings[m.id]} onRate={onRate} onComment={onComment} onConfidence={onConfidence} evidence={assessment.ratings[m.id]?.evidence || []} onEvidence={(ev) => onEvidence(m.id, ev)} />
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


// ─── Readiness Score Banner ─────────────────────────────────────
function ReadinessScoreBanner({ readinessScore, readinessLevel }) {
  const getColor = () => {
    if (readinessLevel === "M&A Ready") return { text: "text-green-700", bg: "bg-green-50", border: "border-green-300", ring: "stroke-green-500" };
    if (readinessLevel === "Nearly Ready") return { text: "text-blue-700", bg: "bg-blue-50", border: "border-blue-300", ring: "stroke-blue-500" };
    if (readinessLevel === "In Progress") return { text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-300", ring: "stroke-amber-500" };
    return { text: "text-orange-700", bg: "bg-orange-50", border: "border-orange-300", ring: "stroke-orange-500" };
  };
  const c = getColor();
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (readinessScore / 100) * circumference;
  return (
    <div className={`${c.bg} ${c.border} border-2 rounded-xl p-8 mb-8`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">M&A Readiness Score</div>
          <div className={`text-5xl font-bold ${c.text} mb-1`}>{readinessScore}%</div>
          <div className={`text-lg font-semibold ${c.text}`}>{readinessLevel}</div>
          <p className="text-xs text-gray-500 mt-2 max-w-xs">Weighted composite of all theme scores measured against M&A-Ready benchmarks.</p>
        </div>
        <div className="hidden sm:block">
          <svg width="130" height="130" className="-rotate-90">
            <circle cx="65" cy="65" r="54" fill="none" stroke="#e2e8f0" strokeWidth="10" />
            <circle cx="65" cy="65" r="54" fill="none" className={c.ring} strokeWidth="10"
              strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1s ease" }} />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─── Gap Analysis Panel ─────────────────────────────────────────
function GapAnalysisPanel({ themeGaps }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center gap-2 mb-1">
        <Target size={18} className="text-amber-600" />
        <h3 className="text-lg font-semibold text-slate-900">Readiness Gap Analysis</h3>
      </div>
      <p className="text-xs text-gray-500 mb-5">Themes ranked by largest gap to M&A-Ready benchmark. Focus improvement efforts on the top gaps.</p>
      <div className="space-y-3">
        {themeGaps.map((g, idx) => (
          <div key={g.themeId} className="group">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-sm font-medium text-gray-800">{g.themeName}</span>
              <span className={`text-xs font-bold ${g.gap > 0 ? "text-red-600" : "text-green-600"}`}>
                {g.gap > 0 ? `−${Math.round(g.gap)}%` : `+${Math.abs(Math.round(g.gap))}%`}
              </span>
            </div>
            <div className="relative h-5 bg-gray-100 rounded-full overflow-hidden">
              <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(Math.max(g.current, 0), 100)}%`, backgroundColor: g.color || "#1B4F72" }} />
              <div className="absolute top-0 bottom-0 w-0.5 bg-amber-500"
                style={{ left: `${Math.min(g.target, 100)}%` }}>
                <div className="absolute -top-5 -translate-x-1/2 text-[9px] font-bold text-amber-600 whitespace-nowrap">{idx === 0 ? `Target ${g.target}%` : ""}</div>
              </div>
            </div>
            <div className="flex justify-between mt-0.5">
              <span className="text-[10px] text-gray-400">Current: {Math.round(g.current)}%</span>
              <span className="text-[10px] text-gray-400">M&A-Ready: {g.target}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Trend Analysis Panel ───────────────────────────────────────
function TrendAnalysisPanel({ firmAssessments }) {
  if (!firmAssessments || firmAssessments.length < 2) {
    return (
      <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-6 mb-8 text-center">
        <TrendUp size={24} className="mx-auto text-slate-400 mb-2" />
        <p className="text-sm text-slate-500 font-medium">Trend analysis requires at least 2 assessments.</p>
        <p className="text-xs text-slate-400 mt-1">Complete another assessment to unlock historical tracking.</p>
      </div>
    );
  }
  const sorted = [...firmAssessments].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const chartData = sorted.map(a => {
    const s = calcScores(a.ratings);
    const point = { name: new Date(a.createdAt).toLocaleDateString("en-GB", { month: "short", year: "2-digit" }), overall: s.pct, readiness: s.readinessScore };
    FRAMEWORK.themes.forEach(t => { const ts = s.themeScores[t.id]; point[t.id] = ts ? ts.pct : 0; });
    return point;
  });
  const latest = chartData[chartData.length - 1];
  const prev = chartData[chartData.length - 2];
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center gap-2 mb-1">
        <TrendUp size={18} className="text-blue-600" />
        <h3 className="text-lg font-semibold text-slate-900">Maturity Trend</h3>
      </div>
      <p className="text-xs text-gray-500 mb-5">Overall maturity progression across {sorted.length} assessments</p>
      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: 8, color: "#fff", fontSize: 12 }} />
            <ReferenceLine y={65} stroke="#D97706" strokeDasharray="6 4" label={{ value: "M&A-Ready", position: "insideTopRight", fill: "#D97706", fontSize: 10 }} />
            <Line type="monotone" dataKey="overall" stroke="#1B4F72" strokeWidth={3} dot={{ fill: "#1B4F72", r: 5 }} activeDot={{ r: 7 }} name="Overall %" />
            <Line type="monotone" dataKey="readiness" stroke="#0d9488" strokeWidth={2} strokeDasharray="5 3" dot={{ fill: "#0d9488", r: 4 }} name="Readiness %" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-5 gap-3">
        {FRAMEWORK.themes.map(t => {
          const cur = Math.round(latest[t.id] || 0);
          const prv = Math.round(prev[t.id] || 0);
          const diff = cur - prv;
          return (
            <div key={t.id} className="text-center">
              <div className="text-[10px] text-gray-500 font-medium truncate">{t.name}</div>
              <div className="text-base font-bold text-slate-800">{cur}%</div>
              <div className={`text-xs font-semibold ${diff > 0 ? "text-green-600" : diff < 0 ? "text-red-500" : "text-gray-400"}`}>
                {diff > 0 ? "\u2191" : diff < 0 ? "\u2193" : "\u2192"}{Math.abs(diff)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ImprovementRoadmap({ assessment, benchmarkProfile }) {
  const bm = BENCHMARK_PROFILES[benchmarkProfile || "M&A-Ready (PSF)"];
  const scores = calcScores(assessment.ratings, bm);
  const [expandedGroup, setExpandedGroup] = useState("critical");

  const items = [];
  FRAMEWORK.themes.forEach(theme => {
    const themeScore = scores.themeScores[theme.id];
    const benchmark = bm[theme.id] || 65;
    theme.metrics.forEach(metric => {
      const r = assessment.ratings ? Object.entries(assessment.ratings).find(([k]) => k === metric.id) : null;
      const val = r ? r[1]?.value : null;
      if (val === null || val === undefined) return;
      const pct = val * 100 / (metric.weight || 100);
      const gap = benchmark - pct;
      if (gap > 0) items.push({ metric, theme: theme.name, pct: Math.round(pct), benchmark, gap: Math.round(gap), action: metric.improvementAction });
    });
  });
  items.sort((a, b) => b.gap - a.gap);

  const critical = items.filter(i => i.gap >= 10);
  const important = items.filter(i => i.gap >= 5 && i.gap < 10);
  const niceToHave = items.filter(i => i.gap >= 1 && i.gap < 5);

  const Group = ({ id, title, bgColor, textColor, borderColor, groupItems }) => (
    <div className="rounded-lg border overflow-hidden" style={{borderColor}}>
      <button onClick={() => setExpandedGroup(expandedGroup === id ? null : id)} className={"w-full px-4 py-3 text-left font-semibold flex items-center justify-between " + bgColor + " " + textColor}>
        <span>{title}</span>
        <span className="flex items-center gap-2">
          <span className="text-xs font-bold bg-white bg-opacity-30 px-2 py-0.5 rounded-full">{groupItems.length}</span>
          {expandedGroup === id ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
        </span>
      </button>
      {expandedGroup === id && groupItems.length > 0 && (
        <div className="p-3 space-y-3 bg-gray-50">
          {groupItems.map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <div><p className="font-medium">{item.metric.name}</p><p className="text-xs text-gray-500">{item.theme}</p></div>
                <span className="text-lg font-bold" style={{color: borderColor}}>{item.pct}%</span>
              </div>
              <div className="mb-2"><div className="flex justify-between text-xs text-gray-500 mb-1"><span>Current</span><span>Target: {item.benchmark}%</span></div>
                <div className="w-full bg-gray-200 rounded-full h-2"><div className="h-2 rounded-full bg-blue-500" style={{width: Math.min(100, item.pct / item.benchmark * 100) + "%"}}/></div></div>
              <p className="text-sm text-gray-600 mb-2">Gap: <strong>{item.gap}%</strong></p>
              {item.action && <p className="text-sm bg-blue-50 p-3 rounded text-gray-800">{item.action}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Target size={20} className="text-blue-600"/> Improvement Roadmap</h3>
      {items.length === 0 ? <p className="text-green-700 bg-green-50 p-4 rounded-lg text-center font-medium">All metrics meet or exceed benchmarks!</p> : (
        <div className="space-y-3">
          {critical.length > 0 && <Group id="critical" title="Critical Priority" bgColor="bg-red-50" textColor="text-red-800" borderColor="#DC2626" groupItems={critical}/>}
          {important.length > 0 && <Group id="important" title="Important" bgColor="bg-amber-50" textColor="text-amber-800" borderColor="#D97706" groupItems={important}/>}
          {niceToHave.length > 0 && <Group id="nice" title="Nice-to-Have" bgColor="bg-blue-50" textColor="text-blue-800" borderColor="#2563EB" groupItems={niceToHave}/>}
        </div>
      )}
    </div>
  );
}

function ScenarioPanel({ assessment, benchmarkProfile }) {
  const currentScores = calcScores(assessment.ratings, BENCHMARK_PROFILES[benchmarkProfile || "M&A-Ready (PSF)"]);
  const [sliders, setSliders] = useState(() => Object.fromEntries(Object.entries(currentScores.themeScores).map(([id, ts]) => [id, ts.pct])));

    const benchValues = BENCHMARK_PROFILES[benchmarkProfile];
    const totalW = FRAMEWORK.themes.reduce((s, t) => s + t.totalWeight, 0);
    const projectedReadiness = totalW > 0 ? Math.round(FRAMEWORK.themes.reduce((s, theme) => s + theme.totalWeight * Math.min((sliders[theme.id] || 0) / (benchValues[theme.id] || 65), 1.0) * 100, 0) / totalW) : 0;
  const delta = projectedReadiness - currentScores.readinessScore;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><TrendingUp size={20} className="text-blue-600"/> Scenario Modelling</h3>
      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg mb-4">
        <div><p className="text-sm text-gray-600">Current Readiness</p><p className="text-2xl font-bold text-blue-700">{currentScores.readinessScore}%</p></div>
        <div className="text-center"><p className="text-sm text-gray-600">Change</p><p className={"text-xl font-bold " + (delta >= 0 ? "text-green-600" : "text-red-600")}>{delta >= 0 ? "+" : ""}{delta}%</p></div>
        <div className="text-right"><p className="text-sm text-gray-600">Projected Readiness</p><p className="text-2xl font-bold text-blue-700">{projectedReadiness}%</p></div>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {FRAMEWORK.themes.map(theme => {
          const current = currentScores.themeScores[theme.id]?.pct || 0;
          return (
            <div key={theme.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">{theme.name}</span>
                <span className="text-sm font-bold" style={{color: sliders[theme.id] !== current ? "#2563EB" : "#6B7280"}}>{sliders[theme.id]}%</span>
              </div>
              <input type="range" min="0" max="100" value={sliders[theme.id]} onChange={e => setSliders(p => ({...p, [theme.id]: parseInt(e.target.value)}))} className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"/>
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>0</span><span>Current: {current}%</span><span>100</span></div>
            </div>
          );
        })}
      </div>
      <button onClick={() => setSliders(Object.fromEntries(Object.entries(currentScores.themeScores).map(([id, ts]) => [id, ts.pct])))} className="mt-4 w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Reset to Current</button>
    </div>
  );
}

function InsightsView({ firmId, firmName, assessments, benchmarkProfile, onBack }) {
  const [tab, setTab] = useState("benchmark");
  const firmAssess = Object.values(assessments).filter(a => a.firmId === firmId).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const assessData = firmAssess.map(a => ({
    id: a.id,
    date: new Date(a.createdAt).toLocaleDateString("en-GB", {day:"numeric",month:"short",year:"numeric"}),
    scores: calcScores(a.ratings, BENCHMARK_PROFILES[benchmarkProfile]),
    ratings: a.ratings
  }));
  const latest = assessData[assessData.length - 1];
  const profileNames = Object.keys(BENCHMARK_PROFILES);
  const benchCards = latest ? profileNames.map(name => {
    const s = calcScores(latest.ratings, BENCHMARK_PROFILES[name]);
    return { name, readiness: s.readinessScore, level: s.readinessLevel, pct: s.pct };
  }) : [];
  const actTab = "px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white shadow-sm";
  const offTab = "px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-bold text-gray-900">{firmName} — Insights</h2>
        <button onClick={onBack} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 font-medium">Back to Dashboard</button>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setTab("benchmark")} className={tab === "benchmark" ? actTab : offTab}>Benchmark Position</button>
        <button onClick={() => setTab("comparison")} className={tab === "comparison" ? actTab : offTab}>Assessment Comparison</button>
      </div>

      {tab === "benchmark" && latest && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-lg mb-2">Readiness Across Benchmark Profiles</h3>
            <p className="text-sm text-gray-500 mb-5">How your firm measures against different industry standards. The highlighted card shows your currently selected benchmark.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {benchCards.map(bc => (
                <div key={bc.name} className={`text-center p-4 rounded-xl border-2 transition-all ${bc.name === benchmarkProfile ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-200 hover:border-gray-300"}`}>
                  <div className="text-xs text-gray-500 mb-1 font-medium truncate" title={bc.name}>{bc.name}</div>
                  <div className="text-3xl font-bold" style={{color: bc.readiness >= 80 ? "#059669" : bc.readiness >= 60 ? "#D97706" : "#DC2626"}}>{bc.readiness}%</div>
                  <div className={`text-xs mt-1.5 px-2 py-0.5 rounded-full inline-block font-medium ${bc.readiness >= 80 ? "bg-green-100 text-green-700" : bc.readiness >= 60 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{bc.level}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-lg mb-4">Theme-Level Benchmark Gaps</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2.5 px-3 font-semibold text-gray-700">Theme</th>
                    <th className="text-center py-2.5 px-3 font-semibold text-blue-700">Score</th>
                    {profileNames.map(n => <th key={n} className="text-center py-2.5 px-2 font-medium text-gray-500 text-xs whitespace-nowrap">{n.length > 14 ? n.substring(0,12) + ".." : n}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {FRAMEWORK.themes.map((theme, idx) => {
                    const myScore = latest.scores.themeScores[theme.id]?.pct || 0;
                    return (
                      <tr key={theme.id} className={`border-b ${idx % 2 === 0 ? "bg-gray-50" : ""}`}>
                        <td className="py-2 px-3 font-medium text-gray-800">{theme.name}</td>
                        <td className="text-center py-2 px-3 font-bold text-blue-700">{myScore}%</td>
                        {profileNames.map(n => {
                          const bench = BENCHMARK_PROFILES[n][theme.id] || 65;
                          const gap = myScore - bench;
                          return <td key={n} className="text-center py-2 px-2"><span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${gap >= 0 ? "text-green-700 bg-green-50" : gap >= -5 ? "text-yellow-700 bg-yellow-50" : "text-red-700 bg-red-50"}`}>{gap >= 0 ? "+" : ""}{gap}</span></td>;
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-3">Gap = your score minus the benchmark target. <span className="text-green-600 font-medium">Green</span> = meets/exceeds, <span className="text-yellow-600 font-medium">Amber</span> = within 5%, <span className="text-red-600 font-medium">Red</span> = below benchmark.</p>
          </div>
        </div>
      )}

      {tab === "comparison" && (
        <div className="space-y-6">
          {firmAssess.length < 2 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4"><BarChart3 className="text-blue-500" size={28} /></div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">One Assessment Available</h3>
              <p className="text-gray-500 mb-4 max-w-md mx-auto">Create additional assessments to compare results across different assessors or track progress over time.</p>
              <div className="flex gap-6 justify-center text-sm text-gray-400">
                <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-400"/> Multiple assessors</div>
                <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-400"/> Year-on-year tracking</div>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-lg mb-4">Theme Scores Across Assessments</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={FRAMEWORK.themes.map(theme => { const entry = { theme: theme.name }; assessData.forEach(ad => { entry[ad.date] = ad.scores.themeScores[theme.id]?.pct || 0; }); return entry; })}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="theme" angle={-45} textAnchor="end" height={100} tick={{fontSize:11}}/>
                    <YAxis domain={[0,100]}/>
                    <Tooltip/>
                    <Legend/>
                    {assessData.map((ad, i) => <Bar key={ad.id} dataKey={ad.date} fill={["#1B4F72","#E67E22","#27AE60","#8E44AD"][i % 4]} />)}
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-lg mb-4">Readiness Progression</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {assessData.map((ad, i) => (
                    <div key={ad.id} className="text-center p-4 rounded-xl border-2 border-gray-200">
                      <div className="text-xs text-gray-500 mb-1 font-medium">{ad.date}</div>
                      <div className="text-3xl font-bold" style={{color: ad.scores.readinessScore >= 80 ? "#059669" : ad.scores.readinessScore >= 60 ? "#D97706" : "#DC2626"}}>{ad.scores.readinessScore}%</div>
                      <div className="text-xs text-gray-400 mt-1">Overall: {ad.scores.pct}%</div>
                      {i > 0 && (() => { const ch = ad.scores.readinessScore - assessData[i-1].scores.readinessScore; return <div className={`text-xs mt-1 font-medium ${ch >= 0 ? "text-green-600" : "text-red-600"}`}>{ch >= 0 ? "↑" : "↓"} {Math.abs(ch)}% from previous</div>; })()}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}


function ScoreChangePanel({ currentAssessment, previousAssessment }) {
  if (!previousAssessment) return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Score Change History</h3>
      <p className="text-gray-500 text-sm">Requires 2+ assessments to show changes. Complete another assessment to unlock historical tracking.</p>
    </div>
  );
  const prevRatings = previousAssessment.ratings || {};
  const currRatings = currentAssessment.ratings || {};
  const changes = [];
  FRAMEWORK.themes.forEach(theme => {
    theme.metrics.forEach(metric => {
      const prev = prevRatings[metric.id]?.value || 0;
      const curr = currRatings[metric.id]?.value || 0;
      if (prev > 0 || curr > 0) changes.push({ theme: theme.name, themeColor: theme.color, metric: metric.name, prev, curr, delta: curr - prev });
    });
  });
  const improved = changes.filter(c => c.delta > 0).length;
  const declined = changes.filter(c => c.delta < 0).length;
  const unchanged = changes.filter(c => c.delta === 0).length;
  const sorted = [...changes].sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Score Change History</h3>
      <div className="flex gap-4 mb-4 text-sm">
        <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full font-medium">{improved} improved</span>
        <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full font-medium">{declined} declined</span>
        <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full font-medium">{unchanged} unchanged</span>
      </div>
      <div className="max-h-64 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-white"><tr className="border-b border-gray-200">
            <th className="text-left py-2 text-gray-500 font-medium">Metric</th>
            <th className="text-center py-2 text-gray-500 font-medium w-20">Previous</th>
            <th className="text-center py-2 text-gray-500 font-medium w-20">Current</th>
            <th className="text-center py-2 text-gray-500 font-medium w-20">Change</th>
          </tr></thead>
          <tbody>
            {sorted.map((c, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-2"><span className="inline-block w-2 h-2 rounded-full mr-2" style={{backgroundColor: c.themeColor}} />{c.metric}</td>
                <td className="text-center py-2 text-gray-500">{c.prev > 0 ? c.prev.toFixed(1) : "-"}</td>
                <td className="text-center py-2 font-medium">{c.curr > 0 ? c.curr.toFixed(1) : "-"}</td>
                <td className="text-center py-2">{c.delta !== 0 ? (<span className={c.delta > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>{c.delta > 0 ? "+" : ""}{c.delta.toFixed(1)}</span>) : <span className="text-gray-400">-</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DashboardView({ assessment, firmName, firmSector, onBack, firmAssessments, benchmarkProfile, onBenchmarkChange, onCompare }) {
  const scores = calcScores(assessment.ratings, BENCHMARK_PROFILES[benchmarkProfile || "M&A-Ready (PSF)"]);
  const radarData = FRAMEWORK.themes.map(t => ({
    theme: t.name,
    fullName: t.name,
    score: scores.themeScores[t.id]?.pct || 0,
    fullMark: 100,
  }));
  const barData = FRAMEWORK.themes.map(t => ({
    name: t.name,
    score: scores.themeScores[t.id]?.score || 0,
    max: scores.themeScores[t.id]?.max || 0,
    pct: scores.themeScores[t.id]?.pct || 0,
    color: t.color,
  }));
  const activeBenchmark = BENCHMARK_PROFILES[benchmarkProfile || "M&A-Ready (PSF)"];
  const sortedAssessments = firmAssessments ? [...firmAssessments].sort((a, b) => new Date(b.date) - new Date(a.date)) : [];
  const currentIndex = sortedAssessments.findIndex(a => a.id === assessment.id);
  const previousAssessment = currentIndex >= 0 && currentIndex < sortedAssessments.length - 1 ? sortedAssessments[currentIndex + 1] : null;

  return (
    <div className="overflow-y-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{firmName} - Maturity Dashboard</h1>
          <p className="text-sm text-gray-500">Assessment from {new Date(assessment.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}{firmSector ? ` \u00B7 ${firmSector}` : ""}</p>
        </div>
      {/* Benchmark Profile Selector */}
      <div className="flex items-center gap-3 mb-4 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
        <label className="text-sm font-medium text-gray-600 whitespace-nowrap">Benchmark Profile:</label>
        <select value={benchmarkProfile || "M&A-Ready (PSF)"} onChange={e => onBenchmarkChange(e.target.value)} className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          {Object.keys(BENCHMARK_PROFILES).map(k => <option key={k} value={k}>{k}{SECTOR_BENCHMARK_MAP[firmSector] === k ? " (auto-detected)" : ""}</option>)}
        </select>
      </div>
      <button onClick={onCompare} className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100">Insights</button>
      </div>
      <ScoreGauge score={scores.totalScore} max={scores.totalMaxPossible} label="Overall Maturity" />

      {/* M&A Readiness Score Banner */}
      <ReadinessScoreBanner readinessScore={scores.readinessScore} readinessLevel={scores.readinessLevel} />

      {/* Gap Analysis */}
      <GapAnalysisPanel themeGaps={scores.themeGaps} />

      {/* Trend Analysis */}
      <TrendAnalysisPanel firmAssessments={firmAssessments} />
      {/* Score Change History */}
      <ScoreChangePanel currentAssessment={assessment} previousAssessment={previousAssessment} />
      <ImprovementRoadmap assessment={assessment} benchmarkProfile={benchmarkProfile}/>
      <ScenarioPanel assessment={assessment} benchmarkProfile={benchmarkProfile}/>
      {/* Theme Score Summary Strip */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {FRAMEWORK.themes.map(t => {
          const ts = scores.themeScores[t.id];
          const pct = ts?.pct || 0;
          return (
            <div key={t.id} className="bg-white rounded-lg border border-gray-200 p-2 text-center">
              <div className="text-xs font-medium text-gray-500 truncate">{t.name}</div>
              <div className="text-lg font-bold mt-0.5" style={{ color: pct >= 80 ? "#16A34A" : pct >= 50 ? "#D97706" : "#DC2626" }}>{Math.round(pct)}%</div>
            </div>
          );
        })}
      </div>
      {/* Charts */}
      <div className="grid grid-cols-2 gap-6 mb-4">
        <RadarOverview radarData={radarData} benchmarkProfile={benchmarkProfile} />
        <BenchmarkComparison scores={scores} benchmarkProfile={benchmarkProfile} />
      </div>
      <div className="mb-4"><StrengthsWeaknesses ratings={assessment.ratings} /></div>
      <div className="mb-4"><HeatmapGrid ratings={assessment.ratings} /></div>
      <ExportPanel assessment={assessment} firmName={firmName} firmSector={firmSector} scores={scores} benchmarkProfile={benchmarkProfile} />
    </div>
  );
}

// ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ
// MAIN APP
// ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ
export default function App() {
  const [state, setState] = useState(() => {
    return getInitialState();
  });
  const [view, setView] = useState("landing");
  const [selectedFirmId, setSelectedFirmId] = useState(null);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);
  const [dashboardAssessmentId, setDashboardAssessmentId] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem("gdmf_onboarding_complete"));

  const [benchmarkProfile, setBenchmarkProfile] = useState(() => { const firm = state.firms?.find(f => f.id === selectedFirmId); return SECTOR_BENCHMARK_MAP[firm?.sector] || "M&A-Ready (PSF)"; });
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
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, disabled: !selectedAssessmentId && !dashboardAssessmentId },
  ];


  // Handle confidence rating changes
  const handleConfidence = (metricId, level) => {
    setState(prev => {
      const newState = JSON.parse(JSON.stringify(prev));
      const firm = newState.firms.find(f => f.id === selectedFirmId);
      if (firm) {
        const assess = newState.assessments[selectedAssessmentId];
        if (assess && assess.ratings[metricId]) {
          assess.ratings[metricId].confidence = level;
        }
      }
      return newState;
    });
  };

  // Get current firm assessments for trend analysis
  const currentFirmAssessments = useMemo(() => {
    const firm = state.firms.find(f => f.id === selectedFirmId);
    return firm ? Object.values(state.assessments).filter(a => a.firmId === firm.id) : [];
  }, [state.firms, selectedFirmId]);


  const handleEvidence = (metricId, newEvidence) => {
    setState(prev => {
      const firms = prev.firms.map(f => {
        if (f.id !== selectedFirmId) return f;
        return { ...f, assessments: f.assessments.map(a => {
          if (a.id !== selectedAssessmentId) return a;
          return { ...a, ratings: { ...a.ratings, [metricId]: { ...(a.ratings[metricId] || {}), evidence: newEvidence } } };
        })};
      });
      return { ...prev, firms };
    });
  };
  return (
    <div className="h-screen flex flex-col bg-gray-50" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {showOnboarding && <OnboardingOverlay onComplete={() => setShowOnboarding(false)} />}
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
              if (n.id === "dashboard") { if (selectedAssessmentId) setDashboardAssessmentId(selectedAssessmentId); }
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
          <FirmListView firms={state.firms} onCreateFirm={createFirm} onSelectFirm={id => { setSelectedFirmId(id); setView("firmDetail"); }} onDeleteFirm={deleteFirm} assessments={state.assessments} onViewDashboard={(firmId, assessmentId) => { setSelectedFirmId(firmId); setSelectedAssessmentId(assessmentId); setDashboardAssessmentId(assessmentId); setView("dashboard"); }} />
        )}
        {view === "firmDetail" && selectedFirm && (
          <FirmDetailView firm={selectedFirm} assessments={state.assessments} onCreateAssessment={createAssessment} onSelectAssessment={id => { setSelectedAssessmentId(id); setView("assess"); }} onBack={() => { setSelectedFirmId(null); setView("firms"); }}  onDeleteAssessment={deleteAssessment} onViewDashboard={id => { setSelectedAssessmentId(id); setDashboardAssessmentId(id); setView("dashboard"); }} />
        )}
        {view === "assess" && selectedAssessment && (
          <AssessmentView assessment={selectedAssessment} onRate={rateMetric} onComment={commentMetric} onBack={() => { setView("firmDetail"); }}  onConfidence={handleConfidence} onEvidence={handleEvidence} />
        )}
        {view === "dashboard" && (dashboardAssessment || selectedAssessment) && (
          <DashboardView
            assessment={dashboardAssessment || selectedAssessment}
            firmName={dashboardFirm?.name || "Firm"}
            firmSector={dashboardFirm?.sector}
            onBack={() => setView("assess")}
          firmAssessments={currentFirmAssessments}
              benchmarkProfile={benchmarkProfile}
              onBenchmarkChange={setBenchmarkProfile}
            onCompare={() => setView("comparison")}
            />
            )}
        {view === "comparison" && (
            <InsightsView
              firmId={dashboardFirm?.id}
              firmName={dashboardFirm?.name || "Firm"}
              assessments={state.assessments}
              benchmarkProfile={benchmarkProfile}
              onBack={() => setView("dashboard")}
            />
        )}
      </main>
    </div>
  );
}
