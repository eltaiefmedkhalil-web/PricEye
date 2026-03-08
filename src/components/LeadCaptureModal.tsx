import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ArrowRight, Lock } from 'lucide-react';

interface LeadCaptureModalProps {
  show: boolean;
  email: string;
  onEmailChange: (email: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  submitting: boolean;
  error: string;
  title?: string;
  description?: string;
}

export default function LeadCaptureModal({
  show,
  email,
  onEmailChange,
  onSubmit,
  onClose,
  submitting,
  error,
  title = 'Unlock Your Full Report',
  description = 'Enter your email to download your personalized results and get exclusive pricing insights.',
}: LeadCaptureModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md glass-card p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-primary/20 to-brand-accent/20 border border-brand-primary/30 flex items-center justify-center mb-6">
              <Mail className="w-7 h-7 text-brand-accent" />
            </div>

            <h3 className="text-xl font-bold text-white font-heading mb-2">
              {title}
            </h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              {description}
            </p>

            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
                  placeholder="your@email.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/25 transition-all"
                  autoFocus
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <button
                onClick={onSubmit}
                disabled={submitting}
                className="w-full btn-primary justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                ) : (
                  <>
                    Get My Report
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
                <Lock className="w-3 h-3" />
                <span>No spam. Unsubscribe anytime.</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
