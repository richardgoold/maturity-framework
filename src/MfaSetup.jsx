import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { Shield, ShieldCheck, ShieldOff, X, Copy, Check } from 'lucide-react';

export default function MfaSetup({ isOpen, onClose, onStatusChange }) {
  const [step, setStep] = useState('loading');
  const [qrCode, setQrCode] = useState(null);
  const [secret, setSecret] = useState(null);
  const [factorId, setFactorId] = useState(null);
  const [verifyCode, setVerifyCode] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) checkMfaStatus();
  }, [isOpen]);

  async function checkMfaStatus() {
    setStep('loading');
    setError(null);
    try {
      const { data: factors, error: factorError } = await supabase.auth.mfa.listFactors();
      if (factorError) throw factorError;
      const totpFactors = factors?.totp || [];
      const verifiedFactors = totpFactors.filter(f => f.status === 'verified');
      if (verifiedFactors.length > 0) {
        setFactorId(verifiedFactors[0].id);
        setStep('enrolled');
      } else {
        setStep('not_enrolled');
      }
    } catch (err) {
      setError(err.message);
      setStep('not_enrolled');
    }
  }

  async function handleEnroll() {
    setLoading(true);
    setError(null);
    try {
      const { data, error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'GrowthLens Authenticator',
      });
      if (enrollError) throw enrollError;
      setQrCode(data.totp.qr_code);
      setSecret(data.totp.secret);
      setFactorId(data.id);
      setStep('qr');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    if (verifyCode.length !== 6) { setError('Please enter a 6-digit code.'); return; }
    setLoading(true);
    setError(null);
    try {
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
      if (challengeError) throw challengeError;
      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId, challengeId: challenge.id, code: verifyCode,
      });
      if (verifyError) throw verifyError;
      setStep('enrolled');
      setVerifyCode('');
      if (onStatusChange) onStatusChange(true);
    } catch (err) {
      setError(err.message);
      setVerifyCode('');
    } finally {
      setLoading(false);
    }
  }

  async function handleUnenroll() {
    setLoading(true);
    setError(null);
    try {
      const { error: unenrollError } = await supabase.auth.mfa.unenroll({ factorId });
      if (unenrollError) throw unenrollError;
      setStep('not_enrolled');
      setFactorId(null);
      setQrCode(null);
      setSecret(null);
      if (onStatusChange) onStatusChange(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function copySecret() {
    if (secret) {
      navigator.clipboard.writeText(secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-gray-900">Two-Factor Authentication</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>
          )}

          {step === 'loading' && (
            <div className="text-center py-8 text-gray-500">Checking 2FA status...</div>
          )}

          {step === 'not_enrolled' && (
            <div className="text-center">
              <ShieldOff className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-gray-900 mb-2">2FA is not enabled</h3>
              <p className="text-sm text-gray-500 mb-6">Add an extra layer of security to your admin account by enabling two-factor authentication with an authenticator app.</p>
              <button onClick={handleEnroll} disabled={loading} className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 disabled:bg-amber-300 text-white font-bold rounded-lg transition shadow-sm">
                {loading ? 'Setting up...' : 'Enable 2FA'}
              </button>
            </div>
          )}

          {step === 'qr' && (
            <div className="text-center">
              <h3 className="text-base font-semibold text-gray-900 mb-2">Scan QR Code</h3>
              <p className="text-sm text-gray-500 mb-4">Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)</p>
              {qrCode && (
                <div className="flex justify-center mb-4">
                  <img src={qrCode} alt="MFA QR Code" className="w-48 h-48 rounded-lg border border-gray-200" />
                </div>
              )}
              {secret && (
                <div className="mb-4">
                  <p className="text-xs text-gray-400 mb-1">Or enter this code manually:</p>
                  <div className="flex items-center justify-center gap-2">
                    <code className="text-xs bg-gray-100 px-3 py-1.5 rounded font-mono tracking-wider">{secret}</code>
                    <button onClick={copySecret} className="text-gray-400 hover:text-gray-600">
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}
              <button onClick={() => setStep('verify')} className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-white font-bold rounded-lg transition shadow-sm">
                I've scanned the code
              </button>
            </div>
          )}

          {step === 'verify' && (
            <div className="text-center">
              <h3 className="text-base font-semibold text-gray-900 mb-2">Verify Setup</h3>
              <p className="text-sm text-gray-500 mb-4">Enter the 6-digit code from your authenticator app to confirm setup.</p>
              <input type="text" inputMode="numeric" maxLength={6} value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-40 mx-auto text-center text-2xl tracking-[0.5em] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition font-mono"
                placeholder="000000" autoFocus />
              <div className="mt-4 flex gap-3 justify-center">
                <button onClick={() => { setStep('qr'); setVerifyCode(''); setError(null); }} className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium">Back</button>
                <button onClick={handleVerify} disabled={loading || verifyCode.length !== 6} className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 disabled:bg-amber-300 text-white font-bold rounded-lg transition shadow-sm">
                  {loading ? 'Verifying...' : 'Verify & Enable'}
                </button>
              </div>
            </div>
          )}

          {step === 'enrolled' && (
            <div className="text-center">
              <ShieldCheck className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-gray-900 mb-2">2FA is enabled</h3>
              <p className="text-sm text-gray-500 mb-6">Your account is protected with two-factor authentication. You will need your authenticator app code each time you log in.</p>
              <button onClick={() => setStep('unenroll_confirm')} className="px-4 py-2 text-red-600 hover:text-red-700 text-sm font-medium border border-red-200 rounded-lg hover:bg-red-50 transition">
                Disable 2FA
              </button>
            </div>
          )}

          {step === 'unenroll_confirm' && (
            <div className="text-center">
              <h3 className="text-base font-semibold text-gray-900 mb-2">Disable 2FA?</h3>
              <p className="text-sm text-gray-500 mb-6">This will remove two-factor authentication from your account. Are you sure?</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setStep('enrolled')} className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium">Cancel</button>
                <button onClick={handleUnenroll} disabled={loading} className="px-6 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-bold rounded-lg transition shadow-sm">
                  {loading ? 'Disabling...' : 'Yes, disable 2FA'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
