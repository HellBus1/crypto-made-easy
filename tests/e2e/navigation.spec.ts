import { test, expect } from '@playwright/test';

test.describe('Site Navigation', () => {
  test('should render the homepage with hero, features, and footer', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Astro Starter/);
    const heroTitle = page.locator('h1');
    await expect(heroTitle).toBeVisible();

    const featuresSection = page.locator('#features');
    await expect(featuresSection).toBeVisible();

    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('should navigate between header links', async ({ page }) => {
    await page.goto('/');

    // Navigate to About
    await page.click('nav[aria-label="Main Navigation"] a[href="/about"]');
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.locator('h1')).toContainText('About This Starter');

    // Navigate to Blog
    await page.click('nav[aria-label="Main Navigation"] a[href="/blog"]');
    await expect(page).toHaveURL(/\/blog$/);
    await expect(page.locator('h1')).toContainText('Blog & Articles');

    // Open blog post
    await page.click('a[href="/blog/getting-started"]');
    await expect(page).toHaveURL(/\/blog\/getting-started$/);
    await expect(page.locator('h1')).toContainText(
      'Getting Started with the Astro + TypeScript Starter'
    );
  });
});
