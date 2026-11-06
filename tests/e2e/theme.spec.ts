import { test, expect } from '@playwright/test';

test.describe('Theme & Accessibility', () => {
  test('should toggle theme and persist in localStorage', async ({ page }) => {
    await page.goto('/');

    const toggle = page.locator('#theme-toggle');
    await expect(toggle).toBeVisible();

    // Check initial state
    const initialTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );

    // Click toggle
    await toggle.click();

    // Verify theme changed
    const toggledTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(toggledTheme).not.toBe(initialTheme);

    const storedTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(storedTheme).toBe(toggledTheme);

    // Toggle back
    await toggle.click();
    const finalTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(finalTheme).toBe(initialTheme);
  });

  test('should reveal skip link on keyboard focus', async ({ page }) => {
    await page.goto('/');

    await page.keyboard.press('Tab');
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toHaveAttribute('href', '#main-content');
  });
});
