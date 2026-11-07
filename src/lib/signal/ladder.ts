import { SIGNAL_CONSTANTS } from './constants';
import { computeStopLoss, roundTo } from './stop';
import type { LadderTranche, PositionPlan, SignalInput } from './types';

/**
 * Computes the 3-tier split-entry ladder, unspent cash reserve, stop-loss,
 * and take-profit target from FR-4:
 * - Default capital split: ~13% / ~21% / ~30% / ~36% cash reserve
 *   (calibrated to the source worked example: 233.77 USDT -> 30 / 50 / 70 / 83.77 USDT).
 * - Entry limit prices default to the sorted support levels (or stepped 3% below if fewer than 3 supports are entered).
 * - Reconciles rounded USDT amounts so Entry 1 + Entry 2 + Entry 3 + Cash Reserve === totalCapital.
 */
export function buildPositionPlan(
  input: Pick<
    SignalInput,
    | 'currentPrice'
    | 'supports'
    | 'resistances'
    | 'totalCapital'
    | 'customStopLoss'
    | 'customTakeProfit'
  >
): PositionPlan {
  const { currentPrice, supports, resistances, totalCapital, customStopLoss, customTakeProfit } =
    input;

  // Sort supports descending (highest support = Entry 1 floor, lower supports = Entry 2 and Entry 3)
  const sortedSupports = [...supports]
    .filter((s) => Number.isFinite(s) && s > 0)
    .sort((a, b) => b - a);

  const priceDecimals = currentPrice >= 1 ? 2 : 4;
  const s1 = sortedSupports[0] ?? roundTo(currentPrice * 0.98, priceDecimals);
  const s2 = sortedSupports[1] ?? roundTo(s1 * 0.96, priceDecimals);
  const s3 = sortedSupports[2] ?? roundTo(s2 * 0.96, priceDecimals);

  // Compute USDT amounts with penny-exact reconciliation
  const entry1Usdt = roundTo(totalCapital * SIGNAL_CONSTANTS.LADDER_WEIGHTS.entry1, 2);
  const entry2Usdt = roundTo(totalCapital * SIGNAL_CONSTANTS.LADDER_WEIGHTS.entry2, 2);
  const entry3Usdt = roundTo(totalCapital * SIGNAL_CONSTANTS.LADDER_WEIGHTS.entry3, 2);
  const totalAllocatedUsdt = roundTo(entry1Usdt + entry2Usdt + entry3Usdt, 2);
  const cashReserveUsdt = roundTo(totalCapital - totalAllocatedUsdt, 2);

  const makeTranche = (
    tier: 1 | 2 | 3,
    label: string,
    nominalSharePercent: number,
    limitPrice: number,
    amountUsdt: number
  ): LadderTranche => {
    const estimatedQuantity = limitPrice > 0 ? roundTo(amountUsdt / limitPrice, 4) : 0;
    const actualSharePercent = totalCapital > 0 ? roundTo((amountUsdt / totalCapital) * 100, 1) : 0;
    return {
      tier,
      label,
      nominalSharePercent,
      actualSharePercent,
      limitPrice: roundTo(limitPrice, priceDecimals),
      amountUsdt,
      estimatedQuantity,
    };
  };

  const t1 = makeTranche(
    1,
    'Entry 1 (Support 1)',
    SIGNAL_CONSTANTS.LADDER_NOMINAL_PERCENT.entry1,
    s1,
    entry1Usdt
  );
  const t2 = makeTranche(
    2,
    'Entry 2 (Support 2)',
    SIGNAL_CONSTANTS.LADDER_NOMINAL_PERCENT.entry2,
    s2,
    entry2Usdt
  );
  const t3 = makeTranche(
    3,
    'Entry 3 (Support 3)',
    SIGNAL_CONSTANTS.LADDER_NOMINAL_PERCENT.entry3,
    s3,
    entry3Usdt
  );

  // Compute exact unrounded quantity sum to derive true average buy price if all 3 tiers fill
  const rawQty =
    (s1 > 0 ? entry1Usdt / s1 : 0) +
    (s2 > 0 ? entry2Usdt / s2 : 0) +
    (s3 > 0 ? entry3Usdt / s3 : 0);
  const totalEstimatedQuantity = roundTo(
    t1.estimatedQuantity + t2.estimatedQuantity + t3.estimatedQuantity,
    4
  );
  const allFilledAveragePrice =
    rawQty > 0 ? roundTo(totalAllocatedUsdt / rawQty, priceDecimals) : 0;

  // Stop-loss calculation
  const { stopLossPrice } = computeStopLoss(sortedSupports, customStopLoss);
  const stopLossDistanceFromAvgPercent =
    allFilledAveragePrice > 0
      ? roundTo(((stopLossPrice - allFilledAveragePrice) / allFilledAveragePrice) * 100, 2)
      : 0;

  // Take-profit calculation: nearest resistance above Entry 1, or custom, or +8% fallback
  const validResistances = (resistances ?? [])
    .filter((r) => Number.isFinite(r) && r > 0)
    .sort((a, b) => a - b);
  const nearestResistance = validResistances.find((r) => r > s1) ?? validResistances[0];

  const defaultTp =
    nearestResistance ??
    roundTo(s1 * (1 + SIGNAL_CONSTANTS.DEFAULT_TAKE_PROFIT_FALLBACK_PERCENT), priceDecimals);
  const takeProfitPrice =
    customTakeProfit !== undefined && Number.isFinite(customTakeProfit) && customTakeProfit > 0
      ? roundTo(customTakeProfit, priceDecimals)
      : roundTo(defaultTp, priceDecimals);

  const takeProfitGainFromEntry1Percent =
    s1 > 0 ? roundTo(((takeProfitPrice - s1) / s1) * 100, 2) : 0;

  const cashReservePercent =
    totalCapital > 0 ? roundTo((cashReserveUsdt / totalCapital) * 100, 1) : 0;
  const remainingCashAfterEntry1Percent =
    totalCapital > 0 ? Math.round(((totalCapital - entry1Usdt) / totalCapital) * 100) : 0;

  return {
    totalCapital: roundTo(totalCapital, 2),
    tranches: [t1, t2, t3],
    cashReserveUsdt,
    cashReservePercent,
    remainingCashAfterEntry1Percent,
    totalAllocatedUsdt,
    totalEstimatedQuantity,
    allFilledAveragePrice,
    stopLossPrice,
    stopLossDistanceFromAvgPercent,
    takeProfitPrice,
    takeProfitGainFromEntry1Percent,
  };
}
