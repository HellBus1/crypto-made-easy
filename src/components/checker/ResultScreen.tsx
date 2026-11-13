import type { SignalEvaluation, SignalInput } from '../../lib/signal';

interface ResultScreenProps {
  input: SignalInput;
  evaluation: SignalEvaluation;
  onUpdateCustomStop?: (newStop: number | undefined) => void;
  onUpdateCustomTakeProfit?: (newTp: number | undefined) => void;
}

export default function ResultScreen({
  input,
  evaluation,
  onUpdateCustomStop,
  onUpdateCustomTakeProfit,
}: ResultScreenProps) {
  if (!evaluation.valid) {
    return (
      <section
        className="result-screen result-screen--invalid"
        data-ui="result-screen"
        data-testid="checker-validation-error"
        role="alert"
        aria-live="assertive"
      >
        <div className="result-error-banner">
          <div className="result-error-banner__header">
            <span className="status-pill status-pill--negative">
              &#10005; Input Check Needed ({evaluation.errors.length})
            </span>
            <strong>Please fix the highlighted chart readings before calculating your plan</strong>
          </div>
          <p className="result-error-banner__sub">
            To protect your budget from typos, the calculator waits until all required numbers fall
            within valid chart ranges (for example, RSI and Order Book Bid % must be between 0 and
            100).
          </p>
          <ul className="result-error-list">
            {evaluation.errors.map((err, idx) => (
              <li key={`${err.field}-${idx}`}>
                <strong>{err.field.toUpperCase()}:</strong> {err.message}
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  const { plan } = evaluation;
  const tickerUpper = input.ticker.trim().toUpperCase() || 'COIN';

  const badgePillClass =
    evaluation.state === 'BUY_ZONE'
      ? 'status-pill status-pill--positive'
      : evaluation.state === 'TAKE_PROFIT'
        ? 'status-pill status-pill--info'
        : evaluation.state === 'PLAN_BROKEN'
          ? 'status-pill status-pill--negative'
          : 'status-pill status-pill--warning';

  const badgeIcon =
    evaluation.state === 'BUY_ZONE'
      ? '\u2713'
      : evaluation.state === 'TAKE_PROFIT'
        ? '\u2191'
        : evaluation.state === 'PLAN_BROKEN'
          ? '!'
          : '\u2022';

  // Calculate visual ladder positions for SVG diagram
  const allLevels = [
    input.currentPrice,
    input.ma30,
    ...(plan ? plan.tranches.map((t) => t.limitPrice) : []),
    ...(plan ? [plan.stopLossPrice, plan.takeProfitPrice] : []),
  ].filter((n) => Number.isFinite(n) && n > 0);

  const minLevel = Math.min(...allLevels) * 0.985;
  const maxLevel = Math.max(...allLevels) * 1.015;
  const levelSpan = Math.max(maxLevel - minLevel, 0.0001);

  const toY = (price: number) => {
    const ratio = (maxLevel - price) / levelSpan;
    return Math.round((24 + Math.min(Math.max(ratio, 0), 1) * 172) * 10) / 10;
  };

  return (
    <section
      className="result-screen"
      data-ui="result-screen"
      data-testid="checker-result-screen"
      aria-live="polite"
    >
      {/* Gentle Warnings (e.g. Support entered above current price) */}
      {evaluation.warnings.length > 0 && (
        <div className="result-warning-banner" data-testid="checker-warnings">
          <div className="result-warning-banner__title">
            <span className="status-pill status-pill--warning">! Gentle Chart Note</span>
          </div>
          <ul className="result-warning-list">
            {evaluation.warnings.map((warn, idx) => (
              <li key={`${warn.field}-${idx}`}>{warn.message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Echo of Entered Values (Mitigates Manual Entry Typos - PRD Section 11) */}
      <div className="result-echo-strip" data-testid="checker-input-echo">
        <span className="result-echo-strip__label">Checked Readings:</span>
        <span className="result-echo-chip num">
          <strong>{tickerUpper}/USDT</strong> ({input.timeframe})
        </span>
        <span className="result-echo-chip num">Price: ${input.currentPrice}</span>
        <span className="result-echo-chip num">MA30: ${input.ma30}</span>
        {input.bollLower !== undefined && (
          <span className="result-echo-chip num">BOLL LB: ${input.bollLower}</span>
        )}
        {input.bollUpper !== undefined && (
          <span className="result-echo-chip num">BOLL UB: ${input.bollUpper}</span>
        )}
        <span className="result-echo-chip num">RSI: {input.rsi}</span>
        <span className="result-echo-chip num">
          Order Book: {input.bidPercent}% Bid / {evaluation.askPercent}% Ask
        </span>
        <span className="result-echo-chip num">Budget: ${input.totalCapital} USDT</span>
        <span className="result-echo-chip">
          Status: {input.isHolding ? 'Holding Coin' : 'Not Holding Yet'}
        </span>
      </div>

      {/* 1. SIGNAL BADGE (FR-5 Step 1) */}
      <div className="result-card result-badge-card" data-testid="signal-badge-card">
        <div className="result-badge-card__top">
          <div className="result-badge-card__Left">
            <span className="result-step-tag">1. Signal Decision</span>
            <div className="result-badge-row">
              <span
                className={`${badgePillClass} result-main-badge`}
                data-testid="signal-state-badge"
              >
                <span aria-hidden="true">{badgeIcon}</span> {evaluation.badgeLabel}
              </span>
              <span className="status-pill status-pill--neutral num">
                {evaluation.buyLightsCount} of 3 Buy Lights ON
              </span>
              {input.isHolding && (
                <span className="status-pill status-pill--info num">
                  {evaluation.sellLightsCount} of 3 Sell Lights Active
                </span>
              )}
            </div>
          </div>
          <div className="result-badge-card__ticker num">
            {tickerUpper}/USDT &middot; {input.timeframe}
          </div>
        </div>

        <p className="result-summary-reason" data-testid="signal-summary-reason">
          {evaluation.summaryReason}
        </p>
      </div>

      {/* Market Context Caution Banner (BTC Crash / Downtrend Guardrail) */}
      {evaluation.marketContextCaution && evaluation.marketContextCaution.triggered && (
        <div
          className="result-context-caution"
          role="alert"
          data-testid="market-context-caution-banner"
        >
          <div className="result-context-caution__header">
            <span className="status-pill status-pill--warning">! Market Context Caution</span>
            <strong>{evaluation.marketContextCaution.headline}</strong>
          </div>
          <p className="result-context-caution__reason">{evaluation.marketContextCaution.reason}</p>
          <p className="result-context-caution__action">
            <strong>Protective Rule:</strong> Wait or Skip new altcoin buys even when all 3 lights
            turn green if Bitcoin is crashing or multi-day structure is breaking lower.
          </p>
        </div>
      )}

      {/* 2. THE 3 LIGHTS PANEL (FR-5 Step 2) */}
      <div className="result-card" data-testid="three-lights-panel">
        <div className="result-card__header">
          <span className="result-step-tag">2. The 3-Light Safety Breakdown</span>
          <span className="result-card__hint">
            All 3 buy lights must be ON at the same time to trigger a Buy Zone
          </span>
        </div>

        <div className="lights-grid">
          {evaluation.lights.map((light) => {
            const isBuyOn = light.buyOn;
            return (
              <div
                key={light.id}
                className={`light-item ${isBuyOn ? 'light-item--on' : 'light-item--off'}`}
                data-testid={`light-card-${light.id}`}
              >
                <div className="light-item__top">
                  <span className="light-item__title">
                    Light {light.id}: {light.name}
                  </span>
                  <span
                    className={
                      isBuyOn
                        ? 'status-pill status-pill--positive'
                        : 'status-pill status-pill--neutral'
                    }
                    data-testid={`light-status-${light.id}`}
                  >
                    <span aria-hidden="true">{isBuyOn ? '\u2713' : '\u2715'}</span>{' '}
                    {isBuyOn ? 'ON (Pass)' : 'OFF (Wait)'}
                  </span>
                </div>

                <div className="light-item__meaning">{light.meaning}</div>
                <p className="light-item__detail">{light.detail}</p>

                {input.isHolding && (
                  <div className="light-item__sell-note">
                    Sell-side check:{' '}
                    <strong>{light.sellOn ? 'Warning Active' : 'Calm / Not Overheated'}</strong>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. POSITION-SIZING PLAN CARD (FR-4 & FR-5 Step 3) */}
      {plan && (
        <div className="result-card" data-testid="position-plan-card">
          <div className="result-card__header">
            <div>
              <span className="result-step-tag">
                3. Your 3-Tier Split-Entry &amp; Cash Reserve Plan
              </span>
              <h3 className="result-card__title">
                Budget Allocation for <span className="num">${plan.totalCapital} USDT</span>
              </h3>
            </div>
            <div className="reserve-highlight-pill status-pill status-pill--positive num">
              &#10003; You still hold {plan.remainingCashAfterEntry1Percent}% in USDT after Entry 1
            </div>
          </div>

          {/* Calming Reserve Callout (FR-4 Mandatory Line) */}
          <div className="reserve-calm-banner" data-testid="reserve-calm-banner">
            <strong>Ease-of-Mind Cash Rule:</strong> Even if you place Entry 1 right now, you still
            hold <strong>{plan.remainingCashAfterEntry1Percent}% of your capital in USDT</strong>.
            And even if all 3 support tiers fill during a deep dip,{' '}
            <strong className="num">
              ${plan.cashReserveUsdt.toFixed(2)} USDT ({plan.cashReservePercent}%)
            </strong>{' '}
            stays untouched in your wallet as your safety reserve.
          </div>

          {/* 4-Slice Visual Budget Bar */}
          <div className="budget-slices-bar" aria-label="Capital allocation proportions">
            <div className="budget-slice budget-slice--t1" style={{ flex: 13 }}>
              <span>Buy 1 (~13%)</span>
              <strong className="num">${plan.tranches[0].amountUsdt.toFixed(2)}</strong>
            </div>
            <div className="budget-slice budget-slice--t2" style={{ flex: 21 }}>
              <span>Buy 2 (~21%)</span>
              <strong className="num">${plan.tranches[1].amountUsdt.toFixed(2)}</strong>
            </div>
            <div className="budget-slice budget-slice--t3" style={{ flex: 30 }}>
              <span>Buy 3 (~30%)</span>
              <strong className="num">${plan.tranches[2].amountUsdt.toFixed(2)}</strong>
            </div>
            <div className="budget-slice budget-slice--reserve" style={{ flex: 36 }}>
              <span>Safe Cash Reserve (~36%)</span>
              <strong className="num">${plan.cashReserveUsdt.toFixed(2)}</strong>
            </div>
          </div>

          {/* Tranches Table + Visual Price Ladder */}
          <div className="plan-main-grid">
            <div className="plan-table-wrap">
              <table className="plan-table" data-testid="ladder-table">
                <thead>
                  <tr>
                    <th>Order Slice</th>
                    <th>Share</th>
                    <th>Limit Price (USDT)</th>
                    <th>USDT Amount</th>
                    <th>Est. {tickerUpper} Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {plan.tranches.map((tranche) => (
                    <tr key={tranche.tier} data-testid={`tranche-row-${tranche.tier}`}>
                      <td>
                        <strong>{tranche.label}</strong>
                      </td>
                      <td className="num">
                        ~{tranche.nominalSharePercent}% ({tranche.actualSharePercent}%)
                      </td>
                      <td className="num">${tranche.limitPrice}</td>
                      <td className="num">
                        <strong>${tranche.amountUsdt.toFixed(2)}</strong>
                      </td>
                      <td className="num">
                        {tranche.estimatedQuantity} {tickerUpper}
                      </td>
                    </tr>
                  ))}
                  <tr className="plan-table__reserve-row" data-testid="tranche-row-reserve">
                    <td>
                      <strong>Untouched Cash Reserve</strong>
                    </td>
                    <td className="num">~36% ({plan.cashReservePercent}%)</td>
                    <td>Keep in USDT wallet</td>
                    <td className="num">
                      <strong>${plan.cashReserveUsdt.toFixed(2)}</strong>
                    </td>
                    <td>Safety cushion</td>
                  </tr>
                </tbody>
              </table>

              {/* Summary KPIs if all 3 tiers fill + Editable Stop & Target */}
              <div className="plan-kpis-grid">
                <div className="plan-kpi-box">
                  <span className="plan-kpi-box__label">If All 3 Tiers Fill (64% Deployed)</span>
                  <strong className="plan-kpi-box__val num">
                    Avg Buy: ${plan.allFilledAveragePrice} USDT
                  </strong>
                  <span className="plan-kpi-box__sub num">
                    Total: ${plan.totalAllocatedUsdt.toFixed(2)} USDT ({plan.totalEstimatedQuantity}{' '}
                    {tickerUpper})
                  </span>
                </div>

                <div className="plan-kpi-box plan-kpi-box--stop" data-testid="stop-loss-box">
                  <span className="plan-kpi-box__label">
                    Pre-Agreed Stop-Loss (&ldquo;Plan Broken&rdquo;)
                  </span>
                  <strong
                    className="plan-kpi-box__val num"
                    style={{ color: 'var(--color-danger)' }}
                  >
                    ${plan.stopLossPrice} USDT ({plan.stopLossDistanceFromAvgPercent}% vs avg)
                  </strong>
                  <span className="plan-kpi-box__sub">
                    If price closes below this level on the {input.timeframe} timeframe, the plan is
                    broken.
                  </span>
                  {onUpdateCustomStop && (
                    <div className="inline-override-control">
                      <label htmlFor="override-stop-input">Edit Stop (USDT):</label>
                      <input
                        id="override-stop-input"
                        type="number"
                        step="any"
                        min="0.0001"
                        placeholder={String(plan.stopLossPrice)}
                        value={input.customStopLoss ?? ''}
                        onChange={(e) => {
                          const raw = e.target.value;
                          onUpdateCustomStop(raw === '' ? undefined : Number(raw));
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="plan-kpi-box plan-kpi-box--tp" data-testid="take-profit-box">
                  <span className="plan-kpi-box__label">Take-Profit Target (Ceiling)</span>
                  <strong
                    className="plan-kpi-box__val num"
                    style={{ color: 'var(--color-up-ink)' }}
                  >
                    ${plan.takeProfitPrice} USDT (
                    {plan.takeProfitGainFromEntry1Percent >= 0 ? '+' : ''}
                    {plan.takeProfitGainFromEntry1Percent}% from Buy 1)
                  </strong>
                  <span className="plan-kpi-box__sub">
                    Defaulted to nearest resistance ceiling (+8% fallback if none entered).
                  </span>
                  {onUpdateCustomTakeProfit && (
                    <div className="inline-override-control">
                      <label htmlFor="override-tp-input">Edit Target (USDT):</label>
                      <input
                        id="override-tp-input"
                        type="number"
                        step="any"
                        min="0.0001"
                        placeholder={String(plan.takeProfitPrice)}
                        value={input.customTakeProfit ?? ''}
                        onChange={(e) => {
                          const raw = e.target.value;
                          onUpdateCustomTakeProfit(raw === '' ? undefined : Number(raw));
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Visual Price Ladder SVG Diagram */}
            <div className="plan-ladder-svg-box">
              <div className="plan-ladder-svg-box__title">Visual Price &amp; Order Map</div>
              <svg
                viewBox="0 0 300 220"
                style={{ width: '100%', height: 'auto', display: 'block' }}
                role="img"
                aria-label={`Price ladder map showing current price ${input.currentPrice}, take profit ${plan.takeProfitPrice}, 3 buy tiers, and stop loss ${plan.stopLossPrice}`}
              >
                <rect x="0" y="0" width="300" height="220" rx="8" fill="var(--color-bg-canvas)" />

                {/* Take Profit Line */}
                <line
                  x1="16"
                  y1={toY(plan.takeProfitPrice)}
                  x2="284"
                  y2={toY(plan.takeProfitPrice)}
                  stroke="var(--color-up)"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                <text
                  x="20"
                  y={Math.max(14, toY(plan.takeProfitPrice) - 5)}
                  fontSize="10"
                  fontWeight="bold"
                  fill="var(--color-up-ink)"
                >
                  Take Profit Target: ${plan.takeProfitPrice} (+
                  {plan.takeProfitGainFromEntry1Percent}%)
                </text>

                {/* Current Price Line */}
                <line
                  x1="16"
                  y1={toY(input.currentPrice)}
                  x2="284"
                  y2={toY(input.currentPrice)}
                  stroke="var(--color-text-main)"
                  strokeWidth="2"
                />
                <text
                  x="20"
                  y={toY(input.currentPrice) - 5}
                  fontSize="10"
                  fontWeight="bold"
                  fill="var(--color-text-main)"
                >
                  Current Price: ${input.currentPrice}
                </text>

                {/* 3 Support Entry Tiers */}
                {plan.tranches.map((t) => {
                  const y = toY(t.limitPrice);
                  return (
                    <g key={t.tier}>
                      <line
                        x1="16"
                        y1={y}
                        x2="284"
                        y2={y}
                        stroke="var(--color-data-hue)"
                        strokeWidth="1.5"
                      />
                      <text
                        x="200"
                        y={y - 4}
                        fontSize="9.5"
                        fontWeight="bold"
                        fill="var(--color-data-hue)"
                      >
                        Buy {t.tier}: ${t.limitPrice} (${t.amountUsdt.toFixed(0)})
                      </text>
                    </g>
                  );
                })}

                {/* Stop-Loss Line */}
                <line
                  x1="16"
                  y1={toY(plan.stopLossPrice)}
                  x2="284"
                  y2={toY(plan.stopLossPrice)}
                  stroke="var(--color-danger)"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                />
                <text
                  x="20"
                  y={Math.min(212, toY(plan.stopLossPrice) + 12)}
                  fontSize="10"
                  fontWeight="bold"
                  fill="var(--color-danger)"
                >
                  Stop-Loss (-2% below floor): ${plan.stopLossPrice}
                </text>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* 4. CALM REMINDERS: WHAT TO DO & WHAT NOT TO DO (FR-5 Step 4) */}
      <div className="result-card" data-testid="calm-reminders-card">
        <span className="result-step-tag">4. Calm Execution Reminders</span>
        <div className="reminders-grid">
          <div className="reminder-box reminder-box--do">
            <h4 className="reminder-box__title">&#10003; What To Do Now</h4>
            <ul className="reminder-list">
              {evaluation.whatToDo.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="reminder-box reminder-box--dont" data-testid="what-not-to-do-box">
            <h4 className="reminder-box__title">&#10005; What Not To Do</h4>
            <ul className="reminder-list">
              {evaluation.whatNotToDo.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 5. SUPPORTING CONTEXT: MACD, VOLUME & LEVEL DISTANCES (FR-5 Step 5) */}
      <div className="result-card" data-testid="supporting-context-card">
        <div className="result-card__header">
          <span className="result-step-tag">
            5. Supporting Chart Context (Does Not Override the 3 Lights)
          </span>
        </div>
        <ul className="supporting-notes-list">
          {evaluation.supportingNotes.map((note, idx) => (
            <li key={idx}>{note}</li>
          ))}
        </ul>
      </div>

      {/* 6. MANDATORY RISK NOTE & DISCLAIMER (FR-5 Step 6 & FR-7) */}
      <div className="result-disclaimer" role="note" data-testid="result-risk-disclaimer">
        <strong>6. Educational Checklist &amp; Risk Notice:</strong> This tool is an arithmetic
        checklist, not financial or investment advice, and it does not predict prices. Even when all
        3 lights align in a &ldquo;Buy Zone,&rdquo; a coin can continue falling during a broader
        market downtrend. Always use your pre-agreed Stop-Loss level ($
        {plan ? plan.stopLossPrice : '--'} USDT), keep your 36% cash reserve untouched, and never
        trade with money you cannot afford to lose.
      </div>

      <div className="result-journal-cta">
        <span>
          Practicing your 10 paper-trade checks before putting real money on the exchange?
        </span>
        <a href="/journal" className="btn-secondary" data-testid="result-journal-link">
          Open Paper-Trade Journal &rarr;
        </a>
      </div>

      <style>{`
        .result-screen {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          margin-top: var(--space-5);
        }

        .result-error-banner {
          padding: var(--space-4) var(--space-5);
          border-radius: var(--radius-lg);
          border: 2px solid var(--color-danger);
          background-color: var(--color-pill-negative-bg);
          color: var(--color-text-main);
        }

        .result-error-banner__header {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-2);
          font-size: var(--font-size-sm);
        }

        .result-error-banner__sub {
          font-size: var(--font-size-xs);
          color: var(--color-text-muted);
          margin-bottom: var(--space-3);
        }

        .result-error-list {
          margin: 0;
          padding-left: var(--space-5);
          font-size: var(--font-size-xs);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .result-warning-banner {
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-pill-warning-border);
          background-color: var(--color-pill-warning-bg);
          font-size: var(--font-size-xs);
        }

        .result-warning-banner__title {
          margin-bottom: 6px;
        }

        .result-warning-list {
          margin: 0;
          padding-left: var(--space-5);
          color: var(--color-text-main);
        }

        .result-echo-strip {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px;
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-md);
          background-color: var(--color-bg-subtle);
          border: 1px solid var(--color-border-subtle);
          font-size: 11px;
        }

        .result-echo-strip__label {
          font-weight: 700;
          color: var(--color-text-muted);
          margin-right: 4px;
        }

        .result-echo-chip {
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          background-color: var(--color-bg-surface);
          border: 1px solid var(--color-border-default);
          color: var(--color-text-main);
        }

        .result-card {
          padding: var(--space-5);
          border-radius: var(--radius-lg);
          background-color: var(--color-bg-surface);
          border: 1px solid var(--color-border-default);
        }

        .result-step-tag {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-data-hue);
          margin-bottom: 6px;
        }

        .result-badge-card__top {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: space-between;
          gap: var(--space-3);
          margin-bottom: var(--space-3);
        }

        .result-badge-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
        }

        .result-main-badge {
          font-size: var(--font-size-base);
          padding: 6px 14px;
        }

        .result-badge-card__ticker {
          font-size: var(--font-size-sm);
          font-weight: 700;
          color: var(--color-text-muted);
        }

        .result-summary-reason {
          margin: 0;
          font-size: var(--font-size-base);
          color: var(--color-text-main);
          line-height: 1.55;
        }

        .result-card__header {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-2);
          margin-bottom: var(--space-3);
        }

        .result-card__title {
          font-size: var(--font-size-lg);
          margin: 0;
        }

        .result-card__hint {
          font-size: var(--font-size-xs);
          color: var(--color-text-subtle);
        }

        .lights-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-3);
        }

        @media (min-width: 900px) {
          .lights-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .light-item {
          padding: var(--space-4);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border-default);
          background-color: var(--color-bg-canvas);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .light-item--on {
          border-color: var(--color-pill-positive-border);
          background-color: var(--color-bg-surface);
        }

        .light-item__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .light-item__title {
          font-size: var(--font-size-xs);
          font-weight: 700;
          color: var(--color-text-main);
        }

        .light-item__meaning {
          font-size: var(--font-size-xs);
          font-weight: 700;
          color: var(--color-data-hue);
        }

        .light-item__detail {
          margin: 0;
          font-size: var(--font-size-xs);
          color: var(--color-text-muted);
          line-height: 1.45;
        }

        .light-item__sell-note {
          margin-top: auto;
          padding-top: 6px;
          border-top: 1px dashed var(--color-border-subtle);
          font-size: 11px;
          color: var(--color-text-subtle);
        }

        .reserve-calm-banner {
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-md);
          background-color: var(--color-pill-positive-bg);
          border: 1px solid var(--color-pill-positive-border);
          color: var(--color-pill-positive-ink);
          font-size: var(--font-size-xs);
          line-height: 1.5;
          margin-bottom: var(--space-4);
        }

        .budget-slices-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: var(--space-4);
        }

        .budget-slice {
          min-width: 110px;
          padding: 8px 10px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-border-default);
          background-color: var(--color-bg-subtle);
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-size: 11px;
        }

        .budget-slice--reserve {
          background-color: var(--color-pill-positive-bg);
          border-color: var(--color-pill-positive-border);
          color: var(--color-pill-positive-ink);
        }

        .plan-main-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-4);
        }

        @media (min-width: 1100px) {
          .plan-main-grid {
            grid-template-columns: 1.45fr 0.85fr;
            align-items: start;
          }
        }

        .plan-table-wrap {
          overflow-x: auto;
        }

        .plan-table {
          width: 100%;
          border-collapse: collapse;
          font-size: var(--font-size-xs);
          margin-bottom: var(--space-4);
        }

        .plan-table th,
        .plan-table td {
          padding: 8px 10px;
          text-align: left;
          border-bottom: 1px solid var(--color-border-subtle);
        }

        .plan-table th {
          font-weight: 700;
          color: var(--color-text-muted);
          background-color: var(--color-bg-subtle);
        }

        .plan-table__reserve-row {
          background-color: var(--color-pill-positive-bg);
          color: var(--color-pill-positive-ink);
        }

        .plan-kpis-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-3);
        }

        @media (min-width: 680px) {
          .plan-kpis-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .plan-kpi-box {
          padding: var(--space-3);
          border-radius: var(--radius-md);
          background-color: var(--color-bg-canvas);
          border: 1px solid var(--color-border-default);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .plan-kpi-box__label {
          font-size: 11px;
          font-weight: 700;
          color: var(--color-text-muted);
        }

        .plan-kpi-box__val {
          font-size: var(--font-size-sm);
        }

        .plan-kpi-box__sub {
          font-size: 11px;
          color: var(--color-text-subtle);
          line-height: 1.4;
        }

        .inline-override-control {
          margin-top: 6px;
          padding-top: 6px;
          border-top: 1px dashed var(--color-border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
          font-size: 11px;
        }

        .inline-override-control input {
          width: 90px;
          padding: 3px 6px;
          font-size: 11px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-border-control);
          background-color: var(--color-bg-surface);
          color: var(--color-text-main);
        }

        .plan-ladder-svg-box {
          padding: var(--space-3);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border-default);
          background-color: var(--color-bg-subtle);
        }

        .plan-ladder-svg-box__title {
          font-size: 11px;
          font-weight: 700;
          color: var(--color-text-muted);
          margin-bottom: 6px;
        }

        .reminders-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-3);
          margin-top: var(--space-2);
        }

        @media (min-width: 768px) {
          .reminders-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .reminder-box {
          padding: var(--space-4);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border-default);
        }

        .reminder-box--do {
          background-color: var(--color-pill-positive-bg);
          border-color: var(--color-pill-positive-border);
        }

        .reminder-box--dont {
          background-color: var(--color-pill-negative-bg);
          border-color: var(--color-pill-negative-border);
        }

        .reminder-box__title {
          font-size: var(--font-size-sm);
          margin: 0 0 8px 0;
        }

        .reminder-list {
          margin: 0;
          padding-left: var(--space-5);
          font-size: var(--font-size-xs);
          display: flex;
          flex-direction: column;
          gap: 6px;
          line-height: 1.5;
        }

        .supporting-notes-list {
          margin: 0;
          padding-left: var(--space-5);
          font-size: var(--font-size-xs);
          color: var(--color-text-main);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .result-disclaimer {
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-md);
          background-color: var(--color-bg-subtle);
          border: 1px solid var(--color-border-default);
          font-size: var(--font-size-xs);
          color: var(--color-text-muted);
          line-height: 1.5;
        }

        .result-context-caution {
          padding: var(--space-4);
          border-radius: var(--radius-lg);
          border: 2px solid var(--color-pill-warning-border);
          background-color: var(--color-pill-warning-bg);
          color: var(--color-text-main);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .result-context-caution__header {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--font-size-sm);
        }

        .result-context-caution__reason,
        .result-context-caution__action {
          margin: 0;
          font-size: var(--font-size-xs);
          line-height: 1.5;
        }

        .result-journal-cta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-md);
          background-color: var(--color-bg-surface);
          border: 1px solid var(--color-border-default);
          font-size: var(--font-size-xs);
          color: var(--color-text-muted);
        }
      `}</style>
    </section>
  );
}
