import { describe, it, expect } from 'vitest';
import { CANDLE_PRESETS } from '../../src/components/charts/CandleEditor';
import { clampOhlc } from '../../src/lib/candles';

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
});
