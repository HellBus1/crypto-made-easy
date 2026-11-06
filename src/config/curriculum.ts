/**
 * Course Curriculum Configuration
 * Defines the 8 ordered chapters from the PRD so the Overview and Learn pages
 * always display the complete learning path.
 */

export interface CurriculumItem {
  chapter: number;
  slug: string;
  title: string;
  track: 'Reading the Screen' | 'Structure & Indicators' | 'Execution & Mindset';
  durationMinutes: number;
  interactiveFocus: string;
  description: string;
}

export const curriculum: CurriculumItem[] = [
  {
    chapter: 1,
    slug: '01-how-a-chart-is-built',
    title: 'How a chart is built',
    track: 'Reading the Screen',
    durationMinutes: 4,
    interactiveFocus: '3-stage cause-and-effect toggle & spot screen anatomy hotspots',
    description:
      'See how raw order book bids and asks turn into candlesticks, volume bars, and indicator overlays on a spot exchange screen.',
  },
  {
    chapter: 2,
    slug: '02-candlestick-anatomy',
    title: 'Candlestick anatomy',
    track: 'Reading the Screen',
    durationMinutes: 4,
    interactiveFocus: 'Draggable Open / High / Low / Close candle editor',
    description:
      'Manipulate open, high, low, and close prices directly and see why a long lower wick at support signals buyer absorption.',
  },
  {
    chapter: 3,
    slug: '03-indicators-in-plain-language',
    title: 'Indicators in plain language',
    track: 'Structure & Indicators',
    durationMinutes: 5,
    interactiveFocus: 'Toggle MA30, BOLL, RSI, Volume, and MACD on one clean chart',
    description:
      'Understand what MA30, Bollinger Bands, RSI, Volume, and MACD actually measure, and why picking MA or EMA keeps your chart readable.',
  },
  {
    chapter: 4,
    slug: '04-support-resistance-and-liquidity',
    title: 'Support, resistance and liquidity zones',
    track: 'Structure & Indicators',
    durationMinutes: 5,
    interactiveFocus: 'Interactive floor and ceiling placement with bounce/break zones',
    description:
      'Locate price floors where resting buy orders cluster and ceilings where sellers take profit before you place a single order.',
  },
  {
    chapter: 5,
    slug: '05-three-light-checklist',
    title: 'The 3-Light checklist',
    track: 'Execution & Mindset',
    durationMinutes: 5,
    interactiveFocus: 'Live 3-Light simulator with SOL and ETH worked examples',
    description:
      'Combine Light 1 (Price vs MA30/BOLL), Light 2 (RSI ≤ 36), and Light 3 (Order Book Bid %) into a calm Buy, Wait, Take Profit, or Plan Broken decision.',
  },
  {
    chapter: 6,
    slug: '06-position-sizing',
    title: 'Position sizing and split entry',
    track: 'Execution & Mindset',
    durationMinutes: 4,
    interactiveFocus: 'Interactive 13% / 21% / 30% / 36% capital ladder calculator',
    description:
      'Divide capital into three limit-order tranches plus a 36% cash reserve and a pre-agreed stop-loss below lowest support.',
  },
  {
    chapter: 7,
    slug: '07-trading-mindset',
    title: 'Trading mindset',
    track: 'Execution & Mindset',
    durationMinutes: 4,
    interactiveFocus: 'Market breathing pullback (5–7%) vs broken trend comparison',
    description:
      'Overcome visual anchoring and panic selling by distinguishing normal market breathing above your stop from a genuinely broken plan.',
  },
  {
    chapter: 8,
    slug: '08-glossary',
    title: 'Chart glossary & everyday analogies',
    track: 'Execution & Mindset',
    durationMinutes: 3,
    interactiveFocus: 'Searchable plain-language dictionary of exchange abbreviations',
    description:
      'Translate every spot exchange abbreviation (OHLC, MA30, BOLL, RSI, MACD, Bid/Ask, Limit, Stop-Loss) into plain English.',
  },
];
