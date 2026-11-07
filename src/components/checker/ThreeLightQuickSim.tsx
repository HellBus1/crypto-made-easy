import { useState } from 'react';
import { evaluateSignal, type SignalInput } from '../../lib/signal';

interface PresetCase {
  id: string;
  title: string;
  tag: string;
  description: string;
  input: SignalInput;
}

const PRESETS: PresetCase[] = [
  {
    id: 'sol-buy',
    title: 'Example 1: SOL in Buy Zone',
    tag: 'All 3 Lights ON',
    description:
      'Real example from the PRD: SOL is below MA30 ($89.73 vs $91.60), RSI is 36.0 (sellers tired), and Order Book Buyers are 40.61% (buyer wall waiting below).',
    input: {
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
    },
  },
  {
    id: 'eth-wait',
    title: 'Example 2: ETH Falling Knife (Wait)',
    tag: 'Light 3 OFF (22% Buyers)',
    description:
      'ETH looks cheap below MA30 and RSI is 34, BUT Order Book Buyers are only 22% (78% Sellers). Light 3 stays OFF and saves you from buying too early!',
    input: {
      ticker: 'ETH',
      timeframe: '4H',
      currentPrice: 2420,
      ma30: 2490,
      rsi: 34,
      bidPercent: 22,
      supports: [2400, 2320, 2250],
      resistances: [2550],
      macdHistogram: 'red_growing',
      volumeState: 'higher',
      isHolding: false,
      totalCapital: 233.77,
    },
  },
  {
    id: 'sol-profit',
    title: 'Example 3: Holding Near Ceiling (Take Profit)',
    tag: 'Target Reached',
    description:
      'You already bought SOL earlier and price rallied to $96.20 (above your $95.00 Resistance Ceiling) while RSI overheated to 74.',
    input: {
      ticker: 'SOL',
      timeframe: '4H',
      currentPrice: 96.2,
      ma30: 91.6,
      bollUpper: 95.8,
      rsi: 74,
      bidPercent: 25,
      supports: [88.5, 85.0, 81.2],
      resistances: [95.0, 99.5],
      isHolding: true,
      averageBuyPrice: 88.5,
      totalCapital: 233.77,
    },
  },
  {
    id: 'sol-broken',
    title: 'Example 4: Floor Cracked (Plan Broken)',
    tag: 'Below Stop-Loss',
    description:
      'You are holding SOL, and price dropped to $79.50 (below your pre-agreed $79.58 Stop-Loss, which is 2% under lowest support $81.20).',
    input: {
      ticker: 'SOL',
      timeframe: '4H',
      currentPrice: 79.5,
      ma30: 91.6,
      rsi: 28,
      bidPercent: 31,
      supports: [88.5, 85.0, 81.2],
      resistances: [95.0, 99.5],
      isHolding: true,
      averageBuyPrice: 85.0,
      totalCapital: 233.77,
    },
  },
];

export default function ThreeLightQuickSim() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('sol-buy');
  const [stateInput, setStateInput] = useState<SignalInput>(PRESETS[0].input);

  const selectPreset = (preset: PresetCase) => {
    setSelectedPresetId(preset.id);
    setStateInput({ ...preset.input });
  };

  const evaluation = evaluateSignal(stateInput);

  const badgePillClass =
    evaluation.state === 'BUY_ZONE'
      ? 'status-pill status-pill--positive'
      : evaluation.state === 'TAKE_PROFIT'
        ? 'status-pill status-pill--info'
        : evaluation.state === 'PLAN_BROKEN'
          ? 'status-pill status-pill--negative'
          : 'status-pill status-pill--warning';

  return (
    <div className="sim-box" data-ui="three-light-quick-sim">
      <div className="sim-box__header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="status-pill status-pill--info">Interactive 3-Light Engine Demo</span>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-subtle)' }}>
              Click a real scenario or drag the sliders below
            </span>
          </div>
          <h2 className="sim-box__title">
            Test the 3-Light Signal Engine &amp; Budget Splitter Live
          </h2>
          <p className="sim-box__subtitle">
            Pick one of the 4 real-world scenarios below, then adjust RSI, Buyer Bid %, or your USDT
            budget to watch how the decision badge and 3-tier order plan respond.
          </p>
        </div>
      </div>

      <div className="sim-box__body">
        {/* 4 Scenario Preset Buttons */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-3)',
            marginBottom: 'var(--space-5)',
          }}
        >
          {PRESETS.map((preset) => {
            const active = preset.id === selectedPresetId;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => selectPreset(preset)}
                style={{
                  textAlign: 'left',
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-lg)',
                  border: active
                    ? '2px solid var(--color-data-hue)'
                    : '1px solid var(--color-border-default)',
                  backgroundColor: active
                    ? 'var(--color-data-hue-subtle)'
                    : 'var(--color-bg-surface)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '6px',
                  }}
                >
                  <strong
                    style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-main)' }}
                  >
                    {preset.title}
                  </strong>
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--color-data-hue)',
                  }}
                >
                  {preset.tag}
                </span>
                <span
                  style={{ fontSize: '11px', color: 'var(--color-text-muted)', lineHeight: 1.4 }}
                >
                  {preset.description}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main 2-Column Simulator Area */}
        <div className="quick-sim-grid">
          {/* Left: Interactive Sliders & Toggles */}
          <div
            style={{
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-default)',
              backgroundColor: 'var(--color-bg-canvas)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: 'var(--font-size-base)', margin: 0 }}>
                Adjust Chart Readings ({stateInput.ticker}/USDT)
              </h3>
              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={Boolean(stateInput.isHolding)}
                  onChange={(e) => {
                    setSelectedPresetId('custom');
                    setStateInput({ ...stateInput, isHolding: e.target.checked });
                  }}
                />
                <span>Already Holding Coin?</span>
              </label>
            </div>

            {/* Control 1: Current Price vs MA30 */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 'var(--font-size-xs)',
                  marginBottom: '4px',
                }}
              >
                <span>
                  <strong>1. Current Price</strong> (vs MA30 Average:{' '}
                  <code className="num">${stateInput.ma30}</code>)
                </span>
                <strong className="num">${stateInput.currentPrice} USDT</strong>
              </div>
              <input
                type="range"
                min={Math.round(stateInput.ma30 * 0.84 * 100) / 100}
                max={Math.round(stateInput.ma30 * 1.08 * 100) / 100}
                step={stateInput.ma30 > 500 ? 5 : 0.25}
                value={stateInput.currentPrice}
                onChange={(e) => {
                  setSelectedPresetId('custom');
                  setStateInput({ ...stateInput, currentPrice: Number(e.target.value) });
                }}
                style={{ width: '100%', cursor: 'pointer' }}
                aria-label="Current Price"
              />
              <div style={{ fontSize: '11px', color: 'var(--color-text-subtle)' }}>
                Light 1 turns ON when Current Price is below MA30 (${stateInput.ma30}).
              </div>
            </div>

            {/* Control 2: RSI (0-100) */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 'var(--font-size-xs)',
                  marginBottom: '4px',
                }}
              >
                <span>
                  <strong>2. RSI Momentum Meter</strong> (0 to 100)
                </span>
                <strong className="num">{stateInput.rsi} / 100</strong>
              </div>
              <input
                type="range"
                min={10}
                max={90}
                step={1}
                value={stateInput.rsi}
                onChange={(e) => {
                  setSelectedPresetId('custom');
                  setStateInput({ ...stateInput, rsi: Number(e.target.value) });
                }}
                style={{ width: '100%', cursor: 'pointer' }}
                aria-label="RSI Momentum"
              />
              <div style={{ fontSize: '11px', color: 'var(--color-text-subtle)' }}>
                Light 2 turns ON at <strong>36 or lower</strong> (sellers tired). Above 70 =
                overheated.
              </div>
            </div>

            {/* Control 3: Order Book Buyer Bid % */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 'var(--font-size-xs)',
                  marginBottom: '4px',
                }}
              >
                <span>
                  <strong>3. Order Book Buyer Bid %</strong> (Sellers Ask: {evaluation.askPercent}%)
                </span>
                <strong className="num">{stateInput.bidPercent}% Buyers</strong>
              </div>
              <input
                type="range"
                min={10}
                max={80}
                step={1}
                value={stateInput.bidPercent}
                onChange={(e) => {
                  setSelectedPresetId('custom');
                  setStateInput({ ...stateInput, bidPercent: Number(e.target.value) });
                }}
                style={{ width: '100%', cursor: 'pointer' }}
                aria-label="Order Book Buyer Bid Percentage"
              />
              <div style={{ fontSize: '11px', color: 'var(--color-text-subtle)' }}>
                Light 3 turns ON at <strong>40% or higher</strong> (real buyer wall waiting below).
              </div>
            </div>

            {/* Control 4: Total Capital (USDT) */}
            <div>
              <label
                htmlFor="quick-sim-capital"
                style={{
                  display: 'block',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 700,
                  marginBottom: '4px',
                }}
              >
                4. Your Total Spot Budget (USDT)
              </label>
              <input
                id="quick-sim-capital"
                type="number"
                min={10}
                step={10}
                value={stateInput.totalCapital}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val > 0) {
                    setSelectedPresetId('custom');
                    setStateInput({ ...stateInput, totalCapital: val });
                  }
                }}
                style={{
                  width: '100%',
                  height: 'var(--control-height)',
                  paddingInline: 'var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border-control)',
                  backgroundColor: 'var(--color-bg-surface)',
                  color: 'var(--color-text-main)',
                  fontSize: 'var(--font-size-sm)',
                }}
              />
            </div>
          </div>

          {/* Right: Live Result Badge, 3 Lights Status, and Split-Entry Plan */}
          <div
            style={{
              padding: 'var(--space-5)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-default)',
              backgroundColor: 'var(--color-bg-surface)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
            }}
          >
            {/* 1. Signal Badge */}
            <div
              style={{
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-bg-subtle)',
                border: '1px solid var(--color-border-default)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  marginBottom: '6px',
                }}
              >
                <span className={badgePillClass} style={{ fontSize: 'var(--font-size-sm)' }}>
                  {evaluation.badgeLabel}
                </span>
                <span className="num" style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700 }}>
                  {evaluation.buyLightsCount} / 3 Buy Lights ON
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 'var(--font-size-sm)' }}>
                {evaluation.summaryReason}
              </p>
            </div>

            {/* 2. The 3 Lights Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {evaluation.lights.map((light) => (
                <div
                  key={light.id}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-subtle)',
                    backgroundColor: 'var(--color-bg-canvas)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '10px',
                    fontSize: 'var(--font-size-xs)',
                  }}
                >
                  <div>
                    <strong>
                      Light {light.id}: {light.name} ({light.meaning})
                    </strong>
                    <div style={{ color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      {light.detail}
                    </div>
                  </div>
                  <span
                    className={
                      light.buyOn
                        ? 'status-pill status-pill--positive'
                        : 'status-pill status-pill--neutral'
                    }
                  >
                    {light.buyOn ? 'ON' : 'OFF'}
                  </span>
                </div>
              ))}
            </div>

            {/* 3. Split-Entry Plan Summary */}
            {evaluation.plan && (
              <div
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-bg-subtle)',
                  border: '1px solid var(--color-border-subtle)',
                  fontSize: 'var(--font-size-xs)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: 700,
                    marginBottom: '8px',
                  }}
                >
                  <span>3-Step Split-Entry Plan ({evaluation.plan.totalCapital} USDT)</span>
                  <span className="num" style={{ color: 'var(--color-danger)' }}>
                    Stop-Loss: ${evaluation.plan.stopLossPrice}
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '8px',
                  }}
                >
                  {evaluation.plan.tranches.map((t) => (
                    <div
                      key={t.tier}
                      style={{
                        padding: '8px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--color-bg-surface)',
                        border: '1px solid var(--color-border-default)',
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '11px' }}>
                        Buy {t.tier} ({t.nominalSharePercent}%)
                      </div>
                      <div
                        className="num"
                        style={{ fontWeight: 700, color: 'var(--color-data-hue)' }}
                      >
                        ${t.amountUsdt.toFixed(2)} USDT
                      </div>
                      <div
                        className="num"
                        style={{ fontSize: '11px', color: 'var(--color-text-subtle)' }}
                      >
                        Limit @ ${t.limitPrice}
                      </div>
                    </div>
                  ))}

                  <div
                    style={{
                      padding: '8px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--color-pill-positive-bg)',
                      border: '1px solid var(--color-pill-positive-border)',
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: '11px',
                        color: 'var(--color-pill-positive-ink)',
                      }}
                    >
                      Safe Reserve (36%)
                    </div>
                    <div
                      className="num"
                      style={{ fontWeight: 700, color: 'var(--color-pill-positive-ink)' }}
                    >
                      ${evaluation.plan.cashReserveUsdt.toFixed(2)} USDT
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-pill-positive-ink)' }}>
                      Keep in wallet
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .quick-sim-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-4);
        }
        @media (min-width: 1024px) {
          .quick-sim-grid {
            grid-template-columns: 0.95fr 1.05fr;
            align-items: start;
          }
        }
      `}</style>
    </div>
  );
}
