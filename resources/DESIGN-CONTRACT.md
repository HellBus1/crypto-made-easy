# Design Contract: Crypto Made Easy

| | |
|---|---|
| **Direction** | `achromatic-ledger` (seed `1378102757`, `design-taste-frontend --app --kind markets --theme light`) |
| **Theme** | Calm, minimal, light-first (stone-ledger ground `#f2f4f7`, pure white surfaces `#ffffff`, ink `#0a0a0a`) |
| **Core Promise** | **Ease of mind** — the user always knows where the floor is, how much cash reserve remains, and what the plan is before placing an order. |

---

## 1. Visual Identity & "Its Face"

Exchange apps (Gate.com, Binance) overwhelm beginners with dark neon chrome, blinking red/green tickers, and six overlapping indicators. **Crypto Made Easy** takes the opposite stance: an **Achromatic Ledger**.

1. **Ground from the subject's world:** Cool ledger paper `#f2f4f7` (`--color-bg-canvas`) with crisp `#ffffff` cards (`--color-bg-surface`) separated by 1px `#e2e6ec` hairlines and zero resting box-shadow.
2. **No brand colour in the chrome:** Navigation, borders, headers, and primary action buttons use ink (`#0a0a0a` / `#141414`). Colour is reserved strictly for:
   - **The one chart/data hue (`#1d5fbf`):** Main price/MA30 series and active interactive handles.
   - **The 3-Light & Signal states:** Semantic high-contrast status pairs with mandatory icon + text labels (never colour alone).
3. **Tabular ledger numerals:** Every price, percentage, RSI reading, Bid/Ask ratio, and USDT tranche uses `font-variant-numeric: tabular-nums` and monospace/tabular alignment so columns reconcile digit-for-digit.
4. **Signature element:** The **3-Light Checklist Strip & Split-Entry Ammunition Bar** — showing Entry 1 (13%), Entry 2 (21%), Entry 3 (30%), and Unspent Cash Reserve (36%) alongside the Stop-Loss floor.

---

## 2. Colour Tokens (Light-First, WCAG AA 4.5:1+)

| Token | Value | Role |
|---|---|---|
| `--color-bg-canvas` | `#f2f4f7` | Cool ledger paper background |
| `--color-bg-surface` | `#ffffff` | Primary card and form surface |
| `--color-bg-subtle` | `#e8ecf2` | Subtle well / inactive pill / secondary surface |
| `--color-border-default` | `#dde2ea` | 1px card and table border |
| `--color-border-subtle` | `#eaeef4` | Row divider hairline |
| `--color-border-control` | `#c5cdd8` | Form input & button border |
| `--color-text-main` | `#0a0a0a` | Primary ink (headings, body, figures) |
| `--color-text-muted` | `#4b5563` | Secondary descriptions & labels (7.5:1 on white) |
| `--color-text-subtle` | `#5f6672` | Meta, axis ticks, hints (5.7:1 on white — passes AA) |
| `--color-brand-primary` | `#141414` | Primary action button fill (near-black ink) |
| `--color-data-hue` | `#1d5fbf` | Main chart series, active handle, and focus ring |
| `--color-signal-buy-bg` / `ink` | `#dcfae5` / `#04250e` | Buy Zone / Bullish candle / Light ON (with `✓` icon + label) |
| `--color-signal-wait-bg` / `ink` | `#fffbeb` / `#78350f` | Wait / Hold / Neutral (with `⏸` or `•` icon + label) |
| `--color-signal-sell-bg` / `ink` | `#e0f2fe` / `#0c4a6e` | Take Profit / Sell target reached (with `↑` icon + label) |
| `--color-signal-broken-bg` / `ink` | `#ffedea` / `#831c1e` | Plan Broken / Stop-loss breached / Bearish (with `!` icon + label) |

---

## 3. Typography Scale

- **Primary Sans:** System Neo-Grotesk (`'Inter'`, `-apple-system`, `BlinkMacSystemFont`, `'Segoe UI'`, `sans-serif`)
- **Numeric / Code Mono:** `'JetBrains Mono'`, `ui-monospace`, `'SFMono-Regular'`, ` Menlo`, `monospace`
- **Scale & Hierarchy (App-Screen Rules):**
  - Page Title (`h1`): `24px` (`1.5rem`), weight `600`, tracking `-0.02em`, max 2 lines.
  - Section Title (`h2`): `18px` (`1.125rem`), weight `600`.
  - Card Title (`h3`): `16px` (`1rem`), weight `600`.
  - KPI / Primary Figure: `28px` (`1.75rem`), weight `600`, `tabular-nums`.
  - Body / Lesson Prose: `16px` (`1rem`), line-height `1.6`, max measure `65ch`, full ink `#0a0a0a` for running text.
  - App Controls / Table Cells / Labels: `14px` (`0.875rem`), weight `400`–`500`.
  - Axis Ticks / Captions / Badges: `12px` (`0.75rem`), weight `500` (minimum allowed font size is `12px`).
- **House Rules Enforced:**
  - Sentence case everywhere. No tracked-out `UPPERCASE` eyebrows or table headers.
  - No italic/coloured accent word inside headings.
  - No glassmorphism (`backdrop-filter: blur`), no decorative gradients, no resting card drop shadows.
  - Bimodal tight radii: `8px` (`--radius-lg`) on cards/panels, `6px` (`--radius-md`) on controls/inputs, `4px` (`--radius-sm`) on tags/badges.

---

## 4. Required UI States & Accessibility

1. **Non-Colour Redundancy:**
   - Every Signal Badge and 3-Light row pairs a distinct shape/icon (`[✓]`, `[—]`, `[!]`) and explicit text (`Light 1 ON: Price on discount`) with its semantic tint.
   - Bullish vs. Bearish candles in lessons and diagrams include pattern/fill differentiation (hollow/light fill with `+` vs solid dark/hatched with `−`) and text readouts in addition to colour.
2. **Complete States:**
   - **Empty / First Run (Signal Checker):** Shows the framed result preview slot with a single clear instruction and a "Load SOL worked example (Nov 2026)" button to test immediately.
   - **Validation Error:** Inline field-level message in `--color-signal-broken-ink` explaining what failed and how to fix it (e.g., `"RSI must be between 0 and 100"`), plus a gentle warning banner when a support level is entered above the current price.
   - **Zero / Missing Optional Values:** Printed honestly as `—` (em-dash) for optional BOLL/resistance levels when omitted.
3. **Responsive Structure:**
   - Desktop (`1440px`): Two-column split on the Signal Checker (left: input form; right: live/submitted Result Screen & Plan Card aligned on top and bottom edges). Lesson pages use a clean chapter layout with the interactive chart island full-width inside the content column.
   - Mobile (`390px`): Single column, 44px minimum touch targets on all form inputs, sliders, and SVG drag handles, with keyboard arrow-key support on every interactive chart control.

