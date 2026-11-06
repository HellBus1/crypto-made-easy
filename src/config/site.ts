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
  name: 'Astro Starter',
  title: 'Astro Starter — Production-Ready Astro + TypeScript Template',
  description:
    'A high-performance, accessible, and easily extensible Astro starter template designed for modern web applications, portfolios, blogs, and documentation.',
  url: process.env.SITE_URL || 'https://astro-starter.example.com',
  defaultLocale: 'en',
  defaultOgImage: '/images/og-default.svg',
  author: {
    name: 'Syubban Fakhriya',
    url: 'https://github.com/syubbanfakhriya',
  },
  socials: {
    github: 'https://github.com/syubbanfakhriya/ts-astro-starter',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
  },
};
