import { useState } from 'react';
import { clampOhlc } from '../../lib/candles';

interface CandlePreset {
  id: string;
  label: string;
  open: number;
  high: number;
  low: number;
  close: number;
  story: string;
  analogy: string;
}

const PRESETS: CandlePreset[] = [
  {
    id: 'buyer-hammer',
    label: '1. Buyer Bounce Wick (Hammer at Floor)',
    open: 90,
    high: 92,
    low: 82,
    close: 91,
    story:
      'Sellers tried to smash price down to $82, but buyers stepped in with cash and pushed the price all the way back up to $91 by the end of the 4-hour block.',
    analogy:
      'Like pushing a beach ball underwater: the long bottom tail (wick) shows the water pushing the ball right back up to the surface.',
  },
  {
    id: 'strong-green',
    label: '2. Strong Green Buyer Bar',
    open: 84,
    high: 94,
    low: 83,
    close: 93,
    story:
      'Price opened at $84 and buyers steadily drove it up to $93 with almost no pushback from sellers.',
    analogy: 'Shoppers lined up at opening time and steadily bid the price higher all afternoon.',
  },
  {
    id: 'seller-rejection',
    label: '3. Ceiling Rejection (Long Top Wick)',
    open: 91,
    high: 98,
    low: 89,
    close: 90,
    story:
      'Buyers tried to push price up to $98 (Resistance Ceiling), but sellers cashed out heavily and knocked price back down to $90.',
    analogy:
      'Jumping up and hitting your head on a low ceiling: the long top needle marks the exact price where sellers rejected the rally.',
  },
  {
    id: 'panic-red',
    label: '4. Heavy Red Selling Bar',
    open: 95,
    high: 96,
    low: 84,
    close: 85,
    story:
      'Price started at $95 and sellers dumped all the way down to $85 with very little buying underneath.',
    analogy:
      'Wait for the falling knife to hit the floor and form a bounce wick before placing a buy order.',
  },
];

export default function CandlestickAnatomyLab() {
  const [rawOpen, setRawOpen] = useState(90);
  const [rawHigh, setRawHigh] = useState(92);
  const [rawLow, setRawLow] = useState(82);
  const [rawClose, setRawClose] = useState(91);
  const [activePresetId, setActivePresetId] = useState('buyer-hammer');

  const ohlc = clampOhlc(rawOpen, rawHigh, rawLow, rawClose);
  const isGreen = ohlc.close >= ohlc.open;
  const bodyColor = isGreen ? '#15803d' : '#b91c1c';
  const bodyTopPrice = Math.max(ohlc.open, ohlc.close);
  const bodyBottomPrice = Math.min(ohlc.open, ohlc.close);
  const upperWickSize = +(ohlc.high - bodyTopPrice).toFixed(2);
  const lowerWickSize = +(bodyBottomPrice - ohlc.low).toFixed(2);
  const bodySize = +Math.abs(ohlc.close - ohlc.open).toFixed(2);

  // Map price 75..105 to SVG Y 220..30
  const priceToY = (p: number) => {
    const clamped = Math.max(75, Math.min(105, p));
    return Math.round(220 - ((clamped - 75) / 30) * 190);
  };

  const yHigh = priceToY(ohlc.high);
  const yLow = priceToY(ohlc.low);
  const yBodyTop = priceToY(bodyTopPrice);
  const yBodyBottom = priceToY(bodyBottomPrice);
  const bodyHeight = Math.max(6, yBodyBottom - yBodyTop);

  const activePreset = PRESETS.find((p) => p.id === activePresetId);

  const applyPreset = (p: CandlePreset) => {
    setActivePresetId(p.id);
    setRawOpen(p.open);
    setRawHigh(p.high);
    setRawLow(p.low);
    setRawClose(p.close);
  };

  return (
    <div className="sim-box" data-ui="candlestick-anatomy-lab">
      <div className="sim-box__header">
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '4px' }}>
            <span className="status-pill status-pill--info">Interactive OHLC Candle Builder</span>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-subtle)' }}>
              Click a preset shape or drag the 4 price sliders (O, H, L, C)
            </span>
          </div>
          <h3 className="sim-box__title">
            Build a Single Candlestick: Open (O), High (H), Low (L), Close (C)
          </h3>
          <p className="sim-box__subtitle">
            Every candlestick bar on Gate.com is just a summary of 4 prices during that time block.
            Drag the sliders below to see how the thick body and thin wicks form.
          </p>
        </div>
      </div>

      <div className="sim-box__body">
        {/* Preset Buttons */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '8px',
            marginBottom: 'var(--space-4)',
          }}
        >
          {PRESETS.map((p) => {
            const active = p.id === activePresetId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p)}
                style={{
                  textAlign: 'left',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: active
                    ? '2px solid var(--color-data-hue)'
                    : '1px solid var(--color-border-default)',
                  backgroundColor: active
                    ? 'var(--color-data-hue-subtle)'
                    : 'var(--color-bg-surface)',
                  color: 'var(--color-text-main)',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: active ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        <div className="candle-lab-grid">
          {/* Left: Interactive Annotated SVG Candle Diagram */}
          <div
            style={{
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-default)',
              backgroundColor: 'var(--color-bg-canvas)',
            }}
          >
            <div
              className="num"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                gap: '8px',
                fontSize: 'var(--font-size-xs)',
                paddingBottom: '8px',
                marginBottom: '8px',
                borderBottom: '1px solid var(--color-border-default)',
              }}
            >
              <span>
                O: <strong>${ohlc.open}</strong>
              </span>
              <span>
                H: <strong>${ohlc.high}</strong>
              </span>
              <span>
                L: <strong>${ohlc.low}</strong>
              </span>
              <span style={{ color: bodyColor }}>
                C: <strong>${ohlc.close}</strong> ({isGreen ? 'Green Up Bar' : 'Red Down Bar'})
              </span>
            </div>

            <svg
              viewBox="0 0 440 250"
              style={{ width: '100%', height: 'auto', display: 'block' }}
              role="img"
              aria-label="Annotated single candlestick diagram showing High, Open, Close, Low, body, and wicks"
            >
              {/* Price Reference Grid */}
              {[100, 95, 90, 85, 80].map((p) => {
                const y = priceToY(p);
                return (
                  <g key={p}>
                    <line
                      x1="35"
                      y1={y}
                      x2="395"
                      y2={y}
                      stroke="var(--color-chart-grid)"
                      strokeDasharray="3 3"
                    />
                    <text
                      x="5"
                      y={y + 4}
                      fontSize="10"
                      fill="var(--color-text-subtle)"
                      fontFamily="monospace"
                    >
                      ${p}
                    </text>
                  </g>
                );
              })}

              {/* Upper & Lower Wick Line */}
              <line x1="170" y1={yHigh} x2="170" y2={yLow} stroke={bodyColor} strokeWidth="3.5" />

              {/* Thick Candle Body */}
              <rect
                x="138"
                y={yBodyTop}
                width="64"
                height={bodyHeight}
                fill={bodyColor}
                rx="4"
              />

              {/* Annotations on Right Side */}
              <line x1="175" y1={yHigh} x2="235" y2={yHigh} stroke="var(--color-text-subtle)" />
              <text x="242" y={yHigh + 4} fontSize="11" fontWeight="bold" fill="var(--color-text-main)">
                High (H): ${ohlc.high} (Top Wick Tip)
              </text>

              <line x1="204" y1={yBodyTop} x2="235" y2={yBodyTop} stroke={bodyColor} />
              <text x="242" y={yBodyTop + 4} fontSize="11" fontWeight="bold" fill={bodyColor}>
                {isGreen ? `Close (C): $${ohlc.close}` : `Open (O): $${ohlc.open}`}
              </text>

              <line x1="204" y1={yBodyBottom} x2="235" y2={yBodyBottom} stroke={bodyColor} />
              <text x="242" y={yBodyBottom + 4} fontSize="11" fontWeight="bold" fill={bodyColor}>
                {isGreen ? `Open (O): $${ohlc.open}` : `Close (C): $${ohlc.close}`}
              </text>

              <line x1="175" y1={yLow} x2="235" y2={yLow} stroke="var(--color-text-subtle)" />
              <text x="242" y={yLow + 4} fontSize="11" fontWeight="bold" fill="var(--color-text-main)">
                Low (L): ${ohlc.low} (Bottom Bounce Wick)
              </text>
            </svg>
          </div>

          {/* Right: 4 Sliders + Plain-English Meaning */}
          <div
            style={{
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-default)',
              backgroundColor: 'var(--color-bg-surface)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 'var(--space-3)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 'var(--font-size-xs)',
                  }}
                >
                  <strong>1. Open Price (O - Where bar started)</strong>
                  <span className="num">${ohlc.open}</span>
                </div>
                <input
                  type="range"
                  min={78}
                  max={100}
                  step={1}
                  value={rawOpen}
                  onChange={(e) => {
                    setActivePresetId('custom');
                    setRawOpen(Number(e.target.value));
                  }}
                  style={{ width: '100%' }}
                  aria-label="Open Price"
                />
              </div>

              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 'var(--font-size-xs)',
                  }}
                >
                  <strong>2. Close Price (C - Where bar finished)</strong>
                  <span className="num">${ohlc.close}</span>
                </div>
                <input
                  type="range"
                  min={78}
                  max={100}
                  step={1}
                  value={rawClose}
                  onChange={(e) => {
                    setActivePresetId('custom');
                    setRawClose(Number(e.target.value));
                  }}
                  style={{ width: '100%' }}
                  aria-label="Close Price"
                />
              </div>

              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 'var(--font-size-xs)',
                  }}
                >
                  <strong>3. High Tip (H - Highest spike)</strong>
                  <span className="num">${ohlc.high} (Top wick: ${upperWickSize})</span>
                </div>
                <input
                  type="range"
                  min={bodyTopPrice}
                  max={103}
                  step={1}
                  value={ohlc.high}
                  onChange={(e) => {
                    setActivePresetId('custom');
                    setRawHigh(Number(e.target.value));
                  }}
                  style={{ width: '100%' }}
                  aria-label="High Price"
                />
              </div>

              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 'var(--font-size-xs)',
                  }}
                >
                  <strong>4. Low Tip (L - Lowest drop)</strong>
                  <span className="num">${ohlc.low} (Bottom wick: ${lowerWickSize})</span>
                </div>
                <input
                  type="range"
                  min={76}
                  max={bodyBottomPrice}
                  step={1}
                  value={ohlc.low}
                  onChange={(e) => {
                    setActivePresetId('custom');
                    setRawLow(Number(e.target.value));
                  }}
                  style={{ width: '100%' }}
                  aria-label="Low Price"
                />
              </div>
            </div>

            <div
              style={{
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-bg-subtle)',
                border: '1px solid var(--color-border-subtle)',
                fontSize: 'var(--font-size-xs)',
              }}
            >
              <strong>What this candle tells you: </strong>
              <p style={{ margin: '4px 0 0 0', fontSize: 'var(--font-size-xs)' }}>
                {activePreset
                  ? activePreset.story
                  : `Body moved $${bodySize} (${isGreen ? 'Buyers won' : 'Sellers won'}). Top wick is $${upperWickSize}; bottom bounce wick is $${lowerWickSize}.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .candle-lab-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-4);
        }
        @media (min-width: 1024px) {
          .candle-lab-grid {
            grid-template-columns: 1.15fr 1fr;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
}

