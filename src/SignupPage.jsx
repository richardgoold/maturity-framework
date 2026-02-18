import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { BarChart3, Eye, EyeOff, ArrowLeft, Mail, CheckCircle } from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
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
      setEmailSent(true);
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
            <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">GrowthLens</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {emailSent ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
              <p className="text-gray-500 text-sm mb-4">
                We've sent a verification link to <strong>{form.email}</strong>.
                Please click the link to confirm your account.
              </p>
              <p className="text-gray-400 text-xs mb-6">
                Didn't receive it? Check your spam folder or try signing up again.
              </p>
              <Link to="/login" className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-white font-bold rounded-lg transition shadow-sm">
                Go to Log In
              </Link>
            </div>
          ) : (
            <>
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
                </>
          )}
        </div>

        {/* Login link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-amber-600 hover:text-amber-700 font-medium">Log in</Link>
        </p>
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
