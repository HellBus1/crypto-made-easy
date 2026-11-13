import { describe, it, expect } from 'vitest';
import {
  JOURNAL_STORAGE_KEY,
  GRADUATION_TARGET_CHECKS,
  addJournalEntry,
  computeJournalStats,
  deleteJournalEntry,
  isEntryRuleCompliant,
  readJournalStore,
  resetJournalStore,
  updateJournalEntryOutcome,
  type NewPaperCheckInput,
} from '../../src/lib/journal';

function createMemoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear() {
      map.clear();
    },
    getItem(key: string) {
      return map.get(key) ?? null;
    },
    key(index: number) {
      return Array.from(map.keys())[index] ?? null;
    },
    removeItem(key: string) {
      map.delete(key);
    },
    setItem(key: string, value: string) {
      map.set(key, value);
    },
  };
}

const sampleCheck: NewPaperCheckInput = {
  ticker: 'sol',
  timeframe: '4H',
  signalResult: 'BUY_ZONE',
  buyLightsCount: 3,
  btc24hChange: -1.2,
  entryPrice: 88.5,
  stopLossPrice: 79.58,
  takeProfitPrice: 95,
  starterBudgetUsdt: 50,
  autoStopPlanned: true,
  btcFilterChecked: true,
  withinTwoChecksPerDay: true,
  followedPlanWithoutPanic: true,
  outcome: 'pending',
  notes: '3/3 ON at support floor',
};

describe('Phase 7 Paper-Trade Journal Persistence', () => {
  it('handles missing or corrupted JSON gracefully without throwing', () => {
    const storage = createMemoryStorage();
    expect(readJournalStore(storage).entries).toEqual([]);

    storage.setItem(JOURNAL_STORAGE_KEY, '{broken-json');
    expect(readJournalStore(storage).entries).toEqual([]);
  });

  it('adds, updates outcomes, deletes, and tracks 10-check graduation progress', () => {
    const storage = createMemoryStorage();

    for (let i = 0; i < GRADUATION_TARGET_CHECKS - 1; i++) {
      addJournalEntry(sampleCheck, storage);
    }

    const store9 = readJournalStore(storage);
    expect(store9.entries.length).toBe(9);
    expect(store9.entries[0].ticker).toBe('SOL');
    expect(isEntryRuleCompliant(store9.entries[0])).toBe(true);

    const stats9 = computeJournalStats(store9.entries);
    expect(stats9.compliantChecks).toBe(9);
    expect(stats9.isGraduated).toBe(false);
    expect(stats9.graduationPercent).toBe(90);

    // Log 1 non-compliant check (forgot autoStopPlanned) -> should not graduate yet
    addJournalEntry({ ...sampleCheck, autoStopPlanned: false, ticker: 'eth' }, storage);
    const afterIncomplete = computeJournalStats(readJournalStore(storage).entries);
    expect(afterIncomplete.totalChecks).toBe(10);
    expect(afterIncomplete.compliantChecks).toBe(9);
    expect(afterIncomplete.isGraduated).toBe(false);

    // Log 1 compliant WAIT check -> hits 10/10 graduation!
    const after11 = addJournalEntry(
      { ...sampleCheck, signalResult: 'WAIT_HOLD', outcome: 'skipped_wisely' },
      storage
    );
    const statsGrad = computeJournalStats(after11.entries);
    expect(statsGrad.compliantChecks).toBe(10);
    expect(statsGrad.isGraduated).toBe(true);
    expect(statsGrad.graduationPercent).toBe(100);

    const targetId = after11.entries[0].id;
    const updatedOutcome = updateJournalEntryOutcome(targetId, 'target_hit', storage);
    expect(updatedOutcome.entries[0].outcome).toBe('target_hit');

    const afterDelete = deleteJournalEntry(targetId, storage);
    expect(afterDelete.entries.some((e) => e.id === targetId)).toBe(false);

    const afterReset = resetJournalStore(storage);
    expect(afterReset.entries).toEqual([]);
    expect(storage.getItem(JOURNAL_STORAGE_KEY)).toBeNull();
  });
});
