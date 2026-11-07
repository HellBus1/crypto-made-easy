import { useState, useMemo } from 'react';
import { generateScenarioCandles, aggregateCandles, type ScenarioName } from '../../lib/candles';
import { computeEssentialSnapshot, sma, bollinger } from '../../lib/indicators';

interface ScenarioMeta {
  id: ScenarioName;
  title: string;
  badge: string;
  badgeVariant: 'positive' | 'info' | 'warning' | 'negative';
  plainSummary: string;
  analogy: string;
  beginnerAction: string;
}

const SCENARIOS: ScenarioMeta[] = [
  {
    id: 'dip-at-support',
    title: '1. Dip at Support Floor (SOL Buy Zone)',
    badge: 'Discount + Floor Bounce',
    badgeVariant: 'positive',
    plainSummary:
      'Price pulled back below the 30-bar average (MA30) and touched a previous bounce floor with long lower wicks showing buyers stepping in.',
    analogy:
      'Like a quality jacket going on a 10% weekend sale while shoppers are actively lining up at the register.',
    beginnerAction:
      'Check if all 3 Traffic Lights are ON. If yes, place your 13% / 21% / 30% staggered Limit Buy orders at the support floors.',
  },
  {
    id: 'uptrend',
    title: '2. Healthy Uptrend (Breathing Pullbacks)',
    badge: 'Higher Highs & Lows',
    badgeVariant: 'info',
    plainSummary:
      'Price climbs in stair-steps: each rally is followed by a calm 5% breather that stays safely above the previous floor.',
    analogy:
      'Like walking up a staircase and pausing on every landing to catch your breath before climbing the next step.',
    beginnerAction:
      'If already holding, stay calm during small 5% red breathers. Do not panic-sell as long as your Stop-Loss floor holds.',
  },
  {
    id: 'range',
    title: '3. Sideways Ping-Pong Range ($86 to $95)',
    badge: 'Floor-to-Ceiling Channel',
    badgeVariant: 'warning',
    plainSummary:
      'Price bounces repeatedly between a clear Support Floor (~$86) and a Resistance Ceiling (~$95) inside the Bollinger tunnel.',
    analogy: 'Like a ping-pong ball bouncing between the table and a low ceiling inside a room.',
    beginnerAction:
      'Only consider buying near the bottom floor (BOLL Lower Band) and take profit near the top ceiling (BOLL Upper Band). Never buy in the middle.',
  },
  {
    id: 'broken-trend',
    title: '4. Broken Floor (Stop-Loss Triggered)',
    badge: 'Plan Broken',
    badgeVariant: 'negative',
    plainSummary:
      'Heavy red selling volume slices straight through the support floors and closes more than 2% below lowest support.',
    analogy:
      'The wooden floor underneath you cracked. Instead of hoping it magically repairs itself, you step out through the emergency exit.',
    beginnerAction:
      'Exit calmly at your pre-agreed Stop-Loss price and protect your remaining USDT cash plus your 36% untouched reserve.',
  },
];

export default function ScenarioDataExplorer() {
  const [scenario, setScenario] = useState<ScenarioName>('dip-at-support');
  const [timeframe, setTimeframe] = useState<'4H' | '1D'>('4H');

  const activeMeta = SCENARIOS.find((s) => s.id === scenario) ?? SCENARIOS[0];

  const { candles, snapshot, maSeries, bollSeries } = useMemo(() => {
    const raw4H = generateScenarioCandles(scenario, 48, 1337);
    const activeCandles = timeframe === '1D' ? aggregateCandles(raw4H, 6) : raw4H;
    const closes = activeCandles.map((c) => c.close);
    const maPeriod = Math.min(30, Math.max(4, closes.length));
    const bollPeriod = Math.min(20, Math.max(4, closes.length));
    return {
      candles: activeCandles,
      snapshot: computeEssentialSnapshot(activeCandles),
      maSeries: sma(closes, maPeriod),
      bollSeries: bollinger(closes, bollPeriod, 2),
    };
  }, [scenario, timeframe]);

  // Compute SVG chart coordinates for the last 24 candles (or all 8 daily candles)
  const visibleCandles = candles.slice(-24);
  const visibleMa = maSeries.slice(-24);
  const visibleBoll = bollSeries.slice(-24);

  const minPrice = Math.min(
    ...visibleCandles.map((c) => c.low),
    ...visibleBoll.map((b) => b.lower ?? Infinity)
  );
  const maxPrice = Math.max(
    ...visibleCandles.map((c) => c.high),
    ...visibleBoll.map((b) => b.upper ?? -Infinity)
  );
  const priceSpan = Math.max(1, maxPrice - minPrice);

  const priceToY = (p: number) => {
    const ratio = (p - minPrice) / priceSpan;
    return Math.round((165 - ratio * 135) * 10) / 10;
  };

  const stepX = 480 / Math.max(1, visibleCandles.length);

  const maPoints = visibleMa
    .map((val, idx) => (val !== null ? `${40 + idx * stepX},${priceToY(val)}` : null))
    .filter(Boolean)
    .join(' ');

  const upperPoints = visibleBoll
    .map((b, idx) => (b.upper !== null ? `${40 + idx * stepX},${priceToY(b.upper)}` : null))
    .filter(Boolean)
    .join(' ');

  const lowerPoints = visibleBoll
    .map((b, idx) => (b.lower !== null ? `${40 + idx * stepX},${priceToY(b.lower)}` : null))
    .filter(Boolean)
    .join(' ');

  return (
    <div className="sim-box" data-ui="scenario-data-explorer">
      <div className="sim-box__header">
        <div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '4px',
            }}
          >
            <span className="status-pill status-pill--info">
              Interactive Market Pattern &amp; Essential Indicator Lab
            </span>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-subtle)' }}>
              Powered by deterministic 4H / 1D candle &amp; indicator math
            </span>
          </div>
          <h2 className="sim-box__title">
            Practice Reading the 4 Core Market Shapes Before Risking a Dollar
          </h2>
          <p className="sim-box__subtitle">
            Every crypto chart is built from one of these 4 market patterns. Click each pattern and
            switch between <strong>4H (4-Hour Bars)</strong> and <strong>1D (Daily Bars)</strong> to
            see how the essential indicators (<code>MA30</code>, <code>BOLL</code>, <code>RSI</code>
            , and <code>Volume</code>) behave.
          </p>
        </div>

        {/* Timeframe Aggregation Switcher */}
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => setTimeframe('4H')}
            className={timeframe === '4H' ? 'btn-primary' : 'btn-secondary'}
            style={{ minHeight: '36px', padding: '6px 12px', fontSize: '12px' }}
          >
            4H Chart (24 Bars)
          </button>
          <button
            type="button"
            onClick={() => setTimeframe('1D')}
            className={timeframe === '1D' ? 'btn-primary' : 'btn-secondary'}
            style={{ minHeight: '36px', padding: '6px 12px', fontSize: '12px' }}
          >
            1D Aggregated (8 Days)
          </button>
        </div>
      </div>

      <div className="sim-box__body">
        {/* 4 Scenario Selector Tabs */}
        <div className="scenario-tabs-grid" role="tablist" aria-label="Market scenarios">
          {SCENARIOS.map((item) => {
            const active = item.id === scenario;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setScenario(item.id)}
                className={`scenario-tab-btn ${active ? 'scenario-tab-btn--active' : ''}`}
              >
                <div style={{ fontWeight: 700, fontSize: 'var(--font-size-xs)' }}>{item.title}</div>
                <div style={{ marginTop: '4px' }}>
                  <span className={`status-pill status-pill--${item.badgeVariant}`}>
                    {item.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 2-Column Interactive Chart + Essential Indicator Readout */}
        <div className="scenario-main-grid">
          {/* Left: Live Rendered SVG Candlestick + MA30 + BOLL Tunnel */}
          <div className="scenario-chart-card">
            <div className="scenario-chart-header num">
              <span>
                Close: <strong>${snapshot.currentPrice.toFixed(2)}</strong>
              </span>
              <span style={{ color: '#0284c7' }}>
                MA30: <strong>${snapshot.ma30?.toFixed(2) ?? 'N/A'}</strong>
              </span>
              <span style={{ color: '#b45309' }}>
                BOLL: <strong>${snapshot.bollLower?.toFixed(2)}</strong> to{' '}
                <strong>${snapshot.bollUpper?.toFixed(2)}</strong>
              </span>
              <span style={{ color: 'var(--color-data-hue)' }}>
                RSI(14): <strong>{snapshot.rsi14 ?? 'N/A'}</strong>
              </span>
            </div>

            <svg
              viewBox="0 0 560 205"
              style={{ width: '100%', height: 'auto', display: 'block' }}
              role="img"
              aria-label={`Candlestick chart for ${activeMeta.title} on ${timeframe} timeframe`}
            >
              {/* Grid lines */}
              <line
                x1="25"
                y1="35"
                x2="510"
                y2="35"
                stroke="var(--color-chart-grid)"
                strokeDasharray="3 3"
              />
              <line
                x1="25"
                y1="95"
                x2="510"
                y2="95"
                stroke="var(--color-chart-grid)"
                strokeDasharray="3 3"
              />
              <line
                x1="25"
                y1="155"
                x2="510"
                y2="155"
                stroke="var(--color-chart-grid)"
                strokeDasharray="3 3"
              />

              <text
                x="515"
                y="39"
                fontSize="10"
                fill="var(--color-text-subtle)"
                fontFamily="monospace"
              >
                ${maxPrice.toFixed(1)}
              </text>
              <text
                x="515"
                y="99"
                fontSize="10"
                fill="var(--color-text-subtle)"
                fontFamily="monospace"
              >
                ${((maxPrice + minPrice) / 2).toFixed(1)}
              </text>
              <text
                x="515"
                y="159"
                fontSize="10"
                fill="var(--color-text-subtle)"
                fontFamily="monospace"
              >
                ${minPrice.toFixed(1)}
              </text>

              {/* BOLL Upper & Lower Lines */}
              {upperPoints && (
                <polyline
                  points={upperPoints}
                  fill="none"
                  stroke="#b45309"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
              )}
              {lowerPoints && (
                <polyline
                  points={lowerPoints}
                  fill="none"
                  stroke="#15803d"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
              )}

              {/* Smooth MA30 Line */}
              {maPoints && (
                <polyline points={maPoints} fill="none" stroke="#0284c7" strokeWidth="2.5" />
              )}

              {/* Candlesticks */}
              {visibleCandles.map((c, idx) => {
                const x = 40 + idx * stepX;
                const up = c.close >= c.open;
                const color = up ? '#15803d' : '#b91c1c';
                const yHigh = priceToY(c.high);
                const yLow = priceToY(c.low);
                const yOpen = priceToY(c.open);
                const yClose = priceToY(c.close);
                const bodyTop = Math.min(yOpen, yClose);
                const bodyHeight = Math.max(3, Math.abs(yClose - yOpen));
                const barWidth = timeframe === '1D' ? 18 : 10;

                return (
                  <g key={c.time}>
                    <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={color} strokeWidth="1.5" />
                    <rect
                      x={x - barWidth / 2}
                      y={bodyTop}
                      width={barWidth}
                      height={bodyHeight}
                      fill={color}
                      rx="1"
                    />
                  </g>
                );
              })}

              {/* Legend Footer inside SVG */}
              <text x="30" y="192" fontSize="10" fontWeight="bold" fill="#0284c7">
                Solid Blue = MA30 Fair-Price Line
              </text>
              <text x="235" y="192" fontSize="10" fontWeight="bold" fill="#b45309">
                Dashed Amber = BOLL Roof
              </text>
              <text x="395" y="192" fontSize="10" fontWeight="bold" fill="#15803d">
                Dashed Green = BOLL Floor
              </text>
            </svg>
          </div>

          {/* Right: Beginner Explanation & Computed Essential Numbers */}
          <div className="scenario-info-card">
            <div>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  marginBottom: '8px',
                }}
              >
                <span className={`status-pill status-pill--${activeMeta.badgeVariant}`}>
                  {activeMeta.badge}
                </span>
                <span className="num" style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700 }}>
                  Timeframe: {timeframe} ({visibleCandles.length} bars shown)
                </span>
              </div>

              <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '6px' }}>
                {activeMeta.title}
              </h3>

              <p style={{ fontSize: 'var(--font-size-sm)', marginBottom: '12px' }}>
                {activeMeta.plainSummary}
              </p>

              <div className="analogy-callout" style={{ marginBlock: '0 12px' }}>
                <div className="analogy-callout__header">Everyday Analogy</div>
                <p>{activeMeta.analogy}</p>
              </div>

              {/* Essential Indicator Readout Grid */}
              <div className="snapshot-grid num">
                <div className="snapshot-item">
                  <div className="snapshot-item__label">1. Price vs MA30</div>
                  <div className="snapshot-item__val">
                    ${snapshot.currentPrice.toFixed(2)} vs ${snapshot.ma30?.toFixed(2)}
                  </div>
                  <div className="snapshot-item__sub">
                    {snapshot.ma30 && snapshot.currentPrice < snapshot.ma30
                      ? 'Below Average (On Sale)'
                      : 'Above 30-Bar Average'}
                  </div>
                </div>

                <div className="snapshot-item">
                  <div className="snapshot-item__label">2. RSI(14) Meter</div>
                  <div className="snapshot-item__val">{snapshot.rsi14 ?? 'N/A'} / 100</div>
                  <div className="snapshot-item__sub">
                    {snapshot.rsi14 !== null && snapshot.rsi14 <= 36
                      ? 'Sellers Tired (<= 36)'
                      : snapshot.rsi14 !== null && snapshot.rsi14 >= 70
                        ? 'Overheated (>= 70)'
                        : 'Neutral Momentum'}
                  </div>
                </div>

                <div className="snapshot-item">
                  <div className="snapshot-item__label">3. BOLL Price Tunnel</div>
                  <div className="snapshot-item__val">
                    Floor ${snapshot.bollLower?.toFixed(1)} / Roof ${snapshot.bollUpper?.toFixed(1)}
                  </div>
                  <div className="snapshot-item__sub">95% normal price range</div>
                </div>

                <div className="snapshot-item">
                  <div className="snapshot-item__label">4. Crowd Volume</div>
                  <div className="snapshot-item__val">{snapshot.latestVolume} coins</div>
                  <div className="snapshot-item__sub">
                    Activity is <strong>{snapshot.volumeState}</strong> vs 10-bar avg
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-bg-subtle)',
                border: '1px solid var(--color-border-subtle)',
                fontSize: 'var(--font-size-xs)',
              }}
            >
              <strong>What a calm beginner does here: </strong>
              <span>{activeMeta.beginnerAction}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .scenario-tabs-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-3);
          margin-bottom: var(--space-4);
        }
        @media (min-width: 640px) {
          .scenario-tabs-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1280px) {
          .scenario-tabs-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .scenario-tab-btn {
          text-align: left;
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border-default);
          background-color: var(--color-bg-surface);
          color: var(--color-text-main);
          cursor: pointer;
        }
        .scenario-tab-btn--active {
          border: 2px solid var(--color-data-hue);
          background-color: var(--color-data-hue-subtle);
        }
        .scenario-main-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-4);
        }
        @media (min-width: 1024px) {
          .scenario-main-grid {
            grid-template-columns: 1.25fr 1fr;
            align-items: stretch;
          }
        }
        @media (min-width: 1536px) {
          .scenario-main-grid {
            grid-template-columns: 1.4fr 1fr;
            gap: var(--space-6);
          }
        }
        .scenario-chart-card {
          padding: var(--space-4);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border-default);
          background-color: var(--color-bg-canvas);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: var(--space-3);
        }
        .scenario-chart-header {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          font-size: var(--font-size-xs);
          padding-bottom: 8px;
          border-bottom: 1px solid var(--color-border-default);
        }
        .scenario-info-card {
          padding: var(--space-4);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border-default);
          background-color: var(--color-bg-surface);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: var(--space-3);
        }
        .snapshot-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin-bottom: 8px;
        }
        .snapshot-item {
          padding: 8px 10px;
          border-radius: var(--radius-md);
          background-color: var(--color-bg-subtle);
          border: 1px solid var(--color-border-subtle);
        }
        .snapshot-item__label {
          font-size: 11px;
          font-weight: 700;
          color: var(--color-text-subtle);
        }
        .snapshot-item__val {
          font-size: var(--font-size-xs);
          font-weight: 700;
          color: var(--color-text-main);
          margin-top: 2px;
        }
        .snapshot-item__sub {
          font-size: 11px;
          color: var(--color-data-hue);
          margin-top: 2px;
        }
      `}</style>
    </div>
  );
}
