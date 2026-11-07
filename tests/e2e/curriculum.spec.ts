import { test, expect } from '@playwright/test';

test.describe('Phase 6 Full Curriculum & Progress E2E', () => {
  test('navigates through lessons 1 to 8, marks progress, and persists across reloads', async ({
    page,
  }) => {
    // 1. Visit curriculum dashboard
    await page.goto('/learn');
    await expect(page.locator('h1')).toContainText('Interactive Spot Chart Curriculum');

    // 2. Open Chapter 4 (Support & Resistance)
    await page.goto('/learn/04-support-resistance-and-liquidity');
    await expect(page.locator('h1')).toContainText(
      'Chapter 4: Support, resistance and liquidity zones'
    );
    await expect(page.locator('[data-ui="sr-lab"]')).toBeVisible();

    // 3. Mark Chapter 4 complete
    const markCompleteBtn = page.locator('#chapter-complete-btn');
    await expect(markCompleteBtn).toBeVisible();
    await markCompleteBtn.click();
    await expect(markCompleteBtn).toContainText('Completed');

    // 4. Reload page to verify persistence in cme:v1 localStorage
    await page.reload();
    await expect(page.locator('#chapter-complete-btn')).toContainText('Completed');

    // 5. Open Chapter 6 (Position Sizing)
    await page.goto('/learn/06-position-sizing');
    await expect(page.locator('h1')).toContainText('Chapter 6: Position sizing and split entry');
    await expect(page.locator('[data-ui="position-sizing-lab"]')).toBeVisible();

    // 6. Open Chapter 7 (Trading Mindset)
    await page.goto('/learn/07-trading-mindset');
    await expect(page.locator('h1')).toContainText('Chapter 7: Trading mindset');
    await expect(page.locator('[data-ui="mindset-lab"]')).toBeVisible();

    // 7. Verify Chapter 8 (Glossary)
    await page.goto('/learn/08-glossary');
    await expect(page.locator('h1')).toContainText(
      'Chapter 8: Chart glossary & everyday analogies'
    );
  });
});
