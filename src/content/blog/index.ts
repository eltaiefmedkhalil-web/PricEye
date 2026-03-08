import type { BlogPost } from '../../types/blog';
import post1 from './static-pricing-costing-revenue';
import post2 from './priceye-ai-100-market-factors';
import post3 from './optimize-airbnb-listing-visibility';
import post4 from './future-short-term-rentals-trends';
import post5 from './scale-rental-business-1-to-10';

export const allPosts: BlogPost[] = [post1, post2, post3, post4, post5];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return allPosts.find((p) => p.slug === slug);
}

export function getRelatedPosts(post: BlogPost): BlogPost[] {
  return post.relatedSlugs
    .map((s) => allPosts.find((p) => p.slug === s))
    .filter((p): p is BlogPost => p !== undefined);
}
