import { test, expect } from '@playwright/test';

test.describe('Custom 404 Page', () => {
  test('should display 404 error page for non-existent route with return link', async ({
    page,
  }) => {
    const response = await page.goto('/non-existent-route-404-test');
    expect(response?.status()).toBe(404);

    await expect(page.locator('h1')).toContainText('Page not found');

    const homeLink = page.locator('a:has-text("Return to Homepage")');
    await expect(homeLink).toBeVisible();

    await homeLink.click();
    await expect(page).toHaveURL(/\/$/);
  });
});
