import { useState } from 'react';
import { Lock, ArrowRight, X, MessageCircle } from 'lucide-react';
import { PREMIUM_FEATURES, UPGRADE_BANNERS } from './gating';

// ─── Full Upgrade Prompt (for locked tabs) ──────────────────────
export function UpgradePrompt({ feature, onUpgrade }) {
  const info = PREMIUM_FEATURES[feature];
  if (!info) return null;

  return (
    <div className="flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-50 rounded-2xl mb-6">
          <Lock className="w-8 h-8 text-amber-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Unlock {info.label}
        </h3>
        <p className="text-gray-500 mb-8 leading-relaxed">
          {info.desc}
        </p>
        <button
          onClick={() => onUpgrade && onUpgrade(`Premium Upgrade Enquiry — ${info.label}`)}
          className="inline-flex items-center gap-2 px-8 py-3 bg-amber-400 hover:bg-amber-500 text-white font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md mb-4"
        >
          Upgrade to Premium
          <ArrowRight className="w-4 h-4" />
        </button>
        <div>
          <button
            onClick={() => onUpgrade && onUpgrade()}
            className="text-sm text-gray-400 hover:text-amber-600 transition inline-flex items-center gap-1"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Or talk to us
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Limit Reached Modal (for firm/assessment limits) ───────────
export function LimitModal({ isOpen, onClose, onUpgrade, type }) {
  if (!isOpen) return null;

  const messages = {
    firm: {
      title: 'Firm limit reached',
      desc: "You've reached the free plan limit of 1 firm. Upgrade to Premium for unlimited firms.",
    },
    assessment: {
      title: 'Assessment limit reached',
      desc: "You've reached the free plan limit of 1 assessment per firm. Upgrade to Premium for unlimited assessments.",
    },
  };

  const msg = messages[type] || messages.firm;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-50 rounded-xl mb-4">
          <Lock className="w-6 h-6 text-amber-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{msg.title}</h3>
        <p className="text-sm text-gray-500 mb-6">{msg.desc}</p>
        <button
          onClick={() => { onUpgrade && onUpgrade('Premium Upgrade Enquiry'); onClose(); }}
          className="w-full px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-white font-semibold rounded-lg transition mb-3"
        >
          Upgrade to Premium
        </button>
        <button
          onClick={() => { onUpgrade && onUpgrade(); onClose(); }}
          className="text-sm text-gray-400 hover:text-amber-600 transition inline-flex items-center gap-1"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Talk to us
        </button>
      </div>
    </div>
  );
}

// ─── Inline Upgrade Banner (dismissible, for contextual nudges) ─
export function UpgradeBanner({ bannerKey, onUpgrade }) {
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem(`gdmf_banner_${bannerKey}`) === '1'; }
    catch { return false; }
  });

  if (dismissed) return null;

  const text = UPGRADE_BANNERS[bannerKey];
  if (!text) return null;

  const handleDismiss = () => {
    setDismissed(true);
    try { localStorage.setItem(`gdmf_banner_${bannerKey}`, '1'); } catch {}
  };

  return (
    <div className="mt-6 mx-auto max-w-2xl bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-center gap-3">
      <p className="flex-1 text-sm text-amber-800">
        {text}{' '}
        <button
          onClick={() => onUpgrade && onUpgrade('Premium Upgrade Enquiry')}
          className="font-semibold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1"
        >
          Upgrade to Premium <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </p>
      <button onClick={handleDismiss} className="text-amber-400 hover:text-amber-600 flex-shrink-0">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
