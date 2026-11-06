# Astro + TypeScript Starter Template

A production-ready, accessible, and high-performance starter template built with [Astro](https://astro.build) and [TypeScript](https://www.typescriptlang.org). Designed to serve as a clean, unopinionated foundation for SaaS applications, marketing landing pages, company profiles, developer portfolios, blogs, and documentation hubs.

[![CI Pipeline](https://github.com/syubbanfakhriya/ts-astro-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/syubbanfakhriya/ts-astro-starter/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Astro Version](https://img.shields.io/badge/Astro-v5%2B-FF5D01.svg?logo=astro)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6.svg?logo=typescript)](https://www.typescriptlang.org)

---

## Table of Contents

- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Available Scripts](#available-scripts)
- [Project Architecture](#project-architecture)
- [Git Branching & Release Strategy](#git-branching--release-strategy)
- [Customization Guide](#customization-guide)
  - [1. Site Metadata & Branding](#1-site-metadata--branding)
  - [2. Header & Footer Navigation](#2-header--footer-navigation)
  - [3. Design Tokens & Theming](#3-design-tokens--theming)
  - [4. Creating New Pages](#4-creating-new-pages)
  - [5. Adding Reusable Components](#5-adding-reusable-components)
  - [6. Managing Content Collections](#6-managing-content-collections)
- [SEO & Accessibility](#seo--accessibility)
- [Testing & Quality Assurance](#testing--quality-assurance)
- [Production Build & Deployment](#production-build--deployment)
- [Template Adaptability Guide](#template-adaptability-guide)
- [License](#license)

---

## Key Features

- **Zero Client-Side JS by Default**: Delivers static HTML and CSS for lightning-fast First Contentful Paint (FCP) and near-perfect Lighthouse scores.
- **Strict Type Checking**: Strict TypeScript mode configured across all components, layout props, and configuration modules.
- **Pure CSS Custom Properties**: Centralized design tokens in `src/styles/tokens.css` with no heavy utility frameworks or preprocessors required.
- **Zero-FOUC Dark Mode**: Instant, flicker-free light and dark theming with system-preference detection and an accessible `<ThemeToggle />`.
- **Astro Content Layer**: Modern content management via `src/content.config.ts` with type-safe frontmatter validation using Zod.
- **Built-in SEO & Sitemaps**: Automated canonical URLs, Open Graph images, Twitter/X cards, dynamic `robots.txt.ts`, and sitemap generation via `@astrojs/sitemap`.
- **Accessible Landmarks**: WCAG AA color contrast, visible keyboard focus indicators (`:focus-visible`), and a functional `<SkipLink />`.
- **Comprehensive Testing Suite**: Unit testing powered by [Vitest](https://vitest.dev) and End-to-End browser validation with [Playwright](https://playwright.dev).

---

## Technology Stack

- **Framework**: [Astro](https://astro.build) (Static Site Generation `output: 'static'`)
- **Language**: [TypeScript](https://www.typescriptlang.org) with strict type checking
- **Styling**: Modern Vanilla CSS, CSS Custom Properties (Design Tokens), CSS Reset
- **SEO & Sitemaps**: `@astrojs/sitemap`
- **Linting & Formatting**: ESLint (modern Flat Config `eslint.config.js`), Prettier, `prettier-plugin-astro`
- **Unit Testing**: Vitest
- **E2E Testing**: Playwright
- **CI/CD**: GitHub Actions

---

## Prerequisites

- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **Package Manager**: `npm` (v9 or later)

---

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/syubbanfakhriya/ts-astro-starter.git my-app
cd my-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

```bash
cp .env.example .env
```

Edit `.env` to specify your canonical production URL:

```env
SITE_URL=https://my-app.example.com
```

### 4. Start local development server

```bash
npm run dev
```

Visit [http://localhost:4321](http://localhost:4321) in your browser.

---

## Available Scripts

| Script                 | Description                                                 |
| ---------------------- | ----------------------------------------------------------- |
| `npm run dev`          | Starts the Astro development server at `localhost:4321`     |
| `npm run build`        | Compiles the production-ready static site into `dist/`      |
| `npm run preview`      | Previews the production build locally                       |
| `npm run check`        | Runs Astro diagnostic type checking (`astro check`)         |
| `npm run lint`         | Lints JavaScript, TypeScript, and Astro files with ESLint   |
| `npm run lint:fix`     | Automatically fixes autofixable ESLint errors               |
| `npm run format`       | Formats the codebase using Prettier                         |
| `npm run format:check` | Verifies code formatting with Prettier                      |
| `npm run test`         | Runs unit tests once via Vitest                             |
| `npm run test:watch`   | Runs unit tests in watch mode                               |
| `npm run test:e2e`     | Runs Playwright end-to-end tests against the preview server |

---

## Project Architecture

```text
ts-astro-starter/
├── .github/
│   └── workflows/
│       └── ci.yml                 # CI pipeline (lint, check, test, build)
├── public/
│   ├── favicon.svg                # Scalable modern SVG favicon
│   └── images/
│       └── og-default.svg         # Default Open Graph social sharing image
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.astro       # Header, navigation, and mobile menu
│   │   │   ├── Footer.astro       # Multi-column footer and social links
│   │   │   ├── SEO.astro          # Open Graph, Twitter cards, meta tags
│   │   │   └── SkipLink.astro     # Keyboard skip-to-content navigation
│   │   ├── ui/
│   │   │   ├── Button.astro       # Typed polymorphic button and anchor
│   │   │   ├── Container.astro    # Consistent max-width container
│   │   │   ├── Section.astro      # Semantic section wrapper with surface styles
│   │   │   └── ThemeToggle.astro  # Accessible light/dark theme switch
│   │   └── sections/
│   │       ├── Hero.astro         # Modular hero section
│   │       ├── Features.astro     # Responsive features grid
│   │       └── CTA.astro          # Call-to-action banner
│   ├── config/
│   │   ├── site.ts                # Centralized site metadata & social links
│   │   └── navigation.ts          # Centralized header & footer links
│   ├── content/
│   │   └── blog/                  # Markdown / MDX blog articles
│   ├── layouts/
│   │   ├── BaseLayout.astro       # Master HTML document shell
│   │   └── ContentLayout.astro    # Layout for text-heavy prose & articles
│   ├── pages/
│   │   ├── index.astro            # Homepage showcase
│   │   ├── about.astro            # About page demonstrating ContentLayout
│   │   ├── blog/
│   │   │   ├── index.astro        # Blog article listing
│   │   │   └── [slug].astro       # Dynamic blog post route
│   │   ├── 404.astro              # Custom accessible 404 error page
│   │   └── robots.txt.ts          # Dynamic robots.txt route
│   ├── styles/
│   │   ├── tokens.css             # CSS custom properties (colors, typography, spacing)
│   │   ├── reset.css              # Modern CSS reset
│   │   └── global.css             # Global HTML element defaults and prose styles
│   ├── utils/
│   │   ├── seo.ts                 # Canonical URL and title helpers
│   │   └── date.ts                # Date formatting and ISO helpers
│   └── content.config.ts          # Astro Content Layer schema configuration
├── tests/
│   ├── unit/                      # Vitest unit test files
│   └── e2e/                       # Playwright browser end-to-end tests
├── .env.example                   # Documented environment variables
├── .gitignore                     # Git ignore rules
├── .prettierrc.json               # Prettier configuration
├── eslint.config.js               # Modern ESLint flat configuration
├── astro.config.mjs               # Astro configuration with sitemap
├── playwright.config.ts           # Playwright E2E configuration
├── vitest.config.ts               # Vitest configuration
├── tsconfig.json                  # Strict TypeScript configuration
└── LICENSE                        # MIT License
```

---

## Git Branching & Release Strategy

The repository follows a clean, three-tiered branching model designed for team stability:

```text
master ───────────────┬───────────────────────────────> (Production)
                      │
                      └──> staging ───────────┬───────> (Pre-production Integration)
                                              │
                                              └──> feat/init-project (Feature Branch)
```

1. **`master`**: The production branch. Represents tested, stable releases. Protected against direct pushes.
2. **`staging`**: The pre-production integration branch. Features are merged here via Pull Requests and verified before release.
3. **`feat/*` / `fix/*`**: Ephemeral feature and bug fix branches branched off `staging`.

---

## Customization Guide

### 1. Site Metadata & Branding

Modify `src/config/site.ts`:

```typescript
export const siteConfig = {
  name: 'Acme SaaS',
  title: 'Acme SaaS — Modern Cloud Analytics',
  description: 'Supercharge your engineering workflow with real-time analytics.',
  url: process.env.SITE_URL || 'https://acme.example.com',
  defaultLocale: 'en',
  defaultOgImage: '/images/og-default.svg',
  author: {
    name: 'Acme Corp',
    url: 'https://acme.example.com',
  },
  socials: {
    github: 'https://github.com/acme/saas',
    twitter: 'https://twitter.com/acme',
  },
};
```

### 2. Header & Footer Navigation

Update `src/config/navigation.ts` to add or modify navigation links:

```typescript
export const navigationConfig = {
  header: [
    { label: 'Home', href: '/' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
  ],
  footer: { ... },
};
```

### 3. Design Tokens & Theming

All brand colors, fonts, and spacing are controlled in `src/styles/tokens.css`:

```css
:root {
  /* Change brand primary color */
  --color-brand-primary: #4f46e5;
  --color-brand-primary-hover: #4338ca;

  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;

  /* Modular Spacing */
  --space-4: 1rem;
}

/* Customize dark mode palette */
:root[data-theme='dark'] {
  --color-bg-canvas: #090d16;
  --color-bg-surface: #0f172a;
}
```

### 4. Creating New Pages

Add an `.astro` file inside `src/pages/`:

```astro
---
// src/pages/pricing.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import Container from '../components/ui/Container.astro';
---

<BaseLayout title="Pricing" description="Simple, transparent pricing for teams.">
  <Container size="lg">
    <h1>Transparent Pricing</h1>
    <!-- Page content -->
  </Container>
</BaseLayout>
```

For prose-heavy pages (like documentation, terms, or privacy policy), use `ContentLayout`:

```astro
---
// src/pages/privacy.astro
import ContentLayout from '../layouts/ContentLayout.astro';
---

<ContentLayout title="Privacy Policy" description="How we handle your data.">
  <p>Our commitment to protecting your privacy...</p>
</ContentLayout>
```

### 5. Adding Reusable Components

All UI primitives live in `src/components/ui/` with strongly typed props:

```astro
---
// Using Button.astro
import Button from '../components/ui/Button.astro';
---

<!-- Button variant -->
<Button variant="primary" size="lg">
  Click Me
</Button>

<!-- Rendered as anchor link when href is supplied -->
<Button variant="outline" href="/about">
  Learn More
</Button>
```

### 6. Managing Content Collections

Articles are defined in `src/content/blog/` as Markdown or MDX files. The schema is validated in `src/content.config.ts`:

```typescript
// src/content.config.ts
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    author: z.string().default('Team'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

---

## SEO & Accessibility

- **Canonical URLs**: Automatically calculated for every page.
- **OpenGraph & Twitter Cards**: Rendered with fallback to `siteConfig.defaultOgImage`.
- **Dynamic Sitemap**: Generated at build time at `/sitemap-index.xml`.
- **Dynamic Robots**: `src/pages/robots.txt.ts` serves crawl directives pointing to the sitemap.
- **Accessible Skip Link**: Hidden off-screen, reveals on keyboard focus to jump directly to `<main id="main-content">`.
- **Focus Rings**: `:focus-visible` outlines ensure keyboard navigation clarity without disturbing mouse users.

---

## Testing & Quality Assurance

Run the test suites locally:

```bash
# 1. Type check
npm run check

# 2. Linting
npm run lint

# 3. Format check
npm run format:check

# 4. Unit tests (Vitest)
npm run test

# 5. Production build
npm run build

# 6. End-to-end tests (Playwright)
npm run test:e2e
```

---

## Production Build & Deployment

Build the static distribution:

```bash
npm run build
```

The compiled output is saved in `dist/`. You can deploy this directory to any static hosting service:

- **Cloudflare Pages**: Framework preset `Astro`, build command `npm run build`, output directory `dist`.
- **Vercel**: Framework preset `Astro`, build command `npm run build`, output directory `dist`.
- **Netlify**: Build command `npm run build`, publish directory `dist`.
- **GitHub Pages**: Use the official Astro GitHub Actions deployment workflow.

---

## Template Adaptability Guide

When using this starter for a new project, use this cheat-sheet:

| File / Folder                           | What to do                                                                  |
| --------------------------------------- | --------------------------------------------------------------------------- |
| `src/config/site.ts`                    | **Customize**: Site name, title, description, URLs, author, social profiles |
| `src/config/navigation.ts`              | **Customize**: Header and footer navigation links                           |
| `src/styles/tokens.css`                 | **Customize**: Brand colors, fonts, spacing, shadows                        |
| `public/favicon.svg` & `og-default.svg` | **Replace**: Your brand's favicon and social preview image                  |
| `src/pages/index.astro`                 | **Customize**: Homepage hero text, features, sections                       |
| `src/content/blog/`                     | **Replace**: Add your articles or replace with your content collection      |
| `src/layouts/` & `src/components/ui/`   | **Keep / Extend**: Reusable layout shells, containers, and buttons          |
| `astro.config.mjs` & `tsconfig.json`    | **Keep**: Core Astro and TypeScript strict foundations                      |

---

## License

This project is open-source software licensed under the [MIT License](LICENSE).
