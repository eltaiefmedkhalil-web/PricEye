import { Link } from 'react-router-dom';
import { Calculator, FileText, Sparkles, ArrowRight } from 'lucide-react';

const allTools = [
  {
    slug: 'revenue-calculator',
    href: '/tools/revenue-calculator',
    icon: Calculator,
    title: 'Revenue Lift Calculator',
    description: 'See how much more you could earn with AI dynamic pricing.',
    color: 'text-emerald-400',
    bg: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/30',
  },
  {
    slug: 'house-rules',
    href: '/tools/house-rules',
    icon: FileText,
    title: 'AI House Rules Generator',
    description: 'Generate professional house rules for your property.',
    color: 'text-sky-400',
    bg: 'from-sky-500/20 to-cyan-500/20',
    border: 'border-sky-500/30',
  },
  {
    slug: 'cleaning-fee',
    href: '/tools/cleaning-fee',
    icon: Sparkles,
    title: 'Cleaning Fee Optimizer',
    description: 'Compare your cleaning fee against market benchmarks.',
    color: 'text-amber-400',
    bg: 'from-amber-500/20 to-orange-500/20',
    border: 'border-amber-500/30',
  },
];

interface RelatedToolsProps {
  currentSlug: string;
}

export default function RelatedTools({ currentSlug }: RelatedToolsProps) {
  const related = allTools.filter((t) => t.slug !== currentSlug);

  return (
    <section className="section-container pb-20">
      <h2 className="text-xl font-bold font-heading text-white mb-6">
        Explore More Free Tools
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {related.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.slug}
              to={tool.href}
              className="group glass-card p-6 flex items-start gap-4 transition-all duration-300 hover:border-brand-accent/40"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.bg} border ${tool.border} flex items-center justify-center shrink-0`}>
                <Icon className={`w-6 h-6 ${tool.color}`} />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-white group-hover:text-brand-accent transition-colors text-sm mb-1">
                  {tool.title}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed">{tool.description}</p>
                <span className="inline-flex items-center gap-1 text-xs text-brand-accent mt-2 font-medium">
                  Try it free <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
