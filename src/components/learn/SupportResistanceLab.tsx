import { useState } from 'react';

export default function SupportResistanceLab() {
  const [selectedFloor, setSelectedFloor] = useState<number>(85.0);
  const [selectedCeiling, setSelectedCeiling] = useState<number>(95.0);
  const currentPrice = 89.73;

  // Stop loss is calculated as 2% below the selected floor
  const stopLossPrice = Math.round(selectedFloor * 0.98 * 100) / 100;

  // Plain-English state check
  const distanceToFloorPct =
    Math.round(((currentPrice - selectedFloor) / currentPrice) * 1000) / 10;
  const distanceToCeilingPct =
    Math.round(((selectedCeiling - currentPrice) / currentPrice) * 1000) / 10;

  return (
    <div
      className="surface-card"
      style={{ padding: 'var(--space-6)', marginTop: 'var(--space-6)' }}
      data-ui="sr-lab"
    >
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
          <span className="status-pill status-pill--info">Interactive Lab 4A</span>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
            Floors, Ceilings &amp; The 2% Safety Buffer
          </span>
        </div>
        <h3 style={{ margin: '0 0 6px 0', fontSize: 'var(--font-size-lg)' }}>
          Place Your Price Floor &amp; Ceiling
        </h3>
        <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
          In spot trading, a <strong>Support Floor</strong> is where resting buy orders catch a
          falling coin. A <strong>Resistance Ceiling</strong> is where previous buyers look to take
          profit. Move the sliders below to watch how the 2% Stop-Loss buffer recalculates
          automatically.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-6)',
          alignItems: 'start',
        }}
      >
        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div
            className="surface-card"
            style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-bg-canvas)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label
                htmlFor="ceiling-slider"
                style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700 }}
              >
                1. Resistance Ceiling (Take-Profit Target)
              </label>
              <span className="num" style={{ fontWeight: 700, color: 'var(--color-up-ink)' }}>
                ${selectedCeiling.toFixed(2)} USDT
              </span>
            </div>
            <input
              id="ceiling-slider"
              type="range"
              min={91.0}
              max={105.0}
              step={0.5}
              value={selectedCeiling}
              onChange={(e) => setSelectedCeiling(Number(e.target.value))}
              style={{ width: '100%' }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '11px',
                color: 'var(--color-text-subtle)',
                marginTop: '4px',
              }}
            >
              <span>$91.00 (Near MA30)</span>
              <span>+{distanceToCeilingPct}% above current</span>
              <span>$105.00</span>
            </div>
          </div>

          <div
            className="surface-card"
            style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-bg-canvas)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label
                htmlFor="floor-slider"
                style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700 }}
              >
                2. Support Floor (Resting Buy Zone)
              </label>
              <span className="num" style={{ fontWeight: 700, color: 'var(--color-data-hue)' }}>
                ${selectedFloor.toFixed(2)} USDT
              </span>
            </div>
            <input
              id="floor-slider"
              type="range"
              min={75.0}
              max={89.0}
              step={0.5}
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(Number(e.target.value))}
              style={{ width: '100%' }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '11px',
                color: 'var(--color-text-subtle)',
                marginTop: '4px',
              }}
            >
              <span>$75.00</span>
              <span>-{distanceToFloorPct}% below current</span>
              <span>$89.00 (Just below price)</span>
            </div>
          </div>

          {/* Derived 2% Stop Loss */}
          <div
            className="surface-card"
            style={{
              padding: 'var(--space-4)',
              borderLeft: '4px solid var(--color-danger)',
              backgroundColor: 'var(--color-bg-canvas)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: 'var(--font-size-xs)' }}>
                Pre-Agreed Stop-Loss (&ldquo;Plan Broken&rdquo;)
              </strong>
              <span className="num" style={{ fontWeight: 700, color: 'var(--color-danger)' }}>
                ${stopLossPrice.toFixed(2)} USDT
              </span>
            </div>
            <p
              style={{
                margin: '6px 0 0 0',
                fontSize: '11px',
                color: 'var(--color-text-muted)',
                lineHeight: 1.4,
              }}
            >
              Set exactly <strong>2% below your lowest floor</strong> (${selectedFloor.toFixed(2)}).
              If a 4H candle closes below this line, the bounce premise is broken and we exit
              without arguing with the market.
            </p>
          </div>
        </div>

        {/* Visual Diagram */}
        <div
          style={{
            backgroundColor: 'var(--color-bg-canvas)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border-default)',
            padding: 'var(--space-4)',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--color-text-subtle)',
              marginBottom: '8px',
              textTransform: 'uppercase',
            }}
          >
            Visual Room Model (Ceiling, Price, Floor, Stop)
          </div>

          <svg viewBox="0 0 320 220" style={{ width: '100%', height: 'auto', display: 'block' }}>
            {/* Ceiling Zone */}
            <rect
              x="20"
              y="20"
              width="280"
              height="24"
              fill="var(--color-pill-warning-bg)"
              rx="4"
            />
            <line
              x1="20"
              y1="32"
              x2="300"
              y2="32"
              stroke="var(--color-up)"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
            <text x="28" y="36" fontSize="10" fontWeight="bold" fill="var(--color-up-ink)">
              Resistance Ceiling: ${selectedCeiling.toFixed(2)} (+{distanceToCeilingPct}%)
            </text>

            {/* Current Price Marker */}
            <line
              x1="20"
              y1="95"
              x2="300"
              y2="95"
              stroke="var(--color-text-main)"
              strokeWidth="2"
            />
            <circle cx="160" cy="95" r="5" fill="var(--color-text-main)" />
            <text x="28" y="90" fontSize="10" fontWeight="bold" fill="var(--color-text-main)">
              Current Price: ${currentPrice.toFixed(2)} USDT
            </text>

            {/* Support Floor Zone */}
            <rect
              x="20"
              y="145"
              width="280"
              height="24"
              fill="var(--color-data-hue-subtle)"
              rx="4"
            />
            <line
              x1="20"
              y1="157"
              x2="300"
              y2="157"
              stroke="var(--color-data-hue)"
              strokeWidth="2"
            />
            <text x="28" y="161" fontSize="10" fontWeight="bold" fill="var(--color-data-hue)">
              Support Floor: ${selectedFloor.toFixed(2)} (-{distanceToFloorPct}%)
            </text>

            {/* Stop Loss Line */}
            <line
              x1="20"
              y1="195"
              x2="300"
              y2="195"
              stroke="var(--color-danger)"
              strokeWidth="2"
              strokeDasharray="3 3"
            />
            <text x="28" y="207" fontSize="10" fontWeight="bold" fill="var(--color-danger)">
              Stop-Loss (-2% buffer): ${stopLossPrice.toFixed(2)} USDT
            </text>
          </svg>

          <div
            style={{
              marginTop: '8px',
              fontSize: '11px',
              color: 'var(--color-text-muted)',
              lineHeight: 1.4,
            }}
          >
            <strong>Rule of thumb:</strong> In spot swing trading, we never buy near the ceiling. We
            wait patiently until price drops near the <em>floor</em> while RSI cools down and buyer
            bids cluster below.
          </div>
        </div>
      </div>
    </div>
  );
}
