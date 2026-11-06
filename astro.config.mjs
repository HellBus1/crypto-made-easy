// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || 'https://crypto-made-easy.pages.dev',
  output: 'static',
  integrations: [
    react(),
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
});
