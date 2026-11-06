export type TermCategory = 'Screen Basics' | 'The 3 Lights' | 'Price Zones' | 'Orders & Safety';

export interface TermDefinition {
  id: string;
  name: string;
  shortLabel?: string;
  category: TermCategory;
  plainMeaning: string;
  analogy: string;
  example: string;
  whereOnExchange: string;
}

export const TERMS: Record<string, TermDefinition> = {
  'spot-market': {
    id: 'spot-market',
    name: 'Spot Market',
    category: 'Screen Basics',
    plainMeaning:
      'Buying the actual crypto coin directly with your own cash, with no borrowed money or futures.',
    analogy:
      'Like buying groceries at a supermarket with cash in your wallet: you own the item outright and can never owe the store extra money.',
    example:
      'If you buy 1 SOL for 128 USDT on the Spot tab, you simply own 1 SOL. Even if the price drops, you cannot be force-liquidated.',
    whereOnExchange:
      'Top navigation bar -> click "Trade" -> select "Spot" (avoid "Futures" or "Margin").',
  },
  usdt: {
    id: 'usdt',
    name: 'USDT (Tether Stablecoin)',
    category: 'Screen Basics',
    plainMeaning:
      'Digital cash on an exchange that stays pegged 1-to-1 with the US Dollar (1 USDT is roughly $1 USD).',
    analogy:
      'Like casino or arcade tokens that always equal $1.00 so you can step out of volatile coins and hold steady dollar value.',
    example:
      'When a pair says SOL/USDT = 128.18, it means 1 Solana coin costs 128.18 USDT (about $128.18).',
    whereOnExchange:
      'Shown as the second half of the trading pair at the top-left (for example, BTC/USDT or SOL/USDT).',
  },
  timeframe: {
    id: 'timeframe',
    name: 'Timeframe (4H / 1D)',
    category: 'Screen Basics',
    plainMeaning: 'How much time a single candlestick bar represents on the chart.',
    analogy:
      'Checking the weather forecast for the whole week (4H / 1D) instead of staring at wind gusts every 5 seconds (1m).',
    example:
      'On a 4H chart, a new candle finishes every 4 hours (6 candles per day). On a 1D chart, 1 candle shows one full day of trading.',
    whereOnExchange:
      'Row of small time buttons directly above the chart: click "4H" or "1D" instead of "1m" or "15m".',
  },
  candlestick: {
    id: 'candlestick',
    name: 'Candlestick (OHLC)',
    category: 'Screen Basics',
    plainMeaning:
      'A single vertical bar that packs four prices from one time period: Open, High, Low, and Close.',
    analogy:
      'A daily thermometer strip showing the morning temperature (Open), hottest afternoon peak (High), coldest night dip (Low), and midnight reading (Close).',
    example:
      'If SOL opens a 4-hour period at $126, dips to $125, peaks at $130, and finishes at $129, the candle is green because it closed higher ($129) than it opened ($126).',
    whereOnExchange:
      'The main center area of the chart made of green (up) and red (down) vertical bars.',
  },
  wick: {
    id: 'wick',
    name: 'Candle Wick (Shadow)',
    category: 'Screen Basics',
    plainMeaning:
      'The thin vertical line sticking out above or below the thick candle body, showing the highest and lowest price reached during that period.',
    analogy: 'Footprints in wet sand showing how far the tide reached before pulling back.',
    example:
      'A long lower wick at $126.50 means sellers pushed the price down to $126.50, but buyers rushed in and pushed the price back up before the candle finished.',
    whereOnExchange:
      'The thin needles sticking out from the top and bottom of each green or red candle bar.',
  },
  volume: {
    id: 'volume',
    name: 'Trading Volume',
    category: 'Screen Basics',
    plainMeaning: 'The total amount of coins or dollars actually traded during that candle period.',
    analogy:
      'The size of the crowd at an auction. A price jump with 5,000 bidders is real demand; a price jump with only 2 bidders is fragile.',
    example:
      'When price bounces off a support floor with a tall green Volume bar at the bottom of the chart, large buyers are stepping in.',
    whereOnExchange:
      'The row of vertical bars directly underneath the main candlestick chart labeled "VOL".',
  },
  ma30: {
    id: 'ma30',
    name: 'MA30 (30-Bar Moving Average)',
    category: 'The 3 Lights',
    plainMeaning:
      'A smooth line showing the average closing price of the last 30 candles. It acts as our Light 1 "fair-price baseline".',
    analogy:
      'The normal 30-day supermarket price of coffee. If a bag usually costs $12 (MA30) and today it is $10 (Current Price), it is on discount.',
    example:
      'On a 4H chart, if MA30 is 129.07 and SOL Current Price is 128.18, price is below MA30, turning Light 1 ON (buying on discount).',
    whereOnExchange:
      'Printed in small colored text at the top-left of the chart (for example, "MA30: 129.07").',
  },
  'bollinger-bands': {
    id: 'bollinger-bands',
    name: 'BOLL (Bollinger Bands)',
    category: 'The 3 Lights',
    plainMeaning:
      'Three curved lines (Upper, Middle, Lower) that form a flexible price tunnel around the average price.',
    analogy:
      'Bumpers on a bowling lane. When price touches the lower bumper (BOLL Lower), it is stretched far below normal; when it hits the upper bumper, it is stretched high.',
    example:
      'If BOLL Lower is 126.50 and price drops near 127.00, the coin is near the bottom edge of its normal price tunnel.',
    whereOnExchange:
      'Turn on the "BOLL" button above or below the chart; look for "BOLL: UB / MB / LB" in the top-left legend.',
  },
  rsi: {
    id: 'rsi',
    name: 'RSI (Relative Strength Index)',
    category: 'The 3 Lights',
    plainMeaning:
      'A 0-to-100 speedometer that measures whether sellers or buyers are exhausted. Light 2 turns ON when RSI is 36 or lower.',
    analogy:
      'A rubber band stretched downward. Below 36, sellers have pulled the band very tight and are running out of energy; above 70, buyers have stretched it too high.',
    example:
      'An RSI reading of 32.57 is below 36, meaning recent selling was heavy and sellers are getting tired (Light 2 ON).',
    whereOnExchange: 'Bottom sub-chart panel labeled "RSI(14)" with a number between 0 and 100.',
  },
  'order-book': {
    id: 'order-book',
    name: 'Order Book & Bid %',
    category: 'The 3 Lights',
    plainMeaning:
      'The live list of waiting buy orders (Green Bids) and waiting sell orders (Red Asks). Light 3 turns ON when Buyers (Bid %) make up at least 40%.',
    analogy:
      'A tug-of-war rope bar showing how many buyers are waiting with cash buckets below current price versus sellers above.',
    example:
      'If the Order Book bar shows 41.58% Bid (green) and 58.42% Ask (red), Bid % is at least 40%, so Light 3 is ON. If Bid % is only 22%, buyers are stepping away (Wait).',
    whereOnExchange:
      'The green/red percentage bar at the top or bottom of the Order Book column on the right side of Gate.com.',
  },
  support: {
    id: 'support',
    name: 'Support (Price Floor)',
    category: 'Price Zones',
    plainMeaning:
      'A past price level below the current price where buyers stepped in before and made the coin bounce upward.',
    analogy:
      'The concrete floor of a room. Drop a tennis ball and it tends to bounce when it hits the floor, unless the floor cracks.',
    example:
      'If SOL bounced twice at $126.64 last week, $126.64 is a Support floor where we can place a waiting buy limit order.',
    whereOnExchange:
      'Look left on your 4H or 1D chart and find the horizontal price levels where red drops previously bounced.',
  },
  resistance: {
    id: 'resistance',
    name: 'Resistance (Price Ceiling)',
    category: 'Price Zones',
    plainMeaning:
      'A past price level above the current price where sellers previously cashed out and pushed the price back down.',
    analogy:
      'The ceiling of a room. Throw a ball up and it tends to hit the ceiling and fall back down.',
    example:
      'If SOL got rejected at $135.00 twice recently, $135.00 is your Resistance ceiling and a sensible place to take profit.',
    whereOnExchange:
      'Look left on your 4H or 1D chart and find the peaks where green rallies previously stalled.',
  },
  'limit-order': {
    id: 'limit-order',
    name: 'Limit Order',
    category: 'Orders & Safety',
    plainMeaning:
      'An order where YOU set the exact price you are willing to pay (or sell for), and the exchange waits until the market reaches your price.',
    analogy:
      'Leaving a written offer with a shopkeeper: "If mangoes drop to $2.00 today, buy 5 for me." You don\'t have to sit and watch the screen.',
    example:
      'Instead of buying at $128.18 immediately, you place a Limit Buy at Support 2 ($126.64) for $50 USDT and close the app calmly.',
    whereOnExchange:
      'In the Buy/Sell order panel on the right -> choose "Limit" (instead of "Market").',
  },
  'market-order': {
    id: 'market-order',
    name: 'Market Order',
    category: 'Orders & Safety',
    plainMeaning:
      'An order that buys or sells immediately at whatever price sellers are demanding right this second, often paying higher fees.',
    analogy:
      'Running into an airport kiosk 2 minutes before boarding and paying whatever price is on the tag without checking.',
    example:
      'Beginners often panic-click Market Buy during a fast green spike and end up buying at the very top.',
    whereOnExchange:
      'Next to "Limit" in the order panel. Prefer Limit orders so you control your exact entry price.',
  },
  'split-entry': {
    id: 'split-entry',
    name: 'Split-Entry Ladder (13% / 21% / 30%)',
    category: 'Orders & Safety',
    plainMeaning:
      'Dividing your budget into 3 staggered buy orders at lower support floors while keeping 36% of your cash unspent in reserve.',
    analogy:
      'Testing the water depth with one foot first instead of diving headfirst into an unknown pool.',
    example:
      'With $233.77 USDT: Entry 1 uses $30 (13%), Entry 2 uses $50 (21%), Entry 3 uses $70 (30%), and $83.77 (36%) stays untouched in cash.',
    whereOnExchange: 'Calculated automatically by the 3-Light Signal Helper on the /checker page.',
  },
  'stop-loss': {
    id: 'stop-loss',
    name: 'Stop-Loss (Plan Broken Exit)',
    category: 'Orders & Safety',
    plainMeaning:
      'A pre-decided exit price (default 2% below your lowest support floor) where you admit the floor broke and step out to protect your remaining cash.',
    analogy:
      'A fire exit chosen before the movie starts. If the alarm rings, you walk out the door calmly instead of freezing.',
    example:
      'If your lowest support floor is $124.50, a 2% stop-loss sits at $122.01. If price closes below $122.01, you exit instead of hoping.',
    whereOnExchange:
      'Set using the "TP/SL" or "Stop-Limit" option on your exchange Spot order panel.',
  },
};

export const TERM_LIST: TermDefinition[] = Object.values(TERMS);
