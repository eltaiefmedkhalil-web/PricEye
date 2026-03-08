export interface BlogHeading {
  id: string;
  text: string;
  level: number;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: number;
  category: string;
  image: string;
  imageAlt: string;
  author: string;
  headings: BlogHeading[];
  content: string;
  relatedSlugs: string[];
}
