/**
 * Site Configuration
 * Centralized settings for metadata, author, default SEO images, and social profiles.
 */

export interface AuthorConfig {
  name: string;
  url?: string;
  email?: string;
  avatar?: string;
}

export interface SocialLinks {
  github?: string;
  twitter?: string;
  linkedin?: string;
  discord?: string;
  youtube?: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  defaultLocale: string;
  defaultOgImage: string;
  author: AuthorConfig;
  socials: SocialLinks;
}

export const siteConfig: SiteConfig = {
  name: 'Crypto Made Easy',
  title: 'Crypto Made Easy: Interactive Spot Chart Course & 3-Light Signal Checklist',
  description:
    'Learn how to read crypto spot charts with interactive diagrams and check any coin using a calm, rule-based 3-Light checklist and 3-tier position-sizing ladder.',
  url: process.env.SITE_URL || 'https://crypto-made-easy.pages.dev',
  defaultLocale: 'en',
  defaultOgImage: '/images/og-default.svg',
  author: {
    name: 'Syubban Fakhriya',
    url: 'https://github.com/syubbanfakhriya',
  },
  socials: {
    github: 'https://github.com/syubbanfakhriya/crypto-made-easy',
  },
};
