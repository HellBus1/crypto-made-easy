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
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
  ],
  footer: {
    product: [
      { label: 'Features', href: '/#features' },
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
    ],
    resources: [
      { label: 'Documentation', href: 'https://docs.astro.build', external: true },
      { label: 'Astro GitHub', href: 'https://github.com/withastro/astro', external: true },
      {
        label: 'Starter GitHub',
        href: 'https://github.com/syubbanfakhriya/ts-astro-starter',
        external: true,
      },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/about' },
      { label: 'Terms of Service', href: '/about' },
      {
        label: 'License (MIT)',
        href: 'https://github.com/syubbanfakhriya/ts-astro-starter/blob/master/LICENSE',
        external: true,
      },
    ],
  },
};
