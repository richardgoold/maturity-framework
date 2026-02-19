import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Eye, EyeOff, ArrowLeft, Mail } from 'lucide-react';

const REVENUE_BANDS = [
  'Under £1m',
  '£1m – £5m',
  '£5m – £10m',
  '£10m – £25m',
  '£25m – £50m',
  '£50m+',
  'Prefer not to say',
];

export default function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    companyName: '',
    jobTitle: '',
    revenueBand: '',
  });

  const passwordValid = form.password.length >= 8;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordValid) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    setError(null);

    const { error: signUpError } = await signUp({
      email: form.email,
      password: form.password,
      fullName: form.fullName,
      companyName: form.companyName,
      jobTitle: form.jobTitle,
      revenueBand: form.revenueBand,
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message || 'Sign up failed. Please try again.');
    } else {
      setSubmitted(true);
    }
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 200 200" className="w-10 h-10"><rect width="200" height="200" rx="32" fill="#f2a71b"/><g stroke="white" strokeWidth="6" strokeLinecap="round" fill="none"><path d="M 30,50 L 30,148 Q 30,158 40,158 L 148,158" strokeLinejoin="round"/><line x1="50" y1="158" x2="50" y2="142"/><line x1="70" y1="158" x2="70" y2="124"/><line x1="90" y1="158" x2="90" y2="102"/><line x1="110" y1="158" x2="110" y2="76"/><line x1="130" y1="158" x2="130" y2="50"/></g><circle cx="116" cy="78" r="44" fill="rgba(255,255,255,0.1)" stroke="white" strokeWidth="5" strokeLinecap="round"/><path d="M 90,50 Q 96,42 106,44" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round"/><line x1="146" y1="108" x2="170" y2="132" stroke="white" strokeWidth="6.5" strokeLinecap="round"/></svg>
            </div>
            <span className="text-2xl font-bold text-gray-900">GrowthLens</span>
          </Link>
        </div>

        {/* Confirmation screen after signup */}
        {submitted ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
            <p className="text-gray-500 text-sm mb-2">
              We've sent a verification link to <strong>{form.email}</strong>. Please click the link to confirm your account.
            </p>
            <p className="text-gray-400 text-xs mb-6">
              Didn't receive it? Check your spam folder or try signing up again.
            </p>
            <Link to="/login" className="inline-flex items-center px-6 py-3 bg-amber-400 hover:bg-amber-500 text-white font-bold rounded-lg transition shadow-sm">
              Go to Log In
            </Link>
            <p className="text-gray-400 text-xs mt-6">
              Already have an account? <Link to="/login" className="text-amber-600 hover:text-amber-700 font-medium">Try logging in instead</Link>
            </p>
          </div>
        ) : (
        <>
        /* Card */
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your free account</h1>
          <p className="text-gray-500 text-sm mb-6">Start assessing and growing your firm's value today</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition text-sm"
                placeholder="Jane Smith"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition text-sm"
                placeholder="jane@yourfirm.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition text-sm pr-10"
                  placeholder="Minimum 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password && !passwordValid && (
                <p className="text-xs text-red-500 mt-1">Password must be at least 8 characters</p>
              )}
              {form.password && passwordValid && (
                <p className="text-xs text-green-600 mt-1">Password strength: good</p>
              )}
            </div>

            {/* Company name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company / firm name</label>
              <input
                type="text"
                required
                value={form.companyName}
                onChange={(e) => updateField('companyName', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition text-sm"
                placeholder="Acme Consulting"
              />
            </div>

            {/* Job title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job title</label>
              <input
                type="text"
                required
                value={form.jobTitle}
                onChange={(e) => updateField('jobTitle', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition text-sm"
                placeholder="Managing Partner"
              />
            </div>

            {/* Revenue band */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Firm revenue band</label>
              <select
                required
                value={form.revenueBand}
                onChange={(e) => updateField('revenueBand', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition text-sm bg-white"
              >
                <option value="">Select revenue band</option>
                {REVENUE_BANDS.map((band) => (
                  <option key={band} value={band}>{band}</option>
                ))}
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-amber-400 hover:bg-amber-500 disabled:bg-amber-300 text-white font-bold rounded-lg transition shadow-sm mt-2"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
        </div>

        {/* Login link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-amber-600 hover:text-amber-700 font-medium">Log in</Link>
        </p>
        </>
        )}

        {/* Back to home */}
        <div className="text-center mt-4">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
