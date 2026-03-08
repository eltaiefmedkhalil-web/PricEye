import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, TrendingUp, DollarSign, BarChart3, Home, Percent, Download } from 'lucide-react';
import SEO from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import LeadCaptureModal from '../../components/LeadCaptureModal';
import { useLeadCapture } from '../../hooks/useLeadCapture';

function RevenueBar({ label, value, maxValue, color, delay }: { label: string; value: number; maxValue: number; color: string; delay: number }) {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">{label}</span>
        <span className="font-semibold text-white">${value.toLocaleString()}</span>
      </div>
      <div className="h-10 rounded-lg bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay, ease: 'easeOut' }}
          className={`h-full rounded-lg ${color} flex items-center justify-end pr-3`}
        >
          {pct > 20 && (
            <span className="text-xs font-medium text-white/80">
              ${value.toLocaleString()}
            </span>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, accent }: { icon: typeof DollarSign; label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl p-5 border ${accent ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/[0.03] border-white/10'}`}>
      <div className="flex items-center gap-3 mb-2">
        <Icon className={`w-5 h-5 ${accent ? 'text-emerald-400' : 'text-slate-500'}`} />
        <span className="text-xs uppercase tracking-wider text-slate-500">{label}</span>
      </div>
      <p className={`text-2xl font-bold font-heading ${accent ? 'text-emerald-400' : 'text-white'}`}>{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  );
}

export default function RevenueCalculator() {
  const [listings, setListings] = useState(3);
  const [avgRate, setAvgRate] = useState(150);
  const [occupancy, setOccupancy] = useState(65);
  const [calculated, setCalculated] = useState(false);

  const lead = useLeadCapture('revenue-calculator');

  const results = useMemo(() => {
    const nights = 365;
    const currentRevenue = listings * avgRate * (occupancy / 100) * nights;
    const liftPercent = 0.18;
    const projectedRevenue = currentRevenue * (1 + liftPercent);
    const additionalRevenue = projectedRevenue - currentRevenue;
    const projectedOccupancy = Math.min(95, occupancy * 1.08);

    return {
      currentRevenue: Math.round(currentRevenue),
      projectedRevenue: Math.round(projectedRevenue),
      additionalRevenue: Math.round(additionalRevenue),
      liftPercent: Math.round(liftPercent * 100),
      currentOccupancy: occupancy,
      projectedOccupancy: Math.round(projectedOccupancy),
      perListing: Math.round(additionalRevenue / listings),
      monthly: Math.round(additionalRevenue / 12),
    };
  }, [listings, avgRate, occupancy]);

  const handleCalculate = () => {
    setCalculated(true);
  };

  const handleDownload = () => {
    lead.triggerGate({
      listings,
      avgRate,
      occupancy,
      ...results,
    });
  };

  return (
    <div className="min-h-screen bg-midnight-900 text-white">
      <SEO
        title="Free Airbnb Revenue Calculator | See Your Revenue Lift with Dynamic Pricing"
        description="Calculate how much more revenue you could earn from your Airbnb or vacation rental properties with AI-powered dynamic pricing. Free instant results."
        canonical="/tools/revenue-calculator"
      />
      <Navbar />

      <LeadCaptureModal
        show={lead.showGate}
        email={lead.email}
        onEmailChange={lead.setEmail}
        onSubmit={lead.submitLead}
        onClose={lead.closeGate}
        submitting={lead.submitting}
        error={lead.error}
        title="Download Your Revenue Report"
        description="Get a detailed breakdown of your potential revenue lift sent straight to your inbox."
      />

      <div className="pt-24 lg:pt-32 pb-20">
        <div className="section-container">
          <Link
            to="/tools"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            All Tools
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mb-12"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium tracking-wide uppercase mb-4">
              Revenue Calculator
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold font-heading mb-3">
              How Much Revenue Are You{' '}
              <span className="text-gradient-brand">Leaving on the Table?</span>
            </h1>
            <p className="text-slate-400">
              Enter your current numbers and see the projected revenue increase
              with AI-powered dynamic pricing from PricEye.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 glass-card p-8"
            >
              <h2 className="text-lg font-bold font-heading mb-6">Your Current Numbers</h2>

              <div className="space-y-6">
                <div>
                  <label className="flex items-center justify-between text-sm text-slate-400 mb-2">
                    <span className="flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      Number of Listings
                    </span>
                    <span className="text-white font-semibold text-lg">{listings}</span>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={50}
                    value={listings}
                    onChange={(e) => setListings(Number(e.target.value))}
                    className="w-full accent-brand-accent h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-accent [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-brand-accent/30"
                  />
                  <div className="flex justify-between text-xs text-slate-600 mt-1">
                    <span>1</span>
                    <span>50</span>
                  </div>
                </div>

                <div>
                  <label className="flex items-center justify-between text-sm text-slate-400 mb-2">
                    <span className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Avg. Nightly Rate
                    </span>
                    <span className="text-white font-semibold text-lg">${avgRate}</span>
                  </label>
                  <input
                    type="range"
                    min={50}
                    max={1000}
                    step={10}
                    value={avgRate}
                    onChange={(e) => setAvgRate(Number(e.target.value))}
                    className="w-full accent-brand-accent h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-accent [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-brand-accent/30"
                  />
                  <div className="flex justify-between text-xs text-slate-600 mt-1">
                    <span>$50</span>
                    <span>$1,000</span>
                  </div>
                </div>

                <div>
                  <label className="flex items-center justify-between text-sm text-slate-400 mb-2">
                    <span className="flex items-center gap-2">
                      <Percent className="w-4 h-4" />
                      Current Occupancy Rate
                    </span>
                    <span className="text-white font-semibold text-lg">{occupancy}%</span>
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={occupancy}
                    onChange={(e) => setOccupancy(Number(e.target.value))}
                    className="w-full accent-brand-accent h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-accent [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-brand-accent/30"
                  />
                  <div className="flex justify-between text-xs text-slate-600 mt-1">
                    <span>10%</span>
                    <span>100%</span>
                  </div>
                </div>

                <button
                  onClick={handleCalculate}
                  className="w-full btn-primary justify-center mt-4"
                >
                  Calculate My Revenue Lift
                  <TrendingUp className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3 space-y-6"
            >
              {calculated ? (
                <>
                  <div className="glass-card p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-bold font-heading">Revenue Comparison</h2>
                      <button
                        onClick={handleDownload}
                        className="text-sm text-brand-accent hover:text-white transition-colors flex items-center gap-1.5"
                      >
                        <Download className="w-4 h-4" />
                        {lead.submitted ? 'Sent!' : 'Download Report'}
                      </button>
                    </div>

                    <div className="space-y-5">
                      <RevenueBar
                        label="Current Annual Revenue"
                        value={results.currentRevenue}
                        maxValue={results.projectedRevenue}
                        color="bg-gradient-to-r from-slate-600 to-slate-500"
                        delay={0}
                      />
                      <RevenueBar
                        label="Projected Revenue with PricEye"
                        value={results.projectedRevenue}
                        maxValue={results.projectedRevenue}
                        color="bg-gradient-to-r from-emerald-600 to-teal-500"
                        delay={0.2}
                      />
                    </div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 }}
                      className="mt-6 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center"
                    >
                      <p className="text-sm text-slate-400 mb-1">Estimated Additional Revenue</p>
                      <p className="text-3xl font-bold text-emerald-400 font-heading">
                        +${results.additionalRevenue.toLocaleString()}/yr
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Based on PricEye's average {results.liftPercent}% revenue lift
                      </p>
                    </motion.div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <StatCard
                      icon={DollarSign}
                      label="Per Listing / Year"
                      value={`+$${results.perListing.toLocaleString()}`}
                      sub="Additional revenue per property"
                      accent
                    />
                    <StatCard
                      icon={BarChart3}
                      label="Monthly Gain"
                      value={`+$${results.monthly.toLocaleString()}`}
                      sub="Extra monthly cash flow"
                    />
                    <StatCard
                      icon={TrendingUp}
                      label="Occupancy Lift"
                      value={`${results.currentOccupancy}% -> ${results.projectedOccupancy}%`}
                      sub="Improved fill rate"
                    />
                  </div>

                  <div className="glass-card p-6 text-center">
                    <p className="text-slate-400 text-sm mb-4">
                      Ready to unlock +${results.additionalRevenue.toLocaleString()} in additional revenue?
                    </p>
                    <Link to="/signup" className="btn-primary inline-flex">
                      Start Free Trial to Reach This Goal
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </>
              ) : (
                <div className="glass-card p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                    <BarChart3 className="w-10 h-10 text-emerald-400/50" />
                  </div>
                  <h3 className="text-xl font-bold font-heading text-slate-300 mb-2">
                    Your Revenue Dashboard
                  </h3>
                  <p className="text-slate-500 text-sm max-w-sm">
                    Adjust the sliders on the left and click "Calculate" to see your personalized
                    revenue projection with PricEye AI dynamic pricing.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
