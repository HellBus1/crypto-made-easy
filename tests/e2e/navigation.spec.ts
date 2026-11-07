import { test, expect } from '@playwright/test';

test.describe('Site Navigation', () => {
  test('should render the overview page with KPI strip, worked example, and footer disclaimer', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Crypto Made Easy/);
    const heroTitle = page.locator('h1');
    await expect(heroTitle).toContainText('Spot Chart Learning & 3-Light Signal Checklist');

    const curriculumSection = page.locator('#curriculum-heading');
    await expect(curriculumSection).toBeVisible();

    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('Educational checklist, not financial advice');
  });

  test('should navigate between header links and open Chapter 1', async ({ page }) => {
    await page.goto('/');

    // Navigate to Learn
    await page.click('nav[aria-label="Main Navigation"] a[href="/learn"]');
    await expect(page).toHaveURL(/\/learn$/);
    await expect(page.locator('h1')).toContainText('Interactive Spot Chart Curriculum');

    // Open Chapter 1 lesson
    await page.click('a[href="/learn/01-how-a-chart-is-built"] >> nth=0');
    await expect(page).toHaveURL(/\/learn\/01-how-a-chart-is-built$/);
    await expect(page.locator('h1')).toContainText('Chapter 1: How a chart is built');

    // Navigate to Signal Checker
    await page.click('nav[aria-label="Main Navigation"] a[href="/checker"]');
    await expect(page).toHaveURL(/\/checker$/);
    await expect(page.locator('h1')).toContainText('Spot Signal Checker');

    // Navigate to Glossary
    await page.click('nav[aria-label="Main Navigation"] a[href="/glossary"]');
    await expect(page).toHaveURL(/\/glossary$/);
    await expect(page.locator('h1')).toContainText('Chart Glossary');

    // Navigate to About
    await page.click('nav[aria-label="Main Navigation"] a[href="/about"]');
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.locator('h1')).toContainText('About Crypto Made Easy');
  });
});
