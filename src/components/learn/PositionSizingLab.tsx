import { useState } from 'react';

export default function PositionSizingLab() {
  const [totalBudget, setTotalBudget] = useState<number>(233.77);

  // Split-entry ratios from PRD: ~13%, ~21%, ~30%, and ~36% untouched reserve
  const entry1Amount = Math.round(totalBudget * 0.1283 * 100) / 100;
  const entry2Amount = Math.round(totalBudget * 0.2139 * 100) / 100;
  const entry3Amount = Math.round(totalBudget * 0.2994 * 100) / 100;
  const reserveAmount =
    Math.round((totalBudget - (entry1Amount + entry2Amount + entry3Amount)) * 100) / 100;

  // Percentage retained after first test buy
  const cashRetainedAfterEntry1 = Math.round(((totalBudget - entry1Amount) / totalBudget) * 100);

  return (
    <div
      className="surface-card"
      style={{ padding: 'var(--space-6)', marginTop: 'var(--space-6)' }}
      data-ui="position-sizing-lab"
    >
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
          <span className="status-pill status-pill--info">Interactive Lab 6A</span>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
            13% / 21% / 30% Entry Tranches + 36% Safe Reserve
          </span>
        </div>
        <h3 style={{ margin: '0 0 6px 0', fontSize: 'var(--font-size-lg)' }}>
          Test Your Capital Sizing Ladder
        </h3>
        <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
          The number one mistake beginner traders make is clicking &ldquo;100% All-In&rdquo; on
          their first buy. When the market dips further, they run out of cash and panic. Test
          changing your budget below to see how pre-splitting your capital into 3 tranches + a 36%
          reserve protects your peace of mind.
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
            <label
              htmlFor="budget-input"
              style={{
                display: 'block',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 700,
                marginBottom: '6px',
              }}
            >
              Your Total Spot Budget (USDT)
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                id="budget-input"
                type="number"
                min={20}
                max={10000}
                step={10}
                value={totalBudget}
                onChange={(e) => setTotalBudget(Math.max(10, Number(e.target.value)))}
                style={{
                  flex: 1,
                  height: 'var(--control-height)',
                  paddingInline: 'var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border-control)',
                  backgroundColor: 'var(--color-bg-surface)',
                  color: 'var(--color-text-main)',
                  fontSize: 'var(--font-size-sm)',
                }}
              />
              <span className="num" style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)' }}>
                USDT
              </span>
            </div>

            <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '3px 8px', fontSize: '11px' }}
                onClick={() => setTotalBudget(100)}
              >
                $100 USDT
              </button>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '3px 8px', fontSize: '11px' }}
                onClick={() => setTotalBudget(233.77)}
              >
                $233.77 (PRD Example)
              </button>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '3px 8px', fontSize: '11px' }}
                onClick={() => setTotalBudget(500)}
              >
                $500 USDT
              </button>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '3px 8px', fontSize: '11px' }}
                onClick={() => setTotalBudget(1000)}
              >
                $1,000 USDT
              </button>
            </div>
          </div>

          <div
            className="surface-card"
            style={{
              padding: 'var(--space-4)',
              backgroundColor: 'var(--color-pill-positive-bg)',
              border: '1px solid var(--color-pill-positive-border)',
              color: 'var(--color-pill-positive-ink)',
            }}
          >
            <strong
              style={{ fontSize: 'var(--font-size-sm)', display: 'block', marginBottom: '4px' }}
            >
              Ease of Mind Indicator:
            </strong>
            <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', lineHeight: 1.5 }}>
              After executing your first test purchase (
              <strong>${entry1Amount.toFixed(2)} USDT</strong>), you still hold{' '}
              <strong>{cashRetainedAfterEntry1}% of your money safely in cash</strong>! You never
              have to fear a temporary dip because you planned for it.
            </p>
          </div>
        </div>

        {/* Tranche Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Visual Bar */}
          <div
            style={{
              display: 'flex',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              border: '1px solid var(--color-border-default)',
            }}
          >
            <div
              style={{
                flex: 13,
                backgroundColor: 'var(--color-data-hue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 700,
              }}
              title="Tier 1 ~13%"
            >
              13%
            </div>
            <div
              style={{
                flex: 21,
                backgroundColor: 'var(--color-border-strong)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-main)',
                fontSize: '11px',
                fontWeight: 700,
              }}
              title="Tier 2 ~21%"
            >
              21%
            </div>
            <div
              style={{
                flex: 30,
                backgroundColor: 'var(--color-bg-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-main)',
                fontSize: '11px',
                fontWeight: 700,
              }}
              title="Tier 3 ~30%"
            >
              30%
            </div>
            <div
              style={{
                flex: 36,
                backgroundColor: 'var(--color-pill-positive-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-pill-positive-ink)',
                fontSize: '11px',
                fontWeight: 700,
              }}
              title="Reserve ~36%"
            >
              36% Reserve
            </div>
          </div>

          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', marginTop: '4px' }}
          >
            <div
              className="surface-card"
              style={{
                padding: '10px 12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <strong style={{ fontSize: 'var(--font-size-xs)' }}>
                  Entry 1 (~13% - Test Buy):
                </strong>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  At Support Floor 1 (e.g. $88.50)
                </div>
              </div>
              <span className="num" style={{ fontWeight: 700, color: 'var(--color-data-hue)' }}>
                ${entry1Amount.toFixed(2)} USDT
              </span>
            </div>

            <div
              className="surface-card"
              style={{
                padding: '10px 12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <strong style={{ fontSize: 'var(--font-size-xs)' }}>
                  Entry 2 (~21% - Deeper Value):
                </strong>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  At Support Floor 2 (e.g. $85.00)
                </div>
              </div>
              <span className="num" style={{ fontWeight: 700 }}>
                ${entry2Amount.toFixed(2)} USDT
              </span>
            </div>

            <div
              className="surface-card"
              style={{
                padding: '10px 12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <strong style={{ fontSize: 'var(--font-size-xs)' }}>
                  Entry 3 (~30% - Maximum Discount):
                </strong>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  At Support Floor 3 (e.g. $81.20)
                </div>
              </div>
              <span className="num" style={{ fontWeight: 700 }}>
                ${entry3Amount.toFixed(2)} USDT
              </span>
            </div>

            <div
              className="surface-card"
              style={{
                padding: '10px 12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'var(--color-pill-positive-bg)',
                borderColor: 'var(--color-pill-positive-border)',
              }}
            >
              <div>
                <strong
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-pill-positive-ink)',
                  }}
                >
                  Safe Cash Reserve (~36%):
                </strong>
                <div style={{ fontSize: '11px', color: 'var(--color-pill-positive-ink)' }}>
                  Kept strictly in USDT wallet
                </div>
              </div>
              <span
                className="num"
                style={{ fontWeight: 700, color: 'var(--color-pill-positive-ink)' }}
              >
                ${reserveAmount.toFixed(2)} USDT
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
