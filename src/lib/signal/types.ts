/**
 * Signal Checker Types
 * Data structures for manual chart inputs, validation, 3-Light evaluations,
 * position-sizing ladder tranches, and complete result states.
 */

export type Timeframe = '4H' | '1D';

export type MacdHistogramState =
  'red_shrinking' | 'red_growing' | 'green_growing' | 'green_shrinking';

export type VolumeState = 'lower' | 'normal' | 'higher';

export type MarketStructure = 'uptrend_or_range' | 'unclear' | 'downtrend_crash';

export type SignalState = 'BUY_ZONE' | 'WAIT_HOLD' | 'TAKE_PROFIT' | 'PLAN_BROKEN';

export interface SignalInput {
  ticker: string;
  timeframe: Timeframe;
  currentPrice: number;
  ma30: number;
  bollLower?: number;
  bollUpper?: number;
  rsi: number;
  bidPercent: number;
  supports: number[];
  resistances?: number[];
  macdHistogram?: MacdHistogramState;
  volumeState?: VolumeState;
  btc24hChange?: number;
  marketStructure?: MarketStructure;
  isHolding?: boolean;
  averageBuyPrice?: number;
  customStopLoss?: number;
  customTakeProfit?: number;
  totalCapital: number;
}

export interface ValidationIssue {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface LightEvaluation {
  id: 1 | 2 | 3;
  name: string;
  buyOn: boolean;
  sellOn: boolean;
  meaning: string;
  detail: string;
}

export interface LadderTranche {
  tier: 1 | 2 | 3;
  label: string;
  nominalSharePercent: number;
  actualSharePercent: number;
  limitPrice: number;
  amountUsdt: number;
  estimatedQuantity: number;
}

export interface PositionPlan {
  totalCapital: number;
  tranches: [LadderTranche, LadderTranche, LadderTranche];
  cashReserveUsdt: number;
  cashReservePercent: number;
  remainingCashAfterEntry1Percent: number;
  totalAllocatedUsdt: number;
  totalEstimatedQuantity: number;
  allFilledAveragePrice: number;
  stopLossPrice: number;
  stopLossDistanceFromAvgPercent: number;
  takeProfitPrice: number;
  takeProfitGainFromEntry1Percent: number;
}

export interface MarketContextCaution {
  triggered: boolean;
  headline: string;
  reason: string;
}

export interface SignalEvaluation {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  state: SignalState;
  badgeLabel: string;
  summaryReason: string;
  whatToDo: string[];
  whatNotToDo: string[];
  lights: [LightEvaluation, LightEvaluation, LightEvaluation];
  buyLightsCount: number;
  sellLightsCount: number;
  askPercent: number;
  plan: PositionPlan | null;
  supportingNotes: string[];
  marketContextCaution: MarketContextCaution | null;
}
