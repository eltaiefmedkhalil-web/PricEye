import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle, TrendingUp, Bell, Star, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

// L'URL de votre application Dashboard
const DASHBOARD_URL = 'https://pric-eye.vercel.app';

export default function Hero() {
  // On récupère 'session' en plus de 'user' et 'loading'
  const { user, loading, session } = useAuthContext();

  const avatars = [
    'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
  ];

  // Construction dynamique de l'URL avec le token si la session existe
  const getDashboardUrl = () => {
    if (session?.access_token) {
      return `${DASHBOARD_URL}/?token=${session.access_token}`;
    }
    return DASHBOARD_URL;
  };

  return (
    <section className="relative min-h-screen pt-24 lg:pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/8 via-brand-secondary/5 to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/20 rounded-full blur-[128px] opacity-50" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-brand-accent/15 rounded-full blur-[100px] opacity-40" />

      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-accent/30 rounded-full px-4 py-2 mb-6"
            >
              <span className="text-sm">New Version Available</span>
              <span className="text-gradient-brand font-semibold text-sm">Explore</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Democratize dynamic pricing with{' '}
              <span className="text-gradient">high-quality AI.</span>
            </h1>

            <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Increase your revenue by <span className="text-gradient-brand font-semibold">+20% on average</span>.
              The transparent algorithm that analyzes 100+ factors so you never leave money on the table.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              {loading ? (
                <div className="btn-primary justify-center opacity-50">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Loading...
                </div>
              ) : user ? (
                // Utilisation de la fonction getDashboardUrl() pour le lien
                <a href={getDashboardUrl()} className="btn-primary justify-center">
                  Go to Dashboard
                  <ExternalLink className="w-5 h-5" />
                </a>
              ) : (
                <Link to="/signup" className="btn-primary justify-center">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}
              <button className="btn-secondary justify-center">
                <PlayCircle className="w-5 h-5" />
                Watch Demo
              </button>
            </div>

            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="flex -space-x-3">
                {avatars.map((avatar, i) => (
                  <img
                    key={i}
                    src={avatar}
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-midnight-900 object-cover"
                  />
                ))}
              </div>
              <div className="flex items-center gap-1 text-sm text-slate-400">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-white font-medium">100%</span> satisfied beta testers
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="perspective-1000"
          >
            <div
              className="transform-3d"
              style={{ transform: 'rotateY(-10deg) rotateX(5deg)' }}
            >
              <div className="glass-card p-6 shadow-2xl shadow-brand-primary/10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-xs text-slate-500">PricEye Dashboard</span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-brand-dark/50 rounded-xl p-4">
                    <p className="text-xs text-slate-500 mb-1">Revenue (30d)</p>
                    <p className="text-xl font-bold text-white">$12,847</p>
                    <span className="text-xs text-brand-accent">+12.3%</span>
                  </div>
                  <div className="bg-brand-dark/50 rounded-xl p-4">
                    <p className="text-xs text-slate-500 mb-1">Occupancy</p>
                    <p className="text-xl font-bold text-white">78.5%</p>
                    <span className="text-xs text-brand-accent">+5.2%</span>
                  </div>
                  <div className="bg-brand-dark/50 rounded-xl p-4">
                    <p className="text-xs text-slate-500 mb-1">ADR</p>
                    <p className="text-xl font-bold text-white">$185</p>
                    <span className="text-xs text-brand-accent">+8.7%</span>
                  </div>
                </div>

                <div className="bg-brand-dark/50 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-white">Revenue Trend</span>
                    <TrendingUp className="w-4 h-4 text-brand-accent" />
                  </div>
                  <div className="flex items-end gap-2 h-24">
                    {[40, 55, 45, 70, 60, 85, 75, 90, 80, 95, 88, 100].map((height, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.5, delay: 0.5 + i * 0.05 }}
                        className="flex-1 bg-gradient-to-t from-brand-primary to-brand-accent rounded-t"
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-brand-primary/10 border border-brand-accent/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Bell className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-white mb-1">Market Update</p>
                      <p className="text-xs text-slate-400">
                        Taylor Swift concert detected nearby. Price recommendation:
                        <span className="text-brand-accent font-semibold"> +25%</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}