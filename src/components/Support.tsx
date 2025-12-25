import { motion } from 'framer-motion';
import { MessageCircle, Clock, Users, Headphones, Check } from 'lucide-react';

export default function Support() {
  const supportFeatures = [
    { icon: Clock, title: 'Fast Response', description: 'Average reply time under 2 hours' },
    { icon: Users, title: 'Real Humans', description: 'No bots, just people who care' },
    { icon: Headphones, title: 'Multi-Channel', description: 'Chat, email, or video calls' },
  ];

  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-[128px] -translate-y-1/2 opacity-40" />

      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-brand-accent/10 border border-brand-accent/30 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-brand-accent rounded-full animate-pulse" />
              <span className="text-sm text-brand-accent">Online now</span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 font-heading">
              Support that <span className="text-gradient-brand">actually responds</span>
            </h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              No generic robots. A dedicated team that makes high-quality support a pillar of our brand.
              We're here when you need us, with real answers from real people.
            </p>

            <div className="space-y-4 mb-8">
              {supportFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-center gap-4 bg-brand-dark/50 border border-brand-primary/10 rounded-xl p-4"
                >
                  <div className="w-10 h-10 bg-brand-primary/20 rounded-lg flex items-center justify-center shrink-0">
                    <feature.icon className="w-5 h-5 text-brand-accent" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium font-heading">{feature.title}</h4>
                    <p className="text-sm text-slate-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-brand-accent" />
                Free onboarding call
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-brand-accent" />
                24/7 documentation
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-brand-primary/10">
                <div className="relative">
                  <img
                    src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"
                    alt="Support agent"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-brand-accent rounded-full border-2 border-brand-dark" />
                </div>
                <div>
                  <p className="text-white font-medium">Sarah from PricEye</p>
                  <p className="text-sm text-slate-400">Customer Success</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-end">
                  <div className="bg-brand-primary/20 border border-brand-accent/30 rounded-2xl rounded-tr-md px-4 py-3 max-w-xs">
                    <p className="text-sm text-white">
                      Hi! I'm having trouble connecting my Airbnb account. Can you help?
                    </p>
                    <span className="text-xs text-slate-500 mt-1 block">10:24 AM</span>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="bg-brand-dark/50 rounded-2xl rounded-tl-md px-4 py-3 max-w-xs">
                    <p className="text-sm text-white">
                      Of course! Let me guide you through it. First, go to Settings {'>'} Integrations and click "Connect Airbnb".
                    </p>
                    <span className="text-xs text-slate-500 mt-1 block">10:25 AM</span>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="bg-brand-dark/50 rounded-2xl rounded-tl-md px-4 py-3 max-w-xs">
                    <p className="text-sm text-white">
                      You'll be redirected to Airbnb to authorize. Once done, your properties will sync automatically within 2 minutes.
                    </p>
                    <span className="text-xs text-slate-500 mt-1 block">10:25 AM</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="bg-brand-primary/20 border border-brand-accent/30 rounded-2xl rounded-tr-md px-4 py-3 max-w-xs">
                    <p className="text-sm text-white">
                      That worked perfectly! Thank you so much for the quick help!
                    </p>
                    <span className="text-xs text-slate-500 mt-1 block">10:28 AM</span>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="bg-brand-dark/50 rounded-2xl rounded-tl-md px-4 py-3 max-w-xs">
                    <p className="text-sm text-white">
                      You're welcome! Feel free to reach out anytime. Happy hosting!
                    </p>
                    <span className="text-xs text-slate-500 mt-1 block">10:28 AM</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-brand-primary/10">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 bg-brand-dark/50 border border-brand-primary/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-accent/50"
                  />
                  <button className="w-10 h-10 bg-gradient-to-r from-brand-primary to-brand-accent rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -left-4 glass-card p-3 hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-accent/20 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-brand-accent" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Avg. Response</p>
                <p className="text-sm font-semibold text-white">&lt; 2 hours</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
