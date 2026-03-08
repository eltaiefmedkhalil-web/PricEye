import { useParams, Link, Navigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import { getPostBySlug, getRelatedPosts } from '../content/blog';

function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const el = document.getElementById('article-body');
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.scrollHeight;
      const scrolled = Math.max(0, -rect.top);
      setProgress(Math.min(100, (scrolled / (total - window.innerHeight)) * 100));
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-brand-primary to-brand-accent transition-[width] duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function TableOfContents({ headings, activeId }: { headings: { id: string; text: string; level: number }[]; activeId: string }) {
  return (
    <nav aria-label="Table of contents" className="sticky top-24">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">On this page</p>
      <ul className="space-y-2 border-l border-white/10">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`block text-sm transition-colors duration-200 border-l-2 -ml-px ${
                h.level === 3 ? 'pl-6' : 'pl-4'
              } ${
                activeId === h.id
                  ? 'border-brand-accent text-brand-accent'
                  : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-600'
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;
  const [activeId, setActiveId] = useState('');
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!post) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );

    post.headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [post]);

  if (!post) return <Navigate to="/blog" replace />;

  const related = getRelatedPosts(post);

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.image,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Organization',
      name: 'PricEye',
      url: 'https://priceye-ai.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'PricEye',
      logo: {
        '@type': 'ImageObject',
        url: 'https://priceye-ai.com/priceye_640_x_640.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://priceye-ai.com/blog/${post.slug}`,
    },
  };

  return (
    <div className="min-h-screen bg-midnight-900 text-white">
      <ReadingProgress />
      <SEO
        title={post.title}
        description={post.description}
        canonical={`/blog/${post.slug}`}
        type="article"
        image={post.image}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(blogPostingSchema)}</script>
      </Helmet>

      <header className="pt-24 lg:pt-32 pb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/8 via-brand-secondary/5 to-transparent" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            All articles
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block bg-brand-primary/20 text-brand-accent text-xs font-medium px-3 py-1 rounded-full mb-4">
              {post.category}
            </span>
            <h1 className="text-3xl lg:text-4xl xl:text-[2.75rem] font-bold font-heading leading-tight mb-6">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span>{post.author}</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.readingTime} min read
              </span>
            </div>
          </motion.div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden rounded-2xl aspect-[2/1]"
        >
          <img
            src={post.image}
            alt={post.imageAlt}
            loading="eager"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-[1fr_240px] gap-12">
          <motion.article
            id="article-body"
            ref={articleRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="prose-blog max-w-3xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <aside className="hidden lg:block">
            <TableOfContents headings={post.headings} activeId={activeId} />
          </aside>
        </div>
      </div>

      <section className="bg-gradient-to-b from-brand-primary/10 to-transparent py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold font-heading mb-4">
            Ready to maximize your rental revenue?
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Join hosts who earn 20% more with PricEye AI's transparent dynamic pricing. Start your 30-day free trial -- no credit card required.
          </p>
          <Link to="/signup" className="btn-primary inline-flex items-center gap-2">
            Start Your Free Trial
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-container py-16">
          <h2 className="text-2xl font-bold font-heading mb-8">Related Articles</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {related.map((r) => (
              <Link key={r.slug} to={`/blog/${r.slug}`} className="group block">
                <div className="relative overflow-hidden rounded-xl aspect-[16/10] mb-4">
                  <img
                    src={r.image}
                    alt={r.imageAlt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight-900/60 to-transparent" />
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                  <time dateTime={r.date}>
                    {new Date(r.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {r.readingTime} min
                  </span>
                </div>
                <h3 className="text-lg font-bold font-heading text-white group-hover:text-brand-accent transition-colors leading-snug">
                  {r.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
