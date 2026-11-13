import { test, expect } from '@playwright/test';

test.describe('Phase 7 Paper-Trade Journal & Enhanced Course Quizzes', () => {
  test('logs a paper check on /journal, persists across reloads, and clears cleanly', async ({
    page,
  }) => {
    await page.goto('/journal');

    await expect(page.getByTestId('journal-compliant-count')).toContainText('0 / 10');
    await expect(page.getByTestId('journal-empty-state')).toBeVisible();

    // Inspect 1-Page Spot Rules Sheet
    await page.getByTestId('toggle-rules-sheet').click();
    await expect(page.getByTestId('rules-sheet-drawer')).toContainText('$6.42');

    // Prefill and save worked SOL paper check
    await page.getByTestId('prefill-worked-journal-btn').click();
    await page.getByTestId('journal-submit-btn').click();

    await expect(page.getByTestId('journal-compliant-count')).toContainText('1 / 10');
    await expect(page.getByTestId('journal-entry-sol')).toBeVisible();

    // Reload -> persists in separate cme:journal:v1 storage
    await page.reload();
    await expect(page.getByTestId('journal-compliant-count')).toContainText('1 / 10');
    await expect(page.getByTestId('journal-entry-sol')).toBeVisible();

    // Clear with explicit confirmation controls
    await page.getByTestId('journal-reset-trigger').click();
    await page.getByTestId('journal-reset-confirm').click();
    await expect(page.getByTestId('journal-compliant-count')).toContainText('0 / 10');
    await expect(page.getByTestId('journal-empty-state')).toBeVisible();
  });

  test('renders Chapter Goals card and interactive ChapterQuiz on lesson pages', async ({
    page,
  }) => {
    await page.goto('/learn/01-how-a-chart-is-built');
    await expect(page.getByTestId('lesson-goals-card')).toBeVisible();
    await expect(page.getByTestId('chapter-quiz-1')).toBeVisible();
    await expect(page.getByTestId('quiz-score-1')).toContainText('Score: 0 / 3');

    await page.getByTestId('quiz-opt-ch1-q1-1').click();
    await expect(page.getByTestId('quiz-feedback-ch1-q1')).toContainText('Solid Decision');
    await expect(page.getByTestId('quiz-score-1')).toContainText('Score: 1 / 3');

    await page.goto('/learn/05-three-light-checklist');
    await expect(page.getByTestId('lesson-goals-card')).toBeVisible();
    await expect(page.getByTestId('chapter-quiz-5')).toBeVisible();

    await page.goto('/learn/08-glossary');
    await expect(page.getByTestId('lesson-goals-card')).toBeVisible();
    await expect(page.getByTestId('chapter-quiz-8')).toBeVisible();
  });
});
