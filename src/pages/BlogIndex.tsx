import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';
import { allPosts } from '../content/blog';

export default function BlogIndex() {
  const featured = allPosts[0];
  const rest = allPosts.slice(1);

  return (
    <div className="min-h-screen bg-midnight-900 text-white">
      <SEO
        title="Blog - Dynamic Pricing & Airbnb Revenue Insights"
        description="Expert articles on AI dynamic pricing, Airbnb revenue management, and short-term rental strategies from the PricEye team."
        canonical="/blog"
      />

      <header className="pt-24 lg:pt-32 pb-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/8 via-brand-secondary/5 to-transparent" />
        <div className="section-container relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to PricEye
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-bold font-heading mb-4"
          >
            The PricEye <span className="text-gradient-brand">Blog</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-400 max-w-2xl"
          >
            Insights on dynamic pricing, Airbnb revenue management, and growing your short-term rental business.
          </motion.p>
        </div>
      </header>

      <main className="section-container pb-20">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <Link to={`/blog/${featured.slug}`} className="group grid lg:grid-cols-2 gap-8 items-center">
            <div className="relative overflow-hidden rounded-2xl aspect-[16/10]">
              <img
                src={featured.image}
                alt={featured.imageAlt}
                loading="eager"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight-900/60 to-transparent" />
              <span className="absolute top-4 left-4 bg-brand-primary/90 text-white text-xs font-medium px-3 py-1 rounded-full">
                {featured.category}
              </span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <time dateTime={featured.date}>
                  {new Date(featured.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {featured.readingTime} min read
                </span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold font-heading text-white group-hover:text-brand-accent transition-colors">
                {featured.title}
              </h2>
              <p className="text-slate-400 leading-relaxed">{featured.description}</p>
              <span className="inline-flex items-center gap-2 text-brand-accent font-medium text-sm group-hover:gap-3 transition-all">
                Read article <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        </motion.article>

        <div className="grid md:grid-cols-2 gap-8">
          {rest.map((post, i) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <Link to={`/blog/${post.slug}`} className="group block">
                <div className="relative overflow-hidden rounded-xl aspect-[16/10] mb-4">
                  <img
                    src={post.image}
                    alt={post.imageAlt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight-900/60 to-transparent" />
                  <span className="absolute top-3 left-3 bg-brand-primary/90 text-white text-xs font-medium px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-2">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readingTime} min
                  </span>
                </div>
                <h2 className="text-lg font-bold font-heading text-white mb-2 group-hover:text-brand-accent transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">{post.description}</p>
              </Link>
            </motion.article>
          ))}
        </div>
      </main>
    </div>
  );
}
