import { useEffect, useState, useRef } from 'react';
import { motion, useInView, useMotionValue, useTransform } from 'framer-motion';
import { Brain, Cloud, Calendar, Plane, Building2, Zap, Shield, Clock, TrendingUp, BarChart3, Globe } from 'lucide-react';

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function FeatureCard({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const background = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, rgba(21, 93, 252, 0.08), transparent 40%)`
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      onMouseMove={handleMouseMove}
      className={`group relative rounded-2xl border border-brand-primary/10 bg-gradient-to-b from-brand-dark/40 to-transparent overflow-hidden ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background }}
      />
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 border border-brand-accent/20" />
      {children}
    </motion.div>
  );
}

export default function FeatureGrid() {
  const factors = [
    { icon: Cloud, label: 'Weather', color: 'from-brand-secondary to-brand-accent' },
    { icon: Calendar, label: 'Events', color: 'from-amber-400 to-orange-500' },
    { icon: Plane, label: 'Flights', color: 'from-emerald-400 to-teal-500' },
    { icon: Building2, label: 'Competitors', color: 'from-rose-400 to-pink-500' },
    { icon: Globe, label: 'Seasonality', color: 'from-brand-primary to-brand-secondary' },
    { icon: BarChart3, label: 'Demand', color: 'from-brand-accent to-brand-primary' },
  ];

  return (
    <section id="features" className="py-24 lg:py-36 relative">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-primary/[0.03] rounded-full blur-3xl" />
      </div>

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block text-brand-accent text-sm font-medium tracking-wider uppercase mb-4"
          >
            Features
          </motion.span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight font-heading">
            Powerful features,{' '}
            <span className="text-gradient-brand">
              transparent results
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Everything you need to optimize pricing and maximize revenue, with complete transparency.
          </p>
        </motion.div>

        <div className="space-y-4 lg:space-y-6">
          <FeatureCard className="w-full" delay={0}>
            <div className="p-8 lg:p-10 flex flex-col md:flex-row items-center gap-8 lg:gap-12">
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary to-brand-accent rounded-full blur-2xl opacity-30 scale-150" />
                <div className="relative text-7xl lg:text-8xl font-bold text-gradient-brand">
                  +<AnimatedCounter value={20} suffix="%" />
                </div>
              </div>
              <div className="text-center md:text-left flex-1">
                <h3 className="text-2xl lg:text-3xl font-semibold text-white mb-3 font-heading">Average Revenue Boost</h3>
                <p className="text-slate-400 mb-5 max-w-lg">
                  Our AI-powered pricing consistently outperforms manual strategies, delivering measurable results for property managers worldwide.
                </p>
                {/* Bloc supprimé ici */}
              </div>
            </div>
          </FeatureCard>

          <FeatureCard className="w-full" delay={0.1}>
            <div className="p-8 lg:p-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-primary/20 to-brand-accent/5 flex items-center justify-center border border-brand-primary/20">
                  <Brain className="w-7 h-7 text-brand-accent" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-white font-heading">100+ Factors Analyzed</h3>
                  <p className="text-slate-400">Real-time data processing for optimal pricing</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {factors.map(({ icon: Icon, label, color }, index) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="relative group/factor cursor-default"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover/factor:opacity-100 transition-opacity duration-300 rounded-xl blur-xl" />
                    <div className="relative flex flex-col items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] group-hover/factor:border-white/[0.12] transition-colors">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm text-slate-300 font-medium">{label}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </FeatureCard>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            <FeatureCard delay={0.2}>
              <div className="p-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-secondary/20 to-brand-accent/10 flex items-center justify-center mb-5 border border-brand-secondary/20">
                  <Zap className="w-6 h-6 text-brand-accent" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 font-heading">Instant Sync</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  Prices update automatically across all your connected platforms in real-time.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Airbnb', 'Booking.com', 'VRBO', '+20'].map((platform) => (
                    <span key={platform} className="px-3 py-1 rounded-full bg-brand-primary/5 border border-brand-primary/15 text-xs text-slate-400">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            </FeatureCard>

            <FeatureCard delay={0.3}>
              <div className="p-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary/20 to-brand-secondary/10 flex items-center justify-center mb-5 border border-brand-primary/20">
                  <Shield className="w-6 h-6 text-brand-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 font-heading">Full Control</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  Set your minimum and maximum prices. The AI respects your boundaries, always.
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '70%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-brand-primary to-brand-accent rounded-full"
                    />
                  </div>
                  <span className="text-xs text-slate-500">Your rules</span>
                </div>
              </div>
            </FeatureCard>

            <FeatureCard className="sm:col-span-2 lg:col-span-1" delay={0.4}>
              <div className="p-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-accent/20 to-brand-secondary/10 flex items-center justify-center mb-5 border border-brand-accent/20">
                  <Clock className="w-6 h-6 text-brand-accent" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 font-heading">24/7 Optimization</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  While you sleep, PricEye continuously monitors and adjusts for maximum revenue.
                </p>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-accent" />
                  </span>
                  <span className="text-xs text-brand-accent font-medium">Always monitoring</span>
                </div>
              </div>
            </FeatureCard>
          </div>
        </div>
      </div>
    </section>
  );
}
