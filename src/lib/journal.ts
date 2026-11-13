/**
 * Separate Paper-Trade Journal Persistence (Phase 7)
 *
 * Intentionally uses its own localStorage key (`cme:journal:v1`) so `/checker`
 * remains 100% stateless and zero-storage. Only `/journal` reads or writes here.
 */

export const JOURNAL_STORAGE_KEY = 'cme:journal:v1';
export const JOURNAL_UPDATED_EVENT = 'cme:journal-updated';
export const GRADUATION_TARGET_CHECKS = 10;

export type JournalSignalResult = 'BUY_ZONE' | 'WAIT_HOLD' | 'TAKE_PROFIT' | 'PLAN_BROKEN';
export type JournalOutcome = 'pending' | 'target_hit' | 'stop_hit' | 'skipped_wisely' | 'no_fill';

export interface PaperCheckEntry {
  id: string;
  createdAt: string;
  ticker: string;
  timeframe: '4H' | '1D';
  signalResult: JournalSignalResult;
  buyLightsCount: number;
  btc24hChange?: number;
  entryPrice: number;
  stopLossPrice: number;
  takeProfitPrice: number;
  starterBudgetUsdt: number;
  autoStopPlanned: boolean;
  btcFilterChecked: boolean;
  withinTwoChecksPerDay: boolean;
  followedPlanWithoutPanic: boolean;
  outcome: JournalOutcome;
  notes: string;
}

export type NewPaperCheckInput = Omit<PaperCheckEntry, 'id' | 'createdAt'>;

export interface JournalStore {
  version: 1;
  updatedAt: string;
  entries: PaperCheckEntry[];
}

export interface JournalStats {
  totalChecks: number;
  compliantChecks: number;
  graduationTarget: number;
  graduationPercent: number;
  isGraduated: boolean;
  buyZoneCount: number;
  waitSkippedCount: number;
  pendingOutcomes: number;
  complianceRatePercent: number;
}

function getDefaultStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function createEmptyJournalStore(): JournalStore {
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    entries: [],
  };
}

function isValidEntry(candidate: unknown): candidate is PaperCheckEntry {
  if (!candidate || typeof candidate !== 'object') return false;
  const item = candidate as Record<string, unknown>;
  return (
    typeof item.id === 'string' &&
    typeof item.createdAt === 'string' &&
    typeof item.ticker === 'string' &&
    (item.timeframe === '4H' || item.timeframe === '1D') &&
    (item.signalResult === 'BUY_ZONE' ||
      item.signalResult === 'WAIT_HOLD' ||
      item.signalResult === 'TAKE_PROFIT' ||
      item.signalResult === 'PLAN_BROKEN') &&
    typeof item.buyLightsCount === 'number' &&
    typeof item.entryPrice === 'number' &&
    typeof item.stopLossPrice === 'number' &&
    typeof item.takeProfitPrice === 'number' &&
    typeof item.starterBudgetUsdt === 'number' &&
    typeof item.autoStopPlanned === 'boolean' &&
    typeof item.btcFilterChecked === 'boolean' &&
    typeof item.withinTwoChecksPerDay === 'boolean' &&
    typeof item.followedPlanWithoutPanic === 'boolean' &&
    typeof item.outcome === 'string' &&
    typeof item.notes === 'string'
  );
}

export function readJournalStore(storage: Storage | null = getDefaultStorage()): JournalStore {
  if (!storage) return createEmptyJournalStore();

  try {
    const raw = storage.getItem(JOURNAL_STORAGE_KEY);
    if (!raw) return createEmptyJournalStore();

    const parsed = JSON.parse(raw) as Partial<JournalStore>;
    if (parsed.version !== 1 || !Array.isArray(parsed.entries)) {
      return createEmptyJournalStore();
    }

    const validEntries = parsed.entries.filter(isValidEntry);
    return {
      version: 1,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
      entries: validEntries,
    };
  } catch {
    return createEmptyJournalStore();
  }
}

export function saveJournalStore(
  store: JournalStore,
  storage: Storage | null = getDefaultStorage()
): boolean {
  if (!storage) return false;
  try {
    const nextStore: JournalStore = {
      version: 1,
      updatedAt: new Date().toISOString(),
      entries: store.entries,
    };
    storage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(nextStore));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(JOURNAL_UPDATED_EVENT, { detail: nextStore }));
    }
    return true;
  } catch {
    return false;
  }
}

export function isEntryRuleCompliant(entry: PaperCheckEntry): boolean {
  return (
    entry.autoStopPlanned &&
    entry.btcFilterChecked &&
    entry.withinTwoChecksPerDay &&
    entry.followedPlanWithoutPanic
  );
}

export function computeJournalStats(entries: PaperCheckEntry[]): JournalStats {
  const totalChecks = entries.length;
  const compliantChecks = entries.filter(isEntryRuleCompliant).length;
  const capped = Math.min(compliantChecks, GRADUATION_TARGET_CHECKS);
  const graduationPercent = Math.round((capped / GRADUATION_TARGET_CHECKS) * 100);
  const complianceRatePercent =
    totalChecks > 0 ? Math.round((compliantChecks / totalChecks) * 100) : 0;

  return {
    totalChecks,
    compliantChecks,
    graduationTarget: GRADUATION_TARGET_CHECKS,
    graduationPercent,
    isGraduated: compliantChecks >= GRADUATION_TARGET_CHECKS,
    buyZoneCount: entries.filter((e) => e.signalResult === 'BUY_ZONE').length,
    waitSkippedCount: entries.filter(
      (e) => e.signalResult === 'WAIT_HOLD' || e.outcome === 'skipped_wisely'
    ).length,
    pendingOutcomes: entries.filter((e) => e.outcome === 'pending').length,
    complianceRatePercent,
  };
}

export function addJournalEntry(
  input: NewPaperCheckInput,
  storage: Storage | null = getDefaultStorage()
): JournalStore {
  const current = readJournalStore(storage);
  const now = new Date().toISOString();
  const id = `chk-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  const entry: PaperCheckEntry = {
    ...input,
    ticker: input.ticker.trim().toUpperCase() || 'COIN',
    notes: input.notes.trim(),
    id,
    createdAt: now,
  };

  const next: JournalStore = {
    version: 1,
    updatedAt: now,
    entries: [entry, ...current.entries],
  };

  saveJournalStore(next, storage);
  return next;
}

export function updateJournalEntryOutcome(
  id: string,
  outcome: JournalOutcome,
  storage: Storage | null = getDefaultStorage()
): JournalStore {
  const current = readJournalStore(storage);
  const next: JournalStore = {
    version: 1,
    updatedAt: new Date().toISOString(),
    entries: current.entries.map((entry) => (entry.id === id ? { ...entry, outcome } : entry)),
  };
  saveJournalStore(next, storage);
  return next;
}

export function deleteJournalEntry(
  id: string,
  storage: Storage | null = getDefaultStorage()
): JournalStore {
  const current = readJournalStore(storage);
  const next: JournalStore = {
    version: 1,
    updatedAt: new Date().toISOString(),
    entries: current.entries.filter((entry) => entry.id !== id),
  };
  saveJournalStore(next, storage);
  return next;
}

export function resetJournalStore(storage: Storage | null = getDefaultStorage()): JournalStore {
  const empty = createEmptyJournalStore();
  if (storage) {
    try {
      storage.removeItem(JOURNAL_STORAGE_KEY);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(JOURNAL_UPDATED_EVENT, { detail: empty }));
      }
    } catch {
      // Ignore storage errors safely
    }
  }
  return empty;
}
