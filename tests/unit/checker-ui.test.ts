import { describe, it, expect } from 'vitest';
import {
  EMPTY_CHECKER_DRAFT,
  WORKED_EXAMPLE_PRESETS,
  parseDraftToSignalInput,
} from '../../src/components/checker/CheckerForm';
import { evaluateSignal } from '../../src/lib/signal';

describe('Phase 4 Signal Checker Form & Presets', () => {
  it('starts with an empty draft so fresh loads and page refreshes contain no stored inputs', () => {
    expect(EMPTY_CHECKER_DRAFT.ticker).toBe('');
    expect(EMPTY_CHECKER_DRAFT.currentPrice).toBe('');
    expect(EMPTY_CHECKER_DRAFT.ma30).toBe('');
    expect(EMPTY_CHECKER_DRAFT.rsi).toBe('');
    expect(EMPTY_CHECKER_DRAFT.bidPercent).toBe('');
    expect(EMPTY_CHECKER_DRAFT.support1).toBe('');
    expect(EMPTY_CHECKER_DRAFT.totalCapital).toBe('');

    const emptyEval = evaluateSignal(parseDraftToSignalInput(EMPTY_CHECKER_DRAFT));
    expect(emptyEval.valid).toBe(false);
    expect(emptyEval.plan).toBeNull();
  });

  it('evaluates all 4 worked example presets into BUY_ZONE, WAIT_HOLD, TAKE_PROFIT, and PLAN_BROKEN', () => {
    const solBuy = WORKED_EXAMPLE_PRESETS.find((p) => p.id === 'sol-buy-zone')!;
    const solBuyEval = evaluateSignal(parseDraftToSignalInput(solBuy.draft));
    expect(solBuyEval.valid).toBe(true);
    expect(solBuyEval.state).toBe('BUY_ZONE');
    expect(solBuyEval.buyLightsCount).toBe(3);
    expect(solBuyEval.plan?.tranches[0].amountUsdt).toBe(30);
    expect(solBuyEval.plan?.tranches[1].amountUsdt).toBe(50);
    expect(solBuyEval.plan?.tranches[2].amountUsdt).toBe(70);
    expect(solBuyEval.plan?.cashReserveUsdt).toBe(83.77);

    const ethWait = WORKED_EXAMPLE_PRESETS.find((p) => p.id === 'eth-wait')!;
    const ethWaitEval = evaluateSignal(parseDraftToSignalInput(ethWait.draft));
    expect(ethWaitEval.valid).toBe(true);
    expect(ethWaitEval.state).toBe('WAIT_HOLD');
    expect(ethWaitEval.lights[2].buyOn).toBe(false);
    expect(ethWaitEval.askPercent).toBe(78);

    const solTp = WORKED_EXAMPLE_PRESETS.find((p) => p.id === 'sol-take-profit')!;
    const solTpEval = evaluateSignal(parseDraftToSignalInput(solTp.draft));
    expect(solTpEval.valid).toBe(true);
    expect(solTpEval.state).toBe('TAKE_PROFIT');

    const solBroken = WORKED_EXAMPLE_PRESETS.find((p) => p.id === 'sol-plan-broken')!;
    const solBrokenEval = evaluateSignal(parseDraftToSignalInput(solBroken.draft));
    expect(solBrokenEval.valid).toBe(true);
    expect(solBrokenEval.state).toBe('PLAN_BROKEN');
  });

  it('blocks plan generation when RSI is 120 and reports an RSI validation error', () => {
    const solBuy = WORKED_EXAMPLE_PRESETS.find((p) => p.id === 'sol-buy-zone')!;
    const invalidDraft = { ...solBuy.draft, rsi: '120' };
    const result = evaluateSignal(parseDraftToSignalInput(invalidDraft));

    expect(result.valid).toBe(false);
    expect(result.plan).toBeNull();
    expect(result.errors.some((e) => e.field === 'rsi')).toBe(true);
  });

  it('supports custom stop-loss and custom take-profit overrides', () => {
    const solBuy = WORKED_EXAMPLE_PRESETS.find((p) => p.id === 'sol-buy-zone')!;
    const customDraft = {
      ...solBuy.draft,
      customStopLoss: '78.00',
      customTakeProfit: '102.00',
    };
    const result = evaluateSignal(parseDraftToSignalInput(customDraft));

    expect(result.valid).toBe(true);
    expect(result.plan?.stopLossPrice).toBe(78);
    expect(result.plan?.takeProfitPrice).toBe(102);
  });
});
