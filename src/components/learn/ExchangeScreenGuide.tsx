import { useState } from 'react';

interface ScreenZone {
  id: number;
  shortTitle: string;
  badge: string;
  pinLeft: string;
  pinTop: string;
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
    shortTitle: '1. Timeframe Bar (1m vs 4h / 1D)',
    badge: 'Top-Left Row Above Chart',
    pinLeft: '9%',
    pinTop: '11%',
    screenValue: '1m | 15m | 1h | [4h] | [1D]',
    plainQuestion: 'Why does the chart move so fast when I first open Gate.com?',
    plainExplanation:
      'Look at the top-left row of the screenshot: "1m  15m  1h  4h  1D". On 1m (1-minute), every single trade makes the bars jump like a heartbeat monitor. Clicking "4h" or "1D" zooms out so each bar equals 4 hours or 1 full day.',
    analogy:
      'Staring at a 1m chart is like pressing your nose 2 inches from a TV screen: all you see is flashing pixels. Stepping back to 4h or 1D lets you see the whole picture calmly.',
    concreteExample:
      'In the attached screenshot, "1h" is selected. Before checking any coin, click "4h" or "1D" right next to it.',
    checkerConnection: 'Always switch your exchange to "4H" or "1D" before reading any numbers.',
  },
  {
    id: 2,
    shortTitle: '2. Pair & OHLC Price Bar',
    badge: 'Top-Left Inside Chart',
    pinLeft: '24%',
    pinTop: '18%',
    screenValue: 'BTC/USDT · O 75,903 H 75,932 L 75,889 C 75,925.4',
    plainQuestion: 'What coin am I looking at, and what do O, H, L, C mean?',
    plainExplanation:
      'BTC/USDT means you are pricing Bitcoin in USDT digital dollars. Next to it are four letters for the current candle: O (Open/Start price), H (Highest tip), L (Lowest drop), and C (Current/Closing price).',
    analogy:
      'Just like a daily weather summary that shows: Morning Temp (O), Daytime High (H), Nighttime Low (L), and Current Temp right now (C).',
    concreteExample:
      'In the screenshot, C 75,925.4 (also shown in the green box on the right edge) is the live Current Price.',
    checkerConnection: 'Copy the live "C" price into the "Current Price" box in our Signal Helper.',
  },
  {
    id: 3,
    shortTitle: '3. Candles & Support Bounce Floor',
    badge: 'Main Chart Center',
    pinLeft: '32%',
    pinTop: '52%',
    screenValue: 'Peak ~80,500 -> Support Base ~75,500',
    plainQuestion: 'Where did sellers stop dumping and where did buyers start catching the drop?',
    plainExplanation:
      'In the middle of the screenshot, price rallied to ~80,500 (Resistance Ceiling), dropped in a tall red bar down to ~75,500, and then went sideways in a flat row of small candles. That flat bottom (~75,500) is your Support Floor.',
    analogy:
      'Drop a tennis ball from a table: the table top was the ceiling where it fell from, and the floor where it stops falling and bounces is Support.',
    concreteExample:
      'When you also click [MA] or [BOLL] at the bottom, the 30-bar average line and price tunnel draw right over these candles.',
    checkerConnection:
      'Copy the recent bounce floor prices into "Support Floor 1, 2 & 3" for your split buy plan.',
  },
  {
    id: 4,
    shortTitle: '4. Volume Activity Bars',
    badge: 'Sub-Chart Under Candles',
    pinLeft: '19%',
    pinTop: '81%',
    screenValue: 'Volume 14.51 (Green & Red Pillars)',
    plainQuestion: 'Was that price drop or bounce backed by a real crowd or an empty room?',
    plainExplanation:
      'Right underneath the candles sits "Volume 14.51". Each vertical bar shows how many coins changed hands during that candle above it. Notice the tall red pillar during the big drop, followed by smaller calm bars as selling dried up.',
    analogy:
      'Tall Volume bars mean a packed supermarket; tiny Volume bars mean only a few shoppers are inside.',
    concreteExample:
      'When a big red Volume spike is followed by shrinking bars and flat candles, panic sellers have finished dumping.',
    checkerConnection: 'Use Volume to confirm whether selling pressure is calming down.',
  },
  {
    id: 5,
    shortTitle: '5. Bottom Indicator Strip (MA, BOLL, RSI)',
    badge: 'Bottom Edge of Chart',
    pinLeft: '24%',
    pinTop: '95%',
    screenValue: 'Use ONLY: [MA] [Volume] [BOLL] [RSI]',
    plainQuestion: 'There are 17 tiny buttons at the very bottom! Which ones do I actually click?',
    plainExplanation:
      'Look at the bottom strip of the screenshot: "SRL | Turnover | MA | EMA | Volume | MACD | BOLL | VPVR | SAR | AVL | MTM | VR | DMA | SKDJ | PSY | BBI | >". Beginners only need 3 indicators from this bar: MA (average price), BOLL (price tunnel), and RSI (click the ">" arrow on the right to see RSI).',
    analogy:
      'A microwave has 20 preset buttons (Popcorn, Defrost, Reheat, Grill), but 95% of the time you only need "Time" and "Start". Ignore the other 13 buttons!',
    concreteExample:
      'Tap [MA] to see Light 1 (Price vs Average), tap [BOLL] to see the floor/ceiling bands, and tap [RSI] to check Light 2 (RSI 36 or lower).',
    checkerConnection: 'Copy MA30 into Light 1 and RSI (0-100) into Light 2 in our Signal Checker.',
  },
  {
    id: 6,
    shortTitle: '6. Order Book & Limit Buy Box',
    badge: 'Middle & Right Columns',
    pinLeft: '68%',
    pinTop: '48%',
    screenValue: 'Order Book (Red/Green) + Limit Buy Box',
    plainQuestion: 'Where do I check waiting buyers (Light 3) and where do I place my order?',
    plainExplanation:
      'The middle column ("Order Book") lists Red Sellers on top (75,936.0 down to 75,929.2) and Green Buyers waiting below (75,929.1 down to 75,926.5). The far-right column ("Buy / Limit") is where you type your desired Limit Price, USDT amount, check TP/SL, and click "Buy".',
    analogy:
      'The Order Book is the live auction board showing who is waiting with cash. The "Limit" tab on the right lets you name your own discount price instead of paying full sticker price.',
    concreteExample:
      'In the right panel of the screenshot, "Limit" is selected with Price 75,916.9 USDT, Available 193.26 USDT, and a "TP/SL" checkbox for your Stop-Loss.',
    checkerConnection:
      'Check that Green Buyers make up at least 40% (Light 3), then copy your 3 Limit Buy prices into the right panel.',
  },
];

export default function ExchangeScreenGuide() {
  const [activeId, setActiveId] = useState<number>(5);
  const [viewMode, setViewMode] = useState<'screenshot' | 'diagram'>('screenshot');

  const activeZone = ZONES.find((z) => z.id === activeId) ?? ZONES[0];

  return (
    <div className="sim-box" data-ui="exchange-screen-guide">
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
            <span className="status-pill status-pill--info">Interactive Gate.com Screen Map</span>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-subtle)' }}>
              Click any numbered pin (1 to 6) on the screenshot or tabs below
            </span>
          </div>
          <h3 className="sim-box__title">
            Real Gate.com Spot Screen: Where the Essential Buttons Live
          </h3>
          <p className="sim-box__subtitle">
            Here is an actual Gate.com spot trading screen. Click pins <strong>1 to 6</strong> to
            see exactly where <code>1m / 4h / 1D</code>, <code>MA</code>, <code>BOLL</code>,{' '}
            <code>RSI</code>, the <code>Order Book</code>, and <code>Limit Buy</code> are located.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '6px', flexShrink: 0, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setViewMode('screenshot')}
            className={viewMode === 'screenshot' ? 'btn-primary' : 'btn-secondary'}
            style={{ minHeight: '36px', padding: '6px 12px', fontSize: '12px' }}
          >
            Real Gate.com Screenshot
          </button>
          <button
            type="button"
            onClick={() => setViewMode('diagram')}
            className={viewMode === 'diagram' ? 'btn-primary' : 'btn-secondary'}
            style={{ minHeight: '36px', padding: '6px 12px', fontSize: '12px' }}
          >
            Simplified Beginner Map
          </button>
        </div>
      </div>

      <div className="sim-box__body">
        {/* Step Selector Pills */}
        <div role="tablist" aria-label="Exchange screen zones" className="zone-tabs-grid">
          {ZONES.map((zone) => {
            const isSelected = zone.id === activeId;
            return (
              <button
                key={zone.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveId(zone.id)}
                className={`zone-tab-btn ${isSelected ? 'zone-tab-btn--active' : ''}`}
              >
                {zone.shortTitle}
              </button>
            );
          })}
        </div>

        {/* Main Responsive 2-Column Interactive Grid */}
        <div className="screen-guide-grid">
          {/* Left: Real Gate.com Annotated Screenshot OR Simplified Diagram */}
          {viewMode === 'screenshot' ? (
            <div className="screenshot-stage">
              <div className="screenshot-stage__top-note">
                <span>
                  <strong>Real Gate.com Spot Screen:</strong> Tap any numbered pin (1 to 6) on the
                  image below
                </span>
                <span className="status-pill status-pill--positive">
                  Active Pin #{activeZone.id}
                </span>
              </div>

              <div className="screenshot-canvas">
                <img
                  src="/images/gate-spot-screen.jpg"
                  alt="Annotated Gate.com BTC/USDT Spot trading screen showing timeframe bar, candlestick chart, volume, bottom indicator buttons (MA, BOLL, RSI), order book, and limit buy form"
                  loading="lazy"
                />

                {/* Highlight Box Overlay for Active Zone */}
                {activeId === 1 && (
                  <div
                    className="screenshot-highlight"
                    style={{ left: '0.8%', top: '8%', width: '16%', height: '6.5%' }}
                  />
                )}
                {activeId === 2 && (
                  <div
                    className="screenshot-highlight"
                    style={{ left: '4%', top: '15%', width: '43%', height: '6%' }}
                  />
                )}
                {activeId === 3 && (
                  <div
                    className="screenshot-highlight"
                    style={{ left: '4%', top: '22%', width: '53%', height: '50%' }}
                  />
                )}
                {activeId === 4 && (
                  <div
                    className="screenshot-highlight"
                    style={{ left: '4%', top: '73%', width: '53%', height: '18%' }}
                  />
                )}
                {activeId === 5 && (
                  <div
                    className="screenshot-highlight"
                    style={{ left: '3%', top: '92.5%', width: '51%', height: '6.5%' }}
                  />
                )}
                {activeId === 6 && (
                  <div
                    className="screenshot-highlight"
                    style={{ left: '57.5%', top: '2%', width: '41.5%', height: '94%' }}
                  />
                )}

                {/* Numbered Hotspot Pins */}
                {ZONES.map((zone) => {
                  const isActive = zone.id === activeId;
                  return (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => setActiveId(zone.id)}
                      className={`screenshot-pin ${isActive ? 'screenshot-pin--active' : ''}`}
                      style={{ left: zone.pinLeft, top: zone.pinTop }}
                      aria-label={`Select ${zone.shortTitle}`}
                    >
                      {zone.id}
                    </button>
                  );
                })}
              </div>

              <div className="screenshot-stage__caption">
                <strong>Tip:</strong> On small phone screens, you can also tap the 6 numbered tabs
                above or switch to <em>Simplified Beginner Map</em> for large text blocks.
              </div>
            </div>
          ) : (
            /* Simplified Schematic View */
            <div className="schematic-stage">
              <button
                type="button"
                onClick={() => setActiveId(1)}
                className={`schematic-block ${activeId === 1 ? 'schematic-block--active' : ''}`}
              >
                <div className="schematic-block__row">
                  <span className="schematic-tag">[1] Timeframe Bar</span>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        textDecoration: 'line-through',
                        color: 'var(--color-text-subtle)',
                        fontSize: '11px',
                      }}
                    >
                      1m &nbsp; 15m &nbsp; 1h
                    </span>
                    <span className="status-pill status-pill--info">4h (Recommended)</span>
                    <span className="status-pill status-pill--neutral">1D</span>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveId(2)}
                className={`schematic-block ${activeId === 2 ? 'schematic-block--active' : ''}`}
              >
                <div className="schematic-block__row">
                  <span className="schematic-tag">[2] Pair &amp; OHLC Header</span>
                  <span className="num" style={{ fontSize: '12px', fontWeight: 700 }}>
                    BTC/USDT · O 75,903 H 75,932 L 75,889 C 75,925.4
                  </span>
                </div>
              </button>

              <div className="screen-guide-inner-split">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setActiveId(3)}
                    className={`schematic-block ${activeId === 3 ? 'schematic-block--active' : ''}`}
                  >
                    <div className="schematic-tag">[3] Main Candlesticks + MA / BOLL</div>
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>
                      Green &amp; red price bars + Support Bounce Floor (~$75,500) + MA30 fair-price
                      line.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveId(4)}
                    className={`schematic-block ${activeId === 4 ? 'schematic-block--active' : ''}`}
                  >
                    <div className="schematic-tag">[4] Volume 14.51 (Activity Pillars)</div>
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>
                      Shows how many coins traded during each candle bar.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveId(5)}
                    className={`schematic-block ${activeId === 5 ? 'schematic-block--active' : ''}`}
                  >
                    <div className="schematic-tag">
                      [5] Bottom Indicator Bar (&ldquo;Dozens of Tiny Buttons&rdquo;)
                    </div>
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>
                      Keep ONLY: <strong>MA</strong>, <strong>Volume</strong>, <strong>BOLL</strong>
                      , <strong>RSI</strong>. Ignore SRL, VPVR, SAR, AVL, MTM, VR, DMA, SKDJ, PSY,
                      BBI.
                    </div>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveId(6)}
                  className={`schematic-block ${activeId === 6 ? 'schematic-block--active' : ''}`}
                >
                  <div className="schematic-tag">[6] Order Book &amp; Limit Buy Panel</div>
                  <div style={{ fontSize: '12px', marginTop: '6px' }}>
                    <strong>Order Book:</strong> Red Asks (Sellers) on top vs Green Bids (Buyers) on
                    bottom (Light 3 needs &ge; 40% Buyers).
                  </div>
                  <div style={{ fontSize: '12px', marginTop: '6px' }}>
                    <strong>Right Form:</strong> Choose <strong>Limit</strong>, enter your Support
                    Floor price, check <strong>TP/SL</strong>, and click Buy.
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Right: Beginner Plain-English Decoder Card */}
          <div className="decoder-card">
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
                <strong>On Your Gate.com Screen: </strong>
                <span>{activeZone.concreteExample}</span>
              </div>
            </div>

            <div className="decoder-card__footer">
              <span style={{ color: 'var(--color-text-muted)' }}>
                <strong>Action step:</strong> {activeZone.checkerConnection}
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setActiveId(activeId > 1 ? activeId - 1 : ZONES.length)}
                  className="btn-subtle"
                  style={{ minHeight: '32px', padding: '4px 10px', fontSize: '12px' }}
                >
                  &larr; Prev Pin
                </button>
                <button
                  type="button"
                  onClick={() => setActiveId(activeId < ZONES.length ? activeId + 1 : 1)}
                  className="btn-primary"
                  style={{ minHeight: '32px', padding: '4px 10px', fontSize: '12px' }}
                >
                  Next Pin &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sim-box__footer">
        <span>
          <strong>Beginner Golden Rule:</strong> Ignore the 11 drawing icons on the far left and the
          13 extra acronyms on the bottom bar. Stick to <strong>4h / 1D</strong>,{' '}
          <strong>MA</strong>, <strong>BOLL</strong>, <strong>RSI</strong>, and the{' '}
          <strong>Order Book</strong>.
        </span>
        <a href="/checker" style={{ fontWeight: 700 }}>
          Open the 3-Light Signal Helper &rarr;
        </a>
      </div>

      <style>{`
        .zone-tabs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(165px, 1fr));
          gap: 8px;
          margin-bottom: var(--space-4);
        }
        .zone-tab-btn {
          text-align: left;
          padding: 9px 12px;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border-default);
          background-color: var(--color-bg-surface);
          color: var(--color-text-main);
          cursor: pointer;
          font-size: var(--font-size-xs);
          font-weight: 500;
        }
        .zone-tab-btn--active {
          border-color: var(--color-data-hue);
          background-color: var(--color-data-hue-subtle);
          font-weight: 700;
        }
        .screen-guide-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-4);
        }
        @media (min-width: 1080px) {
          .screen-guide-grid {
            grid-template-columns: 1.25fr 0.95fr;
            align-items: stretch;
          }
        }
        .screenshot-stage {
          padding: var(--space-3);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border-default);
          background-color: var(--color-bg-canvas);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: var(--space-3);
        }
        .screenshot-stage__top-note {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          font-size: var(--font-size-xs);
        }
        .screenshot-canvas {
          position: relative;
          width: 100%;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid var(--color-border-default);
          background-color: #ffffff;
        }
        .screenshot-canvas img {
          width: 100%;
          height: auto;
          display: block;
        }
        .screenshot-highlight {
          position: absolute;
          border: 2px solid #0284c7;
          background-color: rgba(2, 132, 199, 0.14);
          border-radius: 6px;
          pointer-events: none;
        }
        .screenshot-pin {
          position: absolute;
          transform: translate(-50%, -50%);
          width: 26px;
          height: 26px;
          border-radius: 9999px;
          border: 2px solid #ffffff;
          background-color: #0f172a;
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0;
        }
        @media (min-width: 640px) {
          .screenshot-pin {
            width: 30px;
            height: 30px;
            font-size: 13px;
          }
        }
        .screenshot-pin--active {
          background-color: #0284c7;
          transform: translate(-50%, -50%) scale(1.18);
          z-index: 5;
        }
        .screenshot-stage__caption {
          font-size: 11px;
          color: var(--color-text-subtle);
        }
        .schematic-stage {
          padding: var(--space-4);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border-default);
          background-color: var(--color-bg-canvas);
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        .schematic-block {
          width: 100%;
          text-align: left;
          padding: 12px;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border-default);
          background-color: var(--color-bg-surface);
          color: var(--color-text-main);
          cursor: pointer;
        }
        .schematic-block--active {
          border: 2px solid var(--color-data-hue);
          background-color: var(--color-data-hue-subtle);
        }
        .schematic-block__row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .schematic-tag {
          font-size: 11px;
          font-weight: 700;
          color: var(--color-data-hue);
        }
        .screen-guide-inner-split {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-2);
        }
        @media (min-width: 640px) {
          .screen-guide-inner-split {
            grid-template-columns: 1.5fr 1fr;
          }
        }
        .decoder-card {
          padding: var(--space-4);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border-default);
          background-color: var(--color-bg-surface);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: var(--space-4);
        }
        @media (min-width: 640px) {
          .decoder-card {
            padding: var(--space-5);
          }
        }
        .decoder-card__footer {
          padding-top: var(--space-3);
          border-top: 1px solid var(--color-border-subtle);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          font-size: var(--font-size-xs);
        }
      `}</style>
    </div>
  );
}
