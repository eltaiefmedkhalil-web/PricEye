import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeatureGrid from './components/FeatureGrid';
import GlassBox from './components/GlassBox';
import Timeline from './components/Timeline';
import Audience from './components/Audience';
import Support from './components/Support';
import PricingSection from './components/Pricing';
import Footer from './components/Footer';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Success } from './pages/Success';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Account } from './pages/Account';

function LandingPage() {
  return (
    <div className="min-h-screen bg-midnight-900 text-white overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <FeatureGrid />
        <GlassBox />
        <Timeline />
        <Audience />
        <Support />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}

function AppRoutes() {
  const { user, loading, subscription } = useAuthContext();

  if (loading) {
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
        element={user ? <Navigate to="/success" replace /> : <ForgotPassword />}
      />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/success" element={user ? <Success /> : <Navigate to="/login" replace />} />
      <Route path="/account" element={user ? <Account /> : <Navigate to="/login" replace />} />
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