import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const { signIn, resetPassword, updatePassword, isPasswordRecovery } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resetSent, setResetSent] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await signIn({
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message || 'Login failed. Please check your credentials.');
    } else {
      navigate('/app');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!form.email) {
      setError('Please enter your email address first.');
      return;
    }
    setLoading(true);
    setError(null);

    const { error: resetError } = await resetPassword(form.email);
    setLoading(false);

    if (resetError) {
      setError(resetError.message);
    } else {
      setResetSent(true);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError(null);
    const { error: updateError } = await updatePassword(newPassword);
    setLoading(false);
    if (updateError) {
      setError(updateError.message);
    } else {
      setPasswordUpdated(true);
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  // If in password recovery mode, show the "set new password" form
  if (isPasswordRecovery && !passwordUpdated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 200 200" className="w-10 h-10"><rect width="200" height="200" rx="32" fill="#f2a71b"/><g stroke="white" strokeWidth="6" strokeLinecap="round" fill="none"><path d="M 30,50 L 30,148 Q 30,158 40,158 L 148,158" strokeLinejoin="round"/><line x1="50" y1="158" x2="50" y2="142"/><line x1="70" y1="158" x2="70" y2="124"/><line x1="90" y1="158" x2="90" y2="102"/><line x1="110" y1="158" x2="110" y2="76"/><line x1="130" y1="158" x2="130" y2="50"/></g><circle cx="116" cy="78" r="44" fill="rgba(255,255,255,0.1)" stroke="white" strokeWidth="5" strokeLinecap="round"/><path d="M 90,50 Q 96,42 106,44" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round"/><line x1="146" y1="108" x2="170" y2="132" stroke="white" strokeWidth="6.5" strokeLinecap="round"/></svg>
              </div>
              <span className="text-2xl font-bold text-gray-900">GrowthLens</span>
            </Link>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Set new password</h1>
            <p className="text-gray-500 text-sm mb-6">Enter your new password below</p>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition text-sm"
                  placeholder="At least 6 characters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm new password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition text-sm"
                  placeholder="Repeat your new password"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-amber-400 hover:bg-amber-500 disabled:bg-amber-300 text-white font-bold rounded-lg transition shadow-sm"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-gray-500 text-sm mb-6">Log in to your GrowthLens account</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          {resetSent && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-4">
              Password reset email sent. Check your inbox.
            </div>
          )}

          {passwordUpdated && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-4">
              Password updated successfully. Please log in with your new password.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition text-sm pr-10"
                  placeholder="Your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="text-right">
              <button
                type="button"
                onClick={handleResetPassword}
                className="text-xs text-amber-600 hover:text-amber-700 font-medium"
              >
                Forgot your password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-amber-400 hover:bg-amber-500 disabled:bg-amber-300 text-white font-bold rounded-lg transition shadow-sm"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
        </div>

        {/* Signup link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-amber-600 hover:text-amber-700 font-medium">Sign up free</Link>
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
