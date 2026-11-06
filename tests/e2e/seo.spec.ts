import { test, expect } from '@playwright/test';

test.describe('SEO & Metadata Verification', () => {
  test('should include essential SEO meta tags on homepage', async ({ page }) => {
    await page.goto('/');

    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute('content', /.+/);

    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /https?:\/\/.+/);

    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /.+/);

    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toHaveAttribute('content', /.+/);

    const twitterCard = page.locator('meta[name="twitter:card"]');
    await expect(twitterCard).toHaveAttribute('content', 'summary_large_image');

    const sitemapLink = page.locator('link[rel="sitemap"]');
    await expect(sitemapLink).toHaveAttribute('href', '/sitemap-index.xml');
  });

  test('should serve robots.txt linking to sitemap', async ({ request }) => {
    const response = await request.get('/robots.txt');
    expect(response.status()).toBe(200);

    const text = await response.text();
    expect(text).toContain('User-agent: *');
    expect(text).toContain('Allow: /');
    expect(text).toContain('sitemap-index.xml');
  });
});
