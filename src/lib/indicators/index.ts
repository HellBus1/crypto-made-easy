import { roundTo } from '../signal/stop';
import type { Candle } from '../candles';

export interface BollingerPoint {
  middle: number | null;
  upper: number | null;
  lower: number | null;
}

export interface MacdPoint {
  macd: number | null;
  signal: number | null;
  histogram: number | null;
}

export interface EssentialIndicatorSnapshot {
  currentPrice: number;
  ma30: number | null;
  bollUpper: number | null;
  bollMiddle: number | null;
  bollLower: number | null;
  rsi14: number | null;
  latestVolume: number;
  avgVolume10: number;
  volumeState: 'higher' | 'normal' | 'lower';
}

/**
 * Simple Moving Average (SMA) over `period` values.
 * Returns `null` for indices prior to `period - 1`.
 */
export function sma(values: number[], period: number): (number | null)[] {
  if (period <= 0) {
    throw new Error('Period must be greater than 0');
  }
  const result: (number | null)[] = [];
  let windowSum = 0;

  for (let i = 0; i < values.length; i++) {
    windowSum += values[i];
    if (i >= period) {
      windowSum -= values[i - period];
    }
    if (i >= period - 1) {
      result.push(roundTo(windowSum / period, 4));
    } else {
      result.push(null);
    }
  }

  return result;
}

/**
 * Exponential Moving Average (EMA) seeded with the SMA of the first `period` values.
 */
export function ema(values: number[], period: number): (number | null)[] {
  if (period <= 0) {
    throw new Error('Period must be greater than 0');
  }
  const result: (number | null)[] = new Array(values.length).fill(null);
  if (values.length < period) {
    return result;
  }

  const k = 2 / (period + 1);
  let sum = 0;
  for (let i = 0; i < period; i++) {
    sum += values[i];
  }

  let prevEma = sum / period;
  result[period - 1] = roundTo(prevEma, 4);

  for (let i = period; i < values.length; i++) {
    prevEma = values[i] * k + prevEma * (1 - k);
    result[i] = roundTo(prevEma, 4);
  }

  return result;
}

/**
 * Bollinger Bands (BOLL): middle band is SMA(period), upper/lower bands are ±stdDevMultiplier * population standard deviation.
 */
export function bollinger(values: number[], period = 20, stdDevMultiplier = 2): BollingerPoint[] {
  if (period <= 0) {
    throw new Error('Period must be greater than 0');
  }

  return values.map((_, idx) => {
    if (idx < period - 1) {
      return { middle: null, upper: null, lower: null };
    }
    const slice = values.slice(idx - period + 1, idx + 1);
    const mean = slice.reduce((acc, v) => acc + v, 0) / period;
    const variance = slice.reduce((acc, v) => acc + (v - mean) ** 2, 0) / period;
    const stdDev = Math.sqrt(variance);

    return {
      middle: roundTo(mean, 4),
      upper: roundTo(mean + stdDevMultiplier * stdDev, 4),
      lower: roundTo(mean - stdDevMultiplier * stdDev, 4),
    };
  });
}

/**
 * Wilder's Relative Strength Index (RSI), default period 14.
 * Returns values in [0, 100], or `null` for the first `period` elements.
 */
export function rsi(values: number[], period = 14): (number | null)[] {
  if (period <= 0) {
    throw new Error('Period must be greater than 0');
  }
  const result: (number | null)[] = new Array(values.length).fill(null);
  if (values.length <= period) {
    return result;
  }

  let gainSum = 0;
  let lossSum = 0;

  for (let i = 1; i <= period; i++) {
    const diff = values[i] - values[i - 1];
    if (diff >= 0) {
      gainSum += diff;
    } else {
      lossSum += Math.abs(diff);
    }
  }

  let avgGain = gainSum / period;
  let avgLoss = lossSum / period;

  const computeRsiValue = (gain: number, loss: number): number => {
    if (loss === 0) return 100;
    if (gain === 0) return 0;
    const rs = gain / loss;
    return roundTo(100 - 100 / (1 + rs), 2);
  };

  result[period] = computeRsiValue(avgGain, avgLoss);

  for (let i = period + 1; i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? Math.abs(diff) : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    result[i] = computeRsiValue(avgGain, avgLoss);
  }

  return result;
}

/**
 * Moving Average Convergence Divergence (MACD), default (12, 26, 9).
 */
export function macd(
  values: number[],
  fastPeriod = 12,
  slowPeriod = 26,
  signalPeriod = 9
): MacdPoint[] {
  const fastEma = ema(values, fastPeriod);
  const slowEma = ema(values, slowPeriod);

  const macdLine: (number | null)[] = values.map((_, idx) => {
    const f = fastEma[idx];
    const s = slowEma[idx];
    if (f === null || s === null) return null;
    return roundTo(f - s, 4);
  });

  // Extract valid MACD values to compute signal EMA
  const validIndices: number[] = [];
  const validMacdValues: number[] = [];
  macdLine.forEach((val, idx) => {
    if (val !== null) {
      validIndices.push(idx);
      validMacdValues.push(val);
    }
  });

  const validSignalEma = ema(validMacdValues, signalPeriod);
  const signalLine: (number | null)[] = new Array(values.length).fill(null);

  validIndices.forEach((origIdx, i) => {
    signalLine[origIdx] = validSignalEma[i];
  });

  return values.map((_, idx) => {
    const m = macdLine[idx];
    const s = signalLine[idx];
    const h = m !== null && s !== null ? roundTo(m - s, 4) : null;
    return {
      macd: m,
      signal: s,
      histogram: h,
    };
  });
}

/**
 * Computes the beginner-essential indicator snapshot (MA30, BOLL(20,2), RSI(14), and Volume comparison)
 * for the latest candle in a series.
 */
export function computeEssentialSnapshot(candles: Candle[]): EssentialIndicatorSnapshot {
  if (candles.length === 0) {
    throw new Error('Candles array must not be empty');
  }

  const closes = candles.map((c) => c.close);
  const lastIdx = candles.length - 1;
  const currentPrice = closes[lastIdx];

  const ma30Period = Math.min(30, Math.max(5, closes.length));
  const maSeries = sma(closes, ma30Period);
  const bollPeriod = Math.min(20, Math.max(5, closes.length));
  const bollSeries = bollinger(closes, bollPeriod, 2);
  const rsiPeriod = Math.min(14, Math.max(3, closes.length - 1));
  const rsiSeries = rsi(closes, rsiPeriod);

  const latestVolume = candles[lastIdx].volume;
  const volSlice = candles.slice(Math.max(0, candles.length - 10));
  const avgVolume10 = roundTo(volSlice.reduce((sum, c) => sum + c.volume, 0) / volSlice.length, 0);

  let volumeState: 'higher' | 'normal' | 'lower' = 'normal';
  if (latestVolume >= avgVolume10 * 1.25) {
    volumeState = 'higher';
  } else if (latestVolume <= avgVolume10 * 0.75) {
    volumeState = 'lower';
  }

  return {
    currentPrice,
    ma30: maSeries[lastIdx] !== null ? roundTo(maSeries[lastIdx]!, 2) : null,
    bollUpper: bollSeries[lastIdx]?.upper !== null ? roundTo(bollSeries[lastIdx].upper!, 2) : null,
    bollMiddle:
      bollSeries[lastIdx]?.middle !== null ? roundTo(bollSeries[lastIdx].middle!, 2) : null,
    bollLower: bollSeries[lastIdx]?.lower !== null ? roundTo(bollSeries[lastIdx].lower!, 2) : null,
    rsi14: rsiSeries[lastIdx] !== null ? roundTo(rsiSeries[lastIdx]!, 1) : null,
    latestVolume,
    avgVolume10,
    volumeState,
  };
}
