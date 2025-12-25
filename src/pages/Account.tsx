import { useState } from 'react'; // Ajout de useState
import { motion } from 'framer-motion';
import { LogOut, User, CreditCard, Calendar, ExternalLink, Loader2 } from 'lucide-react'; // Ajout de Loader2
import { useAuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export function Account() {
  const { user, profile, subscription, signOut, session } = useAuthContext(); // Récupération de la session
  const [loading, setLoading] = useState(false); // État de chargement

  const getSubscriptionBadge = () => {
    if (!subscription) return { text: 'No Subscription', color: 'bg-slate-500/20 text-slate-400' };
    switch (subscription.status) {
      case 'active':
        return { text: 'Active', color: 'bg-green-500/20 text-green-400' };
      case 'trialing':
        return { text: 'Trial', color: 'bg-brand-accent/20 text-brand-accent' };
      case 'past_due':
        return { text: 'Past Due', color: 'bg-yellow-500/20 text-yellow-400' };
      case 'canceled':
        return { text: 'Canceled', color: 'bg-red-500/20 text-red-400' };
      default:
        return { text: 'Pending', color: 'bg-slate-500/20 text-slate-400' };
    }
  };

  // Nouvelle fonction pour gérer l'abonnement
  const handleSubscribe = async () => {
    try {
      setLoading(true);
      
      if (!session?.access_token) {
        throw new Error('No active session');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            mode: 'subscription',
            trial_period_days: 30,
            success_url: `${window.location.origin}/success?onboarding=complete`,
            cancel_url: `${window.location.origin}/account`,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      // Vous pourriez ajouter une gestion d'erreur visuelle ici (ex: toast ou alert)
    } finally {
      setLoading(false);
    }
  };

  const badge = getSubscriptionBadge();
  const hasActiveSubscription = subscription?.status === 'active' || subscription?.status === 'trialing';

  return (
    <div className="min-h-screen bg-midnight-900 text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/5 via-brand-secondary/3 to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/10 rounded-full blur-[128px] opacity-30" />

      <nav className="relative z-10 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/">
                <span className="text-xl font-bold text-gradient">PricEye</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={signOut}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm">Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
            <p className="text-slate-400">Manage your account and subscription</p>
          </div>

          <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-brand-primary/20 flex items-center justify-center">
                <User className="w-6 h-6 text-brand-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Profile Information</h2>
                <p className="text-sm text-slate-400">Your account details</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400">Email</label>
                <p className="text-white">{user?.email}</p>
              </div>
              {profile?.full_name && (
                <div>
                  <label className="text-sm text-slate-400">Name</label>
                  <p className="text-white">{profile.full_name}</p>
                </div>
              )}
            </div>
          </div>

          <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-brand-accent/20 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-brand-accent" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Subscription</h2>
                <p className="text-sm text-slate-400">Manage your PricEye subscription</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm text-slate-400">Status</label>
                  <div className="mt-1">
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${badge.color}`}>
                      {badge.text}
                    </span>
                  </div>
                </div>
                {subscription?.current_period_end && (
                  <div className="text-right">
                    <label className="text-sm text-slate-400">Next Billing</label>
                    <p className="text-white font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/10">
                {hasActiveSubscription ? (
                  <a
                    href="https://pric-eye.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Open PricEye App
                  </a>
                ) : (
                  // Bouton modifié pour appeler handleSubscribe au lieu du lien vers /signup
                  <button 
                    onClick={handleSubscribe}
                    disabled={loading}
                    className="btn-primary inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Start Subscription'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}