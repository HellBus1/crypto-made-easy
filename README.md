# Crypto Made Easy

A calm, static, English-language learning course and manual **3-Light Spot Signal Checklist** designed to help casual swing traders read crypto exchange charts (`4H` / `1D`) without visual overload or panic selling.

---

## Core Pillars

1. **Interactive Learn Modules (`/learn`)**: Eight short chapters with interactive chart simulations covering how order books form candlesticks and volume, candlestick anatomy (OHLC), plain-language indicators (`MA30`, `BOLL`, `RSI`, `VOL`, `MACD`), support/resistance floors, the 3-Light checklist, position sizing, and trading mindset.
2. **Stateless Signal Checker (`/checker`)**: Type in the numbers from your exchange chart to evaluate the 3 Lights (`Price vs MA30/BOLL`, `RSI <= 36`, `Order Book Bid >= 40%`), receive a plain-language **Buy Zone / Wait / Take Profit / Plan Broken** badge, and compute a **3-tier split-entry ladder (`13% / 21% / 30%`) + `36%` cash reserve** and pre-agreed stop-loss.

---

## Tech Stack

- **Framework**: [Astro 7](https://astro.build) (static output) + [React 19](https://react.dev) islands + [MDX](https://mdxjs.com)
- **Language**: TypeScript (strict mode)
- **Charts**: `lightweight-charts` + custom accessible SVG interactive diagrams
- **Styling**: Pure CSS Custom Properties (`src/styles/tokens.css`, **Achromatic Ledger** light-first theme)
- **Testing & Quality**: Vitest (unit), Playwright (E2E), ESLint, Prettier

---

## Git Branching & Workflow Rules

All development strictly follows a three-tier branching workflow:

```text
master (main / production — feature or release branches open MR here)
  └── staging (testing / integration — feature branches pull from & merge here for testing)
        ├── feat/phase-0-scaffold
        ├── feat/phase-1-signal-logic
        └── feat/phase-...
```

1. **`master`**: Production mainline branch. Protected from direct work; changes land here via Merge Request (MR / PR) after verification.
2. **`staging`**: Testing and integration branch. Feature branches pull from `staging` and merge into `staging` for integration testing.
3. **`feat/*` / `fix/*`**: Every implementation phase or feature is developed on its own dedicated branch (e.g., `feat/phase-0-scaffold`) branched off `staging`.

---

## Available Scripts

| Script                 | Description                                               |
| ---------------------- | --------------------------------------------------------- |
| `npm run dev`          | Starts the Astro development server at `localhost:4321`   |
| `npm run build`        | Compiles the production static site into `dist/`          |
| `npm run preview`      | Previews the production build locally                     |
| `npm run check`        | Runs Astro & TypeScript diagnostic checks (`astro check`) |
| `npm run lint`         | Lints JS, TS, and Astro files with ESLint                 |
| `npm run format`       | Formats the codebase using Prettier                       |
| `npm run format:check` | Verifies code formatting with Prettier                    |
| `npm run test`         | Runs unit tests via Vitest                                |
| `npm run test:e2e`     | Runs Playwright E2E tests                                 |

---

## License

MIT
