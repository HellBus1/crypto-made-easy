import { describe, it, expect } from 'vitest';
import { CANDLE_PRESETS } from '../../src/components/charts/CandleEditor';
import { clampOhlc, aggregateCandles, generateScenarioCandles } from '../../src/lib/candles';
import { computeEssentialSnapshot } from '../../src/lib/indicators';

describe('Phase 3 Chart Components Presets & OHLC Invariants', () => {
  it('defines 4 beginner candlestick presets with valid OHLC geometry', () => {
    expect(CANDLE_PRESETS.length).toBe(4);

    for (const preset of CANDLE_PRESETS) {
      const clamped = clampOhlc(preset.open, preset.high, preset.low, preset.close);
      expect(clamped).toEqual({
        open: preset.open,
        high: preset.high,
        low: preset.low,
        close: preset.close,
      });
      expect(preset.high).toBeGreaterThanOrEqual(Math.max(preset.open, preset.close));
      expect(preset.low).toBeLessThanOrEqual(Math.min(preset.open, preset.close));
    }
  });

  it('clamps OHLC handles when open or close moves outside high/low bounds', () => {
    // Dragging close above current high should push high up automatically
    const pushedHigh = clampOhlc(90, 94, 86, 98);
    expect(pushedHigh.high).toBe(98);
    expect(pushedHigh.close).toBe(98);

    // Dragging open below current low should push low down automatically
    const pushedLow = clampOhlc(82, 94, 86, 91);
    expect(pushedLow.low).toBe(82);
    expect(pushedLow.open).toBe(82);
  });

  it('computes valid 4H and 1D essential snapshots for all 4 MarketChart scenarios', () => {
    const scenarios = ['dip-at-support', 'uptrend', 'range', 'broken-trend'] as const;

    for (const scenario of scenarios) {
      const candles4h = generateScenarioCandles(scenario, 180, 42);
      const candles1d = aggregateCandles(candles4h, 6);

      expect(candles4h.length).toBe(180);
      expect(candles1d.length).toBe(30);

      const snap4h = computeEssentialSnapshot(candles4h);
      const snap1d = computeEssentialSnapshot(candles1d);

      expect(snap4h.currentPrice).toBeGreaterThan(0);
      expect(snap4h.ma30).not.toBeNull();
      expect(snap4h.rsi14).not.toBeNull();
      expect(snap1d.currentPrice).toBeGreaterThan(0);
      expect(snap1d.ma30).not.toBeNull();
      expect(snap1d.rsi14).not.toBeNull();
    }
  });
});
