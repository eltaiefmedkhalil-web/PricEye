import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';
import { allPosts } from '../content/blog';

export default function BlogIndex() {
  const featured = allPosts[0];
  const rest = allPosts.slice(1);

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'PricEye Blog - Dynamic Pricing & Airbnb Revenue Insights',
    description: 'Expert insights on AI-powered dynamic pricing, Airbnb revenue optimization, short-term rental strategies, and property management growth from PricEye.',
    url: 'https://priceye-ai.com/blog',
    publisher: {
      '@type': 'Organization',
      name: 'PricEye',
      logo: {
        '@type': 'ImageObject',
        url: 'https://priceye-ai.com/priceye_640_x_640.png',
      },
    },
    blogPost: allPosts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `https://priceye-ai.com/blog/${post.slug}`,
      datePublished: post.date,
      image: post.image,
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://priceye-ai.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://priceye-ai.com/blog',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-midnight-900 text-white">
      <SEO
        title="Airbnb Dynamic Pricing Blog | Revenue Optimization Tips & Strategies | PricEye"
        description="Master Airbnb revenue management with expert guides on AI dynamic pricing, listing optimization, rental business scaling, and industry trends. Free insights from PricEye AI."
        canonical="/blog"
      />
      <Helmet>
        <meta name="keywords" content="airbnb dynamic pricing, short-term rental pricing, vacation rental revenue management, airbnb optimization, rental pricing strategy, property manager tools, airbnb revenue, dynamic pricing AI, rental business growth, airbnb listing optimization" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Airbnb Dynamic Pricing Blog | Revenue Optimization Tips | PricEye" />
        <meta property="og:description" content="Expert articles on AI dynamic pricing, Airbnb revenue optimization, and scaling your short-term rental business. Free insights from PricEye." />
        <meta property="og:url" content="https://priceye-ai.com/blog" />
        <meta property="og:image" content="https://priceye-ai.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Airbnb Dynamic Pricing Blog | Revenue Optimization Tips | PricEye" />
        <meta name="twitter:description" content="Expert articles on AI dynamic pricing, Airbnb revenue optimization, and scaling your short-term rental business." />
        <meta name="twitter:image" content="https://priceye-ai.com/og-image.png" />
        <link rel="alternate" type="application/rss+xml" title="PricEye Blog RSS Feed" href="https://priceye-ai.com/blog/rss.xml" />
        <script type="application/ld+json">{JSON.stringify(blogSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

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
