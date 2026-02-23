import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell , LineChart, Line, CartesianGrid, Legend, ReferenceLine } from "recharts";
import { Building2, Lock, ChevronDown, ChevronUp, ClipboardCheck, LayoutDashboard, Plus, ChevronRight, CheckCircle2, Circle, AlertCircle, Home, TrendingUp, Target, Award, MessageSquare, ArrowLeft, ArrowRight, Trash2, Download, FileText, BarChart3, Copy, X , Info, HelpCircle, TrendingUp as TrendUp , PoundSterling, Users, Tag, Compass, Handshake, Shield, Calculator, CheckSquare, Globe, BookOpen, AlertTriangle, Upload, Menu , Mail, ExternalLink, LogOut, User as UserIcon, Settings, Eye, EyeOff } from "lucide-react";
import { useAuth } from "./AuthContext";
import { GATED_TABS, TIER_LIMITS, PREMIUM_FEATURES } from "./gating";
import { UpgradePrompt, LimitModal, UpgradeBanner } from "./UpgradePrompt";
import { ContactModalProvider, useContactModal } from "./ContactModal";
import { supabase } from './supabase';
import { useSupabaseData } from './useSupabaseData';
// ─── Plausible Analytics Helper ─────────────────
const track = (name, props) => { try { window.plausible?.(name, props ? { props } : undefined); } catch(e) {} };
// -----------------------------------------------------------------------
// FRAMEWORK DATA - All 57 metrics from the Growth Drivers spreadsheet
// -----------------------------------------------------------------------
export const FRAMEWORK = {
  themes: [
      {
      id: "financial", name: "Financial Performance", icon: "pound", totalWeight: 750, color: "#1B4F72",
      metrics: [
        { id: "fin_revenue", name: "Revenue Growth & Profitability", question: "How consistently are you achieving year-over-year revenue growth and profitability?", weight: 100, foundational: "Revenue growth <5% per year, low or inconsistent profitability, reliance on a few large projects", evolving: "Revenue growth 5-10% per year, moderate profitability, some diversification of revenue streams", optimised: "Revenue growth >10% per year, strong profitability with predictable, diversified revenue streams and high-margin services", guidance: "Look for consistent YoY revenue growth of 10%+. Acquirers value predictable, compounding growth over one-off spikes. Consider organic vs acquisition-driven growth." , improvementAction: "Focus on recurring revenue models and multi-year contracts to demonstrate predictable growth trajectory" },
        { id: "fin_gm", name: "Gross Margin", question: "What is your current gross margin?", weight: 100, foundational: "Gross margin <40%, cost overruns are frequent, and pricing is reactive rather than strategic", evolving: "Gross margin 40-50%, some cost control measures in place, but efficiency improvements still needed", optimised: "Gross margin >50%, strong cost control, pricing strategy optimised for profitability and scalability", guidance: "Healthy PSFs target gross margins of 50-70%. Margins below 40% signal pricing pressure or delivery inefficiency. Track trends over 3+ years for stability." , improvementAction: "Review pricing strategy, reduce delivery cost leakage, and shift toward higher-margin service lines" },
        { id: "fin_ebitda", name: "EBITDA %", question: "What is your EBITDA margin?", weight: 100, foundational: "EBITDA margin <10%, low cash generation, high cost-to-revenue ratio", evolving: "EBITDA margin 10-20%, improving operational efficiency, but some volatility in profitability", optimised: "EBITDA margin >20%, strong financial discipline, consistent year-over-year growth", guidance: "EBITDA margins of 15-25% are typical for well-run PSFs. Margins above 20% indicate strong operational efficiency and pricing power attractive to acquirers." , improvementAction: "Audit overhead costs, improve utilization rates, and benchmark partner compensation against EBITDA targets" },
        { id: "fin_cash", name: "Cash Flow", question: "How consistent and positive is your free cash flow?", weight: 100, foundational: "Free cash flow is negative or low, debtor days >60, frequent working capital constraints", evolving: "Free cash flow is positive but inconsistent, debtor days 45-60, some cash reserves maintained", optimised: "Free cash flow is consistently strong, debtor days <45, 80%+ cash flow conversion from EBITDA", guidance: "Consistent positive free cash flow demonstrates business sustainability. Look for low debtor days (<45), predictable billing cycles, and minimal capital expenditure requirements." , improvementAction: "Implement stricter billing cycles, reduce debtor days below 45, and build 3-month cash reserves" },
        { id: "fin_quality", name: "Quality of Revenue", question: "How high-quality and recurring is your revenue base?", weight: 100, foundational: "Recurring/repeat revenue <10%, heavy reliance on new business development, volatile income streams", evolving: "Recurring/repeat revenue 10-30%, some multi-year contracts, but still significant project-based work", optimised: "Recurring/repeat revenue >30%, long-term client contracts, high revenue predictability", guidance: "High-quality revenue is recurring, predictable, and diversified. Retainer-based and subscription models score highest. Project-based revenue with strong repeat rates also scores well." , improvementAction: "Diversify revenue across clients (no single client >15%), grow recurring contracts to 40%+ of revenue" },
        { id: "fin_rate", name: "Blended Rate Card", question: "What is your average blended rate card across all service lines, and how does it compare to market benchmarks?", weight: 100, foundational: "Average daily rate <\u00A31,000, frequent discounting, weak commercial discipline", evolving: "Average daily rate \u00A31,000-\u00A31,500, some rate consistency, but discounting still occurs", optimised: "Average daily rate >\u00A31,500, strong commercial discipline, pricing reflects market leadership and value", guidance: "Blended rate trends indicate pricing power. Rising rates with maintained utilisation signals market strength. Compare against sector benchmarks for your discipline." , improvementAction: "Implement value-based pricing, reduce discounting, and benchmark rates against market by grade level" },
        { id: "fin_overhead", name: "Overhead Ratio", question: "What are your total overheads (non-delivery costs) as a percentage of revenue?", weight: 75, foundational: "Overheads exceed 35% of revenue, indicating poor cost control, bloated administration, or inefficient operations", evolving: "Overheads 25–35% of revenue, reasonable efficiency but opportunity for optimisation through technology or process improvement", optimised: "Overheads below 25% of revenue, lean operations with integrated technology driving efficiency and strong cost discipline", guidance: "Overhead ratio directly impacts EBITDA. The industry average is approximately 30%, but M&A-ready firms target below 25%. Track overhead trends quarterly and benchmark against peers. Overhead costs typically include:\n\u2022 Sales \u2014 costs of winning work: sales team salaries/commission, bid management, proposals, non-billable account management time, and sales tools (CRM, sales enablement).\n\u2022 Marketing \u2014 spend to generate awareness and demand: brand, content, events, paid media, website, PR, marketing staff, and marketing platforms.\n\u2022 General & Administrative (G&A) \u2014 central running costs: Finance, HR, Legal, Compliance, office/admin, non-billable leadership time, and general professional fees.\n\u2022 Recruiting / Talent Acquisition \u2014 costs to hire: internal recruiters, agency fees, job ads, background checks, referral bonuses, and non-client onboarding.\n\u2022 Learning & Development \u2014 capability investment: training courses, certifications, coaching, leadership programmes, and learning platforms (where not billed to clients).\n\u2022 Professional Services IT / Enablement \u2014 internal tech: IT staff, hardware, software licences, security, data tooling, and systems like PSA/ERP/HRIS that support delivery but are not billed.\n\u2022 Non-billable Travel & Expenses (T&E) \u2014 travel not recharged to clients: internal meetings, sales travel, recruiting travel, and leadership offsites." , improvementAction: "Audit all overhead categories, consolidate technology spend, automate administrative processes, and benchmark against industry data" },
        { id: "fin_revfte", name: "Revenue per FTE", question: "What is your average annual revenue per full-time equivalent employee?", weight: 75, foundational: "Revenue per FTE below £80k, indicating low utilisation, weak pricing, or overstaffing relative to revenue", evolving: "Revenue per FTE £80k–£130k, moderate productivity with room for improvement in utilisation or pricing", optimised: "Revenue per FTE above £130k, demonstrating strong pricing power, high utilisation, and efficient delivery leverage", guidance: "Revenue per FTE is a core M&A efficiency metric. Top-quartile PSFs achieve £130–180k per head. Track trends over 3+ years — consistent improvement signals operational maturity. Acquirers use this to benchmark against comparable firms and identify post-acquisition efficiency opportunities." , improvementAction: "Improve utilisation rates, review pricing strategy, reduce non-billable headcount ratio, and benchmark against sector peers" },
      ]
    },
    {
      id: "people", name: "People", icon: "users", totalWeight: 525, color: "#6C3483",
      metrics: [
        { id: "ppl_talent", name: "Talent & Competence Management", question: "How comprehensive and structured is your talent and competency management framework?", weight: 100, foundational: "One or none of: detailed competency framework; consistent training and mentoring structure; annual appraisal system; clear role definitions", evolving: "2-3 of these: detailed competency framework; consistent training and mentoring structure; annual appraisal system; clear role definitions", optimised: "All of these: detailed competency framework; consistent training and mentoring structure; annual appraisal system; clear role definitions", guidance: "Comprehensive talent management includes structured career paths, regular development reviews, skills gap analysis, and leadership succession planning." , improvementAction: "Establish structured career pathways, implement 360-degree reviews, and create leadership development programs" },
        { id: "ppl_exp", name: "Employee Experience", question: "What are your employee engagement scores (internal NPS and/or Glassdoor rating)?", weight: 100, foundational: "Internal NPS below 40 (or not measured) and Glassdoor rating below 3.5", evolving: "Internal NPS rating below 40 (or not measured) OR Glassdoor rating below 4", optimised: "Internal NPS rating 40+ AND Glassdoor rating above 4", guidance: "Employee satisfaction scores above 70% indicate a healthy culture. Track eNPS, exit interview themes, Glassdoor ratings, and participation in engagement surveys." , improvementAction: "Run quarterly eNPS surveys, act on feedback loops, and benchmark benefits against market leaders" },
        { id: "ppl_recruit", name: "Recruitment", question: "How effectively structured and targeted is your recruitment process?", weight: 100, foundational: "Low (0-3) qualified applicants per job. Vague or unarticulated Employee Value Proposition", evolving: "Defined EVP with structured recruitment process, but inconsistent employer branding and limited pipeline metrics", optimised: "High (7+) qualified applicants per job. Clear Employee Value Proposition", guidance: "Effective recruitment means <60 day time-to-hire, structured interview processes, diverse pipelines, and strong employer branding. Low offer-rejection rates signal market positioning." , improvementAction: "Build employer brand, reduce time-to-hire below 30 days, and establish graduate/intern pipelines" },
        { id: "ppl_churn", name: "Churn & Attrition", question: "What is your annual attrition rate, and how effective are your retention strategies?", weight: 100, foundational: "Attrition >25% annually", evolving: "Attrition between 15-25%", optimised: "Attrition <15%, strong retention strategies", guidance: "Annual attrition below 15% is healthy for PSFs. Distinguish between voluntary and involuntary turnover. High performer retention is the critical metric for acquirers." , improvementAction: "Implement stay interviews, address top 3 attrition drivers, and target voluntary attrition below 12%" },
        { id: "ppl_wf", name: "Workforce Composition", question: "How reliant are you on delivery teams composed of contractors versus permanent employees?", weight: 25, foundational: ">50% of delivery team are contractors, low organisational knowledge retention", evolving: "30-50% of delivery team are contractors, some investment in permanent teams", optimised: "<30% of delivery team are contractors, strong internal capability and knowledge retention", guidance: "Balanced workforce composition means no over-reliance on contractors or key individuals. Aim for a healthy mix of junior/mid/senior with clear development pathways." , improvementAction: "Reduce key-person dependency, cross-train teams, and build bench strength in critical delivery areas" },
        { id: "ppl_equity", name: "Equity & Ownership Breadth", question: "How broadly is equity or ownership distributed among key staff beyond the founders?", weight: 50, foundational: "Equity held entirely by founder(s), or fewer than 5% of staff have any ownership stake; high key-person concentration risk", evolving: "Equity shared with 5–15% of staff (typically senior managers only); founder(s) retain more than 70% of equity", optimised: "Equity distributed among 15%+ of staff across multiple levels; no single individual holds more than 50% of equity; aligned retention incentives", guidance: "Broad equity distribution is a critical M&A signal. Founder-only ownership triggers 20–40% valuation discounts due to key-person risk. Acquirers prefer distributed ownership that aligns incentives and supports retention through deal transitions. Target: 15–25% of key staff with equity stakes, with no single holder above 50%." , improvementAction: "Implement equity participation scheme for key staff, reduce founder concentration below 50%, and align ownership with retention and performance goals" },
        { id: "ppl_training", name: "Training & Development Investment", question: "What percentage of revenue do you invest in structured training and professional development?", weight: 50, foundational: "Training investment below 1% of revenue (or fewer than 3 days per employee per year), ad-hoc and reactive approach to development", evolving: "Training investment 1–2.5% of revenue (4–5 days per employee per year), documented L&D strategy with a mix of formal and informal learning", optimised: "Training investment above 2.5% of revenue (6+ days per employee per year), comprehensive integrated programme linked to competency framework and business outcomes", guidance: "Training investment is a leading indicator of talent retention and capability growth. Top-quartile PSFs invest 2.5–5% of revenue in L&D. Track training days per employee, budget allocation, and correlation with retention rates. Acquirers view underinvestment as a risk signal for post-deal talent flight." , improvementAction: "Establish minimum training budget of 2.5% of revenue, implement structured learning pathways, and track L&D ROI through retention and performance metrics" },
      ]
    },
    {
      id: "services", name: "Services & Pricing", icon: "tag", totalWeight: 350, color: "#1A5276",
      metrics: [
        { id: "srv_prop", name: "Market Proposition", question: "How clearly is your market proposition defined and differentiated from competitors?", weight: 100, foundational: "Vague market positioning, low differentiation from competitors, low focus on specific client pain points", evolving: "Some differentiation but client pain points or benefits are vague", optimised: "Clearly defined, differentiated value proposition(s) focus on clear client needs and benefits", guidance: "A clear, differentiated value proposition articulates why clients choose you over alternatives. It should be specific, measurable, and consistently communicated across the firm." , improvementAction: "Define clear service tiers, retire underperforming offerings, and align portfolio to market demand" },
        { id: "srv_innov", name: "Service Innovation", question: "What percentage of your revenue is put towards service development / creation?", weight: 25, foundational: "No structured investment (<2% of revenue)", evolving: "3-5% of revenue reinvested in service development", optimised: ">5% of revenue reinvested in service innovation", guidance: "Active innovation includes regular service line reviews, R&D investment (2-5% of revenue), client co-creation, and a pipeline of new offerings in development." , improvementAction: "Allocate 5-10% of revenue to R&D, run quarterly innovation sprints, and track new service launch metrics" },
        { id: "srv_ip", name: "Service IP", question: "To what extent is your delivery supported by proprietary or IP-based content?", weight: 100, foundational: "<10% of delivery supported by proprietary IP", evolving: "10%-30% of delivery incorporates proprietary IP", optimised: ">30% of delivery is productised or IP-based", guidance: "Proprietary IP includes frameworks, tools, methodologies, and data assets. Documented, protected IP significantly increases firm valuation in M&A transactions." , improvementAction: "Codify delivery methodologies, create reusable frameworks, and protect intellectual property formally" },
        { id: "srv_size", name: "Project Size", question: "What is your average project size?", weight: 50, foundational: "Average contract size less than \u00A350k", evolving: "Average project size \u00A350k-\u00A3250k", optimised: "Average project size \u00A3250k+", guidance: "Optimal deal sizes balance profitability with risk. Growing average project size indicates market trust and capability maturity. Track trends over 12-24 months." , improvementAction: "Standardise delivery processes, invest in tooling/automation, and design services for delegation" },
        { id: "srv_price", name: "Pricing Strategy", question: "What percentage of your work is charged as value-based pricing or fixed price?", weight: 25, foundational: "Less than 10% of engagements use value or outcome-based pricing; most work is billed on a time-and-materials basis", evolving: "10–30% of engagements incorporate value or outcome-based pricing, with a defined strategy to increase this over time", optimised: "Over 30% of revenue comes from value or outcome-based pricing models, with clear methodologies for scoping and pricing", guidance: "Value-based pricing, clear rate cards, and minimal discounting indicate pricing maturity. Firms that can articulate and defend their pricing command premium valuations." , improvementAction: "Implement tiered pricing models, shift from time-based to value-based pricing where possible" },
        { id: "srv_portfolio", name: "Service Portfolio Architecture", question: "How structured is your service portfolio with clear entry-level, core, and strategic service tiers?", weight: 50, foundational: "No structured service tiers; largest service line accounts for over 60% of revenue; limited client upsell pathway", evolving: "Some service tiering in place; largest service line accounts for 40–60% of revenue; emerging upsell pathways between service lines", optimised: "Well-defined service tiers (entry, core, strategic) with documented client journey; largest service line below 40% of revenue; 3+ material service lines contributing to growth", guidance: "Service portfolio architecture measures how intentionally your services are structured to create client progression from initial engagement to strategic partnership. Well-architected portfolios include entry-level services that lower barriers, core services that generate volume, and strategic services that deepen relationships and margins." , improvementAction: "Map your service portfolio into tiers, identify gaps in the client journey, and develop entry-level offerings that create upsell pathways" },
      ]
    },
    {
      id: "vision", name: "Vision & Strategy", icon: "compass", totalWeight: 300, color: "#117A65",
      metrics: [
        { id: "vis_market", name: "Market/Niche Focus", question: "What is the current growth rate of your market/niche?", weight: 100, foundational: "Limited understanding of target market; no formal analysis of niche positioning or competitive landscape", evolving: "Defined target market with some analysis of niche opportunities, but positioning is not yet distinctive or consistently communicated", optimised: "Deep understanding of target niche with clear, differentiated positioning backed by regular market analysis and validated demand", guidance: "Deep market understanding means documented analysis of market size, growth trends, competitive dynamics, and emerging opportunities. Updated annually at minimum." , improvementAction: "Conduct formal market analysis annually, track serviceable addressable market, and identify adjacencies" },
        { id: "vis_comp", name: "Competitors & Barriers to Entry", question: "How intense is the competition or how high are barriers to entry in your market?", weight: 75, foundational: "High competition with 10+ direct competitors offering similar services and low barriers to entry", evolving: "Moderate competition with 5-10 competitors, some differentiation through IP or niche specialisation", optimised: "Low competition with <5 competitors in the same niche, strong barriers to entry through proprietary IP or brand authority", guidance: "Know your top 5-10 competitors deeply: their positioning, pricing, strengths, and weaknesses. A competitive intelligence process that informs strategy scores highest." , improvementAction: "Document competitor strengths and weaknesses, define clear differentiators, and monitor win/loss patterns" },
        { id: "vis_align", name: "Strategic Alignment", question: "How well is your strategy communicated, understood, and consistently executed across all levels of the organisation?", weight: 50, foundational: "Strategy is misaligned across teams", evolving: "Some alignment, but execution inconsistencies", optimised: "Strategy is well-defined and fully aligned", guidance: "Strategic alignment means the entire leadership team can articulate the same vision and priorities. Measured through consistent messaging and aligned departmental goals." , improvementAction: "Ensure strategy is communicated to all levels, embed strategic goals in team OKRs, and review quarterly" },
        { id: "vis_plan", name: "Business Planning", question: "How structured and regularly updated is your business planning process?", weight: 75, foundational: "No formal business plan or planning occurs reactively, with no structured forecasting", evolving: "Business planning conducted annually, with some structured financial and strategic forecasting", optimised: "Business planning is a quarterly rolling process, with 3-5 year strategic plans and real-time performance tracking", guidance: "A robust strategic plan covers 3-5 years with clear milestones, resource allocation, and KPIs. Reviewed quarterly with documented progress tracking." , improvementAction: "Document a clear 3-5 year strategic plan with measurable milestones and board-approved targets" },
        { id: "vis_esg", name: "ESG", question: "To what extent is ESG integrated into your business strategy with measurable targets and reporting?", weight: 0, foundational: "No formal ESG strategy, no tracking of environmental or social impact", evolving: "Basic ESG policy in place, some initiatives but no structured reporting", optimised: "Fully embedded ESG strategy with measurable KPIs and transparent annual reporting", guidance: "ESG and sustainability practices increasingly matter to acquirers. Documented policies, measurable targets, and annual reporting demonstrate maturity in this area." , improvementAction: "Establish ESG policy, report on sustainability metrics, and align with client procurement requirements" },
      ]
    },
    {
      id: "sales", name: "Sales & Pipeline", icon: "trending-up", totalWeight: 325, color: "#D97706",
      metrics: [
        { id: "sal_pipe", name: "Pipeline Visibility", question: "How much of the next 12 months' revenue do you currently have booked?", weight: 75, foundational: "<40% of next 12 months' revenue booked", evolving: "40-70% of next 12 months' revenue booked", optimised: ">70% of next 12 months' revenue booked", guidance: "A healthy pipeline is 3-4x annual revenue target with balanced stage distribution. Track pipeline velocity, win rates by stage, and average deal cycle length." , improvementAction: "Implement CRM discipline, maintain 3x pipeline coverage, and track conversion rates by stage" },
        { id: "sal_conv", name: "Conversion Ratios", question: "What is your typical proposal-to-project conversion ratio?", weight: 50, foundational: "<25% proposal conversion rate", evolving: "25%-50% proposal conversion rate", optimised: ">50% proposal conversion rate", guidance: "Conversion rates above 30% from qualified opportunity to close indicate strong sales execution. Track by service line, client segment, and team member." , improvementAction: "Conduct win/loss analysis on every bid, improve proposal quality, and build sector-specific case studies" },
        { id: "sal_mgmt", name: "Sales Management", question: "How structured and effective is your sales management system?", weight: 75, foundational: "Weak sales management: weak reporting or data. CRM not well integrated", evolving: "Improved sales management. CRM used, but not consistently by all", optimised: "Strong sales management by top-ranked senior. Weekly meetings driven by CRM-related data", guidance: "Mature sales management includes CRM discipline, regular pipeline reviews, accurate forecasting (within 10%), and documented sales processes with clear stage gates." , improvementAction: "Implement a structured sales management framework with CRM-driven pipeline tracking, weekly forecast reviews, and defined stage-gate criteria for opportunity progression" },
        { id: "sal_skills", name: "Sales Skills & Processes", question: "How well-defined and effective are your sales mentoring and training systems?", weight: 75, foundational: "No structured sales training/processes", evolving: "Some structured sales processes, but inconsistently applied", optimised: "Highly structured, repeatable sales process", guidance: "Sales capability goes beyond individual talent to include structured training, playbooks, proposal templates, and win/loss analysis feeding continuous improvement." , improvementAction: "Invest in a formal sales training programme covering consultative selling, objection handling, and proposal writing, with regular coaching and skills assessments" },
        { id: "sal_crosssell", name: "Cross-sell & Account Expansion", question: "What percentage of your annual revenue comes from selling additional services to existing clients?", weight: 50, foundational: "Cross-sell/upsell revenue below 15% of total; fewer than 1.5 service lines per client on average; ad-hoc account development", evolving: "Cross-sell/upsell revenue 15–25% of total; 1.5–2.5 service lines per client; some structured account planning in place", optimised: "Cross-sell/upsell revenue above 25% of total; 2.5+ service lines per client on average; systematic account growth plans with quarterly reviews", guidance: "Expansion revenue from existing clients is typically the highest-margin revenue source for PSFs. Track service lines per client, expansion revenue as a percentage of total, and account plan coverage for top 20 clients. Acquirers view strong cross-sell as evidence of deep client relationships and growth potential." , improvementAction: "Implement formal account plans for top 20 clients, set cross-sell revenue targets, and train delivery teams to identify expansion opportunities" },
      ]
    },
    {
      id: "clients", name: "Clients & Relationships", icon: "handshake", totalWeight: 300, color: "#DC2626",
      metrics: [
        { id: "cli_conc", name: "Client Concentration & Risk", question: "How concentrated is your revenue among your top three clients?", weight: 100, foundational: "Top 3 clients contribute >50% of total revenue, high dependency on a few key relationships", evolving: "Top 3 clients contribute 30-50% of total revenue, moderate diversification", optimised: "Top 3 clients contribute <30% of total revenue, well-diversified client base", guidance: "Client concentration below 20% for top client and below 50% for top 5 clients reduces acquirer risk. Active diversification strategy should be documented." , improvementAction: "Reduce largest client to below 15% of revenue, diversify across 3+ sectors, build mid-market pipeline" },
        { id: "cli_long", name: "Client Longevity", question: "What is your average client tenure?", weight: 100, foundational: "Average client tenure <6 months, transactional relationships, low retention", evolving: "Average client tenure 6-24 months, some long-term relationships", optimised: "Average client tenure >2 years, high retention rate, strong account management", guidance: "Long-term client relationships (3+ years average tenure) indicate service quality and switching costs. Track Net Revenue Retention and expansion revenue." , improvementAction: "Implement NPS tracking, conduct quarterly business reviews with top 20 clients, target 90%+ retention" },
        { id: "cli_size", name: "Client Size", question: "What is the typical size of your client contracts?", weight: 25, foundational: "Majority of clients are small contracts (<\u00A350k annual spend)", evolving: "Mix of small and mid-sized clients, with 20%+ of revenue from mid-tier (\u00A350k-\u00A3250k)", optimised: "30%+ of revenue from large clients (\u00A3250k+ per year), strategic account penetration", guidance: "Growing average client size indicates deepening relationships and cross-sell success. Track revenue per client trends and number of service lines per client." , improvementAction: "Develop structured account growth plans, set expansion targets per client, and track wallet share" },
        { id: "cli_part", name: "Partnerships & Alliances", question: "How structured and beneficial are your strategic partnerships and alliances?", weight: 25, foundational: "No formal partnerships, occasional ad hoc collaborations", evolving: "1-3 strategic partnerships, contributing <10% of revenue", optimised: "3+ strong partnerships, contributing >15% of revenue, integrated into go-to-market", guidance: "Strategic client partnerships include joint planning, executive sponsorship, multi-year contracts, and embedded team models. These create defensible revenue streams." , improvementAction: "Establish multi-stakeholder relationships at each key client, implement relationship mapping tools" },
        { id: "cli_ref", name: "Referenceable Clients", question: "What percentage of your active clients would willingly serve as a reference or case study?", weight: 50, foundational: "Fewer than 50% of clients would serve as references; no formal reference programme; limited published case studies", evolving: "50–75% referenceable clients; some case studies and testimonials collected; informal reference process", optimised: "Over 75% referenceable clients; formal reference programme with documented case studies; references readily available for sales and M&A due diligence", guidance: "Referenceable clients are a critical asset in both sales and M&A due diligence. Acquirers will want to speak to clients during the deal process. Firms with >75% referenceability demonstrate strong delivery quality and client satisfaction. Track referenceability separately from NPS — a client can be satisfied but unwilling to go on record." , improvementAction: "Build formal reference programme, request testimonials after successful projects, publish case studies quarterly, and maintain a reference-ready client list" },
      ]
    },
    {
      id: "leadership", name: "Leadership & Governance", icon: "shield", totalWeight: 300, color: "#4A235A",
      metrics: [
        { id: "led_team", name: "Senior Leadership Team", question: "How experienced and strategically skilled is your senior leadership team?", weight: 100, foundational: "Leadership team lacks defined roles and accountability; decision-making is ad hoc and overly reliant on the founder or a single individual", evolving: "Leadership team has defined roles with improving accountability, but still dependent on 1–2 key individuals for major decisions and client relationships", optimised: "Very experienced leadership team with experience of M&A", guidance: "A complete, capable leadership team has clear roles, complementary skills, and succession plans. No single point of failure. Board or advisory board adds governance strength." , improvementAction: "Build balanced leadership team across functions, invest in executive coaching, and conduct team reviews" },
        { id: "led_deleg", name: "Delegation & Succession", question: "How clearly defined are your delegation and succession planning processes?", weight: 100, foundational: "Founders drive most key decisions", evolving: "Some delegation, but founder dependence remains", optimised: "CEO and leadership team operate independently", guidance: "Effective delegation means the firm runs without founder dependency. Key decisions are made at appropriate levels with documented authority matrices." , improvementAction: "Document succession plans for all key roles, develop internal candidates, and test plans annually" },
        { id: "led_gov", name: "Governance & Controls", question: "How robust are your governance and control mechanisms?", weight: 50, foundational: "One or none of: Strong advisory board; Strong governance for decision-making; Strong strategic reporting", evolving: "Two of these: Strong advisory board; Strong governance; Strong strategic reporting", optimised: "All three: Strong advisory board; Strong governance for decision-making; Strong strategic reporting", guidance: "Strong governance includes regular board meetings, documented policies, risk management frameworks, compliance procedures, and clear reporting structures." , improvementAction: "Establish independent advisory board, implement formal board reporting, and define governance charter" },
        { id: "led_risk", name: "Risk Management", question: "How formal and comprehensive is your risk management framework?", weight: 50, foundational: "No formal risk register; risk management is reactive; no business continuity plan or compliance framework documented", evolving: "Risk register maintained and reviewed quarterly; basic business continuity plan in place; some compliance documentation but not systematically embedded", optimised: "Enterprise risk management fully embedded with risk register reviewed quarterly by board; business continuity plan tested annually; formal assessment of third-party, cyber, and operational risks", guidance: "Formal risk management is increasingly scrutinised in M&A due diligence. Acquirers expect to see a maintained risk register, business continuity planning, and evidence of compliance maturity. Weak risk governance can trigger 10–15% valuation discounts. Align with ISO 31000 principles for best practice." , improvementAction: "Establish a formal risk register with assigned owners, implement business continuity plan, and conduct annual risk reviews with board oversight" },
      ]
    },
    {
      id: "cost", name: "Cost Optimisation", icon: "calculator", totalWeight: 250, color: "#16A34A",
      metrics: [
        { id: "cos_deliv", name: "Delivery Model", question: "How efficient and optimised is your current delivery model?", weight: 25, foundational: "Delivery is fully onshore, cost inefficiencies", evolving: "Some offshore delivery, but limited efficiency gains", optimised: "Optimised delivery mix with offshore efficiencies", guidance: "Delivery cost efficiency means optimal staff-to-project ratios, minimal rework, and consistent on-budget project delivery. Track cost variance against estimates." , improvementAction: "Track project profitability weekly, implement earned value management, and address margin erosion early" },
        { id: "cos_tech", name: "Technology Maturity", question: "What is the maturity level of your technology infrastructure (CRM, PSA, HCM)?", weight: 75, foundational: "Limited use of CRM, PSA, or automation", evolving: "Basic adoption of CRM, PSA, and some automation", optimised: "Fully integrated digital ecosystem (CRM, PSA, AI)", guidance: "Technology enablement includes modern tools for collaboration, project management, time tracking, and client delivery. Cloud-first, integrated platforms score highest." , improvementAction: "Consolidate technology stack, measure ROI on all platforms, and automate repetitive delivery tasks" },
        { id: "cos_scale", name: "Scaling Infrastructure", question: "What percentage of your core business processes are automated or supported by AI and scalable technology?", weight: 75, foundational: "<20% of core business processes automated or AI-supported", evolving: "20-50% of core business processes automated, with partial AI-driven analytics", optimised: ">50% of processes automated, with AI and RPA fully embedded in operations", guidance: "Scalable operations can grow revenue faster than headcount. Look for automation, standardised processes, offshore/nearshore leverage, and technology-enabled delivery." , improvementAction: "Standardise delivery processes, build reusable assets, and invest in platforms that scale efficiently" },
        { id: "cos_data", name: "Data Maturity", question: "How mature is your approach to data management and analytics?", weight: 75, foundational: "Data fragmented, manual reporting", evolving: "Some structured reporting, data inconsistencies", optimised: "Automated, real-time data-driven reporting", guidance: "Data-driven decision making requires clean data, regular reporting dashboards, and evidence-based planning. Analytics capability is increasingly valued by acquirers." , improvementAction: "Implement BI dashboards for real-time visibility, track leading indicators, and automate reporting" },
        { id: "cos_lever", name: "Leverage", question: "What is your typical ratio of junior to senior staff on project delivery teams?", weight: 0, foundational: "Heavy reliance on senior staff for delivery; junior-to-senior ratio below 2:1 with limited delegation of work", evolving: "Emerging leverage model with junior-to-senior ratio of 2:1–3:1; some structured delegation but seniors still heavily involved in delivery", optimised: "Effective leverage model with junior-to-senior ratio above 3:1; clear role-based delivery structure that maximises senior capacity for sales and oversight", guidance: "Leverage in a PSF context means the ratio of junior to senior staff on projects. Higher leverage with maintained quality indicates scalable, profitable delivery." , improvementAction: "Optimize team pyramids, increase junior leverage ratios, and use offshore/nearshore where appropriate" },
        { id: "cos_know", name: "Knowledge", question: "What percentage of your organisational knowledge and delivery methodologies are formally documented and accessible?", weight: 0, foundational: "<20% of knowledge is codified, minimal documentation", evolving: "20-50% of knowledge is documented, some use of knowledge management tools", optimised: ">50% of knowledge is structured and documented, KM systems fully integrated", guidance: "Knowledge management systems capture institutional knowledge, enable reuse, and accelerate onboarding. Documented methodologies and searchable knowledge bases score highest." , improvementAction: "Build knowledge management system, capture project learnings, and reduce reinvention across teams" },
        { id: "cos_resrc", name: "Resourcing", question: "What is your average consultant utilisation rate and how far ahead do you forecast resource demand?", weight: 0, foundational: "Utilisation <60%, poor visibility on resource allocation", evolving: "Utilisation 60-75%, some workforce planning but reactive deployment", optimised: "Utilisation >75%, proactive resource planning and demand forecasting", guidance: "Resource management optimises utilisation while preventing burnout. Mature firms use forecasting tools, skills databases, and capacity planning 3-6 months ahead." , improvementAction: "Implement resource management tooling, forecast demand 90 days ahead, and reduce bench time below 10%" },
      ]
    },
    {
      id: "delivery", name: "Delivery", icon: "check-square", totalWeight: 225, color: "#2E86C1",
      metrics: [
        { id: "del_sat", name: "Client Satisfaction", question: "How structured and effective is your client satisfaction measurement (NPS)?", weight: 75, foundational: "No structured feedback mechanisms (NPS <20)", evolving: "Periodic feedback collection, NPS 20-50", optimised: "Advanced feedback mechanisms, NPS >50", guidance: "Client satisfaction scores (CSAT/NPS) above industry average demonstrate delivery quality. Regular measurement, trend tracking, and action on feedback score highest." , improvementAction: "Implement quality assurance checkpoints, track client satisfaction per project, and maintain scorecards" },
        { id: "del_util", name: "Utilisation", question: "What is the average billable utilisation rate across your delivery team?", weight: 50, foundational: "Utilisation <60%", evolving: "Utilisation 60-75%", optimised: "Utilisation >75%", guidance: "Utilisation rates of 70-80% for senior staff and 80-85% for delivery teams are healthy. Track billable vs non-billable carefully and manage bench time productively." , improvementAction: "Target 75%+ billable utilization, implement real-time tracking, and address underperforming areas" },
        { id: "del_qa", name: "Quality Assurance", question: "How robust are your quality assurance standards?", weight: 50, foundational: "No formal QA standards", evolving: "Some QA standards in place, inconsistent adherence", optimised: "Robust QA framework throughout project delivery, consistently applied", guidance: "Quality assurance includes peer review processes, delivery standards, client acceptance procedures, and continuous improvement loops from project retrospectives." , improvementAction: "Standardize delivery methodology, train all staff, and measure methodology adherence on every project" },
        { id: "del_otob", name: "On-Time & On-Budget Delivery", question: "What percentage of your projects are delivered on time and within budget?", weight: 50, foundational: "Fewer than 60% of projects delivered on time and on budget; rework rate above 8% of project hours; limited scope or change control", evolving: "60–80% of projects on time and on budget; rework rate 3–8%; formal change control process in place but inconsistently applied", optimised: "Over 80% of projects on time and on budget; rework rate below 3%; rigorous change control and scope management; project margins consistently above target", guidance: "On-time, on-budget delivery is the operational proof of a firm's promises. The industry average is approximately 73% on-time delivery (based on industry data), but this has been declining. Track on-time and on-budget rates separately, monitor rework as a percentage of total project hours, and ensure change control processes are consistently applied." , improvementAction: "Implement project health dashboards, introduce earned value management for large projects, and conduct post-project reviews to reduce rework rates" },
      ]
    },
    {
      id: "market", name: "Market Profile", icon: "globe", totalWeight: 200, color: "#CA6F1E",
      metrics: [
        { id: "mkt_size", name: "Market Size & Growth Potential", question: "How large is your total addressable market and what is its projected growth rate?", weight: 25, foundational: "Small total addressable market (less than £500m)", evolving: "Medium total addressable market (£500m–£1bn)", optimised: "Large total addressable market (>£1bn) with strong projected growth", guidance: "Addressable market size should be clearly defined and large enough for growth ambitions. Document TAM, SAM, and SOM with credible bottom-up analysis." , improvementAction: "Define total addressable market, track market share trends, and identify growth white spaces" },
        { id: "mkt_mktg", name: "Marketing Influence on Revenue", question: "What percentage of your revenue is directly influenced by marketing activities?", weight: 50, foundational: "<5% of revenue influenced by marketing", evolving: "5-15% of revenue influenced by marketing", optimised: "15%+ of revenue driven by marketing", guidance: "Marketing effectiveness is measured by lead generation metrics, brand awareness, share of voice, and marketing-attributed pipeline. Track cost per qualified lead." , improvementAction: "Build content marketing pipeline, track cost per lead, and measure marketing-sourced pipeline quarterly" },
        { id: "mkt_award", name: "Awards & Recognition", question: "How many national or industry awards have you won in the past three years?", weight: 50, foundational: "No national or industry awards won in the past three years", evolving: "1-2 national or industry awards won in the past three years", optimised: "3+ national or industry awards, with external validation from major industry bodies", guidance: "Industry awards and recognition validate market positioning. Active award submissions, analyst relations, and industry body participation demonstrate thought leadership." , improvementAction: "Pursue relevant industry awards, build case study library, and manage online review presence actively" },
        { id: "mkt_thought", name: "Thought Leadership", question: "How active and recognised is your thought leadership?", weight: 50, foundational: "No thought leadership published in the past 12 months; no defined content strategy or editorial calendar", evolving: "At least 1–2 thought leadership pieces published per quarter, with an emerging content strategy but inconsistent cadence", optimised: "Recognised industry thought leader, 4+ high-impact pieces monthly with significant recognition", guidance: "Thought leadership includes regular publishing, speaking engagements, research reports, and media presence. Content should demonstrate deep domain expertise." , improvementAction: "Publish quarterly research/whitepapers, secure speaking slots at key events, and build analyst relationships" },
        { id: "mkt_brand", name: "Branding", question: "What is your brand awareness and market recognition level?", weight: 0, foundational: "No defined brand strategy, weak recognition outside existing clients", evolving: "Some brand recognition, 1-2 external PR initiatives annually", optimised: "Recognised industry brand with strong external presence driving inbound opportunities", guidance: "Brand strength is measured by unaided awareness, brand preference in target segments, and premium pricing ability. Consistent visual identity and messaging across channels." , improvementAction: "Build distinctive thought leadership program, measure share of voice, and invest in digital brand presence" },
        { id: "mkt_digital", name: "Digital Presence & Inbound Pipeline", question: "What percentage of your new business pipeline originates from your digital presence (website, content, SEO, social)?", weight: 25, foundational: "Less than 10% of pipeline from digital/inbound; website outdated or not optimised; no content strategy or lead tracking", evolving: "10–30% of pipeline from digital channels; website functional with some content; basic lead tracking and CRM integration; some online thought leadership", optimised: "Over 30% of pipeline from digital/inbound channels; website optimised for lead generation; systematic content strategy with regular publishing; marketing automation and attribution tracking in place", guidance: "Digital presence is increasingly the primary discovery channel for PSF buyers. High-growth firms generate 30%+ of pipeline from inbound digital channels. Track website traffic, conversion rates, content engagement, and marketing-attributed pipeline. Inbound leads cost approximately 2.6x less than outbound and convert at higher rates." , improvementAction: "Invest in website optimisation, build systematic content calendar, implement marketing automation, and track digital attribution to pipeline" },
      ]
    },
  ]
};

const TOTAL_MAX_SCORE = FRAMEWORK.themes.reduce((sum, t) => sum + t.metrics.reduce((s, m) => s + m.weight * 3, 0), 0);
const TOTAL_WEIGHTED_POINTS = FRAMEWORK.themes.reduce((sum, t) => sum + t.totalWeight, 0); // 3525

// -----------------------------------------------------------------------
// INDUSTRY BENCHMARKS - Average scores by sector
// -----------------------------------------------------------------------
export const BENCHMARK_PROFILES = {
  "M&A-Ready (PSF)": { financial: 70, people: 68, services: 66, vision: 64, sales: 65, clients: 68, leadership: 67, cost: 65, delivery: 70, market: 65 },
  "Top Decile": { financial: 85, people: 82, services: 80, vision: 78, sales: 80, clients: 82, leadership: 80, cost: 78, delivery: 85, market: 78 },
  "Industry Average": { financial: 55, people: 52, services: 50, vision: 48, sales: 48, clients: 52, leadership: 50, cost: 48, delivery: 55, market: 48 },
  "Consulting": { financial: 72, people: 70, services: 68, vision: 66, sales: 67, clients: 70, leadership: 69, cost: 67, delivery: 72, market: 67 },
  "Technology Services": { financial: 68, people: 65, services: 70, vision: 68, sales: 63, clients: 65, leadership: 64, cost: 62, delivery: 74, market: 70 },
  "Legal & Compliance": { financial: 65, people: 62, services: 64, vision: 58, sales: 55, clients: 72, leadership: 70, cost: 60, delivery: 68, market: 58 },
  "Financial Advisory": { financial: 75, people: 66, services: 65, vision: 62, sales: 68, clients: 70, leadership: 68, cost: 64, delivery: 66, market: 62 }
};



const ENHANCED_GUIDANCE = {
  themes: {
    financial: {
      overview: "Financial performance is the single most scrutinised area in M&A due diligence. Acquirers evaluate revenue trajectory, margin stability, and cash conversion to assess earnings quality and growth sustainability. Firms demonstrating consistent, diversified revenue with strong EBITDA margins command premium valuations — often 8–12x EBITDA for top-quartile PSFs versus 4–6x for average performers.",
      keyBenchmarks: [
        { metric: "Revenue Growth", target: "10–15% YoY organic" },
        { metric: "Gross Margin", target: "55–70%" },
        { metric: "EBITDA Margin", target: "15–25%" },
        { metric: "Revenue per FTE", target: "£100–180k" },
        { metric: "Recurring Revenue", target: ">30% of total" }
      ],
      caseStudy: {
        title: "Meridian Consulting: From Feast-or-Famine to Predictable Growth",
        scenario: "A 120-person management consulting firm with £18M revenue, heavy reliance on three anchor clients (62% of revenue), and volatile annual growth ranging from -5% to +22%.",
        foundational: "Meridian had no formal revenue forecasting, project pricing was ad-hoc, and margins fluctuated between 8–18% depending on utilisation. The founding partners controlled all major client relationships.",
        evolution: "Over 18 months they implemented monthly financial reporting by service line, introduced value-based pricing on 40% of engagements, and diversified revenue with two new service offerings. EBITDA stabilised at 14–16%.",
        optimised: "After three years, Meridian achieved 12% YoY growth, 22% EBITDA, and reduced top-client concentration to 28%. The predictable financial profile attracted acquisition interest at 9.2x EBITDA.",
        outcome: "Acquired at a 35% premium to initial valuation expectations, driven primarily by the quality and predictability of the financial trajectory."
      }
    },
    people: {
      overview: "People are the core asset in any professional services firm — and often the most significant risk factor in M&A. Acquirers assess talent depth, retention stability, and cultural cohesion to determine whether the firm’s value walks out the door each evening. Firms with strong employer brands, low attrition, and distributed expertise command higher valuations and smoother post-merger integrations.",
      keyBenchmarks: [
        { metric: "Voluntary Turnover", target: "<12% annually" },
        { metric: "Employee Engagement", target: ">75% favourable" },
        { metric: "Revenue per Employee", target: "£100–150k" },
        { metric: "Time to Hire", target: "<45 days avg" },
        { metric: "Training Investment", target: ">3% of revenue" }
      ],
      caseStudy: {
        title: "Kinetic Partners: Building a Talent Engine That Survived Acquisition",
        scenario: "An 85-person technology consulting firm experiencing 25% annual attrition, with knowledge concentrated in a small group of senior consultants who personally held all key client relationships.",
        foundational: "Kinetic had no structured career paths, compensation was opaque, and exit interviews were not conducted. Three departures of senior staff in one quarter triggered the loss of two major accounts.",
        evolution: "They introduced a competency framework with transparent career ladders, implemented quarterly pulse surveys, and created a mentorship programme pairing senior and junior consultants. Attrition dropped to 18% within a year.",
        optimised: "After two years, voluntary turnover fell to 11%, Glassdoor ratings rose from 3.2 to 4.3, and the firm won a regional ‘Best Workplace’ award. Knowledge was systematically documented and client relationships distributed across teams.",
        outcome: "The acquirer cited the stable, engaged workforce as a key factor in their 8.5x EBITDA offer — noting that typical PSF acquisitions at this size traded at 5–7x."
      }
    },
    services: {
      overview: "Service proposition clarity and pricing sophistication signal strategic maturity to acquirers. Firms that have moved beyond time-and-materials billing to value-based pricing, developed proprietary methodologies, and built scalable service lines demonstrate the kind of intellectual property and margin resilience that drives premium valuations.",
      keyBenchmarks: [
        { metric: "Value-Based Pricing", target: ">40% of engagements" },
        { metric: "Service Line Gross Margin", target: "55–65% average" },
        { metric: "Avg Project Size", target: ">2x industry median" },
        { metric: "IP-Driven Revenue", target: ">20% of total" },
        { metric: "Repeat Business Rate", target: ">60%" }
      ],
      caseStudy: {
        title: "Stratos Advisory: From Commodity Hourly Rates to Premium IP",
        scenario: "A 60-person financial advisory firm billing almost exclusively on day rates, competing primarily on price, with no proprietary tools or frameworks differentiating their offering.",
        foundational: "Stratos had undifferentiated service descriptions, no documented methodologies, and partners frequently discounted rates to win work. Average project size was £35k and margins were thin at 12%.",
        evolution: "They codified their top consultants’ approaches into three branded methodologies, created diagnostic assessment tools, and trained the team on value-based scoping. Within a year, 30% of new engagements used fixed-fee value pricing.",
        optimised: "Stratos became known for their proprietary diagnostic framework, which became a market differentiator. Average project size doubled to £72k, margins reached 24%, and they were able to selectively decline low-value work.",
        outcome: "The IP portfolio was valued separately in the acquisition, adding an estimated 1.5x to the overall EBITDA multiple."
      }
    },
    vision: {
      overview: "A clear, articulated strategy signals to acquirers that the firm’s growth is intentional rather than accidental. Firms with documented strategic plans, defined market positioning, and measurable strategic KPIs demonstrate the kind of purposeful direction that reduces acquisition risk and supports post-deal integration planning.",
      keyBenchmarks: [
        { metric: "Strategic Plan", target: "3–5 year documented plan reviewed quarterly" },
        { metric: "Market Focus", target: "Clear niche with >15% market share" },
        { metric: "Strategic KPIs", target: "5–8 tracked metrics with quarterly review" },
        { metric: "Innovation Investment", target: "3–5% of revenue" },
        { metric: "ESG Framework", target: "Published policy with measurable targets" }
      ],
      caseStudy: {
        title: "Horizon Group: From Opportunistic Growth to Strategic Clarity",
        scenario: "A 95-person multi-discipline consultancy that had grown by accepting any project that came through the door, resulting in an unfocused service portfolio spanning six unrelated sectors.",
        foundational: "Horizon had no written strategy, made market decisions reactively, and measured success solely by top-line revenue. Partners disagreed on the firm’s target market and ideal client profile.",
        evolution: "A facilitated strategy offsite produced a 3-year plan focusing on two core sectors. They exited three unprofitable service areas and invested in thought leadership for their chosen niches. Revenue dipped 8% initially but margins improved by 6 points.",
        optimised: "After three years, Horizon was recognised as a sector specialist with 18% market share in their primary niche. Their strategic clarity attracted premium clients and the focused positioning made them an attractive bolt-on acquisition target.",
        outcome: "Acquired by a larger consultancy specifically seeking their niche expertise — the strategic clarity made integration planning straightforward and reduced buyer risk."
      }
    },
    sales: {
      overview: "Pipeline health and sales capability are leading indicators of future revenue — and acquirers scrutinise them intensely during due diligence. Firms with visible, well-managed pipelines, strong conversion ratios, and systematic sales processes demonstrate revenue predictability that directly impacts valuation multiples.",
      keyBenchmarks: [
        { metric: "Pipeline Coverage", target: "3–4x of revenue target" },
        { metric: "Win Rate", target: "35–50% (qualified opps)" },
        { metric: "Sales Cycle Length", target: "<90 days average" },
        { metric: "New vs Existing Revenue", target: "25–40% from new clients" },
        { metric: "Proposal Success Rate", target: ">40%" }
      ],
      caseStudy: {
        title: "Atlas Consulting: From Founder-Led Sales to a Scalable Engine",
        scenario: "A 70-person strategy consulting firm where the two founding partners personally generated 80% of all new business, with no CRM, no pipeline reporting, and an ad-hoc approach to proposals.",
        foundational: "Atlas had no visibility into upcoming revenue beyond 60 days. Sales forecasts were guesswork based on partner intuition. When one founder took extended leave, new business development effectively stopped.",
        evolution: "They implemented a CRM with mandatory pipeline stages, introduced weekly pipeline reviews, and began training senior consultants in business development. Within a year, four non-partner staff were contributing to the pipeline.",
        optimised: "Pipeline coverage reached 3.5x, win rates improved from 22% to 41%, and the sales cycle shortened from 120 to 75 days. Revenue became predictable with <10% variance from quarterly forecasts.",
        outcome: "The acquirer’s due diligence highlighted the pipeline maturity as exceptional for a firm of this size, directly supporting the 8x EBITDA valuation."
      }
    },
    clients: {
      overview: "Client portfolio quality is a critical M&A risk factor. Acquirers analyse concentration risk, client longevity, contract structures, and relationship depth to assess revenue durability. A diversified, loyal client base with long-term relationships and embedded partnerships signals sustainable revenue streams that survive ownership transitions.",
      keyBenchmarks: [
        { metric: "Top Client Revenue", target: "<15% from any single client" },
        { metric: "Top 5 Client Revenue", target: "<40% combined" },
        { metric: "Avg Client Tenure", target: ">3 years" },
        { metric: "Net Revenue Retention", target: ">110%" },
        { metric: "NPS Score", target: ">50" }
      ],
      caseStudy: {
        title: "Pinnacle Solutions: Reducing Concentration Risk Before Exit",
        scenario: "A 55-person IT consulting firm where one government contract represented 45% of revenue and the top three clients accounted for 72% of total income.",
        foundational: "Pinnacle had accepted the concentration risk as ‘just how government consulting works.’ No systematic client development programme existed, and relationship ownership sat entirely with two senior partners.",
        evolution: "They launched a structured account growth programme targeting mid-tier clients, introduced quarterly business reviews with all clients billing >5% of revenue, and began cross-selling services to existing accounts. Within 18 months, top-client share dropped to 32%.",
        optimised: "After three years, no single client exceeded 18% of revenue, top-5 concentration dropped to 48%, and average client tenure reached 4.2 years. Client relationships were distributed across multiple team members at each account.",
        outcome: "The reduced concentration risk was explicitly cited by the acquirer as removing a key deal obstacle, enabling a clean transaction at 7.5x EBITDA."
      }
    },
    leadership: {
      overview: "Leadership depth and governance maturity are decisive factors in M&A. Acquirers need confidence that the firm can operate and grow without its founders. Strong governance structures, clear delegation of authority, and a capable second tier of leadership reduce key-person risk and signal an organisation that has matured beyond founder-dependence.",
      keyBenchmarks: [
        { metric: "Key Person Dependency", target: "<25% revenue tied to any individual" },
        { metric: "Leadership Depth", target: "Documented succession for all C-suite roles" },
        { metric: "Board Independence", target: "At least 1 independent NED" },
        { metric: "Decision Authority", target: "Documented delegation matrix" },
        { metric: "Risk Register", target: "Maintained and reviewed quarterly" }
      ],
      caseStudy: {
        title: "Vertex Partners: Preparing Leadership for a Founder Exit",
        scenario: "A 100-person professional services firm where the founder-CEO made virtually all strategic and operational decisions, with no formal governance structure and no identified successor.",
        foundational: "Vertex had no board, no documented decision-making authority, and the founder personally approved all engagements over £50k. Two previous acquisition approaches had stalled due to key-person risk concerns.",
        evolution: "They established an advisory board with two independent members, created a leadership team of four managing directors with defined P&L responsibility, and implemented a delegation matrix. The founder began a structured transition, reducing day-to-day involvement.",
        optimised: "After two years, the firm operated independently of the founder for a full quarter during sabbatical. The leadership team delivered 15% revenue growth during this period, demonstrating genuine operational independence.",
        outcome: "The third acquisition approach succeeded, with the acquirer specifically noting that the leadership maturity made Vertex ‘acquisition-ready’ — a term rarely applied to founder-led firms."
      }
    },
    cost: {
      overview: "Cost structure maturity reveals operational discipline and scalability potential. Acquirers evaluate technology investment, delivery model efficiency, and overhead ratios to assess how well the firm converts revenue into profit. Firms with lean, technology-enabled operations and scalable delivery models demonstrate the operating leverage that supports post-acquisition growth without proportional cost increases.",
      keyBenchmarks: [
        { metric: "Overhead Ratio", target: "<30% of revenue" },
        { metric: "Technology Spend", target: "3–6% of revenue" },
        { metric: "Delivery Leverage Ratio", target: ">3:1 junior to senior on projects" },
        { metric: "Utilisation Rate", target: "72–78% billable" },
        { metric: "Profit per Employee", target: ">£20k annually" }
      ],
      caseStudy: {
        title: "Keystone Advisors: Operational Transformation Through Technology",
        scenario: "A 130-person consulting firm running on spreadsheets for project management, time tracking, and financial reporting — with an overhead ratio of 42% and no standardised delivery methodology.",
        foundational: "Keystone had no integrated systems, relied on manual processes for invoicing and resource planning, and each practice area operated with different tools and templates. Knowledge sharing was non-existent.",
        evolution: "They invested in an integrated PSA platform, standardised project delivery templates across all practices, and implemented automated time tracking and invoicing. Overhead dropped to 34% within 18 months.",
        optimised: "After three years, the overhead ratio reached 26%, utilisation improved from 62% to 74%, and the firm was delivering 15% more revenue per head. The technology platform enabled real-time margin visibility across all engagements.",
        outcome: "The acquirer valued the operational maturity as creating immediate synergy potential — the technology platform and processes could be rolled out across their existing portfolio firms."
      }
    },
    delivery: {
      overview: "Delivery excellence is the operational proof of a firm’s promises. Acquirers evaluate client satisfaction metrics, utilisation efficiency, and quality assurance processes to assess whether the firm consistently delivers value. High-performing delivery organisations achieve strong project margins while maintaining client satisfaction — the combination that drives both retention and referral-based growth.",
      keyBenchmarks: [
        { metric: "Client Satisfaction", target: "NPS >50 or CSAT >4.2/5" },
        { metric: "Billable Utilisation", target: "72–78%" },
        { metric: "Project Margin", target: ">45% average" },
        { metric: "On-Time Delivery", target: ">85% of projects" },
        { metric: "Rework Rate", target: "<5% of project hours" }
      ],
      caseStudy: {
        title: "Prism Consulting: Turning Delivery Excellence into a Growth Engine",
        scenario: "A 75-person consulting firm with inconsistent project delivery quality, no systematic client feedback process, and utilisation hovering at 58% — well below industry benchmarks.",
        foundational: "Prism had no quality assurance process, client feedback was collected ad-hoc (if at all), and utilisation was unmeasured at the individual level. Project profitability varied wildly from -10% to +60%.",
        evolution: "They implemented post-project reviews, introduced real-time utilisation dashboards, and created a structured QA checkpoint process for all engagements over £25k. Utilisation rose to 68% and client satisfaction scores were baselined.",
        optimised: "After two years, utilisation reached 74%, average project margins improved to 48%, and NPS hit 62. The structured delivery process became a selling point in pitches, with clients citing consistent quality as their primary reason for repeat engagement.",
        outcome: "The delivery track record provided the acquirer with confidence in revenue sustainability — high satisfaction and repeat business reduced integration risk."
      }
    },
    market: {
      overview: "Market positioning and brand strength are increasingly important M&A factors. Acquirers value firms with strong brand recognition, thought leadership presence, and clear market positioning because these create sustainable competitive advantages that are difficult to replicate. A strong market profile also reduces client acquisition costs and supports premium pricing.",
      keyBenchmarks: [
        { metric: "Brand Awareness", target: ">40% aided awareness in target market" },
        { metric: "Marketing ROI", target: ">5:1 pipeline to spend ratio" },
        { metric: "Thought Leadership", target: ">12 published pieces annually" },
        { metric: "Inbound Lead %", target: ">30% of qualified pipeline" },
        { metric: "Awards/Recognition", target: "2+ industry awards annually" }
      ],
      caseStudy: {
        title: "Beacon Consulting: From Invisible to Industry Authority",
        scenario: "A 50-person niche consulting firm with deep expertise but virtually no market visibility — 100% of new business came through personal networks and referrals, with no marketing function, website updates, or thought leadership.",
        foundational: "Beacon had no marketing budget, an outdated website, and zero published thought leadership. The firm was unknown outside its immediate referral network, limiting growth to organic word-of-mouth.",
        evolution: "They hired a marketing manager, launched a quarterly industry report, began speaking at three target conferences annually, and refreshed their digital presence. Within a year, inbound enquiries increased from near-zero to 15% of pipeline.",
        optimised: "After three years, Beacon was recognised as the go-to specialist in their niche. Their annual industry report was downloaded 3,000+ times, inbound leads represented 35% of pipeline, and they had won two industry awards. Brand recognition in their target market reached 45%.",
        outcome: "The market profile was identified by the acquirer as a strategic asset — the brand and thought leadership platform would be used to cross-sell the combined entity’s broader service offering."
      }
    }
  },
  metrics: {
    fin_revenue: {
      benchmarks: "Top-quartile PSFs achieve 10–15% YoY organic revenue growth consistently. Acquirers distinguish between organic growth (valued highly) and acquisition-driven growth (valued less). Revenue CAGR over 3–5 years is the primary metric, with consistency valued over occasional spikes. Firms growing >15% annually are typically classified as ‘high-growth’ and attract premium multiples.",
      caseStudy: "A £25M management consultancy achieved 8% average growth over five years, but the pattern was volatile: +22%, -3%, +15%, -1%, +8%. An acquirer offered 5.5x EBITDA. A similarly-sized competitor with steady 11% annual growth (never below 8% or above 14%) received a 7.8x offer — the consistency premium was worth 2.3x EBITDA.",
      workedExample: {
        situation: "Your firm grew revenue 7% last year, up from 3% the year before. Growth is primarily organic but concentrated in one service line that grew 25% while others were flat.",
        rating: "Evolving (Level 2)",
        rationale: "Growth exists but is not broad-based or consistently above 10%. The concentration in one service line creates risk. To reach Optimised, the firm needs diversified growth across multiple service lines with a 3-year CAGR above 10%."
      },
      improvementTips: ["Analyse revenue by service line to identify which are growing and which are stagnant", "Set growth targets per service line rather than one firm-wide number", "Invest in business development for underperforming service lines", "Track and report monthly revenue run-rate to spot trends early"]
    },
    fin_gm: {
      benchmarks: "M&A-ready PSFs typically maintain gross margins of 55–70%, depending on service mix. Pure advisory firms target the higher end (65–70%), while firms with a delivery/implementation component typically achieve 50–60%. Margins below 45% signal pricing issues, overstaffing on projects, or excessive use of subcontractors without adequate mark-up.",
      caseStudy: "A technology consulting firm had an aggregate 48% gross margin but discovered through analysis that their advisory work ran at 72% while implementation projects delivered only 35%. By restructuring implementation pricing and improving resource planning, they lifted blended margin to 58% within 18 months — adding £1.2M to annual profit.",
      workedExample: {
        situation: "Your firm’s gross margin is 52%, consistent with prior years. You use subcontractors for approximately 30% of delivery, marking up their rates by 15%.",
        rating: "Evolving (Level 2)",
        rationale: "A 52% margin is functional but below the 55%+ target for M&A readiness. The 15% subcontractor markup is low — most mature firms achieve 25–40%. Improving subcontractor margins and reducing their proportion of delivery would lift the overall margin."
      },
      improvementTips: ["Analyse margin by service line, client, and project type to identify underperformers", "Review subcontractor markup — aim for 25–40% rather than cost-plus-15%", "Implement project-level margin tracking with alerts for projects below threshold", "Consider value-based pricing for high-margin advisory work"]
    },
    fin_ebitda: {
      benchmarks: "EBITDA margin is the primary valuation metric in PSF M&A. Top-quartile firms achieve 15–25%, with the median around 12–15%. Margins above 20% are considered excellent and typically attract the highest multiples. Consistency matters more than peak performance — a steady 18% EBITDA is valued higher than fluctuating between 10% and 25%.",
      caseStudy: "Two £15M consulting firms approached the same acquirer. Firm A had 22% EBITDA but it was a one-year spike from a large project; the prior three years averaged 11%. Firm B maintained a steady 17% EBITDA over four years. Firm B received a 15% higher valuation because the sustained margin demonstrated structural profitability rather than a windfall.",
      workedExample: {
        situation: "Your firm’s EBITDA margin is 13% this year, up from 10% last year and 8% the year before. The improvement is driven by better utilisation and a one-off reduction in office costs.",
        rating: "Evolving (Level 2)",
        rationale: "The trend is positive but 13% is still below the 15%+ target. The one-off cost saving inflates this year’s figure. To rate Optimised, the firm needs to demonstrate 15%+ EBITDA sustained over 2–3 years through structural improvements, not one-off savings."
      },
      improvementTips: ["Separate structural margin improvements from one-off gains in your reporting", "Target 1–2 percentage point annual improvement through pricing and efficiency gains", "Benchmark EBITDA against sector-specific industry data", "Model the EBITDA impact of improving utilisation by just 2–3 percentage points"]
    },
    fin_cash: {
      benchmarks: "Healthy PSFs convert 80–95% of EBITDA to operating cash flow. Cash conversion below 70% typically signals issues with debtor management, over-investment, or poor billing discipline. Acquirers closely examine working capital cycles — the best firms maintain debtor days below 45 and bill promptly upon milestone completion.",
      caseStudy: "A consulting firm with £2M EBITDA was converting only 55% to cash (£1.1M) due to 90+ day debtor cycles and retrospective billing. After implementing milestone billing, automated reminders, and 30-day payment terms for new contracts, cash conversion improved to 88% (£1.76M) — an extra £660k annually without winning a single new client.",
      workedExample: {
        situation: "Your average debtor days are 72, you bill monthly in arrears, and approximately 15% of invoices are queried or disputed by clients.",
        rating: "Foundational (Level 1)",
        rationale: "72 debtor days is significantly above the 45-day target, and a 15% dispute rate indicates billing process issues. Combined with retrospective billing, cash conversion is likely below 70%. Moving to Evolving requires reducing debtor days below 60 and dispute rates below 8%."
      },
      improvementTips: ["Switch from retrospective to milestone-based or advance billing where contracts allow", "Implement automated payment reminders at 7, 14, and 28 days", "Review and resolve the root causes of invoice disputes", "Set a firm-wide target of <50 debtor days and track monthly"]
    },
    fin_quality: {
      benchmarks: "Acquirers assess revenue quality through four lenses: recurring vs project-based (target >30% recurring), client diversification (no client >15%), contract visibility (>60% of next quarter’s revenue contracted), and organic vs acquisition-driven growth. High-quality revenue is predictable, diversified, and generated through systematic client relationships rather than one-off transactions.",
      caseStudy: "A £20M firm had impressive top-line growth but poor revenue quality: 40% came from one client, 85% was project-based with no retainers, and revenue visibility beyond 60 days was minimal. A competing £16M firm with 35% recurring revenue, no client above 12%, and 75% next-quarter visibility received a higher absolute valuation despite smaller size.",
      workedExample: {
        situation: "Your firm has 15% recurring revenue (retainers), 70% repeat clients but on a project-by-project basis, and your largest client represents 22% of revenue.",
        rating: "Evolving (Level 2)",
        rationale: "Some positive signals (70% repeat clients) but structural weaknesses: recurring revenue is below 30%, top-client concentration exceeds 15%, and the repeat business is not contractually committed. To reach Optimised, convert repeat relationships into retainer agreements and diversify beyond the dominant client."
      },
      improvementTips: ["Identify top 10 repeat clients and propose retainer or framework agreements", "Set a strategic goal to reduce largest-client share by 5% annually", "Create a revenue quality dashboard tracking recurring %, concentration, and visibility", "Develop subscription or managed-service offerings to increase predictable revenue"]
    },
    fin_rate: {
      benchmarks: "Blended rate cards in M&A-ready PSFs typically show annual increases of 3–5% and clear differentiation between seniority levels. The spread between junior and senior rates should be at least 2.5x. Firms that demonstrate pricing power (ability to raise rates without losing clients) are valued significantly higher. Rate realisation (actual vs list rate) should exceed 90%.",
      caseStudy: "A firm with £200–£600/day rates across all levels found that their effective blended rate had not increased in three years despite inflation. By restructuring their rate card with clear seniority tiers, introducing value-pricing for IP-led engagements, and training partners on rate negotiation, average realised rates increased 18% over two years with no client losses.",
      workedExample: {
        situation: "Your rate card has not been updated in 2 years. Partners occasionally discount by 20–30% to win competitive bids. Rate realisation is approximately 82%.",
        rating: "Foundational (Level 1)",
        rationale: "A stale rate card, heavy discounting, and 82% realisation indicate weak pricing discipline. Acquirers will see this as margin upside potential but also a risk signal. To reach Evolving, update rates annually, cap discounting authority, and target >90% realisation."
      },
      improvementTips: ["Review and update rate cards annually with 3–5% increases", "Implement a discount approval process — require MD sign-off for >10% discounts", "Track rate realisation monthly and set a firm-wide target of >90%", "Introduce value-based pricing alternatives for advisory engagements"]
    },
    fin_revfte: {
      benchmarks: "Top-quartile PSFs achieve revenue per FTE of £130–180k (industry research suggests $199k average across large global samples). Revenue per head is a primary efficiency metric in M&A due diligence — it captures the combined effect of pricing power, utilisation, and delivery leverage. Consistent improvement over 3+ years is more valued than a single high figure.",
      caseStudy: "A 90-person consulting firm had revenue per FTE of £95k — below the £130k M&A-ready threshold. Analysis revealed two issues: utilisation at 62% and average rates 15% below market. By improving utilisation to 73% through better resource planning and raising rates by 10% over 18 months, revenue per FTE reached £138k without adding headcount — adding £3.9M to top-line revenue.",
      workedExample: {
        situation: "Your firm has 80 FTEs generating £8.5M revenue, giving revenue per FTE of £106k. Your utilisation rate is 68% and your blended rate is competitive.",
        rating: "Evolving (Level 2)",
        rationale: "£106k per FTE is above Foundational but below the £130k target. The 68% utilisation suggests the primary lever for improvement is operational efficiency rather than pricing. Improving utilisation to 75% would lift revenue per FTE to approximately £117k, and targeted rate increases could push it above £130k."
      },
      improvementTips: ["Track revenue per FTE monthly as a board-level KPI", "Decompose into utilisation x rate x leverage to identify the weakest factor", "Benchmark against published industry data for your sector", "Set a 3-year target trajectory with annual milestones"]
    },
    fin_overhead: {
      benchmarks: "The industry average overhead ratio for PSFs is approximately 30% (based on industry benchmarking data). However, this is the average — not the M&A-ready target. Top-quartile firms achieve overheads below 25% of revenue, enabled by integrated technology stacks (PSA, CRM, HCM), lean administration, and efficient office strategies. Overhead ratio directly impacts EBITDA — a 5-point reduction flows straight to the bottom line.",
      caseStudy: "A 120-person consultancy had 38% overheads driven by expensive city-centre offices, a large HR team relative to headcount, and fragmented technology (7 separate systems with manual data entry between them). After consolidating to a single PSA platform, moving to a hybrid office model, and automating expense management, overheads dropped to 26% over two years — adding £1.4M to annual EBITDA.",
      workedExample: {
        situation: "Your overheads are 32% of revenue. The largest components are office costs (10%), non-billable staff (12%), and technology/tools (6%). You have not formally benchmarked against peers.",
        rating: "Evolving (Level 2)",
        rationale: "32% is close to industry average but above the 25% M&A-ready target. The non-billable staff ratio of 12% warrants examination — M&A-ready firms typically achieve 8–10%. Technology spend at 6% may indicate fragmentation. To reach Optimised, target office costs below 7%, non-billable staff below 10%, and consolidate technology."
      },
      improvementTips: ["Break overheads into categories and benchmark each against industry data", "Audit non-billable headcount ratio — target below 10% of total staff", "Consolidate technology platforms to reduce licence and integration costs", "Review office strategy — hybrid models can reduce property costs by 30–40%"]
    },
    ppl_talent: {
      benchmarks: "M&A-ready firms have structured competency frameworks covering 100% of roles, with documented career paths from entry to partner level. Training investment should exceed 3% of revenue (top firms invest 5%+). Skill gap analysis should be conducted annually, with >80% of identified gaps addressed through targeted development within 12 months.",
      caseStudy: "A 90-person consultancy had no competency framework and promoted based on tenure rather than capability. After implementing a skills matrix, creating learning pathways, and tying promotion to demonstrated competence, they saw a 40% increase in internal promotion rates and a 25% reduction in mis-hires within two years.",
      workedExample: {
        situation: "Your firm has informal mentoring but no documented competency framework. Training is ad-hoc and budget-dependent. Promotions are decided by partners in an annual closed-door meeting.",
        rating: "Foundational (Level 1)",
        rationale: "The absence of a structured competency framework and transparent promotion criteria is a red flag for acquirers. It signals key-person dependency and makes talent assessment during due diligence difficult. To reach Evolving, document role competencies and create visible career pathways."
      },
      improvementTips: ["Create a competency matrix mapping skills to roles at each seniority level", "Establish a dedicated L&D budget of at least 3% of revenue", "Implement transparent promotion criteria linked to competency achievement", "Conduct annual skills gap analysis and create targeted development plans"]
    },
    ppl_exp: {
      benchmarks: "Leading PSFs measure employee experience through regular pulse surveys (quarterly or more frequent) with participation rates above 80% and engagement scores above 75% favourable. Glassdoor ratings above 4.0 and eNPS above +20 are considered strong. The correlation between employee engagement and client satisfaction is well-documented — firms in the top quartile for engagement outperform on client retention by 18%.",
      caseStudy: "A consulting firm with declining engagement scores (falling from 72% to 61% over two years) saw a corresponding drop in client NPS from 55 to 38. After investing in management training, flexible working, and a wellbeing programme, engagement recovered to 78% over 18 months — and client NPS rebounded to 52.",
      workedExample: {
        situation: "You run an annual engagement survey with 65% participation. Results show 68% favourable overall, but the question on career development scores only 45% favourable. You have no action plan from last year’s results.",
        rating: "Evolving (Level 2)",
        rationale: "Having a survey is positive, but 65% participation is below the 80% target, and the lack of follow-up action undermines credibility. The career development score is a specific risk flag. To reach Optimised, increase survey frequency to quarterly, drive participation above 80%, and visibly act on results."
      },
      improvementTips: ["Switch to quarterly pulse surveys with 5–8 focused questions", "Share results transparently and publish an action plan within 2 weeks", "Address the lowest-scoring area with a visible, resourced initiative", "Track the engagement-to-retention correlation to build the business case"]
    },
    ppl_recruit: {
      benchmarks: "Top PSFs maintain time-to-hire below 45 days, offer acceptance rates above 85%, and first-year retention above 80%. Cost-per-hire should be tracked and benchmarked (typically £5–15k depending on seniority). Mature firms have a structured employer brand, active talent pipelines for critical roles, and use data-driven assessment methods with measured quality-of-hire metrics.",
      caseStudy: "A technology consulting firm struggling with 60-day average time-to-hire and 65% offer acceptance was losing candidates to competitors. By building a talent community, streamlining their interview process from 5 stages to 3, and investing in employer branding on LinkedIn, they reduced time-to-hire to 38 days and increased acceptance to 88%.",
      workedExample: {
        situation: "Your firm relies primarily on recruitment agencies (80% of hires), has no employer brand strategy, and your interview process takes 4–6 weeks with 5 interview stages.",
        rating: "Foundational (Level 1)",
        rationale: "Heavy agency dependency is costly (typically 20–25% of salary) and signals weak employer brand. A 5-stage process is excessive and loses candidates. To reach Evolving, build direct sourcing capability, streamline to 3 stages, and develop an employer value proposition."
      },
      improvementTips: ["Set a target to reduce agency dependency to <50% of hires within 12 months", "Streamline the interview process to 3 stages maximum with a 3-week target", "Invest in employer branding — employee stories, Glassdoor management, LinkedIn presence", "Build a talent pipeline by maintaining relationships with strong candidates"]
    },
    ppl_churn: {
      benchmarks: "Voluntary turnover in healthy PSFs should be below 12% annually, with involuntary (managed) turnover of 5–8%. Total turnover above 20% is a significant M&A risk flag. Regrettable attrition (losing people you wanted to keep) should be tracked separately and kept below 8%. The cost of replacing a consultant is typically 1–2x their annual salary when accounting for lost productivity, recruitment, and training.",
      caseStudy: "A consulting firm with 28% annual turnover was spending over £800k annually on replacement recruitment. Exit interview analysis revealed that 60% of leavers cited lack of career progression as their primary reason. After implementing structured career paths and transparent promotion criteria, voluntary turnover dropped to 14% within 18 months, saving £450k in recruitment costs.",
      workedExample: {
        situation: "Your voluntary turnover is 16% and you don’t track regrettable vs non-regrettable attrition. Exit interviews are conducted for only about half of departures.",
        rating: "Evolving (Level 2)",
        rationale: "16% voluntary turnover exceeds the 12% target but is not critical. The lack of regrettable/non-regrettable distinction means you cannot prioritise retention efforts. Inconsistent exit interviews miss valuable data. To improve, systematise exit interviews and begin tracking attrition by type and cause."
      },
      improvementTips: ["Conduct exit interviews for 100% of voluntary leavers using a consistent framework", "Distinguish between regrettable and non-regrettable attrition in reporting", "Analyse turnover by tenure, level, and department to identify patterns", "Calculate the true cost of turnover to build the business case for retention investment"]
    },
    ppl_wf: {
      benchmarks: "Mature PSFs maintain a balanced workforce pyramid with a leverage ratio of 3–4:1 (junior to senior). The proportion of staff on permanent contracts should exceed 70%, with contractor usage strategic rather than structural. Diversity metrics increasingly matter in M&A — firms with gender-balanced leadership teams (>30% female partners) outperform on innovation and client satisfaction metrics.",
      caseStudy: "An engineering consultancy with a top-heavy structure (1.5:1 junior to senior ratio) was struggling with margin pressure because senior staff were doing work that juniors could handle. By restructuring the pyramid over two years — hiring 20 graduates and promoting mid-level staff into management — they improved the ratio to 2.8:1 and increased gross margin by 8 percentage points.",
      workedExample: {
        situation: "Your firm has a 2:1 junior to senior ratio, 25% contractors, and limited diversity data. The partnership is 15% female.",
        rating: "Evolving (Level 2)",
        rationale: "The leverage ratio is below the 3:1 target, meaning seniors are likely doing lower-value work. Contractor usage at 25% is at the upper end of acceptable. Limited diversity data signals that DE&I is not yet a strategic priority. To improve, develop a workforce plan that builds the pyramid base and sets measurable diversity targets."
      },
      improvementTips: ["Create a 3-year workforce plan targeting a 3:1 leverage ratio", "Develop a strategic contractor vs permanent framework — define which roles should be permanent", "Begin tracking diversity metrics across seniority levels and set improvement targets", "Model the margin impact of improving leverage ratios to build the business case"]
    },
    ppl_training: {
      benchmarks: "Top-quartile PSFs invest 2.5–5% of revenue in training and development, equating to 6–8 days per employee per year. The ATD benchmark suggests 40–50 hours annually as healthy for knowledge workers. Firms with higher training investment show significantly lower voluntary attrition (industry data shows approximately 11.7% average when L&D is prioritised vs 15%+ when it is not). Training ROI should be tracked through retention, promotion rates, and capability assessments.",
      caseStudy: "A 75-person consulting firm spent less than 0.5% of revenue on training, relying on 'learning on the job.' Annual attrition hit 28%, with exit interviews consistently citing lack of development. After implementing a structured L&D programme at 3% of revenue (including external certifications, internal mentoring, and quarterly skills workshops), attrition dropped to 14% within 18 months — saving approximately £400k in annual recruitment costs.",
      workedExample: {
        situation: "Your firm invests approximately 1.5% of revenue in training. Most development is informal (shadowing, on-the-job). You offer an annual external training budget of £500 per person but uptake is below 40%.",
        rating: "Evolving (Level 2)",
        rationale: "1.5% investment is above Foundational but below the 2.5% M&A-ready target. The low uptake of the training budget suggests it is not well-promoted or the allocation is too small to cover meaningful courses. To reach Optimised, increase investment to 2.5%+, create structured learning pathways tied to career progression, and track completion and impact."
      },
      improvementTips: ["Set a minimum training budget of 2.5% of revenue and track it as a board-level KPI", "Create structured learning pathways aligned to your competency framework", "Track training ROI through retention rates, promotion rates, and skill assessment scores", "Offer a mix of formal courses, mentoring, and on-the-job development opportunities"]
    },
    ppl_equity: {
      benchmarks: "M&A-ready PSFs distribute equity among 15–25% of key staff (Schwab RIA 2025 benchmark shows 33% of staff as equity owners in advisory firms). Founder-only ownership triggers key-person discounts of 20–40% on valuation. The critical threshold is ensuring no single individual holds more than 50% of equity. Equity should be tied to retention agreements (typically 2–4 year vesting) to protect value through M&A transitions.",
      caseStudy: "A founder-owned 60-person consultancy valued at 6x EBITDA (£4.2M) was told by two potential acquirers that the concentration of ownership was a deal-breaker. The founder implemented an equity scheme distributing 25% of shares among 8 senior leaders over 3 years with performance-based vesting. When the firm went to market again, it achieved 8.2x EBITDA (£5.7M) — a 36% premium attributed directly to reduced key-person risk.",
      workedExample: {
        situation: "Your founding partners hold 95% of equity between them. Two senior managers have 2.5% each but no formal retention agreements. No other staff have ownership stakes.",
        rating: "Foundational (Level 1)",
        rationale: "95% founder concentration creates severe key-person risk that acquirers will price in as a significant discount. The 2.5% stakes without retention agreements offer minimal protection. To reach Evolving, develop an equity distribution plan targeting 10–15% of staff with vesting schedules aligned to business plan milestones."
      },
      improvementTips: ["Develop a formal equity participation plan with clear eligibility criteria", "Target distribution to 15%+ of staff across multiple levels (not just the leadership team)", "Implement 3–4 year vesting schedules tied to retention and performance", "Ensure no single individual holds more than 50% of total equity"]
    },
    srv_prop: {
      benchmarks: "M&A-ready firms have clearly articulated service propositions that can be explained in under 60 seconds and differentiated from competitors. The proposition should be validated through client feedback (>80% of clients able to articulate what makes the firm different). Market positioning should be documented and reviewed annually against competitive intelligence.",
      caseStudy: "A generalist consultancy struggled to articulate their differentiation beyond ‘our people.’ After conducting a positioning study with 30 clients and 15 prospects, they discovered their real strength was in post-merger integration for mid-market firms. Repositioning around this niche increased average project value by 45% and win rates by 20 percentage points.",
      workedExample: {
        situation: "Your website describes your firm as offering ‘end-to-end consulting solutions across multiple industries.’ Partners describe the firm’s value proposition differently depending on who is asked.",
        rating: "Foundational (Level 1)",
        rationale: "A generic, undifferentiated proposition is a significant weakness. If partners cannot consistently articulate the value, clients and acquirers won’t understand it either. To reach Evolving, conduct competitive analysis, gather client feedback on perceived strengths, and craft a focused proposition."
      },
      improvementTips: ["Interview 10–15 key clients to understand why they chose you over alternatives", "Conduct competitive analysis of 5–10 direct competitors’ positioning", "Draft a proposition statement and test it with clients and prospects", "Ensure all partners can consistently articulate the proposition"]
    },
    srv_innov: {
      benchmarks: "High-growth PSFs invest 3–5% of revenue in service innovation, launching at least one new service offering annually. Innovation should be systematic rather than ad-hoc, with a documented pipeline of service ideas, a testing/validation process, and metrics for new service uptake. Firms that derive >20% of revenue from services launched in the last 3 years demonstrate strong innovation capability.",
      caseStudy: "A management consultancy that had not launched a new service in five years found that 80% of revenue came from offerings designed over a decade ago. After establishing a quarterly innovation review, allocating 4% of revenue to service R&D, and launching a data analytics practice, new services contributed 18% of revenue within two years and attracted a new segment of clients.",
      workedExample: {
        situation: "Your firm launched one new service area 18 months ago after a partner noticed a market trend. There is no formal innovation process and no budget allocated to service development.",
        rating: "Evolving (Level 2)",
        rationale: "The firm has demonstrated some innovation capability, but it was reactive rather than systematic. Without a formal process and budget, innovation depends on individual initiative. To reach Optimised, establish a structured innovation pipeline with dedicated investment and regular review cycles."
      },
      improvementTips: ["Allocate a specific innovation budget (start with 2–3% of revenue)", "Create a quarterly innovation review with a pipeline of service ideas", "Test new services with 2–3 pilot clients before full launch", "Track the percentage of revenue from services launched in the last 3 years"]
    },
    srv_ip: {
      benchmarks: "Proprietary IP — methodologies, frameworks, tools, and diagnostic instruments — is a key M&A value driver. Acquirers value IP because it creates barriers to entry, enables scalable delivery, and reduces dependency on individual consultants. Target >3 documented proprietary methodologies, with IP contributing to >20% of revenue through licensed tools, productised services, or IP-enabled engagements.",
      caseStudy: "A strategy consultancy had deep expertise but everything lived in partners’ heads. Over 18 months they codified their approach into a branded diagnostic tool, a delivery framework, and a benchmarking database. The IP portfolio was independently valued at £2.1M during the subsequent acquisition — adding approximately 1x to the EBITDA multiple.",
      workedExample: {
        situation: "Your firm has informal methodologies that vary by partner. One team has created a client-facing diagnostic tool, but it’s not branded or documented as firm IP.",
        rating: "Evolving (Level 2)",
        rationale: "There is emerging IP but it’s not systematically captured, branded, or protected. The diagnostic tool shows promise but needs formalisation. To reach Optimised, document and brand key methodologies, register any protectable IP, and build service offerings around proprietary tools."
      },
      improvementTips: ["Audit existing methodologies and frameworks across all teams", "Select 2–3 strongest approaches to codify, brand, and document formally", "Consider IP protection (copyright, trademark) for key branded methodologies", "Build service packages that incorporate proprietary tools as differentiators"]
    },
    srv_size: {
      benchmarks: "Average project size is a key efficiency metric. Larger projects reduce the overhead of business development and onboarding per revenue pound. M&A-ready PSFs typically achieve average project sizes at least 2x their industry median. For consulting firms, this means average engagements of £75–150k+. The ratio of project size to cost-of-sale should be monitored — target >15:1.",
      caseStudy: "A firm with an average project size of £28k was spending disproportionate effort on business development and project setup. By introducing diagnostic-to-engagement conversion pathways and multi-phase project structures, average project size grew to £65k within 18 months. Revenue per BD hour increased by 120%, and partners spent less time selling and more time delivering.",
      workedExample: {
        situation: "Your average project size is £40k. Roughly 30% of projects are under £15k (quick advisory jobs) and 10% are over £100k.",
        rating: "Evolving (Level 2)",
        rationale: "£40k is moderate but the long tail of small projects drags down efficiency. The 30% of sub-£15k work likely consumes disproportionate sales and admin effort. To improve, consider minimum project thresholds and design engagement models that naturally expand smaller entry points into larger programmes."
      },
      improvementTips: ["Set a minimum project threshold (e.g., £20k) and decline or refer smaller work", "Design ‘land and expand’ engagement models: diagnostic → pilot → full programme", "Track cost-of-sale per project and identify which project sizes are most profitable", "Bundle related small projects into programme-level agreements with clients"]
    },
    srv_price: {
      benchmarks: "Pricing sophistication is a strong signal of commercial maturity. M&A-ready firms use value-based pricing on >40% of engagements, achieve >90% rate realisation, and review pricing strategy annually. The shift from time-and-materials to outcomes-based pricing typically improves margins by 15–25% on affected engagements while simultaneously improving client satisfaction.",
      caseStudy: "A consulting firm billing 100% on day rates introduced value-based pricing for their diagnostic and strategy engagements. By pricing based on the value of the client outcome rather than consultant days, average margins on these engagements increased from 35% to 52%. Within two years, 45% of revenue used value-based pricing models.",
      workedExample: {
        situation: "Your firm bills 90% on time-and-materials, with a standard rate card. Occasionally partners offer fixed-fee quotes but without a structured approach to scoping or risk management.",
        rating: "Foundational (Level 1)",
        rationale: "Near-complete reliance on T&M billing limits margin potential and exposes the firm to utilisation risk. The ad-hoc fixed-fee quoting without structured scoping is actually riskier than pure T&M. To reach Evolving, develop a value-based pricing capability for advisory work with proper scoping methodology."
      },
      improvementTips: ["Identify 2–3 service offerings best suited for value-based pricing (typically advisory/diagnostic)", "Develop a scoping methodology that quantifies client value outcomes", "Train partners on value conversation techniques and pricing confidence", "Pilot value-based pricing on 5–10 engagements and measure margin impact"]
    },
    srv_portfolio: {
      benchmarks: "M&A-ready PSFs have structured service portfolios with 3+ material service lines, where no single line exceeds 40% of total revenue. The portfolio should include clear entry-level services (lower risk, lower value) that create upsell pathways to core and strategic offerings. Firms with well-architected portfolios achieve 25%+ higher average project values because clients naturally progress through the service tiers.",
      caseStudy: "A technology consultancy had 75% of revenue from a single service line (cloud migration). When the market matured and competition intensified, margins fell from 45% to 28%. After designing a structured portfolio with cloud assessments (entry), migration (core), and managed services (strategic), they reduced single-line dependence to 45% and created a natural client progression that increased average engagement length from 4 to 14 months.",
      workedExample: {
        situation: "Your firm has two main service lines: advisory (65% of revenue) and implementation (35%). There is no structured entry-level offering, and upsell from implementation to advisory is rare.",
        rating: "Evolving (Level 2)",
        rationale: "Having two service lines is a start, but 65% concentration in advisory is above the 40% threshold. The lack of entry-level services limits pipeline development, and the poor cross-sell between lines suggests they operate as silos. To reach Optimised, design an entry-level diagnostic service, create formal pathways between lines, and reduce advisory dependence below 50%."
      },
      improvementTips: ["Map your current service portfolio into entry, core, and strategic tiers", "Design low-barrier entry services (diagnostics, assessments) that create upsell pathways", "Set targets for each service line as a percentage of total revenue", "Track client progression through service tiers and measure average engagement length"]
    },
    vis_market: {
      benchmarks: "M&A-ready firms have a clearly defined target market with demonstrable market share. The ideal is a niche position with >15% share in a defined segment, supported by evidence of market understanding (published market analysis, client win data by segment, competitive positioning maps). Firms targeting a total addressable market 10–50x their current revenue have credible growth headroom.",
      caseStudy: "A £12M generalist consultancy attempted to serve all industries and all geographies. After market analysis revealed that 65% of their most profitable work came from financial services clients in the South East, they repositioned as financial services specialists. Within two years, revenue grew to £18M with better margins, as the focused positioning attracted higher-quality clients.",
      workedExample: {
        situation: "Your firm serves ‘all industries’ but analysis shows 40% of revenue comes from healthcare and 25% from financial services. You have no published market analysis for either sector.",
        rating: "Evolving (Level 2)",
        rationale: "The data shows natural sector concentrations, but they haven’t been consciously developed. Without market analysis, the firm cannot articulate market size, share, or growth potential to acquirers. To reach Optimised, commit to 1–2 target sectors, develop market intelligence, and build sector-specific propositions."
      },
      improvementTips: ["Analyse revenue by sector over 3 years to identify natural strengths", "Commission or create market sizing for your top 2 sectors", "Develop sector-specific case studies, references, and propositions", "Set measurable market share targets and track progress annually"]
    },
    vis_comp: {
      benchmarks: "Mature firms maintain documented competitive intelligence covering their top 5–10 competitors, updated at least annually. This should include pricing positioning, service overlap, win/loss analysis, and differentiation assessment. Barriers to entry (specialisation, IP, relationships, regulatory expertise) should be identified and deliberately strengthened.",
      caseStudy: "A firm that had never formally analysed competitors discovered through a structured competitive review that three rivals had launched similar services at 20% lower price points. This intelligence enabled them to reposition their offering around quality outcomes data (which competitors lacked), protecting margins while maintaining win rates.",
      workedExample: {
        situation: "Partners have anecdotal knowledge of competitors but there is no documented competitive analysis. You lose 30% of competitive pitches but don’t systematically analyse why.",
        rating: "Foundational (Level 1)",
        rationale: "Without competitive intelligence, strategic decisions are based on intuition. A 30% competitive win rate is below the 35–50% benchmark, and without win/loss analysis you cannot improve it. To reach Evolving, implement structured win/loss reviews and create a competitive intelligence database."
      },
      improvementTips: ["Implement win/loss analysis for all competitive bids", "Create competitor profiles for your top 5–10 competitors", "Identify and document your barriers to entry and deliberately invest in strengthening them", "Review competitive positioning annually and adjust strategy accordingly"]
    },
    vis_align: {
      benchmarks: "Strategic alignment means every team member understands the firm’s direction and their role in achieving it. Top firms score >80% on internal surveys asking ‘I understand the firm’s strategy’ and ‘I know how my work contributes to strategic goals.’ Strategic objectives should cascade from firm-wide goals to team and individual KPIs, reviewed quarterly.",
      caseStudy: "A 70-person firm found that only 35% of staff could articulate the firm’s strategy. After quarterly all-hands strategy sessions, visual strategy maps in every office, and individual goal-setting aligned to strategic priorities, the understanding score rose to 82%. Partners noted that teams began self-organising around strategic objectives.",
      workedExample: {
        situation: "Your firm has a strategy document but it was last updated two years ago. Partners reference it occasionally. Most consultants would struggle to name the firm’s top three strategic priorities.",
        rating: "Evolving (Level 2)",
        rationale: "Having a strategy document is positive, but a two-year-old plan that isn’t actively communicated provides little strategic value. Strategy should be a living process, not a static document. To improve, refresh the plan, communicate it actively, and cascade objectives to team level."
      },
      improvementTips: ["Refresh the strategic plan annually with input from the leadership team", "Hold quarterly all-hands sessions to communicate strategic progress", "Create team-level objectives that visibly link to firm-wide strategic goals", "Measure strategic awareness through pulse surveys quarterly"]
    },
    vis_plan: {
      benchmarks: "Best-practice PSFs operate with 3–5 year strategic plans, reviewed quarterly, with annual budgets and rolling forecasts. The plan should include market analysis, competitive positioning, financial targets, investment priorities, and measurable milestones. Board or leadership team review should occur quarterly with documented decisions and action tracking.",
      caseStudy: "A firm operating without a formal plan beyond annual budgets found themselves making reactive decisions. After creating a 3-year plan with quarterly reviews, they made three significant strategic investments (a new practice area, an acquisition, and a technology platform) in a coordinated sequence rather than competing for the same resources simultaneously.",
      workedExample: {
        situation: "Your firm creates an annual budget but has no multi-year plan. Strategic decisions are made ad-hoc in monthly partner meetings without a structured framework.",
        rating: "Foundational (Level 1)",
        rationale: "An annual budget is not a strategic plan. Without a multi-year framework, the firm cannot make sequenced investments or demonstrate growth intentionality to acquirers. Due diligence teams specifically look for documented planning rigour. To reach Evolving, create a 3-year strategic plan with quarterly review cadence."
      },
      improvementTips: ["Facilitate a strategy offsite to create a 3-year plan with measurable goals", "Establish a quarterly strategy review rhythm with documented outcomes", "Separate strategic discussion from operational meetings", "Track strategic milestones alongside financial performance"]
    },
    vis_esg: {
      benchmarks: "ESG is increasingly material in M&A. Acquirers expect at minimum a published ESG policy, measurable environmental targets, and evidence of social responsibility. Progressive firms have carbon reduction plans, diversity targets, and community engagement programmes. B Corp certification or UN SDG alignment demonstrate mature ESG integration. ESG due diligence is now standard in >60% of mid-market transactions.",
      caseStudy: "A consulting firm that had dismissed ESG as ‘not relevant for services firms’ nearly lost an acquisition deal when the buyer’s ESG due diligence found no policy, no carbon measurement, and no diversity data. A 6-month scramble to create an ESG framework delayed the transaction. In contrast, a competitor with established ESG credentials completed their deal in half the time.",
      workedExample: {
        situation: "Your firm has an informal commitment to sustainability but no published policy. You measure carbon from office energy but not business travel. Diversity data is collected but not reported.",
        rating: "Evolving (Level 2)",
        rationale: "Some ESG activity exists but it’s neither systematic nor transparent. Acquirers will look for published commitments and measurable progress. To reach Optimised, publish an ESG policy, expand carbon measurement to include travel, set targets, and report annually."
      },
      improvementTips: ["Publish a formal ESG policy with measurable targets", "Measure full carbon footprint including business travel (Scope 1, 2, and key Scope 3)", "Set and publish diversity targets for leadership and the wider firm", "Consider B Corp assessment as a structured framework for ESG maturity"]
    },
    sal_pipe: {
      benchmarks: "Pipeline coverage of 3–4x the revenue target is considered healthy for PSFs. Pipeline should be tracked in a CRM with defined stages, probability weightings, and conversion metrics. Visibility beyond 90 days should cover >60% of the next quarter’s target. Mature firms segment pipeline by new vs existing client, service line, and probability band.",
      caseStudy: "A firm with no CRM was shocked to discover during acquisition due diligence that they had only 1.2x pipeline coverage and less than 40% visibility for the next quarter. The acquirer reduced their offer by 15% citing revenue unpredictability. A subsequent investment in pipeline management took 12 months but improved coverage to 3.5x and visibility to 72%.",
      workedExample: {
        situation: "You have a CRM but pipeline data is inconsistently maintained. Estimated pipeline coverage is approximately 2x based on the data that exists. Pipeline reviews happen monthly but attendance is sporadic.",
        rating: "Evolving (Level 2)",
        rationale: "Having a CRM is positive but inconsistent usage undermines its value. 2x coverage is below the 3x minimum. Sporadic pipeline reviews mean the data isn’t driving decisions. To improve, mandate CRM usage, implement weekly pipeline reviews, and set coverage targets by service line."
      },
      improvementTips: ["Mandate CRM updates as a non-negotiable for all BD-active staff", "Implement weekly 30-minute pipeline reviews with standardised agenda", "Define pipeline stages with clear entry/exit criteria and probability weightings", "Set pipeline coverage targets by quarter and service line"]
    },
    sal_conv: {
      benchmarks: "Qualified opportunity win rates should be 35–50% for well-positioned PSFs. Track conversion at each pipeline stage to identify where opportunities are lost. Proposal-to-win ratios should exceed 40%. Importantly, measure ‘no decision’ outcomes separately from competitive losses — a high no-decision rate (>25%) indicates qualification issues rather than competitive weakness.",
      caseStudy: "A firm with a 25% overall win rate implemented structured deal qualification using the BANT framework (Budget, Authority, Need, Timeline). By declining to pursue 30% of opportunities that failed qualification, their win rate on pursued opportunities jumped to 44% while reducing wasted BD effort. Net revenue from new business actually increased despite pursuing fewer opportunities.",
      workedExample: {
        situation: "Your win rate is approximately 30% but you don’t track pipeline stages or no-decision outcomes. The team pursues most opportunities that come in without formal qualification.",
        rating: "Evolving (Level 2)",
        rationale: "30% win rate is below the 35% minimum and the lack of stage tracking means you cannot diagnose where opportunities are lost. Without qualification, the team is likely wasting effort on low-probability pursuits. To improve, implement deal qualification criteria and stage-by-stage conversion tracking."
      },
      improvementTips: ["Implement a deal qualification framework (e.g., BANT or MEDDIC)", "Track conversion rates at each pipeline stage to identify the biggest drop-off points", "Distinguish between competitive losses and no-decision outcomes in your analysis", "Set a target to decline at least 20% of unqualified opportunities"]
    },
    sal_mgmt: {
      benchmarks: "Mature sales management includes a named BD/sales leader (even if part-time), weekly pipeline reviews, monthly win/loss analysis, and quarterly sales strategy reviews. Key metrics should be dashboarded: pipeline coverage, conversion rates, average deal size, sales cycle length, and revenue by source (new/existing, inbound/outbound). CRM adoption should be >90% across BD-active staff.",
      caseStudy: "A partner-led firm where each partner managed their own pipeline independently appointed a Head of Business Development. Within a year, pipeline data was centralised, cross-selling opportunities were identified (generating £1.5M in incremental revenue), and the firm could produce accurate quarterly revenue forecasts for the first time.",
      workedExample: {
        situation: "Business development is managed individually by partners. There is no centralised pipeline view, no BD meetings, and no cross-selling coordination between practice areas.",
        rating: "Foundational (Level 1)",
        rationale: "Fragmented, partner-led BD with no coordination is a common pattern in smaller PSFs but is a significant M&A concern. It signals founder-dependency in revenue generation and makes due diligence pipeline assessment very difficult. To reach Evolving, centralise pipeline visibility and implement regular BD meetings."
      },
      improvementTips: ["Appoint a BD leader or coordinator (can be part-time initially)", "Centralise all pipeline data into a single CRM view", "Implement fortnightly cross-practice BD meetings to identify cross-selling opportunities", "Create a BD dashboard with key metrics visible to the leadership team"]
    },
    sal_skills: {
      benchmarks: "PSFs should have documented sales processes for different engagement types, with >70% of BD-active staff trained in consultative selling techniques. Proposal quality should be measured through win rate tracking and client feedback. Response time for RFPs should be under 48 hours for an initial acknowledgment and 2–3 weeks for a full proposal.",
      caseStudy: "A technically excellent consultancy was losing bids because their proposals were dense, technical documents that failed to connect with client decision-makers. After training the team in storytelling-based proposal writing and consultative selling, their proposal win rate improved from 28% to 42% in six months — without changing their pricing.",
      workedExample: {
        situation: "Your firm has no formal sales training. Partners sell based on personal style and relationships. Proposals follow no standard template and vary widely in quality.",
        rating: "Foundational (Level 1)",
        rationale: "Without sales process or training, BD capability is entirely partner-dependent and inconsistent. Variable proposal quality directly impacts win rates. To reach Evolving, create proposal templates, implement basic sales training, and document a standard sales process."
      },
      improvementTips: ["Create proposal templates with consistent structure and branding", "Invest in consultative selling training for all BD-active staff", "Document a standard sales process from initial enquiry to contract signature", "Implement proposal reviews with feedback to continuously improve quality"]
    },
    sal_crosssell: {
      benchmarks: "M&A-ready PSFs generate 25–35% of annual revenue from cross-selling additional services to existing clients. The average number of service lines per client should be 2.5+ for top-20 accounts. Expansion revenue is typically the highest-margin revenue source (30–40% lower cost of sale than new business). Track account plan coverage — top-quartile firms have formal account plans for clients representing 80%+ of revenue.",
      caseStudy: "A 100-person consultancy with £15M revenue had only 12% of revenue from cross-sell — despite having four distinct service lines. After implementing structured quarterly business reviews with the top 20 clients, creating a 'service menu' for account managers, and incentivising cross-introductions between practice leads, cross-sell revenue grew to 28% within two years, adding £2.4M in high-margin revenue.",
      workedExample: {
        situation: "Your top 20 clients average 1.3 service lines each. Cross-sell revenue is approximately 18% of total. Account planning is informal and inconsistent.",
        rating: "Evolving (Level 2)",
        rationale: "18% cross-sell is above Foundational but below the 25% target. The low service-lines-per-client metric (1.3 vs target of 2.5+) indicates significant untapped potential. The lack of formal account plans means cross-sell opportunities are being missed. To reach Optimised, implement formal account plans for all top-20 clients with specific cross-sell targets."
      },
      improvementTips: ["Implement formal account plans for the top 20 clients with specific cross-sell targets", "Create a client service menu and train delivery teams to identify expansion opportunities", "Introduce quarterly business reviews with strategic clients to surface unmet needs", "Track and report cross-sell revenue as a separate KPI alongside new business"]
    },
    cli_conc: {
      benchmarks: "M&A advisors flag concentration risk when any single client exceeds 15-20% of revenue. Best-practice PSFs keep their top client below 10% and top-5 clients below 35%. Acquirers typically apply a revenue-at-risk discount of 1-2x EBITDA for every client representing more than 20% of billings.",
      caseStudy: "A 60-person management consultancy derived 42% of revenue from one government department. When that contract was re-tendered and lost, the firm faced an immediate 40% revenue gap. Over 18 months they rebuilt by targeting three new sectors, eventually reducing top-client dependency to 14% and improving their valuation multiple by 1.5x.",
      workedExample: {
        situation: "Your largest client represents 28% of total revenue, and the top three clients account for 55% of billings.",
        rating: "Foundational (Level 1)",
        rationale: "Significant concentration risk exists with one client above 25% and top-three above 50%. Foundational because the firm is heavily exposed to individual client decisions, which depresses acquirer confidence and valuation multiples."
      },
      improvementTips: ["Set a strategic cap of 20% maximum revenue from any single client and actively pursue new logos to dilute concentration", "Build a client acquisition engine targeting 3-5 new mid-market clients per quarter in adjacent sectors", "Develop recurring revenue streams such as retainers or managed services that spread income across a broader client base", "Create an early-warning dashboard tracking concentration ratios monthly so leadership can intervene before thresholds are breached"]
    },
    cli_long: {
      benchmarks: "Top-quartile professional services firms achieve gross client retention rates of 85-92% annually. Net revenue retention (including expansion) exceeds 105-115% in high-performing firms. Average client tenure of 4+ years signals strong relationship depth. Acquirers value predictable, recurring client relationships as they reduce post-acquisition revenue risk.",
      caseStudy: "A technology consulting firm had client retention of 62% annually with average tenure of 1.8 years. They implemented quarterly business reviews, assigned dedicated client success managers, and introduced a tiered loyalty programme. Within two years, retention climbed to 88%, average tenure reached 3.4 years, and revenue predictability improved dramatically.",
      workedExample: {
        situation: "Your firm retains 78% of clients year-over-year, with average client tenure of 2.5 years. You have some long-standing relationships but also significant annual churn.",
        rating: "Evolving (Level 2)",
        rationale: "Retention is moderate but below the 85%+ benchmark for top-quartile firms. Some loyal clients exist, but the churn rate suggests relationships are project-based rather than deeply embedded, limiting recurring revenue predictability."
      },
      improvementTips: ["Implement structured quarterly business reviews with all key clients to deepen relationships and surface expansion opportunities", "Assign dedicated relationship managers to top-20 clients with formal account development plans", "Track net revenue retention separately from gross retention to measure expansion within existing accounts", "Develop multi-year framework agreements or retainer models that lock in longer engagement periods"]
    },
    cli_size: {
      benchmarks: "High-performing PSFs target average annual client value of 150-300K for mid-market firms, with top-tier consultancies achieving 500K+. Revenue per client should be growing 5-10% annually through scope expansion. Firms with average client values below 50K often struggle with delivery economics and face margin pressure from high client management overhead.",
      caseStudy: "A digital agency had an average client value of 35K with over 200 active clients, creating unsustainable account management overhead. They repositioned toward mid-market enterprise clients, introduced minimum engagement thresholds of 75K, and developed strategic account plans for high-potential clients. Within two years, average client value reached 120K with fewer but more profitable relationships.",
      workedExample: {
        situation: "Your average annual client value is 85K, with a long tail of small engagements under 20K that consume disproportionate management time.",
        rating: "Evolving (Level 2)",
        rationale: "Average client value is moderate but the long tail of small engagements suggests an unfocused client strategy. The firm is evolving beyond taking any work that comes in, but has not yet established minimum engagement thresholds or strategic account targeting."
      },
      improvementTips: ["Establish minimum engagement thresholds and gradually sunset or refer clients below the threshold to partner firms", "Develop strategic account plans for top-20 clients with specific revenue growth targets and cross-sell opportunities", "Create tiered service packages that encourage clients to consolidate more work with your firm rather than splitting across vendors", "Track client lifetime value alongside annual value to identify which client profiles deliver the best long-term economics"]
    },
    cli_part: {
      benchmarks: "Leading PSFs convert 15-25% of their client base into strategic partnerships characterised by multi-year commitments, joint planning, and embedded teams. These strategic accounts typically generate 3-5x the revenue of transactional clients. Firms with formal partner programmes report 20-30% higher net revenue retention than those without.",
      caseStudy: "An HR consulting firm treated all 150 clients identically with no formal partnership tiers. They introduced a Strategic Partner Programme for their top 15 clients, offering dedicated teams, quarterly strategy sessions, and priority access to new service offerings. Partner accounts grew revenue by 35% in the first year while non-partner accounts grew just 4%.",
      workedExample: {
        situation: "You have a handful of close client relationships but no formal partnership structure, tiered service model, or strategic account programme.",
        rating: "Foundational (Level 1)",
        rationale: "While some strong relationships exist organically, the absence of formal structures means partnership depth depends on individual consultants rather than institutional capabilities. This is foundational because strategic value creation with clients is ad hoc rather than systematic."
      },
      improvementTips: ["Design a formal client partnership programme with clear tiers, benefits, and qualification criteria for each level", "Assign executive sponsors to strategic accounts and conduct joint annual planning sessions with client leadership", "Create co-innovation opportunities such as joint research, pilot programmes, or shared IP development with top-tier partners", "Measure partnership health through a balanced scorecard covering revenue, satisfaction, strategic alignment, and relationship breadth"]
    },
    cli_ref: {
      benchmarks: "M&A-ready PSFs have over 75% of active clients willing to serve as references (industry research tracks this at 71.9–76% across surveyed firms). Firms with >90% referenceability have a 38% higher win-to-bid ratio. During M&A due diligence, acquirers will typically request 5–10 client references — firms that struggle to provide these face immediate credibility concerns and potential valuation discounts.",
      caseStudy: "A mid-sized consultancy approaching a sale found that only 40% of their clients would agree to be referenced. The primary issues were inconsistent delivery quality and a lack of ongoing relationship management after project completion. Over 12 months they implemented post-project reviews, a client success programme, and a formal reference request process. Referenceability rose to 82%, and the three case studies they published generated £1.2M in new pipeline.",
      workedExample: {
        situation: "You have 35 active clients. You have 4 published case studies (all over 2 years old) and could confidently offer perhaps 15 clients as references if asked.",
        rating: "Evolving (Level 2)",
        rationale: "At approximately 43% referenceability, this is above Foundational but well below the 75% target. The outdated case studies suggest delivery quality may have changed since they were published. To reach Optimised, refresh case studies annually, implement a post-project reference request process, and build a reference-ready client database."
      },
      improvementTips: ["Build a formal reference programme — request references at project completion when satisfaction is highest", "Maintain a database of reference-ready clients with up-to-date contact information", "Publish at least 4 new case studies per year covering different service lines and sectors", "Prepare a reference pack for M&A due diligence with diverse client profiles"]
    },
    led_team: {
      benchmarks: "Acquirers evaluate leadership teams on depth, complementarity, and retention risk. Best-practice PSFs have a leadership team of 4-7 members covering delivery, sales, finance, and people. Key person dependency where one leader holds more than 40% of client relationships or institutional knowledge is a major red flag. Leadership teams with 3+ years average tenure together signal stability.",
      caseStudy: "A founder-led strategy firm had all major client relationships, pricing decisions, and delivery oversight concentrated in the CEO. When exploring a sale, three potential acquirers walked away citing key-person risk. The firm spent 18 months deliberately distributing responsibilities, promoting two directors to Managing Partner roles, and transitioning client relationships. The eventual sale achieved a 30% higher multiple than the initial offers.",
      workedExample: {
        situation: "Your firm has a capable leadership team of five, but the founder still personally manages the top 8 client relationships and makes all major pricing decisions.",
        rating: "Evolving (Level 2)",
        rationale: "A leadership team exists and has relevant capabilities, but significant key-person dependency remains with the founder controlling critical client and commercial functions. The firm is evolving beyond pure founder-dependency but has not yet achieved the distributed leadership that acquirers seek."
      },
      improvementTips: ["Conduct a key-person dependency audit mapping which leaders hold critical relationships, knowledge, and decision authority", "Create a structured transition plan to distribute client relationships across at least three senior leaders over 12-18 months", "Establish a formal leadership development programme identifying and grooming the next generation of leaders from within", "Implement a leadership scorecard tracking delegation progress, succession readiness, and team decision-making independence"]
    },
    led_deleg: {
      benchmarks: "High-performing PSFs delegate operational decisions to the lowest competent level, with founders and senior leaders spending 60-70% of time on strategic activities rather than operational firefighting. Decision-making authority should be formally documented with clear escalation paths. Firms with strong delegation cultures report 25-40% higher employee engagement scores.",
      caseStudy: "A 45-person engineering consultancy had every project decision escalated to one of two founding partners, creating bottlenecks and burning out senior leadership. They introduced a decision authority matrix defining which decisions could be made at project manager, director, and partner level. Within six months, partner workload dropped 35%, project delivery speed improved 20%, and two high-potential directors stepped up into genuine leadership roles.",
      workedExample: {
        situation: "Most operational and client decisions are made by partners. Project managers have limited authority and frequently escalate routine matters. There is no formal decision authority framework.",
        rating: "Foundational (Level 1)",
        rationale: "The firm operates with a command-and-control style where partners are bottlenecks for most decisions. This is foundational because it limits scalability, creates partner burnout, and signals to acquirers that the business cannot operate independently of its current senior leaders."
      },
      improvementTips: ["Create a formal decision authority matrix defining which decisions are made at each organisational level", "Start with low-risk delegation such as project-level budgeting and scheduling decisions, then progressively expand scope", "Invest in management training for mid-level leaders to build confidence and competence in autonomous decision-making", "Track delegation metrics including escalation frequency, decision turnaround time, and leader time allocation between strategic and operational work"]
    },
    led_gov: {
      benchmarks: "M&A-ready PSFs have formal governance structures including advisory boards or non-executive directors, documented roles and responsibilities, regular board meetings with minutes, and clear succession plans. Firms with independent advisory board members achieve 15-25% higher valuations. Governance maturity is assessed on structure, documentation, independence, and strategic orientation.",
      caseStudy: "A 90-person consulting firm had no formal governance beyond monthly partner meetings with no agenda or minutes. In preparation for a future exit, they established a quarterly advisory board with two independent non-executives, formalised partner meeting agendas and minutes, and created a governance charter. Two years later, the due diligence process was dramatically smoother and faster, and the acquirer cited governance maturity as a key confidence factor.",
      workedExample: {
        situation: "Your firm has informal partner meetings but no advisory board, no documented governance charter, and no independent outside perspective on strategic decisions.",
        rating: "Foundational (Level 1)",
        rationale: "Governance is informal and undocumented, with no independent oversight or structured decision-making processes. This is foundational because acquirers see poor governance as a risk indicator for post-acquisition integration challenges and hidden liabilities."
      },
      improvementTips: ["Establish a formal advisory board with at least one independent non-executive who brings M&A or industry expertise", "Document a governance charter defining meeting cadence, decision-making processes, voting rights, and escalation procedures", "Implement structured board reporting with standardised financial dashboards, KPI tracking, and strategic initiative updates", "Create a succession plan for all key leadership roles and review it annually with the advisory board"]
    },
    led_risk: {
      benchmarks: "M&A-ready PSFs maintain a formal risk register reviewed quarterly by the board, with assigned risk owners and documented mitigation plans. Business continuity plans should be tested annually. Cyber security and data protection frameworks should be documented and evidenced. Weak risk governance can trigger 10–15% valuation discounts in M&A (ISO 31000, G31000 Risk Maturity Model). Acquirers specifically check for employment law compliance, data protection (GDPR), professional indemnity insurance adequacy, and contractual risk management.",
      caseStudy: "During due diligence on a 70-person technology consultancy, the acquirer discovered no risk register, expired professional indemnity insurance, and undocumented contractor arrangements that created IR35 exposure. The deal was delayed by 4 months for remediation and the purchase price was reduced by 12% to cover identified risk exposures. A competitor firm of similar size with documented risk management completed its sale 6 weeks faster at a 10% higher multiple.",
      workedExample: {
        situation: "Your firm has professional indemnity insurance and basic data protection policies, but no formal risk register, no business continuity plan, and no regular risk review process.",
        rating: "Foundational (Level 1)",
        rationale: "While basic insurance and data protection exist, the absence of a risk register and business continuity plan leaves the firm exposed to operational, regulatory, and reputational risks. Acquirers will flag this as a due diligence concern. To reach Evolving, establish a risk register with quarterly reviews and create a basic business continuity plan."
      },
      improvementTips: ["Create a formal risk register covering operational, financial, regulatory, cyber, and reputational risks", "Assign a risk owner for each identified risk and document mitigation actions", "Develop and test a business continuity plan at least annually", "Review professional indemnity, cyber insurance, and key contractual protections quarterly"]
    },
    cos_deliv: {
      benchmarks: "Top-quartile PSFs achieve delivery cost ratios of 55-65% of revenue, with direct project costs tightly managed. Delivery overhead (non-billable delivery support) should be below 8-12% of revenue. Project-level gross margins of 45-55% indicate healthy delivery economics. Firms with mature delivery cost management consistently outperform on EBITDA margins by 5-8 percentage points.",
      caseStudy: "A management consulting firm had delivery costs at 72% of revenue due to over-staffing projects as a quality hedge. They implemented resource demand forecasting, right-sized project teams using historical delivery data, and introduced peer review rather than senior over-staffing for quality assurance. Delivery costs dropped to 61% of revenue within 12 months, adding 11 percentage points to gross margin.",
      workedExample: {
        situation: "Your delivery costs represent 68% of revenue, with projects frequently over-staffed and no systematic tracking of delivery efficiency by project type or client.",
        rating: "Evolving (Level 2)",
        rationale: "Delivery costs are above the top-quartile benchmark but not severely mismanaged. The firm is delivering profitably but has not yet optimised staffing models or implemented data-driven resource allocation, leaving significant margin on the table."
      },
      improvementTips: ["Implement project-level P&L tracking with real-time visibility into planned vs actual delivery costs for every engagement", "Develop staffing models based on historical delivery data to right-size teams by project type, complexity, and client", "Introduce delivery efficiency KPIs such as cost-per-deliverable and revenue-per-delivery-hour into project manager scorecards", "Create a delivery optimisation committee that reviews project economics monthly and shares best practices across teams"]
    },
    cos_tech: {
      benchmarks: "Leading PSFs invest 4-7% of revenue in technology and automation, with top performers reaching 8-10%. Technology ROI should be measured through productivity gains and automation of repeatable tasks. Firms that invest strategically in technology report 15-25% higher revenue per employee. AI and automation adoption is increasingly a differentiator in due diligence.",
      caseStudy: "A compliance advisory firm spent just 1.5% of revenue on technology, relying on spreadsheets and email for project management and client reporting. They invested in an integrated PSA platform, automated report generation, and client portal technology. Technology spend rose to 6% of revenue, but revenue per consultant increased 22% and the firm eliminated two administrative roles through automation.",
      workedExample: {
        situation: "Your firm spends approximately 3% of revenue on technology, primarily on basic tools like Office 365 and a simple CRM. There is no automation of delivery processes or client reporting.",
        rating: "Foundational (Level 1)",
        rationale: "Technology investment is below the 4-7% benchmark and focused on basic productivity tools rather than strategic automation. This is foundational because the firm has not yet leveraged technology as a scalability enabler or competitive advantage in delivery efficiency."
      },
      improvementTips: ["Conduct a technology audit identifying the top 10 time-consuming manual processes that could be automated or streamlined", "Develop a 3-year technology roadmap with clear ROI targets for each investment tied to productivity and margin improvement", "Prioritise investments in PSA platforms, automated reporting, and AI-assisted delivery tools that directly improve consultant productivity", "Track technology ROI through before-and-after metrics on time savings, error reduction, and revenue per employee"]
    },
    cos_scale: {
      benchmarks: "Scalable PSFs grow revenue 20-30% faster than headcount, indicating genuine leverage in their operating model. The revenue-to-headcount growth ratio should exceed 1.3x for evolving firms and 1.5x+ for optimised firms. Scalability indicators include reusable frameworks, productised services, and offshore or nearshore delivery capabilities. Acquirers pay premium multiples for firms demonstrating scalable economics.",
      caseStudy: "A strategy consulting firm grew revenue and headcount in lockstep for five years at roughly 12% each. They developed reusable analytical frameworks, created a nearshore analytics team for data-intensive work, and introduced a productised benchmarking service. Over the next two years, revenue grew 25% while headcount grew only 15%, demonstrating the scalability that acquirers value.",
      workedExample: {
        situation: "Your revenue grew 15% last year while headcount grew 14%. Growth is almost entirely driven by adding more consultants rather than improving leverage or efficiency.",
        rating: "Foundational (Level 1)",
        rationale: "Revenue growth is closely tied to headcount growth with a ratio near 1.0x, indicating no operating leverage. This is foundational because the firm cannot scale profitably without proportional hiring, which limits growth potential and depresses valuation multiples."
      },
      improvementTips: ["Identify the top 5 repeatable delivery activities that could be templatised, productised, or partially automated", "Explore nearshore or offshore delivery models for data analysis, research, or documentation work to improve leverage ratios", "Develop at least one productised service offering that can be delivered with lower consultant-to-revenue ratios", "Track the revenue-to-headcount growth ratio quarterly and set explicit targets for improving operating leverage year over year"]
    },
    cos_data: {
      benchmarks: "Leading PSFs use data analytics to drive both delivery excellence and operational efficiency. Top-quartile firms have real-time dashboards covering financial performance, utilisation, pipeline, and project health. Data-driven firms report 20-30% faster decision-making and 15-20% better project outcomes. Increasingly, acquirers assess data maturity as a proxy for management sophistication.",
      caseStudy: "An environmental consulting firm relied on monthly spreadsheet reports that were typically two weeks out of date. They implemented a business intelligence platform connecting their PSA, CRM, and finance systems. Real-time dashboards enabled weekly resource rebalancing, improved utilisation by 8 percentage points, and gave leadership confidence to make faster strategic decisions.",
      workedExample: {
        situation: "Your firm has basic financial reporting but no integrated dashboards. Data is siloed across spreadsheets, and management decisions rely heavily on intuition rather than real-time analytics.",
        rating: "Foundational (Level 1)",
        rationale: "Data capabilities are minimal with siloed information and no integrated analytics. This is foundational because management cannot make timely, evidence-based decisions, and the lack of data infrastructure would be a concern for acquirers assessing operational maturity."
      },
      improvementTips: ["Start with a single integrated dashboard covering the four critical metrics: revenue, utilisation, pipeline coverage, and project margin", "Connect core systems (PSA, CRM, finance) to eliminate data silos and enable real-time cross-functional reporting", "Train leadership to use data in weekly management meetings, replacing anecdotal updates with metric-driven discussions", "Develop predictive analytics for resource demand forecasting and project risk identification using historical delivery data"]
    },
    cos_lever: {
      benchmarks: "Optimal leverage ratios (junior-to-senior staff) vary by service type: strategy consulting 3-4:1, implementation services 5-7:1, managed services 8-10:1. Higher leverage improves margins as junior staff bill at lower cost but still generate revenue. Top-quartile firms achieve 35-45% gross margins through effective leverage. Firms with flat pyramids and partner-heavy delivery models typically have compressed margins.",
      caseStudy: "A boutique advisory firm had a flat structure with 60% of delivery performed by partners and directors billing at premium rates but also carrying premium costs. They hired and trained a cohort of experienced managers and senior consultants, redesigned delivery models to push appropriate work down, and improved their leverage ratio from 1.5:1 to 3.5:1. Gross margins improved from 32% to 44% within 18 months.",
      workedExample: {
        situation: "Your firm has a leverage ratio of 2:1 with partners and directors performing significant amounts of work that could be handled by more junior staff.",
        rating: "Evolving (Level 2)",
        rationale: "Some leverage exists but is below optimal ratios for most service types. The firm is evolving beyond a purely partner-led delivery model but has not yet built the middle layer of experienced managers needed to push work down efficiently and improve margin economics."
      },
      improvementTips: ["Map every delivery activity to the lowest competent level that can perform it and identify work currently done by over-qualified staff", "Invest in hiring and developing a strong middle management layer that can lead delivery with partner oversight rather than partner hands-on involvement", "Create standardised delivery methodologies and playbooks that enable less experienced staff to deliver consistently high-quality work", "Set leverage ratio targets by service line and track progress quarterly, linking improvement to margin expansion goals"]
    },
    cos_know: {
      benchmarks: "Effective knowledge management systems reduce project start-up time by 20-30% and improve proposal win rates by 15-20% through reuse of proven methodologies and case studies. Top PSFs have searchable repositories of past deliverables, methodologies, and lessons learned. Knowledge codification is a key scalability enabler and acquirer value driver.",
      caseStudy: "A 70-person consulting firm found that consultants spent an average of 6 hours per project recreating frameworks and templates that already existed elsewhere in the firm. They implemented a structured knowledge repository with tagging, search, and a curator role. Project start-up time decreased by 25%, proposal quality improved significantly, and new joiners reached productive capacity 40% faster.",
      workedExample: {
        situation: "Knowledge exists in individual consultants heads and scattered across personal drives. There is no central repository, and significant rework occurs because teams cannot find or access prior work.",
        rating: "Foundational (Level 1)",
        rationale: "Knowledge is trapped in individuals rather than codified in institutional systems. This is foundational because the firm cannot leverage its accumulated expertise at scale, and knowledge loss through staff departure represents a significant risk that acquirers will flag during due diligence."
      },
      improvementTips: ["Start with a simple, searchable knowledge repository focused on the highest-value reusable assets: methodologies, templates, and case studies", "Assign a part-time knowledge curator role to maintain quality, tagging, and discoverability of repository content", "Build knowledge capture into project close-out processes so insights and deliverables are systematically archived", "Measure knowledge reuse rates and track time savings to build the business case for continued investment in knowledge management"]
    },
    cos_resrc: {
      benchmarks: "Best-in-class PSFs have 4-6 week forward visibility on resource demand and achieve 85-90% resource plan accuracy. Bench time (unallocated billable staff) should be below 8-12% of available capacity. Effective resource planning reduces over-servicing by 10-15% and improves utilisation by 5-8 percentage points. Real-time resource management is increasingly table stakes for acquirer due diligence.",
      caseStudy: "A technology advisory firm managed resource allocation through a weekly email from the operations director, leading to frequent mismatches, double-bookings, and bench time of 18%. They implemented a resource management platform with skills-based matching and demand forecasting. Bench time dropped to 9%, utilisation improved by 6 percentage points, and consultant satisfaction with project assignments increased measurably.",
      workedExample: {
        situation: "Resource allocation is managed informally by project managers competing for the same senior staff. There is no forward demand visibility and bench time runs at approximately 15%.",
        rating: "Evolving (Level 2)",
        rationale: "Some resource management exists but it is reactive and fragmented. The firm is evolving beyond pure chaos but has not yet achieved the systematic, data-driven resource planning with forward visibility that characterises optimised operations."
      },
      improvementTips: ["Implement a centralised resource management function or tool that provides visibility across all projects and available capacity", "Develop skills-based resource profiles so allocation decisions match consultant capabilities to project requirements", "Build 4-6 week forward demand forecasts using pipeline data to anticipate resource needs before they become urgent", "Track and report bench time, utilisation variance, and resource plan accuracy as key operational health metrics"]
    },
    del_sat: {
      benchmarks: "Top-performing PSFs achieve client satisfaction scores (CSAT) of 8.5+/10 or NPS of 50+. Formal post-project feedback should be collected on 80%+ of engagements. Client satisfaction directly correlates with retention, referral rates, and willingness to pay premium fees. Firms with systematic satisfaction measurement report 20-30% higher client lifetime values.",
      caseStudy: "A financial advisory firm had no formal client feedback mechanism beyond ad hoc conversations. They implemented post-engagement surveys, quarterly relationship health checks for key accounts, and a closed-loop process where every score below 7/10 triggered a partner follow-up call. NPS increased from an estimated 25 to a measured 62 within 18 months, and client referrals doubled.",
      workedExample: {
        situation: "You collect informal feedback on some projects but have no systematic satisfaction measurement. Anecdotally, clients seem happy, but you have no quantitative data to support this.",
        rating: "Foundational (Level 1)",
        rationale: "Without systematic measurement, satisfaction claims are unverifiable. This is foundational because acquirers require evidence-based client satisfaction data during due diligence, and the absence of formal feedback processes suggests the firm may be unaware of client concerns until they result in lost work."
      },
      improvementTips: ["Implement a simple post-engagement survey using NPS or CSAT methodology for every project above a minimum size threshold", "Create a closed-loop feedback process where scores below a threshold trigger immediate follow-up by a senior leader", "Track satisfaction trends over time by client, service line, and delivery team to identify patterns and improvement opportunities", "Share aggregated satisfaction data in client proposals and marketing materials to differentiate on proven delivery quality"]
    },
    del_util: {
      benchmarks: "Target billable utilisation rates vary by role: partners 40-50%, directors 55-65%, managers 65-75%, consultants 75-85%. Firm-wide blended utilisation should target 68-75% for healthy economics. Over-utilisation above 85% leads to burnout and quality issues. Under-utilisation below 60% indicates poor demand management or pricing. Revenue per consultant should exceed 200-250K annually for mid-market firms.",
      caseStudy: "A 50-person IT consulting firm had blended utilisation of 58% with significant variance between teams. They implemented weekly utilisation tracking by team and individual, introduced proactive bench management with internal projects and training, and aligned sales targets with delivery capacity. Blended utilisation improved to 72% within 9 months, adding approximately 800K to annual revenue without hiring.",
      workedExample: {
        situation: "Your firm-wide blended utilisation is 64%, with some consultants consistently above 80% while others sit at 45-50%. There is no role-specific utilisation targeting.",
        rating: "Evolving (Level 2)",
        rationale: "Overall utilisation is below optimal benchmarks, and high variance between individuals suggests resource allocation issues rather than a demand problem. The firm tracks utilisation but has not yet optimised allocation or set role-appropriate targets."
      },
      improvementTips: ["Set role-specific utilisation targets and track weekly, making variances visible to both individuals and resource managers", "Implement proactive bench management with structured internal projects, training, and business development activities for under-utilised staff", "Align sales pipeline management with delivery capacity to reduce feast-or-famine utilisation cycles", "Analyse utilisation patterns by client, project type, and team to identify structural causes of under-utilisation and address root issues"]
    },
    del_qa: {
      benchmarks: "Mature PSFs have documented delivery methodologies covering 80%+ of their service offerings. Quality gates at key project milestones reduce rework by 25-35%. Peer review processes improve deliverable quality and spread knowledge across the firm. Methodology maturity is a key acquirer due diligence item as it indicates scalability and consistency of delivery.",
      caseStudy: "A regulatory consulting firm experienced inconsistent delivery quality depending on which partner led the engagement. They developed standardised delivery methodologies for their four core service lines, introduced quality gates at project initiation, mid-point, and delivery, and implemented peer review for all major deliverables. Rework rates dropped from 22% to 8%, and client satisfaction scores improved across all service lines.",
      workedExample: {
        situation: "Your firm has informal delivery approaches that vary by partner or team. There are no documented methodologies, quality gates, or peer review processes for project deliverables.",
        rating: "Foundational (Level 1)",
        rationale: "Delivery quality depends entirely on individual capability rather than institutional processes. This is foundational because inconsistent methodology makes quality unpredictable, inhibits scaling, and raises concerns for acquirers about post-acquisition delivery consistency."
      },
      improvementTips: ["Document delivery methodologies for your top 3 service offerings, starting with the most common engagement types", "Introduce quality gates at project initiation, key milestones, and final delivery with clear criteria for passing each gate", "Implement peer review for all client-facing deliverables above a minimum engagement size threshold", "Create delivery playbooks that capture best practices and enable consistent quality regardless of which team or partner leads the engagement"]
    },
    del_otob: {
      benchmarks: "The industry average for on-time project delivery is approximately 73.4% (based on industry benchmarking data), declining from 80.2% in previous years. M&A-ready PSFs target over 80% on-time and on-budget delivery. Rework should be below 3% of total project hours for optimised firms (vs 8–10% at industry average). Scope change frequency should be formally tracked — projects with more than 2 material scope changes are at high risk of budget and timeline overrun. PSA tool users show 24% higher project margins on average.",
      caseStudy: "A consulting firm discovered that only 55% of projects were delivered on time and on budget, with an average rework rate of 12%. Root cause analysis revealed poor scope definition at project initiation and absent change control. After implementing a structured scoping methodology, mandatory change control process, and weekly project health dashboards, on-time delivery improved to 83% and rework dropped to 4% within 12 months — improving project margins by 8 percentage points.",
      workedExample: {
        situation: "Your firm tracks project deadlines informally. You estimate about 65% of projects finish on time, but budget tracking is done retrospectively at project close rather than in real-time.",
        rating: "Evolving (Level 2)",
        rationale: "65% is above Foundational but below the 80% target. The lack of real-time budget tracking means margin erosion is only discovered after it has occurred. To reach Optimised, implement real-time project dashboards, formal change control processes, and a standard project health review cadence."
      },
      improvementTips: ["Implement real-time project health dashboards tracking schedule, budget, and scope status", "Establish a formal change control process requiring client sign-off for all material scope changes", "Conduct post-project reviews on every engagement and track rework rates as a firm-wide KPI", "Use earned value management principles for projects above a defined size threshold"]
    },
    mkt_size: {
      benchmarks: "Well-positioned PSFs can clearly articulate their total addressable market (TAM) and serviceable addressable market (SAM). Firms targeting a defined SAM of 500M-2B with clear market share goals are viewed favourably by acquirers. Market position should be defensible through specialisation, geographic presence, or unique capabilities. Niche leaders with 5-15% market share in defined segments command premium valuations.",
      caseStudy: "A generalist business consulting firm struggled to articulate its market position to a potential acquirer. They conducted a market sizing exercise, identified three underserved vertical niches where they had existing expertise, and repositioned as specialists. Within two years they had grown market share to 8% in their primary niche and attracted acquisition interest at a significantly higher multiple than the original discussions.",
      workedExample: {
        situation: "Your firm serves a broad market with no clear niche or specialisation. You cannot quantify your addressable market or articulate a defensible market position to an acquirer.",
        rating: "Foundational (Level 1)",
        rationale: "Without a defined market position or quantified addressable market, the firm appears undifferentiated. This is foundational because acquirers need to understand the growth runway and competitive moat, and generalist positioning suggests limited pricing power and vulnerability to competition."
      },
      improvementTips: ["Conduct a market sizing exercise to quantify your TAM and SAM for each major service line or vertical", "Identify 2-3 niches where you have disproportionate expertise or track record and develop a focused positioning strategy", "Create a competitive landscape analysis mapping your position against key competitors on dimensions that matter to clients", "Develop a market share tracking methodology and set explicit growth targets within your defined addressable market"]
    },
    mkt_mktg: {
      benchmarks: "High-growth PSFs invest 5-10% of revenue in marketing, with top-quartile firms achieving 40-60% of new leads through inbound channels. Marketing-generated pipeline should represent 25-35% of total pipeline. Firms with mature content marketing programmes generate 3x more leads per pound spent than those relying solely on outbound. Digital marketing maturity is increasingly assessed in due diligence.",
      caseStudy: "A tax advisory firm relied entirely on partner networks and referrals for new business, investing less than 1% in marketing. When two key referral sources retired, new business dropped 35%. They hired a marketing director, invested in content marketing, SEO, and webinar programmes, and built a systematic lead generation engine. Within 18 months, inbound leads represented 45% of new pipeline and reduced dependency on any single referral source.",
      workedExample: {
        situation: "Your marketing consists of an outdated website and occasional LinkedIn posts. Less than 2% of revenue is invested in marketing, and almost all new business comes through personal networks.",
        rating: "Foundational (Level 1)",
        rationale: "Marketing is minimal and entirely dependent on personal relationships rather than institutional capabilities. This is foundational because the firm has no scalable lead generation engine, creating risk if key relationship holders depart."
      },
      improvementTips: ["Invest in a professional website refresh with clear positioning, case studies, and calls-to-action that convert visitors into leads", "Develop a content marketing calendar with regular thought leadership articles, insights, and research publications", "Build an email nurture programme for prospects and past clients that keeps the firm top-of-mind between active engagements", "Track marketing-generated pipeline and cost-per-lead to build the business case for sustained marketing investment"]
    },
    mkt_award: {
      benchmarks: "Recognised PSFs report 15-25% higher win rates on competitive proposals compared to unrecognised peers. Industry awards, analyst rankings, and directory listings serve as independent third-party validation. Firms appearing in recognised rankings such as Financial Times, Chambers, or industry-specific league tables command measurably higher fee rates. A track record of awards over 3+ years signals sustained excellence rather than a one-off achievement.",
      caseStudy: "A mid-market risk advisory firm had strong client satisfaction but zero industry recognition. They developed a systematic awards programme, submitting to 8-10 relevant awards annually and securing analyst briefings with key industry commentators. Over three years they won 6 awards and were listed in two industry rankings. Their proposal win rate increased from 28% to 41%, and they were able to increase fee rates by 12%.",
      workedExample: {
        situation: "Your firm has never submitted for industry awards and has no external rankings or recognition beyond client testimonials on your website.",
        rating: "Foundational (Level 1)",
        rationale: "No external validation or recognition exists. This is foundational because while the firm may deliver excellent work, the lack of independent third-party recognition limits credibility in competitive situations and reduces the brand premium that acquirers value."
      },
      improvementTips: ["Research and create a calendar of 8-10 relevant industry awards with submission deadlines and entry requirements", "Assign a team member to manage award submissions, ensuring they are well-written with compelling evidence and client endorsements", "Pursue analyst and journalist relationships through briefings, commentary, and thought leadership contributions to build profile", "Leverage every award win and recognition in proposals, website, social media, and client communications to maximise brand impact"]
    },
    mkt_thought: {
      benchmarks: "High-growth PSFs publish thought leadership content 4-6 times per month across channels including white papers, blogs, webinars, and speaking engagements. Firms with visible thought leaders generate 60-70% more inbound leads than those without. Thought leadership topics should align with the firm capabilities and target client pain points. Acquirers value firms with recognised subject matter experts as they represent sustainable competitive advantage.",
      caseStudy: "A cybersecurity consulting firm had deep expertise but minimal external visibility. They launched a monthly research report, a weekly blog series, and a quarterly webinar programme led by their three most senior technical experts. Within a year, they were being invited to speak at industry conferences, web traffic increased 180%, and inbound enquiries from their target market segment tripled.",
      workedExample: {
        situation: "Your firm has significant expertise in its domain but publishes content rarely, perhaps one or two blog posts per quarter. Your senior leaders do not speak at conferences or contribute to industry publications.",
        rating: "Evolving (Level 2)",
        rationale: "Some content exists but publication frequency and reach are well below benchmarks. The firm is evolving beyond complete obscurity but has not yet built the systematic thought leadership engine that positions it as a recognised authority in its space."
      },
      improvementTips: ["Develop a thought leadership calendar with at least weekly content publication covering topics aligned with target client challenges", "Identify 3-5 senior leaders to develop as visible experts through speaking engagements, articles, and media commentary", "Create a research programme producing original data and insights that journalists and conference organisers will seek out", "Repurpose content across channels so a single research piece becomes a white paper, blog series, webinar, and social media campaign"]
    },
    mkt_brand: {
      benchmarks: "Strong PSF brands achieve 70-80% unaided awareness within their target market segments. Brand strength correlates with ability to charge premium fees, with recognised brands commanding 10-20% fee premiums. Brand consistency across all touchpoints including website, proposals, deliverables, and social media builds trust and professionalism. Acquirers pay 15-30% more for firms with strong, transferable brands.",
      caseStudy: "A supply chain consulting firm had inconsistent branding with different visual identities across offices, outdated website design, and no brand guidelines. They invested in a comprehensive rebrand including visual identity, messaging framework, website redesign, and brand guidelines for all touchpoints. Post-rebrand, they reported a 25% increase in proposal requests, 15% higher average engagement values, and significantly improved talent attraction.",
      workedExample: {
        situation: "Your brand is inconsistent across touchpoints with an outdated website, varying proposal formats, and no formal brand guidelines. Awareness within your target market is low.",
        rating: "Foundational (Level 1)",
        rationale: "Brand presence is weak and inconsistent, limiting the firm ability to command premium fees or attract top talent. This is foundational because a strong brand is a transferable asset that acquirers value, and the current state suggests limited investment in how the firm is perceived by the market."
      },
      improvementTips: ["Invest in professional brand development including visual identity, messaging framework, and comprehensive brand guidelines", "Ensure brand consistency across every client touchpoint from website to proposals to deliverables to email signatures", "Conduct a brand awareness survey within your target market to establish a baseline and track improvement over time", "Develop a brand activation plan that builds awareness through consistent thought leadership, events, and digital presence"]
    },
    mkt_digital: {
      benchmarks: "High-growth PSFs generate 30%+ of their new business pipeline from digital/inbound channels (based on industry research). Organic search drives approximately 33% of PSF website traffic (based on industry data). Inbound leads cost 2.6x less than outbound and convert at higher rates. M&A-ready firms have websites optimised for lead generation with clear calls-to-action, gated content, and marketing automation tracking attribution from first touch to closed deal.",
      caseStudy: "A 50-person niche consultancy relied entirely on partner networks for new business, with a brochure-style website generating zero leads. After investing in content marketing (weekly blog posts, quarterly research reports), SEO optimisation, and marketing automation, inbound pipeline grew from 0% to 35% of total within 18 months. The reduced dependence on partner-led business development directly addressed the key-person risk that had previously suppressed their valuation.",
      workedExample: {
        situation: "Your website was last updated 3 years ago. You publish occasional blog posts but have no content strategy, no lead tracking, and no marketing automation. Approximately 5% of your pipeline comes from inbound enquiries.",
        rating: "Foundational (Level 1)",
        rationale: "5% inbound pipeline is well below the 10% threshold for Evolving. The outdated website and absent content strategy mean digital channels are not contributing to growth. To reach Evolving, invest in website redesign with lead capture, implement basic marketing automation, and establish a regular content publishing cadence."
      },
      improvementTips: ["Invest in website optimisation with clear CTAs, gated content, and lead capture forms", "Establish a content calendar with minimum monthly publishing of thought leadership content", "Implement marketing automation to track lead attribution from first touch to opportunity", "Measure and report digital pipeline contribution as a board-level KPI quarterly"]
    }
  }
};


// Default benchmark for backward compatibility
const BENCHMARKS = { "Professional Services": BENCHMARK_PROFILES["M&A-Ready (PSF)"] };
// Map firm sectors to benchmark profile keys
const SECTOR_BENCHMARK_MAP = { "Consulting": "Consulting", "Technology Services": "Technology Services", "Legal": "Legal & Compliance", "Legal & Compliance": "Legal & Compliance", "Financial Advisory": "Financial Advisory", "Financial Services": "Financial Advisory" };

// -----------------------------------------------------------------------
// ASSESSMENT TEMPLATES - Pre-configured starting points
// -----------------------------------------------------------------------
const TEMPLATES = {
  "Top Performer": {
    description: "High-performing firm ready for acquisition",
    icon: "ÃÂÃÂÃÂÃÂ°ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ",
    ratings: {
      fin_revenue: 3, fin_gm: 3, fin_ebitda: 2.5, fin_cash: 3, fin_quality: 2.5, fin_rate: 3, fin_revfte: 3, fin_overhead: 2.5,
      ppl_talent: 3, ppl_exp: 2.5, ppl_recruit: 3, ppl_churn: 3, ppl_wf: 3, ppl_training: 3, ppl_equity: 2.5,
      srv_prop: 3, srv_innov: 2.5, srv_ip: 3, srv_size: 3, srv_price: 2.5, srv_portfolio: 3,
      vis_market: 3, vis_comp: 2.5, vis_align: 3, vis_plan: 3, vis_esg: 2,
      sal_pipe: 3, sal_conv: 2.5, sal_mgmt: 3, sal_skills: 3, sal_crosssell: 2.5,
      cli_conc: 3, cli_long: 3, cli_size: 2.5, cli_part: 2.5, cli_ref: 3,
      led_team: 3, led_deleg: 3, led_gov: 3, led_risk: 3,
      cos_deliv: 2.5, cos_tech: 3, cos_scale: 2.5, cos_data: 3, cos_lever: 3, cos_know: 2.5, cos_resrc: 3,
      del_sat: 3, del_util: 3, del_qa: 3, del_otob: 3,
      mkt_size: 3, mkt_mktg: 2.5, mkt_award: 3, mkt_thought: 2.5, mkt_brand: 2.5, mkt_digital: 2.5,
      fin_revfte: 3, fin_overhead: 3, ppl_training: 3, ppl_equity: 3, srv_portfolio: 3, sal_crosssell: 3, cli_ref: 3, led_risk: 3, del_otob: 3, mkt_digital: 3
    }
  },
  "Typical Mid-Market": {
    description: "Average professional services firm",
    icon: "ÃÂÃÂÃÂÃÂ°ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ",
    ratings: {
      fin_revenue: 2, fin_gm: 2, fin_ebitda: 2, fin_cash: 1.5, fin_quality: 1.5, fin_rate: 2, fin_revfte: 2, fin_overhead: 2,
      ppl_talent: 2, ppl_exp: 2, ppl_recruit: 1.5, ppl_churn: 2, ppl_wf: 2, ppl_training: 1.5, ppl_equity: 1.5,
      srv_prop: 2, srv_innov: 1.5, srv_ip: 1.5, srv_size: 2, srv_price: 1.5, srv_portfolio: 1.5,
      vis_market: 2, vis_comp: 2, vis_align: 1.5, vis_plan: 2, vis_esg: 1,
      sal_pipe: 2, sal_conv: 2, sal_mgmt: 1.5, sal_skills: 2, sal_crosssell: 1.5,
      cli_conc: 1.5, cli_long: 2, cli_size: 2, cli_part: 1.5, cli_ref: 1.5,
      led_team: 2, led_deleg: 1.5, led_gov: 2, led_risk: 1.5,
      cos_deliv: 1.5, cos_tech: 2, cos_scale: 1.5, cos_data: 2, cos_lever: 2, cos_know: 1.5, cos_resrc: 2,
      del_sat: 2, del_util: 2, del_qa: 2, del_otob: 2,
      mkt_size: 2, mkt_mktg: 1.5, mkt_award: 1.5, mkt_thought: 1.5, mkt_brand: 1.5, mkt_digital: 1.5,
      fin_revfte: 2, fin_overhead: 2, ppl_training: 2, ppl_equity: 1, srv_portfolio: 2, sal_crosssell: 1, cli_ref: 2, led_risk: 2, del_otob: 2, mkt_digital: 1
    }
  },
  "Turnaround Target": {
    description: "Firm with significant improvement potential",
    icon: "ÃÂÃÂÃÂÃÂ°ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ§",
    ratings: {
      fin_revenue: 1, fin_gm: 1.5, fin_ebitda: 1, fin_cash: 1, fin_quality: 1, fin_rate: 1.5, fin_revfte: 1, fin_overhead: 1,
      ppl_talent: 1.5, ppl_exp: 1, ppl_recruit: 1, ppl_churn: 1, ppl_wf: 1.5, ppl_training: 1, ppl_equity: 1,
      srv_prop: 1.5, srv_innov: 1, srv_ip: 1, srv_size: 1.5, srv_price: 1, srv_portfolio: 1,
      vis_market: 1.5, vis_comp: 1, vis_align: 1, vis_plan: 1.5, vis_esg: 1,
      sal_pipe: 1, sal_conv: 1.5, sal_mgmt: 1, sal_skills: 1, sal_crosssell: 1,
      cli_conc: 1, cli_long: 1.5, cli_size: 1, cli_part: 1, cli_ref: 1,
      led_team: 1.5, led_deleg: 1, led_gov: 1, led_risk: 1,
      cos_deliv: 1, cos_tech: 1.5, cos_scale: 1, cos_data: 1.5, cos_lever: 1.5, cos_know: 1, cos_resrc: 1,
      del_sat: 1.5, del_util: 1, del_qa: 1.5, del_otob: 1,
      mkt_size: 1.5, mkt_mktg: 1, mkt_award: 1, mkt_thought: 1, mkt_brand: 1, mkt_digital: 1,
      fin_revfte: 1, fin_overhead: 1, ppl_training: 1, ppl_equity: 1, srv_portfolio: 1, sal_crosssell: 1, cli_ref: 1, led_risk: 1, del_otob: 1, mkt_digital: 1
    }
  },
  "Tech-Enabled Services": {
    description: "Strong on technology, developing other areas",
    icon: "ÃÂÃÂÃÂÃÂ°ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ»",
    ratings: {
      fin_revenue: 2.5, fin_gm: 2.5, fin_ebitda: 2, fin_cash: 2, fin_quality: 2, fin_rate: 2, fin_revfte: 2.5, fin_overhead: 2,
      ppl_talent: 2, ppl_exp: 2.5, ppl_recruit: 2.5, ppl_churn: 2, ppl_wf: 2, ppl_training: 2.5, ppl_equity: 2,
      srv_prop: 2.5, srv_innov: 3, srv_ip: 3, srv_size: 2, srv_price: 2, srv_portfolio: 2.5,
      vis_market: 3, vis_comp: 2.5, vis_align: 2, vis_plan: 2.5, vis_esg: 1.5,
      sal_pipe: 2, sal_conv: 2, sal_mgmt: 2.5, sal_skills: 2, sal_crosssell: 2,
      cli_conc: 2, cli_long: 2, cli_size: 2, cli_part: 2.5, cli_ref: 2,
      led_team: 2, led_deleg: 2, led_gov: 2, led_risk: 2,
      cos_deliv: 3, cos_tech: 3, cos_scale: 3, cos_data: 3, cos_lever: 2.5, cos_know: 2.5, cos_resrc: 2.5,
      del_sat: 2.5, del_util: 2.5, del_qa: 2.5, del_otob: 2.5,
      mkt_size: 2.5, mkt_mktg: 2.5, mkt_award: 2, mkt_thought: 2.5, mkt_brand: 2, mkt_digital: 2.5,
      fin_revfte: 2, fin_overhead: 2, ppl_training: 3, ppl_equity: 2, srv_portfolio: 3, sal_crosssell: 2, cli_ref: 2, led_risk: 2, del_otob: 3, mkt_digital: 3
    }
  }
};

// -----------------------------------------------------------------------
// STATE MANAGEMENT
// -----------------------------------------------------------------------
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

const genId = () => crypto.randomUUID();

// -----------------------------------------------------------------------
// DEMO DATA - Sample firms and assessments for demonstration
// -----------------------------------------------------------------------
const generateDemoData = () => {
  // Helper to create ratings with timestamps
  const createRating = (level, comment = "") => ({
    level,
    comment,
    updatedAt: new Date(Date.now() - Math.random() * 86400000).toISOString()
  });

  // Demo Firm 1: Apex Consulting (Top Performer — M&A Ready ~88%)
  const apexRatings = {
    // Financial Performance
    fin_revenue: createRating(3, "Strong 15% YoY growth with diversified revenue"),
    fin_gm: createRating(3, "Consistent 55% gross margin"),
    fin_ebitda: createRating(3, "EBITDA at 24%, strong trend"),
    fin_cash: createRating(3, "Excellent cash conversion, 28 day debtors"),
    fin_quality: createRating(2, "32% recurring revenue from retainers"),
    fin_rate: createRating(3, "Average day rate £1,800"),
    fin_revfte: createRating(3, "Revenue per FTE £165k"),
    fin_overhead: createRating(3, "Overheads at 22% of revenue"),
    // People
    ppl_talent: createRating(3, "Full competency framework implemented"),
    ppl_exp: createRating(2, "Glassdoor 4.2, eNPS 42"),
    ppl_recruit: createRating(3, "Strong employer brand, 14 applicants per role"),
    ppl_churn: createRating(2, "Attrition at 16%, below industry average"),
    ppl_wf: createRating(3, "90% permanent staff"),
    ppl_training: createRating(3, "3.5% of revenue on L&D, 8 days per employee"),
    ppl_equity: createRating(3, "18% of staff hold equity, founder at 45%"),
    // Services & Pricing
    srv_prop: createRating(3, "Clear differentiation in digital transformation"),
    srv_innov: createRating(2, "5% R&D investment"),
    srv_ip: createRating(3, "Proprietary methodology and tools"),
    srv_size: createRating(3, "Average deal size £320k"),
    srv_price: createRating(3, "Value-based pricing model"),
    srv_portfolio: createRating(3, "3 service tiers with clear client journey"),
    // Vision & Strategy
    vis_market: createRating(3, "AI consulting — hot sector"),
    vis_comp: createRating(2, "Good differentiation, 4 direct competitors"),
    vis_align: createRating(3, "Quarterly strategy reviews, full alignment"),
    vis_plan: createRating(3, "Rolling 5-year plan with quarterly updates"),
    vis_esg: createRating(2, "ESG policy in place, reporting established"),
    // Sales & Pipeline
    sal_pipe: createRating(3, "82% of next 12 months booked"),
    sal_conv: createRating(2, "42% win rate"),
    sal_mgmt: createRating(3, "CRM driven, weekly pipeline reviews"),
    sal_skills: createRating(3, "MEDDIC methodology trained across all sellers"),
    sal_crosssell: createRating(2, "22% cross-sell revenue, 2.1 lines per client"),
    // Clients & Relationships
    cli_conc: createRating(2, "Top 3 clients at 28%, manageable concentration"),
    cli_long: createRating(3, "Average tenure 4.8 years"),
    cli_size: createRating(3, "48% from £250k+ clients"),
    cli_part: createRating(3, "Microsoft Gold and Salesforce partnerships"),
    cli_ref: createRating(3, "85% referenceable, 12 published case studies"),
    // Leadership & Governance
    led_team: createRating(3, "Ex-Big 4 leadership with M&A experience"),
    led_deleg: createRating(3, "CEO fully delegated, strong deputies"),
    led_gov: createRating(3, "Advisory board with PE representation"),
    led_risk: createRating(3, "Formal risk register, BCP tested annually"),
    // Cost Optimisation
    cos_deliv: createRating(2, "15% nearshore delivery"),
    cos_tech: createRating(3, "Fully integrated CRM, PSA, BI stack"),
    cos_scale: createRating(2, "45% process automation"),
    cos_data: createRating(3, "Real-time dashboards and reporting"),
    cos_lever: createRating(3, "Zero debt, strong balance sheet"),
    cos_know: createRating(2, "Confluence-based knowledge management"),
    cos_resrc: createRating(3, "84% utilisation"),
    // Delivery
    del_sat: createRating(3, "NPS 65, quarterly surveys"),
    del_util: createRating(3, "84% billable utilisation"),
    del_qa: createRating(3, "Full QA gates on all projects"),
    del_otob: createRating(3, "88% on time and budget, 2% rework"),
    // Market Profile
    mkt_size: createRating(3, "Large addressable market £2bn+"),
    mkt_mktg: createRating(2, "12% of revenue marketing-influenced"),
    mkt_award: createRating(3, "MCA winner 2024, shortlisted 2025"),
    mkt_thought: createRating(3, "6 whitepapers, regular speaking slots"),
    mkt_brand: createRating(2, "Growing brand recognition in target sectors"),
    mkt_digital: createRating(2, "25% of pipeline from inbound, content strategy in place")
  };

  // Demo Firm 2: TechBridge Solutions (Mid-Market — Nearly Ready ~72%)
  const techbridgeRatings = {
    fin_revenue: createRating(2, "8% growth, stable trajectory"),
    fin_gm: createRating(2, "Gross margin 44%"),
    fin_ebitda: createRating(2, "EBITDA 15%"),
    fin_cash: createRating(2, "Cash conversion improving, 48 day debtors"),
    fin_quality: createRating(2, "18% recurring revenue"),
    fin_rate: createRating(2, "Day rate £1,150"),
    fin_revfte: createRating(2, "Revenue per FTE £105k"),
    fin_overhead: createRating(2, "Overheads at 31% of revenue"),
    ppl_talent: createRating(2, "Competency framework exists, improving"),
    ppl_exp: createRating(2, "Glassdoor 3.8, eNPS 28"),
    ppl_recruit: createRating(2, "6 applicants per role"),
    ppl_churn: createRating(2, "22% attrition"),
    ppl_wf: createRating(2, "65% permanent staff"),
    ppl_training: createRating(2, "1.8% of revenue on L&D, 4 days per employee"),
    ppl_equity: createRating(2, "8% of staff hold equity, founder at 65%"),
    srv_prop: createRating(2, "Good capability, clearer messaging emerging"),
    srv_innov: createRating(2, "Structured R&D starting"),
    srv_ip: createRating(2, "Some reusable accelerators and templates"),
    srv_size: createRating(2, "Average deal £95k"),
    srv_price: createRating(2, "Moving toward value-based pricing"),
    srv_portfolio: createRating(2, "2 service lines, some tiering emerging"),
    vis_market: createRating(3, "Cloud migration — warm sector with growth"),
    vis_comp: createRating(2, "Moderate differentiation"),
    vis_align: createRating(2, "Strategy cascaded to senior team"),
    vis_plan: createRating(2, "Annual planning with quarterly reviews"),
    vis_esg: createRating(1, "Basic policy only"),
    sal_pipe: createRating(2, "58% visibility of next 12 months"),
    sal_conv: createRating(2, "35% win rate"),
    sal_mgmt: createRating(2, "CRM adopted, improving discipline"),
    sal_skills: createRating(3, "Sales training programme in place"),
    sal_crosssell: createRating(2, "18% cross-sell revenue, 1.8 lines per client"),
    cli_conc: createRating(2, "Top 3 at 38%"),
    cli_long: createRating(2, "2.5 year average tenure"),
    cli_size: createRating(2, "Growing mid-market client base"),
    cli_part: createRating(2, "AWS and Azure partnerships"),
    cli_ref: createRating(2, "62% referenceable, 5 case studies"),
    led_team: createRating(3, "Strong leadership with industry experience"),
    led_deleg: createRating(2, "Founder stepping back, deputies growing"),
    led_gov: createRating(2, "Advisory board established"),
    led_risk: createRating(2, "Risk register maintained, basic BCP"),
    cos_deliv: createRating(2, "5% nearshore delivery"),
    cos_tech: createRating(2, "CRM and basic PSA in place"),
    cos_scale: createRating(2, "30% automation"),
    cos_data: createRating(2, "Monthly reporting pack with KPIs"),
    cos_lever: createRating(3, "Manageable debt, strong cashflow"),
    cos_know: createRating(2, "SharePoint-based knowledge management"),
    cos_resrc: createRating(2, "72% utilisation"),
    del_sat: createRating(2, "NPS 38, bi-annual surveys"),
    del_util: createRating(2, "72% billable utilisation"),
    del_qa: createRating(3, "QA on all client projects"),
    del_otob: createRating(2, "72% on time and budget, 5% rework"),
    mkt_size: createRating(2, "Medium addressable market"),
    mkt_mktg: createRating(2, "8% of revenue marketing-influenced"),
    mkt_award: createRating(2, "Regional award winner"),
    mkt_thought: createRating(2, "Regular blog and webinar programme"),
    mkt_brand: createRating(2, "Growing regional recognition"),
    mkt_digital: createRating(2, "15% of pipeline from inbound channels")
  };

  // Demo Firm 3: Phoenix Advisory (Turnaround — Needs Work ~36%)
  const phoenixRatings = {
    fin_revenue: createRating(1, "Flat revenue, margin pressure"),
    fin_gm: createRating(1, "GM 32%, declining"),
    fin_ebitda: createRating(1, "EBITDA 6%, below viability threshold"),
    fin_cash: createRating(1, "Working capital challenges, 68 day debtors"),
    fin_quality: createRating(1, "100% project-based revenue"),
    fin_rate: createRating(1, "Day rate £750, under market rate"),
    fin_revfte: createRating(1, "Revenue per FTE £68k"),
    fin_overhead: createRating(1, "Overheads at 42% of revenue"),
    ppl_talent: createRating(1, "No formal development framework"),
    ppl_exp: createRating(1, "Glassdoor 3.0, high dissatisfaction"),
    ppl_recruit: createRating(1, "Struggling to attract talent"),
    ppl_churn: createRating(1, "35% attrition, critical flight risk"),
    ppl_wf: createRating(1, "60% contractors, high dependency"),
    ppl_training: createRating(1, "No training budget, ad-hoc only"),
    ppl_equity: createRating(1, "100% founder owned, no equity sharing"),
    srv_prop: createRating(1, "Generalist positioning, no differentiation"),
    srv_innov: createRating(1, "No formal R&D investment"),
    srv_ip: createRating(1, "No proprietary IP or methodology"),
    srv_size: createRating(1, "£35k average deal size"),
    srv_price: createRating(1, "Heavy discounting to win work"),
    srv_portfolio: createRating(1, "Single service line, no tiering"),
    vis_market: createRating(1, "Project management — crowded, cold sector"),
    vis_comp: createRating(1, "Highly commoditised, no differentiation"),
    vis_align: createRating(1, "No clear strategy communicated"),
    vis_plan: createRating(1, "Annual budget only, reactive approach"),
    vis_esg: createRating(1, "No ESG consideration"),
    sal_pipe: createRating(1, "25% visibility of next 12 months"),
    sal_conv: createRating(1, "20% win rate, declining"),
    sal_mgmt: createRating(1, "Spreadsheet-based tracking"),
    sal_skills: createRating(1, "No formal sales process or training"),
    sal_crosssell: createRating(1, "8% cross-sell, 1.1 lines per client"),
    cli_conc: createRating(1, "Top 3 clients at 68%, critical risk"),
    cli_long: createRating(1, "6 month average tenure, high churn"),
    cli_size: createRating(1, "Mostly small contracts under £50k"),
    cli_part: createRating(1, "No strategic partnerships"),
    cli_ref: createRating(1, "35% referenceable, 1 outdated case study"),
    led_team: createRating(2, "Founder experienced but stretched thin"),
    led_deleg: createRating(1, "100% founder dependent"),
    led_gov: createRating(1, "No governance structure"),
    led_risk: createRating(1, "No risk register or BCP"),
    cos_deliv: createRating(1, "100% onshore, high cost base"),
    cos_tech: createRating(1, "Basic spreadsheets and email"),
    cos_scale: createRating(1, "Manual processes throughout"),
    cos_data: createRating(1, "Quarterly reporting, limited visibility"),
    cos_lever: createRating(2, "Some debt but manageable"),
    cos_know: createRating(1, "Tribal knowledge, no documentation"),
    cos_resrc: createRating(1, "52% utilisation, significant bench"),
    del_sat: createRating(1, "NPS 12, no formal surveys"),
    del_util: createRating(1, "52% billable utilisation"),
    del_qa: createRating(1, "Inconsistent QA, no formal process"),
    del_otob: createRating(1, "45% on time, 15% rework rate"),
    mkt_size: createRating(2, "Niche market with limited growth"),
    mkt_mktg: createRating(1, "No marketing function"),
    mkt_award: createRating(1, "No industry recognition"),
    mkt_thought: createRating(1, "No thought leadership activity"),
    mkt_brand: createRating(1, "Limited brand awareness"),
    mkt_digital: createRating(1, "Under 5% of pipeline from digital channels")
  };

  return {
    firms: [
      { id: "demo_techbridge", name: "TechBridge Solutions", sector: "Technology Services", createdAt: "2026-02-01T14:30:00Z" },
      { id: "demo_apex", name: "Apex Consulting Partners", sector: "Consulting", createdAt: "2026-01-15T10:00:00Z" },
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


// -----------------------------------------------------------------------
// SCORING ENGINE
// -----------------------------------------------------------------------
export const calcScores = (ratings, benchmarkObj) => {
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
      readyWeightedSum += Math.min(currentPct / benchPct, 1) * tw;
      readyTotalWeight += tw;
      themeGaps.push({ themeId: theme.id, themeName: theme.name, color: theme.color, current: currentPct, target: benchPct, gap: benchPct - currentPct });
    });
    const benchmarkAlignment = readyTotalWeight > 0 ? Math.round((readyWeightedSum / readyTotalWeight) * 100) : 0;
    // M&A Readiness Score uses the raw overall percentage (not benchmark-relative)
    const readinessScore = totalMaxPossible > 0 ? Math.round((totalScore / totalMaxPossible) * 100) : 0;
    const readinessLevel = readinessScore >= 90 ? "M&A Ready" : readinessScore >= 75 ? "Nearly Ready" : readinessScore >= 55 ? "In Progress" : readinessScore >= 35 ? "Early Stage" : "Foundational";
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
      benchmarkAlignment,
      themeGaps
  };
};

// -----------------------------------------------------------------------
// COLOUR HELPERS
// -----------------------------------------------------------------------
const levelColor = (level) => {
  if (!level) return { bg: "#F0F0F0", text: "#6C757D", border: "#DEE2E6" };
  if (level <= 1.5) return { bg: "#FFE0B2", text: "#DC2626", border: "#E6B0AA" };
  if (level <= 2.5) return { bg: "#BBDEFB", text: "#7D6608", border: "#F9E79F" };
  return { bg: "#A5D6A7", text: "#16A34A", border: "#A9DFBF" };
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

// -----------------------------------------------------------------------
// ANIMATED COMPONENTS
// -----------------------------------------------------------------------

// Icon mapping for themes
const ICON_MAP = { "pound": PoundSterling, "users": Users, "tag": Tag, "compass": Compass, "trending-up": TrendingUp, "handshake": Handshake, "shield": Shield, "calculator": Calculator, "check-square": CheckSquare, "globe": Globe };
const getThemeIcon = (iconName, size = 16, className = "") => { const Icon = ICON_MAP[iconName]; return Icon ? <Icon size={size} className={className} /> : null; };

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
function AnimatedProgressRing({ progress, size = 80, strokeWidth = 6, color = "#f2a71b" }) {
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


function InfoTooltip({ text }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex ml-1"
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <Info size={14} className="text-gray-400 hover:text-amber-500 cursor-help" />
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2
          text-xs text-white bg-gray-800 rounded-lg shadow-lg whitespace-normal normal-case
          w-56 text-center z-50 pointer-events-none">{text}</span>
      )}
    </span>
  );
}

// Live Assessment Summary Panel (floating sidebar)
function ConfirmDialog({ title, message, confirmLabel = "Delete", cancelLabel = "Cancel", onConfirm, onCancel, variant = "danger" }) {
  const variantStyles = {
    danger: { btn: "bg-red-600 hover:bg-red-700 text-white", icon: "text-red-500" },
    warning: { btn: "bg-amber-500 hover:bg-amber-600 text-white", icon: "text-amber-500" },
  };
  const style = variantStyles[variant] || variantStyles.danger;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onCancel}>
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-red-50 flex items-center justify-center ${style.icon}`}>
            <AlertTriangle size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">{cancelLabel}</button>
          <button onClick={onConfirm} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${style.btn}`}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

function UndoToast({ message, seconds, onUndo, onExpire }) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    const t = setInterval(() => setRemaining(r => r - 1), 1000);
    const timeout = setTimeout(onExpire, seconds * 1000);
    return () => { clearInterval(t); clearTimeout(timeout); };
  }, []);
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl animate-in">
      <span className="text-sm">{message}</span>
      <button onClick={onUndo} className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded">Undo ({remaining}s)</button>
    </div>
  );
}

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
    <div className={`flex-shrink-0 transition-all duration-300 ${isExpanded ? 'w-72' : 'w-12'}`}>
      {/* Toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -left-3 top-4 w-6 h-6 bg-[#f2a71b] text-white rounded-full shadow-lg flex items-center justify-center text-xs hover:bg-[#d9950f] transition-colors z-10"
      >
        {isExpanded ? '\u203A' : '\u2039'}
      </button>

      {isExpanded ? (
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className={`px-4 py-3 ${isAllComplete ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-[#f2a71b] to-indigo-600'} text-white`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm">Live Progress</span>
              {isAllComplete && <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full"> Complete!</span>}
            </div>
          </div>

          {/* Main Stats */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="relative">
                <AnimatedProgressRing progress={completionPct} color={isAllComplete ? "#10B981" : "#f2a71b"} />
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
                <div className="text-xs mt-0.5" style={{ color: scores.ratedCount === scores.totalMetrics ? '#16A34A' : scores.ratedCount > 0 ? '#D97706' : '#9ca3af' }}>
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
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-amber-900/10 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                        <span className="text-xs text-gray-600 group-hover:text-[#f2a71b] truncate">{t.name}</span>
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
                  <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg animate-fade-in border-l-[3px]" style={{ animationDelay: `${i * 100}ms`, borderLeftColor: (FRAMEWORK.themes.find(t => t.id === r.themeId) || {}).color || '#9ca3af' }}>
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
            <AnimatedProgressRing progress={completionPct} size={32} strokeWidth={3} color={isAllComplete ? "#10B981" : "#f2a71b"} />
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

// -----------------------------------------------------------------------
// COMPONENTS
// -----------------------------------------------------------------------

function ScoreGauge({ score, max, label }) {
  const pct = max > 0 ? (score / max) * 100 : 0;
  const color = pct >= 66 ? "#16A34A" : pct >= 33 ? "#D97706" : "#DC2626";
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

function MetricCard({ metric, rating, onRate, onComment, onConfidence, evidence, onEvidence, locked }) {
  const [showDetail, setShowDetail] = useState(false);
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
    { level: 1, label: "Foundational", text: metric.foundational, color: "#DC2626", bg: "#FFE0B2", border: "#E6B0AA" },
    { level: 2, label: "Evolving", text: metric.evolving, color: "#7D6608", bg: "#BBDEFB", border: "#F9E79F" },
    { level: 3, label: "Optimised", text: metric.optimised, color: "#16A34A", bg: "#A5D6A7", border: "#A9DFBF" },
  ];
  const currentLevel = rating?.level;

  const handleRate = (level) => {
    if (locked) return;
    setAnimatingLevel(level);
    onRate(metric.id, level);
    setTimeout(() => setAnimatingLevel(null), 300);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-4 overflow-hidden hover-lift transition-all duration-200">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <h4 className="font-semibold text-gray-800 text-sm truncate">{metric.name}</h4>
            {metric.weight > 0 && <span className="text-xs bg-[#f2a71b]/10 text-[#f2a71b] px-2 py-0.5 rounded-full font-medium whitespace-nowrap">{metric.weight} pts</span>}
            {metric.weight === 0 && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full whitespace-nowrap">Supplementary</span>}
          </div>
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            {metric.guidance && (
              <button onClick={() => setShowGuidance(!showGuidance)} className={`text-xs font-medium inline-flex items-center gap-1 px-3 py-2 rounded transition-all ${showGuidance ? "bg-[#f2a71b]/10 text-[#f2a71b]" : "text-[#f2a71b] hover:text-[#d9950f] hover:bg-[#f2a71b]/5"}`}>
                <HelpCircle size={12} />
                {showGuidance ? "Hide" : "Guidance"}
              </button>
            )}
            {currentLevel && !locked && (
              <button onClick={() => onRate(metric.id, null)} className="text-xs text-gray-400 hover:text-red-500 hover:scale-110 transition-all p-3" title="Clear rating">
                <X size={14} />
              </button>
            )}
            <button onClick={() => setShowComment(!showComment)} className={`flex items-center gap-1 text-xs px-3 py-2 rounded transition-all button-press ${comment ? "bg-[#f2a71b]/10 text-[#f2a71b]" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
              <MessageSquare size={12} />
              {comment ? "Note" : "Add note"}
            </button>
          </div>
        </div>
        {metric.question && <p className="text-xs text-gray-500 mt-1.5 italic leading-relaxed">{metric.question}</p>}
        {showGuidance && metric.guidance && (() => {
          const eg = ENHANCED_GUIDANCE.metrics[metric.id];
          return (
            <div className="mt-2 bg-amber-900/10 border-l-4 border-[#f2a71b] p-3 text-xs text-[#1f1f1f]">
              {metric.guidance.split("\n").map((para, pi) => <p key={pi} className={`${pi > 0 ? "mt-1.5 pl-3 border-l-2 border-amber-200" : ""} mb-1 leading-relaxed`}>{para}</p>)}
              {metric.improvementAction && (
                <p className="mt-1 text-[#f2a71b] font-medium">{metric.improvementAction}</p>
              )}
              {eg && (
                <div className="space-y-1 mt-3 border-t border-[#f2a71b]/30 pt-2">
                  <details className="group">
                    <summary className="cursor-pointer font-semibold text-[#f2a71b] hover:text-[#d4910f] select-none py-0.5">Industry Benchmarks</summary>
                    <p className="mt-1 pl-4 leading-relaxed opacity-80">{eg.benchmarks}</p>
                  </details>
                  <details className="group">
                    <summary className="cursor-pointer font-semibold text-[#f2a71b] hover:text-[#d4910f] select-none py-0.5">Case Study</summary>
                    <p className="mt-1 pl-4 leading-relaxed opacity-80">{eg.caseStudy}</p>
                  </details>
                  <details className="group">
                    <summary className="cursor-pointer font-semibold text-[#f2a71b] hover:text-[#d4910f] select-none py-0.5">Scoring Guide</summary>
                    <div className="mt-1 pl-4 leading-relaxed opacity-80 space-y-1">
                      <p><span className="font-medium">Situation:</span> {eg.workedExample.situation}</p>
                      <p><span className="font-medium">Rating:</span> <span className="font-semibold text-[#f2a71b]">{eg.workedExample.rating}</span></p>
                      <p><span className="font-medium">Rationale:</span> {eg.workedExample.rationale}</p>
                    </div>
                  </details>
                  <details className="group">
                    <summary className="cursor-pointer font-semibold text-[#f2a71b] hover:text-[#d4910f] select-none py-0.5">Improvement Tips</summary>
                    <ul className="mt-1 pl-8 leading-relaxed opacity-80 list-disc space-y-0.5">
                      {eg.improvementTips.map((tip, tipIdx) => <li key={tipIdx}>{tip}</li>)}
                    </ul>
                  </details>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      <div className="divide-y divide-gray-100" role="radiogroup" aria-label="Maturity level">
        {levels.map(l => {
          const selected = currentLevel === l.level;
          const isAnimating = animatingLevel === l.level;
          return (
            <button
              key={l.level}
              onClick={() => handleRate(l.level)}
              role="radio"
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              onKeyDown={(e) => handleRadioGroupKeyDown(e, [1, 2, 3], levels.findIndex(x => x.level === currentLevel), (val) => handleRate(val))}
              className={`relative w-full text-left px-4 py-2.5 transition-all duration-200 hover:bg-gray-50 ${isAnimating ? 'animate-scale-pop' : ''}`}
              style={{
                backgroundColor: selected ? l.bg : "white",
                borderLeft: selected ? `4px solid ${l.color}` : "4px solid transparent",
              }}
            >
              <div className="flex items-center gap-2">
                <div className={`transition-transform duration-200 flex-shrink-0 ${selected ? 'scale-110' : ''}`}>
                  {selected ? <CheckCircle2 size={16} style={{ color: l.color }} /> : <Circle size={16} className="text-gray-300" />}
                </div>
                <span className="text-xs font-bold uppercase tracking-wide flex-shrink-0 w-24" style={{ color: selected ? l.color : "#9CA3AF" }}>{l.label}</span>
                <p className="text-xs leading-relaxed flex-1" style={{ color: selected ? l.color : "#6B7280" }}>{l.text}</p>
              </div>
              {selected && (
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: l.color }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Half-level selector with animations */}
      {currentLevel && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center gap-2 animate-fade-in" role="radiogroup" aria-label="Fine-tune score">
          <span className="text-xs text-gray-500">Fine-tune:</span>
          {[1, 1.5, 2, 2.5, 3].map(v => (
            <button
              key={v}
              onClick={() => handleRate(v)}
              role="radio"
              aria-checked={currentLevel === v}
              tabIndex={currentLevel === v ? 0 : -1}
              onKeyDown={(e) => handleRadioGroupKeyDown(e, [1, 1.5, 2, 2.5, 3], [1, 1.5, 2, 2.5, 3].indexOf(currentLevel), (val) => handleRate(val))}
              className={`text-xs px-3 py-1.5 rounded-full transition-all duration-200 button-press ${currentLevel === v
                ? "bg-[#f2a71b] text-white font-bold scale-110 shadow-md"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300 hover:scale-105"
                }`}
            >
              {v}
            </button>
          ))}
          <div className="flex justify-between w-full mt-0.5" style={{paddingLeft:"70px"}}>
            <span className="text-[10px] text-gray-400">Foundational</span>
            <span className="text-[10px] text-gray-400">Evolving</span>
            <span className="text-[10px] text-gray-400">Optimised</span>
          </div>
        </div>
      )}

      {showComment && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 animate-fade-in">
          <textarea value={comment} onChange={e => { setComment(e.target.value); onComment(metric.id, e.target.value); }} placeholder="Add evidence notes, reasoning, or commentary..." className="w-full text-xs border border-gray-200 rounded p-2 h-16 resize-none focus:outline-none focus:ring-2 focus:ring-[#f2a71b] transition-shadow" />
        </div>
      )}
      <div className="px-3 py-1.5 border-t border-gray-100 flex justify-center">
        <button onClick={() => setShowDetail(!showDetail)} className="text-xs text-gray-400 hover:text-amber-600 transition-colors flex items-center gap-1">
          {showDetail ? "Hide detail" : "Add detail (confidence & evidence)"}
          <ChevronDown size={12} className={showDetail ? "rotate-180 transition-transform" : "transition-transform"} />
        </button>
      </div>
      {showDetail && <div>
      {/* Confidence Indicator */}
      <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100">
        <label className="text-xs font-medium text-gray-500 block mb-1.5">Confidence</label>
            <div className="flex gap-1.5" role="radiogroup" aria-label="Confidence level">
          {["low", "medium", "high"].map(lvl => (
            <button key={lvl} onClick={() => onConfidence && onConfidence(metric.id, lvl)}
                  role="radio"
                  aria-checked={confidence === lvl}
                  tabIndex={confidence === lvl ? 0 : (!confidence && lvl === "low") ? 0 : -1}
                  onKeyDown={(e) => handleRadioGroupKeyDown(e, ["low", "medium", "high"], ["low", "medium", "high"].indexOf(confidence || "low"), (val) => onConfidence && onConfidence(metric.id, val))}
              className={`flex-1 py-1.5 px-3 text-xs font-medium rounded transition-colors text-center ${
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
            {(evidence||[]).length === 0 && <p className="text-xs text-gray-400 italic">Add links, notes, or documents to support your rating. Evidence strengthens assessment credibility during due diligence.</p>}
            {(evidence||[]).map((item,idx) => (
              <div key={idx} className="flex items-start justify-between p-2 bg-gray-50 rounded text-sm">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800">{item.label}</p>
                  {item.type==="link" ? <a href={item.content} target="_blank" rel="noopener noreferrer" className="text-[#f2a71b] hover:underline break-all">{item.content}</a> : <p className="text-gray-600 whitespace-pre-wrap">{item.content}</p>}
                </div>
                <button onClick={() => onEvidence((evidence||[]).filter((_,i)=>i!==idx))} className="text-red-500 hover:text-red-700 text-xs ml-2">Remove</button>
              </div>
            ))}
            <div className="p-3 bg-amber-900/10 rounded space-y-2">
              <div className="flex gap-2">
                <select value={evidenceType} onChange={e=>setEvidenceType(e.target.value)} className="px-2 py-1 border border-gray-300 rounded text-sm">
                  <option value="link">Link</option><option value="note">Note</option>
                </select>
                <input type="text" placeholder="Label" value={evidenceLabel} onChange={e=>setEvidenceLabel(e.target.value)} className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"/>
              </div>
              {evidenceType==="link" ? <input type="url" placeholder="https://..." value={evidenceContent} onChange={e=>setEvidenceContent(e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded text-sm"/> : <textarea placeholder="Add notes..." value={evidenceContent} onChange={e=>setEvidenceContent(e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded text-sm" rows="2"/>}
              <button onClick={() => { if(evidenceLabel&&evidenceContent){onEvidence([...(evidence||[]),{type:evidenceType,label:evidenceLabel,content:evidenceContent}]);setEvidenceLabel("");setEvidenceContent("");}}} className="px-3 py-1 bg-[#f2a71b] text-white text-sm rounded hover:bg-[#d9950f]">Add</button>
            </div>
          </div>
        )}
      </div>
      </div>}
    </div>
  );
}

function ThemeSidebar({ themes, selectedTheme, onSelect, scores }) {
  return (
    <div className="hidden md:block w-52 min-w-52 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-3 border-b border-gray-200 bg-gray-50">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Growth Dimensions</h3>
      </div>
      {themes.map(theme => {
        const s = scores?.themeScores?.[theme.id];
        const active = selectedTheme === theme.id;
        return (
          <button key={theme.id} onClick={() => onSelect(theme.id)} className={`w-full text-left px-3 py-2.5 border-b border-gray-100 transition-all flex items-center gap-2 ${active ? "bg-amber-900/10 border-l-4 " : "hover:bg-gray-50 border-l-4 border-l-transparent"}`} style={active ? {borderLeftColor: theme.color} : {}}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-semibold truncate ${active ? "" : "text-gray-700"}`} style={active ? {color: theme.color} : {}}><span className="flex items-center gap-1">{getThemeIcon(theme.icon, 12)} {theme.name}</span></span>
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
  const themes = [...FRAMEWORK.themes].sort((a, b) => b.totalWeight - a.totalWeight);
  const half = Math.ceil(themes.length / 2);
  const leftThemes = themes.slice(0, half);
  const rightThemes = themes.slice(half);

  const renderTheme = (theme) => (
    <div key={theme.id}>
      <div className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">{getThemeIcon(theme.icon, 12, "text-gray-400")} {theme.name}</div>
      <div className="flex flex-wrap gap-1">
        {theme.metrics.map(m => {
          const r = ratings[m.id];
          const lc = levelColor(r?.level);
          return (
            <div key={m.id} title={`${m.name}: ${levelLabel(r?.level)}`} className="relative group">
              <div className="w-9 h-9 rounded flex items-center justify-center text-sm font-bold cursor-default border" style={{ backgroundColor: lc.bg, color: lc.text, borderColor: lc.border }}>
                {r?.level || "-"}
              </div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-10 shadow-lg" style={{borderTop: `3px solid ${theme.color}`}}>
                      <div className="font-semibold">{m.name}</div>
                      <div className="text-gray-300 mt-0.5">{r?.level || 0}/3 · {levelLabel(r?.level)}</div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0">
        <div className="space-y-3">{leftThemes.map(renderTheme)}</div>
        <div className="space-y-3">{rightThemes.map(renderTheme)}</div>
      </div>
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-gray-100 border border-gray-300" /><span className="text-xs text-gray-500">Not rated</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{ backgroundColor: "#FFE0B2" }} /><span className="text-xs text-gray-500">Foundational</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{ backgroundColor: "#BBDEFB" }} /><span className="text-xs text-gray-500">Evolving</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded" style={{ backgroundColor: "#A5D6A7" }} /><span className="text-xs text-gray-500">Optimised</span></div>
      </div>
    </div>
  );
}

function StrengthsWeaknesses({ ratings }) {
  const scored = [];
  FRAMEWORK.themes.forEach(t => t.metrics.forEach(m => {
    const r = ratings[m.id];
    if (r?.level && m.weight > 0) scored.push({ ...m, level: r.level, theme: t.name, themeColor: t.color, weightedScore: r.level * m.weight });
  }));
  scored.sort((a, b) => b.weightedScore - a.weightedScore);
  const strengths = scored.filter(m => m.level >= 2.5).slice(0, 5);
  const weaknesses = scored.filter(m => m.level <= 1.5).sort((a, b) => (b.weight * (3 - b.level)) - (a.weight * (3 - a.level))).slice(0, 5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white rounded-lg border border-green-200 p-4">
        <h3 className="text-sm font-bold text-green-700 mb-2 flex items-center gap-1"><Award size={14} /> Top Strengths</h3>
        <p className="text-xs text-green-600 opacity-70 mb-1 -mt-1">Ranked by weighted contribution (score × importance)</p>
        {strengths.length === 0 ? <p className="text-xs text-gray-400 italic">Rate metrics to see strengths</p> : strengths.map((m, i) => (
          <div key={i} className="flex items-center justify-between py-1.5 border-b border-green-50 last:border-0">
            <div><span className="text-xs font-medium text-gray-700">{m.name}</span><span className="text-xs text-gray-400 ml-1 inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full inline-block shrink-0" style={{backgroundColor: m.themeColor}} />{m.theme}</span></div>
            <div className="flex items-center gap-1.5 shrink-0"><span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">{m.level}/3</span><span className="text-xs text-gray-400 font-medium">wt ×{m.weight}</span></div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg border border-red-200 p-4">
        <h3 className="text-sm font-bold text-red-700 mb-2 flex items-center gap-1"><AlertCircle size={14} /> Key Improvement Areas</h3>
        <p className="text-xs text-red-600 opacity-70 mb-1 -mt-1">Ranked by improvement potential — highest impact first</p>
        {weaknesses.length === 0 ? <p className="text-xs text-gray-400 italic">Rate metrics to see areas for improvement</p> : weaknesses.map((m, i) => (
          <div key={i} className="flex items-center justify-between py-1.5 border-b border-red-50 last:border-0">
            <div><span className="text-xs font-medium text-gray-700">{m.name}</span><span className="text-xs text-gray-400 ml-1 inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full inline-block shrink-0" style={{backgroundColor: m.themeColor}} />{m.theme}</span></div>
            <div className="flex items-center gap-1.5 shrink-0"><span className="text-xs font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">{m.level}/3</span><span className="text-xs text-gray-400 font-medium">wt ×{m.weight}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------
// EXPORT FUNCTIONS
// -----------------------------------------------------------------------
const generateCSV = (assessment) => {
  const levelLabel = (l) => l === 3 ? "Optimised" : l === 2 ? "Evolving" : l === 1 ? "Foundational" : "Not Rated";
  const rows = [["Dimension", "Metric", "Weight", "Level", "Maturity", "Comment"]];
  FRAMEWORK.themes.forEach(t => {
    t.metrics.forEach(m => {
      const r = assessment.ratings[m.id];
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
  return rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
};

// Shared PDF renderer using html2pdf.js
  // ============= PDF EXPORT FUNCTIONS (jsPDF programmatic) =============

  const exportExecutiveSummary = (assessment, firmName, firmSector, scores) => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "mm", "a4");
    const pw = 210, mg = 15, cw = pw - 2 * mg;
    let y = mg;
    const date = new Date(assessment.createdAt).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });
    const { readinessScore, readinessLevel } = scores;
    const overallPct = scores.pct;
    const lr = readinessLevel === "M&A Ready" ? [5,150,105] : readinessLevel === "Nearly Ready" ? [242,167,27] : readinessLevel === "In Progress" ? [217,119,6] : [234,88,12];
    const sc = (p, b) => p >= b ? [5,150,105] : p >= b - 10 ? [217,119,6] : [220,38,38];
    doc.setFontSize(8); doc.setTextColor(107,114,128);
    doc.text("GROWTH DRIVERS MATURITY FRAMEWORK", pw/2, y, { align: "center" }); y += 10;
    doc.setFontSize(20); doc.setTextColor(31,31,31);
    doc.text("M&A Readiness Executive Summary", pw/2, y, { align: "center" }); y += 7;
    doc.setFontSize(11); doc.setTextColor(100,116,139);
    doc.text(firmName + " | " + (firmSector || "Professional Services") + " | " + date, pw/2, y, { align: "center" }); y += 3;
    doc.setDrawColor(31,31,31); doc.setLineWidth(0.5);
    doc.line(mg, y, pw - mg, y); y += 10;
    doc.setFillColor(255,252,209); doc.setDrawColor(31,31,31);
    doc.roundedRect(mg, y, cw, 42, 3, 3, "FD");
    doc.setFontSize(8); doc.setTextColor(100,116,139);
    doc.text("M&A READINESS SCORE", pw/2, y + 8, { align: "center" });
    doc.setFontSize(40); doc.setTextColor(...lr);
    doc.text(readinessScore + "%", pw/2, y + 26, { align: "center" });
    doc.setFontSize(13); doc.text(readinessLevel, pw/2, y + 34, { align: "center" });
    doc.setFontSize(8); doc.setTextColor(148,163,184);
    doc.text("Overall Maturity: " + overallPct + "%", pw/2, y + 40, { align: "center" }); y += 52;
    doc.setFontSize(12); doc.setTextColor(31,31,31);
    doc.text("Theme Maturity Overview", mg, y); y += 1;
    doc.setDrawColor(31,31,31); doc.setLineWidth(0.3);
    doc.line(mg, y, pw - mg, y); y += 6;
    const colW = cw / 5;
    FRAMEWORK.themes.forEach((t, i) => {
      const col = i % 5, row = Math.floor(i / 5);
      const x = mg + col * colW, yy = y + row * 26;
      const ts = scores.themeScores[t.id];
      const pct = ts ? Math.round(ts.pct) : 0;
      const bench = BENCHMARK_PROFILES["M&A-Ready (PSF)"][t.id] || 65;
      const rgb = sc(pct, bench);
      doc.setDrawColor(226,232,240); doc.setFillColor(255,255,255);
      doc.roundedRect(x + 1, yy, colW - 2, 24, 1.5, 1.5, "FD");
      doc.setFontSize(6.5); doc.setTextColor(100,116,139);
      doc.text(t.name, x + colW/2, yy + 5, { align: "center" });
      doc.setFontSize(16); doc.setTextColor(...rgb);
      doc.text(pct + "%", x + colW/2, yy + 16, { align: "center" });
      doc.setFontSize(5.5); doc.setTextColor(148,163,184);
      doc.text("Target: " + bench + "%", x + colW/2, yy + 21, { align: "center" });
    });
    y += 58;
    const ms = []; FRAMEWORK.themes.forEach(t => t.metrics.forEach(mt => {
      const r = assessment.ratings[mt.id];
      if (r && r.level) ms.push({ name: mt.name, theme: t.name, level: r.level, weight: mt.weight || 100 });
    }));
    const topS = ms.filter(x => x.level >= 2.5).sort((a,b) => b.level * b.weight - a.level * a.weight).slice(0, 3);
    const topG = ms.filter(x => x.level <= 1.5).sort((a,b) => a.level - b.level).slice(0, 3);
    const halfW = cw / 2 - 4;
    doc.setFontSize(11); doc.setTextColor(5,150,105);
    doc.text("Top Strengths", mg, y);
    doc.setDrawColor(5,150,105); doc.setLineWidth(0.3);
    doc.line(mg, y + 1, mg + halfW, y + 1); y += 6;
    doc.setFontSize(8);
    if (topS.length) { topS.forEach((s, i) => { doc.setTextColor(51,65,85); doc.text((i+1) + ". " + s.name, mg, y); doc.setTextColor(100,116,139); doc.text(s.theme, mg + halfW - 2, y, { align: "right" }); y += 5; }); }
    else { doc.setTextColor(148,163,184); doc.text("No strong ratings yet", mg, y); y += 5; }
    let gy = y - (topS.length ? topS.length * 5 : 5) - 6;
    const gx = mg + halfW + 8;
    doc.setFontSize(11); doc.setTextColor(220,38,38);
    doc.text("Priority Gaps", gx, gy);
    doc.setDrawColor(220,38,38); doc.setLineWidth(0.3);
    doc.line(gx, gy + 1, gx + halfW, gy + 1); gy += 6;
    doc.setFontSize(8);
    if (topG.length) { topG.forEach((g, i) => { doc.setTextColor(51,65,85); doc.text((i+1) + ". " + g.name, gx, gy); doc.setTextColor(100,116,139); doc.text(g.theme, gx + halfW - 2, gy, { align: "right" }); gy += 5; }); }
    else { doc.setTextColor(148,163,184); doc.text("No critical gaps identified", gx, gy); gy += 5; }
    y = Math.max(y, gy) + 10;
    doc.setDrawColor(226,232,240); doc.setLineWidth(0.2);
    doc.line(mg, y, pw - mg, y); y += 5;
    doc.setFontSize(7); doc.setTextColor(148,163,184);
    doc.text("Growth Drivers Maturity Framework | Confidential | Generated " + new Date().toLocaleDateString("en-GB"), pw/2, y, { align: "center" }); y += 8;
    doc.setFillColor(248,249,250); doc.setDrawColor(229,231,235);
    doc.roundedRect(mg, y, cw, 14, 2, 2, "FD");
    doc.setFontSize(9); doc.setTextColor(31,41,55);
    doc.text("Next Steps", mg + 5, y + 5);
    doc.setFontSize(7); doc.setTextColor(75,85,99);
    doc.text("For a detailed review, contact richard@richardgoold.com | https://growthlens.app", mg + 5, y + 10);
    const fn = (firmName || "assessment").replace(/[^a-zA-Z0-9\-_ ]/g, "");
    doc.save(fn + "-executive-summary.pdf");
  };

const exportToPDF = (assessment, firmName, firmSector, scores) => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "mm", "a4");
    const pw = 210, mg = 12, cw = pw - 2 * mg;
    let y = mg;
    const sectorKey = Object.keys(BENCHMARKS).find(k => k.toLowerCase() === (firmSector || "").toLowerCase()) || Object.keys(BENCHMARKS)[0];
    const benchmarkData = BENCHMARK_PROFILES[sectorKey] || BENCHMARK_PROFILES["M&A-Ready (PSF)"] || {};
    const dateStr = new Date(assessment.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const metricsWithScores = [];
    FRAMEWORK.themes.forEach(theme => { theme.metrics.forEach(metric => {
      const rating = assessment.ratings[metric.id]; const level = rating ? rating.level : 0;
      metricsWithScores.push({ metricName: metric.name, themeName: theme.name, weight: metric.weight, level, strengthScore: level > 0 ? level * metric.weight : 0, weaknessScore: level < 3 ? metric.weight * (3 - level) : 0 });
    }); });
    const strengths = metricsWithScores.filter(m => m.level > 0).sort((a,b) => b.strengthScore - a.strengthScore).slice(0, 5);
    const weaknesses = metricsWithScores.filter(m => m.level < 3).sort((a,b) => b.weaknessScore - a.weaknessScore).slice(0, 5);
    doc.setFillColor(27,79,114); doc.rect(0, 0, pw, 45, "F");
    doc.setFontSize(20); doc.setTextColor(255,255,255);
    doc.text("Growth Drivers Maturity Framework", pw/2, 18, { align: "center" });
    doc.setFontSize(12); doc.text(firmName + " \u2014 Maturity Report", pw/2, 28, { align: "center" });
    doc.setFontSize(9); doc.text(dateStr + " | " + (firmSector || "Professional Services"), pw/2, 36, { align: "center" });
    y = 55;
    doc.setFontSize(10); doc.setTextColor(100,116,139);
    doc.text("OVERALL MATURITY", pw/2, y, { align: "center" }); y += 8;
    doc.setFontSize(36); doc.setTextColor(27,79,114);
    doc.text(scores.pct + "%", pw/2, y, { align: "center" }); y += 12;
    doc.setFontSize(12); doc.setTextColor(31,31,31);
    doc.text("Theme Performance", mg, y); y += 2;
    doc.setDrawColor(31,31,31); doc.setLineWidth(0.3); doc.line(mg, y, pw - mg, y); y += 6;
    const colW = cw / 5;
    FRAMEWORK.themes.forEach((t, i) => {
      const col = i % 5, row = Math.floor(i / 5);
      const x = mg + col * colW, yy = y + row * 24;
      const ts = scores.themeScores[t.id]; const pct = ts ? Math.round(ts.pct) : 0;
      const color = pct >= 66 ? [30,132,73] : pct >= 33 ? [183,149,11] : [146,43,33];
      doc.setDrawColor(200,200,200); doc.setFillColor(255,255,255);
      doc.roundedRect(x + 1, yy, colW - 2, 22, 1.5, 1.5, "FD");
      doc.setFontSize(6); doc.setTextColor(100,116,139);
      doc.text(t.name, x + colW/2, yy + 5, { align: "center" });
      doc.setFontSize(16); doc.setTextColor(...color);
      doc.text(pct + "%", x + colW/2, yy + 15, { align: "center" });
      doc.setFontSize(5); doc.setTextColor(148,163,184);
      doc.text("Benchmark: " + (benchmarkData[t.id] || 65) + "%", x + colW/2, yy + 20, { align: "center" });
    });
    y += 54;
    doc.setFontSize(12); doc.setTextColor(31,31,31);
    doc.text("Benchmark Comparison", mg, y); y += 2; doc.line(mg, y, pw - mg, y); y += 2;
    const benchRows = FRAMEWORK.themes.map(t => {
      const ts = scores.themeScores[t.id]; const pct = ts ? Math.round(ts.pct) : 0;
      const bench = benchmarkData[t.id] || 65; const gap = pct - bench;
      return [t.name, pct + "%", bench + "%", (gap >= 0 ? "+" : "") + gap + "%", gap >= 0 ? "Above" : gap >= -10 ? "Near" : "Below"];
    });
    doc.autoTable({ startY: y, head: [["Theme", "Your Score", "Benchmark", "Gap", "Status"]], body: benchRows, margin: { left: mg, right: mg }, styles: { fontSize: 8, cellPadding: 2 }, headStyles: { fillColor: [27,79,114], textColor: 255 }, columnStyles: { 0: { cellWidth: 50 }, 4: { cellWidth: 20 } },
      didParseCell: function(data) { if (data.section === "body" && data.column.index === 4) { const v = data.cell.raw; if (v === "Above") data.cell.styles.textColor = [5,150,105]; else if (v === "Near") data.cell.styles.textColor = [217,119,6]; else data.cell.styles.textColor = [220,38,38]; } }
    });
    y = doc.lastAutoTable.finalY + 8;
    if (y > 230) { doc.addPage(); y = mg; }
    doc.setFontSize(12); doc.setTextColor(31,31,31); doc.text("Key Strengths", mg, y); y += 2;
    doc.autoTable({ startY: y, head: [["#", "Metric", "Theme", "Rating"]], body: strengths.map((s, i) => [i+1, s.metricName, s.themeName, s.level >= 2.5 ? "Optimised" : s.level >= 1.5 ? "Evolving" : "Foundational"]),
      margin: { left: mg, right: pw/2 + 2 }, styles: { fontSize: 7, cellPadding: 1.5 }, headStyles: { fillColor: [5,150,105] }, columnStyles: { 0: { cellWidth: 8 } } });
    const sY = doc.lastAutoTable.finalY;
    doc.setFontSize(12); doc.setTextColor(31,31,31); doc.text("Key Opportunities", pw/2 + 5, y - 2);
    doc.autoTable({ startY: y, head: [["#", "Metric", "Theme", "Impact"]], body: weaknesses.map((w, i) => [i+1, w.metricName, w.themeName, w.level === 0 ? "Not Rated" : "Foundational"]),
      margin: { left: pw/2 + 5, right: mg }, styles: { fontSize: 7, cellPadding: 1.5 }, headStyles: { fillColor: [217,119,6] }, columnStyles: { 0: { cellWidth: 8 } } });
    y = Math.max(sY, doc.lastAutoTable.finalY) + 8;
    if (y > 230) { doc.addPage(); y = mg; }
    doc.setFontSize(12); doc.setTextColor(31,31,31);
    doc.text("Maturity Heatmap", mg, y); y += 2; doc.line(mg, y, pw - mg, y); y += 2;
    const heatRows = []; FRAMEWORK.themes.forEach(t => { t.metrics.forEach(mt => {
      const r = assessment.ratings[mt.id]; const level = r ? r.level : 0;
      heatRows.push([t.name, mt.name, level === 0 ? "Not Rated" : level <= 1 ? "Foundational" : level <= 2 ? "Evolving" : "Optimised"]);
    }); });
    doc.autoTable({ startY: y, head: [["Theme", "Metric", "Level"]], body: heatRows, margin: { left: mg, right: mg }, styles: { fontSize: 6.5, cellPadding: 1.5 }, headStyles: { fillColor: [27,79,114] }, columnStyles: { 0: { cellWidth: 40 }, 2: { cellWidth: 25 } },
      didParseCell: function(data) { if (data.section === "body" && data.column.index === 2) { const v = data.cell.raw; if (v === "Optimised") { data.cell.styles.textColor = [5,150,105]; data.cell.styles.fontStyle = "bold"; } else if (v === "Evolving") data.cell.styles.textColor = [27,79,114]; else if (v === "Foundational") data.cell.styles.textColor = [217,119,6]; else data.cell.styles.textColor = [180,180,180]; } }
    });
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) { doc.setPage(i); doc.setFontSize(7); doc.setTextColor(148,163,184); doc.text("Growth Drivers Maturity Framework | Confidential | " + firmName, pw/2, 290, { align: "center" }); doc.text("Page " + i + " of " + pageCount, pw - mg, 290, { align: "right" }); }
    const fn = (firmName || "assessment").replace(/[^a-zA-Z0-9\-_ ]/g, "");
    doc.save(fn + "-maturity-report.pdf");
  };

function exportDetailedReport(assessment, firmName, firmSector, scores, benchmarkProfile) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "mm", "a4");
    const pw = 210, mg = 12, cw = pw - 2 * mg;
    const benchValues = BENCHMARK_PROFILES[benchmarkProfile] || BENCHMARK_PROFILES["M&A-Ready (PSF)"] || {};
    const dateStr = new Date(assessment.createdAt).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });
    const pct = scores.pct; const readiness = scores.readinessScore; const readinessLevel = scores.readinessLevel;
    const lr = readinessLevel === "M&A Ready" ? [5,150,105] : readinessLevel === "Nearly Ready" ? [242,167,27] : readinessLevel === "In Progress" ? [217,119,6] : [234,88,12];
    const themeData = FRAMEWORK.themes.map(theme => {
      const ts = scores.themeScores[theme.id]; const bp = benchValues[theme.id] || 65;
      const gap = ts ? Math.round(ts.pct) - bp : -bp;
      const metrics = theme.metrics.map(m => { const r = assessment.ratings[m.id];
        return { name: m.name, score: r ? r.level : 0, max: 3, comment: r ? r.comment || "" : "", confidence: r ? r.confidence || "" : "", weight: m.weight, action: m.improvementAction || "" };
      });
      return { id: theme.id, name: theme.name, color: theme.color, pct: ts ? Math.round(ts.pct) : 0, benchmark: bp, gap, metrics };
    });
    const improvements = []; themeData.forEach(td => { td.metrics.forEach(m => {
      const mPct = Math.round((m.score / m.max) * 100); const gapVal = td.benchmark - mPct;
      if (gapVal > 0) improvements.push({ theme: td.name, metric: m.name, pct: mPct, target: td.benchmark, gap: gapVal, action: m.action });
    }); }); improvements.sort((a,b) => b.gap - a.gap);
    const sortedThemes = [...themeData].sort((a,b) => b.gap - a.gap);
    const themeStrengths = sortedThemes.filter(t => t.gap >= 0).slice(0, 3);
    const themeWeaknesses = sortedThemes.filter(t => t.gap < 0).sort((a,b) => a.gap - b.gap).slice(0, 3);
    // PAGE 1: Cover
    doc.setFillColor(27,79,114); doc.rect(0, 0, pw, 80, "F");
    doc.setFontSize(28); doc.setTextColor(255,255,255);
    doc.text("Detailed Assessment Report", pw/2, 35, { align: "center" });
    doc.setFontSize(14); doc.text(firmName, pw/2, 50, { align: "center" });
    doc.setFontSize(10); doc.text(dateStr + " | " + (firmSector || "Professional Services"), pw/2, 62, { align: "center" });
    let y = 100;
    doc.setFillColor(255,252,209); doc.setDrawColor(31,31,31);
    doc.roundedRect(mg + 20, y, cw - 40, 50, 3, 3, "FD");
    doc.setFontSize(9); doc.setTextColor(100,116,139);
    doc.text("M&A READINESS SCORE", pw/2, y + 12, { align: "center" });
    doc.setFontSize(44); doc.setTextColor(...lr);
    doc.text(readiness + "%", pw/2, y + 32, { align: "center" });
    doc.setFontSize(14); doc.text(readinessLevel, pw/2, y + 42, { align: "center" });
    y = 170; doc.setFontSize(10); doc.setTextColor(51,65,85);
    doc.text("Overall Maturity: " + pct + "%", pw/2, y, { align: "center" });
    doc.text("Metrics Rated: " + scores.ratedCount + " of " + scores.totalMetrics, pw/2, y + 7, { align: "center" });
    doc.text("Benchmark Profile: " + (benchmarkProfile || "M&A-Ready (PSF)"), pw/2, y + 14, { align: "center" });
    // PAGE 2: Executive Summary
    doc.addPage(); y = mg;
    doc.setFontSize(16); doc.setTextColor(27,79,114);
    doc.text("Executive Summary", mg, y); y += 2;
    doc.setDrawColor(27,79,114); doc.setLineWidth(0.5); doc.line(mg, y, pw - mg, y); y += 8;
    doc.autoTable({ startY: y, head: [["Theme", "Score", "Benchmark", "Gap", "Status"]], body: themeData.map(t => { const status = t.gap >= 0 ? "Above" : t.gap >= -10 ? "Near" : "Below"; return [t.name, t.pct + "%", t.benchmark + "%", (t.gap >= 0 ? "+" : "") + t.gap + "%", status]; }),
      margin: { left: mg, right: mg }, styles: { fontSize: 8, cellPadding: 2.5 }, headStyles: { fillColor: [27,79,114] },
      didParseCell: function(data) { if (data.section === "body" && data.column.index === 4) { const v = data.cell.raw; if (v === "Above") data.cell.styles.textColor = [5,150,105]; else if (v === "Near") data.cell.styles.textColor = [217,119,6]; else data.cell.styles.textColor = [220,38,38]; } }
    });
    y = doc.lastAutoTable.finalY + 10;
    if (themeStrengths.length) { doc.setFontSize(11); doc.setTextColor(5,150,105); doc.text("Theme Strengths (Above Benchmark)", mg, y); y += 5;
      themeStrengths.forEach(t => { doc.setFontSize(8); doc.setTextColor(51,65,85); doc.text("\u2022 " + t.name + " (" + t.pct + "% vs " + t.benchmark + "% benchmark, +" + t.gap + "%)", mg + 3, y); y += 5; }); y += 3; }
    if (themeWeaknesses.length) { doc.setFontSize(11); doc.setTextColor(220,38,38); doc.text("Priority Gaps (Below Benchmark)", mg, y); y += 5;
      themeWeaknesses.forEach(t => { doc.setFontSize(8); doc.setTextColor(51,65,85); doc.text("\u2022 " + t.name + " (" + t.pct + "% vs " + t.benchmark + "% benchmark, " + t.gap + "%)", mg + 3, y); y += 5; }); }
    // PAGES 3+: Theme Details
    doc.addPage(); y = mg;
    doc.setFontSize(16); doc.setTextColor(27,79,114); doc.text("Theme Detail", mg, y); y += 2;
    doc.setDrawColor(27,79,114); doc.setLineWidth(0.5); doc.line(mg, y, pw - mg, y); y += 8;
    themeData.forEach((td) => {
      if (y > 240) { doc.addPage(); y = mg; }
      doc.setFontSize(11); doc.setTextColor(27,79,114); doc.text(td.name + " \u2014 " + td.pct + "%", mg, y);
      doc.setFontSize(8); doc.setTextColor(148,163,184); doc.text("Benchmark: " + td.benchmark + "% | Gap: " + (td.gap >= 0 ? "+" : "") + td.gap + "%", pw - mg, y, { align: "right" }); y += 3;
      const metricRows = td.metrics.map(m => { const label = m.score === 0 ? "Not Rated" : m.score <= 1 ? "Foundational" : m.score <= 2 ? "Evolving" : "Optimised"; return [m.name, label, m.comment || "-"]; });
      doc.autoTable({ startY: y, head: [["Metric", "Level", "Notes"]], body: metricRows, margin: { left: mg, right: mg }, styles: { fontSize: 7, cellPadding: 1.5 }, headStyles: { fillColor: [100,116,139] }, columnStyles: { 0: { cellWidth: 55 }, 1: { cellWidth: 22 } },
        didParseCell: function(data) { if (data.section === "body" && data.column.index === 1) { const v = data.cell.raw; if (v === "Optimised") data.cell.styles.textColor = [5,150,105]; else if (v === "Evolving") data.cell.styles.textColor = [27,79,114]; else if (v === "Foundational") data.cell.styles.textColor = [217,119,6]; else data.cell.styles.textColor = [180,180,180]; } }
      }); y = doc.lastAutoTable.finalY + 6;
    });
    // Benchmark Comparison page
    doc.addPage(); y = mg;
    doc.setFontSize(16); doc.setTextColor(27,79,114); doc.text("Benchmark Comparison", mg, y); y += 2;
    doc.setDrawColor(27,79,114); doc.setLineWidth(0.5); doc.line(mg, y, pw - mg, y); y += 8;
    const profileNames = Object.keys(BENCHMARK_PROFILES);
    const benchHead = ["Theme", ...profileNames, "Your Score"];
    const benchBody = themeData.map(t => { const row = [t.name]; profileNames.forEach(p => row.push((BENCHMARK_PROFILES[p][t.id] || "-") + "%")); row.push(t.pct + "%"); return row; });
    doc.autoTable({ startY: y, head: [benchHead], body: benchBody, margin: { left: mg, right: mg }, styles: { fontSize: 7, cellPadding: 2 }, headStyles: { fillColor: [27,79,114] } });
    // Improvement Roadmap page
    doc.addPage(); y = mg;
    doc.setFontSize(16); doc.setTextColor(27,79,114); doc.text("Improvement Roadmap", mg, y); y += 2;
    doc.setDrawColor(27,79,114); doc.setLineWidth(0.5); doc.line(mg, y, pw - mg, y); y += 8;
    const critical = improvements.filter(i => i.gap >= 10);
    const important = improvements.filter(i => i.gap >= 5 && i.gap < 10);
    const nice = improvements.filter(i => i.gap > 0 && i.gap < 5);
    const sections = [{ title: "Critical Improvements (10%+ Gap)", items: critical, color: [220,38,38] }, { title: "Important Improvements (5-9% Gap)", items: important, color: [217,119,6] }, { title: "Nice to Have (1-4% Gap)", items: nice, color: [100,116,139] }];
    sections.forEach(s => { if (!s.items.length) return; if (y > 250) { doc.addPage(); y = mg; }
      doc.setFontSize(10); doc.setTextColor(...s.color); doc.text(s.title, mg, y); y += 3;
      doc.autoTable({ startY: y, head: [["Theme", "Metric", "Current", "Target", "Gap"]], body: s.items.map(i => [i.theme, i.metric, i.pct + "%", i.target + "%", i.gap + "%"]),
        margin: { left: mg, right: mg }, styles: { fontSize: 7, cellPadding: 1.5 }, headStyles: { fillColor: s.color }, columnStyles: { 0: { cellWidth: 38 }, 1: { cellWidth: 55 } } });
      y = doc.lastAutoTable.finalY + 6;
    });
    // Appendix page
    doc.addPage(); y = mg;
    doc.setFontSize(16); doc.setTextColor(27,79,114); doc.text("Appendix: Full Metric Scores", mg, y); y += 2;
    doc.setDrawColor(27,79,114); doc.setLineWidth(0.5); doc.line(mg, y, pw - mg, y); y += 5;
    const allMetricRows = []; themeData.forEach(td => { td.metrics.forEach(m => {
      const mPct = Math.round((m.score / m.max) * 100);
      allMetricRows.push([td.name, m.name, m.score + "/" + m.max, mPct + "%", m.weight]);
    }); });
    doc.autoTable({ startY: y, head: [["Theme", "Metric", "Score", "%", "Weight"]], body: allMetricRows, margin: { left: mg, right: mg }, styles: { fontSize: 6.5, cellPadding: 1.5 }, headStyles: { fillColor: [27,79,114] }, columnStyles: { 0: { cellWidth: 35 }, 1: { cellWidth: 55 }, 2: { cellWidth: 15 }, 3: { cellWidth: 15 } } });
    // Footer on all pages
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) { doc.setPage(i); doc.setFontSize(7); doc.setTextColor(148,163,184); doc.text("Growth Drivers Maturity Framework | Confidential | " + firmName, pw/2, 290, { align: "center" }); doc.text("Page " + i + " of " + pageCount, pw - mg, 290, { align: "right" }); }
    const fn = (firmName || "assessment").replace(/[^a-zA-Z0-9\-_ ]/g, "");
    doc.save(fn + "-detailed-report.pdf");
  }


function ExportPanel({ assessment, firmName, firmSector, scores, benchmarkProfile }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
        <Download size={14} /> Export Assessment
      </h3>
      <div className="grid grid-cols-4 gap-3">
        <button onClick={() => { track("Export Exec Summary"); exportExecutiveSummary(assessment, firmName, firmSector, scores); }}
          className="flex flex-col items-center justify-center gap-2 px-3 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
          <ClipboardCheck size={20} />
          <span className="text-xs text-center leading-tight">Executive Summary</span>
        </button>
        <button onClick={() => { track("Export PDF"); exportToPDF(assessment, firmName, firmSector, scores); }}
          className="flex flex-col items-center justify-center gap-2 px-3 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
          <FileText size={20} />
          <span className="text-xs text-center leading-tight">Maturity Report</span>
        </button>
        <button onClick={() => { track("Export Detailed Report"); exportDetailedReport(assessment, firmName, firmSector, scores, benchmarkProfile); }}
          className="flex flex-col items-center justify-center gap-2 px-3 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
          <BookOpen size={20} />
          <span className="text-xs text-center leading-tight">Detailed Report</span>
        </button>
        <button onClick={() => {
          const csv = generateCSV(assessment);
          const blob = new Blob([csv], { type: "text/csv" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a"); a.href = url; a.download = (firmName || "assessment") + "-ratings.csv"; a.click();
        }}
          className="flex flex-col items-center justify-center gap-2 px-3 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
          <Download size={20} />
          <span className="text-xs text-center leading-tight">Download CSV</span>
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
          <Radar name="Your Firm" dataKey="score" stroke="#f2a71b" fill="#f2a71b" fillOpacity={0.35} strokeWidth={3} />
          <Radar name="M&A-Ready" dataKey="benchmark" stroke="#1e40af" fill="#1e40af" fillOpacity={0.08} strokeWidth={2} strokeDasharray="6 3" />
          <Tooltip formatter={(v, name) => [v + '%', name]} />
        </RadarChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-6 mt-1">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{backgroundColor:'#f2a71b'}} /><span className="text-xs text-gray-500">Your Firm</span></div>
        <div className="flex items-center gap-1.5"><div className="w-8 h-0 border-t-2 border-dashed" style={{borderColor:'#1e40af'}} /><span className="text-xs text-gray-500">M&A-Ready</span></div>
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
        <p style={{ fontSize: "11px", color: "#64748b", margin: "4px 0 8px 0", lineHeight: "1.4" }}>Top-quartile PSF performance levels associated with premium M&A valuations.</p>
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
          <Bar dataKey="firm" name="Your Firm" radius={[0, 4, 4, 0]} label={({ x, y, width, height, value, index }) => { const d = comparisonData[index]; const gap = d.firm - d.benchmark; return <text x={x + width + 4} y={y + height / 2} fill={gap >= 0 ? "#16A34A" : "#DC2626"} fontSize={10} dominantBaseline="middle">{gap >= 0 ? "+" : ""}{gap}%</text>; }}>
            {comparisonData.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Bar>
          <Bar dataKey="benchmark" name="M&A-Ready" fill="#c4b5a5" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-6 mt-2 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1.5"><div className="flex gap-px">{comparisonData.slice(0,4).map((d,i) => <div key={i} className="w-1.5 h-3 rounded-sm" style={{backgroundColor:d.color}} />)}</div><span className="text-xs text-gray-500">Your Firm (dimension colours)</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{backgroundColor:'#c4b5a5'}} /><span className="text-xs text-gray-500">M&A-Ready Benchmark</span></div>
      </div>
    </div>
  );
}

function TemplateSelector({ onSelect, onClose }) {
  return (
    <div className="bg-white rounded-lg border border-[#f2a71b]/30 p-4 mb-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <Copy size={14} /> Start from Template
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={14} /></button>
      </div>
      <p className="text-sm text-gray-500 mb-3">Choose a template to pre-fill ratings based on typical firm profiles:</p>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(TEMPLATES).map(([name, template]) => (
          <button
            key={name}
            onClick={() => onSelect(template.ratings)}
            className="text-left p-3 border border-gray-200 rounded-lg hover:border-[#f2a71b] hover:bg-amber-900/10 transition-all group"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{template.icon}</span>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-[#f2a71b]">{name}</span>
            </div>
            <p className="text-sm text-gray-500">{template.description}</p>
          </button>
        ))}
      </div>
      <button onClick={onClose} className="mt-3 text-sm text-gray-500 hover:text-gray-700">
        Or start with blank assessment ÃÂÃÂÃÂÃÂ¢ÃÂÃÂÃÂÃÂÃÂÃÂÃÂÃÂ
      </button>
    </div>
  );
}

// -----------------------------------------------------------------------
// VIEWS
// -----------------------------------------------------------------------


function Breadcrumbs({ view, firmName, onNavigate }) {
  if (view === "landing") return null
    const crumbs = [{ label: "Home", view: "firms" }];
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
  if (view === "comparison") {
    crumbs.push({ label: "Firms", view: "firms" });
    crumbs.push({ label: firmName || "Firm", view: "firmDetail" });
    crumbs.push({ label: "Assessment", view: "assess" });
    crumbs.push({ label: "Dashboard", view: "dashboard" });
    crumbs.push({ label: "Insights", view: "comparison" });
  }
  if (view === "guidance") {
    crumbs.push({ label: "Guidance", view: "guidance" });
  }
  if (view === "contact") {
    crumbs.push({ label: "Contact", view: "contact" });
  }

  return (
    <div className="px-4 py-1.5 bg-gray-50 border-b border-gray-100 flex items-center gap-1.5 text-xs text-gray-400 flex-shrink-0">
      <button onClick={() => onNavigate("firms")} className="hover:text-[#f2a71b] transition-colors"><Home size={12} /></button>
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={10} />}
          {i < crumbs.length - 1 ? (
            <button onClick={() => onNavigate(c.view)} className="hover:text-[#f2a71b] transition-colors">{c.label}</button>
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
    { title: "Welcome to GrowthLens", desc: "This tool evaluates your firm\u2019s M&A readiness across 10 key growth themes, each with detailed metrics based on industry best practice.", icon: "\ud83c\udfaf" },
    { title: "10 Growth Dimensions", desc: "From Financial Performance and People to Market Profile — each theme groups related metrics that acquirers and investors evaluate during due diligence.", icon: "\ud83d\udcca" },
    { title: "Simple 1\u20133 Scoring", desc: "Rate each metric: Level 1 (Foundational), Level 2 (Evolving), or Level 3 (Optimised). Use fine-tune adjustments for nuance. Add notes to explain your rationale.", icon: "\u2b50" },
    { title: "M&A-Ready Benchmarks", desc: "Your scores are compared against M&A-Ready benchmarks — top-quartile performance levels that command premium valuations. Synthesised from 20+ industry sources.", icon: "\ud83d\udcc8" },
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
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? "w-8 bg-[#f2a71b]" : "w-1.5 bg-gray-300"}`} />
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={() => { localStorage.setItem("gdmf_onboarding_complete", "true"); onComplete(); }}
            className="flex-1 px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-medium text-sm transition">
            Skip
          </button>
          <button onClick={() => { if (step < steps.length - 1) setStep(step + 1); else { localStorage.setItem("gdmf_onboarding_complete", "true"); onComplete(); } }}
            className="flex-1 px-4 py-2.5 bg-[#f2a71b] text-white hover:bg-[#d9950f] rounded-lg font-medium text-sm transition shadow-sm">
            {step === steps.length - 1 ? "Get Started" : "Next"}
          </button>
        </div>
        <p className="text-[10px] text-gray-400 text-center mt-4">Step {step + 1} of {steps.length}</p>
      </div>
    </div>
  );
}

function LandingPage({ onGetStarted }) {
  const [hoveredTheme, setHoveredTheme] = useState(null);
  const ICON_MAP = { "pound": PoundSterling, "users": Users, "tag": Tag, "compass": Compass, "trending-up": TrendingUp, "handshake": Handshake, "shield": Shield, "calculator": Calculator, "check-square": CheckSquare, "globe": Globe };
  const themeSegments = FRAMEWORK.themes.map((theme, i) => {
    const segColors = {
      financial: "#4e5b73", people: "#6ba7a1", services: "#a4c8e1",
      vision: "#f2a71b", sales: "#d5b79c", clients: "#f4a896",
      leadership: "#a79d94", cost: "#e8c840", delivery: "#c5c5c5", market: "#7a8fa8"
    };
    const lightSegs = ["services","sales","clients","cost","delivery"];
    const n = FRAMEWORK.themes.length;
    const gap = 0.025;
    const cx = 260, cy = 260, outerR = 235, innerR = 152;
    const startA = (i / n) * 2 * Math.PI - Math.PI / 2 + gap / 2;
    const endA = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2 - gap / 2;
    const midA = (startA + endA) / 2;
    const labelR = (outerR + innerR) / 2;
    const d = [
      "M", cx + outerR * Math.cos(startA), cy + outerR * Math.sin(startA),
      "A", outerR, outerR, 0, 0, 1, cx + outerR * Math.cos(endA), cy + outerR * Math.sin(endA),
      "L", cx + innerR * Math.cos(endA), cy + innerR * Math.sin(endA),
      "A", innerR, innerR, 0, 0, 0, cx + innerR * Math.cos(startA), cy + innerR * Math.sin(startA),
      "Z"
    ].join(" ");
    const lx = cx + labelR * Math.cos(midA);
    const ly = cx + labelR * Math.sin(midA);
    const labelColor = lightSegs.includes(theme.id) ? "#1f1f1f" : "#ffffff";
    const nameParts = theme.name.includes(" & ")
      ? [theme.name.split(" & ")[0] + " &", theme.name.split(" & ")[1]]
      : theme.name.split(" ").length > 1
        ? [theme.name.split(" ").slice(0, Math.ceil(theme.name.split(" ").length/2)).join(" "), theme.name.split(" ").slice(Math.ceil(theme.name.split(" ").length/2)).join(" ")]
        : [theme.name];
    return { ...theme, d, lx, ly, labelColor, nameParts, color: segColors[theme.id] || "#4e5b73", isHovered: hoveredTheme === theme.id };
  });
  const steps = [
    { num: 1, title: "Assess", desc: "Rate 57 metrics across 10 growth themes using a 3-level maturity scale" },
    { num: 2, title: "Benchmark", desc: "Compare against M&A-ready PSF benchmarks from 20+ industry sources" },
    { num: 3, title: "Identify", desc: "Pinpoint strengths, gaps, and strategic priorities ranked by impact" },
    { num: 4, title: "Act", desc: "Follow improvement roadmaps and scenario models to grow firm value" }
  ];

  return (
    <div className="" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      {/* HERO */}
      <div className="flex flex-col items-center justify-center px-6 pt-10 pb-12" style={{ background: "linear-gradient(170deg, #1f1f1f 0%, #2a2a2a 55%, #333 100%)", minHeight: "calc(100vh - 64px)" }}>
        <div className="text-center max-w-xl mb-8" style={{ position: "relative", zIndex: 2 }}>
          <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold mb-5 uppercase tracking-wider" style={{ background: "#1f1f1f", border: "1px solid #f2a71b", color: "#f2a71b" }}>
            M&A Due Diligence Platform
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-3 uppercase tracking-tight leading-tight" style={{ letterSpacing: "-0.03em" }}>
            Assess. Benchmark.<br /><span style={{ color: "#f2a71b" }}>Maximise Value.</span>
          </h1>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#c5c5c5", maxWidth: 480, margin: "0 auto" }}>
            A structured framework that evaluates professional services firms across 10 growth dimensions and 57 metrics — benchmarked against M&A-ready standards.
          </p>
        </div>
        {/* GROWTH THEMES */}
        <div className="w-full max-w-5xl mx-auto px-4 mb-8">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-3 mb-6">
            {FRAMEWORK.themes.map(theme => {
              const Icon = ICON_MAP[theme.icon] || Globe;
              return (
                <div key={theme.id} className="group relative bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-amber-400/60 rounded-xl p-4 text-center transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredTheme(theme.id)} onMouseLeave={() => setHoveredTheme(null)} onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
                  <Icon size={24} className="mx-auto mb-2 text-amber-400 group-hover:scale-110 transition-transform" />
                  <div className="text-xs font-bold text-white tracking-wide leading-tight">{theme.name.toUpperCase()}</div>
              <div className="text-[10px] text-white/50 mt-1">{theme.metrics.length} metrics</div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-3 text-gray-400">
            <div className="px-4 py-1.5 border border-gray-500 rounded text-xs font-bold tracking-wider">EBITDA</div>
            <span className="text-lg font-bold text-gray-500">×</span>
            <div className="px-4 py-1.5 border border-gray-500 rounded text-xs font-bold tracking-wider">MULTIPLE</div>
            <span className="text-lg font-bold text-gray-500">=</span>
            <div className="px-4 py-1.5 bg-amber-400/20 border border-amber-400/40 rounded text-xs font-bold text-amber-400 tracking-wider">FIRM VALUE</div>
          </div>
          <p className="text-[11px] text-gray-300 text-center mt-2">5 themes drive EBITDA · 5 themes drive the Multiple · Together they determine Firm Value</p>
        </div>
        <div className="flex gap-3" style={{ position: "relative", zIndex: 2 }}>
          <button onClick={onGetStarted} className="px-8 py-3 rounded-lg text-sm font-bold cursor-pointer" style={{ background: "#f2a71b", color: "#1f1f1f", border: "none", boxShadow: "0 4px 16px rgba(242,167,27,0.3)", letterSpacing: "0.02em", fontFamily: "'Montserrat', sans-serif" }}>
            START ASSESSMENT
          </button>
          <button onClick={onGetStarted} className="px-8 py-3 rounded-lg text-sm font-bold cursor-pointer" style={{ background: "rgba(242, 167, 27, 0.08)", border: "2px solid #f2a71b", color: "#f2a71b", fontFamily: "'Montserrat', sans-serif", letterSpacing: "0.02em" }}>
            VIEW DEMO FIRMS
          </button>
        </div>
      </div>

      <div className="flex justify-center mt-2 mb-4">
        <ChevronDown size={28} className="text-white/40 animate-bounce cursor-pointer" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} />
      </div>

      {/* HOW IT WORKS */}
      <div id="how-it-works" className="py-16 px-6" style={{ background: "linear-gradient(to bottom, #23272b, #f9f9f9)" }}>
        <div className="max-w-sm sm:max-w-2xl md:max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-1 uppercase" style={{ color: "#ffffff", letterSpacing: "-0.02em" }}>How It Works</h2>
          <p className="text-center text-sm mb-10" style={{ color: "#d1d5db" }}>Four steps from assessment to actionable insight</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {steps.map((s, i) => (
              <div key={i} className="text-center p-5 rounded-xl relative" style={{ background: "#f9f9f9", border: "1px solid #e5e5e5" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: "#f2a71b", color: "#1f1f1f", fontWeight: 800, fontSize: 16, fontFamily: "'Montserrat', sans-serif" }}>{s.num}</div>
                <h3 className="text-sm font-bold mb-1 uppercase" style={{ color: "#1f1f1f", fontFamily: "'Montserrat', sans-serif", letterSpacing: "0.02em" }}>{s.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "#4e5b73" }}>{s.desc}</p>
                {i < 3 && <span className="absolute -right-3.5 top-1/2 -translate-y-1/2 text-gray-300">&#8594;</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* METHODOLOGY / SOCIAL PROOF */}
      <div style={{background: "#23272b", padding: "48px 24px", textAlign: "center"}}>
        <h2 style={{fontSize: "1.5rem", fontWeight: "bold", color: "#f5f5f5", marginBottom: "12px"}}>Built on Industry Research</h2>
        <p style={{color: "#9ca3af", maxWidth: "600px", margin: "0 auto 24px", fontSize: "0.95rem"}}>
          Our framework synthesises 20+ benchmarking studies and industry-standard methodologies to assess M&A readiness across five critical dimensions.
        </p>
        <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px", maxWidth: "700px", margin: "0 auto"}}>
          {["Hinge Research", "Deltek", "SPI Research", "Mercer", "IBIS", "Kennedy"].map(s => (
            <span key={s} style={{background: "rgba(242,167,27,0.12)", color: "#f2a71b", padding: "6px 16px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "500", border: "1px solid rgba(242,167,27,0.25)"}}>{s}</span>
          ))}
        </div>
      </div>

      <div style={{background: "linear-gradient(135deg, #1a1a2e 0%, #23272b 100%)", borderRadius: "16px", marginTop: "2rem"}} className="text-center py-12 px-6">
        <h2 className="text-2xl font-bold text-white mb-3">Ready to Assess Your Portfolio?</h2>
        <p className="text-base text-gray-300 mb-6 max-w-lg mx-auto">Start with our built-in demo data or create your own firm assessments</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button onClick={onGetStarted} className="px-8 py-3 rounded-lg text-sm font-bold bg-[#f2a71b] text-[#1a1a2e] hover:bg-[#d4911a] transition-colors cursor-pointer">Explore Demo Data</button>
          <button onClick={onGetStarted} className="px-8 py-3 rounded-lg text-sm font-bold border-2 border-white/30 text-white hover:border-white/60 transition-colors cursor-pointer">Get Started →</button>
        </div>
      </div>    </div>
  );
}
function FirmListView({ firms, onCreateFirm, onSelectFirm, onDeleteFirm, onViewDashboard, assessments, recentlyDeleted, restoreItem, userTier }) {
  const [showCreate, setShowCreate] = useState(false);
  const [showDemos, setShowDemos] = useState(false);
  const [name, setName] = useState("");
  const [sector, setSector] = useState("");

  // Split user firms from demo firms
  const userFirm = firms.find(f => !f.isDemo);
  const demoFirms = firms.filter(f => f.isDemo);
  const hasFirm = !!userFirm;

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreateFirm({ id: genId(), name: name.trim(), sector: sector.trim(), createdAt: new Date().toISOString() });
    setName(""); setSector(""); setShowCreate(false);
  };

  // Render a firm card (shared between user firm and demo firms)
  const renderFirmCard = (firm, isDemo = false) => {
    const firmAssessments = Object.values(assessments).filter(a => a.firmId === firm.id);
    const latest = firmAssessments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
    const latestScores = latest ? calcScores(latest.ratings) : null;
    return (
      <div key={firm.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:border-[#f2a71b]/40 hover:shadow-sm transition-all cursor-pointer group" onClick={() => onSelectFirm(firm.id)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: latestScores ? (latestScores.pct >= 66 ? "#1E8449" : latestScores.pct >= 33 ? "#B7950B" : "#922B21") : "#4e5b73" }}>
              {firm.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{firm.name}</h3>
              <p className="text-xs text-gray-400">{firm.sector || "Professional Services"}{latestScores ? ` \u00B7 ${latestScores.ratedCount}/${latestScores.totalMetrics} rated` : firmAssessments.length === 0 ? " \u00B7 No assessment yet" : ""}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {latestScores && (
              <div className="text-right">
                <div className="text-lg font-bold" style={{ color: latestScores.pct >= 66 ? "#1E8449" : latestScores.pct >= 33 ? "#B7950B" : "#922B21" }}>{latestScores.pct}%</div>
                <div className="text-xs text-gray-400">{latestScores.readinessLevel}</div>
              </div>
            )}
            {firmAssessments.length > 0 && <button onClick={e => { e.stopPropagation(); onViewDashboard(firm.id, firmAssessments[0].id); }} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-[#f2a71b] p-1 transition-all" title="View Dashboard"><LayoutDashboard size={14} /></button>}
            {!isDemo && <button onClick={e => { e.stopPropagation(); onDeleteFirm(firm.id); }} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 p-1 transition-all" title="Delete firm"><Trash2 size={14} /></button>}
            <ChevronRight size={20} className="text-gray-400 group-hover:text-amber-500 transition-colors" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Firm</h1>
        <p className="text-sm text-gray-500 mt-1">Assess your firm's M&A readiness across 57 metrics</p>
      </div>

      {/* Score Legend */}
      <div className="flex items-center gap-4 mb-4 px-1">
        <span className="text-xs text-gray-400 font-medium">Score:</span>
        <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="inline-block w-2.5 h-2.5 rounded-full" style={{backgroundColor:"#1E8449"}}></span>â¥66% On Track</span>
        <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="inline-block w-2.5 h-2.5 rounded-full" style={{backgroundColor:"#B7950B"}}></span>33â65% Developing</span>
        <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="inline-block w-2.5 h-2.5 rounded-full" style={{backgroundColor:"#922B21"}}></span>&lt;33% Early Stage</span>
      </div>

      {/* Your Firm Section */}
      {hasFirm ? (
        <div className="mb-6">
          {renderFirmCard(userFirm, false)}
        </div>
      ) : (
        <div className="mb-6">
          {showCreate ? (
            <div className="bg-white rounded-lg border border-[#f2a71b]/30 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-700 mb-3">Create Your Firm</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Firm name" className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f2a71b]" autoFocus />
                <input value={sector} onChange={e => setSector(e.target.value)} placeholder="Sector (optional)" className="border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f2a71b]" />
              </div>
              <div className="flex gap-2">
                <button onClick={handleCreate} className="bg-[#f2a71b] text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-[#d9950f]">Create</button>
                <button onClick={() => setShowCreate(false)} className="text-gray-500 px-4 py-1.5 rounded text-sm hover:bg-gray-100">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <Building2 size={48} className="mx-auto text-gray-300 mb-5" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Get started</h3>
              <p className="text-gray-500 mb-6">Create your firm to begin an M&A readiness assessment.</p>
              <button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-bold hover:opacity-90 transition cursor-pointer" style={{ background: "#f2a71b" }}>
                <Plus size={16} /> Create Your Firm
              </button>
            </div>
          )}
        </div>
      )}

      {/* Demo Firms Section */}
      {demoFirms.length > 0 && (
        <div className="mt-2">
          <button onClick={() => setShowDemos(!showDemos)} className="flex items-center gap-2 w-full text-left px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
            <Eye size={16} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Explore Demo Firms</span>
            <span className="text-xs text-gray-400 ml-1">â see example assessments</span>
            <ChevronDown size={16} className={`text-gray-400 ml-auto transition-transform ${showDemos ? "rotate-180" : ""}`} />
          </button>
          {showDemos && (
            <div className="mt-2 space-y-2">
              {demoFirms.map(firm => renderFirmCard(firm, true))}
            </div>
          )}
        </div>
      )}

      {/* Recently Deleted */}
      {recentlyDeleted.length > 0 && (
        <details className="mt-6">
          <summary className="flex items-center gap-2 cursor-pointer text-sm text-gray-500 hover:text-gray-700">
            <Trash2 size={14} />
            Recently Deleted ({recentlyDeleted.length})
          </summary>
          <div className="mt-2 space-y-2">
            {recentlyDeleted.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                <div>
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  <span className="text-xs text-gray-400 ml-2">{item.type} &middot; deleted {new Date(item.timestamp).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
                </div>
                <button onClick={() => restoreItem(item)} className="text-sm text-amber-600 hover:text-amber-800 font-medium">Restore</button>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}


function FirmDetailView({ firm, assessments, onCreateAssessment, onDeleteAssessment, onSelectAssessment, onViewDashboard, onBack, userTier }) {
  const { isPremium } = useAuth();
  const { openContactModal } = useContactModal();
  const [showAssessLimitModal, setShowAssessLimitModal] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [onboardingFirmId, setOnboardingFirmId] = useState(null);
  const [showUpgradeFor, setShowUpgradeFor] = useState(null);
  const firmAssessments = Object.values(assessments).filter(a => a.firmId === firm.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const isFree = userTier !== "premium";
  const FREE_ASSESSMENT_LIMIT = 1;
  const atAssessmentLimit = isFree && firmAssessments.length >= FREE_ASSESSMENT_LIMIT;

  const handleCreateWithTemplate = (templateRatings) => {
    onCreateAssessment(firm.id, templateRatings);
    setShowTemplates(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{firm.name}</h1>
          <p className="text-sm text-gray-500">{firm.sector || "Professional Services"}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!atAssessmentLimit && firmAssessments.length === 0 && (
                  <button onClick={() => setOnboardingFirmId(firm.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors shadow-sm">
                    <Plus size={14} /> Start Assessment
                  </button>
                )}
        </div>
        {onboardingFirmId === firm.id && (
          <div style={{marginTop: "16px", padding: "20px", background: "rgba(242,167,27,0.06)", border: "1px solid rgba(242,167,27,0.2)", borderRadius: "12px"}}>
            <h4 style={{fontSize: "1rem", fontWeight: "600", color: "#f5f5f5", marginBottom: "12px"}}>About This Assessment</h4>
            <div style={{display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px", fontSize: "0.9rem", color: "#d1d5db"}}>
              <div><span style={{color: "#f2a71b", fontWeight: "600"}}>Duration:</span> ~10–15 minutes</div>
              <div><span style={{color: "#f2a71b", fontWeight: "600"}}>You'll get:</span> M&A Readiness Score, Gap Analysis & Improvement Roadmap</div>
              <div><span style={{color: "#f2a71b", fontWeight: "600"}}>Tip:</span> Have your firm's financial and operational metrics to hand</div>
            </div>
            <div style={{display: "flex", gap: "8px"}}>
              <button onClick={() => { onCreateAssessment(firm.id); setOnboardingFirmId(null); }} style={{background: "#f2a71b", color: "#1a1a2e", padding: "8px 20px", borderRadius: "8px", fontWeight: "600", fontSize: "0.9rem", border: "none", cursor: "pointer"}}>Start Assessment →</button>
              <button onClick={() => setOnboardingFirmId(null)} style={{background: "transparent", color: "#9ca3af", padding: "8px 16px", borderRadius: "8px", fontSize: "0.9rem", border: "1px solid #4b5563", cursor: "pointer"}}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      {atAssessmentLimit && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-3">
          <div className="flex items-start gap-3">
            <Shield size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-gray-800">Free plan — 1 assessment per firm</h4>
              <p className="text-xs text-gray-600 mt-1">Your baseline assessment is locked once complete. Upgrade to Premium to create additional assessments and track progress over time.</p>
              <button onClick={openContactModal} className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium text-amber-700 hover:text-amber-900 transition-colors">
                <Mail size={12} /> Contact us about upgrading
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Summary */}
      {firmAssessments.length > 0 && (() => {
        const latest = firmAssessments[0];
        const s = calcScores(latest.ratings, BENCHMARK_PROFILES["M&A-Ready (PSF)"]);
        return (
          <div className="bg-gradient-to-r from-gray-50 to-amber-50/30 rounded-lg border border-gray-200 p-3 mb-3 flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: s.pct >= 66 ? "#16A34A" : s.pct >= 33 ? "#D97706" : "#DC2626" }}>{s.pct}%</div>
              <div className="text-[10px] text-gray-400 uppercase flex items-center justify-center gap-1">Score<InfoTooltip text="Raw maturity score — the unweighted average across all rated metrics and dimensions" /></div>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#f2a71b]">{s.readinessScore}%</div>
              <div className="text-[10px] text-gray-400 uppercase flex items-center justify-center gap-1">M&A Ready<InfoTooltip text="Weighted readiness — each metric is weighted by its importance to M&A readiness based on the selected benchmark" /></div>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700">{s.ratedCount}/{s.totalMetrics}</div>
              <div className="text-[10px] text-gray-400 uppercase flex items-center justify-center gap-1">Rated<InfoTooltip text="Number of metrics rated out of the total available" /></div>
            </div>
            <div className="flex-1 text-right text-xs text-gray-400">Latest: {new Date(latest.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
          </div>
        );
      })()}

      {showTemplates && (
        <TemplateSelector
          onSelect={handleCreateWithTemplate}
          onClose={() => setShowTemplates(false)}
        />
      )}

      {firmAssessments.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
          <ClipboardCheck size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No assessments yet. Start one to begin evaluating this firm.</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {firmAssessments.map(a => {
            const scores = calcScores(a.ratings);
            return (
              <div key={a.id} onClick={() => onSelectAssessment(a.id)} className="bg-white rounded-lg border border-gray-200 p-4 hover:border-[#f2a71b]/40 hover:shadow-sm transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">Assessment - {new Date(a.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{scores.ratedCount}/{scores.totalMetrics} metrics rated</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-lg font-bold" style={{ color: scores.pct >= 66 ? "#16A34A" : scores.pct >= 33 ? "#D97706" : "#DC2626" }}>{scores.pct}%</div>
                      <div className="text-xs text-gray-400">{scores.totalScore} / {scores.totalMaxPossible}</div>
                    </div>
                  <button onClick={(e) => { e.stopPropagation(); onViewDashboard(a.id); }} className="p-1 text-gray-400 hover:text-[#f2a71b] transition-colors" title="View Dashboard"><LayoutDashboard size={16} /></button>
                  <button onClick={(e) => { e.stopPropagation(); onDeleteAssessment(a.id); }} className="p-1 text-gray-400 hover:text-red-500 transition-colors" title="Delete assessment"><Trash2 size={16} /></button>
                    <ChevronRight size={20} className="text-gray-400 group-hover:text-amber-500 transition-colors" />
                  </div>
                </div>
                <div className="mt-2 bg-gray-100 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-amber-500 transition-all" style={{ width: `${(scores.ratedCount / scores.totalMetrics) * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
      <LimitModal isOpen={showAssessLimitModal} onClose={() => setShowAssessLimitModal(false)} onUpgrade={openContactModal} type="assessment" />
    </div>
  );
}

function AssessmentView({ assessment, onRate, onComment, onBack, onConfidence, onEvidence, onGuidance, userTier }) {
  const { openContactModal } = useContactModal();
  useEffect(() => { track("Assessment Started"); }, []);
  const [selectedTheme, setSelectedTheme] = useState(FRAMEWORK.themes[0].id);
  const scores = calcScores(assessment.ratings);
  const scrollRef = useRef(null);
  const isFree = userTier !== "premium";
  const isComplete = scores.ratedCount === scores.totalMetrics && scores.totalMetrics > 0;
  const daysSinceCreation = assessment.createdAt ? Math.floor((Date.now() - new Date(assessment.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const isTimeLocked = isFree && daysSinceCreation >= 7;
  const isLocked = isFree && (isComplete || isTimeLocked);
  const isScrollingRef = useRef(false);
  const [assessBannerDismissed, setAssessBannerDismissed] = useState(() => localStorage.getItem('gdmf_dismiss_assess_banner') === '1');

  const handleJumpToTheme = (themeId) => {
    setSelectedTheme(themeId);
    isScrollingRef.current = true;
    const el = document.getElementById('theme-section-' + themeId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => { isScrollingRef.current = false; }, 800);
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const onScroll = () => {
      if (isScrollingRef.current) return;
      const sections = container.querySelectorAll('[data-theme-id]');
      let activeId = FRAMEWORK.themes[0].id;
      sections.forEach(s => { if (s.getBoundingClientRect().top <= 200) activeId = s.dataset.themeId; });
      setSelectedTheme(activeId);
    };
    container.addEventListener('scroll', onScroll);
    return () => container.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="flex h-full">
      <ThemeSidebar themes={FRAMEWORK.themes} selectedTheme={selectedTheme} onSelect={handleJumpToTheme} scores={scores} />
      <div ref={scrollRef} className="flex-1 overflow-y-auto min-w-0">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-gray-400 hover:text-gray-600 transition-colors"><ArrowLeft size={18} /></button>
            <h2 className="text-sm font-bold text-gray-800">Assessment</h2>
            <span className="text-xs text-gray-400">{FRAMEWORK.themes.length} dimensions · {FRAMEWORK.themes.reduce((s, t) => s + t.metrics.length, 0)} metrics</span>
              {onGuidance && <button onClick={onGuidance} className="text-xs text-gray-400 hover:text-amber-500 flex items-center gap-1 transition-colors ml-2"><HelpCircle size={13} /> Guidance</button>}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">Overall</span>
            <span className="text-sm font-bold text-[#f2a71b]"><AnimatedNumber value={scores.pct} suffix="%" /></span>
            <span className="text-xs text-gray-400">({scores.ratedCount}/{scores.totalMetrics})</span>
          </div>
        </div>
        
        {isLocked && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
            <div className="flex items-center gap-3">
              <Lock size={16} className="text-amber-600 flex-shrink-0" />
              <div>
                <span className="text-sm font-semibold text-gray-800">Assessment Locked</span>
       <span className="text-xs text-gray-500 ml-2">{isTimeLocked && !isComplete ? "Your 7-day free editing window has expired." : "Your completed assessment is saved as a read-only baseline."} Upgrade to Premium to edit, create new assessments, and track progress.</span>
              </div>
              <button onClick={openContactModal} className="ml-auto text-xs font-medium text-amber-700 hover:text-amber-900 whitespace-nowrap">Upgrade</button>
            </div>
          </div>
        )}

              {/* Mobile Theme Selector - visible when sidebar hidden */}
              <div className="md:hidden px-4 pt-2">
                <select
                  value={selectedTheme}
                  onChange={(e) => handleJumpToTheme(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-[#f2a71b] focus:border-[#f2a71b]"
                >
                  {FRAMEWORK.themes.map(t => {
                    const s = scores.themeScores?.[t.id];
                    return <option key={t.id} value={t.id}>{t.name} ({s?.rated || 0}/{s?.total || t.metrics.length})</option>;
                  })}
                </select>
              </div>
              {/* Assessment Guidance */}
        {!assessBannerDismissed && (
    <div className="bg-amber-50/60 border border-amber-200/60 rounded-lg mx-4 mt-3 mb-1 p-4 relative">
            <button onClick={() => { setAssessBannerDismissed(true); localStorage.setItem('gdmf_dismiss_assess_banner', '1'); }} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Dismiss"><X size={14} /></button>
          <div className="flex gap-3">
            <Info size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-gray-600 space-y-1.5">
              <p className="font-semibold text-gray-700">How to complete your assessment</p>
              <p>For each metric, select the maturity level that best describes your firm today: <strong>Foundational</strong> (basic/informal), <strong>Evolving</strong> (structured but inconsistent), or <strong>Optimised</strong> (best-in-class). Use the fine-tune slider to adjust between levels.</p>
              <p><strong>Confidence rating:</strong> After selecting a level, rate your confidence as Low, Medium, or High. Low confidence flags areas where you need more data or stakeholder input before finalising. This helps prioritise follow-up during due diligence.</p>
              <p><strong>Evidence:</strong> Expand the Evidence section to attach supporting links or notes. Evidence-backed ratings carry more weight in M&A reviews.</p>
            </div>
          </div>
        </div>
    )}
        {FRAMEWORK.themes.map((theme) => (
          <div key={theme.id} id={'theme-section-' + theme.id} data-theme-id={theme.id} className="transition-opacity duration-200 border-b border-gray-100 scroll-mt-16">
            <div className="sticky top-[41px] z-[5] bg-gray-50 border-b border-gray-200 px-4 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getThemeIcon(theme.icon, 18)}
                  <h3 className="text-md font-bold" style={{ color: theme.color }}>{theme.name}</h3>
                  <span className="text-xs text-gray-400 ml-1">{theme.metrics.length} metrics</span>
                </div>
                <div className="text-sm font-bold" style={{ color: theme.color }}>
                  <AnimatedNumber value={scores.themeScores[theme.id]?.pct || 0} suffix="%" />
                </div>
              </div>
            </div>
            <div className="p-4">
              {theme.metrics.map((m, i) => (
                <div key={m.id} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                  <MetricCard metric={m} rating={assessment.ratings[m.id]} onRate={isLocked ? () => {} : onRate} onComment={isLocked ? () => {} : onComment} onConfidence={isLocked ? () => {} : onConfidence} onEvidence={isLocked ? () => {} : onEvidence} locked={isLocked} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Live Assessment Panel */}
      <div className="hidden lg:block sticky top-0 self-start max-h-screen overflow-y-auto">
      <LiveAssessmentPanel
        scores={scores}
        ratings={assessment.ratings}
        onJumpToTheme={handleJumpToTheme}
      />
      </div>
    </div>
  );
}


// ─── Readiness Score Banner ─────────────────────────────────────
function ReadinessScoreBanner({ readinessScore, readinessLevel }) {
  const getColor = () => {
    if (readinessLevel === "M&A Ready") return { text: "text-green-700", bg: "bg-green-50", border: "border-green-300", ring: "stroke-green-500" };
    if (readinessLevel === "Nearly Ready") return { text: "text-[#f2a71b]", bg: "bg-amber-900/10", border: "border-[#f2a71b]/40", ring: "stroke-[#3b82f6]" };
    if (readinessLevel === "In Progress") return { text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-300", ring: "stroke-amber-500" };
    return { text: "text-orange-700", bg: "bg-orange-50", border: "border-orange-300", ring: "stroke-[#ef4444]" };
  };
  const c = getColor();
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (readinessScore / 100) * circumference;
  return (
    <div className={`${c.bg} ${c.border} border-2 rounded-xl p-8 mb-8`}>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <svg width="200" height="200" className="-rotate-90">
                <circle cx="100" cy="100" r="82" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                <circle cx="100" cy="100" r="82" fill="none" className={c.ring} strokeWidth="12"
                  strokeDasharray={2 * Math.PI * 82} strokeDashoffset={2 * Math.PI * 82 - (readinessScore / 100) * 2 * Math.PI * 82} strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 1s ease" }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={`text-3xl font-bold ${c.text}`}>{readinessScore}%</div>
                <div className={`text-xs font-semibold ${c.text}`}>{readinessLevel}</div>
              </div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">M&A Readiness Score</div>
      <p className="text-xs text-gray-500 max-w-xs">Weighted composite of all 57 metric scores across 10 growth themes.</p>
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
      <p className="text-xs text-gray-500 mb-5">Dimensions ranked by largest gap to M&A-Ready benchmark. Focus improvement efforts on the top gaps.</p>
      <div className="space-y-3">
        {themeGaps.map((g, idx) => (
          <div key={g.themeId} className="group">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-sm font-medium text-gray-800" style={{display:"flex",alignItems:"center",gap:"4px"}}>{getThemeIcon(FRAMEWORK.themes.find(t => t.id === g.themeId)?.icon, 14, "text-gray-400")} {g.themeName}</span>
              <span className={`text-xs font-bold ${g.gap > 0 ? "text-red-600" : "text-green-600"}`}>
                {g.gap > 0 ? `−${Math.round(g.gap)}%` : `+${Math.abs(Math.round(g.gap))}%`}
              </span>
            </div>
            <div className="relative h-5 bg-gray-100 rounded-full overflow-hidden">
              <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(Math.max(g.current, 0), 100)}%`, backgroundColor: g.color || "#4e5b73" }} />
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
      <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-3 mb-4 text-center flex items-center justify-center gap-2">
        <TrendUp size={16} className="text-slate-400" />
        <p className="text-xs text-slate-400">Complete another assessment to unlock trend analysis and score change history.</p>
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
        <TrendUp size={18} className="text-[#f2a71b]" />
        <h3 className="text-lg font-semibold text-slate-900">Maturity Trend</h3>
      </div>
      <p className="text-xs text-gray-500 mb-5">Overall maturity progression across {sorted.length} assessments</p>
      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: "#1f1f1f", border: "none", borderRadius: 8, color: "#fff", fontSize: 12 }} />
            <ReferenceLine y={65} stroke="#D97706" strokeDasharray="6 4" label={{ value: "M&A-Ready", position: "insideTopRight", fill: "#D97706", fontSize: 10 }} />
            <Line type="monotone" dataKey="overall" stroke="#f2a71b" strokeWidth={3} dot={{ fill: "#f2a71b", r: 5 }} activeDot={{ r: 7 }} name="Overall %" />
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
      const val = r ? (typeof r[1] === "object" ? r[1]?.level : r[1]) : null;
      if (val === null || val === undefined) return;
      const pct = Math.round((val / 3) * 100);
      const gap = benchmark - pct;
      if (gap > 0) items.push({ metric, theme: theme.name, pct: Math.round(pct), benchmark, gap: Math.round(gap), level: val, action: metric.improvementAction, evolving: metric.evolving, optimised: metric.optimised, themeColor: theme.color });
    });
  });
    // Weighted priority: gap * metric weight for smarter prioritisation
    items.forEach(i => { i.priority = Math.round(i.gap * (i.metric.weight || 1)); });
    items.sort((a, b) => b.priority - a.priority);

    // Distribute into tiers proportionally so items spread meaningfully
    const n = items.length;
    const criticalCount = Math.max(1, Math.ceil(n * 0.3));
    const importantCount = Math.max(0, Math.ceil(n * 0.4));
    const critical = items.slice(0, criticalCount);
    const important = items.slice(criticalCount, criticalCount + importantCount);
    const niceToHave = items.slice(criticalCount + importantCount);

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
                <div><p className="font-medium">{item.metric.name}</p><p className="text-xs text-gray-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full inline-block" style={{backgroundColor: item.themeColor}} />{item.theme} · wt ×{item.metric.weight}</p></div>
                <span className="text-lg font-bold" style={{color: borderColor}}>{item.pct}%</span>
              </div>
              <div className="mb-2"><div className="flex justify-between text-xs text-gray-500 mb-1"><span>Current</span><span>Target: {item.benchmark}%</span></div>
                <div className="w-full bg-gray-200 rounded-full h-2"><div className="h-2 rounded-full bg-amber-900/100" style={{width: Math.min(100, item.pct / item.benchmark * 100) + "%"}}/></div></div>
              <p className="text-sm text-gray-600 mb-2">Gap: <strong>{item.gap}%</strong> <span className="text-xs text-gray-400 ml-1">Priority score: {item.priority}</span></p>
              {item.action && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Improvement Actions</div>
                  <div className="flex items-start gap-2 bg-amber-50 p-2.5 rounded border-l-3 border-amber-400">
                    <Target size={12} className="text-amber-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{item.action}</p>
                  </div>
                  {item.level === 1 && item.evolving && (
                    <div className="flex items-start gap-2 bg-blue-50 p-2.5 rounded border-l-3 border-blue-400">
                      <TrendingUp size={12} className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700"><span className="font-medium">Next level:</span> {item.evolving}</p>
                    </div>
                  )}
                  {item.level <= 2 && item.optimised && (
                    <div className="flex items-start gap-2 bg-green-50 p-2.5 rounded border-l-3 border-green-400">
                      <Award size={12} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700"><span className="font-medium">Target state:</span> {item.optimised}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Target size={20} className="text-[#f2a71b]"/> Improvement Roadmap</h3>
      {items.length === 0 ? (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-8 text-center">
            <CheckCircle2 size={48} className="mx-auto text-green-600 mb-3" />
            <h3 className="text-xl font-bold text-green-800 mb-2">Excellent Progress!</h3>
            <p className="text-green-700 mb-2">All metrics meet or exceed M&A-Ready benchmarks.</p>
            <p className="text-sm text-green-600">Continue monitoring to maintain this strong position.</p>
          </div>
        ) : (
        <div className="space-y-3">
          {critical.length > 0 && <Group id="critical" title="Critical Priority" bgColor="bg-red-50" textColor="text-red-800" borderColor="#DC2626" groupItems={critical}/>}
          {important.length > 0 && <Group id="important" title="Important" bgColor="bg-amber-50" textColor="text-amber-800" borderColor="#D97706" groupItems={important}/>}
          {niceToHave.length > 0 && <Group id="nice" title="Nice-to-Have" bgColor="bg-amber-900/10" textColor="text-[#d9950f]" borderColor="#2563EB" groupItems={niceToHave}/>}
        </div>
      )}
    </div>
  );
}

function ScenarioPanel({ assessment, benchmarkProfile }) {
  const currentScores = calcScores(assessment.ratings, BENCHMARK_PROFILES[benchmarkProfile || "M&A-Ready (PSF)"]);
  const [sliders, setSliders] = useState(() => Object.fromEntries(Object.entries(currentScores.themeScores).map(([id, ts]) => [id, ts.pct])));
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const benchValues = BENCHMARK_PROFILES[benchmarkProfile];
  const totalW = FRAMEWORK.themes.reduce((s, t) => s + t.totalWeight, 0);
  const projectedReadiness = totalW > 0 ? Math.round(FRAMEWORK.themes.reduce((s, theme) => s + theme.totalWeight * Math.min((sliders[theme.id] || 0) / (benchValues[theme.id] || 65), 1.0) * 100, 0) / totalW) : 0;
  const delta = hasInteracted ? projectedReadiness - currentScores.readinessScore : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><TrendingUp size={20} className="text-[#f2a71b]"/> Scenario Modelling</h3>
      <p className="text-xs text-gray-500 mb-4">Drag the sliders to model how improving individual dimension scores would impact your overall M&A Readiness. Changes are for modelling only and do not affect your saved assessment.</p>
      <div className="flex items-center justify-between p-4 bg-amber-900/10 rounded-lg mb-4">
        <div><p className="text-sm text-gray-600">Current Readiness</p><p className="text-2xl font-bold text-[#f2a71b]">{currentScores.readinessScore}%</p></div>
        <div className="text-center"><p className="text-sm text-gray-600">Change</p><p className={"text-xl font-bold " + (delta >= 0 ? "text-green-600" : "text-red-600")}>{delta >= 0 ? "+" : ""}{delta}%</p></div>
        <div className="text-right"><p className="text-sm text-gray-600">Projected Readiness</p><p className="text-2xl font-bold text-[#f2a71b]">{projectedReadiness}%</p></div>
      </div>
      <button onClick={() => setIsExpanded(!isExpanded)} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors mb-3">
        {isExpanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
        {isExpanded ? "Hide sliders" : "Adjust dimensions"}
      </button>
      {isExpanded && (
        <>
          <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
            {FRAMEWORK.themes.map(theme => {
              const current = currentScores.themeScores[theme.id]?.pct || 0;
              return (
                <div key={theme.id} className="p-2 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium truncate" style={{color: theme.color}}>{theme.name}</span>
                    <span className="text-xs font-bold" style={{color: sliders[theme.id] !== current ? "#2563EB" : "#6B7280"}}>{sliders[theme.id]}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={sliders[theme.id]} onChange={e => { setHasInteracted(true); setSliders(p => ({...p, [theme.id]: parseInt(e.target.value)})); }} className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer" style={{accentColor: theme.color}}/>
                  <div className="text-xs text-gray-400 text-right mt-0.5">Current: {current}%</div>
                </div>
              );
            })}
          </div>
          {hasInteracted && (
            <button onClick={() => { setHasInteracted(false); setSliders(Object.fromEntries(Object.entries(currentScores.themeScores).map(([id, ts]) => [id, ts.pct]))); }} className="mt-3 w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Reset to Current</button>
          )}
        </>
      )}
    </div>
  );
}


function InsightsView({ firmId, firmName, assessments, benchmarkProfile, onBack }) {
  const { isPremium } = useAuth();
  const { openContactModal } = useContactModal();
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
  const actTab = "px-4 py-2 rounded-lg text-sm font-medium bg-[#f2a71b] text-white shadow-sm";
  const offTab = "px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-bold text-gray-900">{firmName} — Insights</h2>
        <button onClick={onBack} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 font-medium">Back to Dashboard</button>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setTab("benchmark")} className={tab === "benchmark" ? actTab : offTab}>Benchmark Position</button>
        <button onClick={() => setTab("comparison")} className={tab === "comparison" ? actTab : offTab}>{!isPremium && <Lock className="w-3 h-3 mr-1 inline opacity-50" />}Assessment Comparison</button>
      </div>

      {tab === "benchmark" && latest && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-lg mb-2">Readiness Across Benchmark Profiles</h3>
            <p className="text-sm text-gray-500 mb-5">How your firm measures against different industry standards. The highlighted card shows your currently selected benchmark.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {benchCards.map(bc => (
                <div key={bc.name} className={`text-center p-4 rounded-xl border-2 transition-all ${bc.name === benchmarkProfile ? "border-[#f2a71b] bg-amber-900/10 shadow-md" : "border-gray-200 hover:border-gray-300"}`}>
                  <div className="text-xs text-gray-500 mb-1 font-medium truncate" title={bc.name}>{bc.name}</div>
                  <div className="text-3xl font-bold" style={{color: bc.readiness >= 90 ? "#059669" : bc.readiness >= 70 ? "#D97706" : "#DC2626"}}>{bc.readiness}%</div>
                  <div className={`text-xs mt-1.5 px-2 py-0.5 rounded-full inline-block font-medium ${bc.readiness >= 90 ? "bg-green-100 text-green-700" : bc.readiness >= 70 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{bc.level}</div>
                  <p className="text-xs mt-2" style={{ color: bc.readiness >= 90 ? "#16A34A" : bc.readiness >= 70 ? "#D97706" : "#DC2626" }}>{bc.readiness >= 90 ? `Exceeds benchmark by +${bc.readiness - 90}%` : `Need +${90 - bc.readiness}% to reach M&A-Ready`}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-lg mb-4">Dimension-Level Benchmark Gaps</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2.5 px-3 font-semibold text-gray-700 sticky left-0 z-10 bg-white">Theme</th>
                    <th className="text-center py-2.5 px-3 font-semibold text-[#f2a71b]">Score</th>
                    {profileNames.map(n => <th key={n} className="text-center py-2.5 px-2 font-medium text-gray-500 text-xs" title={n}>{n.replace("M&A-Ready (PSF)", "M&A-Ready").replace("Top Decile (PSF)", "Top Dec.").replace("Industry Average", "Ind. Avg").replace("Consulting Benchmark", "Consult.").replace("Technology Scale-up", "Tech S/U").replace("Legal & Compliance", "Legal")}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {FRAMEWORK.themes.map((theme, idx) => {
                    const myScore = latest.scores.themeScores[theme.id]?.pct || 0;
                    return (
                      <tr key={theme.id} className={`border-b ${idx % 2 === 0 ? "bg-gray-50" : ""}`}>
                        <td className="py-2 px-3 font-medium text-gray-800 sticky left-0 z-10 bg-white">{theme.name}</td>
                        <td className="text-center py-2 px-3 font-bold text-[#f2a71b]">{myScore}%</td>
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

        {tab === "comparison" && !isPremium && (
          <UpgradePrompt feature="comparison" onUpgrade={openContactModal} />
        )}

        {tab === "comparison" && isPremium && (
        <div className="space-y-6">
          {firmAssess.length < 2 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
              <div className="w-16 h-16 bg-amber-900/10 rounded-full flex items-center justify-center mx-auto mb-4"><BarChart3 className="text-[#f2a71b]" size={28} /></div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Compare Assessments Over Time Available</h3>
              <p className="text-gray-500 mb-4 max-w-md mx-auto">Periodic assessments reveal score trends across time and assessors, helping you track real impact.</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <span className="text-xs px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full border border-amber-200">Track Progress Over Time</span>
                  <span className="text-xs px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full border border-amber-200">Spot Score Trends</span>
                  <span className="text-xs px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full border border-amber-200">Measure Real Impact</span>
                </div>
              <div className="flex gap-6 justify-center text-sm text-gray-400">
                <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-400"/> Multiple assessors</div>
                <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-400"/> Year-on-year tracking</div>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-lg mb-4">Dimension Scores Across Assessments</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={FRAMEWORK.themes.map(theme => { const entry = { theme: theme.name }; assessData.forEach(ad => { entry[ad.date] = ad.scores.themeScores[theme.id]?.pct || 0; }); return entry; })}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="theme" height={120} interval={0} tick={({x, y, payload}) => { const v = payload.value; const lines = v.includes(" & ") ? [v.substring(0, v.indexOf(" & ")), "& " + v.substring(v.indexOf(" & ") + 3)] : v.includes(" ") ? [v.substring(0, v.indexOf(" ")), v.substring(v.indexOf(" ") + 1)] : [v]; return (<g transform={`translate(${x},${y})`}><text textAnchor="middle" fill="#666" fontSize={10}>{lines.map((l, i) => <tspan key={i} x={0} dy={i === 0 ? 14 : 13}>{l}</tspan>)}</text></g>); }} />
                    <YAxis domain={[0,100]}/>
                    <Tooltip/>
                    <Legend/>
                    {assessData.map((ad, i) => <Bar key={ad.id} dataKey={ad.date} fill={["#2563EB", "#F59E0B", "#10B981", "#8B5CF6"][i % 4]} />)}
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-lg mb-4">Readiness Progression</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {assessData.map((ad, i) => (
                    <div key={ad.id} className="text-center p-4 rounded-xl border-2 border-gray-200">
                      <div className="text-xs text-gray-500 mb-1 font-medium">{ad.date}</div>
                      <div className="text-3xl font-bold" style={{color: ad.scores.readinessScore >= 66 ? "#059669" : ad.scores.readinessScore >= 60 ? "#D97706" : "#DC2626"}}>{ad.scores.readinessScore}%</div>
                      <div className="text-xs text-gray-400 mt-1">{ad.scores.readinessLevel}</div>
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
  if (!previousAssessment) return null;
  const prevRatings = previousAssessment.ratings || {};
  const currRatings = currentAssessment.ratings || {};
  const changes = [];
  FRAMEWORK.themes.forEach(theme => {
    theme.metrics.forEach(metric => {
      const prev = prevRatings[metric.id]?.level || 0;
      const curr = currRatings[metric.id]?.level || 0;
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

function DashboardView({ assessment, firmName, firmSector, onBack, firmAssessments, benchmarkProfile, onBenchmarkChange, onCompare, onGuidance, isDemoFirm }) {
  useEffect(() => { track("Dashboard Viewed"); }, []);
  const { isPremium } = useAuth();
  const { openContactModal } = useContactModal();
  const [dashBannerDismissed, setDashBannerDismissed] = useState(() => localStorage.getItem('gdmf_dismiss_dash_banner') === '1');
  const [activeTab, setActiveTab] = useState("scores");
  const [leadInfo, setLeadInfo] = useState(() => JSON.parse(localStorage.getItem('gdmf_lead') || 'null'));
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{firmName} - Maturity Dashboard</h1>
          <p className="text-sm text-gray-500">Assessment from {new Date(assessment.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}{firmSector ? ` \u00B7 ${firmSector}` : ""}</p>
          {onGuidance && <button onClick={onGuidance} className="text-xs text-gray-400 hover:text-amber-500 flex items-center gap-1 transition-colors mt-1"><HelpCircle size={13} /> Guidance</button>}
        </div>
      <div className="flex flex-wrap items-center gap-2">
      <div style={{display: "flex", justifyContent: "flex-end", marginTop: "-8px", marginBottom: "8px"}}>
        <button onClick={(e) => { navigator.clipboard.writeText("I just assessed my firm's M&A readiness using the GrowthLens framework — try it: https://growthlens.app/"); const b = e.currentTarget; b.textContent = "✓ Copied!"; setTimeout(() => { b.textContent = "Share"; }, 2000); }} style={{background: "transparent", color: "#9ca3af", padding: "4px 12px", borderRadius: "6px", fontSize: "0.8rem", border: "1px solid #374151", cursor: "pointer"}}>Share</button>
      </div>
      {/* Benchmark Profile Selector */}
      <div className="flex items-center gap-3 mb-4 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
        <label className="text-sm font-medium text-gray-600 whitespace-nowrap">Benchmark Profile:</label>
        <select value={benchmarkProfile || "M&A-Ready (PSF)"} onChange={e => onBenchmarkChange(e.target.value)} className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-[#f2a71b] focus:border-[#f2a71b]">
          {Object.keys(BENCHMARK_PROFILES).map(k => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>
      <button onClick={onCompare} className="px-4 py-2 text-sm font-medium text-[#f2a71b] bg-amber-900/10 border border-[#f2a71b]/30 rounded-lg hover:bg-[#f2a71b]/10">Insights</button>
      </div>
      </div>
      {/* Section Navigation */}
      <div className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm border-b border-gray-200 -mx-6 px-6 py-2 mb-4 flex flex-wrap sm:flex-nowrap gap-1 overflow-x-auto">
        {[["scores","Scores","Overall maturity scores by dimension"],["gaps","Gap Analysis","Priority gaps and improvement areas"],["roadmap","Roadmap","Improvement action roadmap"],["scenario","Scenarios","What-if scenario modeling"],["charts","Charts","Visual charts and radar plots"],["heatmap","Heatmap","Driver-level heatmap view"],["export","Export & Reports","Export and download reports"]].map(([id,label,tip]) => (
            <button title={(!isPremium && !isDemoFirm && GATED_TABS.includes(id)) ? `${tip} \u2014 available with Premium` : tip} key={id} onClick={() => setActiveTab(id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${activeTab === id ? "bg-[#f2a71b] text-white shadow-sm" : "text-gray-600 hover:text-[#f2a71b] hover:bg-amber-50"} ${(!isPremium && !isDemoFirm) && GATED_TABS.includes(id) ? "opacity-60" : ""}`}>{label}{(!isPremium && !isDemoFirm) && GATED_TABS.includes(id) && <Lock className="w-3 h-3 ml-1 inline opacity-50" />}</button>
        ))}
      </div>
      {/* Dashboard Guidance */}
      {!dashBannerDismissed && (
      <div className="bg-blue-50/60 border border-blue-200/50 rounded-lg p-3 mb-4 relative">
          <button onClick={() => { setDashBannerDismissed(true); localStorage.setItem('gdmf_dismiss_dash_banner', '1'); }} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Dismiss"><X size={14} /></button>
        <div className="flex gap-3">
          <Info size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-gray-600">
            <strong>How to use this dashboard:</strong> The executive summary shows your overall readiness. Use the <strong>Benchmark Profile</strong> selector above to compare against different industry standards. Scroll through sections using the navigation bar, or click <strong>Insights</strong> to compare across assessments. The Gap Analysis and Improvement Roadmap highlight where to focus for maximum impact on firm value.
          </div>
        </div>
      </div>
      )}
      {/* Unified Score Display */}
 <div id="dash-scores" style={{ display: activeTab === "scores" ? "block" : "none" }} className="scroll-mt-16 mb-6">
        {/* Executive Summary */}
        {(() => {
          const themeArr = FRAMEWORK.themes.map(t => ({name: t.name, pct: scores.themeScores[t.id]?.pct || 0, gap: (activeBenchmark[t.id] || 65) - (scores.themeScores[t.id]?.pct || 0)}));
          const strengths = [...themeArr].sort((a,b) => b.pct - a.pct).slice(0,3);
          const gaps = [...themeArr].filter(t => t.gap > 0).sort((a,b) => b.gap - a.gap).slice(0,3);
          const critCount = themeArr.filter(t => t.gap > 20).length;
          const totalMetrics = FRAMEWORK.themes.reduce((s,t) => s + t.metrics.length, 0);
          return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Top row: scores */}
              <div className="p-6 border-b border-gray-100">
                {(() => {
                  const rawPct = scores.totalMaxPossible > 0 ? Math.round((scores.totalScore / scores.totalMaxPossible) * 100) : 0;
                  const readyPct = scores.readinessScore;
                  const level = scores.readinessLevel;
                  const ringColor = level === "M&A Ready" ? "#16a34a" : level === "Nearly Ready" ? "#3b82f6" : level === "In Progress" ? "#d97706" : "#ef4444";
                  const outerR = 88, outerStroke = 14, innerR = 64, innerStroke = 12;
                  const outerCirc = 2 * Math.PI * outerR;
                  const innerCirc = 2 * Math.PI * innerR;
                  return (
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      {/* Concentric Rings */}
                      <div className="relative flex-shrink-0">
                        <svg width="240" height="240" className="-rotate-90">
                          <circle cx="120" cy="120" r={outerR} fill="none" stroke="#e2e8f0" strokeWidth={outerStroke} />
                          <circle cx="120" cy="120" r={outerR} fill="none" stroke={ringColor} strokeWidth={outerStroke}
                            strokeDasharray={outerCirc} strokeDashoffset={outerCirc - (readyPct / 100) * outerCirc} strokeLinecap="round"
                            style={{ transition: "stroke-dashoffset 1s ease" }} />
                          <circle cx="120" cy="120" r={innerR} fill="none" stroke="#e2e8f0" strokeWidth={innerStroke} />
                          <circle cx="120" cy="120" r={innerR} fill="none" stroke="#8b5cf6" strokeWidth={innerStroke}
                            strokeDasharray={innerCirc} strokeDashoffset={innerCirc - (rawPct / 100) * innerCirc} strokeLinecap="round"
                            style={{ transition: "stroke-dashoffset 1s ease" }} />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="text-3xl font-bold" style={{ color: ringColor }}>{readyPct}%</div>
                          <div className="text-xs font-semibold text-gray-500">{level}</div>
                        </div>
                      </div>
                      {/* Score Details */}
                      <div className="flex-1 text-center sm:text-left">
                        <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">M&A Readiness Score</div>
                        <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start mb-3">
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-lg border border-amber-200">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#f2a71b]" />
                            <span className="text-sm font-bold text-gray-700">{rawPct}%</span>
                            <span className="text-xs text-gray-500">Raw Score</span>
                          </div>
                          <ArrowRight size={16} className="text-gray-400" />
                          <div className="text-xs text-gray-500 px-2 py-1 bg-gray-50 rounded border border-gray-200">{benchmarkProfile || "M&A-Ready (PSF)"} weighting</div>
                          <ArrowRight size={16} className="text-gray-400" />
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border" style={{ backgroundColor: ringColor + "10", borderColor: ringColor + "40" }}>
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ringColor }} />
                            <span className="text-sm font-bold" style={{ color: ringColor }}>{readyPct}%</span>
                            <span className="text-xs text-gray-500">Readiness</span>
                          </div>
                        </div>
                        <div className="flex gap-4 text-xs text-gray-400">
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#f2a71b] inline-block" /> Inner ring = Raw Score</span>
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: ringColor }} /> Outer ring = M&A Readiness</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
              {/* Bottom row: insights grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100">
                <div className="p-4">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Top Strengths</div>
                  {strengths.map((s,i) => (
                    <div key={i} className="flex items-center gap-2 mb-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                      <span className="text-xs text-gray-700 truncate">{s.name}</span>
                      <span className="text-xs font-bold text-green-600 ml-auto">{Math.round(s.pct)}%</span>
                    </div>
                  ))}
                </div>
                <div className="p-4">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Largest Gaps</div>
                  {gaps.map((g,i) => (
                    <div key={i} className="flex items-center gap-2 mb-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                      <span className="text-xs text-gray-700 truncate">{g.name}</span>
                      <span className="text-xs font-bold text-red-500 ml-auto">-{Math.round(g.gap)}%</span>
                    </div>
                  ))}
                  {gaps.length === 0 && <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg"><CheckCircle2 size={14} className="text-green-600 flex-shrink-0" /><span className="text-xs text-green-700 font-medium">All dimensions exceeding M&A benchmarks</span></div>}
                </div>
                <div className="p-4">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Actions Needed</div>
                  <div className="text-2xl font-bold text-gray-800">{critCount}</div>
                  <div className="text-xs text-gray-500">critical priorities</div>
                  <div className="text-xs text-gray-400 mt-1">{themeArr.filter(t => t.gap > 0).length} of {themeArr.length} dimensions below benchmark</div>
                </div>
                <div className="p-4">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Completion</div>
                  <div className="text-2xl font-bold text-gray-800">{scores.ratedCount}/{totalMetrics}</div>
                  <div className="text-xs text-gray-500">metrics rated</div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                    <div className="h-1.5 rounded-full bg-[#f2a71b]" style={{width: Math.round((scores.ratedCount/totalMetrics)*100) + "%"}} />
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
        {(!isPremium && !isDemoFirm) && <UpgradeBanner bannerKey="scores" onUpgrade={openContactModal} />}
      </div>

      {/* Gap Analysis */}
      <div id="dash-gaps" style={{ display: activeTab === "gaps" ? "block" : "none" }} className="scroll-mt-16"><GapAnalysisPanel themeGaps={scores.themeGaps} />{!isPremium && <UpgradeBanner bannerKey="gaps" onUpgrade={openContactModal} />}</div>

      {/* Trend Analysis */}
      <div style={{ display: activeTab === "gaps" ? "block" : "none" }}><TrendAnalysisPanel firmAssessments={firmAssessments} /></div>
      {/* Score Change History */}
      <div style={{ display: activeTab === "gaps" ? "block" : "none" }}><ScoreChangePanel currentAssessment={assessment} previousAssessment={previousAssessment} /></div>
      <div id="dash-roadmap" style={{ display: activeTab === "roadmap" ? "block" : "none" }} className="scroll-mt-16">{(isPremium || isDemoFirm) ? <ImprovementRoadmap assessment={assessment} benchmarkProfile={benchmarkProfile}/> : <UpgradePrompt feature="roadmap" onUpgrade={openContactModal} />}</div>
      <div id="dash-scenario" style={{ display: activeTab === "scenario" ? "block" : "none" }} className="scroll-mt-16">{(isPremium || isDemoFirm) ? <ScenarioPanel assessment={assessment} benchmarkProfile={benchmarkProfile}/> : <UpgradePrompt feature="scenario" onUpgrade={openContactModal} />}</div>
      {activeTab === "export" && (!isPremium && !isDemoFirm) && <UpgradePrompt feature="export" onUpgrade={openContactModal} />}
        {activeTab === "export" && (isPremium || isDemoFirm) && <>
        {!leadInfo ? (
          <div style={{background: "rgba(242,167,27,0.06)", border: "1px solid rgba(242,167,27,0.25)", borderRadius: "12px", padding: "24px", marginBottom: "16px", textAlign: "center"}}>
            <h3 style={{fontSize: "1.1rem", fontWeight: "700", color: "#f5f5f5", margin: "0 0 4px"}}>Get Your Assessment Report</h3>
            <p style={{fontSize: "0.85rem", color: "#9ca3af", margin: "0 0 16px"}}>Enter your details to unlock PDF and executive summary exports</p>
            <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.target); const info = {name: fd.get("leadName"), email: fd.get("leadEmail"), company: fd.get("leadCompany")}; localStorage.setItem("gdmf_lead", JSON.stringify(info)); setLeadInfo(info); track("Lead Captured", { email: info.email }); supabase.from("leads").insert({ name: info.name, email: info.email, company: info.company || null, source_context: "dashboard_export" }).then(() => {}); }} style={{display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", maxWidth: "500px", margin: "0 auto"}}>
              <input name="leadName" required placeholder="Your name" style={{flex: "1 1 140px", padding: "8px 12px", borderRadius: "6px", border: "1px solid #374151", background: "#1f2937", color: "#f5f5f5", fontSize: "0.85rem"}} />
              <input name="leadEmail" type="email" required placeholder="Email address" style={{flex: "1 1 180px", padding: "8px 12px", borderRadius: "6px", border: "1px solid #374151", background: "#1f2937", color: "#f5f5f5", fontSize: "0.85rem"}} />
              <input name="leadCompany" placeholder="Company (optional)" style={{flex: "1 1 140px", padding: "8px 12px", borderRadius: "6px", border: "1px solid #374151", background: "#1f2937", color: "#f5f5f5", fontSize: "0.85rem"}} />
              <button type="submit" style={{padding: "8px 24px", background: "#f2a71b", color: "#1a1a2e", borderRadius: "8px", fontWeight: "600", fontSize: "0.9rem", border: "none", cursor: "pointer", whiteSpace: "nowrap"}}>Unlock Reports</button>
            </form>
            <p style={{fontSize: "0.75rem", color: "#6b7280", margin: "8px 0 0"}}>Your details help us provide the best assessment experience</p>
          </div>
        ) : (
          <p style={{fontSize: "0.8rem", color: "#9ca3af", textAlign: "right", margin: "0 0 8px"}}>Generating reports as {leadInfo.name}</p>
        )}
      {/* Theme Score Summary Strip */}
      <h4 className="text-sm font-medium text-gray-500 mb-2">Current Assessment Scores</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-4">
        {FRAMEWORK.themes.map(t => {
          const ts = scores.themeScores[t.id];
          const pct = ts?.pct || 0;
          return (
            <div key={t.id} className="bg-white rounded-lg border border-gray-200 p-2 text-center border-t-2 hover:shadow-md transition-all" style={{ borderTopColor: t.color }}>
              <div className="text-xs font-medium truncate" style={{ color: t.color }}>{t.name}</div>
              <div className="text-lg font-bold mt-0.5" style={{ color: pct >= 66 ? "#16A34A" : pct >= 33 ? "#D97706" : "#DC2626" }}>{Math.round(pct)}%</div>
            </div>
          );
        })}
      </div>
      </>}
      {/* Charts */}
      <div id="dash-charts" style={{ display: activeTab === "charts" ? "grid" : "none" }} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 scroll-mt-16">
        <RadarOverview radarData={radarData} benchmarkProfile={benchmarkProfile} />
        <BenchmarkComparison scores={scores} benchmarkProfile={benchmarkProfile} />
      </div>
      <div className="mb-4"><div style={{ display: activeTab === "charts" ? "block" : "none" }}><StrengthsWeaknesses ratings={assessment.ratings} /></div></div>
      <div id="dash-heatmap" style={{ display: activeTab === "heatmap" ? "block" : "none" }} className="mb-4 scroll-mt-16"><HeatmapGrid ratings={assessment.ratings} /></div>
      <div id="dash-export" style={{ display: activeTab === "export" && (isPremium || isDemoFirm) ? "block" : "none" }} className="scroll-mt-16"><ExportPanel assessment={assessment} firmName={firmName} firmSector={firmSector} scores={scores} benchmarkProfile={benchmarkProfile} /></div>
    </div>
  );
}

// -----------------------------------------------------------------------
// MAIN APP
// -----------------------------------------------------------------------
// ———— Guidance Page ————————————————————————————————————————
const GuidancePage = ({ onBack }) => {
  const sections = [
    { title: "What is the GrowthLens?", image: "guide-firms.jpg", content: "The GrowthLens is an M&A due diligence assessment platform designed for professional services firms (PSFs). It evaluates your firm across 10 growth themes and 57 metrics, benchmarked against M&A-ready industry standards. The framework helps you understand where your firm stands relative to what acquirers look for when pricing transactions." },
    { title: "How the Assessment Works", image: "guide-assessment.jpg", content: "Each of the 57 metrics is rated on a 3-point maturity scale: Level 1 (Foundational) means basic or informal processes are in place. Level 2 (Evolving) means structured processes exist with some consistency. Level 3 (Optimised) means best-in-class, systematic, and measurable practices are embedded. Your scores are aggregated by dimension and compared against M&A-Ready benchmarks based on professional assessment of best-in-class performance standards for professional services firms." },
    { title: "Understanding the Dashboard", image: "guide-dashboard.jpg", content: "The dashboard provides multiple views of your assessment: the M&A Readiness Score shows your overall readiness as a percentage inside a donut chart. The Radar Overview compares your dimension scores against M&A-Ready benchmarks. The Readiness Gap Analysis ranks dimensions by their gap to benchmark. The Improvement Roadmap shows where focused effort will have the most impact. The Scenario Modelling tool lets you drag sliders to project how improvements would affect your overall score." },
    { title: "Benchmark Profiles", image: "guide-benchmark.jpg", content: "Benchmarks represent top-quartile PSF performance — the level that acquirers price for at M&A transaction events. The default M&A-Ready (PSF) benchmark averages 67% across all dimensions. You can compare against different benchmark profiles including Top Decile, Industry Average, and sector-specific standards via the Benchmark Profile selector on the dashboard." },
    { title: "Using the Insights Tab", image: "guide-insights.jpg", content: "The Insights tab (accessible from the dashboard) shows how your firm measures against all available benchmark profiles simultaneously. Green indicates M&A Ready (\u226590%), amber indicates Nearly Ready (\u226570%), and scores below 70% indicate areas needing focused improvement. Use Assessment Comparison to track progress over time once you have multiple assessments." },
    { title: "Exporting Your Results", image: "guide-export.jpg", content: "Three export options are available from the dashboard: Executive Summary (1 Page) provides a concise overview suitable for board presentations. Export PDF Report generates a comprehensive document with all charts and data. Detailed Assessment Report includes the full metric-level breakdown. You can also download raw data as CSV for further analysis." }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 transition-colors"><ArrowLeft size={20} /></button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><BookOpen size={24} className="text-[#f2a71b]" /> Framework Guidance</h1>
          <p className="text-sm text-gray-500">How to use the GrowthLens</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm border-l-4 border-l-amber-400">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3"><BookOpen size={16} className="text-[#f2a71b]" /> Contents</h3>
          <div className="flex flex-wrap gap-2">

              <a href="#guidance-quickstart" onClick={e => { e.preventDefault(); document.getElementById("guidance-quickstart").scrollIntoView({behavior: "smooth"}) }}
                className="text-xs px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors cursor-pointer border border-amber-200"
              >Quick Start Guide</a>
            {sections.map((sec, idx) => (
              <a key={idx} href={`#guidance-${idx}`} onClick={(e) => { e.preventDefault(); document.getElementById(`guidance-${idx}`).scrollIntoView({ behavior: 'smooth' }); }}
                className="text-xs px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors cursor-pointer border border-amber-200">
                {sec.title}
              </a>
            ))}
              <a href="#guidance-deepdives" onClick={e => { e.preventDefault(); document.getElementById("guidance-deepdives").scrollIntoView({behavior: "smooth"}) }}
                className="text-xs px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors cursor-pointer border border-amber-200"
              >Dimension Deep Dives</a>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm" id="guidance-quickstart">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-[#f2a71b]" /> Quick Start Guide
          </h2>
          <div className="space-y-3">
            {[
              ["1. Create a Firm", "Navigate to the Firms tab and click '+ New Firm'. Enter the firm name and select its sector for automatic benchmark matching."],
              ["2. Start Assessment", "Click the firm, then '+ New Assessment'. Work through each dimension, rating metrics on the 3-point scale (Foundational / Evolving / Optimised)."],
              ["3. Add Evidence", "For each rating, expand the Evidence section to attach supporting links or notes. This builds credibility for due diligence reviews."],
              ["4. Set Confidence", "Rate your confidence (Low / Medium / High) for each metric. Low confidence flags areas needing further investigation."],
              ["5. Review Dashboard", "Once rated, open the Dashboard to see your M&A Readiness Score, gap analysis, and improvement roadmap."],
              ["6. Model Scenarios", "Use Scenario Modelling to see how improving specific dimensions would change your overall readiness score."]
            ].map(([step, desc], i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-[#f2a71b] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</div>
                <div><span className="text-sm font-semibold text-gray-800">{step.replace(/^\d+\.\s/, '')}</span><span className="text-sm text-gray-500"> {"—"} {desc}</span></div>
              </div>
            ))}
          </div>
        </div>

        {sections.map((s, i) => (
          <div key={i} id={`guidance-${i}`} className="scroll-mt-4 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Info size={18} className="text-[#f2a71b]" /> {s.title}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">{s.content}</p>
          </div>
        ))}

        {/* Theme Deep Dives */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6" id="guidance-deepdives">
          <h2 className="text-xl font-bold text-[#1f1f1f] mb-2 flex items-center gap-2">
            <TrendingUp size={22} className="text-[#f2a71b]" />
            Dimension Deep Dives
          </h2>
          <p className="text-sm text-gray-600 mb-4">Explore each growth dimension in detail with industry benchmarks, real-world case studies, and maturity progression insights for professional services firms.</p>
          <div className="space-y-3">
            {FRAMEWORK.themes.map(theme => {
              const eg = ENHANCED_GUIDANCE.themes[theme.id];
              if (!eg) return null;
              return (
                <details key={theme.id} className="border border-gray-200 rounded-xl overflow-hidden">
                  <summary className="cursor-pointer p-4 flex items-center gap-3 hover:bg-gray-50 select-none" style={{borderLeft: `4px solid ${theme.color}`}}>
                    <span className="font-semibold text-[#1f1f1f]">{theme.name}</span>
                    <span className="ml-auto text-xs text-gray-400 tabular-nums">{theme.metrics.length} metrics</span>
                  </summary>
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <div className="mt-3">
                      <h4 className="font-semibold text-sm text-[#1f1f1f] mb-1">Why This Matters for M&A</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">{eg.overview}</p>
                    </div>
                    <div className="mt-3">
                      <h4 className="font-semibold text-sm text-[#1f1f1f] mb-2">Key Benchmarks</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-1 pr-3 font-medium text-gray-500">Metric</th>
                              <th className="text-left py-1 font-medium text-gray-500">Target</th>
                            </tr>
                          </thead>
                          <tbody>
                            {eg.keyBenchmarks.map((b, i) => (
                              <tr key={i} className="border-b border-gray-100">
                                <td className="py-1.5 pr-3 text-[#1f1f1f]">{b.metric}</td>
                                <td className="py-1.5 font-medium text-[#f2a71b]">{b.target}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="mt-3">
                      <h4 className="font-semibold text-sm text-[#1f1f1f] mb-1">Case Study</h4>
                      <div className="bg-gray-50 rounded-lg p-3 text-xs">
                        <p className="font-medium text-[#1f1f1f] mb-1">{eg.caseStudy.title}</p>
                        <p className="text-gray-600 mb-2">{eg.caseStudy.scenario}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div className="bg-white rounded p-2 border border-gray-200">
                            <p className="font-medium text-red-600 text-[10px] uppercase tracking-wide mb-0.5">Foundational</p>
                            <p className="text-gray-600 text-[11px] leading-relaxed">{eg.caseStudy.foundational}</p>
                          </div>
                          <div className="bg-white rounded p-2 border border-gray-200">
                            <p className="font-medium text-amber-600 text-[10px] uppercase tracking-wide mb-0.5">Evolving</p>
                            <p className="text-gray-600 text-[11px] leading-relaxed">{eg.caseStudy.evolution}</p>
                          </div>
                          <div className="bg-white rounded p-2 border border-gray-200">
                            <p className="font-medium text-green-600 text-[10px] uppercase tracking-wide mb-0.5">Optimised</p>
                            <p className="text-gray-600 text-[11px] leading-relaxed">{eg.caseStudy.optimised}</p>
                          </div>
                        </div>
                        <p className="text-gray-600 mt-2"><span className="font-medium text-[#1f1f1f]">Outcome:</span> {eg.caseStudy.outcome}</p>
                      </div>
                    </div>
                  </div>
                </details>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Award size={18} className="text-[#f2a71b]" /> Assessment Best Practices
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              ["Be Honest", "Rate where the firm actually is, not where it aspires to be. Accurate baselines drive meaningful roadmaps."],
              ["Use Evidence", "Attach links to documents, reports, or data that support each rating. Evidence-backed assessments carry more weight."],
              ["Involve Stakeholders", "Have department leads rate their own areas. Cross-referencing perspectives improves accuracy."],
              ["Reassess Quarterly", "Track progress over time by creating new assessments. The Insights tab compares across assessments."]
            ].map(([title, desc], i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-sm font-semibold text-gray-800 mb-1">{title}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2"><BookOpen size={18} className="text-gray-600" /> Research Foundation & Industry Context</h2>
          <p className="text-sm text-gray-600 mb-4">This framework's benchmarks, scoring models, and best practices have been developed through extensive analysis of professional services industry research, including perspectives from:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0.5">
            {[
              "EY – Global M&A Integration Handbook",
              "McKinsey & Company – Creating Value Through M&A",
              "Bain & Company – Global Private Equity Report",
              "Deloitte – M&A Trends Report (Annual)",
              "PwC – Global M&A Industry Trends",
              "KPMG – M&A Integration & Carve-Out Insights",
              "BCG – Value Creation in Private Equity",
              "Harvard Business Review – M&A Research Series",
              "MIT Sloan Management Review – Org. Design",
              "Mercer – People Risks in M&A Transactions",
              "Willis Towers Watson – M&A Retention Study",
              "Aon – Human Capital M&A Research",
              "Gartner – IT Due Diligence Framework",
              "Forrester – Technology M&A Integration",
              "SHRM – Culture & HR Due Diligence",
              "The Conference Board – CEO Challenge Survey",
              "Oliver Wyman – Strategic Due Diligence",
              "Accenture – Growth-Driven M&A",
              "S&P Global – Market Intelligence Data",
              "Pitchbook – Private Equity & M&A Analytics",
              "Dealogic – Global M&A Market Data",
              "CFA Institute – M&A Valuation Best Practices"
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2 py-0.5">
                <div className="w-1 h-1 rounded-full bg-gray-400 shrink-0" />
                <span className="text-xs text-gray-600">{s}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4 italic">Benchmarks in this framework are based on professional assessment of best-in-class performance standards for growth-oriented professional services firms.</p>
        </div>
        <div className="bg-amber-50 rounded-lg border border-amber-200 p-6">
          <h2 className="text-lg font-bold text-amber-800 mb-2">Need Help?</h2>
          <p className="text-sm text-amber-700">Start by selecting a firm from the Firms tab, create a new assessment, and rate each metric honestly based on your current capabilities. The dashboard will automatically calculate your M&A Readiness Score and highlight areas for improvement.</p>
        </div>
        <div className="text-center pt-6 pb-2">
          <button onClick={() => document.getElementById('guidance-0')?.scrollIntoView({behavior: 'smooth'})} className="text-sm text-amber-600 hover:text-amber-800 font-medium transition-colors cursor-pointer">↑ Back to Top</button>
        </div>
      </div>
    </div>
  );
};


// ─── ContactView ────────────────────────────────────────────

// ContactView - Advisory intro with contact form
function ContactView() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const { error: dbError } = await supabase.from('contact_submissions').insert([{
        name: formData.name,
        email: formData.email,
        message: formData.message,
        source_context: 'app_contact',
        user_id: user?.id || null,
      }]);
      if (dbError) throw dbError;
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Advisory Intro */}
      <div className="text-center mb-10">
        <div className="w-32 h-32 mx-auto mb-4 rounded-full border-4 border-amber-400 shadow-lg overflow-hidden">
          <img
            src="https://xbrywtjahuidaufcdvti.supabase.co/storage/v1/object/public/images/Portrait%20Photo.png"
            alt="Richard Goold"
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Richard Goold</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-4">
          Supporting founders, CEOs and boards build, scale and prepare their firms for successful outcomes through coaching, M&A readiness support and advisory.
        </p>
        <div className="flex items-center justify-center gap-3">
          <a href="https://richardgoold.com" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Globe className="w-4 h-4" /> Website
          </a>
          <a href="https://www.linkedin.com/in/richardgooldofficial/" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <ExternalLink className="w-4 h-4" /> LinkedIn
          </a>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Get in Touch</h3>
        {submitted ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-gray-900 font-medium">Message sent!</p>
            <p className="text-gray-500 text-sm mt-1">Richard will be in touch shortly.</p>
            <button onClick={() => setSubmitted(false)} className="mt-4 text-sm text-amber-600 hover:text-amber-700 font-medium">
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" required value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-colors"
                placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" required value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-colors"
                placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea required rows={4} value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-colors resize-none"
                placeholder="How can Richard help?" />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button type="submit" disabled={submitting}
              className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-white font-bold rounded-lg shadow transition-colors disabled:opacity-50">
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}


export default function App() {
  const { user, signOut, isPremium, profile , isAdmin , updatePassword } = useAuth();
  const navigate = useNavigate();
  const { openContactModal } = useContactModal();
  const [state, setState] = useState(() => {
    return getInitialState();
  });
  // Supabase data layer
  const sbData = useSupabaseData();
  // When Supabase data loads, sync it into state (replaces localStorage as primary)
  useEffect(() => {
    if (!sbData.loading && sbData.state.firms.length > 0) {
      setState(sbData.state);
    }
  }, [sbData.loading]);
  const [view, setView] = useState("firms");
  const [selectedFirmId, setSelectedFirmId] = useState(null);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);
  const [dashboardAssessmentId, setDashboardAssessmentId] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem("gdmf_onboarding_complete"));
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [recentlyDeleted, setRecentlyDeleted] = useState(() => {
    try { return JSON.parse(localStorage.getItem('gdmf_deleted') || '[]'); } catch { return []; }
  });
  const [undoToast, setUndoToast] = useState(null);

  const [benchmarkProfile, setBenchmarkProfile] = useState(() => { const firm = state.firms?.find(f => f.id === selectedFirmId); return SECTOR_BENCHMARK_MAP[firm?.sector] || "M&A-Ready (PSF)"; });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUpgradeFor, setShowUpgradeFor] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", new_pw: "", confirm: "" });
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwShowNew, setPwShowNew] = useState(false);
  const [upgradeToast, setUpgradeToast] = useState(false);
  const prevTierRef = useRef(profile?.tier);

  useEffect(() => {
    const prev = prevTierRef.current;
    const next = profile?.tier;
    if (prev === 'free' && next === 'premium') {
      setUpgradeToast(true);
      setTimeout(() => setUpgradeToast(false), 10000);
    }
    prevTierRef.current = next;
  }, [profile?.tier]);
  useEffect(() => { saveState(state); }, [state]);
  // Debounced Supabase sync for assessment ratings
  useEffect(() => {
    if (!user?.id || !state.assessments) return;
    const timer = setTimeout(() => {
      Object.entries(state.assessments).forEach(([id, assessment]) => {
        if (assessment && assessment.ratings) {
          supabase.from('assessments').update({ ratings: assessment.ratings }).eq('id', id).then(r => r.error && console.error('Supabase rating sync error:', r.error));
        }
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, [JSON.stringify(state.assessments)]); // localStorage backup
  useEffect(() => { localStorage.setItem('gdmf_deleted', JSON.stringify(recentlyDeleted)); }, [recentlyDeleted]);
  useEffect(() => { setRecentlyDeleted(rd => rd.filter(item => Date.now() - item.timestamp < 30 * 24 * 60 * 60 * 1000)); }, []);

  // One-time migration: backfill demo assessments with missing metrics
  useEffect(() => {
    const demoData = generateDemoData();
    const DEMO_FIRM_RATINGS = {
      "Apex Consulting Partners": demoData.assessments.demo_apex_a1.ratings,
      "TechBridge Solutions": demoData.assessments.demo_techbridge_a1.ratings,
      "Phoenix Advisory Group": demoData.assessments.demo_phoenix_a1.ratings,
    };
    const allMetricIds = FRAMEWORK.themes.flatMap(t => t.metrics.map(m => m.id));
    setState(s => {
      let changed = false;
      const newAssessments = { ...s.assessments };
      s.firms.forEach(firm => {
        const demoRatings = DEMO_FIRM_RATINGS[firm.name];
        if (!demoRatings) return;
        Object.entries(newAssessments).forEach(([key, assessment]) => {
          if (assessment.firmId !== firm.id) return;
          const ratings = assessment.ratings || {};
          const ratedIds = Object.keys(ratings).filter(k => ratings[k]?.level);
          if (ratedIds.length >= allMetricIds.length) return;
          const newRatings = { ...ratings };
          allMetricIds.forEach(mid => {
            if (!newRatings[mid] || !newRatings[mid].level) {
              if (demoRatings[mid]) { newRatings[mid] = demoRatings[mid]; changed = true; }
            }
          });
          newAssessments[key] = { ...assessment, ratings: newRatings };
        });
      });
      if (!changed) return s;
      return { ...s, assessments: newAssessments };
    });
  }, []);

  const createFirm = (firm) => { setState(s => ({ ...s, firms: [...s.firms, firm] })); supabase.from('firms').insert({ id: firm.id, user_id: user?.id, name: firm.name, sector: firm.sector }).then(r => r.error && console.error('Supabase firm insert error:', r.error)); };
  const deleteFirm = (id) => {
    const firm = state.firms.find(f => f.id === id);
    const firmAssessmentsCopy = {};
    Object.keys(state.assessments).forEach(k => { if (state.assessments[k].firmId === id) firmAssessmentsCopy[k] = state.assessments[k]; });
    setConfirmDialog({
      title: "Delete Firm",
      message: `Are you sure you want to delete "${firm?.name || "this firm"}" and all its assessments?`,
      onConfirm: () => {
        const snapshot = { type: 'firm', id, name: firm?.name || 'Firm', data: { firm, assessments: firmAssessmentsCopy }, timestamp: Date.now() };
        setRecentlyDeleted(rd => [snapshot, ...rd]);
        setState(s => {
          const assessments = { ...s.assessments };
          Object.keys(assessments).forEach(k => { if (assessments[k].firmId === id) delete assessments[k]; });
          return { firms: s.firms.filter(f => f.id !== id), assessments };
        });
        // Persist to Supabase
        supabase.from('firms').delete().eq('id', id).then(r => r.error && console.error('Supabase firm delete error:', r.error));
        setConfirmDialog(null);
        setSelectedFirmId(null);
        setView("firms");
        setUndoToast({ message: `"${firm?.name || 'Firm'}" deleted`, onUndo: () => {
          setState(s => ({ firms: [...s.firms, firm], assessments: { ...s.assessments, ...firmAssessmentsCopy } }));
          setRecentlyDeleted(rd => rd.filter(item => !(item.type === 'firm' && item.id === id && item.timestamp === snapshot.timestamp)));
          setUndoToast(null);
        }, onExpire: () => setUndoToast(null) });
      },
      onCancel: () => setConfirmDialog(null),
    });
  };
  const deleteAssessment = (assessmentId) => {
    const assessment = state.assessments[assessmentId];
    const firm = state.firms.find(f => f.id === assessment?.firmId);
    setConfirmDialog({
      title: "Delete Assessment",
      message: "Are you sure you want to delete this assessment? All ratings and evidence will be removed.",
      onConfirm: () => {
        const snapshot = { type: 'assessment', id: assessmentId, name: `Assessment for ${firm?.name || 'Unknown'}`, data: { assessment: { ...assessment, _key: assessmentId } }, timestamp: Date.now() };
        setRecentlyDeleted(rd => [snapshot, ...rd]);
        setState(prev => {
          const newAssessments = { ...prev.assessments };
          delete newAssessments[assessmentId];
          return { ...prev, assessments: newAssessments };
        });
    // Persist to Supabase
    supabase.from('assessments').delete().eq('id', assessmentId).then(r => r.error && console.error('Supabase assessment delete error:', r.error));
        setConfirmDialog(null);
        setUndoToast({ message: "Assessment deleted", onUndo: () => {
          setState(s => ({ ...s, assessments: { ...s.assessments, [assessmentId]: assessment } }));
          setRecentlyDeleted(rd => rd.filter(item => !(item.type === 'assessment' && item.id === assessmentId && item.timestamp === snapshot.timestamp)));
          setUndoToast(null);
        }, onExpire: () => setUndoToast(null) });
      },
      onCancel: () => setConfirmDialog(null),
    });
  };

  const restoreItem = (item) => {
    if (item.type === 'firm') {
      setState(s => ({ firms: [...s.firms, item.data.firm], assessments: { ...s.assessments, ...item.data.assessments } }));
    } else if (item.type === 'assessment') {
      const a = item.data.assessment;
      setState(s => ({ ...s, assessments: { ...s.assessments, [a._key]: a } }));
    }
    setRecentlyDeleted(rd => rd.filter(r => !(r.id === item.id && r.timestamp === item.timestamp)));
  };

  const exportData = () => {
    const data = { version: 1, exportedAt: new Date().toISOString(), state };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gdmf-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          const importState = data.state || data;
          if (!importState.firms || !importState.assessments) {
            alert("Invalid backup file: missing firms or assessments data.");
            return;
          }
          setConfirmDialog({
            title: "Import Data",
            message: `This will replace all current data with the backup from ${data.exportedAt ? new Date(data.exportedAt).toLocaleDateString("en-GB") : "unknown date"}. This includes ${importState.firms.length} firm(s) and ${Object.keys(importState.assessments).length} assessment(s). Continue?`,
            confirmLabel: "Import",
            variant: "warning",
            onConfirm: () => { setState(importState); setConfirmDialog(null); },
            onCancel: () => setConfirmDialog(null),
          });
        } catch (err) {
          alert("Could not read backup file. Please ensure it is a valid GDMF backup JSON file.");
        }
      };
      reader.readAsText(file);
    };
    input.click();
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
    // Persist to Supabase
    if (user?.id) { supabase.from('assessments').insert({ id, firm_id: firmId, user_id: user?.id, ratings, benchmark_profile: 'Professional Services' }).then(r => r.error && console.error('Supabase assessment insert error:', r.error)); }
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
    { id: "guidance", label: "Guidance", icon: BookOpen },
    { id: "contact", label: "Contact", icon: MessageSquare },
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

  // ISS-016: Dynamic page title
  useEffect(() => {
    const titles = { firms: 'Firms', dashboard: 'Dashboard', assess: 'Assessment', settings: 'Settings' };
    document.title = view ? `GrowthLens —  ${titles[view] || view.charAt(0).toUpperCase() + view.slice(1)}` : 'GrowthLens';
  }, [view]);

  // Load Google Fonts for brand typography
  useEffect(() => {
    if (!document.getElementById("brand-fonts")) {
      const link = document.createElement("link");
      link.id = "brand-fonts";
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Arimo:ital,wght@0,400;0,500;0,600;1,400&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  const handleChangePassword = async () => {
    setPwError("");
    if (!pwForm.new_pw || !pwForm.confirm) { setPwError("Please fill in all fields."); return; }
    if (pwForm.new_pw.length < 8) { setPwError("New password must be at least 8 characters."); return; }
    if (pwForm.new_pw !== pwForm.confirm) { setPwError("New passwords do not match."); return; }
    setPwLoading(true);
    const { error } = await updatePassword(pwForm.new_pw);
    setPwLoading(false);
    if (error) { setPwError(error.message); return; }
    setPwSuccess(true);
    setTimeout(() => { setShowChangePassword(false); setPwForm({ current: "", new_pw: "", confirm: "" }); setPwError(""); setPwSuccess(false); setPwShowNew(false); }, 2000);
  };

  return (
    <div className="h-screen flex flex-col bg-[#f9f9f9]" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {upgradeToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-white px-6 py-4 rounded-xl shadow-2xl max-w-lg animate-bounce-once">
          <span className="text-2xl flex-shrink-0">&#11088;</span>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm">You've been upgraded to Premium!</p>
            <p className="text-xs opacity-90 mt-0.5">All features are now unlocked — no need to log out.</p>
          </div>
          <button onClick={() => setUpgradeToast(false)} className="flex-shrink-0 ml-2 text-white/80 hover:text-white text-lg font-bold leading-none">&times;</button>
        </div>
      )}
      {showChangePassword && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" onClick={() => { setShowChangePassword(false); setPwForm({ current: "", new_pw: "", confirm: "" }); setPwError(""); setPwSuccess(false); }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><Lock size={18} className="text-amber-500" /> Change Password</h3>
              <button onClick={() => { setShowChangePassword(false); setPwForm({ current: "", new_pw: "", confirm: "" }); setPwError(""); setPwSuccess(false); }} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            {pwSuccess ? (
              <div className="flex flex-col items-center py-8">
                <CheckCircle2 size={48} className="text-green-500 mb-3" />
                <p className="text-green-700 font-medium">Password updated successfully</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <div className="relative">
                      <input type={pwShowNew ? "text" : "password"} value={pwForm.new_pw} onChange={e => setPwForm(p => ({ ...p, new_pw: e.target.value }))} placeholder="At least 8 characters" className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
                      <button type="button" onClick={() => setPwShowNew(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{pwShowNew ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input type="password" value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} placeholder="Re-enter new password" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
                  </div>
                </div>
                {pwError && <p className="mt-3 text-sm text-red-600 flex items-center gap-1"><AlertCircle size={14} /> {pwError}</p>}
                <div className="flex gap-3 mt-6">
                  <button onClick={() => { setShowChangePassword(false); setPwForm({ current: "", new_pw: "", confirm: "" }); setPwError(""); }} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
                  <button onClick={handleChangePassword} disabled={pwLoading} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 disabled:opacity-50 rounded-lg transition-colors">{pwLoading ? "Updating…" : "Update Password"}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {showOnboarding && <OnboardingOverlay onComplete={() => setShowOnboarding(false)} />}
      {confirmDialog && <ConfirmDialog {...confirmDialog} />}
      {undoToast && <UndoToast message={undoToast.message} seconds={8} onUndo={undoToast.onUndo} onExpire={undoToast.onExpire} />}
      {showUpgradeFor && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowUpgradeFor(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white border border-gray-200 rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
            <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <Lock size={24} className="text-amber-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{showUpgradeFor} is a Pro feature</h3>
            <p className="text-sm text-gray-400 mb-6">Upgrade to GrowthLens Pro to unlock full dashboards, guidance, and detailed reporting.</p>
            <button onClick={() => { setShowUpgradeFor(null); setView("connect"); }} className="w-full py-2.5 rounded-lg text-sm font-semibold text-gray-900 transition-colors" style={{background: "#f2a71b"}}>Contact Us to Upgrade</button>
            <button onClick={() => setShowUpgradeFor(null)} className="w-full py-2 mt-2 rounded-lg text-sm text-gray-400 hover:text-gray-900 transition-colors">Maybe later</button>
          </div>
        </>
      )}
      {/* Admin banner */}
      {isAdmin && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between flex-shrink-0">
          <span className="text-sm text-amber-800">You are viewing the app as a regular user</span>
          <button onClick={() => navigate('/admin')} className="text-sm font-medium text-amber-700 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1 rounded transition-colors">
            Back to Admin
          </button>
        </div>
      )}
      {/* Header */}
      <header className="px-4 py-2.5 flex items-center justify-between flex-shrink-0 bg-white border-b border-gray-200" style={{position:"relative",zIndex:99997}}>
              <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => { setView("firms"); setSelectedFirmId(null); setSelectedAssessmentId(null); }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 200 200" className="w-8 h-8"><rect width="200" height="200" rx="32" fill="#f2a71b"/><g stroke="white" strokeWidth="6" strokeLinecap="round" fill="none"><path d="M 30,50 L 30,148 Q 30,158 40,158 L 148,158" strokeLinejoin="round"/><line x1="50" y1="158" x2="50" y2="142"/><line x1="70" y1="158" x2="70" y2="124"/><line x1="90" y1="158" x2="90" y2="102"/><line x1="110" y1="158" x2="110" y2="76"/><line x1="130" y1="158" x2="130" y2="50"/></g><circle cx="116" cy="78" r="44" fill="rgba(255,255,255,0.1)" stroke="white" strokeWidth="5" strokeLinecap="round"/><path d="M 90,50 Q 96,42 106,44" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round"/><line x1="146" y1="108" x2="170" y2="132" stroke="white" strokeWidth="6.5" strokeLinecap="round"/></svg>
              </div>
          <div>
                  <h1 className="text-sm font-bold text-gray-900 leading-tight">GrowthLens</h1>
            <p className="text-xs text-gray-500">M&A Due Diligence Assessment Platform</p>
          </div>
          {user && (<>
            <div className="relative" style={{ zIndex: 50 }}>
              <button onClick={(e) => { e.stopPropagation(); setShowProfileMenu(!showProfileMenu); }} className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-700 transition-colors">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isPremium ? 'bg-amber-100 text-amber-800' : 'bg-gray-200 text-gray-600'}`}>{isPremium ? 'Premium' : 'Free'}</span>
                <ChevronDown className="w-3 h-3 text-gray-500" />
              </button>
              {showProfileMenu && (
                <>
                <div style={{position:"fixed",inset:0,zIndex:99998,backgroundColor:"rgba(0,0,0,0.08)"}} onClick={(e) => { e.stopPropagation(); setShowProfileMenu(false); }} />
                <div className="absolute right-0 top-full mt-1 w-56 rounded-lg py-1" style={{backgroundColor:"#ffffff",zIndex:99999,boxShadow:"0 20px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1)",border:"1px solid #e5e7eb"}} onClick={(e) => e.stopPropagation()}>
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800">{profile?.full_name || 'User'}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">Current Plan</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-medium text-gray-700">{isPremium ? 'Premium' : 'Free Plan'}</span>
                      {!isPremium && <button onClick={() => { setShowProfileMenu(false); openContactModal({ subject: 'Premium Upgrade Enquiry' }); }} className="text-xs text-amber-600 hover:text-amber-700 font-medium">Upgrade</button>}
                    </div>
                  </div>
                    <button onClick={(e) => { e.stopPropagation(); setShowProfileMenu(false); setShowChangePassword(true); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 transition-colors">
                      <Lock size={14} /> Change Password
                    </button>
                  <button onClick={(e) => { e.stopPropagation(); setShowProfileMenu(false); signOut(); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
                </>
              )}
            </div>
          </>)}
        </div>
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map(n => (
            <button key={n.id}  disabled={n.disabled && !n.locked} title={n.disabled ? "Please select an assessment first" : ""} onClick={() => {
              if (n.locked) { setShowUpgradeFor(n.label); return; }
              if (n.id === "dashboard") { if (selectedAssessmentId) setDashboardAssessmentId(selectedAssessmentId); }
              if (n.id === 'firms') { setSelectedFirmId(null); setSelectedAssessmentId(null); }
              setView(n.id);
            }} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${view === n.id ? "bg-amber-50 text-amber-600 font-bold border-b-2 border-amber-400" : n.locked ? "text-gray-500 cursor-not-allowed opacity-60" : n.disabled ? "text-gray-600 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"}`}>
              {n.locked ? <Lock size={12} className="text-gray-500" /> : <n.icon size={14} />}
              <span className="hidden sm:inline">{n.label}</span>
              {n.locked && <span className="text-[10px] text-amber-500/70 font-normal ml-0.5">PRO</span>}
            </button>
          ))}
        </nav>
        <button className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100" onClick={() => setMobileMenuOpen(m => !m)}>
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 px-4 py-2 flex flex-col gap-1">
          {navItems.map(n => (
            <button key={n.id}  disabled={n.disabled && !n.locked} title={n.disabled ? "Please select an assessment first" : ""} onClick={() => {
              if (n.locked) { setShowUpgradeFor(n.label); return; }
              setView(n.id); setMobileMenuOpen(false);
            }} className={`flex items-center gap-2 w-full px-3 py-3 rounded-lg text-sm font-medium text-left transition-colors ${n.locked ? "text-gray-500 opacity-60" : "text-gray-700 hover:bg-gray-100"}`}>
              {n.locked ? <Lock size={16} className="text-gray-500" /> : <n.icon size={18} />}
              {n.label}
              {n.locked && <span className="text-[10px] text-amber-500/70 font-normal ml-auto">PRO</span>}
            </button>
          ))}
        </div>
      )}

      {/* Breadcrumbs */}
      <Breadcrumbs
        view={view}
        firmName={selectedFirm?.name}
        onNavigate={(v) => {
                if (v === "landing") { setView("firms"); setSelectedFirmId(null); setSelectedAssessmentId(null); return; }
          else if (v === "firms") { setView("firms"); setSelectedFirmId(null); setSelectedAssessmentId(null); }
          else if (v === "firmDetail") { setView("firmDetail"); setSelectedAssessmentId(null); }
          else if (v === "assess") { if (!selectedAssessmentId) { setView("firms"); } else { setView("assess"); } }
          else if (v === "dashboard") { if (!selectedFirmId) { setView("firms"); } else { setView(v); } }
          else setView(v);
        }}
      />

      {/* Content */}
      <style>{`@media print { nav, footer, .no-print, button { display: none !important; } main { overflow: visible !important; } body { font-size: 12pt; } } @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } } .view-transition { animation: fadeSlideIn 0.3s ease-out; }`}</style>
        <main key={view + (selectedFirmId || "") + (selectedAssessmentId || "")} className="flex-1 overflow-auto flex flex-col view-transition">
        {view === "landing" && (
        <LandingPage onGetStarted={() => setView("firms")} />
      )}
      {view === "firms" && !selectedFirmId && (
          <FirmListView firms={state.firms} onCreateFirm={createFirm} onSelectFirm={id => { setSelectedFirmId(id); setView("firmDetail"); }} onDeleteFirm={deleteFirm} assessments={state.assessments} recentlyDeleted={recentlyDeleted} restoreItem={restoreItem} onViewDashboard={(firmId, assessmentId) => { setSelectedFirmId(firmId); setSelectedAssessmentId(assessmentId); setDashboardAssessmentId(assessmentId); setView("dashboard"); }} userTier={profile?.tier} />
        )}
        {view === "firmDetail" && selectedFirm && (
          <FirmDetailView firm={selectedFirm} assessments={state.assessments} onCreateAssessment={createAssessment} onSelectAssessment={id => { setSelectedAssessmentId(id); setView("assess"); }} onBack={() => { setSelectedFirmId(null); setView("firms"); }}  onDeleteAssessment={deleteAssessment} onViewDashboard={id => { setSelectedAssessmentId(id); setDashboardAssessmentId(id); setView("dashboard"); }} userTier={profile?.tier} />
        )}
        {view === "assess" && selectedAssessment && (
          <AssessmentView assessment={selectedAssessment} onRate={rateMetric} onComment={commentMetric} onBack={() => { setView("firmDetail"); }}  onConfidence={handleConfidence} onEvidence={handleEvidence} onGuidance={() => setView("guidance")} userTier={profile?.tier} />
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
            onGuidance={() => setView("guidance")}
                isDemoFirm={dashboardFirm?.id?.startsWith("demo_") || false}
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
        {view === "guidance" && (
          <GuidancePage onBack={() => setView("firms")} />
        )}
        {view === "contact" && (
          <ContactView />
        )}
            <footer className="mt-auto py-6 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} GrowthLens. All rights reserved.</p>
        {user && <p className="text-xs text-gray-400 mt-1">Confidential &mdash; For authorised use only.</p>}
      </footer>
</main>
    </div>
  );
}
