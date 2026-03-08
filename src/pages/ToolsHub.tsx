import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calculator, FileText, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SITE_URL = 'https://priceye-ai.com';

const toolsHubJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': `${SITE_URL}/tools`,
      url: `${SITE_URL}/tools`,
      name: 'Free Airbnb Host Tools - Revenue Calculator, House Rules Generator & Cleaning Fee Optimizer',
      description: 'Free interactive tools for Airbnb hosts and property managers. Calculate your revenue lift, generate professional house rules, and optimize cleaning fees.',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      breadcrumb: { '@id': `${SITE_URL}/tools/#breadcrumb` },
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${SITE_URL}/tools/#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Free Tools', item: `${SITE_URL}/tools` },
      ],
    },
    {
      '@type': 'ItemList',
      name: 'PricEye Free Tools for Airbnb Hosts',
      numberOfItems: 3,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Airbnb Revenue Lift Calculator',
          url: `${SITE_URL}/tools/revenue-calculator`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'AI House Rules Generator',
          url: `${SITE_URL}/tools/house-rules`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Cleaning Fee Optimizer',
          url: `${SITE_URL}/tools/cleaning-fee`,
        },
      ],
    },
  ],
};

const tools = [
  {
    icon: Calculator,
    title: 'Revenue Lift Calculator',
    description: 'See exactly how much more revenue you could earn with AI-powered dynamic pricing. Enter your current numbers and visualize the difference.',
    href: '/tools/revenue-calculator',
    badge: 'Most Popular',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    borderGradient: 'border-emerald-500/30',
    iconColor: 'text-emerald-400',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  },
  {
    icon: FileText,
    title: 'AI House Rules Generator',
    description: 'Generate professional, guest-ready house rules tailored to your property type. Covers amenities, quiet hours, and more.',
    href: '/tools/house-rules',
    badge: 'SEO Magnet',
    gradient: 'from-sky-500/20 to-cyan-500/20',
    borderGradient: 'border-sky-500/30',
    iconColor: 'text-sky-400',
    badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
  },
  {
    icon: Sparkles,
    title: 'Cleaning Fee Optimizer',
    description: 'Compare your cleaning fees against industry benchmarks. Find out if you are overcharging or leaving money on the table.',
    href: '/tools/cleaning-fee',
    badge: 'New',
    gradient: 'from-amber-500/20 to-orange-500/20',
    borderGradient: 'border-amber-500/30',
    iconColor: 'text-amber-400',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export default function ToolsHub() {
  return (
    <div className="min-h-screen bg-midnight-900 text-white">
      <SEO
        title="Free Airbnb Host Tools | Revenue Calculator, House Rules & Cleaning Fees"
        description="Free interactive tools for Airbnb hosts and property managers. Calculate your revenue lift with dynamic pricing, generate professional house rules, and optimize cleaning fees."
        canonical="/tools"
        keywords="airbnb tools, airbnb revenue calculator, house rules generator, cleaning fee optimizer, vacation rental tools, airbnb host tools, short-term rental calculator, property management tools, dynamic pricing tools"
        jsonLd={toolsHubJsonLd}
      />
      <Navbar />

      <header className="pt-24 lg:pt-32 pb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/8 via-brand-secondary/5 to-transparent" />
        <div className="section-container relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to PricEye
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs font-medium tracking-wide uppercase mb-4">
              Free Tools
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold font-heading mb-4">
              Optimize Your Rentals with{' '}
              <span className="text-gradient-brand">Free Tools</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed">
              Powerful, no-signup calculators and generators built for Airbnb hosts,
              vacation rental managers, and hotel operators. Make smarter decisions in seconds.
            </p>
          </motion.div>
        </div>
      </header>

      <main className="section-container pb-24">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-3 gap-6"
        >
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <motion.div key={tool.href} variants={item}>
                <Link
                  to={tool.href}
                  className="group block h-full glass-card p-8 transition-all duration-300 hover:scale-[1.02] hover:border-brand-accent/40 hover:shadow-[0_0_40px_rgba(0,211,242,0.1)]"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.gradient} border ${tool.borderGradient} flex items-center justify-center`}>
                      <Icon className={`w-7 h-7 ${tool.iconColor}`} />
                    </div>
                    <span className={`text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full border ${tool.badgeColor}`}>
                      {tool.badge}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold font-heading text-white mb-3 group-hover:text-brand-accent transition-colors">
                    {tool.title}
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {tool.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm font-medium text-brand-accent">
                    Launch Tool
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 glass-card p-8 lg:p-12 text-center"
        >
          <h2 className="text-2xl font-bold font-heading mb-3">
            Ready to automate your pricing?
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-6">
            These tools give you a snapshot. PricEye AI gives you 24/7 dynamic pricing
            that adapts to over 100 market factors in real time.
          </p>
          <Link to="/signup" className="btn-primary inline-flex">
            Start Free Trial
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
