import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from './supabase';
import {
  BarChart3, Target, TrendingUp, Award, CheckCircle2,
  ArrowRight, Star, Mail, ExternalLink, Linkedin,
  Shield, Users, Globe, ChevronRight
} from 'lucide-react';

// Screenshot paths — replace with actual screenshots
const SCREENSHOTS = {
  hero: '/maturity-framework/screenshots/dashboard-charts.svg',
  dashboard: '/maturity-framework/screenshots/dashboard-scores.svg',
  roadmap: '/maturity-framework/screenshots/gap-analysis.svg',
  assessment: '/maturity-framework/screenshots/assessment-view.svg',
};

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
            <button onClick={() => scrollTo('testimonials')} className="text-sm text-gray-600 hover:text-gray-900 transition">Testimonials</button>
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
              <button onClick={() => scrollTo('testimonials')} className="text-left text-sm text-gray-600 py-2">Testimonials</button>
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

function HeroSection() {
  return (
    <section className="pt-28 pb-16 sm:pt-36 sm:pb-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-amber-700 text-sm font-medium mb-6">
            M&A Due Diligence Platform
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            See what acquirers see
            <span className="text-amber-500"> — before they do.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-600 mb-4 max-w-3xl mx-auto leading-relaxed">
            Assess your firm across the 10 dimensions that drive value in professional services M&A.
            Benchmark against industry standards. Get a clear roadmap to maximise your exit.
          </p>

          {/* Tagline */}
          <p className="text-sm font-semibold text-amber-600 tracking-widest uppercase mb-8">
            Measure. Benchmark. Maximise.
          </p>

          {/* CTA */}
          <Link to="/signup" className="inline-flex items-center px-8 py-4 bg-amber-400 hover:bg-amber-500 text-white font-bold text-lg rounded-xl transition shadow-lg shadow-amber-200/50 gap-2">
            Sign Up Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Hero screenshot mockup */}
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="relative">
            {/* Browser frame */}
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
              {/* Screenshot */}
              <img
                src={SCREENSHOTS.hero}
                alt="GrowthLens Dashboard — radar chart and benchmark comparison"
                className="w-full"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.querySelector('.placeholder')?.classList.remove('hidden');
                }}
              />
              {/* Fallback placeholder */}
              <div className="placeholder hidden aspect-[16/9] bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <BarChart3 className="w-16 h-16 mx-auto mb-3 text-amber-400" />
                  <p className="text-lg font-medium">Dashboard Preview</p>
                  <p className="text-sm">Radar chart & benchmark comparison</p>
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

function ScreenshotCard({ src, alt, caption }) {
  return (
    <div className="group">
      <div className="bg-gray-900 rounded-xl overflow-hidden shadow-xl transform transition group-hover:scale-[1.02] group-hover:shadow-2xl">
        {/* Mini browser bar */}
        <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-800">
          <div className="w-2 h-2 rounded-full bg-red-400"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
        </div>
        <img
          src={src}
          alt={alt}
          className="w-full"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.querySelector('.placeholder')?.classList.remove('hidden');
          }}
        />
        <div className="placeholder hidden aspect-[4/3] bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-center text-gray-500 px-4">
            <BarChart3 className="w-10 h-10 mx-auto mb-2 text-amber-400/60" />
            <p className="text-sm">{alt}</p>
          </div>
        </div>
      </div>
      <p className="mt-4 text-center text-gray-600 text-sm leading-relaxed">{caption}</p>
    </div>
  );
}

function PreviewsSection() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to assess M&A readiness
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From structured assessments to visual dashboards — see your firm through an acquirer's eyes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ScreenshotCard
            src={SCREENSHOTS.dashboard}
            alt="Dashboard with scores and readiness donut"
            caption="See exactly where your firm stands against M&A-ready benchmarks"
          />
          <ScreenshotCard
            src={SCREENSHOTS.roadmap}
            alt="Gap analysis and improvement roadmap"
            caption="Get a prioritised roadmap to close the gaps that matter most"
          />
          <ScreenshotCard
            src={SCREENSHOTS.assessment}
            alt="Assessment view with themes and metrics"
            caption="A structured framework covering 10 themes and 47 growth metrics"
          />
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    { num: 1, title: 'Sign up', desc: 'Create your free account in 30 seconds', icon: Users },
    { num: 2, title: 'Assess', desc: 'Rate your firm across 10 growth themes and 47 metrics', icon: Target },
    { num: 3, title: 'Benchmark', desc: 'See how you compare against M&A-ready standards and 7 industry benchmarks', icon: BarChart3 },
    { num: 4, title: 'Act', desc: 'Get a prioritised improvement roadmap to maximise your firm\'s value', icon: TrendingUp },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How it works</h2>
          <p className="text-lg text-gray-600">Four steps to understand and maximise your firm's value</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={step.num} className="relative text-center">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-amber-200">
                  <ChevronRight className="absolute -right-2 -top-2 w-5 h-5 text-amber-400" />
                </div>
              )}
              {/* Step number */}
              <div className="w-20 h-20 bg-amber-50 border-2 border-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <step.icon className="w-8 h-8 text-amber-600" />
              </div>
              <div className="inline-flex items-center justify-center w-7 h-7 bg-amber-400 text-white text-sm font-bold rounded-full mb-3">
                {step.num}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  const stats = [
    { value: '10', label: 'Growth Themes' },
    { value: '47', label: 'Metrics' },
    { value: '7', label: 'Benchmark Profiles' },
    { value: '20+', label: 'Industry Sources' },
  ];

  return (
    <div className="bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-amber-400">{stat.value}</p>
              <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      quote: "This assessment completely changed how we think about our firm's readiness for exit. The gap analysis alone was worth it — we had blind spots we didn't know existed.",
      name: 'Sarah Mitchell',
      title: 'Managing Partner, Technology Consultancy',
      rating: 5,
    },
    {
      quote: "We used GrowthLens to benchmark ourselves before approaching buyers. The structured framework gave us confidence and helped us command a better multiple.",
      name: 'James Thornton',
      title: 'CEO, Management Consultancy',
      rating: 5,
    },
    {
      quote: "Finally, a tool that speaks the language of professional services M&A. The 47 metrics cover everything an acquirer would look at — nothing else comes close.",
      name: 'David Chen',
      title: 'Founder, Financial Advisory Firm',
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Trusted by firm leaders
          </h2>
          <p className="text-lg text-gray-600">See what professional services firm owners are saying</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed mb-6 italic">"{t.quote}"</p>
              <div>
                <p className="font-semibold text-gray-900">{t.name}</p>
                <p className="text-sm text-gray-500">{t.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Start free. Upgrade when you're ready.
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The free tier gives you everything you need to understand your firm's M&A readiness.
            Premium unlocks the tools to improve it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free tier */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-gray-700 text-sm font-medium mb-4">
              Free
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Get started</h3>
            <p className="text-gray-600 mb-6">Everything you need to assess your firm's readiness</p>
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
            <p className="text-gray-600 mb-6">For firms serious about preparing for exit</p>
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

function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null); // 'sending' | 'sent' | 'error'

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
            <a href="https://www.linkedin.com/in/richardgoold/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <NavBar />
      <HeroSection />
      <PreviewsSection />
      <HowItWorksSection />
      <StatsBar />
      <TestimonialsSection />
      <FeaturesSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
