# PRD: Crypto Signal & Learning Platform

**Working title:** Crypto Signal & Learning Platform\
**Author:** Syubban\
**Date:** 6 November 2026\
**Status:** Draft v1\
**Source document:** Dokumentasi Analisis Trading, Edukasi Visual Grafik & Psikologi Risiko

## 1. Overview

A static, English-language web app that helps casual swing traders learn how to read a crypto chart and decide, calmly, whether to **Buy, Hold, or Sell**. The user types in numbers from their exchange chart (price, MA30, RSI, order book, levels, MACD, volume). The app applies a simple rule-based checklist, shows a clear signal with a plain-language explanation, and builds a pre-planned order ladder (entries, stop, take profit). Alongside it sits a short set of illustrated lessons that explain what the chart elements mean and why.

The core promise is **ease of mind**: the user always knows where the floor is, how much ammunition is left, and what the plan is before they place an order.

## 2. Problem Statement

Beginners and casual traders hit three recurring problems (from the source document):

1. **Visual blindness.** Exchange screens are packed with MA5/MA10/MA30, BOLL, MACD, RSI and order books, with no cause-and-effect explanation connecting them.
2. **Panic selling.** Without a map of support areas, a 2% to 5% dip triggers an emotional cut-loss right before a bounce.
3. **Poor position sizing.** Going all-in or having no split-entry plan makes the user's psychology fragile when price moves against them.

## 3. Goals and Non-Goals

### Goals

- Turn a manual chart reading into a Buy / Hold / Sell signal in under 60 seconds.
- Explain every signal in plain language so the user understands why.
- Provide an automatic 3-tier split-entry plan plus cash reserve, a stop-loss level and a take-profit target.
- Teach the chart basics through short illustrated lessons.
- Reduce panic behaviour: show "what to do" and "what not to do" with every result.

### Non-goals (MVP)

- No live market data or exchange API integration (all inputs are manual).
- No accounts, login, database or saved history (the app is stateless).
- No order execution or exchange connection.
- No push notifications or Telegram alerts.
- No futures, leverage or derivatives guidance. Spot only.
- No price prediction. The app is a checklist, not a forecast.

## 4. Target User

**Casual swing trader, beginner level.** Low screen time, checks the market once or twice a day, trades spot, uses 4-hour (4H) or daily (1D) timeframes, and cares more about managing risk and staying calm than about squeezing out every move.

## 5. Product Scope

The MVP has two equally weighted pillars on one static site.

| Pillar | What it contains |
| :-- | :-- |
| **Signal Checker** | Manual input form, 3-Light checklist, Buy / Hold / Sell / Plan Broken result, position-sizing ladder, stop-loss and take-profit |
| **Learn** | Illustrated lessons with annotated chart diagrams, glossary |

## 6. Functional Requirements

### FR-1: Signal Checker inputs

The user can analyse **any coin** by typing its ticker (for example BTC, ETH, SOL, or any other symbol). The ticker is a label only; the app does not validate it against a market.

| Field | Type | Required | Notes |
| :-- | :-- | :-- | :-- |
| Coin ticker | Text | Yes | Free text, shown in the result |
| Timeframe | Select: 4H / 1D | Yes | Labels the analysis; the checklist is designed for these two |
| Current price | Number (USDT) | Yes |  |
| MA30 | Number (USDT) | Yes | Light 1 |
| BOLL lower band | Number (USDT) | No | Light 1 alternative (price touching the lower band) |
| BOLL upper band | Number (USDT) | No | Used for sell-side check |
| RSI | Number 0 to 100 | Yes | Light 2 |
| Order book Bid % | Number 0 to 100 | Yes | Light 3 (Ask % is derived as 100 minus Bid) |
| Support levels | Up to 3 numbers | Yes, at least 1 | Used for entry tiers and stop |
| Resistance levels | Up to 2 numbers | No | Used for take-profit target |
| MACD histogram | Select: red shrinking / red growing / green growing / green shrinking | No | Supporting context |
| Volume on latest move | Select: lower than usual / normal / higher than usual | No | Supporting context |
| Holding this coin? | Toggle + average buy price | No | Enables Hold / Sell / Plan Broken logic |
| Total capital | Number (USDT) | Required for position sizing |  |

**Validation:** RSI and Bid % must be within 0 to 100. Prices must be greater than zero. If a support level is above the current price, show a gentle warning rather than blocking the user.

### FR-2: Signal logic

The result is one of four states, always shown with a plain-language reason.

**The 3 Lights (buy side, from the source document):**

| Light | Condition | Meaning shown to the user |
| :-- | :-- | :-- |
| 1. Price vs MA30 / BOLL | Price is below MA30, or at/below the BOLL lower band | Price is on discount |
| 2. RSI | RSI is in the 30 to 36 area or below | Sellers are running out of steam |
| 3. Order book | Bid % is above 35% to 40% | There is a wall of buyers underneath |

**Signal states:**

| State | Trigger | Message and action |
| :-- | :-- | :-- |
| **Buy Zone** | All 3 lights on, user not in a trade | Place a Buy Limit for the first tranche using 10% to 15% of capital. Do not go all-in. |
| **Wait / Hold** | 1 or 2 lights on (not holding), or holding with no sell or plan-broken conditions met | Do nothing urgent. Keep your limit orders and your cash reserve. |
| **Take Profit / Sell** | User is holding, and the mirrored lights are on (see below), or price has reached the take-profit target | Consider placing a Sell Limit at the target. Do not chase a price far above the lines. |
| **Plan Broken** | User is holding and price is at or below the stop-loss level | The reason you bought no longer holds. Follow your pre-set exit instead of hoping. |

**Mirrored sell-side lights:** price above MA30 or at/above the BOLL upper band, RSI above 70, and Bid % thin (thresholds to be confirmed, see Open Questions).

**Supporting context (does not change the signal state):** MACD histogram direction, volume behaviour, and distance to the nearest support and resistance. These appear as small notes, for example "Selling momentum is fading" when the red MACD histogram is shrinking. This keeps the main answer simple while still using the full data set the user entered.

### FR-3: Stop-loss ("plan broken") level

- The app auto-suggests a stop level **just below the lowest support** the user entered, using a small default buffer (default value to be confirmed).
- The user can edit the stop level at any time.
- The stop is presented as an agreed exit point decided in advance, not a reaction to a scary candle. Suggested wording: "If price closes below this level on the timeframe you chose, the plan is broken."

### FR-4: Position-sizing calculator

Given the user's total capital, the app suggests a **3-tier split entry plus a cash reserve**, using the ratios from the source document's worked example (233.77 USDT: 30 / 50 / 70 / \~83.77):

| Slice | Default share of capital |
| :-- | :-- |
| Entry 1 | \~13% |
| Entry 2 | \~21% |
| Entry 3 | \~30% |
| Cash reserve | \~36% |

- Entry prices default to the user's support levels (Entry 1 near the current price or first support, Entry 2 and 3 at the lower supports). All are editable.
- For each tier the app shows: limit price, USDT amount, estimated quantity.
- If all tiers fill, the app shows the **average buy price** and the stop-loss distance from it.
- The app shows the take-profit target (nearest resistance by default, editable) and the estimated percentage gain from Entry 1.
- Always display the reserve, for example "You still hold 87% of your capital in USDT after Entry 1."

### FR-5: Result screen

The result screen shows, in this order:

1. **Signal badge** (Buy Zone / Wait / Take Profit / Plan Broken) with one-sentence reason.
2. **3 Lights panel** with a tick or cross per light and a plain-language line each.
3. **Plan card:** entry ladder, stop-loss, take-profit, cash reserve.
4. **Calm reminders:** "What to do now" and "What not to do" (for example do not go all-in, do not panic sell a normal 5% to 7% pullback while above your stop).
5. **Supporting context** (MACD, volume, levels).
6. **Risk note** (see FR-7).

### FR-6: Learn section

Short illustrated lessons, each with text and an annotated chart diagram (SVG):

1. **How a chart is built:** order book, then candlesticks and volume, then indicators (the 3-stage cause-and-effect flow).
2. **Candlestick anatomy:** body, wicks, why a long lower wick can signal buyers stepping in at support.
3. **Indicators in plain language:** MA, BOLL, RSI, VOL, MACD, and the advice to pick either MA or EMA to keep the chart clean.
4. **Support, resistance and liquidity zones:** how to find the floor and ceiling.
5. **The 3-Light checklist:** how the app decides, with a worked example.
6. **Position sizing and split entry:** why 3 tiers plus a cash reserve calms the mind.
7. **Trading mindset:** visual anchoring, market breathing versus broken trend, pre-planned execution with limit orders.
8. **Glossary:** every abbreviation with an everyday analogy.

Price levels from the source document (BTC, ETH, SOL on 5 to 6 November 2026) appear **only as dated worked examples**, never as live signals.

### FR-7: Disclaimer and tone

- The app is an educational checklist, not financial advice, and does not predict prices.
- A short, visible risk note appears on the result screen and in the site footer.
- Tone is calm, plain and non-hype. No urgency language, no "guaranteed" wording.

## 7. Non-Functional Requirements

| Area | Requirement |
| :-- | :-- |
| Stack | Astro static site. Signal logic runs client-side in TypeScript. Interactive pieces (form, result) can be small client-side islands; lessons are static content. |
| Statelessness | No backend, no database, no cookies, no localStorage. Refreshing the page clears all inputs. |
| Language | English only. |
| Design | Calm and minimal, light theme, generous spacing, one accent colour for signals. |
| Responsive | Mobile-first; the whole checker must be usable on a phone. |
| Performance | Fast static load, minimal JavaScript on lesson pages. |
| Accessibility | Signal state is never conveyed by colour alone (icon + text). Keyboard-friendly form, readable contrast, alt text on diagrams. |
| Privacy | Nothing the user types leaves the browser. |
| Hosting | Any static host. |

## 8. User Flows

**Flow A: Check a coin**

1. Open Signal Checker.
2. Enter ticker, timeframe, price, MA30, RSI, Bid %, levels, MACD and volume.
3. Optionally toggle "I hold this coin" and enter the average buy price.
4. Enter total capital.
5. Tap Check signal.
6. Read the badge, the 3 lights and the plan card.
7. Place limit orders on the exchange, then close the app and carry on with the day.

**Flow B: Learn first**

1. Open Learn, start with "How a chart is built."
2. Move through the lessons in order.
3. Each lesson ends with a link to try the Signal Checker.

## 9. Acceptance Criteria (worked examples from the source document)

| # | Input | Expected result |
| :-- | :-- | :-- |
| 1 | SOL: price 89.73, MA30 91.60, RSI 36, Bid 40.61%, not holding | All 3 lights on, **Buy Zone**, first tranche 10% to 15% of capital |
| 2 | ETH: Bid 22% (Ask 78%), other lights on | Light 3 off, **Wait**, message explains sellers still dominate the order book |
| 3 | Capital 233.77 USDT | Ladder close to 30 / 50 / 70 USDT with about 83.77 USDT reserve |
| 4 | Holding, price at or below the stop level | **Plan Broken** shown with the pre-planned exit message |
| 5 | RSI entered as 120 | Validation error, no result shown |
| 6 | Page refresh | All inputs cleared |

## 10. Success Measures

There is no analytics in the MVP, so success is judged by self-testing:

- A first-time user completes a check in under 60 seconds.
- All acceptance criteria above pass.
- A user can explain in their own words what each of the 3 lights means after reading Lessons 1 to 5.
- The result screen always shows a stop level, a reserve and a "what not to do" line.

## 11. Risks and Mitigations

| Risk | Mitigation |
| :-- | :-- |
| Manual entry mistakes (wrong timeframe, typo) | Validation, clear field hints, show the entered values back on the result |
| False confidence from a "Buy Zone" label | Disclaimer, mandatory stop-loss, wording that stresses this is a checklist and can be wrong |
| "Buy on weakness" logic fails in a real downtrend | Plan Broken state and stop-loss, which the source document does not define |
| Dated price levels in lessons mislead | Label every level with its date and mark it as an example |
| Indicator overload for beginners | Only 3 lights drive the signal; MACD and volume are supporting notes |

## 12. Open Questions

1. **Sell-side thresholds:** the source document only defines the buy side. Confirm the mirror: RSI above 70, price above MA30 or upper BOLL, and what Bid % counts as thin (for example below 30%).
2. **How many lights for Sell?** Require all 3 mirrored lights, or 2 of 3?
3. **Stop-loss buffer:** default distance below the lowest support (for example 2%).
4. **RSI threshold:** treat the buy light as RSI at or below 36, or strictly within 30 to 36 (and below)?
5. **Take-profit default:** nearest resistance, or a percentage band such as +6% to +10% as in the document's examples?
6. **Product name and branding.**
7. **Future (post-MVP):** shareable result via URL, optional saved history, live price lookup, Telegram alerts.

## 13. Suggested Milestones

| Milestone | Deliverable |
| :-- | :-- |
| M1 | Astro project, light design system, site layout |
| M2 | Signal logic module in TypeScript with tests for the acceptance criteria |
| M3 | Signal Checker UI and result screen |
| M4 | Position-sizing ladder, stop-loss and take-profit |
| M5 | Lessons with annotated SVG diagrams and glossary |
| M6 | Disclaimer, accessibility pass, deploy |
