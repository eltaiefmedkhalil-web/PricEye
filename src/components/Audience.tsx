import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Building, Sparkles, Clock, Heart, Users, Layers, Sliders, PieChart, Check } from 'lucide-react';

const audienceData = {
  hosts: {
    title: 'Individual Hosts',
    subtitle: '1-5 properties',
    icon: Home,
    features: [
      { icon: Sparkles, title: 'Simplicity First', description: 'Set it and forget it. No complex configurations needed.' },
      { icon: Clock, title: 'Time Saver', description: 'Spend minutes, not hours, on pricing. Focus on guest experience.' },
      { icon: Heart, title: 'Peace of Mind', description: 'Sleep well knowing your prices are always competitive.' },
    ],
    benefits: ['Automatic price updates', 'Simple dashboard', 'Mobile-friendly', 'Email notifications'],
  },
  professionals: {
    title: 'Property Managers',
    subtitle: '5-50+ properties',
    icon: Building,
    features: [
      { icon: Users, title: 'Group Management', description: 'Manage buildings and multi-unit properties with ease.' },
      { icon: Layers, title: 'Multi-Account', description: 'Connect multiple Airbnb/Booking accounts in one place.' },
      { icon: Sliders, title: 'Advanced Rules', description: 'Create complex pricing rules for different property types.' },
    ],
    benefits: ['Portfolio overview', 'Bulk operations', 'Team access', 'API access', 'Custom reports'],
  },
};

export default function Audience() {
  const [activeTab, setActiveTab] = useState<'hosts' | 'professionals'>('hosts');
  const data = audienceData[activeTab];

  return (
    <section id="audience" className="py-20 lg:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-primary/5 to-transparent" />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 font-heading">
            A solution <span className="text-gradient-brand">tailored to your size</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-8">
            Whether you manage one cozy apartment or a portfolio of properties, PricEye adapts to your needs.
          </p>

          <div className="inline-flex items-center bg-brand-dark/80 border border-brand-primary/20 rounded-xl p-1.5">
            <button
              onClick={() => setActiveTab('hosts')}
              className={`relative px-6 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                activeTab === 'hosts' ? 'text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {activeTab === 'hosts' && (
                <motion.div
                  layoutId="audienceTab"
                  className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-lg"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                <Home className="w-4 h-4" />
                Hosts
              </span>
            </button>
            <button
              onClick={() => setActiveTab('professionals')}
              className={`relative px-6 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                activeTab === 'professionals' ? 'text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {activeTab === 'professionals' && (
                <motion.div
                  layoutId="audienceTab"
                  className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-lg"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                <Building className="w-4 h-4" />
                Professionals
              </span>
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="glass-card p-8 lg:p-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-brand-primary/20 rounded-2xl flex items-center justify-center">
                  <data.icon className="w-7 h-7 text-brand-accent" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white font-heading">{data.title}</h3>
                  <p className="text-slate-400">{data.subtitle}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {data.features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-brand-dark/30 rounded-xl p-6"
                  >
                    <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-5 h-5 text-brand-accent" />
                    </div>
                    <h4 className="text-white font-semibold mb-2 font-heading">{feature.title}</h4>
                    <p className="text-slate-400 text-sm">{feature.description}</p>
                  </motion.div>
                ))}
              </div>

              <div className="border-t border-brand-primary/10 pt-6">
                <p className="text-sm text-slate-400 mb-4">Included features:</p>
                <div className="flex flex-wrap gap-3">
                  {data.benefits.map((benefit) => (
                    <span
                      key={benefit}
                      className="inline-flex items-center gap-2 bg-brand-dark/50 px-4 py-2 rounded-full text-sm text-slate-300"
                    >
                      <Check className="w-4 h-4 text-brand-accent" />
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
