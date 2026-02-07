import { motion } from 'framer-motion';
import { Link, Settings, Sparkles, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Link,
    title: 'Connect',
    description: 'Import properties from any major PMS in 1 click. No technical setup required.',
    highlight: '1 click integration',
  },
  {
    number: '02',
    icon: Settings,
    title: 'Setup',
    description: 'Define your minimum and maximum prices. Set any custom rules you need. The AI respects your boundaries.',
    highlight: '2 minutes setup',
  },
  {
    number: '03',
    icon: Sparkles,
    title: 'Profit',
    description: 'Let the AI optimize your prices 24/7. Watch your revenue grow while you focus on what matters.',
    highlight: 'Instant results',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export default function Timeline() {
  return (
    <section className="py-20 lg:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-dark/50 to-transparent" />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-accent/30 rounded-full px-4 py-2 mb-6">
            <span className="text-sm text-slate-300">Quick Setup</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 font-heading">
            Get started in <span className="text-gradient-brand">5 minutes</span> flat
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            No complex onboarding. No technical knowledge required. Just connect, configure, and let the AI do the rest.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 relative"
        >
          <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-brand-primary/50 via-brand-accent to-brand-primary/50" />

          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              className="relative"
            >
              <div className="glass-card glass-card-hover p-8 text-center h-full">
                <div className="relative inline-flex mb-6">
                  <div className="w-16 h-16 bg-brand-primary/20 rounded-2xl flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-brand-accent" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-brand-primary to-brand-accent rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-white mb-3 font-heading">{step.title}</h3>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                  {step.description}
                </p>
                <span className="inline-flex items-center gap-1 text-brand-accent text-sm font-medium">
                  {step.highlight}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute top-24 -right-4 w-8 h-8 bg-brand-darkest rounded-full items-center justify-center z-10">
                  <ArrowRight className="w-4 h-4 text-brand-accent" />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <button className="btn-primary">
            Start Your Free Trial
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
