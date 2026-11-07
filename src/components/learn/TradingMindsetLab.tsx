import { useState } from 'react';

export default function TradingMindsetLab() {
  const [activeScenario, setActiveScenario] = useState<'breathing' | 'broken'>('breathing');

  return (
    <div
      className="surface-card"
      style={{ padding: 'var(--space-6)', marginTop: 'var(--space-6)' }}
      data-ui="mindset-lab"
    >
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
          <span className="status-pill status-pill--info">Interactive Lab 7A</span>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
            Market Breathing (5%–7% Dip) vs Broken Floor
          </span>
        </div>
        <h3 style={{ margin: '0 0 6px 0', fontSize: 'var(--font-size-lg)' }}>
          Normal Market Breathing vs. Genuinely Broken Plan
        </h3>
        <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
          When beginners see a red candle, their gut reaction is panic selling. But markets breathe:
          a 5% to 7% pullback that stays <em>above</em> your pre-agreed stop-loss is completely
          normal. Toggle between both scenarios below to train your eyes.
        </p>
      </div>

      {/* Scenario Selector */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: 'var(--space-4)' }}>
        <button
          type="button"
          className={`btn-secondary ${activeScenario === 'breathing' ? 'btn-secondary--active' : ''}`}
          style={{
            flex: 1,
            padding: '10px 14px',
            border:
              activeScenario === 'breathing'
                ? '2px solid var(--color-data-hue)'
                : '1px solid var(--color-border-default)',
            backgroundColor:
              activeScenario === 'breathing'
                ? 'var(--color-data-hue-subtle)'
                : 'var(--color-bg-surface)',
            cursor: 'pointer',
            textAlign: 'left',
          }}
          onClick={() => setActiveScenario('breathing')}
        >
          <div style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)' }}>
            Scenario 1: Market Breathing (Hold Calmly)
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            Price dips 6.2% into support, but stays well above the Stop-Loss.
          </div>
        </button>

        <button
          type="button"
          className={`btn-secondary ${activeScenario === 'broken' ? 'btn-secondary--active' : ''}`}
          style={{
            flex: 1,
            padding: '10px 14px',
            border:
              activeScenario === 'broken'
                ? '2px solid var(--color-danger)'
                : '1px solid var(--color-border-default)',
            backgroundColor:
              activeScenario === 'broken'
                ? 'var(--color-pill-negative-bg)'
                : 'var(--color-bg-surface)',
            cursor: 'pointer',
            textAlign: 'left',
          }}
          onClick={() => setActiveScenario('broken')}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 'var(--font-size-sm)',
              color: activeScenario === 'broken' ? 'var(--color-danger)' : 'inherit',
            }}
          >
            Scenario 2: Broken Floor (Follow Your Stop)
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            Price closes &gt;2% below lowest support. The bounce hypothesis failed.
          </div>
        </button>
      </div>

      {/* Diagram and Explanation */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-6)',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--color-bg-canvas)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border-default)',
            padding: 'var(--space-4)',
          }}
        >
          <svg viewBox="0 0 320 180" style={{ width: '100%', height: 'auto', display: 'block' }}>
            {/* Support line */}
            <line
              x1="20"
              y1="110"
              x2="300"
              y2="110"
              stroke="var(--color-data-hue)"
              strokeWidth="2"
            />
            <text x="24" y="105" fontSize="10" fontWeight="bold" fill="var(--color-data-hue)">
              Support Floor: $81.20 USDT
            </text>

            {/* Stop Loss Line */}
            <line
              x1="20"
              y1="145"
              x2="300"
              y2="145"
              stroke="var(--color-danger)"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
            <text x="24" y="140" fontSize="10" fontWeight="bold" fill="var(--color-danger)">
              Stop-Loss (-2%): $79.58 USDT
            </text>

            {/* Price Movement Wave */}
            {activeScenario === 'breathing' ? (
              <g>
                {/* Wave down to 82.50 then bounce */}
                <path
                  d="M 30,50 Q 80,45 110,75 T 180,118 Q 220,120 250,85 T 300,60"
                  fill="none"
                  stroke="var(--color-text-main)"
                  strokeWidth="2.5"
                />
                <circle cx="180" cy="118" r="5" fill="var(--color-up)" />
                <text x="140" y="132" fontSize="9.5" fontWeight="bold" fill="var(--color-up-ink)">
                  Low: $82.50 (Above stop)
                </text>
              </g>
            ) : (
              <g>
                {/* Wave crashing through 79.58 */}
                <path
                  d="M 30,50 Q 80,45 110,75 T 180,118 Q 210,135 240,158 T 300,170"
                  fill="none"
                  stroke="var(--color-danger)"
                  strokeWidth="2.5"
                />
                <circle cx="240" cy="158" r="5" fill="var(--color-danger)" />
                <text x="170" y="172" fontSize="9.5" fontWeight="bold" fill="var(--color-danger)">
                  Close: $78.80 (Stop Triggered)
                </text>
              </g>
            )}
          </svg>
        </div>

        <div>
          {activeScenario === 'breathing' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span
                className="status-pill status-pill--positive"
                style={{ alignSelf: 'flex-start' }}
              >
                &#10003; Calm Mindset: Do Nothing Urgent
              </span>
              <h4 style={{ margin: 0, fontSize: 'var(--font-size-base)' }}>
                This is normal volatility, not a disaster
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-muted)',
                  lineHeight: 1.5,
                }}
              >
                Price pulled back 6.2% from $88 to $82.50. Because your pre-agreed Stop-Loss sits at
                $79.58, the trade is still 100% valid. Selling here out of panic is how beginner
                traders repeatedly buy high and sell low.
              </p>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: '20px',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-muted)',
                }}
              >
                <li>Do not stare at the 1-minute chart.</li>
                <li>Let your resting Limit Buys fill at lower support if price reaches them.</li>
                <li>Keep your 36% reserve safely in cash.</li>
              </ul>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span
                className="status-pill status-pill--negative"
                style={{ alignSelf: 'flex-start' }}
              >
                ! Plan Broken: Execute Stop Immediately
              </span>
              <h4 style={{ margin: 0, fontSize: 'var(--font-size-base)' }}>
                The reason you bought is no longer valid
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-muted)',
                  lineHeight: 1.5,
                }}
              >
                Price closed below $79.58. The floor cracked. There is no shame in a stopped trade:
                you only risked a pre-calculated slice, while 36% of your capital was preserved
                untouched in cash.
              </p>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: '20px',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-muted)',
                }}
              >
                <li>Never move your stop-loss lower during a drop.</li>
                <li>Never throw your 36% cash reserve into a falling knife.</li>
                <li>Exit calmly and wait for a brand-new 3-Light setup on another day.</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
