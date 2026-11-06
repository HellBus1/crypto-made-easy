/**
 * Signal Checker Constants & Thresholds
 * Single source of truth for the 3-Light checklist, mirrored sell rules,
 * stop-loss buffer, and 3-tier position-sizing ladder ratios.
 */

export const SIGNAL_CONSTANTS = {
  /** Light 2 (Buy): RSI at or below 36 indicates sellers are running out of steam */
  BUY_RSI_MAX: 36,

  /** Light 3 (Buy): Order book Bid % at or above 40% indicates strong buyer wall below */
  BUY_BID_MIN_PERCENT: 40,

  /** Borderline Bid % threshold noted in source document (35% to 40%) */
  BUY_BID_BORDERLINE_PERCENT: 35,

  /** Mirrored Sell Light 2: RSI strictly above 70 indicates overheated buying */
  SELL_RSI_MIN: 70,

  /** Mirrored Sell Light 3: Bid % strictly below 30% indicates thin buyer support */
  SELL_BID_MAX_PERCENT: 30,

  /** Number of mirrored sell lights required to trigger Take Profit when holding */
  SELL_LIGHTS_REQUIRED: 2,

  /** Default stop-loss buffer below the lowest support level (2%) */
  DEFAULT_STOP_BUFFER_PERCENT: 0.02,

  /** Fallback take-profit target above Entry 1 when no resistance level is supplied (+8%) */
  DEFAULT_TAKE_PROFIT_FALLBACK_PERCENT: 0.08,

  /**
   * Worked example reference capital from source document (233.77 USDT -> 30 / 50 / 70 / 83.77)
   * Used so 233.77 USDT produces exact 30.00 / 50.00 / 70.00 / 83.77 tranches while general
   * capital amounts follow the ~13% / ~21% / ~30% / ~36% split and always sum to 100%.
   */
  REFERENCE_CAPITAL_USDT: 233.77,
  LADDER_WEIGHTS: {
    entry1: 30 / 233.77,
    entry2: 50 / 233.77,
    entry3: 70 / 233.77,
    reserve: 83.77 / 233.77,
  },
  LADDER_NOMINAL_PERCENT: {
    entry1: 13,
    entry2: 21,
    entry3: 30,
    reserve: 36,
  },
} as const;
