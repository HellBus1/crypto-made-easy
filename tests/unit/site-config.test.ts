import { describe, it, expect } from 'vitest';
import { siteConfig } from '../../src/config/site';
import { navigationConfig } from '../../src/config/navigation';

describe('Site Configuration', () => {
  it('should define required site metadata', () => {
    expect(siteConfig.name).toBeTruthy();
    expect(siteConfig.title).toBeTruthy();
    expect(siteConfig.description).toBeTruthy();
    expect(siteConfig.url).toMatch(/^https?:\/\//);
    expect(siteConfig.defaultLocale).toBe('en');
    expect(siteConfig.defaultOgImage).toBeTruthy();
  });

  it('should define author and social links', () => {
    expect(siteConfig.author.name).toBeTruthy();
    expect(siteConfig.socials.github).toBeTruthy();
  });
});

describe('Navigation Configuration', () => {
  it('should provide valid header navigation items', () => {
    expect(navigationConfig.header.length).toBeGreaterThan(0);
    navigationConfig.header.forEach((item) => {
      expect(item.label).toBeTruthy();
      expect(item.href).toBeTruthy();
    });
  });

  it('should provide product, resources, and legal footer navigation items', () => {
    expect(navigationConfig.footer.product.length).toBeGreaterThan(0);
    expect(navigationConfig.footer.resources.length).toBeGreaterThan(0);
    expect(navigationConfig.footer.legal.length).toBeGreaterThan(0);
  });
});
