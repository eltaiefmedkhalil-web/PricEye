import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading, signOut } = useAuthContext();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'For Whom?', href: '#audience' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 bg-brand-darkest/80 backdrop-blur-xl border-b border-brand-primary/10"
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2">
            <img src="/p_priceeye_vecto_(1).png" alt="PricEye" className="w-9 h-12" />
            <span className="text-xl font-bold text-white font-heading">PricEye</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-slate-400 hover:text-white transition-colors duration-200 text-sm font-medium"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {loading ? (
              <div className="w-32 h-10 bg-white/5 rounded-xl animate-pulse" />
            ) : user ? (
              <>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 transition-all duration-200 text-slate-400 hover:text-red-400"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
                <Link to="/account" className="btn-primary text-sm">
                  My Account
                  <User className="w-4 h-4" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-accent/30 transition-all duration-200 text-slate-400 hover:text-white text-sm font-medium"
                >
                  Login
                </Link>
                <Link to="/signup" className="btn-primary text-sm">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white p-2"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-brand-darkest/95 backdrop-blur-xl border-b border-brand-primary/10"
          >
            <div className="section-container py-4 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-slate-400 hover:text-white transition-colors duration-200 py-2"
                >
                  {link.name}
                </a>
              ))}
              {loading ? (
                <div className="w-full h-12 bg-white/5 rounded-xl animate-pulse" />
              ) : user ? (
                <>
                  <Link
                    to="/account"
                    onClick={() => setIsOpen(false)}
                    className="btn-primary w-full justify-center text-sm"
                  >
                    My Account
                    <User className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full p-3 rounded-lg bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 transition-all duration-200 text-slate-400 hover:text-red-400 flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-accent/30 transition-all duration-200 text-slate-400 hover:text-white flex items-center justify-center gap-2 mt-4"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="btn-primary w-full justify-center text-sm"
                  >
                    Start Free Trial
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
