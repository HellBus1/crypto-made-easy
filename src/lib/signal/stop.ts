import { SIGNAL_CONSTANTS } from './constants';

/**
 * Rounds a number to a given number of decimal places.
 */
export function roundTo(value: number, decimals = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/**
 * Computes the suggested stop-loss ("Plan Broken") level from FR-3:
 * Default is 2% below the lowest valid support level entered by the user,
 * or `customStopLoss` if explicitly provided.
 */
export function computeStopLoss(
  supports: number[],
  customStopLoss?: number,
  bufferPercent: number = SIGNAL_CONSTANTS.DEFAULT_STOP_BUFFER_PERCENT
): {
  lowestSupport: number;
  stopLossPrice: number;
} {
  const validSupports = supports.filter((s) => Number.isFinite(s) && s > 0);
  const lowestSupport = validSupports.length > 0 ? Math.min(...validSupports) : 0;

  if (customStopLoss !== undefined && Number.isFinite(customStopLoss) && customStopLoss > 0) {
    return {
      lowestSupport,
      stopLossPrice: roundTo(customStopLoss, 4),
    };
  }

  const rawStop = lowestSupport * (1 - bufferPercent);
  // Keep 2 decimals for prices >= 1, or 4 decimals for sub-dollar coins
  const decimals = lowestSupport >= 1 ? 2 : 4;
  return {
    lowestSupport,
    stopLossPrice: roundTo(rawStop, decimals),
  };
}
