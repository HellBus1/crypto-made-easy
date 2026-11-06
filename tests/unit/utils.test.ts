import { describe, it, expect } from 'vitest';
import { getCanonicalUrl, formatPageTitle } from '../../src/utils/seo';
import { formatDate, toISODate } from '../../src/utils/date';
import { siteConfig } from '../../src/config/site';

describe('SEO Utilities', () => {
  describe('getCanonicalUrl', () => {
    it('returns the base URL if path is not provided', () => {
      const canonical = getCanonicalUrl();
      expect(canonical).toBe(siteConfig.url.replace(/\/+$/, ''));
    });

    it('appends relative path to base URL', () => {
      const canonical = getCanonicalUrl('/about', 'https://example.com');
      expect(canonical).toBe('https://example.com/about');
    });

    it('ensures single leading slash for path', () => {
      const canonical = getCanonicalUrl('blog/post-1', 'https://example.com/');
      expect(canonical).toBe('https://example.com/blog/post-1');
    });

    it('returns full URL unchanged if already absolute', () => {
      const fullUrl = 'https://other-site.com/page';
      expect(getCanonicalUrl(fullUrl)).toBe(fullUrl);
    });
  });

  describe('formatPageTitle', () => {
    it('returns site title if no title provided', () => {
      expect(formatPageTitle()).toBe(siteConfig.title);
    });

    it('appends fallback branding to custom page title', () => {
      expect(formatPageTitle('About Us', 'Astro Starter')).toBe('About Us | Astro Starter');
    });

    it('avoids repeating brand if title already matches brand', () => {
      expect(formatPageTitle('Astro Starter', 'Astro Starter')).toBe('Astro Starter');
    });
  });
});

describe('Date Utilities', () => {
  describe('formatDate', () => {
    it('formats a date string correctly in en locale', () => {
      const formatted = formatDate('2026-10-25T00:00:00Z', 'en');
      expect(formatted).toContain('October');
      expect(formatted).toContain('2026');
    });

    it('returns empty string for invalid date', () => {
      expect(formatDate('invalid-date')).toBe('');
    });
  });

  describe('toISODate', () => {
    it('converts Date to ISO string', () => {
      const date = new Date('2026-10-25T12:00:00.000Z');
      expect(toISODate(date)).toBe('2026-10-25T12:00:00.000Z');
    });

    it('returns empty string for invalid date', () => {
      expect(toISODate('invalid-date')).toBe('');
    });
  });
});
