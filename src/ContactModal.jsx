import { useState, createContext, useContext, useCallback } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';

// ─── Contact Modal Context ──────────────────────────────────────
const ContactModalContext = createContext(null);

export function useContactModal() {
  return useContext(ContactModalContext);
}

export function ContactModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultSubject, setDefaultSubject] = useState('');

  const openContactModal = useCallback((subject) => {
    setDefaultSubject(subject || '');
    setIsOpen(true);
  }, []);

  const closeContactModal = useCallback(() => {
    setIsOpen(false);
    setDefaultSubject('');
  }, []);

  return (
    <ContactModalContext.Provider value={{ openContactModal, closeContactModal }}>
      {children}
      <ContactModal
        isOpen={isOpen}
        onClose={closeContactModal}
        defaultSubject={defaultSubject}
      />
    </ContactModalContext.Provider>
  );
}

// ─── Contact Modal Component ────────────────────────────────────
function ContactModal({ isOpen, onClose, defaultSubject }) {
  const { user, profile } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill on open
  const effectiveName = name || profile?.full_name || '';
  const effectiveEmail = email || user?.email || '';
  const effectiveSubject = subject || defaultSubject || '';

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!effectiveName.trim() || !effectiveEmail.trim() || !message.trim()) return;

    setSending(true);
    setError('');

    try {
      const { error: dbError } = await supabase
        .from('contact_submissions')
        .insert({
          name: effectiveName.trim(),
          email: effectiveEmail.trim(),
          subject: effectiveSubject.trim() || null,
          message: message.trim(),
          user_id: user?.id || null,
        });

      if (dbError) throw dbError;
      setSent(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Contact submission error:', err);
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setSent(false);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={handleClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-gray-900">Get in touch</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {sent ? (
          /* Success state */
          <div className="px-6 py-12 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-green-50 rounded-full mb-4">
              <CheckCircle2 className="w-7 h-7 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Message sent</h3>
            <p className="text-gray-500 mb-6">Thanks — we'll be in touch within 24 hours.</p>
            <button
              onClick={handleClose}
              className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition"
            >
              Close
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={effectiveName}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={effectiveEmail}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                value={effectiveSubject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="How can we help?"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us more..."
                required
                rows={4}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 resize-none"
              />
            </div>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <button
              type="submit"
              disabled={sending}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-500 disabled:bg-amber-300 text-white font-semibold rounded-lg transition"
            >
              {sending ? (
                'Sending...'
              ) : (
                <>
                  Send Message
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
