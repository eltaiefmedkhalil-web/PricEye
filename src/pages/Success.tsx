import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ExternalLink, Loader2 } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';

const DASHBOARD_URL = 'https://app.priceye-ai.com';

export function Success() {
  const { session, subscription, refreshProfile, refreshSubscription } = useAuthContext();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const [refreshing, setRefreshing] = useState(true);
  const [redirectUrl, setRedirectUrl] = useState(DASHBOARD_URL);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    async function refresh() {
      await Promise.all([refreshProfile(), refreshSubscription()]);
      setRefreshing(false);
    }
    refresh();
  }, [refreshProfile, refreshSubscription]);

  useEffect(() => {
    if (refreshing) return;
    const status = subscription?.status;
    if (status === 'active' || status === 'trialing') {
      setVerified(true);
    } else {
      navigate('/account', { replace: true });
    }
  }, [refreshing, subscription, navigate]);

  useEffect(() => {
    if (session?.access_token) {
      const url = new URL(DASHBOARD_URL);
      url.searchParams.set('token', session.access_token);
      url.searchParams.set('refresh_token', session.refresh_token || '');
      setRedirectUrl(url.toString());
    }
  }, [session]);

  useEffect(() => {
    if (refreshing || !verified) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = redirectUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [refreshing, verified, redirectUrl]);

  return (
    <div className="min-h-screen bg-midnight-900 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/5 via-brand-secondary/3 to-transparent" />
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-brand-accent/10 rounded-full blur-[128px] opacity-50" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-md w-full"
      >
        <div className="glass-card p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
          >
            <CheckCircle className="w-10 h-10 text-green-400" />
          </motion.div>

          <h1 className="text-3xl font-bold text-white mb-3">
            Welcome to PricEye!
          </h1>
          <p className="text-slate-400 mb-8">
            Your 30-day free trial has started. Your card will not be charged until the trial ends.
          </p>

          <div className="glass-card p-6 mb-6 bg-brand-primary/5">
            {refreshing ? (
              <div className="flex items-center justify-center gap-3 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Setting up your account...</span>
              </div>
            ) : (
              <>
                <p className="text-slate-300 mb-2">
                  Redirecting to PricEye Dashboard in
                </p>
                <p className="text-4xl font-bold text-gradient mb-4">{countdown}</p>
                <p className="text-sm text-slate-500">seconds</p>
              </>
            )}
          </div>

          <a
            href={redirectUrl}
            className="w-full btn-primary justify-center"
          >
            Open PricEye Dashboard Now
            <ExternalLink className="w-5 h-5" />
          </a>

          <p className="mt-6 text-xs text-slate-500">
            If you are not redirected automatically, click the button above.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
