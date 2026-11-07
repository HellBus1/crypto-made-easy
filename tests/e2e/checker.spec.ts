import { test, expect } from '@playwright/test';

test.describe('Phase 4 Signal Checker Flows (FR-1 to FR-7)', () => {
  test('starts with empty inputs, evaluates SOL Buy Zone and ETH Wait, validates RSI 120, and clears on refresh', async ({
    page,
  }) => {
    await page.goto('/checker');

    // 1. Verify fresh page has empty inputs
    await expect(page.getByTestId('input-ticker')).toHaveValue('');
    await expect(page.getByTestId('input-current-price')).toHaveValue('');
    await expect(page.getByTestId('input-rsi')).toHaveValue('');

    // 2. Load SOL Buy Zone preset (Acceptance #1 & #3)
    await page.getByTestId('preset-btn-sol-buy-zone').click();
    await expect(page.getByTestId('signal-state-badge')).toContainText('Buy Zone');
    await expect(page.getByTestId('position-plan-card')).toBeVisible();
    await expect(page.getByTestId('ladder-table')).toContainText('$30.00');
    await expect(page.getByTestId('ladder-table')).toContainText('$50.00');
    await expect(page.getByTestId('ladder-table')).toContainText('$70.00');
    await expect(page.getByTestId('ladder-table')).toContainText('$83.77');
    await expect(page.getByTestId('stop-loss-box')).toContainText('$79.58');
    await expect(page.getByTestId('what-not-to-do-box')).toBeVisible();
    await expect(page.getByTestId('result-risk-disclaimer')).toBeVisible();

    // 3. Load ETH Wait preset (Acceptance #2)
    await page.getByTestId('preset-btn-eth-wait').click();
    await expect(page.getByTestId('signal-state-badge')).toContainText('Wait');
    await expect(page.getByTestId('light-status-3')).toContainText('OFF');
    await expect(page.getByTestId('signal-summary-reason')).toContainText(
      'Sellers still dominate the order book'
    );

    // 4. Enter RSI = 120 -> Validation error, no plan card shown (Acceptance #5)
    await page.getByTestId('input-rsi').fill('120');
    await expect(page.getByTestId('checker-validation-error')).toBeVisible();
    await expect(page.getByTestId('position-plan-card')).toHaveCount(0);

    // 5. Refresh page -> All inputs cleared and no checker state in localStorage (Acceptance #6 & #9)
    await page.reload();
    await expect(page.getByTestId('input-ticker')).toHaveValue('');
    await expect(page.getByTestId('input-rsi')).toHaveValue('');
    const storageKeys = await page.evaluate(() => Object.keys(window.localStorage));
    expect(storageKeys.filter((k) => k !== 'theme' && k !== 'cme:v1')).toEqual([]);
  });
});
