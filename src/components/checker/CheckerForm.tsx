import { useState, type SyntheticEvent } from 'react';
import {
  evaluateSignal,
  type MacdHistogramState,
  type SignalInput,
  type Timeframe,
  type VolumeState,
} from '../../lib/signal';
import ResultScreen from './ResultScreen';

export interface CheckerFormDraft {
  ticker: string;
  timeframe: Timeframe;
  currentPrice: string;
  ma30: string;
  bollLower: string;
  bollUpper: string;
  rsi: string;
  bidPercent: string;
  support1: string;
  support2: string;
  support3: string;
  resistance1: string;
  resistance2: string;
  macdHistogram: '' | MacdHistogramState;
  volumeState: '' | VolumeState;
  isHolding: boolean;
  averageBuyPrice: string;
  customStopLoss: string;
  customTakeProfit: string;
  totalCapital: string;
}

export const EMPTY_CHECKER_DRAFT: CheckerFormDraft = {
  ticker: '',
  timeframe: '4H',
  currentPrice: '',
  ma30: '',
  bollLower: '',
  bollUpper: '',
  rsi: '',
  bidPercent: '',
  support1: '',
  support2: '',
  support3: '',
  resistance1: '',
  resistance2: '',
  macdHistogram: '',
  volumeState: '',
  isHolding: false,
  averageBuyPrice: '',
  customStopLoss: '',
  customTakeProfit: '',
  totalCapital: '',
};

export interface WorkedPreset {
  id: string;
  label: string;
  tag: string;
  dateNote: string;
  draft: CheckerFormDraft;
}

export const WORKED_EXAMPLE_PRESETS: WorkedPreset[] = [
  {
    id: 'sol-buy-zone',
    label: 'SOL Buy Zone (Worked Example)',
    tag: '3/3 Lights ON',
    dateNote: 'Historical example: 5-6 Nov 2026',
    draft: {
      ticker: 'SOL',
      timeframe: '4H',
      currentPrice: '89.73',
      ma30: '91.60',
      bollLower: '88.90',
      bollUpper: '94.30',
      rsi: '36',
      bidPercent: '40.61',
      support1: '88.50',
      support2: '85.00',
      support3: '81.20',
      resistance1: '95.00',
      resistance2: '99.50',
      macdHistogram: 'red_shrinking',
      volumeState: 'normal',
      isHolding: false,
      averageBuyPrice: '',
      customStopLoss: '',
      customTakeProfit: '',
      totalCapital: '233.77',
    },
  },
  {
    id: 'eth-wait',
    label: 'ETH Sellers Dominate (Wait)',
    tag: 'Light 3 OFF (22% Bid)',
    dateNote: 'Historical example: 5-6 Nov 2026',
    draft: {
      ticker: 'ETH',
      timeframe: '4H',
      currentPrice: '2420',
      ma30: '2490',
      bollLower: '',
      bollUpper: '',
      rsi: '34',
      bidPercent: '22',
      support1: '2400',
      support2: '2320',
      support3: '2250',
      resistance1: '2550',
      resistance2: '',
      macdHistogram: 'red_growing',
      volumeState: 'higher',
      isHolding: false,
      averageBuyPrice: '',
      customStopLoss: '',
      customTakeProfit: '',
      totalCapital: '233.77',
    },
  },
  {
    id: 'sol-take-profit',
    label: 'Holding Near Ceiling (Take Profit)',
    tag: 'Target Reached',
    dateNote: 'Historical example: 5-6 Nov 2026',
    draft: {
      ticker: 'SOL',
      timeframe: '4H',
      currentPrice: '96.20',
      ma30: '91.60',
      bollLower: '',
      bollUpper: '95.80',
      rsi: '74',
      bidPercent: '25',
      support1: '88.50',
      support2: '85.00',
      support3: '81.20',
      resistance1: '95.00',
      resistance2: '99.50',
      macdHistogram: 'green_shrinking',
      volumeState: 'higher',
      isHolding: true,
      averageBuyPrice: '88.50',
      customStopLoss: '',
      customTakeProfit: '',
      totalCapital: '233.77',
    },
  },
  {
    id: 'sol-plan-broken',
    label: 'Floor Cracked (Plan Broken)',
    tag: 'Below Stop-Loss',
    dateNote: 'Historical example: 5-6 Nov 2026',
    draft: {
      ticker: 'SOL',
      timeframe: '4H',
      currentPrice: '79.50',
      ma30: '91.60',
      bollLower: '',
      bollUpper: '',
      rsi: '28',
      bidPercent: '31',
      support1: '88.50',
      support2: '85.00',
      support3: '81.20',
      resistance1: '95.00',
      resistance2: '',
      macdHistogram: 'red_growing',
      volumeState: 'higher',
      isHolding: true,
      averageBuyPrice: '85.00',
      customStopLoss: '',
      customTakeProfit: '',
      totalCapital: '233.77',
    },
  },
];

function parseOptionalPositive(raw: string): number | undefined {
  const trimmed = raw.trim();
  if (trimmed === '') return undefined;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : NaN;
}

function parseRequiredNumber(raw: string, fallbackWhenEmpty: number): number {
  const trimmed = raw.trim();
  if (trimmed === '') return fallbackWhenEmpty;
  return Number(trimmed);
}

export function parseDraftToSignalInput(draft: CheckerFormDraft): SignalInput {
  const supports = [draft.support1, draft.support2, draft.support3]
    .map((s) => s.trim())
    .filter((s) => s !== '')
    .map((s) => Number(s));

  const resistances = [draft.resistance1, draft.resistance2]
    .map((r) => r.trim())
    .filter((r) => r !== '')
    .map((r) => Number(r));

  return {
    ticker: draft.ticker,
    timeframe: draft.timeframe,
    currentPrice: parseRequiredNumber(draft.currentPrice, 0),
    ma30: parseRequiredNumber(draft.ma30, 0),
    bollLower: parseOptionalPositive(draft.bollLower),
    bollUpper: parseOptionalPositive(draft.bollUpper),
    rsi: parseRequiredNumber(draft.rsi, NaN),
    bidPercent: parseRequiredNumber(draft.bidPercent, NaN),
    supports,
    resistances: resistances.length > 0 ? resistances : undefined,
    macdHistogram: draft.macdHistogram || undefined,
    volumeState: draft.volumeState || undefined,
    isHolding: draft.isHolding,
    averageBuyPrice: parseOptionalPositive(draft.averageBuyPrice),
    customStopLoss: parseOptionalPositive(draft.customStopLoss),
    customTakeProfit: parseOptionalPositive(draft.customTakeProfit),
    totalCapital: parseRequiredNumber(draft.totalCapital, 0),
  };
}

export default function CheckerForm() {
  // Stateless by design (FR-7 & Acceptance #6/#9): never reads or writes localStorage.
  // Refreshing the browser clears all inputs back to EMPTY_CHECKER_DRAFT.
  const [draft, setDraft] = useState<CheckerFormDraft>(EMPTY_CHECKER_DRAFT);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [showOptionalContext, setShowOptionalContext] = useState<boolean>(false);

  const parsedInput = parseDraftToSignalInput(draft);
  const evaluation = hasSubmitted ? evaluateSignal(parsedInput) : null;

  const bidNumeric = draft.bidPercent.trim() !== '' ? Number(draft.bidPercent) : null;
  const derivedAskPercent =
    bidNumeric !== null && Number.isFinite(bidNumeric) && bidNumeric >= 0 && bidNumeric <= 100
      ? Math.round((100 - bidNumeric) * 100) / 100
      : null;

  const updateField = <K extends keyof CheckerFormDraft>(key: K, value: CheckerFormDraft[K]) => {
    setActivePresetId(null);
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleLoadPreset = (preset: WorkedPreset) => {
    setActivePresetId(preset.id);
    setDraft({ ...preset.draft });
    setHasSubmitted(true);
  };

  const handleClear = () => {
    setActivePresetId(null);
    setDraft(EMPTY_CHECKER_DRAFT);
    setHasSubmitted(false);
  };

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasSubmitted(true);
  };

  const hasFieldError = (fieldName: string): boolean => {
    if (!evaluation || evaluation.valid) return false;
    return evaluation.errors.some((err) => err.field === fieldName);
  };

  const getFieldErrorMessage = (fieldName: string): string | null => {
    if (!evaluation || evaluation.valid) return null;
    const found = evaluation.errors.find((err) => err.field === fieldName);
    return found ? found.message : null;
  };

  return (
    <div className="checker-workspace" data-ui="checker-form" data-testid="signal-checker-form">
      <div className="surface-card checker-form-card">
        {/* Top Bar: Title + Stateless Privacy Note */}
        <div className="checker-form-card__header">
          <div>
            <div className="checker-form-card__badges">
              <span className="status-pill status-pill--info">
                Manual 3-Light Spot Signal Calculator
              </span>
              <span className="status-pill status-pill--neutral">
                Stateless &amp; Private: Refresh Clears All Inputs
              </span>
            </div>
            <h2 className="checker-form-card__title">
              Enter Your Exchange Numbers (or Load a Worked Example)
            </h2>
            <p className="checker-form-card__sub">
              Copy the numbers from your <strong>Gate.com</strong> or Binance <strong>4H</strong> or{' '}
              <strong>1D</strong> spot chart below, or click a historical worked example to see the
              full 3-Light decision badge and 13% / 21% / 30% / 36% position-sizing plan.
            </p>
          </div>
        </div>

        {/* One-Click Worked Example Presets */}
        <div className="presets-strip" aria-label="Historical worked example presets">
          <div className="presets-strip__top">
            <span className="presets-strip__label">
              Quick-Fill Worked Examples (5-6 Nov 2026 source cases):
            </span>
            <button
              type="button"
              onClick={handleClear}
              className="btn-clear-form"
              data-testid="clear-checker-btn"
            >
              Clear All Inputs
            </button>
          </div>

          <div className="presets-strip__buttons">
            {WORKED_EXAMPLE_PRESETS.map((preset) => {
              const isSelected = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleLoadPreset(preset)}
                  className={`preset-btn ${isSelected ? 'preset-btn--active' : ''}`}
                  data-testid={`preset-btn-${preset.id}`}
                >
                  <div className="preset-btn__title">{preset.label}</div>
                  <div className="preset-btn__meta">
                    <span className="preset-btn__tag">{preset.tag}</span>
                    <span className="preset-btn__date">{preset.dateNote}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Manual Input Form */}
        <form onSubmit={handleSubmit} noValidate className="checker-form">
          {/* Group 1: Coin, Timeframe, Total Budget & Holding Status */}
          <fieldset className="checker-fieldset">
            <legend className="checker-fieldset__legend">
              Step A: Coin, Timeframe &amp; Spot Budget
            </legend>

            <div className="form-grid form-grid--4">
              {/* Coin Ticker */}
              <div className="form-field">
                <label htmlFor="checker-ticker">
                  Coin Ticker <span className="req-star">*</span>
                </label>
                <input
                  id="checker-ticker"
                  name="ticker"
                  type="text"
                  placeholder="e.g. SOL, BTC, ETH"
                  value={draft.ticker}
                  onChange={(e) => updateField('ticker', e.target.value)}
                  aria-invalid={hasFieldError('ticker')}
                  data-testid="input-ticker"
                />
                <span className="field-hint">Top-left of your Gate.com screen (e.g. SOL/USDT)</span>
                {getFieldErrorMessage('ticker') && (
                  <span className="field-error">{getFieldErrorMessage('ticker')}</span>
                )}
              </div>

              {/* Timeframe */}
              <div className="form-field">
                <label htmlFor="checker-timeframe">
                  Chart Timeframe <span className="req-star">*</span>
                </label>
                <select
                  id="checker-timeframe"
                  name="timeframe"
                  value={draft.timeframe}
                  onChange={(e) => updateField('timeframe', e.target.value as Timeframe)}
                  data-testid="input-timeframe"
                >
                  <option value="4H">4H (4-Hour Swing Chart)</option>
                  <option value="1D">1D (Daily Swing Chart)</option>
                </select>
                <span className="field-hint">Use 4H or 1D to filter out 1-minute noise</span>
              </div>

              {/* Total Capital (USDT) */}
              <div className="form-field">
                <label htmlFor="checker-capital">
                  Total Spot Capital (USDT) <span className="req-star">*</span>
                </label>
                <input
                  id="checker-capital"
                  name="totalCapital"
                  type="number"
                  step="any"
                  min="0.01"
                  placeholder="e.g. 233.77"
                  value={draft.totalCapital}
                  onChange={(e) => updateField('totalCapital', e.target.value)}
                  aria-invalid={hasFieldError('totalCapital')}
                  data-testid="input-total-capital"
                />
                <span className="field-hint">Split into 13% / 21% / 30% + 36% cash reserve</span>
                {getFieldErrorMessage('totalCapital') && (
                  <span className="field-error">{getFieldErrorMessage('totalCapital')}</span>
                )}
              </div>

              {/* Holding Toggle */}
              <div className="form-field form-field--checkbox">
                <label className="holding-toggle-label" htmlFor="checker-is-holding">
                  <input
                    id="checker-is-holding"
                    name="isHolding"
                    type="checkbox"
                    checked={draft.isHolding}
                    onChange={(e) => updateField('isHolding', e.target.checked)}
                    data-testid="input-is-holding"
                  />
                  <span>I am already holding this coin</span>
                </label>
                <span className="field-hint">
                  Turn ON to check Hold, Take Profit, or Plan Broken states
                </span>

                {draft.isHolding && (
                  <div style={{ marginTop: '8px' }}>
                    <label htmlFor="checker-avg-buy" style={{ fontSize: '11px', fontWeight: 700 }}>
                      Your Average Buy Price (USDT, optional)
                    </label>
                    <input
                      id="checker-avg-buy"
                      name="averageBuyPrice"
                      type="number"
                      step="any"
                      min="0.0001"
                      placeholder="e.g. 88.50"
                      value={draft.averageBuyPrice}
                      onChange={(e) => updateField('averageBuyPrice', e.target.value)}
                      data-testid="input-avg-buy-price"
                    />
                  </div>
                )}
              </div>
            </div>
          </fieldset>

          {/* Group 2: The 3 Traffic Light Readings */}
          <fieldset className="checker-fieldset">
            <legend className="checker-fieldset__legend">
              Step B: The 3 Traffic Light Numbers from Gate.com
            </legend>

            <div className="form-grid form-grid--4">
              {/* Current Price */}
              <div className="form-field">
                <label htmlFor="checker-current-price">
                  1a. Current Price (USDT) <span className="req-star">*</span>
                </label>
                <input
                  id="checker-current-price"
                  name="currentPrice"
                  type="number"
                  step="any"
                  min="0.0001"
                  placeholder="e.g. 89.73"
                  value={draft.currentPrice}
                  onChange={(e) => updateField('currentPrice', e.target.value)}
                  aria-invalid={hasFieldError('currentPrice')}
                  data-testid="input-current-price"
                />
                <span className="field-hint">Big live price at top-left of chart</span>
                {getFieldErrorMessage('currentPrice') && (
                  <span className="field-error">{getFieldErrorMessage('currentPrice')}</span>
                )}
              </div>

              {/* MA30 */}
              <div className="form-field">
                <label htmlFor="checker-ma30">
                  1b. MA30 Average (USDT) <span className="req-star">*</span>
                </label>
                <input
                  id="checker-ma30"
                  name="ma30"
                  type="number"
                  step="any"
                  min="0.0001"
                  placeholder="e.g. 91.60"
                  value={draft.ma30}
                  onChange={(e) => updateField('ma30', e.target.value)}
                  aria-invalid={hasFieldError('ma30')}
                  data-testid="input-ma30"
                />
                <span className="field-hint">Light 1: Price below MA30 = on discount</span>
                {getFieldErrorMessage('ma30') && (
                  <span className="field-error">{getFieldErrorMessage('ma30')}</span>
                )}
              </div>

              {/* RSI */}
              <div className="form-field">
                <label htmlFor="checker-rsi">
                  2. RSI (0 to 100) <span className="req-star">*</span>
                </label>
                <input
                  id="checker-rsi"
                  name="rsi"
                  type="number"
                  step="any"
                  min="0"
                  max="100"
                  placeholder="e.g. 36"
                  value={draft.rsi}
                  onChange={(e) => updateField('rsi', e.target.value)}
                  aria-invalid={hasFieldError('rsi')}
                  data-testid="input-rsi"
                />
                <span className="field-hint">Light 2: RSI &le; 36 = sellers are tired</span>
                {getFieldErrorMessage('rsi') && (
                  <span className="field-error" data-testid="error-rsi">
                    {getFieldErrorMessage('rsi')}
                  </span>
                )}
              </div>

              {/* Order Book Bid % */}
              <div className="form-field">
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <label htmlFor="checker-bid-percent">
                    3. Order Book Buyer Bid % <span className="req-star">*</span>
                  </label>
                  {derivedAskPercent !== null && (
                    <span className="derived-ask-pill num">Ask: {derivedAskPercent}%</span>
                  )}
                </div>
                <input
                  id="checker-bid-percent"
                  name="bidPercent"
                  type="number"
                  step="any"
                  min="0"
                  max="100"
                  placeholder="e.g. 40.61"
                  value={draft.bidPercent}
                  onChange={(e) => updateField('bidPercent', e.target.value)}
                  aria-invalid={hasFieldError('bidPercent')}
                  data-testid="input-bid-percent"
                />
                <span className="field-hint">
                  Light 3: Bid &ge; 40% = wall of buyers underneath
                </span>
                {getFieldErrorMessage('bidPercent') && (
                  <span className="field-error" data-testid="error-bid-percent">
                    {getFieldErrorMessage('bidPercent')}
                  </span>
                )}
              </div>
            </div>
          </fieldset>

          {/* Group 3: Support Floors & Resistance Ceilings */}
          <fieldset className="checker-fieldset">
            <legend className="checker-fieldset__legend">
              Step C: Support Floors (Entry Tiers) &amp; Resistance Ceilings (Take-Profit)
            </legend>

            <div className="form-grid form-grid--5">
              <div className="form-field">
                <label htmlFor="checker-support-1">
                  Support Floor 1 (USDT) <span className="req-star">*</span>
                </label>
                <input
                  id="checker-support-1"
                  name="support1"
                  type="number"
                  step="any"
                  min="0.0001"
                  placeholder="e.g. 88.50"
                  value={draft.support1}
                  onChange={(e) => updateField('support1', e.target.value)}
                  aria-invalid={hasFieldError('supports')}
                  data-testid="input-support-1"
                />
                <span className="field-hint">Nearest bounce floor (Entry 1 ~13%)</span>
                {getFieldErrorMessage('supports') && (
                  <span className="field-error">{getFieldErrorMessage('supports')}</span>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="checker-support-2">Support Floor 2 (Optional)</label>
                <input
                  id="checker-support-2"
                  name="support2"
                  type="number"
                  step="any"
                  min="0.0001"
                  placeholder="e.g. 85.00"
                  value={draft.support2}
                  onChange={(e) => updateField('support2', e.target.value)}
                  data-testid="input-support-2"
                />
                <span className="field-hint">Deeper bounce floor (Entry 2 ~21%)</span>
              </div>

              <div className="form-field">
                <label htmlFor="checker-support-3">Support Floor 3 (Optional)</label>
                <input
                  id="checker-support-3"
                  name="support3"
                  type="number"
                  step="any"
                  min="0.0001"
                  placeholder="e.g. 81.20"
                  value={draft.support3}
                  onChange={(e) => updateField('support3', e.target.value)}
                  data-testid="input-support-3"
                />
                <span className="field-hint">Lowest floor (Entry 3 ~30% + Stop base)</span>
              </div>

              <div className="form-field">
                <label htmlFor="checker-resistance-1">Resistance Ceiling 1 (Optional)</label>
                <input
                  id="checker-resistance-1"
                  name="resistance1"
                  type="number"
                  step="any"
                  min="0.0001"
                  placeholder="e.g. 95.00"
                  value={draft.resistance1}
                  onChange={(e) => updateField('resistance1', e.target.value)}
                  data-testid="input-resistance-1"
                />
                <span className="field-hint">Nearest stall ceiling (Take-Profit)</span>
              </div>

              <div className="form-field">
                <label htmlFor="checker-resistance-2">Resistance Ceiling 2 (Optional)</label>
                <input
                  id="checker-resistance-2"
                  name="resistance2"
                  type="number"
                  step="any"
                  min="0.0001"
                  placeholder="e.g. 99.50"
                  value={draft.resistance2}
                  onChange={(e) => updateField('resistance2', e.target.value)}
                  data-testid="input-resistance-2"
                />
                <span className="field-hint">Secondary higher target</span>
              </div>
            </div>
          </fieldset>

          {/* Group 4: Optional BOLL, MACD, Volume & Custom Overrides */}
          <div className="optional-context-toggle-wrap">
            <button
              type="button"
              className="btn-toggle-optional"
              onClick={() => setShowOptionalContext((prev) => !prev)}
              aria-expanded={showOptionalContext}
              data-testid="toggle-optional-fields"
            >
              <span>
                {showOptionalContext ? '\u25BC' : '\u25B6'} Step D (Optional): Add Bollinger Bands
                (BOLL), MACD, Volume &amp; Custom Stop/Target
              </span>
              <span className="optional-tag">Optional Supporting Inputs</span>
            </button>

            {showOptionalContext && (
              <div className="optional-context-panel">
                <div className="form-grid form-grid--4">
                  <div className="form-field">
                    <label htmlFor="checker-boll-lower">BOLL Lower Band (LB, USDT)</label>
                    <input
                      id="checker-boll-lower"
                      name="bollLower"
                      type="number"
                      step="any"
                      min="0.0001"
                      placeholder="e.g. 88.90"
                      value={draft.bollLower}
                      onChange={(e) => updateField('bollLower', e.target.value)}
                      data-testid="input-boll-lower"
                    />
                    <span className="field-hint">Alternative Light 1 trigger if price touches</span>
                  </div>

                  <div className="form-field">
                    <label htmlFor="checker-boll-upper">BOLL Upper Band (UB, USDT)</label>
                    <input
                      id="checker-boll-upper"
                      name="bollUpper"
                      type="number"
                      step="any"
                      min="0.0001"
                      placeholder="e.g. 94.30"
                      value={draft.bollUpper}
                      onChange={(e) => updateField('bollUpper', e.target.value)}
                      data-testid="input-boll-upper"
                    />
                    <span className="field-hint">Used for sell-side stretch check</span>
                  </div>

                  <div className="form-field">
                    <label htmlFor="checker-macd">MACD Histogram Direction</label>
                    <select
                      id="checker-macd"
                      name="macdHistogram"
                      value={draft.macdHistogram}
                      onChange={(e) =>
                        updateField('macdHistogram', e.target.value as '' | MacdHistogramState)
                      }
                      data-testid="input-macd"
                    >
                      <option value="">Skip / Not selected</option>
                      <option value="red_shrinking">Red bars shrinking (selling fading)</option>
                      <option value="red_growing">Red bars growing (selling active)</option>
                      <option value="green_growing">Green bars growing (buying building)</option>
                      <option value="green_shrinking">Green bars shrinking (buying slowing)</option>
                    </select>
                    <span className="field-hint">Adds a plain-English supporting note</span>
                  </div>

                  <div className="form-field">
                    <label htmlFor="checker-volume">Volume on Latest Move</label>
                    <select
                      id="checker-volume"
                      name="volumeState"
                      value={draft.volumeState}
                      onChange={(e) =>
                        updateField('volumeState', e.target.value as '' | VolumeState)
                      }
                      data-testid="input-volume"
                    >
                      <option value="">Skip / Not selected</option>
                      <option value="lower">Lower than usual (low conviction)</option>
                      <option value="normal">Normal (typical breathing)</option>
                      <option value="higher">Higher than usual (strong participation)</option>
                    </select>
                    <span className="field-hint">Adds a volume participation note</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Row */}
          <div className="checker-submit-row">
            <button
              type="submit"
              className="btn-primary checker-submit-btn"
              data-testid="submit-checker-btn"
            >
              Check Signal &amp; Calculate Position Plan &rarr;
            </button>
            <span className="checker-submit-note">
              Calculates instantly in your browser. Zero data is saved or sent anywhere.
            </span>
          </div>
        </form>
      </div>

      {/* Render ResultScreen when submitted */}
      {hasSubmitted && evaluation && (
        <ResultScreen
          input={parsedInput}
          evaluation={evaluation}
          onUpdateCustomStop={(newStop) =>
            updateField('customStopLoss', newStop === undefined ? '' : String(newStop))
          }
          onUpdateCustomTakeProfit={(newTp) =>
            updateField('customTakeProfit', newTp === undefined ? '' : String(newTp))
          }
        />
      )}

      <style>{`
        .checker-workspace {
          margin-bottom: var(--space-6);
        }

        .checker-form-card {
          padding: var(--space-6);
        }

        .checker-form-card__header {
          margin-bottom: var(--space-4);
        }

        .checker-form-card__badges {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 8px;
        }

        .checker-form-card__title {
          font-size: var(--font-size-xl);
          margin: 0 0 6px 0;
        }

        .checker-form-card__sub {
          margin: 0;
          font-size: var(--font-size-sm);
          color: var(--color-text-muted);
          max-width: 90ch;
          line-height: 1.5;
        }

        .presets-strip {
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-lg);
          background-color: var(--color-bg-subtle);
          border: 1px solid var(--color-border-default);
          margin-bottom: var(--space-5);
        }

        .presets-strip__top {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: var(--space-3);
        }

        .presets-strip__label {
          font-size: var(--font-size-xs);
          font-weight: 700;
          color: var(--color-text-main);
        }

        .btn-clear-form {
          padding: 4px 10px;
          font-size: 11px;
          font-weight: 600;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-border-control);
          background-color: var(--color-bg-surface);
          color: var(--color-text-muted);
          cursor: pointer;
        }

        .btn-clear-form:hover {
          color: var(--color-text-main);
          border-color: var(--color-text-main);
        }

        .presets-strip__buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          gap: 8px;
        }

        .preset-btn {
          text-align: left;
          padding: 10px 12px;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border-default);
          background-color: var(--color-bg-surface);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .preset-btn--active {
          border: 2px solid var(--color-data-hue);
          background-color: var(--color-data-hue-subtle);
        }

        .preset-btn__title {
          font-size: var(--font-size-xs);
          font-weight: 700;
          color: var(--color-text-main);
        }

        .preset-btn__meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 4px;
          font-size: 10px;
        }

        .preset-btn__tag {
          font-weight: 700;
          color: var(--color-data-hue);
        }

        .preset-btn__date {
          color: var(--color-text-subtle);
        }

        .checker-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .checker-fieldset {
          border: 1px solid var(--color-border-default);
          border-radius: var(--radius-lg);
          padding: var(--space-4);
          margin: 0;
          background-color: var(--color-bg-canvas);
        }

        .checker-fieldset__legend {
          padding: 0 8px;
          font-size: var(--font-size-xs);
          font-weight: 700;
          color: var(--color-data-hue);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-4);
        }

        @media (min-width: 640px) {
          .form-grid--4 {
            grid-template-columns: repeat(2, 1fr);
          }
          .form-grid--5 {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1100px) {
          .form-grid--4 {
            grid-template-columns: repeat(4, 1fr);
          }
          .form-grid--5 {
            grid-template-columns: repeat(5, 1fr);
          }
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .form-field label {
          font-size: var(--font-size-xs);
          font-weight: 700;
          color: var(--color-text-main);
        }

        .req-star {
          color: var(--color-danger);
        }

        .form-field input[type='text'],
        .form-field input[type='number'],
        .form-field select {
          width: 100%;
          height: var(--control-height);
          padding-inline: var(--space-3);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border-control);
          background-color: var(--color-bg-surface);
          color: var(--color-text-main);
          font-size: var(--font-size-sm);
        }

        .form-field input[aria-invalid='true'] {
          border-color: var(--color-danger);
          background-color: var(--color-pill-negative-bg);
        }

        .field-hint {
          font-size: 11px;
          color: var(--color-text-subtle);
          line-height: 1.35;
        }

        .field-error {
          font-size: 11px;
          font-weight: 700;
          color: var(--color-danger);
        }

        .derived-ask-pill {
          font-size: 10px;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: var(--radius-sm);
          background-color: var(--color-bg-subtle);
          border: 1px solid var(--color-border-subtle);
          color: var(--color-text-muted);
        }

        .holding-toggle-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          padding-top: 4px;
        }

        .optional-context-toggle-wrap {
          border: 1px solid var(--color-border-default);
          border-radius: var(--radius-lg);
          background-color: var(--color-bg-canvas);
          overflow: hidden;
        }

        .btn-toggle-optional {
          width: 100%;
          padding: var(--space-3) var(--space-4);
          border: none;
          background-color: transparent;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          cursor: pointer;
          font-size: var(--font-size-xs);
          font-weight: 700;
          color: var(--color-text-main);
          text-align: left;
        }

        .optional-tag {
          font-size: 11px;
          font-weight: 600;
          color: var(--color-text-muted);
        }

        .optional-context-panel {
          padding: 0 var(--space-4) var(--space-4) var(--space-4);
          border-top: 1px solid var(--color-border-subtle);
          padding-top: var(--space-3);
        }

        .checker-submit-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--space-3);
          padding-top: var(--space-2);
        }

        .checker-submit-btn {
          cursor: pointer;
          border: none;
        }

        .checker-submit-note {
          font-size: var(--font-size-xs);
          color: var(--color-text-subtle);
        }
      `}</style>
    </div>
  );
}
