import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://priceye-ai.com';

const websiteSchema = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: 'PricEye',
  alternateName: ['PricEye AI', 'Priceye-ai'],
  description: 'AI-powered dynamic pricing software for short-term rentals and Airbnb revenue management.',
  publisher: { '@id': `${SITE_URL}/#organization` },
};

const organizationSchema = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'PricEye',
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/p_priceeye_vecto_(1).png`,
  },
  sameAs: [
    'https://www.linkedin.com/company/priceyeai',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    availableLanguage: ['English', 'French'],
  },
};

const softwareSchema = {
  '@type': 'SoftwareApplication',
  '@id': `${SITE_URL}/#software`,
  name: 'PricEye',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: SITE_URL,
  description:
    'PricEye AI is a transparent dynamic pricing tool for Airbnb hosts and short-term rental property managers. Analyze 100+ factors to maximize revenue.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    description: '30-day free trial, no credit card required',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '150',
    bestRating: '5',
  },
  featureList:
    'Dynamic Pricing, Revenue Management, AI-Powered, Transparent Algorithm, Multi-Platform Sync, Airbnb Integration',
};

const faqItems = [
  {
    question: 'What is PricEye AI?',
    answer:
      'PricEye AI is a transparent dynamic pricing tool designed for short-term rental hosts and property managers. It uses artificial intelligence to analyze over 100 market factors and automatically optimize your nightly rates on platforms like Airbnb and Vrbo.',
  },
  {
    question: 'How does PricEye dynamic pricing work?',
    answer:
      'PricEye analyzes real-time data including local events, weather, competitor pricing, flight demand, seasonality, and more. Unlike black-box competitors, PricEye provides full transparency: every price change comes with a detailed explanation of why it was made.',
  },
  {
    question: 'How much revenue increase can I expect with PricEye?',
    answer:
      'On average, PricEye users see a +20% revenue increase. Results vary depending on your market and property type, but our AI continuously learns and adapts to maximize your occupancy and nightly rate.',
  },
  {
    question: 'Is there a free trial available?',
    answer:
      'Yes. PricEye offers a 30-day free trial with no credit card required. You can connect your properties, set your pricing rules, and start optimizing immediately.',
  },
  {
    question: 'Which platforms does PricEye integrate with?',
    answer:
      'PricEye integrates with all major Property Management Systems (PMS) and booking platforms including Airbnb, Vrbo, Booking.com, and many more. Setup takes just a few clicks.',
  },
  {
    question: 'What makes PricEye different from other Airbnb revenue management tools?',
    answer:
      'PricEye is a "Glass Box" - unlike competitors who hide their algorithm logic, PricEye shows you exactly why each price recommendation was made. You get detailed logs, factor breakdowns, and full control over min/max boundaries.',
  },
];

const faqSchema = {
  '@type': 'FAQPage',
  '@id': `${SITE_URL}/#faq`,
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

export const faqData = faqItems;

export default function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [websiteSchema, organizationSchema, softwareSchema, faqSchema],
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
