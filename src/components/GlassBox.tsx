import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowUp, Music, MapPin, Users, Info } from 'lucide-react';

export default function GlassBox() {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-[128px] -translate-y-1/2 opacity-50" />

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 font-heading">
            Smart insights to make the <span className="text-gradient-brand">right decisions</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Unlike competitors who hide their logic, we provide complete transparency. Every price change comes with a clear explanation.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="glass-card p-6 border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                  <EyeOff className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Black Box</h3>
                  <p className="text-sm text-slate-400">The competition</p>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  "Trust our algorithm" with no explanation
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  No insight into why prices change
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  Can't learn or improve your strategy
                </li>
              </ul>
            </div>

            <div className="glass-card p-6 border-brand-accent/30 bg-gradient-to-br from-brand-primary/10 to-transparent">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-brand-primary/20 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-brand-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white font-heading">Glass Box</h3>
                  <p className="text-sm text-gradient-brand font-medium">PricEye</p>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-accent rounded-full" />
                  Detailed logs for every price change
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-accent rounded-full" />
                  Understand the "why" behind each decision
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-accent rounded-full" />
                  Learn market patterns and optimize
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="glass-card p-6 max-w-md mx-auto">
              <div className="flex gap-4 mb-4">
                <img
                  src="https://images.pexels.com/photos/1268871/pexels-photo-1268871.jpeg?auto=compress&cs=tinysrgb&w=200"
                  alt="Villa Sunset"
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h4 className="text-white font-semibold mb-1">Villa Sunset</h4>
                  <div className="flex items-center gap-1 text-slate-400 text-sm mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    Nice, France
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 text-sm">
                    <Users className="w-3.5 h-3.5" />
                    8 guests
                  </div>
                </div>
              </div>

              <div className="bg-brand-dark/50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Tonight's Price</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 line-through text-sm">EUR120</span>
                    <span className="text-2xl font-bold text-white">EUR145</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-brand-accent text-sm">
                  <ArrowUp className="w-4 h-4" />
                  +20.8% increase
                </div>
              </div>

              <div className="relative">
                <div className="absolute -top-3 left-4 bg-gradient-to-r from-brand-primary to-brand-accent px-2 py-0.5 rounded text-xs font-medium text-white">
                  Why this price?
                </div>
                <div className="bg-brand-primary/10 border border-brand-accent/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-brand-primary/20 rounded-lg flex items-center justify-center shrink-0">
                      <Music className="w-4 h-4 text-brand-accent" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium mb-1">
                        Taylor Swift Concert
                      </p>
                      <p className="text-slate-400 text-xs">
                        Major event detected 5km away on July 15th. Historical data shows +35% demand surge for similar events.
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-slate-500">
                    <Info className="w-3.5 h-3.5" />
                    <span>Price updated 2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 lg:-bottom-8 lg:-right-8 glass-card p-3 hidden sm:block">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-accent/20 rounded-lg flex items-center justify-center">
                  <Eye className="w-4 h-4 text-brand-accent" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Transparency Score</p>
                  <p className="text-sm font-semibold text-white">100%</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
