import { roundTo } from '../signal/stop';

export interface Candle {
  /** Unix timestamp in seconds (compatible with lightweight-charts UTCTimestamp) */
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type ScenarioName = 'uptrend' | 'range' | 'dip-at-support' | 'broken-trend';

/**
 * Enforces OHLC invariants:
 * - high >= max(open, close)
 * - low <= min(open, close)
 */
export function clampOhlc(
  open: number,
  high: number,
  low: number,
  close: number
): { open: number; high: number; low: number; close: number } {
  const safeOpen = Math.max(0.01, roundTo(open, 2));
  const safeClose = Math.max(0.01, roundTo(close, 2));
  const bodyTop = Math.max(safeOpen, safeClose);
  const bodyBottom = Math.min(safeOpen, safeClose);

  const safeHigh = Math.max(bodyTop, roundTo(high, 2));
  const safeLow = Math.max(0.01, Math.min(bodyBottom, roundTo(low, 2)));

  return {
    open: safeOpen,
    high: safeHigh,
    low: safeLow,
    close: safeClose,
  };
}

/**
 * Aggregates fine-grained candles into higher-timeframe candles (e.g. cuatro 1H -> 4H, or six 4H -> 1D).
 * Preserves first open, max high, min low, last close, and total volume.
 */
export function aggregateCandles(candles: Candle[], groupSize: number): Candle[] {
  if (groupSize <= 0) {
    throw new Error('groupSize must be greater than 0');
  }
  const aggregated: Candle[] = [];

  for (let i = 0; i < candles.length; i += groupSize) {
    const slice = candles.slice(i, i + groupSize);
    if (slice.length === 0) continue;

    const first = slice[0];
    const last = slice[slice.length - 1];
    const high = Math.max(...slice.map((c) => c.high));
    const low = Math.min(...slice.map((c) => c.low));
    const volume = roundTo(
      slice.reduce((acc, c) => acc + c.volume, 0),
      2
    );

    aggregated.push({
      time: first.time,
      open: first.open,
      high,
      low,
      close: last.close,
      volume,
    });
  }

  return aggregated;
}

/**
 * Deterministic Mulberry32 PRNG for reproducible synthetic lessons.
 */
function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generates deterministic, realistic 4H OHLCV candles for named teaching scenarios:
 * - 'uptrend': Higher highs and higher lows with healthy 5-6% breathing pullbacks above support.
 * - 'range': Sideways oscillation between a clear 85 USDT support floor and 96 USDT resistance ceiling.
 * - 'dip-at-support': Pullback below MA30 (~91.60) into an 88.50–89.73 support zone with long lower wicks and rising volume (mirrors the SOL worked example).
 * - 'broken-trend': Support at 88.50 and 81.20 breaks on heavy volume below the 79.58 stop-loss level.
 */
export function generateScenarioCandles(scenario: ScenarioName, count = 48, seed = 1337): Candle[] {
  const rand = createSeededRandom(seed);
  // Base timestamp: 2026-10-25 00:00:00 UTC in seconds, stepping by 4 hours (14400s)
  const startTimestamp = 1792886400;
  const stepSeconds = 4 * 3600;

  const candles: Candle[] = [];
  let price = scenario === 'uptrend' ? 82.0 : 92.0;

  for (let i = 0; i < count; i++) {
    const progress = i / Math.max(1, count - 1);
    const noise = (rand() - 0.5) * 1.4;
    let drift = 0;
    let extraLowerWick = 0;
    let extraUpperWick = 0;
    let volMultiplier = 1.0;

    if (scenario === 'uptrend') {
      // Stair-step higher with two calm 5% breathing pullbacks
      const wave = Math.sin(progress * Math.PI * 3.5) * 0.65;
      drift = 0.32 + wave;
      if (wave < -0.3) {
        extraLowerWick = 0.8;
      }
    } else if (scenario === 'range') {
      // Oscillate cleanly between 86 and 95
      const target = 90.5 + Math.sin(progress * Math.PI * 4) * 4.5;
      drift = (target - price) * 0.45;
      if (price <= 87.2) {
        extraLowerWick = 1.1;
        volMultiplier = 1.45;
      } else if (price >= 94.0) {
        extraUpperWick = 1.1;
        volMultiplier = 1.35;
      }
    } else if (scenario === 'dip-at-support') {
      // Starts around 94, pulls back below MA30 (~91.6) into 88.5-89.7 support floor with buyer absorption
      if (progress < 0.45) {
        drift = 0.15;
      } else if (progress < 0.82) {
        drift = -0.48;
      } else {
        drift = 0.25;
        extraLowerWick = 1.35;
        volMultiplier = 1.65;
      }
    } else if (scenario === 'broken-trend') {
      // Holds 88.5 early, then slices through 85, 81.2, and the 79.58 stop-loss on expanding red volume
      if (progress < 0.35) {
        drift = -0.1;
      } else if (progress < 0.65) {
        drift = -0.35;
      } else {
        drift = -0.75;
        extraUpperWick = 0.7;
        volMultiplier = 1.95;
      }
    }

    const open = roundTo(price, 2);
    const close = roundTo(Math.max(10, open + drift + noise * 0.6), 2);
    const rawHigh = Math.max(open, close) + rand() * 0.9 + extraUpperWick;
    const rawLow = Math.min(open, close) - rand() * 0.9 - extraLowerWick;
    const clamped = clampOhlc(open, rawHigh, rawLow, close);

    const baseVolume = 12000 + Math.abs(clamped.close - clamped.open) * 4200 + rand() * 3500;
    const volume = roundTo(baseVolume * volMultiplier, 0);

    candles.push({
      time: startTimestamp + i * stepSeconds,
      ...clamped,
      volume,
    });

    price = clamped.close;
  }

  return candles;
}
