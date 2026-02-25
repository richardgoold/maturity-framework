import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { supabase } from './supabase';
import { Eye, EyeOff, ArrowLeft, Shield } from 'lucide-react';

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

  // MFA state
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaFactorId, setMfaFactorId] = useState(null);
  const [mfaCode, setMfaCode] = useState('');

  // SEC-06: Client-side rate limiting
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // SEC-06: Check rate limit
    if (lockedUntil && Date.now() < lockedUntil) {
      const secs = Math.ceil((lockedUntil - Date.now()) / 1000);
      setError(`Too many attempts. Please wait ${secs} seconds.`);
      return;
    }
    setLoading(true);
    setError(null);
    // Server-side rate limiting (supplements client-side)
    try {
      const { data: allowed } = await supabase.rpc('check_rate_limit', {
        p_identifier: form.email,
        p_action: 'login',
        p_max_attempts: 5,
        p_window_seconds: 900,
        p_lockout_seconds: 900,
      });
      if (allowed === false) {
        setLoading(false);
        setError('Too many login attempts. Please try again in 15 minutes.');
        return;
      }
    } catch (rlErr) {
      // Rate limit check failed — proceed without blocking (non-critical)
      console.warn('Rate limit check failed:', rlErr);
    }

    const { error: signInError } = await signIn({
      email: form.email,
      password: form.password,
    });
    setLoading(false);
    if (signInError) {
      // SEC-06: Track failed attempts and lock after 5 failures
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 5) {
        const lockDuration = Math.min(30000 * Math.pow(2, Math.floor(newAttempts / 5) - 1), 300000);
        setLockedUntil(Date.now() + lockDuration);
        setError(`Too many failed attempts. Please wait ${lockDuration / 1000} seconds before trying again.`);
      } else {
        // SEC-12: Generic error message to prevent user enumeration
        setError('Invalid email or password. Please try again.');
      }
    } else {
      setAttempts(0);
      setLockedUntil(null);
      // Reset server-side rate limit on successful login
      try {
        await supabase.rpc('reset_rate_limit', { p_identifier: form.email, p_action: 'login' });
      } catch (rlErr) {
        // Non-critical — don't block login
      }
      // Check MFA status after successful password auth
      try {
        const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (aalData?.currentLevel === 'aal1' && aalData?.nextLevel === 'aal2') {
          // MFA is enrolled - need to verify
          const { data: factors } = await supabase.auth.mfa.listFactors();
          const totpFactors = (factors?.totp || []).filter(f => f.status === 'verified');
          if (totpFactors.length > 0) {
            setMfaFactorId(totpFactors[0].id);
            setMfaRequired(true);
            return; // Don't navigate yet
          }
        }
      } catch (mfaErr) {
        // MFA check failed - proceed without MFA (non-blocking)
        console.warn('MFA check failed:', mfaErr);
      }
      navigate('/app');
    }
  };

  const handleMfaVerify = async (e) => {
    e.preventDefault();
    if (mfaCode.length !== 6) { setError('Please enter a 6-digit code.'); return; }
    setLoading(true);
    setError(null);
    try {
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: mfaFactorId });
      if (challengeError) throw challengeError;
      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: mfaFactorId, challengeId: challenge.id, code: mfaCode,
      });
      if (verifyError) throw verifyError;
      navigate('/app');
    } catch (err) {
      setError('Invalid code. Please try again.');
      setMfaCode('');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!form.email) { setError('Please enter your email address first.'); return; }
    setLoading(true);
    setError(null);
    // Server-side rate limiting for password resets
    try {
      const { data: allowed } = await supabase.rpc('check_rate_limit', {
        p_identifier: form.email,
        p_action: 'password_reset',
        p_max_attempts: 3,
        p_window_seconds: 3600,
        p_lockout_seconds: 3600,
      });
      if (allowed === false) {
        setLoading(false);
        setResetSent(true); // Still show success to prevent enumeration
        return;
      }
    } catch (rlErr) {
      console.warn('Rate limit check failed:', rlErr);
    }

    const { error: resetError } = await resetPassword(form.email);
    setLoading(false);
    // SEC-12: Always show success to prevent email enumeration
    setResetSent(true);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    // SEC-07: Strengthened password policy
    if (newPassword.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setError('Password must include uppercase, lowercase, and a number.'); return;
    }
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
    setLoading(true);
    setError(null);
    const { error: updateError } = await updatePassword(newPassword);
    setLoading(false);
    if (updateError) { setError(updateError.message); }
    else { setPasswordUpdated(true); setNewPassword(''); setConfirmPassword(''); }
  };

  // MFA challenge screen
  if (mfaRequired) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <img src="/GrowthLens%20Logo_no%20strapline.png" alt="GrowthLens" className="h-16 w-auto" />
            </Link>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-6">
              <Shield className="w-10 h-10 text-amber-500 mx-auto mb-3" />
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Two-Factor Authentication</h1>
              <p className="text-gray-500 text-sm">Enter the 6-digit code from your authenticator app</p>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>
            )}
            <form onSubmit={handleMfaVerify} className="space-y-4">
              <div className="flex justify-center">
                <input type="text" inputMode="numeric" maxLength={6} value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-48 text-center text-2xl tracking-[0.5em] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition font-mono"
                  placeholder="000000" autoFocus />
              </div>
              <button type="submit" disabled={loading || mfaCode.length !== 6}
                className="w-full px-6 py-3 bg-amber-400 hover:bg-amber-500 disabled:bg-amber-300 text-white font-bold rounded-lg transition shadow-sm">
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </form>
            <div className="text-center mt-4">
              <button type="button" onClick={() => { setMfaRequired(false); setMfaCode(''); setError(null); }}
                className="text-sm text-gray-400 hover:text-gray-600 transition">
                Cancel and go back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Password recovery form
  if (isPasswordRecovery && !passwordUpdated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <img src="/GrowthLens%20Logo_no%20strapline.png" alt="GrowthLens" className="h-16 w-auto" />
            </Link>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Set new password</h1>
            <p className="text-gray-500 text-sm mb-6">Enter your new password below</p>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>
            )}
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
                <input type="password" required minLength={8} value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition text-sm"
                  placeholder="Min 8 chars, upper + lower + number" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm new password</label>
                <input type="password" required minLength={8} value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition text-sm"
                  placeholder="Repeat your new password" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full px-6 py-3 bg-amber-400 hover:bg-amber-500 disabled:bg-amber-300 text-white font-bold rounded-lg transition shadow-sm">
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
          <Link to="/" className="inline-block">
            <img src="/GrowthLens%20Logo_no%20strapline.png" alt="GrowthLens" className="h-16 w-auto" />
          </Link>
        </div>
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-gray-500 text-sm mb-6">Log in to your GrowthLens account</p>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>
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
              <input type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition text-sm"
                placeholder="jane@yourfirm.com" />
            </div>
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} required value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition text-sm pr-10"
                  placeholder="Your password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {/* Forgot password */}
            <div className="text-right">
              <button type="button" onClick={handleResetPassword}
                className="text-xs text-amber-600 hover:text-amber-700 font-medium">
                Forgot your password?
              </button>
            </div>
            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full px-6 py-3 bg-amber-400 hover:bg-amber-500 disabled:bg-amber-300 text-white font-bold rounded-lg transition shadow-sm">
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
