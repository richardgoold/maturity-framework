import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from './supabase';
import {
  BarChart3, Target, TrendingUp, Award, CheckCircle2,
  ArrowRight, Mail, ExternalLink, Linkedin,
  Shield, Users, Globe, ChevronRight, ArrowLeft
} from 'lucide-react';

// ─── NavBar ──────────────────────────────────────────────────────
function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">GrowthLens</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('how-it-works')} className="text-sm text-gray-600 hover:text-gray-900 transition">How It Works</button>
            <button onClick={() => scrollTo('features')} className="text-sm text-gray-600 hover:text-gray-900 transition">Features</button>
            <button onClick={() => scrollTo('contact')} className="text-sm text-gray-600 hover:text-gray-900 transition">Contact</button>
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 transition">Log In</Link>
            <Link to="/signup" className="inline-flex items-center px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-white font-semibold text-sm rounded-lg transition shadow-sm">
              Sign Up Free
            </Link>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-3">
              <button onClick={() => scrollTo('how-it-works')} className="text-left text-sm text-gray-600 py-2">How It Works</button>
              <button onClick={() => scrollTo('features')} className="text-left text-sm text-gray-600 py-2">Features</button>
              <button onClick={() => scrollTo('contact')} className="text-left text-sm text-gray-600 py-2">Contact</button>
              <div className="flex gap-3 pt-2">
                <Link to="/login" className="text-sm text-gray-600 py-2">Log In</Link>
                <Link to="/signup" className="inline-flex items-center px-4 py-2 bg-amber-400 text-white font-semibold text-sm rounded-lg">Sign Up Free</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// ─── Hero Section ────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="pt-28 pb-16 sm:pt-36 sm:pb-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="mb-8 inline-block">
            <div className="bg-gray-900 px-8 py-3 rounded-lg shadow-lg">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-amber-400">
                Professional Services Growth Platform
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-2">
            See what acquirers and investors see
          </h1>
          <p className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-amber-500 leading-tight mb-6">
            before they do.
          </p>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-gray-600 mb-4 max-w-3xl mx-auto leading-relaxed">
            Assess your firm across the 10 dimensions that drive sustainable growth in professional services.
            Whether you're scaling for the long term or preparing for a capital event, benchmark against
            industry standards and get a clear roadmap to maximise value.
          </p>

          {/* Tagline */}
          <p className="text-xl sm:text-2xl font-bold text-amber-600 tracking-widest uppercase mb-8">
            Measure. Benchmark. Maximise.
          </p>

          {/* CTA */}
          <Link to="/signup" className="inline-flex items-center px-8 py-4 bg-amber-400 hover:bg-amber-500 text-white font-bold text-lg rounded-xl transition shadow-lg shadow-amber-200/50 gap-2">
            Sign Up Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Hero dashboard illustration */}
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="relative">
            <div className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
              {/* Browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-800">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-700 rounded-md px-3 py-1 text-gray-400 text-xs">
                    growthlens.app/dashboard
                  </div>
                </div>
              </div>
              {/* Rich dashboard mockup */}
              <div className="p-3 sm:p-4 bg-gradient-to-br from-gray-900 to-gray-800">
                {/* Top row: Score + Radar + Benchmark */}
                <div className="grid grid-cols-12 gap-2 sm:gap-3">
                  {/* Readiness score donut */}
                  <div className="col-span-3 bg-gray-800/60 rounded-lg p-2 sm:p-3 border border-gray-700/50">
                    <p className="text-gray-400 text-[10px] sm:text-xs mb-1">M&A Readiness</p>
                    <div className="flex items-center justify-center">
                      <svg viewBox="0 0 80 80" className="w-12 h-12 sm:w-14 sm:h-14">
                        <circle cx="40" cy="40" r="32" fill="none" stroke="#374151" strokeWidth="6" />
                        <circle cx="40" cy="40" r="32" fill="none" stroke="#f59e0b" strokeWidth="6" strokeDasharray="161" strokeDashoffset="32" strokeLinecap="round" transform="rotate(-90 40 40)" />
                        <text x="40" y="38" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">80%</text>
                        <text x="40" y="50" textAnchor="middle" fill="#9ca3af" fontSize="7">Nearly Ready</text>
                      </svg>
                    </div>
                    {/* All 10 theme scores */}
                    <div className="mt-1 space-y-0.5">
                      {[
                        { name: 'Financial', pct: 85, color: '#22c55e' },
                        { name: 'People', pct: 72, color: '#22c55e' },
                        { name: 'Services', pct: 78, color: '#22c55e' },
                        { name: 'Vision', pct: 60, color: '#ef4444' },
                        { name: 'Sales', pct: 55, color: '#ef4444' },
                        { name: 'Clients', pct: 82, color: '#22c55e' },
                        { name: 'Leadership', pct: 75, color: '#f59e0b' },
                        { name: 'Cost', pct: 62, color: '#f59e0b' },
                        { name: 'Delivery', pct: 88, color: '#22c55e' },
                        { name: 'Market', pct: 58, color: '#ef4444' },
                      ].map((t) => (
                        <div key={t.name} className="flex items-center gap-1">
                          <span className="text-gray-500 text-[6px] w-12 text-right">{t.name}</span>
                          <div className="flex-1 h-1.5 bg-gray-700 rounded-full">
                            <div className="h-full rounded-full" style={{ width: `${t.pct}%`, backgroundColor: t.color }}></div>
                          </div>
                          <span className="text-gray-500 text-[6px] w-5">{t.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Radar chart — 10-axis */}
                  <div className="col-span-5 bg-gray-800/60 rounded-lg p-2 sm:p-3 border border-gray-700/50">
                    <p className="text-gray-400 text-[10px] sm:text-xs mb-1">Maturity Overview</p>
                    <svg viewBox="0 0 240 190" className="w-full">
                      {/* 10-point radar grid — 3 concentric rings */}
                      {[1, 0.67, 0.33].map((scale, ring) => {
                        const cx = 120, cy = 90, r = 65 * scale;
                        const pts = Array.from({length: 10}, (_, i) => {
                          const angle = (Math.PI * 2 * i / 10) - Math.PI / 2;
                          return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
                        }).join(' ');
                        return <polygon key={ring} points={pts} fill="none" stroke="#374151" strokeWidth="0.5" />;
                      })}
                      {/* Axis lines */}
                      {Array.from({length: 10}, (_, i) => {
                        const cx = 120, cy = 90, r = 65;
                        const angle = (Math.PI * 2 * i / 10) - Math.PI / 2;
                        return <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(angle)} y2={cy + r * Math.sin(angle)} stroke="#374151" strokeWidth="0.3" />;
                      })}
                      {/* Your Firm — varied shape */}
                      {(() => {
                        const cx = 120, cy = 90, r = 65;
                        const scores = [0.85, 0.72, 0.78, 0.60, 0.55, 0.82, 0.75, 0.62, 0.88, 0.58];
                        const pts = scores.map((s, i) => {
                          const angle = (Math.PI * 2 * i / 10) - Math.PI / 2;
                          return `${cx + r * s * Math.cos(angle)},${cy + r * s * Math.sin(angle)}`;
                        }).join(' ');
                        return <polygon points={pts} fill="#1B4F72" fillOpacity="0.35" stroke="#1B4F72" strokeWidth="2" />;
                      })()}
                      {/* M&A-Ready benchmark — smoother, rounder */}
                      {(() => {
                        const cx = 120, cy = 90, r = 65;
                        const bench = [0.70, 0.68, 0.66, 0.64, 0.65, 0.68, 0.67, 0.65, 0.70, 0.65];
                        const pts = bench.map((s, i) => {
                          const angle = (Math.PI * 2 * i / 10) - Math.PI / 2;
                          return `${cx + r * s * Math.cos(angle)},${cy + r * s * Math.sin(angle)}`;
                        }).join(' ');
                        return <polygon points={pts} fill="none" stroke="#d97706" strokeWidth="1.5" strokeDasharray="4,3" />;
                      })()}
                      {/* 10 labels */}
                      {[
                        { name: 'Financial', angle: 0 },
                        { name: 'People', angle: 1 },
                        { name: 'Services', angle: 2 },
                        { name: 'Vision', angle: 3 },
                        { name: 'Sales', angle: 4 },
                        { name: 'Clients', angle: 5 },
                        { name: 'Leadership', angle: 6 },
                        { name: 'Cost', angle: 7 },
                        { name: 'Delivery', angle: 8 },
                        { name: 'Market', angle: 9 },
                      ].map((label) => {
                        const cx = 120, cy = 90, r = 78;
                        const a = (Math.PI * 2 * label.angle / 10) - Math.PI / 2;
                        const x = cx + r * Math.cos(a);
                        const y = cy + r * Math.sin(a);
                        const anchor = x < 110 ? 'end' : x > 130 ? 'start' : 'middle';
                        return <text key={label.name} x={x} y={y + 3} textAnchor={anchor} fill="#9ca3af" fontSize="6.5">{label.name}</text>;
                      })}
                    </svg>
                    <div className="flex items-center justify-center gap-4 -mt-1">
                      <div className="flex items-center gap-1"><div className="w-3 h-1 bg-blue-800 rounded"></div><span className="text-gray-500 text-[8px]">Your Firm</span></div>
                      <div className="flex items-center gap-1"><div className="w-3 h-1 border-t border-dashed border-amber-500"></div><span className="text-gray-500 text-[8px]">M&A-Ready</span></div>
                    </div>
                  </div>
                  {/* Benchmark bars — all 10 themes */}
                  <div className="col-span-4 bg-gray-800/60 rounded-lg p-2 sm:p-3 border border-gray-700/50">
                    <p className="text-gray-400 text-[10px] sm:text-xs mb-1">Benchmark Comparison</p>
                    <div className="space-y-1">
                      {[
                        { name: 'Financial', score: 85, bench: 70 },
                        { name: 'People', score: 72, bench: 68 },
                        { name: 'Services', score: 78, bench: 66 },
                        { name: 'Vision', score: 60, bench: 64 },
                        { name: 'Sales', score: 55, bench: 65 },
                        { name: 'Clients', score: 82, bench: 68 },
                        { name: 'Leadership', score: 75, bench: 67 },
                        { name: 'Cost', score: 62, bench: 65 },
                        { name: 'Delivery', score: 88, bench: 70 },
                        { name: 'Market', score: 58, bench: 65 },
                      ].map((d) => (
                        <div key={d.name} className="flex items-center gap-1.5">
                          <span className="text-gray-500 text-[6px] sm:text-[7px] w-12 text-right">{d.name}</span>
                          <div className="flex-1 h-1.5 bg-gray-700 rounded-full relative overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${d.score}%`, backgroundColor: d.score >= d.bench ? '#22c55e' : d.score >= d.bench - 5 ? '#f59e0b' : '#ef4444' }}></div>
                            <div className="absolute top-0 h-full w-0.5 bg-gray-400" style={{ left: `${d.bench}%` }}></div>
                          </div>
                          <span className="text-gray-500 text-[6px] w-5">{d.score}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom row: Heatmap (labelled grid) + Key Insights (data-rich) */}
                <div className="grid grid-cols-12 gap-2 sm:gap-3 mt-2 sm:mt-3">
                  {/* 2-column heatmap matching the real app layout */}
                  <div className="col-span-7 bg-gray-800/60 rounded-lg p-2 sm:p-3 border border-gray-700/50">
                    <p className="text-gray-400 text-[10px] sm:text-xs mb-1.5">47-Metric Maturity Heatmap</p>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                      {[
                        { theme: 'Financial Performance', cells: [3,2,3,3,2,3] },
                        { theme: 'Clients & Relationships', cells: [3,3,2,3] },
                        { theme: 'People', cells: [2,3,1,2,3] },
                        { theme: 'Leadership & Governance', cells: [2,3,2] },
                        { theme: 'Services & Pricing', cells: [3,2,3,2,3] },
                        { theme: 'Cost Optimisation', cells: [2,1,2,1,2,1,2] },
                        { theme: 'Vision & Strategy', cells: [2,1,2,2,1] },
                        { theme: 'Delivery', cells: [3,3,2] },
                        { theme: 'Sales & Pipeline', cells: [1,2,1,2] },
                        { theme: 'Market Profile', cells: [2,1,2,2,1] },
                      ].map((row) => (
                        <div key={row.theme}>
                          <p className="text-gray-500 text-[5px] sm:text-[6px] mb-0.5 truncate">{row.theme}</p>
                          <div className="flex gap-0.5">
                            {row.cells.map((v, i) => (
                              <div key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-sm flex items-center justify-center text-[5px] font-bold" style={{
                                backgroundColor: v === 3 ? '#A5D6A7' : v === 2 ? '#BBDEFB' : '#FFE0B2',
                                color: v === 3 ? '#1E8449' : v === 2 ? '#7D6608' : '#922B21',
                              }}>{v}</div>
                            ))}
                          </div>
                        </div>            ))}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex items-center gap-0.5"><div className="w-2 h-2 rounded-sm" style={{backgroundColor:'#FFE0B2'}}></div><span className="text-gray-500 text-[5px]">Foundational</span></div>
                      <div className="flex items-center gap-0.5"><div className="w-2 h-2 rounded-sm" style={{backgroundColor:'#BBDEFB'}}></div><span className="text-gray-500 text-[5px]">Evolving</span></div>
                      <div className="flex items-center gap-0.5"><div className="w-2 h-2 rounded-sm" style={{backgroundColor:'#A5D6A7'}}></div><span className="text-gray-500 text-[5px]">Optimised</span></div>
                    </div>
                  </div>
                  {/* Key Insights — data-rich panel */}
                  <div className="col-span-5 bg-gray-800/60 rounded-lg p-2 sm:p-3 border border-gray-700/50 flex flex-col">
                    <p className="text-gray-400 text-[10px] sm:text-xs mb-1.5">Key Insights</p>
                    <div className="space-y-1.5 flex-1">
                      <div>
                        <p className="text-green-400 text-[7px] sm:text-[8px] font-semibold mb-0.5">Top Strengths</p>
                        {[
                          { name: 'Financial Performance', score: '85%' },
                          { name: 'Delivery Excellence', score: '88%' },
                          { name: 'Client Relationships', score: '82%' },
                        ].map((s) => (
                          <div key={s.name} className="flex items-center justify-between mb-0.5">
                            <div className="flex items-center gap-1">
                              <div className="w-1 h-1 rounded-full bg-green-400"></div>
                              <span className="text-gray-400 text-[7px]">{s.name}</span>
                            </div>
                            <span className="text-green-400 text-[7px] font-semibold">{s.score}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-amber-400 text-[7px] sm:text-[8px] font-semibold mb-0.5">Priority Improvements</p>
                        {[
                          { name: 'Sales & Pipeline', gap: '+10%' },
                          { name: 'Vision & Strategy', gap: '+8%' },
                          { name: 'Market Profile', gap: '+7%' },
                        ].map((s) => (
                          <div key={s.name} className="flex items-center justify-between mb-0.5">
                            <div className="flex items-center gap-1">
                              <div className="w-1 h-1 rounded-full bg-amber-400"></div>
                              <span className="text-gray-400 text-[7px]">{s.name}</span>
                            </div>
                            <span className="text-amber-400 text-[7px] font-semibold">{s.gap}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Summary stat */}
                    <div className="mt-1.5 pt-1.5 border-t border-gray-700/50">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-[7px]">M&A Readiness</span>
                        <span className="text-amber-400 text-[8px] font-bold">80% — Nearly Ready</span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-gray-500 text-[7px]">Themes above benchmark</span>
                        <span className="text-green-400 text-[8px] font-bold">6 of 10</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative glow */}
            <div className="absolute -inset-4 bg-amber-400/10 rounded-2xl blur-2xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Previews Section ────────────────────────────────────────────
function PreviewsSection() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Deep insights across every dimension of your firm
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From structured assessments to actionable roadmaps — understand exactly where your firm
            excels and where to focus for maximum impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Benchmark Dashboard */}
          <div className="group">
            <div className="bg-gray-900 rounded-xl overflow-hidden shadow-xl transform transition group-hover:scale-[1.02] group-hover:shadow-2xl">
              <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-800">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
              </div>
              <div className="p-4 aspect-[4/3] flex flex-col justify-between">
                {/* Mini radar + score */}
                <div className="flex items-center gap-3">
                  <svg viewBox="0 0 80 80" className="w-16 h-16 flex-shrink-0">
                    <circle cx="40" cy="40" r="30" fill="none" stroke="#374151" strokeWidth="5" />
                    <circle cx="40" cy="40" r="30" fill="none" stroke="#22c55e" strokeWidth="5" strokeDasharray="151" strokeDashoffset="30" strokeLinecap="round" transform="rotate(-90 40 40)" />
                    <text x="40" y="38" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">80%</text>
                    <text x="40" y="48" textAnchor="middle" fill="#9ca3af" fontSize="6">Ready</text>
                  </svg>
                  <div>
                    <p className="text-white text-xs font-semibold">Nearly M&A Ready</p>
                    <p className="text-gray-400 text-[10px]">Top 25% of firms assessed</p>
                  </div>
                </div>
                {/* Theme scores */}
                <div className="space-y-1.5 mt-3">
                  {[
                    { name: 'Financial Performance', pct: 85, color: '#22c55e' },
                    { name: 'People & Culture', pct: 72, color: '#22c55e' },
                    { name: 'Services & Pricing', pct: 78, color: '#f59e0b' },
                    { name: 'Sales & Pipeline', pct: 55, color: '#ef4444' },
                    { name: 'Leadership', pct: 75, color: '#22c55e' },
                  ].map((t) => (
                    <div key={t.name}>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-[8px]">{t.name}</span>
                        <span className="text-gray-500 text-[8px]">{t.pct}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-700 rounded-full">
                        <div className="h-full rounded-full" style={{ width: `${t.pct}%`, backgroundColor: t.color }}></div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-gray-500 text-[9px] mt-2">+ 5 more themes assessed</p>
              </div>
            </div>
            <p className="mt-4 text-center text-gray-600 text-sm leading-relaxed">
              See exactly where your firm stands with scores across all 10 growth dimensions,
              benchmarked against industry standards
            </p>
          </div>

          {/* Card 2: Improvement Roadmap */}
          <div className="group">
            <div className="bg-gray-900 rounded-xl overflow-hidden shadow-xl transform transition group-hover:scale-[1.02] group-hover:shadow-2xl">
              <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-800">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
              </div>
              <div className="p-4 aspect-[4/3] flex flex-col">
                <p className="text-white text-xs font-semibold mb-3">Improvement Roadmap</p>
                <div className="space-y-2 flex-1">
                  {[
                    { theme: 'Sales & Pipeline', gap: 45, priority: 'Critical' },
                    { theme: 'Vision & Strategy', gap: 30, priority: 'High' },
                    { theme: 'Cost Optimisation', gap: 25, priority: 'High' },
                    { theme: 'Market Profile', gap: 20, priority: 'Medium' },
                  ].map((item, i) => (
                    <div key={item.theme} className="bg-gray-800/60 rounded-lg p-2 border border-gray-700/50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-300 text-[9px] font-medium">{item.theme}</span>
                        <span className={`text-[7px] px-1.5 py-0.5 rounded-full font-medium ${
                          item.priority === 'Critical' ? 'bg-red-900/50 text-red-300' :
                          item.priority === 'High' ? 'bg-amber-900/50 text-amber-300' :
                          'bg-blue-900/50 text-blue-300'
                        }`}>{item.priority}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-700 rounded-full">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${100 - item.gap}%` }}></div>
                        </div>
                        <span className="text-amber-400 text-[8px] font-semibold">+{item.gap}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-800/40 rounded p-1.5 mt-2 border border-gray-700/30">
                  <p className="text-amber-400 text-[8px] text-center font-medium">Closing these gaps could increase your readiness score by 18 points</p>
                </div>
              </div>
            </div>
            <p className="mt-4 text-center text-gray-600 text-sm leading-relaxed">
              Get a prioritised improvement roadmap showing exactly which gaps to close first
              for the biggest impact on your firm's value
            </p>
          </div>

          {/* Card 3: Assessment Framework */}
          <div className="group">
            <div className="bg-gray-900 rounded-xl overflow-hidden shadow-xl transform transition group-hover:scale-[1.02] group-hover:shadow-2xl">
              <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-800">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
              </div>
              <div className="p-4 aspect-[4/3] flex flex-col">
                <p className="text-white text-xs font-semibold mb-2">Assessment Framework</p>
                <div className="flex gap-2 flex-1">
                  {/* Themes sidebar */}
                  <div className="w-1/3 space-y-1">
                    {['Financial', 'People', 'Services', 'Vision', 'Sales', 'Clients', 'Leadership', 'Cost', 'Delivery', 'Market'].map((t, i) => (
                      <div key={t} className={`text-[7px] px-1.5 py-1 rounded ${i === 0 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-gray-500 hover:bg-gray-800'}`}>
                        {t}
                      </div>
                    ))}
                  </div>
                  {/* Metrics */}
                  <div className="w-2/3 space-y-1.5">
                    {[
                      { name: 'Revenue Growth Rate', level: 3 },
                      { name: 'Revenue Concentration', level: 2 },
                      { name: 'Profit Margins', level: 3 },
                      { name: 'Cash Flow Stability', level: 2 },
                      { name: 'Revenue per Employee', level: 1 },
                      { name: 'Contract Quality', level: 3 },
                    ].map((m) => (
                      <div key={m.name} className="bg-gray-800/60 rounded p-1.5 border border-gray-700/50">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 text-[7px]">{m.name}</span>
                          <div className="flex gap-0.5">
                            {[1,2,3].map((l) => (
                              <div key={l} className={`w-2.5 h-2.5 rounded-sm text-[6px] flex items-center justify-center font-bold ${
                                l <= m.level ? (l === 3 ? 'bg-green-500/30 text-green-300' : l === 2 ? 'bg-blue-500/30 text-blue-300' : 'bg-amber-500/30 text-amber-300') : 'bg-gray-700 text-gray-600'
                              }`}>{l}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-gray-500 text-[8px] mt-1.5 text-center">6 of 47 metrics shown</p>
              </div>
            </div>
            <p className="mt-4 text-center text-gray-600 text-sm leading-relaxed">
              A structured framework covering 10 themes and 47 growth metrics, each with clear
              maturity level definitions and guidance
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ────────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    { num: 1, title: 'Sign up', desc: 'Create your free account in 30 seconds', icon: Users },
    { num: 2, title: 'Assess', desc: 'Rate your firm across 10 themes and 47 metrics', icon: Target },
    { num: 3, title: 'Benchmark', desc: 'Compare against M&A-ready standards', icon: BarChart3 },
    { num: 4, title: 'Act', desc: 'Get a prioritised roadmap to maximise value', icon: TrendingUp },
  ];

  return (
    <section id="how-it-works" className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">How it works</h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          {steps.map((step, i) => (
            <div key={step.num} className="flex items-center gap-0 flex-1">
              <div className="flex flex-col items-center text-center flex-1">
                <div className="w-14 h-14 bg-amber-50 border-2 border-amber-200 rounded-xl flex items-center justify-center mb-2">
                  <step.icon className="w-6 h-6 text-amber-600" />
                </div>
                <div className="inline-flex items-center justify-center w-6 h-6 bg-amber-400 text-white text-xs font-bold rounded-full mb-2">
                  {step.num}
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">{step.title}</h3>
                <p className="text-gray-600 text-xs leading-relaxed max-w-[150px]">{step.desc}</p>
              </div>
              {/* Arrow connector */}
              {i < steps.length - 1 && (
                <div className="hidden sm:flex items-center px-2">
                  <ChevronRight className="w-5 h-5 text-amber-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Animated Stats Bar ──────────────────────────────────────────
function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const numTarget = parseInt(target);
          const duration = 1500;
          const steps = 40;
          const increment = numTarget / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= numTarget) {
              setCount(numTarget);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, hasAnimated]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function StatsBar() {
  return (
    <div className="bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-bold text-amber-400"><AnimatedCounter target="10" /></p>
       <p className="text-sm text-gray-400 mt-1">Growth Themes</p>
          </div>
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-bold text-amber-400"><AnimatedCounter target="47" /></p>
            <p className="text-sm text-gray-400 mt-1">Metrics</p>
          </div>
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-bold text-amber-400"><AnimatedCounter target="7" /></p>
            <p className="text-sm text-gray-400 mt-1">Benchmark Profiles</p>
          </div>
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-bold text-amber-400"><AnimatedCounter target="20" suffix="+" /></p>
            <p className="text-sm text-gray-400 mt-1">Industry Sources</p>
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── Features / Pricing ──────────────────────────────────────────
function FeaturesSection() {
  return (
    <section id="features" className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Start free. Upgrade when you're ready.
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The free tier gives you everything you need to understand your firm's strengths and growth opportunities.
            Premium unlocks the tools to accelerate improvement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free tier */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-gray-700 text-sm font-medium mb-4">
              Free
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Get started</h3>
            <p className="text-gray-600 mb-6">Everything you need to assess your firm's growth maturity</p>
            <ul className="space-y-3 mb-8">
              {[
                'Full assessment across all 10 themes and 47 metrics',
                'Dashboard with scores and gap analysis',
                'Benchmark comparison against 7 profiles',
                'Maturity heatmap across all dimensions',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/signup" className="block w-full text-center px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition">
              Sign Up Free
            </Link>
          </div>

          {/* Premium tier */}
          <div className="bg-white rounded-2xl p-8 border-2 border-amber-400 shadow-lg relative">
            <div className="absolute -top-3 right-6 px-3 py-1 bg-amber-400 text-white text-xs font-bold rounded-full">
              RECOMMENDED
            </div>
            <div className="inline-flex items-center px-3 py-1 bg-amber-50 rounded-full text-amber-700 text-sm font-medium mb-4">
              Premium
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Maximise value</h3>
            <p className="text-gray-600 mb-6">For firms serious about accelerating growth and value creation</p>
            <ul className="space-y-3 mb-8">
              {[
                'Everything in Free',
                'Improvement Roadmap with prioritised actions',
                'Scenario Modelling — what-if analysis',
                'PDF & CSV exports',
                'Executive Summary reports',
                'Detailed Assessment reports',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="block w-full text-center px-6 py-3 bg-amber-400 hover:bg-amber-500 text-white font-bold rounded-lg transition shadow-sm"
            >
              Talk to Us About Premium
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Contact Section ─────────────────────────────────────────────
function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    const { error } = await supabase
      .from('contact_submissions')
      .insert({
        name: form.name,
        email: form.email,
        message: form.message,
      });

    if (error) {
      console.error('Contact form error:', error);
      setStatus('error');
    } else {
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Let's Talk</h2>
          <p className="text-lg text-gray-600">
            Whether you have questions about the framework, want a walkthrough, or need help
            interpreting your results — we're here to help.
          </p>
        </div>

        {status === 'sent' ? (
          <div className="text-center py-12 bg-green-50 rounded-2xl border border-green-200">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Message sent</h3>
            <p className="text-gray-600">We'll get back to you within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition resize-none"
                placeholder="How can we help?"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full px-6 py-3 bg-amber-400 hover:bg-amber-500 disabled:bg-amber-300 text-white font-bold rounded-lg transition shadow-sm"
            >
              {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>
            {status === 'error' && (
              <p className="text-red-600 text-sm text-center">Something went wrong. Please try again or email us directly.</p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}

// ─── Logo Carousel ──────────────────────────────────────────────────────────
function LogoCarousel() {
  const logos = [
    "Moorhouse", "Project One", "Public First", "Roq",
    "RQC Group", "The Institute of Clever Stuff",
    "WeShape", "Wondrous", "YLD"
  ];
  const doubled = [...logos, ...logos];
  return (
    <section className="py-10 bg-white overflow-hidden border-t border-gray-100">
      <p className="text-center text-xs uppercase tracking-widest text-gray-400 mb-6">
        Trusted by leading professional services firms
      </p>
      <div className="relative w-full">
        <div className="flex animate-marquee whitespace-nowrap">
          {doubled.map((name, i) => (
            <span
              key={i}
              className="mx-8 inline-flex items-center text-lg font-semibold tracking-tight text-gray-300 hover:text-amber-600 transition-colors duration-300 cursor-default select-none"
              style={{ fontFamily: "'Inter', system-ui, sans-serif", minWidth: 'max-content' }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-amber-400 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">GrowthLens</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Use</a>
            <a href="https://www.linkedin.com/in/richardgooldofficial/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} GrowthLens. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Export ─────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <NavBar />
      <HeroSection />
      <PreviewsSection />
      <HowItWorksSection />
      <StatsBar />
      <LogoCarousel />
      <FeaturesSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
