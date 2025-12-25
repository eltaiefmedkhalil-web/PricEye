import { motion } from 'framer-motion';
import { Check, Building, Home, ArrowRight, Shield, Zap, Headphones, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const parentTiers = [
  { range: '1st unit', price: '13.99' },
  { range: 'Units 2-5', price: '11.99' },
  { range: 'Units 6-15', price: '8.99' },
  { range: 'Units 16-30', price: '5.49' },
  { range: '30+ units', price: '3.99' },
];

const features = [
  { icon: Zap, label: 'Unlimited Sync' },
  { icon: Shield, label: 'Explainable AI' },
  { icon: Headphones, label: 'Priority Support' },
];

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-20 lg:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-dark/50 to-transparent" />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 font-heading">
            Smart Hybrid <span className="text-gradient-brand">Pricing</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-6">
            Mix standalone properties and buildings on the same invoice. We automatically apply the discounted rate to grouped units.
          </p>
          <div className="inline-flex items-center gap-3 bg-brand-accent/10 border border-brand-accent/30 rounded-full px-5 py-2.5">
            <CreditCard className="w-4 h-4 text-brand-accent" />
            <span className="text-sm text-brand-accent font-medium">
              30-day free trial. No commitment. No credit card required.
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-8 lg:p-10 max-w-4xl mx-auto relative overflow-hidden mb-12"
        >
          <div className="absolute top-0 right-0 bg-gradient-to-r from-brand-primary to-brand-accent text-white text-xs font-semibold px-4 py-1.5 rounded-bl-lg">
            Smart Billing
          </div>

          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2 font-heading">One Formula, Two Rates</h3>
            <p className="text-slate-400 text-sm">
              The system automatically categorizes your units and applies the best rate
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-brand-dark/30 rounded-xl p-6 border border-brand-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-brand-primary/20 rounded-xl flex items-center justify-center">
                  <Home className="w-6 h-6 text-brand-accent" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white font-heading">Parent Units</h4>
                  <p className="text-xs text-brand-accent">Tiered Pricing</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Standalone properties OR first unit of a building
              </p>
              <div className="space-y-2">
                {parentTiers.map((tier, index) => (
                  <div
                    key={tier.range}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      index === 0 ? 'bg-brand-primary/10 border border-brand-accent/30' : 'bg-brand-dark/50'
                    }`}
                  >
                    <span className={`text-xs ${index === 0 ? 'text-white font-medium' : 'text-slate-400'}`}>
                      {tier.range}
                    </span>
                    <span className={`text-sm font-semibold ${index === 0 ? 'text-brand-accent' : 'text-white'}`}>
                      €{tier.price}<span className="text-slate-500 text-xs font-normal">/mo</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-brand-dark/30 rounded-xl p-6 border border-brand-accent/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-brand-accent/20 rounded-xl flex items-center justify-center">
                  <Building className="w-6 h-6 text-brand-accent" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white font-heading">Child Units</h4>
                  <p className="text-xs text-brand-accent">Flat Discount</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Additional units at the same address as a Parent
              </p>
              <div className="bg-gradient-to-br from-brand-accent/10 to-brand-primary/5 rounded-xl p-6 border border-brand-accent/30">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-white">€3.99</span>
                  <span className="text-slate-400 text-sm">/ unit / month</span>
                </div>
                <p className="text-xs text-brand-accent font-medium">Automatically applied to grouped units</p>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-start gap-2 text-xs text-slate-400">
                  <Check className="w-3.5 h-3.5 text-brand-accent shrink-0 mt-0.5" />
                  Same physical address as Parent
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-400">
                  <Check className="w-3.5 h-3.5 text-brand-accent shrink-0 mt-0.5" />
                  Minimum 2 units to qualify
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-brand-primary/10 pt-6 mb-6">
            <p className="text-sm text-slate-400 mb-4">All units include:</p>
            <div className="flex flex-wrap gap-3">
              {features.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 bg-brand-dark/50 px-3 py-1.5 rounded-full text-xs text-slate-300"
                >
                  <Icon className="w-3.5 h-3.5 text-brand-accent" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/signup')}
            className="btn-primary w-full justify-center"
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
