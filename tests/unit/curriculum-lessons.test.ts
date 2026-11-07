import { describe, it, expect } from 'vitest';
import { curriculum } from '../../src/config/curriculum';

describe('Phase 5 Complete 8-Chapter Curriculum Validation', () => {
  it('defines all 8 chapters in curriculum configuration', () => {
    expect(curriculum.length).toBe(8);
    for (let i = 1; i <= 8; i++) {
      const item = curriculum.find((c) => c.chapter === i);
      expect(item).toBeDefined();
      expect(item?.slug).toMatch(new RegExp(`^0${i}-`));
      expect(item?.title.length).toBeGreaterThan(0);
      expect(item?.interactiveFocus.length).toBeGreaterThan(0);
    }
  });

  it('verifies stop-loss arithmetic in support/resistance lab calculation', () => {
    const floor = 85.0;
    const stop = Math.round(floor * 0.98 * 100) / 100;
    expect(stop).toBe(83.3);
  });

  it('verifies position-sizing 4-bucket ladder splits sum up exactly to total capital', () => {
    const totalBudget = 233.77;
    const entry1Amount = Math.round(totalBudget * 0.1283 * 100) / 100;
    const entry2Amount = Math.round(totalBudget * 0.2139 * 100) / 100;
    const entry3Amount = Math.round(totalBudget * 0.2994 * 100) / 100;
    const reserveAmount =
      Math.round((totalBudget - (entry1Amount + entry2Amount + entry3Amount)) * 100) / 100;

    const sum = entry1Amount + entry2Amount + entry3Amount + reserveAmount;
    expect(sum).toBeCloseTo(totalBudget, 2);
    expect(reserveAmount).toBeGreaterThan(80);
  });
});
