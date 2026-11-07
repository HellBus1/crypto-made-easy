import { describe, it, expect, beforeEach } from 'vitest';
import {
  PROGRESS_STORAGE_KEY,
  loadProgress,
  markChapterComplete,
  toggleChapterComplete,
  resetProgress,
} from '../../src/lib/progress';

describe('Course Progress LocalStorage Store (cme:v1)', () => {
  const store: Record<string, string> = {};

  beforeEach(() => {
    for (const key of Object.keys(store)) {
      delete store[key];
    }

    const mockStorage = {
      getItem: (key: string) => (key in store ? store[key] : null),
      setItem: (key: string, val: string) => {
        store[key] = val;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
    };

    Object.defineProperty(globalThis, 'window', {
      value: {
        localStorage: mockStorage,
        dispatchEvent: () => true,
      },
      configurable: true,
      writable: true,
    });
  });

  it('returns empty default state when localStorage is empty', () => {
    const state = loadProgress();
    expect(state.schemaVersion).toBe(1);
    expect(state.completed).toEqual([]);
  });

  it('marks chapters complete, toggles completion, and deduplicates slugs', () => {
    markChapterComplete('01-how-a-chart-is-built');
    markChapterComplete('01-how-a-chart-is-built');
    expect(loadProgress().completed).toEqual(['01-how-a-chart-is-built']);

    toggleChapterComplete('02-candlestick-anatomy');
    expect(loadProgress().completed).toEqual(['01-how-a-chart-is-built', '02-candlestick-anatomy']);

    toggleChapterComplete('01-how-a-chart-is-built');
    expect(loadProgress().completed).toEqual(['02-candlestick-anatomy']);
  });

  it('recovers gracefully if localStorage contains corrupted JSON', () => {
    store[PROGRESS_STORAGE_KEY] = '{bad-json';
    const state = loadProgress();
    expect(state.completed).toEqual([]);
  });

  it('resets progress cleanly', () => {
    markChapterComplete('01-how-a-chart-is-built');
    resetProgress();
    expect(loadProgress().completed).toEqual([]);
  });
});
