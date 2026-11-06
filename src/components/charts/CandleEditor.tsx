import React, { useState, useId } from 'react';
import { clampOhlc } from '../../lib/candles';
import { roundTo } from '../../lib/signal/stop';

export interface CandlePreset {
  id: string;
  name: string;
  open: number;
  high: number;
  low: number;
  close: number;
  summary: string;
  psychology: string;
}

export const CANDLE_PRESETS: CandlePreset[] = [
  {
    id: 'hammer',
    name: 'Support Hammer (Buyer Absorption)',
    open: 89.2,
    high: 90.3,
    low: 86.4,
    close: 90.0,
    summary: 'Small upper body with a long lower wick at a support floor.',
    psychology:
      'Sellers pushed price down to 86.40 USDT, but resting buy limit orders absorbed the selling and drove the close back up to 90.00 USDT.',
  },
  {
    id: 'shooting-star',
    name: 'Overhead Rejection (Long Upper Wick)',
    open: 94.2,
    high: 96.8,
    low: 93.7,
    close: 93.9,
    summary: 'Long upper wick near resistance with a close below the open.',
    psychology:
      'Buyers chased price to 96.80 USDT, where sellers took profit and forced the candle to close down at 93.90 USDT.',
  },
  {
    id: 'marubozu',
    name: 'Full-Body Conviction (Marubozu)',
    open: 88.5,
    high: 92.6,
    low: 88.4,
    close: 92.4,
    summary: 'Tall bullish body with almost no upper or lower wick.',
    psychology: 'Buyers controlled the entire 4H session from open to close without hesitation.',
  },
  {
    id: 'doji',
    name: 'Equilibrium (Doji)',
    open: 91.0,
    high: 92.8,
    low: 89.2,
    close: 91.05,
    summary: 'Open and close are nearly identical with wicks on both sides.',
    psychology:
      'Neither buyers nor sellers won the session. Wait for the next candle and check Order Book Bid %.',
  },
];

const MIN_PRICE = 84;
const MAX_PRICE = 98;
const SVG_HEIGHT = 280;
const SVG_PAD_TOP = 24;
const SVG_PAD_BOTTOM = 24;
const PLOT_HEIGHT = SVG_HEIGHT - SVG_PAD_TOP - SVG_PAD_BOTTOM;

function priceToY(price: number): number {
  const ratio = (MAX_PRICE - price) / (MAX_PRICE - MIN_PRICE);
  return SVG_PAD_TOP + Math.max(0, Math.min(1, ratio)) * PLOT_HEIGHT;
}

function yToPrice(y: number): number {
  const clampedY = Math.max(SVG_PAD_TOP, Math.min(SVG_HEIGHT - SVG_PAD_BOTTOM, y));
  const ratio = (clampedY - SVG_PAD_TOP) / PLOT_HEIGHT;
  return roundTo(MAX_PRICE - ratio * (MAX_PRICE - MIN_PRICE), 2);
}

export default function CandleEditor() {
  const baseId = useId();
  const [presetId, setPresetId] = useState<string>(CANDLE_PRESETS[0].id);
  const [ohlc, setOhlc] = useState({
    open: CANDLE_PRESETS[0].open,
    high: CANDLE_PRESETS[0].high,
    low: CANDLE_PRESETS[0].low,
    close: CANDLE_PRESETS[0].close,
  });
  const [draggingHandle, setDraggingHandle] = useState<'open' | 'high' | 'low' | 'close' | null>(
    null
  );

  const updateField = (field: 'open' | 'high' | 'low' | 'close', rawValue: number) => {
    const bounded = Math.max(MIN_PRICE, Math.min(MAX_PRICE, rawValue));
    const next = { ...ohlc, [field]: bounded };

    // If user drags Open or Close past High/Low, expand High/Low automatically so handle moves smoothly
    if (field === 'open' || field === 'close') {
      next.high = Math.max(next.high, bounded);
      next.low = Math.min(next.low, bounded);
    }

    setOhlc(clampOhlc(next.open, next.high, next.low, next.close));
    setPresetId('custom');
  };

  const applyPreset = (preset: CandlePreset) => {
    setPresetId(preset.id);
    setOhlc({
      open: preset.open,
      high: preset.high,
      low: preset.low,
      close: preset.close,
    });
  };

  const handleSvgPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draggingHandle) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleY = SVG_HEIGHT / rect.height;
    const localY = (e.clientY - rect.top) * scaleY;
    updateField(draggingHandle, yToPrice(localY));
  };

  const isBullish = ohlc.close >= ohlc.open;
  const bodyTopPrice = Math.max(ohlc.open, ohlc.close);
  const bodyBottomPrice = Math.min(ohlc.open, ohlc.close);
  const bodySize = roundTo(bodyTopPrice - bodyBottomPrice, 2);
  const upperWickSize = roundTo(ohlc.high - bodyTopPrice, 2);
  const lowerWickSize = roundTo(bodyBottomPrice - ohlc.low, 2);
  const totalRange = roundTo(ohlc.high - ohlc.low, 2);

  const yHigh = priceToY(ohlc.high);
  const yLow = priceToY(ohlc.low);
  const yBodyTop = priceToY(bodyTopPrice);
  const yBodyBottom = priceToY(bodyBottomPrice);
  const bodyHeight = Math.max(4, yBodyBottom - yBodyTop);

  let dynamicInterpretation =
    'Balanced session with moderate body and wicks. Check where this candle sits relative to support and MA30.';
  if (lowerWickSize > bodySize * 1.5 && lowerWickSize > upperWickSize) {
    dynamicInterpretation =
      'Long lower wick (Buying Absorption): Sellers drove price down to the low, but buyers stepped in aggressively and pushed the close back up.';
  } else if (upperWickSize > bodySize * 1.5 && upperWickSize > lowerWickSize) {
    dynamicInterpretation =
      'Long upper wick (Selling Rejection): Buyers pushed price to the session high, but sellers rejected the advance before the close.';
  } else if (bodySize <= 0.25 && totalRange >= 1.5) {
    dynamicInterpretation =
      'Doji (Indecision): Open and close are nearly equal after a wide battle between buyers and sellers.';
  } else if (bodySize >= totalRange * 0.75 && totalRange >= 1.5) {
    dynamicInterpretation = isBullish
      ? 'Strong Bullish Body: Buyers controlled the session from open to close with minimal wick rejection.'
      : 'Strong Bearish Body: Sellers controlled the session from open to close; wait for support stabilization.';
  }

  const gridTicks = [98, 95, 92, 89, 86];

  return (
    <div data-ui="candle-editor" className="surface-card" style={{ marginBlock: 'var(--space-6)' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-2)',
          marginBottom: 'var(--space-4)',
        }}
      >
        <div>
          <h3 style={{ margin: 0 }}>Interactive Candlestick Sculptor (OHLC)</h3>
          <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)', margin: 0 }}>
            Drag the High, Open, Close, or Low handles on the chart or use the sliders below.
          </p>
        </div>
        <span
          className={`status-pill ${isBullish ? 'status-pill--positive' : 'status-pill--negative'}`}
        >
          {isBullish ? '+ Bullish (Close ≥ Open)' : '− Bearish (Close < Open)'}
        </span>
      </div>

      {/* Preset Selector Row */}
      <div
        role="group"
        aria-label="Candlestick pattern presets"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--space-2)',
          marginBottom: 'var(--space-4)',
        }}
      >
        {CANDLE_PRESETS.map((preset) => {
          const active = presetId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset)}
              aria-pressed={active}
              style={{
                height: '32px',
                paddingInline: 'var(--space-3)',
                fontSize: 'var(--font-size-xs)',
                fontWeight: active ? 600 : 400,
                backgroundColor: active ? 'var(--color-brand-primary)' : 'var(--color-bg-surface)',
                color: active ? 'var(--color-brand-primary-text)' : 'var(--color-text-main)',
                border: '1px solid var(--color-border-control)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
              }}
            >
              {preset.name}
            </button>
          );
        })}
      </div>

      {/* Main Split: SVG Canvas + Controls */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 'var(--space-4)',
          alignItems: 'start',
        }}
      >
        {/* Interactive SVG Diagram */}
        <div
          style={{
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-bg-canvas)',
            padding: 'var(--space-2)',
          }}
        >
          <svg
            viewBox={`0 0 360 ${SVG_HEIGHT}`}
            width="100%"
            height={SVG_HEIGHT}
            role="img"
            aria-label={`Candlestick diagram: Open ${ohlc.open}, High ${ohlc.high}, Low ${ohlc.low}, Close ${ohlc.close} USDT`}
            onPointerMove={handleSvgPointerMove}
            onPointerUp={() => setDraggingHandle(null)}
            onPointerLeave={() => setDraggingHandle(null)}
            style={{ touchAction: 'none', userSelect: 'none', display: 'block' }}
          >
            <defs>
              <pattern
                id={`${baseId}-bearish-hatch`}
                width="6"
                height="6"
                patternTransform="rotate(45 0 0)"
                patternUnits="userSpaceOnUse"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="6"
                  stroke="#831c1e"
                  strokeWidth="1.5"
                  strokeOpacity="0.35"
                />
              </pattern>
            </defs>

            {/* Horizontal gridlines & Y price labels */}
            {gridTicks.map((tick) => {
              const y = priceToY(tick);
              return (
                <g key={tick}>
                  <line
                    x1="48"
                    y1={y}
                    x2="336"
                    y2={y}
                    stroke="var(--color-chart-grid)"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                  <text
                    x="40"
                    y={y + 4}
                    textAnchor="end"
                    fontSize="12"
                    fill="var(--color-text-subtle)"
                  >
                    ${tick}
                  </text>
                </g>
              );
            })}

            {/* Wick Line (High to Low) */}
            <line
              x1="150"
              y1={yHigh}
              x2="150"
              y2={yLow}
              stroke={isBullish ? '#04250e' : '#831c1e'}
              strokeWidth="2.5"
            />

            {/* Candle Real Body */}
            <rect
              x="114"
              y={yBodyTop}
              width="72"
              height={bodyHeight}
              rx="2"
              fill={isBullish ? '#dcfae5' : '#ffedea'}
              stroke={isBullish ? '#247b50' : '#c4242a'}
              strokeWidth="2"
            />
            {!isBullish && (
              <rect
                x="114"
                y={yBodyTop}
                width="72"
                height={bodyHeight}
                rx="2"
                fill={`url(#${baseId}-bearish-hatch)`}
                pointerEvents="none"
              />
            )}

            {/* Draggable Handle Lines */}
            {(
              [
                { key: 'high', label: 'High', value: ohlc.high, y: yHigh, xLabel: 215 },
                {
                  key: 'open',
                  label: 'Open',
                  value: ohlc.open,
                  y: priceToY(ohlc.open),
                  xLabel: 215,
                },
                {
                  key: 'close',
                  label: 'Close',
                  value: ohlc.close,
                  y: priceToY(ohlc.close),
                  xLabel: 215,
                },
                { key: 'low', label: 'Low', value: ohlc.low, y: yLow, xLabel: 215 },
              ] as const
            ).map((h) => (
              <g
                key={h.key}
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  setDraggingHandle(h.key);
                }}
                style={{ cursor: 'ns-resize' }}
              >
                <line
                  x1="188"
                  y1={h.y}
                  x2="212"
                  y2={h.y}
                  stroke="var(--color-data-hue)"
                  strokeWidth="1.5"
                />
                <rect
                  x="212"
                  y={h.y - 11}
                  width="120"
                  height="22"
                  rx="4"
                  fill="var(--color-bg-surface)"
                  stroke="var(--color-data-hue)"
                  strokeWidth="1.25"
                />
                <text
                  x="220"
                  y={h.y + 4}
                  fontSize="12"
                  fontWeight="500"
                  fill="var(--color-text-main)"
                >
                  {h.label}: ${h.value.toFixed(2)}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Accessible Sliders & Numeric Readout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {(
            [
              { key: 'high', label: 'High price (USDT)', val: ohlc.high },
              { key: 'open', label: 'Open price (USDT)', val: ohlc.open },
              { key: 'close', label: 'Close price (USDT)', val: ohlc.close },
              { key: 'low', label: 'Low price (USDT)', val: ohlc.low },
            ] as const
          ).map((field) => {
            const inputId = `${baseId}-${field.key}`;
            return (
              <div key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <label htmlFor={inputId} style={{ fontWeight: 500 }}>
                    {field.label}
                  </label>
                  <span className="num" style={{ fontWeight: 600 }}>
                    {field.val.toFixed(2)} USDT
                  </span>
                </div>
                <input
                  id={inputId}
                  type="range"
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                  step="0.1"
                  value={field.val}
                  onChange={(e) => updateField(field.key, parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-data-hue)' }}
                />
              </div>
            );
          })}

          {/* Computed Proportions Table */}
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: 'var(--font-size-xs)',
              marginTop: 'var(--space-2)',
            }}
          >
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                <td style={{ paddingBlock: '6px', color: 'var(--color-text-muted)' }}>
                  Upper wick (rejection)
                </td>
                <td
                  data-numeric="true"
                  className="num"
                  style={{ paddingBlock: '6px', fontWeight: 600 }}
                >
                  {upperWickSize.toFixed(2)} USDT
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                <td style={{ paddingBlock: '6px', color: 'var(--color-text-muted)' }}>
                  Real body ({isBullish ? 'buyer gain' : 'seller drop'})
                </td>
                <td
                  data-numeric="true"
                  className="num"
                  style={{ paddingBlock: '6px', fontWeight: 600 }}
                >
                  {bodySize.toFixed(2)} USDT
                </td>
              </tr>
              <tr>
                <td style={{ paddingBlock: '6px', color: 'var(--color-text-muted)' }}>
                  Lower wick (buyer absorption)
                </td>
                <td
                  data-numeric="true"
                  className="num"
                  style={{ paddingBlock: '6px', fontWeight: 600 }}
                >
                  {lowerWickSize.toFixed(2)} USDT
                </td>
              </tr>
            </tbody>
          </table>

          <div
            style={{
              backgroundColor: 'var(--color-bg-canvas)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3)',
              fontSize: 'var(--font-size-xs)',
              lineHeight: 1.5,
            }}
          >
            <strong>What this shape says:</strong> {dynamicInterpretation}
          </div>
        </div>
      </div>
    </div>
  );
}
