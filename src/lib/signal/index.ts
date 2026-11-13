export { SIGNAL_CONSTANTS } from './constants';
export type {
  Timeframe,
  MacdHistogramState,
  VolumeState,
  MarketStructure,
  MarketContextCaution,
  SignalState,
  SignalInput,
  ValidationIssue,
  LightEvaluation,
  LadderTranche,
  PositionPlan,
  SignalEvaluation,
} from './types';
export { validateSignalInput } from './validate';
export { evaluateLights } from './lights';
export { computeStopLoss, roundTo } from './stop';
export { buildPositionPlan } from './ladder';
export { evaluateSignal, buildSupportingNotes } from './state';
