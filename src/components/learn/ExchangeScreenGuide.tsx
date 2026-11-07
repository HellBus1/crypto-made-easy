import { useState } from 'react';

interface ScreenZone {
  id: number;
  shortTitle: string;
  badge: string;
  screenValue: string;
  plainQuestion: string;
  plainExplanation: string;
  analogy: string;
  concreteExample: string;
  checkerConnection: string;
}

const ZONES: ScreenZone[] = [
  {
    id: 1,
    shortTitle: '1. Coin Pair & Current Price',
    badge: 'Top-Left Header',
    screenValue: 'SOL / USDT = $128.18',
    plainQuestion: 'What am I buying, and what does 1 coin cost right now?',
    plainExplanation:
      'Every spot chart compares two things: the coin you want to buy (SOL) and the digital dollar cash you pay with (USDT). The big number ($128.18) is the last price a buyer and seller agreed on.',
    analogy:
      'Just like a sign at a fruit stall that says "Mangoes / USD: $1.28 each". Always make sure you are on the "Spot" tab (buying real coins with your own cash, never borrowed money).',
    concreteExample:
      'If you have 128.18 USDT in your wallet and buy at this price, you receive 1.00 SOL coin.',
    checkerConnection: 'Copy "128.18" into the "Current Price" box in our Signal Helper.',
  },
  {
    id: 2,
    shortTitle: '2. Timeframe Buttons (4H / 1D)',
    badge: 'Row Above Chart',
    screenValue: 'Selected: 4H (1 bar = 4 hours)',
    plainQuestion: 'Why does the chart look so fast and chaotic when I first open Gate.com?',
    plainExplanation:
      'By default, many exchanges open on the 1-minute (1m) or 15-minute (15m) view, where every tiny trade makes the bars jump around like a heartbeat monitor. Clicking "4H" or "1D" zooms out so each bar shows 4 hours or 1 full day.',
    analogy:
      'Staring at a 1-minute chart is like pressing your nose 2 inches from a TV screen: all you see is flashing pixels. Stepping back to 4H or 1D lets you see the whole picture calmly.',
    concreteExample:
      'On the 4H view, you only need to glance at the chart once or twice a day (morning and evening).',
    checkerConnection: 'Always click "4H" or "1D" on Gate.com before reading any numbers.',
  },
  {
    id: 3,
    shortTitle: '3. Candles & MA30 Line (Light 1)',
    badge: 'Main Chart Center',
    screenValue: 'Price $128.18 vs MA30 $129.07',
    plainQuestion: 'Is the coin currently on discount compared to its recent average price?',
    plainExplanation:
      'Green bars mean price went up during that 4-hour block; red bars mean price went down. The smooth blue line (MA30) is the average closing price of the last 30 bars.',
    analogy:
      'Imagine a jacket that normally costs $129.07 over the past month (MA30). Today it is priced at $128.18 (below the line), which means it is on sale rather than overpriced.',
    concreteExample:
      'Look at the tiny legend at the top-left of the chart: "MA30: 129.07". Since Current Price ($128.18) is below MA30 ($129.07), Light 1 turns GREEN.',
    checkerConnection: 'Copy "129.07" into the "MA30 Average Price" box for Light 1.',
  },
  {
    id: 4,
    shortTitle: '4. Support Floor & Ceiling',
    badge: 'Horizontal Price Zones',
    screenValue: 'Floor $126.64 | Ceiling $135.00',
    plainQuestion: 'Where did price bounce up before, and where did it get stuck before?',
    plainExplanation:
      'Look left on the chart. The low price where red drops previously stopped and bounced up is your Support Floor. The high peak where green rallies previously stalled is your Resistance Ceiling.',
    analogy:
      'Bouncing a ball inside a room: the Support is the floor underneath you ($126.64), and Resistance is the ceiling above your head ($135.00). We want to buy near the floor and sell near the ceiling.',
    concreteExample:
      'SOL bounced near $128.00 and $126.64 recently. Those become the exact prices where we place our staggered buy orders.',
    checkerConnection:
      'Copy those bounce prices into "Support Floor 1 & 2" and the peak into "Resistance Ceiling".',
  },
  {
    id: 5,
    shortTitle: '5. RSI Momentum Meter (Light 2)',
    badge: 'Bottom Sub-Chart',
    screenValue: 'RSI(14) = 32.57 (Below 36)',
    plainQuestion: 'Are sellers tired and running out of steam, or is everyone panic-dumping?',
    plainExplanation:
      'Directly underneath the main chart sits a 0-to-100 speedometer called RSI. When RSI drops to 36 or lower, sellers have pushed price down hard and are getting exhausted. When RSI climbs above 70, buyers are overheated.',
    analogy:
      'Pulling a rubber band downward: by the time the meter reaches 32–36, the rubber band is stretched tight and ready to snap back up.',
    concreteExample: 'Here RSI reads 32.57. Because 32.57 is 36 or lower, Light 2 turns GREEN.',
    checkerConnection: 'Copy "32.57" into the "RSI (0-100)" box for Light 2.',
  },
  {
    id: 6,
    shortTitle: '6. Order Book Buyer Bar (Light 3)',
    badge: 'Right Column Tug-of-War',
    screenValue: '41.6% Green Bids vs 58.4% Red Asks',
    plainQuestion: 'Are real buyers actually waiting with cash underneath the current price?',
    plainExplanation:
      'On the right side of Gate.com, the Order Book lists waiting buy orders (Green Bids) and waiting sell orders (Red Asks). At the bottom or top of that list is a percentage bar showing the tug-of-war between buyers and sellers.',
    analogy:
      'A cheap price means nothing if nobody wants to buy the item. Seeing at least 40% Green Buyers proves there is a real crowd of shoppers holding cash buckets underneath.',
    concreteExample:
      'In our SOL example, Green Bids are 41.58% (at least 40%), so Light 3 turns GREEN. In our ETH contrast example, Bids were only 22%, which kept Light 3 OFF and saved us from buying too early!',
    checkerConnection: 'Copy "41.58" into the "Order Book Buyer Bid %" box for Light 3.',
  },
];

export default function ExchangeScreenGuide() {
  const [activeId, setActiveId] = useState<number>(1);
  const [hideNoise, setHideNoise] = useState<boolean>(true);

  const activeZone = ZONES.find((z) => z.id === activeId) ?? ZONES[0];

  return (
    <div className="sim-box" data-ui="exchange-screen-guide">
      <div className="sim-box__header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="status-pill status-pill--info">Interactive Screen Map</span>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-subtle)' }}>
              Click any numbered zone (1 to 6) to decode it
            </span>
          </div>
          <h3 className="sim-box__title">Decode a Gate.com / Spot Exchange Screen in 60 Seconds</h3>
          <p className="sim-box__subtitle">
            An exchange screen looks scary because 90% of the buttons are for day-traders. Click
            each numbered part below to see the only 6 places a beginner needs to look.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setHideNoise(!hideNoise)}
          className={hideNoise ? 'btn-primary' : 'btn-secondary'}
          style={{ flexShrink: 0 }}
        >
          <span>{hideNoise ? 'Beginner Clean View: ON' : 'Showing Extra Clutter'}</span>
        </button>
      </div>

      <div className="sim-box__body">
        {/* Step Selector Pills */}
        <div
          role="tablist"
          aria-label="Exchange screen zones"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))',
            gap: '8px',
            marginBottom: 'var(--space-5)',
          }}
        >
          {ZONES.map((zone) => {
            const isSelected = zone.id === activeId;
            return (
              <button
                key={zone.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveId(zone.id)}
                style={{
                  textAlign: 'left',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${
                    isSelected ? 'var(--color-data-hue)' : 'var(--color-border-default)'
                  }`,
                  backgroundColor: isSelected
                    ? 'var(--color-data-hue-subtle)'
                    : 'var(--color-bg-surface)',
                  color: 'var(--color-text-main)',
                  cursor: 'pointer',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: isSelected ? 700 : 500,
                }}
              >
                {zone.shortTitle}
              </button>
            );
          })}
        </div>

        {/* Main Responsive 2-Column Interactive Grid */}
        <div className="screen-guide-grid">
          {/* Left: Visual Simplified Exchange Mock */}
          <div
            style={{
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-default)',
              backgroundColor: 'var(--color-bg-canvas)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
            }}
          >
            {/* Top Bar: Zone 1 (Pair & Price) + Clutter */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
              }}
            >
              <button
                type="button"
                onClick={() => setActiveId(1)}
                style={{
                  flex: '1 1 auto',
                  textAlign: 'left',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border:
                    activeId === 1
                      ? '2px solid var(--color-data-hue)'
                      : '1px solid var(--color-border-default)',
                  backgroundColor:
                    activeId === 1 ? 'var(--color-data-hue-subtle)' : 'var(--color-bg-surface)',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                  }}
                >
                  <span
                    style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-data-hue)' }}
                  >
                    [Zone 1] Spot Pair &amp; Price
                  </span>
                  <span className="status-pill status-pill--positive">Spot Tab</span>
                </div>
                <div
                  className="num"
                  style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginTop: '2px' }}
                >
                  SOL / USDT &nbsp; $128.18
                </div>
              </button>

              {!hideNoise && (
                <div
                  style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px dashed var(--color-border-default)',
                    fontSize: '11px',
                    color: 'var(--color-text-subtle)',
                  }}
                >
                  24h High / 24h Turnover / Perp Futures / Margin 10x (Ignore this clutter)
                </div>
              )}
            </div>

            {/* Row 2: Zone 2 (Timeframe Bar) + Indicator Toggles */}
            <button
              type="button"
              onClick={() => setActiveId(2)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border:
                  activeId === 2
                    ? '2px solid var(--color-data-hue)'
                    : '1px solid var(--color-border-default)',
                backgroundColor:
                  activeId === 2 ? 'var(--color-data-hue-subtle)' : 'var(--color-bg-surface)',
                cursor: 'pointer',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-data-hue)' }}>
                [Zone 2] Timeframe Bar:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', fontSize: '11px' }}>
                {!hideNoise && (
                  <span
                    style={{ color: 'var(--color-text-subtle)', textDecoration: 'line-through' }}
                  >
                    1m &nbsp; 5m &nbsp; 15m
                  </span>
                )}
                <span className="status-pill status-pill--info">4H (Active)</span>
                <span className="status-pill status-pill--neutral">1D</span>
              </div>
            </button>

            {/* Center Split: Main Chart (Zones 3, 4, 5) + Right Order Book (Zone 6) */}
            <div className="screen-guide-inner-split">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {/* Zone 3: Candles & MA30 */}
                <button
                  type="button"
                  onClick={() => setActiveId(3)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border:
                      activeId === 3
                        ? '2px solid var(--color-data-hue)'
                        : '1px solid var(--color-border-default)',
                    backgroundColor:
                      activeId === 3 ? 'var(--color-data-hue-subtle)' : 'var(--color-bg-surface)',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '4px',
                    }}
                  >
                    <span
                      style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-data-hue)' }}
                    >
                      [Zone 3] Light 1: Price vs MA30 Line
                    </span>
                    <span className="num" style={{ fontSize: '11px', fontWeight: 600 }}>
                      MA30: $129.07 | BOLL LB: $126.50
                    </span>
                  </div>

                  {/* Mini SVG Diagram of Candles + MA30 Curve */}
                  <svg
                    viewBox="0 0 320 90"
                    style={{ width: '100%', height: '84px', marginTop: '8px', display: 'block' }}
                    aria-hidden="true"
                  >
                    {/* MA30 Smooth Line */}
                    <path
                      d="M 10 25 Q 110 28, 200 42 T 310 52"
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="2.5"
                    />
                    <text x="14" y="20" fontSize="10" fill="#0284c7" fontWeight="bold">
                      MA30 Fair-Price Line ($129.07)
                    </text>

                    {/* Sample Candles dipping below MA30 */}
                    <line x1="60" y1="22" x2="60" y2="54" stroke="#b91c1c" strokeWidth="2" />
                    <rect x="54" y="28" width="12" height="20" fill="#b91c1c" rx="1" />

                    <line x1="120" y1="32" x2="120" y2="68" stroke="#b91c1c" strokeWidth="2" />
                    <rect x="114" y="38" width="12" height="22" fill="#b91c1c" rx="1" />

                    <line x1="180" y1="45" x2="180" y2="82" stroke="#b91c1c" strokeWidth="2" />
                    <rect x="174" y="50" width="12" height="22" fill="#b91c1c" rx="1" />

                    <line x1="245" y1="48" x2="245" y2="84" stroke="#15803d" strokeWidth="2" />
                    <rect x="239" y="54" width="12" height="16" fill="#15803d" rx="1" />
                    <text x="205" y="44" fontSize="10" fill="#15803d" fontWeight="bold">
                      Current $128.18 (On Discount)
                    </text>
                  </svg>
                </button>

                {/* Zone 4: Support & Resistance Floors */}
                <button
                  type="button"
                  onClick={() => setActiveId(4)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border:
                      activeId === 4
                        ? '2px solid var(--color-data-hue)'
                        : '1px solid var(--color-border-default)',
                    backgroundColor:
                      activeId === 4 ? 'var(--color-data-hue-subtle)' : 'var(--color-bg-surface)',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-data-hue)' }}
                  >
                    [Zone 4] Support Floors &amp; Resistance Ceiling
                  </div>
                  <div
                    className="num"
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      gap: '8px',
                      fontSize: 'var(--font-size-xs)',
                      marginTop: '4px',
                    }}
                  >
                    <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>
                      Floors: $128.00 / $126.64 / $124.50
                    </span>
                    <span style={{ color: 'var(--color-warning)', fontWeight: 600 }}>
                      Ceiling: $135.00
                    </span>
                  </div>
                </button>

                {/* Zone 5: RSI Sub-Pane */}
                <button
                  type="button"
                  onClick={() => setActiveId(5)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border:
                      activeId === 5
                        ? '2px solid var(--color-data-hue)'
                        : '1px solid var(--color-border-default)',
                    backgroundColor:
                      activeId === 5 ? 'var(--color-data-hue-subtle)' : 'var(--color-bg-surface)',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-data-hue)' }}
                    >
                      [Zone 5] Light 2: RSI Momentum (0 to 100)
                    </span>
                    <span className="status-pill status-pill--positive num">
                      RSI: 32.57 (&le; 36)
                    </span>
                  </div>
                </button>
              </div>

              {/* Right Column: Zone 6 (Order Book Bid %) */}
              <button
                type="button"
                onClick={() => setActiveId(6)}
                style={{
                  textAlign: 'left',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border:
                    activeId === 6
                      ? '2px solid var(--color-data-hue)'
                      : '1px solid var(--color-border-default)',
                  backgroundColor:
                    activeId === 6 ? 'var(--color-data-hue-subtle)' : 'var(--color-bg-surface)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '8px',
                }}
              >
                <div>
                  <div
                    style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-data-hue)' }}
                  >
                    [Zone 6] Light 3: Order Book
                  </div>
                  <div
                    style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}
                  >
                    Waiting Buyers vs Sellers
                  </div>
                </div>

                {/* Tug of war bar */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '11px',
                      fontWeight: 700,
                      marginBottom: '4px',
                    }}
                    className="num"
                  >
                    <span style={{ color: 'var(--color-success)' }}>Buyers 41.6%</span>
                    <span style={{ color: 'var(--color-danger)' }}>58.4% Sellers</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      height: '12px',
                      borderRadius: '9999px',
                      overflow: 'hidden',
                      border: '1px solid var(--color-border-default)',
                    }}
                  >
                    <div style={{ width: '41.6%', backgroundColor: 'var(--color-success)' }} />
                    <div style={{ width: '58.4%', backgroundColor: 'var(--color-danger)' }} />
                  </div>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  Rule: Need <strong>&ge; 40% Buyers</strong> so you are not catching a falling
                  knife.
                </div>
              </button>
            </div>
          </div>

          {/* Right: Beginner Plain-English Decoder Card */}
          <div
            style={{
              padding: 'var(--space-5)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border-default)',
              backgroundColor: 'var(--color-bg-surface)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 'var(--space-4)',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  marginBottom: 'var(--space-2)',
                }}
              >
                <span className="status-pill status-pill--info">{activeZone.badge}</span>
                <code className="num" style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700 }}>
                  {activeZone.screenValue}
                </code>
              </div>

              <h4 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '6px' }}>
                {activeZone.shortTitle}
              </h4>

              <p
                style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 600,
                  color: 'var(--color-data-hue)',
                  marginBottom: 'var(--space-3)',
                }}
              >
                Question it answers: &ldquo;{activeZone.plainQuestion}&rdquo;
              </p>

              <p style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-4)' }}>
                {activeZone.plainExplanation}
              </p>

              <div className="analogy-callout" style={{ marginBlock: '0 var(--space-3)' }}>
                <div className="analogy-callout__header">Everyday Analogy</div>
                <p>{activeZone.analogy}</p>
              </div>

              <div
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-bg-subtle)',
                  border: '1px solid var(--color-border-subtle)',
                  fontSize: 'var(--font-size-xs)',
                }}
              >
                <strong>Concrete Example: </strong>
                <span>{activeZone.concreteExample}</span>
              </div>
            </div>

            <div
              style={{
                paddingTop: 'var(--space-3)',
                borderTop: '1px solid var(--color-border-subtle)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                fontSize: 'var(--font-size-xs)',
              }}
            >
              <span style={{ color: 'var(--color-text-muted)' }}>
                <strong>Next step:</strong> {activeZone.checkerConnection}
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setActiveId(activeId > 1 ? activeId - 1 : ZONES.length)}
                  className="btn-subtle"
                  style={{ minHeight: '32px', padding: '4px 10px', fontSize: '12px' }}
                >
                  &larr; Prev Zone
                </button>
                <button
                  type="button"
                  onClick={() => setActiveId(activeId < ZONES.length ? activeId + 1 : 1)}
                  className="btn-primary"
                  style={{ minHeight: '32px', padding: '4px 10px', fontSize: '12px' }}
                >
                  Next Zone &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sim-box__footer">
        <span>
          <strong>Beginner Golden Rule:</strong> Ignore Futures, Margin, and 1-minute charts. Only
          read <strong>Spot 4H / 1D</strong> and check the 3 Lights before placing any order.
        </span>
        <a href="/checker" style={{ fontWeight: 700 }}>
          Open the 3-Light Signal Helper &rarr;
        </a>
      </div>

      <style>{`
        .screen-guide-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-4);
        }
        @media (min-width: 1024px) {
          .screen-guide-grid {
            grid-template-columns: 1.05fr 0.95fr;
            align-items: stretch;
          }
        }
        .screen-guide-inner-split {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-2);
        }
        @media (min-width: 640px) {
          .screen-guide-inner-split {
            grid-template-columns: 1.8fr 1fr;
          }
        }
      `}</style>
    </div>
  );
}
