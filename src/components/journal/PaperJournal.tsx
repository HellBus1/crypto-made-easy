import { useEffect, useState, type SyntheticEvent } from 'react';
import {
  GRADUATION_TARGET_CHECKS,
  addJournalEntry,
  computeJournalStats,
  deleteJournalEntry,
  isEntryRuleCompliant,
  readJournalStore,
  resetJournalStore,
  updateJournalEntryOutcome,
  type JournalOutcome,
  type JournalSignalResult,
  type JournalStore,
} from '../../lib/journal';

interface JournalFormDraft {
  ticker: string;
  timeframe: '4H' | '1D';
  signalResult: JournalSignalResult;
  buyLightsCount: string;
  btc24hChange: string;
  entryPrice: string;
  stopLossPrice: string;
  takeProfitPrice: string;
  starterBudgetUsdt: string;
  autoStopPlanned: boolean;
  btcFilterChecked: boolean;
  withinTwoChecksPerDay: boolean;
  followedPlanWithoutPanic: boolean;
  outcome: JournalOutcome;
  notes: string;
}

const EMPTY_FORM: JournalFormDraft = {
  ticker: '',
  timeframe: '4H',
  signalResult: 'BUY_ZONE',
  buyLightsCount: '3',
  btc24hChange: '-1.5',
  entryPrice: '',
  stopLossPrice: '',
  takeProfitPrice: '',
  starterBudgetUsdt: '50',
  autoStopPlanned: true,
  btcFilterChecked: true,
  withinTwoChecksPerDay: true,
  followedPlanWithoutPanic: true,
  outcome: 'pending',
  notes: '',
};

const WORKED_SOL_DRAFT: JournalFormDraft = {
  ticker: 'SOL',
  timeframe: '4H',
  signalResult: 'BUY_ZONE',
  buyLightsCount: '3',
  btc24hChange: '-1.2',
  entryPrice: '88.50',
  stopLossPrice: '79.58',
  takeProfitPrice: '95.00',
  starterBudgetUsdt: '50',
  autoStopPlanned: true,
  btcFilterChecked: true,
  withinTwoChecksPerDay: true,
  followedPlanWithoutPanic: true,
  outcome: 'pending',
  notes:
    'Historical worked check: 3/3 lights ON at $89.73, $6.42 Entry 1 limit at $88.50, immediate Gate.com TP/SL stop at $79.58.',
};

const SIGNAL_LABELS: Record<JournalSignalResult, string> = {
  BUY_ZONE: 'Buy Zone (3/3 ON)',
  WAIT_HOLD: 'Wait / Hold',
  TAKE_PROFIT: 'Take Profit',
  PLAN_BROKEN: 'Plan Broken',
};

const OUTCOME_LABELS: Record<JournalOutcome, string> = {
  pending: 'Pending (48h check)',
  target_hit: 'Target Hit (+Gain)',
  stop_hit: 'Stop Triggered (-2% Protected)',
  skipped_wisely: 'Skipped Wisely (Rule Saved Cash)',
  no_fill: 'Limit Not Filled (Cancelled Safely)',
};

export default function PaperJournal() {
  const [store, setStore] = useState<JournalStore | null>(null);
  const [draft, setDraft] = useState<JournalFormDraft>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [showRulesSheet, setShowRulesSheet] = useState<boolean>(false);
  const [confirmReset, setConfirmReset] = useState<boolean>(false);

  useEffect(() => {
    setStore(readJournalStore());
  }, []);

  const entries = store ? store.entries : [];
  const stats = computeJournalStats(entries);

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ticker = draft.ticker.trim().toUpperCase();
    const entryPrice = Number(draft.entryPrice);
    const stopLossPrice = Number(draft.stopLossPrice);
    const takeProfitPrice = Number(draft.takeProfitPrice);
    const starterBudgetUsdt = Number(draft.starterBudgetUsdt);
    const buyLightsCount = Number(draft.buyLightsCount);
    const btcParsed = draft.btc24hChange.trim() === '' ? undefined : Number(draft.btc24hChange);

    if (!ticker) {
      setFormError('Please enter a coin ticker (for example: SOL, BTC, or ETH).');
      return;
    }
    if (
      !Number.isFinite(entryPrice) ||
      entryPrice <= 0 ||
      !Number.isFinite(stopLossPrice) ||
      stopLossPrice <= 0 ||
      !Number.isFinite(takeProfitPrice) ||
      takeProfitPrice <= 0
    ) {
      setFormError('Entry, Stop-Loss, and Take-Profit prices must all be greater than 0.');
      return;
    }
    if (!Number.isFinite(starterBudgetUsdt) || starterBudgetUsdt <= 0) {
      setFormError('Starter budget (USDT) must be greater than 0.');
      return;
    }

    setFormError(null);
    const updated = addJournalEntry({
      ticker,
      timeframe: draft.timeframe,
      signalResult: draft.signalResult,
      buyLightsCount: Number.isFinite(buyLightsCount)
        ? Math.min(3, Math.max(0, Math.round(buyLightsCount)))
        : 0,
      btc24hChange: btcParsed !== undefined && Number.isFinite(btcParsed) ? btcParsed : undefined,
      entryPrice,
      stopLossPrice,
      takeProfitPrice,
      starterBudgetUsdt,
      autoStopPlanned: draft.autoStopPlanned,
      btcFilterChecked: draft.btcFilterChecked,
      withinTwoChecksPerDay: draft.withinTwoChecksPerDay,
      followedPlanWithoutPanic: draft.followedPlanWithoutPanic,
      outcome: draft.outcome,
      notes: draft.notes,
    });
    setStore(updated);
    setDraft(EMPTY_FORM);
  };

  const handleOutcomeChange = (id: string, outcome: JournalOutcome) => {
    setStore(updateJournalEntryOutcome(id, outcome));
  };

  const handleDelete = (id: string) => {
    setStore(deleteJournalEntry(id));
  };

  const handleConfirmReset = () => {
    setStore(resetJournalStore());
    setConfirmReset(false);
  };

  return (
    <div className="journal-workspace" data-ui="paper-journal" data-testid="paper-journal-app">
      {/* 1. Graduation Tracker toward <$50 First Real Trade */}
      <div className="surface-card journal-progress-card" data-testid="journal-graduation-card">
        <div className="journal-progress-card__top">
          <div>
            <span className="status-pill status-pill--info">
              10-Check Paper Drill &rarr; First &lt; $50 Real Trade
            </span>
            <h2 style={{ marginTop: 8, marginBottom: 4 }}>
              Rule-Compliant Checks:{' '}
              <span className="num" data-testid="journal-compliant-count">
                {stats.compliantChecks} / {GRADUATION_TARGET_CHECKS}
              </span>
            </h2>
            <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)', margin: 0 }}>
              Before risking real USDT on Gate.com, complete {GRADUATION_TARGET_CHECKS} calm paper
              checks where all 4 protective habits are checked off.
            </p>
          </div>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setShowRulesSheet((prev) => !prev)}
            aria-expanded={showRulesSheet}
            data-testid="toggle-rules-sheet"
          >
            {showRulesSheet ? 'Hide 1-Page Spot Rules Sheet' : 'View 1-Page Spot Rules Sheet'}
          </button>
        </div>

        <div
          className="journal-bar-track"
          role="progressbar"
          aria-valuenow={stats.graduationPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Paper journal graduation progress"
        >
          <div className="journal-bar-fill" style={{ width: `${stats.graduationPercent}%` }} />
        </div>

        <div className="journal-stats-row">
          <div className="journal-stat-chip">
            <span className="journal-stat-chip__label">Total Logged</span>
            <strong className="num" data-testid="journal-total-count">
              {stats.totalChecks}
            </strong>
          </div>
          <div className="journal-stat-chip">
            <span className="journal-stat-chip__label">Rule Compliance</span>
            <strong className="num">{stats.complianceRatePercent}%</strong>
          </div>
          <div className="journal-stat-chip">
            <span className="journal-stat-chip__label">Buy Zones Logged</span>
            <strong className="num">{stats.buyZoneCount}</strong>
          </div>
          <div className="journal-stat-chip">
            <span className="journal-stat-chip__label">Wisely Waited / Skipped</span>
            <strong className="num">{stats.waitSkippedCount}</strong>
          </div>
          <div className="journal-stat-chip">
            <span className="journal-stat-chip__label">Status</span>
            <strong data-testid="journal-graduation-status">
              {stats.isGraduated
                ? 'Ready for <$50 Starter Spot Trade'
                : `${Math.max(0, GRADUATION_TARGET_CHECKS - stats.compliantChecks)} more check(s) left`}
            </strong>
          </div>
        </div>

        {showRulesSheet && (
          <div className="rules-sheet-drawer" data-testid="rules-sheet-drawer">
            <h3>Your 1-Page Spot Rules Sheet (&lt;$50 Starter on Gate.com)</h3>
            <ol className="rules-sheet-list">
              <li>
                <strong>Spot Only, Never Margin/Futures:</strong> No borrowing, no liquidation risk.
              </li>
              <li>
                <strong>$50 Ladder Split (13% / 21% / 30% + 36% Reserve):</strong> Entry 1 ={' '}
                <code>$6.42</code>, Entry 2 = <code>$10.70</code>, Entry 3 = <code>$14.97</code>,
                untouched cash reserve = <code>$17.91</code> (every slice safely clears
                Gate.com&apos;s <code>1 USDT</code> spot minimum and covers <code>~0.2%</code>{' '}
                fees).
              </li>
              <li>
                <strong>All 3 Lights Must Align + Healthy Context:</strong> Price below MA30 (or
                Lower BOLL), RSI &le; 38, and Bid &ge; 40%. Plus check 1D/4H structure (uptrend
                pullback or range floor, not vertical crash).
              </li>
              <li>
                <strong>BTC Crash Override:</strong> If Bitcoin drops <code>&le; -5%</code> in 24h,
                pause new altcoin buys even if all 3 lights turn green.
              </li>
              <li>
                <strong>Immediate Automatic Gate.com TP/SL Stop:</strong> The moment Entry 1 fills,
                attach an exchange Stop-Loss <code>2%</code> below lowest support so emotion never
                overrides your exit.
              </li>
              <li>
                <strong>Max 2 Fixed Checks/Day:</strong> Evaluate 4H/1D charts at two scheduled
                times only. Close the app in between.
              </li>
            </ol>
          </div>
        )}
      </div>

      {/* 2. Form to Log a New Paper Check */}
      <div className="surface-card journal-form-card">
        <div className="journal-form-card__header">
          <div>
            <h2 style={{ margin: '0 0 4px 0' }}>Log a Paper-Trade Check</h2>
            <p className="text-muted" style={{ margin: 0, fontSize: 'var(--font-size-xs)' }}>
              Record every 4H/1D check you run &mdash; including checks where you decided to{' '}
              <strong>WAIT / SKIP</strong>. Skipping bad setups is the #1 skill tested here.
            </p>
          </div>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setDraft(WORKED_SOL_DRAFT);
              setFormError(null);
            }}
            data-testid="prefill-worked-journal-btn"
          >
            Fill Worked SOL Example
          </button>
        </div>

        <form onSubmit={handleSubmit} className="journal-form" noValidate>
          <div className="journal-grid journal-grid--4">
            <div className="form-field">
              <label htmlFor="journal-ticker">Coin Ticker *</label>
              <input
                id="journal-ticker"
                type="text"
                placeholder="e.g. SOL, ETH, BTC"
                value={draft.ticker}
                onChange={(e) => setDraft((p) => ({ ...p, ticker: e.target.value }))}
                data-testid="journal-input-ticker"
              />
            </div>

            <div className="form-field">
              <label htmlFor="journal-timeframe">Timeframe</label>
              <select
                id="journal-timeframe"
                value={draft.timeframe}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, timeframe: e.target.value as '4H' | '1D' }))
                }
              >
                <option value="4H">4H (4-Hour)</option>
                <option value="1D">1D (Daily)</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="journal-signal">Checker Result</label>
              <select
                id="journal-signal"
                value={draft.signalResult}
                onChange={(e) =>
                  setDraft((p) => ({
                    ...p,
                    signalResult: e.target.value as JournalSignalResult,
                  }))
                }
                data-testid="journal-input-signal"
              >
                <option value="BUY_ZONE">Buy Zone (3/3 ON)</option>
                <option value="WAIT_HOLD">Wait / Hold</option>
                <option value="TAKE_PROFIT">Take Profit</option>
                <option value="PLAN_BROKEN">Plan Broken</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="journal-lights">Buy Lights ON (0-3)</label>
              <select
                id="journal-lights"
                value={draft.buyLightsCount}
                onChange={(e) => setDraft((p) => ({ ...p, buyLightsCount: e.target.value }))}
              >
                <option value="3">3 of 3</option>
                <option value="2">2 of 3</option>
                <option value="1">1 of 3</option>
                <option value="0">0 of 3</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="journal-entry">Planned Entry 1 (USDT) *</label>
              <input
                id="journal-entry"
                type="number"
                step="any"
                min="0.0001"
                placeholder="e.g. 88.50"
                value={draft.entryPrice}
                onChange={(e) => setDraft((p) => ({ ...p, entryPrice: e.target.value }))}
                data-testid="journal-input-entry"
              />
            </div>

            <div className="form-field">
              <label htmlFor="journal-stop">Auto Stop-Loss (USDT) *</label>
              <input
                id="journal-stop"
                type="number"
                step="any"
                min="0.0001"
                placeholder="e.g. 79.58"
                value={draft.stopLossPrice}
                onChange={(e) => setDraft((p) => ({ ...p, stopLossPrice: e.target.value }))}
                data-testid="journal-input-stop"
              />
            </div>

            <div className="form-field">
              <label htmlFor="journal-tp">Take-Profit Target (USDT) *</label>
              <input
                id="journal-tp"
                type="number"
                step="any"
                min="0.0001"
                placeholder="e.g. 95.00"
                value={draft.takeProfitPrice}
                onChange={(e) => setDraft((p) => ({ ...p, takeProfitPrice: e.target.value }))}
                data-testid="journal-input-tp"
              />
            </div>

            <div className="form-field">
              <label htmlFor="journal-btc">BTC 24h % &amp; Budget (USDT)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                <input
                  id="journal-btc"
                  type="number"
                  step="any"
                  placeholder="BTC %"
                  aria-label="BTC 24h change percent"
                  value={draft.btc24hChange}
                  onChange={(e) => setDraft((p) => ({ ...p, btc24hChange: e.target.value }))}
                />
                <input
                  id="journal-budget"
                  type="number"
                  step="any"
                  min="1"
                  placeholder="50"
                  aria-label="Starter budget USDT"
                  value={draft.starterBudgetUsdt}
                  onChange={(e) => setDraft((p) => ({ ...p, starterBudgetUsdt: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* 4 Rule Habits Checkboxes */}
          <div className="journal-habits-box">
            <div className="journal-habits-box__title">
              4 Protective Rule Checks (Required for Graduation Credit)
            </div>
            <div className="journal-habits-grid">
              <label className="journal-checkbox">
                <input
                  type="checkbox"
                  checked={draft.autoStopPlanned}
                  onChange={(e) => setDraft((p) => ({ ...p, autoStopPlanned: e.target.checked }))}
                />
                <span>Planned automatic Gate.com TP/SL stop before entering</span>
              </label>

              <label className="journal-checkbox">
                <input
                  type="checkbox"
                  checked={draft.btcFilterChecked}
                  onChange={(e) => setDraft((p) => ({ ...p, btcFilterChecked: e.target.checked }))}
                />
                <span>Checked BTC 24h % &amp; 1D/4H structure (no blind knife catching)</span>
              </label>

              <label className="journal-checkbox">
                <input
                  type="checkbox"
                  checked={draft.withinTwoChecksPerDay}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, withinTwoChecksPerDay: e.target.checked }))
                  }
                />
                <span>Stayed within max 2 scheduled chart checks today</span>
              </label>

              <label className="journal-checkbox">
                <input
                  type="checkbox"
                  checked={draft.followedPlanWithoutPanic}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, followedPlanWithoutPanic: e.target.checked }))
                  }
                />
                <span>Followed my rule calmly (did not move Stop-Loss or FOMO-chase)</span>
              </label>
            </div>
          </div>

          <div className="journal-grid journal-grid--2">
            <div className="form-field">
              <label htmlFor="journal-outcome">Initial / 48h Outcome</label>
              <select
                id="journal-outcome"
                value={draft.outcome}
                onChange={(e) =>
                  setDraft((p) => ({ ...p, outcome: e.target.value as JournalOutcome }))
                }
              >
                <option value="pending">Pending (check back in 48h)</option>
                <option value="skipped_wisely">Skipped Wisely (Rule Saved Cash)</option>
                <option value="target_hit">Target Hit (+Gain)</option>
                <option value="stop_hit">Stop Triggered (-2% Protected)</option>
                <option value="no_fill">Limit Not Filled (Cancelled Safely)</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="journal-notes">Why did you take or skip this check?</label>
              <input
                id="journal-notes"
                type="text"
                placeholder="e.g. Waited because Bid was 22% and BTC -6.5%"
                value={draft.notes}
                onChange={(e) => setDraft((p) => ({ ...p, notes: e.target.value }))}
              />
            </div>
          </div>

          {formError && (
            <div className="journal-error-box" role="alert" data-testid="journal-form-error">
              {formError}
            </div>
          )}

          <div className="journal-submit-row">
            <button type="submit" className="btn-primary" data-testid="journal-submit-btn">
              Save Paper Check to Browser Journal
            </button>
            <span className="text-muted" style={{ fontSize: 'var(--font-size-xs)' }}>
              Stored locally in <code>cme:journal:v1</code> &mdash; kept separate from the stateless
              Signal Checker.
            </span>
          </div>
        </form>
      </div>

      {/* 3. Logged Checks Table / Cards */}
      <div className="surface-card journal-history-card">
        <div className="journal-history-card__top">
          <h2 style={{ margin: 0 }}>Your Logged Paper Checks ({entries.length})</h2>
          {entries.length > 0 && (
            <div className="journal-reset-controls">
              {!confirmReset ? (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setConfirmReset(true)}
                  data-testid="journal-reset-trigger"
                >
                  Clear Journal
                </button>
              ) : (
                <div className="journal-reset-confirm">
                  <span>Delete all {entries.length} checks?</span>
                  <button
                    type="button"
                    className="btn-danger-sm"
                    onClick={handleConfirmReset}
                    data-testid="journal-reset-confirm"
                  >
                    Yes, Clear All
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setConfirmReset(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {entries.length === 0 ? (
          <div className="journal-empty-state" data-testid="journal-empty-state">
            No paper checks logged yet. Run a check on <a href="/checker">Signal Checker</a> or
            click <strong>Fill Worked SOL Example</strong> above to log your first practice entry.
          </div>
        ) : (
          <div className="journal-entries-list" data-testid="journal-entries-list">
            {entries.map((entry) => {
              const compliant = isEntryRuleCompliant(entry);
              return (
                <article
                  key={entry.id}
                  className="journal-entry-card"
                  data-testid={`journal-entry-${entry.ticker.toLowerCase()}`}
                >
                  <div className="journal-entry-card__head">
                    <div className="journal-entry-card__title-group">
                      <strong className="num">
                        {entry.ticker}/USDT &middot; {entry.timeframe}
                      </strong>
                      <span
                        className={
                          entry.signalResult === 'BUY_ZONE'
                            ? 'status-pill status-pill--positive'
                            : entry.signalResult === 'PLAN_BROKEN'
                              ? 'status-pill status-pill--negative'
                              : 'status-pill status-pill--warning'
                        }
                      >
                        {SIGNAL_LABELS[entry.signalResult]}
                      </span>
                      <span
                        className={
                          compliant
                            ? 'status-pill status-pill--positive'
                            : 'status-pill status-pill--neutral'
                        }
                      >
                        {compliant ? 'Rule-Compliant (+1)' : 'Habit Incomplete'}
                      </span>
                    </div>

                    <div className="journal-entry-card__actions">
                      <select
                        aria-label={`Update outcome for ${entry.ticker}`}
                        value={entry.outcome}
                        onChange={(e) =>
                          handleOutcomeChange(entry.id, e.target.value as JournalOutcome)
                        }
                        className="journal-outcome-select"
                      >
                        {Object.entries(OUTCOME_LABELS).map(([val, label]) => (
                          <option key={val} value={val}>
                            {label}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="btn-delete-entry"
                        onClick={() => handleDelete(entry.id)}
                        aria-label={`Delete ${entry.ticker} check`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="journal-entry-card__levels num">
                    <span>Entry 1: ${entry.entryPrice}</span>
                    <span>Stop: ${entry.stopLossPrice}</span>
                    <span>TP: ${entry.takeProfitPrice}</span>
                    <span>Budget: ${entry.starterBudgetUsdt}</span>
                    {entry.btc24hChange !== undefined && (
                      <span>BTC 24h: {entry.btc24hChange}%</span>
                    )}
                    <span>Lights: {entry.buyLightsCount}/3</span>
                  </div>

                  {entry.notes && <p className="journal-entry-card__notes">{entry.notes}</p>}
                </article>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .journal-workspace {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
          margin-top: var(--space-4);
        }

        .journal-progress-card__top,
        .journal-form-card__header,
        .journal-history-card__top {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: space-between;
          gap: var(--space-3);
          margin-bottom: var(--space-4);
        }

        .journal-bar-track {
          height: 10px;
          border-radius: 999px;
          background-color: var(--color-bg-subtle);
          border: 1px solid var(--color-border-subtle);
          overflow: hidden;
          margin-bottom: var(--space-4);
        }

        .journal-bar-fill {
          height: 100%;
          background-color: var(--color-up);
          transition: width 0.25s ease;
        }

        .journal-stats-row {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-3);
        }

        .journal-stat-chip {
          flex: 1 1 135px;
          padding: var(--space-3);
          border-radius: var(--radius-md);
          background-color: var(--color-bg-canvas);
          border: 1px solid var(--color-border-default);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .journal-stat-chip__label {
          font-size: 11px;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .rules-sheet-drawer {
          margin-top: var(--space-4);
          padding: var(--space-4);
          border-radius: var(--radius-md);
          background-color: var(--color-bg-canvas);
          border: 1px solid var(--color-border-default);
        }

        .rules-sheet-drawer h3 {
          margin-top: 0;
          margin-bottom: var(--space-2);
          font-size: var(--font-size-md);
        }

        .rules-sheet-list {
          margin: 0;
          padding-left: var(--space-5);
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: var(--font-size-xs);
          line-height: 1.55;
        }

        .journal-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .journal-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-3);
        }

        @media (min-width: 768px) {
          .journal-grid--2 {
            grid-template-columns: repeat(2, 1fr);
          }
          .journal-grid--4 {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .form-field label {
          font-size: var(--font-size-xs);
          font-weight: 700;
        }

        .form-field input,
        .form-field select,
        .journal-outcome-select {
          height: var(--control-height);
          padding-inline: var(--space-3);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border-default);
          background-color: var(--color-bg-surface);
          color: var(--color-text-main);
          font-size: var(--font-size-sm);
        }

        .journal-habits-box {
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-md);
          background-color: var(--color-bg-canvas);
          border: 1px solid var(--color-border-default);
        }

        .journal-habits-box__title {
          font-size: var(--font-size-xs);
          font-weight: 700;
          margin-bottom: var(--space-2);
          color: var(--color-data-hue);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .journal-habits-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
        }

        @media (min-width: 768px) {
          .journal-habits-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .journal-checkbox {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: var(--font-size-xs);
          cursor: pointer;
          line-height: 1.4;
        }

        .journal-error-box {
          padding: var(--space-3);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-danger);
          background-color: var(--color-pill-negative-bg);
          color: var(--color-danger-ink);
          font-size: var(--font-size-xs);
          font-weight: 600;
        }

        .journal-submit-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--space-3);
        }

        .journal-empty-state {
          padding: var(--space-5);
          border-radius: var(--radius-md);
          border: 1px dashed var(--color-border-default);
          color: var(--color-text-muted);
          font-size: var(--font-size-sm);
          text-align: center;
        }

        .journal-entries-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .journal-entry-card {
          padding: var(--space-4);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border-default);
          background-color: var(--color-bg-canvas);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .journal-entry-card__head {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .journal-entry-card__title-group,
        .journal-entry-card__actions,
        .journal-reset-confirm {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
        }

        .journal-entry-card__levels {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-3);
          font-size: var(--font-size-xs);
          color: var(--color-text-muted);
        }

        .journal-entry-card__notes {
          margin: 0;
          font-size: var(--font-size-xs);
          color: var(--color-text-main);
          line-height: 1.5;
        }

        .btn-delete-entry,
        .btn-danger-sm {
          padding: 6px 12px;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-danger);
          background-color: var(--color-pill-negative-bg);
          color: var(--color-danger-ink);
          font-size: var(--font-size-xs);
          font-weight: 700;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
