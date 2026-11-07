# PRD: Crypto Signal & Learning Platform (v2, merged)

| | |
|---|---|
| **Status** | Draft v2: source PRD + owner decisions |
| **Date** | 2026-11-06 |
| **Owner** | Syubban |
| **Source** | `resources/PRD Crypto Signal & Learning Platform.md` (authoritative for the Signal Checker and its logic) |
| **Reference** | `blockchain-made-easy` (lesson-module pattern only, not its look) |

This document replaces my earlier draft. Anything not changed here is defined in the source PRD.

## 1. Changes versus the source PRD

| # | Change | Reason |
|---|---|---|
| C1 | Learn lessons use **interactive charts**, not only static SVG. | Owner wants to learn by manipulating the graph. |
| C2 | **Lesson progress** is stored in `localStorage` (key `cme:v1`). | Owner decision. |
| C3 | The Signal Checker **stays stateless**: inputs, results and plans are never stored. A refresh clears them. | Preserves source acceptance criterion 6. |
| C4 | Visual design: **calm, minimal, light theme**. Not the look of `blockchain-made-easy`. | Owner decision and source PRD. |
| C5 | Lesson module pattern borrowed from `blockchain-made-easy`: ordered chapters, glossary hover terms, completion mark. | Owner's original request. |

All other scope, non-goals (no live data, no accounts, no execution, spot only, no prediction) and the four signal states are unchanged.

## 2. Product

A static English web app for casual spot swing traders (4H/1D) who cannot read exchange charts such as Gate.com. Two pillars:

1. **Learn**: short chapters, each with an interactive chart that shows what a chart element means.
2. **Signal Checker**: type in numbers from the exchange chart; get Buy Zone / Wait / Take Profit / Plan Broken, the 3 Lights, and a calm plan (3-tier entry ladder, cash reserve, stop-loss, take-profit).

Promise: the user always knows where the floor is, how much cash is left, and what the plan is before placing an order.

## 3. Learn (changed: interactive)

Chapters follow the source's 8 topics, each with one interactive component. Each chapter ends with a link to the Signal Checker and a "Mark as done" control.

| # | Chapter | Interactive element |
|---|---|---|
| 1 | How a chart is built | Three-stage cause-and-effect: toggle order book, then candles + volume, then indicators on a sample chart; hotspots on a generic exchange-style screen. |
| 2 | Candlestick anatomy | Drag open/high/low/close handles; body and wicks redraw; preset shapes (long lower wick at support, etc.). |
| 3 | Indicators in plain language | Toggle MA (or EMA), BOLL, RSI, VOL, MACD on a sample chart; period sliders. |
| 4 | Support, resistance, liquidity zones | Click to place floors and ceilings; see bounces and breaks. |
| 5 | The 3-Light checklist | Sliders for price/MA30, RSI, Bid %; the three lights and resulting state update live; worked example. |
| 6 | Position sizing & split entry | Capital slider; 3 tiers plus reserve drawn on a chart with the stop level. |
| 7 | Trading mindset | Same chart replayed as "market breathing" (5% to 7% dip above the stop) vs "broken trend" (below the stop). |
| 8 | Glossary | Every abbreviation with an everyday analogy; terms also appear as hover definitions inside chapters. |

Rules:
- Sample charts use synthetic, deterministic candle data labelled as an example.
- Source-document price levels (BTC/ETH/SOL, 5 to 6 November 2026) appear only as dated worked examples.
- Every chart has a text or table alternative; every drag has a keyboard equivalent.

## 4. Signal Checker (unchanged from source, plus implementation defaults)

Inputs, validation, signal states, ladder ratios (about 13 / 21 / 30 / 36 percent), stop-loss, result screen order and disclaimer are exactly as in the source PRD sections FR-1 to FR-5 and FR-7.

Open questions in the source PRD get these **proposed defaults** (owner to confirm; each is one constant in code):

| Source open question | Proposed default |
|---|---|
| Sell-side thresholds | Price above MA30 or at/above BOLL upper; RSI > 70; Bid % < 30 |
| Lights needed for Sell | Take Profit if price reached the take-profit target, or if at least 2 of 3 mirrored lights are on |
| Stop-loss buffer | 2% below the lowest support entered |
| Buy RSI light | RSI ≤ 36 |
| Take-profit default | Nearest resistance, editable; show the % gain from Entry 1 |
| Product name | Keep "Crypto Made Easy" as working name |

Signal logic lives in pure TypeScript functions with unit tests for all six source acceptance cases.

## 5. Storage & privacy

- `localStorage` holds only `{ schemaVersion: 1, completed: string[] }` for lesson progress.
- Nothing the user enters in the Signal Checker is stored or transmitted.
- Corrupted storage falls back to an empty state without crashing.
- A "Reset progress" action with confirmation.
- No cookies, no analytics, no network calls with user data.

## 6. Design (calm, minimal, light)

- Light theme only in v1, generous spacing, one accent colour reserved for signals.
- Signal state is never colour alone: icon plus text on every badge.
- Charts are the visual hero; avoid card grids, gradients and decoration. Candle direction also encoded by shape/label, not red/green alone.
- Visual direction produced by the project's design skills (`frontend-design`, `anti-ui-slop`, `design-taste-frontend` app-screen rules) into a short design contract before UI work.
- Mobile-first; the whole checker usable on a phone.

## 7. Technical approach

| Area | Decision |
|---|---|
| Base | Existing `ts-astro-starter` (Astro 7, strict TS, plain CSS tokens, Vitest, Playwright, ESLint, CI), demo content removed |
| Interactivity | React islands (`client:visible` / `client:load` for the checker) |
| Charts | `lightweight-charts` for market-style charts; custom SVG for candle editor and diagrams |
| Content | MDX lessons in a content collection (`track`, `chapter`, `terms`) |
| State | Local component state; progress via a tiny `localStorage` module |
| Styling | Plain CSS custom properties (no Tailwind/Starlight) |
| Hosting | Any static host (Cloudflare Pages suitable) |

```
src/
  lib/signal/        lights.ts state.ts ladder.ts stop.ts validate.ts
  lib/indicators/    sma ema rsi macd bollinger
  lib/candles/       generator.ts aggregate.ts
  lib/progress.ts
  components/checker/  CheckerForm ResultScreen LightsPanel PlanCard
  components/charts/   MarketChart CandleEditor
  components/lessons/  one island per chapter
  content/lessons/     01-how-a-chart-is-built.mdx ...
  pages/               index, checker, learn/index, learn/[slug], glossary, about
tests/unit/            signal, indicators, progress
```

## 8. Non-functional requirements

Performance: fast static load, minimal JS on lesson pages without an island, charts lazy-loaded. Accessibility: AA contrast, keyboard-operable form and chart controls, alt text for diagrams. Browsers: latest two of Chrome, Safari, Firefox, iOS Safari. Language: English.

## 9. Acceptance criteria

Source criteria 1 to 6 unchanged (SOL Buy Zone, ETH Wait, 233.77 ladder, Plan Broken, RSI 120 validation, refresh clears inputs), plus:

7. All 8 chapters render; chapters 1 to 7 each have a working interactive chart.
8. Marking a chapter done persists across reloads; reset clears it.
9. The Checker stores nothing: after refresh, all inputs are empty.
10. Candle editor enforces high ≥ max(open, close) and low ≤ min(open, close).
11. Every result shows stop level, reserve, "what to do" and "what not to do", plus the disclaimer.
12. Every signal badge shows icon and text, not colour alone.

## 10. Risks

| Risk | Mitigation |
|---|---|
| False confidence from "Buy Zone" | Disclaimer, mandatory stop, checklist wording |
| Buy-on-weakness fails in a downtrend | Plan Broken state and stop |
| Synthetic charts look unrealistic | Tune generator (volatility clustering, wicks) |
| Interactive charts hard on touch | Pointer events, large hit areas, keyboard fallback |
| Scope creep from interactivity | One interactive component per chapter, shared chart components |

## 11. Remaining questions

1. Confirm the proposed defaults in section 4.
2. Quizzes per chapter in a later version?
3. Public launch and domain?
