import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Sparkles, MapPin, BedDouble, DollarSign,
  TrendingDown, TrendingUp, Minus, Download, AlertTriangle, CheckCircle,
} from 'lucide-react';
import SEO from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import LeadCaptureModal from '../../components/LeadCaptureModal';
import { useLeadCapture } from '../../hooks/useLeadCapture';

interface CityBenchmark {
  label: string;
  baseCleaningFee: number;
  perBedroomAdd: number;
  laundryMultiplier: number;
}

const cities: Record<string, CityBenchmark> = {
  new_york: { label: 'New York, NY', baseCleaningFee: 95, perBedroomAdd: 35, laundryMultiplier: 1.15 },
  los_angeles: { label: 'Los Angeles, CA', baseCleaningFee: 85, perBedroomAdd: 30, laundryMultiplier: 1.1 },
  miami: { label: 'Miami, FL', baseCleaningFee: 80, perBedroomAdd: 28, laundryMultiplier: 1.05 },
  chicago: { label: 'Chicago, IL', baseCleaningFee: 75, perBedroomAdd: 25, laundryMultiplier: 1.08 },
  austin: { label: 'Austin, TX', baseCleaningFee: 70, perBedroomAdd: 22, laundryMultiplier: 1.0 },
  denver: { label: 'Denver, CO', baseCleaningFee: 72, perBedroomAdd: 24, laundryMultiplier: 1.05 },
  nashville: { label: 'Nashville, TN', baseCleaningFee: 68, perBedroomAdd: 22, laundryMultiplier: 1.0 },
  seattle: { label: 'Seattle, WA', baseCleaningFee: 88, perBedroomAdd: 30, laundryMultiplier: 1.12 },
  san_francisco: { label: 'San Francisco, CA', baseCleaningFee: 100, perBedroomAdd: 38, laundryMultiplier: 1.2 },
  orlando: { label: 'Orlando, FL', baseCleaningFee: 65, perBedroomAdd: 20, laundryMultiplier: 1.0 },
  london: { label: 'London, UK', baseCleaningFee: 90, perBedroomAdd: 32, laundryMultiplier: 1.15 },
  paris: { label: 'Paris, France', baseCleaningFee: 85, perBedroomAdd: 30, laundryMultiplier: 1.1 },
  barcelona: { label: 'Barcelona, Spain', baseCleaningFee: 60, perBedroomAdd: 18, laundryMultiplier: 1.0 },
  dubai: { label: 'Dubai, UAE', baseCleaningFee: 70, perBedroomAdd: 25, laundryMultiplier: 1.05 },
  lisbon: { label: 'Lisbon, Portugal', baseCleaningFee: 50, perBedroomAdd: 15, laundryMultiplier: 0.95 },
  other: { label: 'Other City', baseCleaningFee: 70, perBedroomAdd: 22, laundryMultiplier: 1.0 },
};

function Gauge({ value, label, status }: { value: number; label: string; status: 'low' | 'optimal' | 'high' }) {
  const clampedValue = Math.max(-100, Math.min(100, value));
  const angle = (clampedValue / 100) * 90;

  const colors = {
    low: { bg: 'text-amber-400', ring: 'stroke-amber-400' },
    optimal: { bg: 'text-emerald-400', ring: 'stroke-emerald-400' },
    high: { bg: 'text-red-400', ring: 'stroke-red-400' },
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-24 overflow-hidden">
        <svg viewBox="0 0 200 110" className="w-full h-full">
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            className={colors[status].ring}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray="251"
            strokeDashoffset={251 - ((angle + 90) / 180) * 251}
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="30"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${angle}, 100, 100)`}
            style={{ transition: 'transform 1s ease-out' }}
          />
          <circle cx="100" cy="100" r="6" fill="white" />
        </svg>
      </div>
      <p className={`text-sm font-semibold mt-2 ${colors[status].bg}`}>{label}</p>
    </div>
  );
}

export default function CleaningFeeOptimizer() {
  const [city, setCity] = useState('');
  const [bedrooms, setBedrooms] = useState(2);
  const [currentFee, setCurrentFee] = useState(100);
  const [laundryCost, setLaundryCost] = useState(15);
  const [analyzed, setAnalyzed] = useState(false);

  const lead = useLeadCapture('cleaning-fee-optimizer');

  const results = useMemo(() => {
    if (!city) return null;
    const benchmark = cities[city];
    const recommendedFee = Math.round(
      (benchmark.baseCleaningFee + benchmark.perBedroomAdd * (bedrooms - 1)) *
      benchmark.laundryMultiplier *
      (1 + (laundryCost - 10) * 0.005)
    );

    const diff = currentFee - recommendedFee;
    const diffPercent = Math.round((diff / recommendedFee) * 100);

    let status: 'low' | 'optimal' | 'high';
    let message: string;
    let advice: string;

    if (diffPercent > 15) {
      status = 'high';
      message = `You are overcharging by ~$${Math.abs(diff)}`;
      advice = 'A high cleaning fee can deter bookings and reduce occupancy. Guests compare total cost when choosing a listing. Lowering your fee closer to market rate could increase your booking rate significantly.';
    } else if (diffPercent < -15) {
      status = 'low';
      message = `You are undercharging by ~$${Math.abs(diff)}`;
      advice = 'Your cleaning fee is below market average. While this may attract bookings, you are likely absorbing costs that should be covered. Raising your fee to market rate can improve margins without impacting demand.';
    } else {
      status = 'optimal';
      message = 'Your fee is in the optimal range';
      advice = 'Your cleaning fee aligns well with market benchmarks for your area and property size. Keep monitoring local trends to stay competitive.';
    }

    const rangeMin = Math.round(recommendedFee * 0.85);
    const rangeMax = Math.round(recommendedFee * 1.15);

    return {
      recommendedFee,
      diff,
      diffPercent,
      status,
      message,
      advice,
      rangeMin,
      rangeMax,
      cityLabel: benchmark.label,
    };
  }, [city, bedrooms, currentFee, laundryCost]);

  const handleAnalyze = () => {
    if (city) setAnalyzed(true);
  };

  const handleDownload = () => {
    lead.triggerGate({
      city,
      bedrooms,
      currentFee,
      laundryCost,
      recommendedFee: results?.recommendedFee,
      status: results?.status,
    });
  };

  return (
    <div className="min-h-screen bg-midnight-900 text-white">
      <SEO
        title="Free Cleaning Fee Optimizer for Airbnb | Market Benchmark Comparison"
        description="Compare your Airbnb cleaning fee against industry benchmarks. Find out if you are overcharging or undercharging guests. Free analysis for 15+ cities."
        canonical="/tools/cleaning-fee"
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
        title="Get Your Full Fee Analysis"
        description="Enter your email to receive a detailed cleaning fee benchmark report for your area."
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
            <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium tracking-wide uppercase mb-4">
              Cleaning Fee Optimizer
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold font-heading mb-3">
              Is Your Cleaning Fee{' '}
              <span className="text-gradient-brand">Costing You Bookings?</span>
            </h1>
            <p className="text-slate-400">
              Compare your cleaning fee against industry benchmarks for your city and property size.
              Every dollar matters in your pricing strategy.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 glass-card p-8"
            >
              <h2 className="text-lg font-bold font-heading mb-6">Your Property Details</h2>

              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                    <MapPin className="w-4 h-4" />
                    City / Market
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/25 transition-all appearance-none"
                  >
                    <option value="" className="bg-slate-900">Select your city...</option>
                    {Object.entries(cities).map(([key, c]) => (
                      <option key={key} value={key} className="bg-slate-900">{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center justify-between text-sm text-slate-400 mb-2">
                    <span className="flex items-center gap-2">
                      <BedDouble className="w-4 h-4" />
                      Number of Bedrooms
                    </span>
                    <span className="text-white font-semibold text-lg">{bedrooms}</span>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full accent-brand-accent h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-accent [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-brand-accent/30"
                  />
                  <div className="flex justify-between text-xs text-slate-600 mt-1">
                    <span>1</span>
                    <span>10</span>
                  </div>
                </div>

                <div>
                  <label className="flex items-center justify-between text-sm text-slate-400 mb-2">
                    <span className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Your Current Cleaning Fee
                    </span>
                    <span className="text-white font-semibold text-lg">${currentFee}</span>
                  </label>
                  <input
                    type="range"
                    min={20}
                    max={500}
                    step={5}
                    value={currentFee}
                    onChange={(e) => setCurrentFee(Number(e.target.value))}
                    className="w-full accent-brand-accent h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-accent [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-brand-accent/30"
                  />
                  <div className="flex justify-between text-xs text-slate-600 mt-1">
                    <span>$20</span>
                    <span>$500</span>
                  </div>
                </div>

                <div>
                  <label className="flex items-center justify-between text-sm text-slate-400 mb-2">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Local Laundry Cost (per load)
                    </span>
                    <span className="text-white font-semibold text-lg">${laundryCost}</span>
                  </label>
                  <input
                    type="range"
                    min={5}
                    max={50}
                    value={laundryCost}
                    onChange={(e) => setLaundryCost(Number(e.target.value))}
                    className="w-full accent-brand-accent h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-accent [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-brand-accent/30"
                  />
                  <div className="flex justify-between text-xs text-slate-600 mt-1">
                    <span>$5</span>
                    <span>$50</span>
                  </div>
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={!city}
                  className="w-full btn-primary justify-center disabled:opacity-40 disabled:cursor-not-allowed mt-4"
                >
                  Analyze My Cleaning Fee
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3"
            >
              <AnimatePresence mode="wait">
                {analyzed && results ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="glass-card p-8">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold font-heading">Fee Analysis</h2>
                        <button
                          onClick={handleDownload}
                          className="text-sm text-brand-accent hover:text-white transition-colors flex items-center gap-1.5"
                        >
                          <Download className="w-4 h-4" />
                          {lead.submitted ? 'Sent!' : 'Full Report'}
                        </button>
                      </div>

                      <div className="flex justify-center mb-8">
                        <Gauge
                          value={results.diffPercent}
                          label={results.status === 'optimal' ? 'Optimal' : results.status === 'high' ? 'Too High' : 'Too Low'}
                          status={results.status}
                        />
                      </div>

                      <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                        results.status === 'optimal'
                          ? 'bg-emerald-500/5 border-emerald-500/20'
                          : results.status === 'high'
                            ? 'bg-red-500/5 border-red-500/20'
                            : 'bg-amber-500/5 border-amber-500/20'
                      }`}>
                        {results.status === 'optimal' ? (
                          <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                        ) : (
                          <AlertTriangle className={`w-5 h-5 mt-0.5 shrink-0 ${results.status === 'high' ? 'text-red-400' : 'text-amber-400'}`} />
                        )}
                        <div>
                          <p className="font-semibold text-white text-sm mb-1">{results.message}</p>
                          <p className="text-slate-400 text-sm leading-relaxed">{results.advice}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="rounded-xl p-5 border bg-white/[0.03] border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-5 h-5 text-slate-500" />
                          <span className="text-xs uppercase tracking-wider text-slate-500">Your Fee</span>
                        </div>
                        <p className="text-2xl font-bold font-heading text-white">${currentFee}</p>
                      </div>

                      <div className="rounded-xl p-5 border bg-emerald-500/5 border-emerald-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-5 h-5 text-emerald-400" />
                          <span className="text-xs uppercase tracking-wider text-slate-500">Recommended</span>
                        </div>
                        <p className="text-2xl font-bold font-heading text-emerald-400">${results.recommendedFee}</p>
                      </div>

                      <div className="rounded-xl p-5 border bg-white/[0.03] border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          {results.diff > 0 ? (
                            <TrendingDown className="w-5 h-5 text-red-400" />
                          ) : results.diff < 0 ? (
                            <TrendingUp className="w-5 h-5 text-amber-400" />
                          ) : (
                            <Minus className="w-5 h-5 text-emerald-400" />
                          )}
                          <span className="text-xs uppercase tracking-wider text-slate-500">Difference</span>
                        </div>
                        <p className={`text-2xl font-bold font-heading ${
                          results.diff === 0 ? 'text-emerald-400' : results.diff > 0 ? 'text-red-400' : 'text-amber-400'
                        }`}>
                          {results.diff > 0 ? '+' : ''}{results.diff === 0 ? '$0' : `$${results.diff}`}
                        </p>
                      </div>
                    </div>

                    <div className="glass-card p-6">
                      <h3 className="text-sm font-semibold text-slate-300 mb-4">Market Range for {results.cityLabel}</h3>
                      <div className="relative h-12 rounded-lg bg-white/5 overflow-hidden">
                        <div className="absolute inset-y-0 bg-emerald-500/10 border-x border-emerald-500/30"
                          style={{
                            left: `${(results.rangeMin / 500) * 100}%`,
                            right: `${100 - (results.rangeMax / 500) * 100}%`,
                          }}
                        />
                        <motion.div
                          initial={{ left: '0%' }}
                          animate={{ left: `${(currentFee / 500) * 100}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="absolute top-0 bottom-0 w-1 bg-white rounded-full"
                          style={{ transform: 'translateX(-50%)' }}
                        >
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-white whitespace-nowrap bg-white/10 px-2 py-0.5 rounded">
                            ${currentFee}
                          </div>
                        </motion.div>
                      </div>
                      <div className="flex justify-between text-xs text-slate-600 mt-2">
                        <span>${results.rangeMin} (low)</span>
                        <span className="text-emerald-400">${results.recommendedFee} (ideal)</span>
                        <span>${results.rangeMax} (high)</span>
                      </div>
                    </div>

                    <div className="glass-card p-6 text-center">
                      <p className="text-slate-400 text-sm mb-4">
                        Cleaning fees are just one piece of the puzzle. Let PricEye optimize your entire pricing strategy.
                      </p>
                      <Link to="/signup" className="btn-primary inline-flex">
                        Start Free Trial
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    className="glass-card p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px]"
                  >
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 flex items-center justify-center mb-6">
                      <Sparkles className="w-10 h-10 text-amber-400/50" />
                    </div>
                    <h3 className="text-xl font-bold font-heading text-slate-300 mb-2">
                      Your Fee Analysis
                    </h3>
                    <p className="text-slate-500 text-sm max-w-sm">
                      Select your city, enter your property details, and click "Analyze"
                      to see how your cleaning fee compares to the market.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
