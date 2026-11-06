import type { SignalInput, ValidationIssue } from './types';

/**
 * Validates SignalInput according to FR-1 rules:
 * - Ticker must be non-empty.
 * - RSI and Bid % must be within 0 to 100.
 * - Prices and totalCapital must be strictly greater than 0.
 * - At least 1 valid support level is required.
 * - If a support level is above the current price, emits a gentle warning rather than blocking.
 */
export function validateSignalInput(input: SignalInput): {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
} {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  if (!input.ticker || input.ticker.trim().length === 0) {
    errors.push({
      field: 'ticker',
      message: 'Enter a coin ticker symbol (for example BTC, ETH, or SOL).',
      severity: 'error',
    });
  }

  if (!Number.isFinite(input.currentPrice) || input.currentPrice <= 0) {
    errors.push({
      field: 'currentPrice',
      message: 'Current price must be greater than 0 USDT.',
      severity: 'error',
    });
  }

  if (!Number.isFinite(input.ma30) || input.ma30 <= 0) {
    errors.push({
      field: 'ma30',
      message: 'MA30 must be greater than 0 USDT.',
      severity: 'error',
    });
  }

  if (
    input.bollLower !== undefined &&
    (!Number.isFinite(input.bollLower) || input.bollLower <= 0)
  ) {
    errors.push({
      field: 'bollLower',
      message: 'Bollinger lower band must be greater than 0 USDT when provided.',
      severity: 'error',
    });
  }

  if (
    input.bollUpper !== undefined &&
    (!Number.isFinite(input.bollUpper) || input.bollUpper <= 0)
  ) {
    errors.push({
      field: 'bollUpper',
      message: 'Bollinger upper band must be greater than 0 USDT when provided.',
      severity: 'error',
    });
  }

  if (
    input.bollLower !== undefined &&
    input.bollUpper !== undefined &&
    input.bollLower >= input.bollUpper
  ) {
    errors.push({
      field: 'bollUpper',
      message: 'Bollinger upper band must be higher than the lower band.',
      severity: 'error',
    });
  }

  if (!Number.isFinite(input.rsi) || input.rsi < 0 || input.rsi > 100) {
    errors.push({
      field: 'rsi',
      message: 'RSI must be between 0 and 100.',
      severity: 'error',
    });
  }

  if (!Number.isFinite(input.bidPercent) || input.bidPercent < 0 || input.bidPercent > 100) {
    errors.push({
      field: 'bidPercent',
      message: 'Order book Bid % must be between 0 and 100.',
      severity: 'error',
    });
  }

  const validSupports = (input.supports || []).filter((s) => Number.isFinite(s) && s > 0);
  if (validSupports.length === 0) {
    errors.push({
      field: 'supports',
      message: 'Enter at least one support level greater than 0 USDT.',
      severity: 'error',
    });
  } else if ((input.supports || []).some((s) => !Number.isFinite(s) || s <= 0)) {
    errors.push({
      field: 'supports',
      message: 'All entered support levels must be greater than 0 USDT.',
      severity: 'error',
    });
  }

  if (input.resistances && input.resistances.some((r) => !Number.isFinite(r) || r <= 0)) {
    errors.push({
      field: 'resistances',
      message: 'All entered resistance levels must be greater than 0 USDT.',
      severity: 'error',
    });
  }

  if (!Number.isFinite(input.totalCapital) || input.totalCapital <= 0) {
    errors.push({
      field: 'totalCapital',
      message: 'Total capital must be greater than 0 USDT.',
      severity: 'error',
    });
  }

  if (
    input.isHolding &&
    input.averageBuyPrice !== undefined &&
    (!Number.isFinite(input.averageBuyPrice) || input.averageBuyPrice <= 0)
  ) {
    errors.push({
      field: 'averageBuyPrice',
      message: 'Average buy price must be greater than 0 USDT when holding.',
      severity: 'error',
    });
  }

  if (
    input.customStopLoss !== undefined &&
    (!Number.isFinite(input.customStopLoss) || input.customStopLoss <= 0)
  ) {
    errors.push({
      field: 'customStopLoss',
      message: 'Custom stop-loss must be greater than 0 USDT.',
      severity: 'error',
    });
  }

  if (
    input.customTakeProfit !== undefined &&
    (!Number.isFinite(input.customTakeProfit) || input.customTakeProfit <= 0)
  ) {
    errors.push({
      field: 'customTakeProfit',
      message: 'Custom take-profit must be greater than 0 USDT.',
      severity: 'error',
    });
  }

  // Non-blocking gentle warnings
  if (
    Number.isFinite(input.currentPrice) &&
    input.currentPrice > 0 &&
    validSupports.some((s) => s > input.currentPrice)
  ) {
    warnings.push({
      field: 'supports',
      message:
        'One or more support levels are above the current price. Support floors usually sit below current price.',
      severity: 'warning',
    });
  }

  const validResistances = (input.resistances || []).filter((r) => Number.isFinite(r) && r > 0);
  if (
    Number.isFinite(input.currentPrice) &&
    input.currentPrice > 0 &&
    validResistances.some((r) => r < input.currentPrice)
  ) {
    warnings.push({
      field: 'resistances',
      message:
        'One or more resistance levels are below the current price. Resistance ceilings usually sit above current price.',
      severity: 'warning',
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
