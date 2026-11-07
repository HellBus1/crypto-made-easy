import { SIGNAL_CONSTANTS } from './constants';
import { buildPositionPlan } from './ladder';
import { evaluateLights } from './lights';
import { roundTo } from './stop';
import type { SignalEvaluation, SignalInput, SignalState } from './types';
import { validateSignalInput } from './validate';

/**
 * Generates plain-language supporting notes from MACD, volume, and support/resistance distance
 * without altering the primary 3-Light signal state (FR-2).
 */
export function buildSupportingNotes(
  input: SignalInput,
  stopLossPrice: number,
  takeProfitPrice: number
): string[] {
  const notes: string[] = [];

  if (input.macdHistogram === 'red_shrinking') {
    notes.push('MACD histogram: Red bars are shrinking, showing selling momentum is fading.');
  } else if (input.macdHistogram === 'red_growing') {
    notes.push('MACD histogram: Red bars are growing, showing downward pressure is still active.');
  } else if (input.macdHistogram === 'green_growing') {
    notes.push('MACD histogram: Green bars are growing, showing upward momentum is building.');
  } else if (input.macdHistogram === 'green_shrinking') {
    notes.push(
      'MACD histogram: Green bars are shrinking, showing buying momentum is slowing down.'
    );
  }

  if (input.volumeState === 'higher') {
    notes.push(
      'Volume: Higher than usual on the latest move, showing strong participation behind price.'
    );
  } else if (input.volumeState === 'lower') {
    notes.push('Volume: Lower than usual, showing low conviction; watch for fakeouts.');
  } else if (input.volumeState === 'normal') {
    notes.push('Volume: In line with recent candles, showing normal market breathing.');
  }

  const validSupports = input.supports.filter((s) => Number.isFinite(s) && s > 0);
  if (validSupports.length > 0 && input.currentPrice > 0) {
    const nearestSupport = [...validSupports].sort(
      (a, b) => Math.abs(input.currentPrice - a) - Math.abs(input.currentPrice - b)
    )[0];
    const distPct = roundTo(((input.currentPrice - nearestSupport) / input.currentPrice) * 100, 2);
    notes.push(
      `Nearest support (${nearestSupport} USDT) is ${Math.abs(distPct)}% ${distPct >= 0 ? 'below' : 'above'} current price.`
    );
  }

  if (stopLossPrice > 0 && input.currentPrice > 0) {
    const stopDistPct = roundTo(
      ((input.currentPrice - stopLossPrice) / input.currentPrice) * 100,
      2
    );
    notes.push(
      `Pre-planned stop-loss (${stopLossPrice} USDT) sits ${stopDistPct}% relative to current price.`
    );
  }

  if (takeProfitPrice > 0 && input.currentPrice > 0) {
    const tpDistPct = roundTo(
      ((takeProfitPrice - input.currentPrice) / input.currentPrice) * 100,
      2
    );
    notes.push(
      `Take-profit target (${takeProfitPrice} USDT) is ${tpDistPct >= 0 ? `+${tpDistPct}%` : `${tpDistPct}%`} from current price.`
    );
  }

  return notes;
}

/**
 * Evaluates the full SignalInput and returns one of the four states from FR-2:
 * - BUY_ZONE: All 3 buy lights on, user not holding.
 * - PLAN_BROKEN: User is holding and currentPrice <= stopLossPrice.
 * - TAKE_PROFIT: User is holding and (currentPrice >= takeProfitPrice OR sellLightsCount >= 2).
 * - WAIT_HOLD: Any other valid state (1-2 lights on when not holding, or holding safely above stop).
 */
export function evaluateSignal(input: SignalInput): SignalEvaluation {
  const validation = validateSignalInput(input);
  const { lights, buyLightsCount, sellLightsCount, askPercent } = evaluateLights(input);

  if (!validation.valid) {
    return {
      valid: false,
      errors: validation.errors,
      warnings: validation.warnings,
      state: 'WAIT_HOLD',
      badgeLabel: 'Invalid Input',
      summaryReason: 'Fix the highlighted input fields above to calculate your signal and plan.',
      whatToDo: ['Check that RSI and Bid % are between 0 and 100 and all prices are above 0.'],
      whatNotToDo: ['Do not place any order until your chart readings are verified.'],
      lights,
      buyLightsCount,
      sellLightsCount,
      askPercent,
      plan: null,
      supportingNotes: [],
    };
  }

  const plan = buildPositionPlan(input);
  const supportingNotes = buildSupportingNotes(input, plan.stopLossPrice, plan.takeProfitPrice);

  let state: SignalState = 'WAIT_HOLD';
  let badgeLabel = 'Wait / Hold';
  let summaryReason = '';
  let whatToDo: string[] = [];
  let whatNotToDo: string[] = [];

  const isHolding = Boolean(input.isHolding);

  if (isHolding && input.currentPrice <= plan.stopLossPrice) {
    state = 'PLAN_BROKEN';
    badgeLabel = 'Plan Broken';
    summaryReason = `Price (${input.currentPrice} USDT) has reached or fallen below your pre-set stop-loss (${plan.stopLossPrice} USDT). The reason you bought no longer holds.`;
    whatToDo = [
      `Follow your pre-set exit at ${plan.stopLossPrice} USDT on the ${input.timeframe} timeframe instead of hoping.`,
      `Keep your remaining ${plan.cashReserveUsdt} USDT (${plan.cashReservePercent}%) cash reserve untouched in USDT.`,
    ];
    whatNotToDo = [
      'Do not move your stop-loss lower or deploy your emergency cash reserve into a broken floor.',
      'Do not revenge-trade immediately after exiting.',
    ];
  } else if (
    isHolding &&
    (input.currentPrice >= plan.takeProfitPrice ||
      sellLightsCount >= SIGNAL_CONSTANTS.SELL_LIGHTS_REQUIRED)
  ) {
    state = 'TAKE_PROFIT';
    badgeLabel = 'Take Profit / Sell';
    const hitTarget = input.currentPrice >= plan.takeProfitPrice;
    summaryReason = hitTarget
      ? `Price (${input.currentPrice} USDT) has reached your take-profit target (${plan.takeProfitPrice} USDT).`
      : `${sellLightsCount} of 3 sell-side warning lights are active while you hold ${input.ticker.toUpperCase()}.`;
    whatToDo = [
      `Consider placing a Sell Limit near ${plan.takeProfitPrice} USDT to lock in gains calmly.`,
      'Move your stop-loss up to breakeven if you choose to hold a partial runner.',
    ];
    whatNotToDo = [
      'Do not chase price higher or add new buy orders above MA30 / upper Bollinger Band.',
      'Do not let an overheated rally round-trip back below your entry price.',
    ];
  } else if (!isHolding && buyLightsCount === 3) {
    state = 'BUY_ZONE';
    badgeLabel = 'Buy Zone';
    summaryReason = `All 3 buy lights are on for ${input.ticker.toUpperCase()} (${input.timeframe}): price is on discount, RSI (${input.rsi}) shows sellers are tired, and Bid (${input.bidPercent}%) shows a buyer wall below.`;
    whatToDo = [
      `Place a Buy Limit for Entry 1 (${plan.tranches[0].amountUsdt} USDT at ${plan.tranches[0].limitPrice} USDT, ~${plan.tranches[0].nominalSharePercent}% of capital).`,
      `Set resting Buy Limits for Entry 2 (${plan.tranches[1].limitPrice} USDT) and Entry 3 (${plan.tranches[2].limitPrice} USDT) and define your stop at ${plan.stopLossPrice} USDT.`,
      `Remember: you still hold ${plan.remainingCashAfterEntry1Percent}% of your capital in USDT after Entry 1.`,
    ];
    whatNotToDo = [
      'Do not go all-in on Entry 1 or spend your 36% cash reserve.',
      'Do not use a Market order if spread is wide; let price come to your Limit order.',
    ];
  } else {
    state = 'WAIT_HOLD';
    badgeLabel = isHolding ? 'Hold / Wait' : 'Wait';
    const offLights = lights.filter((l) => !l.buyOn);
    const offReasons = offLights.map((l) => `Light ${l.id} (${l.name}): ${l.detail}`).join(' ');

    if (isHolding) {
      summaryReason = `You are holding ${input.ticker.toUpperCase()} above your stop-loss (${plan.stopLossPrice} USDT) and below your take-profit target (${plan.takeProfitPrice} USDT).`;
      whatToDo = [
        'Do nothing urgent. Let the trade breathe while price remains above your stop-loss.',
        `Keep your ${plan.cashReserveUsdt} USDT (${plan.cashReservePercent}%) cash reserve and resting limit orders in place.`,
      ];
      whatNotToDo = [
        `Do not panic sell a normal 5% to 7% market pullback while price stays above ${plan.stopLossPrice} USDT.`,
        'Do not check the 1-minute or 5-minute chart.',
      ];
    } else {
      summaryReason = `${buyLightsCount} of 3 buy lights are on for ${input.ticker.toUpperCase()} (${input.timeframe}). ${offReasons}`;
      whatToDo = [
        'Do nothing urgent. Keep your capital safely in USDT and wait for all 3 lights to align.',
        `If you prepare orders in advance, place resting Buy Limits only at deep support (${plan.tranches[0].limitPrice} / ${plan.tranches[1].limitPrice} USDT).`,
      ];
      whatNotToDo = [
        'Do not force a trade when sellers still dominate the order book or price is above MA30.',
        'Do not chase green candles out of fear of missing out.',
      ];
    }
  }

  return {
    valid: true,
    errors: [],
    warnings: validation.warnings,
    state,
    badgeLabel,
    summaryReason,
    whatToDo,
    whatNotToDo,
    lights,
    buyLightsCount,
    sellLightsCount,
    askPercent,
    plan,
    supportingNotes,
  };
}
