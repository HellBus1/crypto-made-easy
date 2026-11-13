/**
 * Navigation Configuration
 * Centralized links for the site header, mobile menu, and footer.
 */

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface NavigationConfig {
  header: NavItem[];
  footer: {
    product: NavItem[];
    resources: NavItem[];
    legal: NavItem[];
  };
}

export const navigationConfig: NavigationConfig = {
  header: [
    { label: 'Overview', href: '/' },
    { label: 'Learn', href: '/learn' },
    { label: 'Signal Checker', href: '/checker' },
    { label: 'Paper Journal', href: '/journal' },
    { label: 'Glossary', href: '/glossary' },
    { label: 'About', href: '/about' },
  ],
  footer: {
    product: [
      { label: 'Course Modules', href: '/learn' },
      { label: 'Signal Checker', href: '/checker' },
      { label: 'Paper Journal', href: '/journal' },
      { label: 'Chart Glossary', href: '/glossary' },
    ],
    resources: [
      { label: 'How the 3 Lights Work', href: '/learn/05-three-light-checklist' },
      { label: 'Position Sizing & Reserve', href: '/learn/06-position-sizing' },
      { label: 'Method & Disclaimers', href: '/about' },
    ],
    legal: [
      { label: 'Educational Disclaimer', href: '/about#disclaimer' },
      { label: 'Zero-Tracking Privacy', href: '/about#privacy' },
      {
        label: 'License (MIT)',
        href: 'https://github.com/syubbanfakhriya/crypto-made-easy/blob/master/LICENSE',
        external: true,
      },
    ],
  },
};
