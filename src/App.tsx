import { lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeatureGrid from './components/FeatureGrid';
import GlassBox from './components/GlassBox';
import Timeline from './components/Timeline';
import Audience from './components/Audience';
import Support from './components/Support';
import PricingSection from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import SEO from './components/SEO';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Success } from './pages/Success';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Account } from './pages/Account';

const BlogIndex = lazy(() => import('./pages/BlogIndex'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const ToolsHub = lazy(() => import('./pages/ToolsHub'));
const RevenueCalculator = lazy(() => import('./pages/tools/RevenueCalculator'));
const HouseRulesGenerator = lazy(() => import('./pages/tools/HouseRulesGenerator'));
const CleaningFeeOptimizer = lazy(() => import('./pages/tools/CleaningFeeOptimizer'));

function LazyFallback() {
  return (
    <div className="min-h-screen bg-midnight-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-accent" />
    </div>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-midnight-900 text-white overflow-x-hidden">
      <SEO
        title="AI Dynamic Pricing for Airbnb & Short-Term Rentals"
        description="Maximize your Airbnb revenue by +20% with PricEye AI. Transparent dynamic pricing that analyzes 100+ factors for short-term rental hosts and property managers."
        canonical="/"
      />
      <Navbar />
      <main>
        <Hero />
        <FeatureGrid />
        <GlassBox />
        <Timeline />
        <Audience />
        <Support />
        <PricingSection />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

function AppRoutes() {
  const { user, loading, subscription } = useAuthContext();

  if (loading || (user && subscription === null)) {
    return (
      <div className="min-h-screen bg-midnight-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-accent"></div>
      </div>
    );
  }

  const hasActiveSubscription = subscription?.status === 'active' || subscription?.status === 'trialing';

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          user
            ? <Navigate to={hasActiveSubscription ? "/success" : "/account"} replace />
            : <Login />
        }
      />
      <Route
        path="/signup"
        element={
          user && hasActiveSubscription
            ? <Navigate to="/success" replace />
            : <Signup />
        }
      />
      <Route
        path="/forgot-password"
        element={user ? <Navigate to={hasActiveSubscription ? "/success" : "/account"} replace /> : <ForgotPassword />}
      />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/success"
        element={
          !user
            ? <Navigate to="/login" replace />
            : !hasActiveSubscription
              ? <Navigate to="/account" replace />
              : <Success />
        }
      />
      <Route path="/account" element={user ? <Account /> : <Navigate to="/login" replace />} />
      <Route path="/blog" element={<Suspense fallback={<LazyFallback />}><BlogIndex /></Suspense>} />
      <Route path="/blog/:slug" element={<Suspense fallback={<LazyFallback />}><BlogPost /></Suspense>} />
      <Route path="/tools" element={<Suspense fallback={<LazyFallback />}><ToolsHub /></Suspense>} />
      <Route path="/tools/revenue-calculator" element={<Suspense fallback={<LazyFallback />}><RevenueCalculator /></Suspense>} />
      <Route path="/tools/house-rules" element={<Suspense fallback={<LazyFallback />}><HouseRulesGenerator /></Suspense>} />
      <Route path="/tools/cleaning-fee" element={<Suspense fallback={<LazyFallback />}><CleaningFeeOptimizer /></Suspense>} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;