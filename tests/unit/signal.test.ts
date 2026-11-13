import { describe, it, expect } from 'vitest';
import {
  evaluateSignal,
  evaluateLights,
  buildPositionPlan,
  computeStopLoss,
  validateSignalInput,
  type SignalInput,
} from '../../src/lib/signal';

const baseSolInput: SignalInput = {
  ticker: 'SOL',
  timeframe: '4H',
  currentPrice: 89.73,
  ma30: 91.6,
  rsi: 36,
  bidPercent: 40.61,
  supports: [88.5, 85.0, 81.2],
  resistances: [95.0, 99.5],
  macdHistogram: 'red_shrinking',
  volumeState: 'normal',
  isHolding: false,
  totalCapital: 233.77,
};

describe('Signal Checker Logic (FR-1 to FR-5)', () => {
  it('Acceptance #1: SOL (price 89.73, MA30 91.60, RSI 36, Bid 40.61%, not holding) -> All 3 lights on, BUY_ZONE', () => {
    const result = evaluateSignal(baseSolInput);

    expect(result.valid).toBe(true);
    expect(result.buyLightsCount).toBe(3);
    expect(result.lights[0].buyOn).toBe(true);
    expect(result.lights[1].buyOn).toBe(true);
    expect(result.lights[2].buyOn).toBe(true);
    expect(result.state).toBe('BUY_ZONE');
    expect(result.badgeLabel).toBe('Buy Zone');
    expect(result.plan).not.toBeNull();
    expect(result.plan!.tranches[0].nominalSharePercent).toBe(13);
    expect(result.plan!.remainingCashAfterEntry1Percent).toBe(87);
  });

  it('Acceptance #2: ETH with Bid 22% (Ask 78%) and other lights on -> Light 3 off, WAIT_HOLD, sellers dominate message', () => {
    const ethInput: SignalInput = {
      ...baseSolInput,
      ticker: 'ETH',
      currentPrice: 2420,
      ma30: 2490,
      rsi: 34,
      bidPercent: 22,
      supports: [2400, 2320, 2250],
      resistances: [2550],
    };

    const result = evaluateSignal(ethInput);

    expect(result.valid).toBe(true);
    expect(result.lights[0].buyOn).toBe(true);
    expect(result.lights[1].buyOn).toBe(true);
    expect(result.lights[2].buyOn).toBe(false);
    expect(result.askPercent).toBe(78);
    expect(result.state).toBe('WAIT_HOLD');
    expect(result.summaryReason).toContain('Sellers still dominate the order book');
  });

  it('Acceptance #3: Capital 233.77 USDT -> Ladder equals 30 / 50 / 70 USDT with 83.77 USDT reserve', () => {
    const plan = buildPositionPlan(baseSolInput);

    expect(plan.tranches[0].amountUsdt).toBe(30);
    expect(plan.tranches[1].amountUsdt).toBe(50);
    expect(plan.tranches[2].amountUsdt).toBe(70);
    expect(plan.cashReserveUsdt).toBe(83.77);

    const sum =
      plan.tranches[0].amountUsdt +
      plan.tranches[1].amountUsdt +
      plan.tranches[2].amountUsdt +
      plan.cashReserveUsdt;
    expect(sum).toBeCloseTo(233.77, 2);
  });

  it('Acceptance #4: Holding, price at or below the stop level -> PLAN_BROKEN with pre-planned exit message', () => {
    const { stopLossPrice } = computeStopLoss(baseSolInput.supports);
    // Lowest support is 81.20 -> 2% below is 79.58
    expect(stopLossPrice).toBe(79.58);

    const brokenInput: SignalInput = {
      ...baseSolInput,
      currentPrice: 79.5,
      isHolding: true,
      averageBuyPrice: 85.0,
    };

    const result = evaluateSignal(brokenInput);
    expect(result.valid).toBe(true);
    expect(result.state).toBe('PLAN_BROKEN');
    expect(result.badgeLabel).toBe('Plan Broken');
    expect(result.summaryReason).toContain('The reason you bought no longer holds');
    expect(result.whatToDo[0]).toContain('Follow your pre-set exit');
  });

  it('Acceptance #5: RSI entered as 120 -> Validation error, no plan returned', () => {
    const invalidInput: SignalInput = {
      ...baseSolInput,
      rsi: 120,
    };

    const result = evaluateSignal(invalidInput);
    expect(result.valid).toBe(false);
    expect(result.plan).toBeNull();
    expect(result.errors.some((e) => e.field === 'rsi')).toBe(true);
  });

  it('Edge case: Light 1 turns on via Bollinger lower band even when price >= MA30', () => {
    const lightsResult = evaluateLights({
      currentPrice: 92.0,
      ma30: 91.5,
      bollLower: 92.1,
      rsi: 35,
      bidPercent: 45,
    });

    expect(lightsResult.lights[0].buyOn).toBe(true);
    expect(lightsResult.buyLightsCount).toBe(3);
  });

  it('Edge case: Support level above current price emits a gentle warning without blocking evaluation', () => {
    const warningInput: SignalInput = {
      ...baseSolInput,
      currentPrice: 89.73,
      supports: [90.5, 85.0, 81.2],
    };

    const validation = validateSignalInput(warningInput);
    expect(validation.valid).toBe(true);
    expect(validation.warnings.some((w) => w.field === 'supports')).toBe(true);

    const result = evaluateSignal(warningInput);
    expect(result.valid).toBe(true);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it('Edge case: Holding when mirrored sell lights activate or take-profit target is reached -> TAKE_PROFIT', () => {
    const takeProfitInput: SignalInput = {
      ...baseSolInput,
      currentPrice: 96.2,
      ma30: 91.6,
      bollUpper: 95.8,
      rsi: 74,
      bidPercent: 25,
      isHolding: true,
      averageBuyPrice: 88.5,
    };

    const result = evaluateSignal(takeProfitInput);
    expect(result.valid).toBe(true);
    expect(result.state).toBe('TAKE_PROFIT');
    expect(result.sellLightsCount).toBe(3);
  });

  it('Market Context Caution: flags BTC sharp drop (<= -5%) and multi-day crash without mutating the 3 lights', () => {
    const crashInput: SignalInput = {
      ...baseSolInput,
      btc24hChange: -7.2,
      marketStructure: 'downtrend_crash',
    };

    const result = evaluateSignal(crashInput);
    expect(result.valid).toBe(true);
    expect(result.buyLightsCount).toBe(3);
    expect(result.state).toBe('BUY_ZONE');
    expect(result.marketContextCaution).not.toBeNull();
    expect(result.marketContextCaution?.triggered).toBe(true);
    expect(result.marketContextCaution?.reason).toContain('BTC dropped -7.2%');
    expect(result.marketContextCaution?.reason).toContain('falling knives');
  });

  it('Market Context Caution: returns null when BTC is calm (-1.2%) and structure is healthy', () => {
    const calmInput: SignalInput = {
      ...baseSolInput,
      btc24hChange: -1.2,
      marketStructure: 'uptrend_or_range',
    };

    const result = evaluateSignal(calmInput);
    expect(result.valid).toBe(true);
    expect(result.marketContextCaution).toBeNull();
  });

  it('Validation: rejects out-of-range btc24hChange (< -100 or > 1000)', () => {
    const invalidBtc = evaluateSignal({
      ...baseSolInput,
      btc24hChange: -150,
    });
    expect(invalidBtc.valid).toBe(false);
    expect(invalidBtc.errors.some((e) => e.field === 'btc24hChange')).toBe(true);
  });
});
