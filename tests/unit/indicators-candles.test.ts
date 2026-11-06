import { describe, it, expect } from 'vitest';
import { sma, ema, bollinger, rsi, macd } from '../../src/lib/indicators';
import { clampOhlc, aggregateCandles, generateScenarioCandles } from '../../src/lib/candles';

describe('Technical Indicators Library', () => {
  it('computes Simple Moving Average (SMA) accurately', () => {
    const prices = [10, 12, 14, 16, 18];
    const result = sma(prices, 3);
    expect(result).toEqual([null, null, 12, 14, 16]);
  });

  it('computes Exponential Moving Average (EMA) seeded with SMA', () => {
    const prices = [10, 12, 14, 16, 18];
    const result = ema(prices, 3);
    expect(result[0]).toBeNull();
    expect(result[1]).toBeNull();
    expect(result[2]).toBe(12); // SMA of 10, 12, 14
    // k = 2 / (3 + 1) = 0.5 -> next = 16 * 0.5 + 12 * 0.5 = 14
    expect(result[3]).toBe(14);
    expect(result[4]).toBe(16);
  });

  it('computes Bollinger Bands with upper > middle > lower on varying prices', () => {
    const prices = [88, 89, 90, 91, 92, 93, 94];
    const bands = bollinger(prices, 5, 2);
    expect(bands[3]).toEqual({ middle: null, upper: null, lower: null });
    const fifth = bands[4];
    expect(fifth.middle).toBe(90);
    expect(fifth.upper).toBeGreaterThan(90);
    expect(fifth.lower).toBeLessThan(90);
  });

  it('computes Wilder RSI within [0, 100] and detects oversold vs overbought series', () => {
    const falling = [100, 98, 96, 94, 92, 90, 88, 86, 84, 82, 80, 78, 76, 74, 72, 70];
    const rsiFalling = rsi(falling, 14);
    expect(rsiFalling[13]).toBeNull();
    expect(rsiFalling[14]).toBe(0);

    const mixed = [
      95, 94, 93, 92, 91, 90.5, 91.2, 90.1, 89.4, 88.8, 89.2, 88.5, 88.0, 87.6, 88.1, 87.9,
    ];
    const rsiMixed = rsi(mixed, 14);
    expect(rsiMixed[14]).toBeGreaterThan(0);
    expect(rsiMixed[14]).toBeLessThanOrEqual(36);
  });

  it('computes MACD line, signal line, and histogram', () => {
    const candles = generateScenarioCandles('uptrend', 45);
    const closes = candles.map((c) => c.close);
    const macdSeries = macd(closes, 12, 26, 9);

    expect(macdSeries.length).toBe(45);
    expect(macdSeries[24].macd).toBeNull();
    expect(macdSeries[25].macd).not.toBeNull();
    const last = macdSeries[44];
    expect(last.macd).not.toBeNull();
    expect(last.signal).not.toBeNull();
    expect(last.histogram).toBeCloseTo(last.macd! - last.signal!, 3);
  });
});

describe('Candles & Scenario Generator Library', () => {
  it('enforces OHLC invariants in clampOhlc', () => {
    const clamped = clampOhlc(90, 85, 95, 92);
    expect(clamped.high).toBeGreaterThanOrEqual(Math.max(clamped.open, clamped.close));
    expect(clamped.low).toBeLessThanOrEqual(Math.min(clamped.open, clamped.close));
  });

  it('aggregates candles preserving open, max high, min low, close, and summed volume', () => {
    const raw = generateScenarioCandles('range', 12, 99);
    const agg = aggregateCandles(raw, 6);

    expect(agg.length).toBe(2);
    expect(agg[0].open).toBe(raw[0].open);
    expect(agg[0].close).toBe(raw[5].close);
    expect(agg[0].high).toBe(Math.max(...raw.slice(0, 6).map((c) => c.high)));
    expect(agg[0].low).toBe(Math.min(...raw.slice(0, 6).map((c) => c.low)));
    const expectedVol = raw.slice(0, 6).reduce((s, c) => s + c.volume, 0);
    expect(agg[0].volume).toBe(expectedVol);
  });

  it('produces deterministic output for identical scenario and seed', () => {
    const run1 = generateScenarioCandles('dip-at-support', 30, 42);
    const run2 = generateScenarioCandles('dip-at-support', 30, 42);
    expect(run1).toEqual(run2);

    // Every generated candle satisfies OHLC invariants
    for (const c of run1) {
      expect(c.high).toBeGreaterThanOrEqual(Math.max(c.open, c.close));
      expect(c.low).toBeLessThanOrEqual(Math.min(c.open, c.close));
      expect(c.volume).toBeGreaterThan(0);
    }
  });
});
