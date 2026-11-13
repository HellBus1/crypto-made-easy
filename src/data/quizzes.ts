/**
 * Practical Decision Quizzes for All 8 Chapters (Phase 7)
 *
 * Every chapter has 3 real-world spot trading scenarios designed to break the
 * "Valedictorian Trap" (knowing definitions without knowing what to do live).
 */

export interface QuizQuestion {
  id: string;
  scenario: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ChapterQuizSet {
  chapter: number;
  title: string;
  questions: QuizQuestion[];
}

export const CHAPTER_QUIZZES: Record<number, ChapterQuizSet> = {
  1: {
    chapter: 1,
    title: 'Spot Screen Reality Check',
    questions: [
      {
        id: 'ch1-q1',
        scenario:
          'You open Gate.com and notice the default chart timeframe is set to 15m (15-minute candles), jumping rapidly up and down. You have a full-time day job. What do you click first?',
        options: [
          'Switch to 1m so you can catch tiny fast bounces',
          'Switch to 4h or 1D so noisy micro-moves filter out',
          'Switch to Futures 10x tab for faster gains',
        ],
        correctIndex: 1,
        explanation:
          'This playbook runs on Spot 4H and 1D candles. Lower timeframes (1m-15m) amplify random noise and tempt impulsive clicks.',
      },
      {
        id: 'ch1-q2',
        scenario:
          'On the Spot Order Book panel, Green Bids show 22% and Red Asks show 78%. Which side currently holds more waiting volume?',
        options: [
          'Green buyers are lining up to support the price',
          'Red sellers dominate with more coins waiting to be sold overhead',
          'Order book percentages only apply to Futures contracts',
        ],
        correctIndex: 1,
        explanation:
          'Bids = waiting buyers underneath; Asks = waiting sellers overhead. At 22% Bid / 78% Ask, sellers heavily outweigh buyers (ETH Wait example).',
      },
      {
        id: 'ch1-q3',
        scenario:
          'You have a $50 starter budget on Gate.com Spot and plan a 13% Entry 1 slice ($6.42). Does $6.42 clear Gate.com minimum order rules?',
        options: [
          'Yes, $6.42 is safely above Gate.com minimum 1 USDT spot order size',
          'No, Spot requires at least $100 per order',
          'Yes, but only if you borrow 5x margin',
        ],
        correctIndex: 0,
        explanation:
          'Gate.com Spot minimum is 1 USDT for most USDT pairs, so a $6.42 limit order works cleanly without touching margin or borrowing.',
      },
    ],
  },
  2: {
    chapter: 2,
    title: 'Reading Buyer Absorption vs Crashes',
    questions: [
      {
        id: 'ch2-q1',
        scenario:
          'After a 3-hour dip into $88.50 support, a 4H SOL candle drops to $86.90 intraday but closes back at $89.40, leaving a long bottom wick. What happened?',
        options: [
          'Buyers stepped in strongly around support and absorbed the selling pressure',
          'No trades occurred below $89.40',
          'The exchange froze the order book',
        ],
        correctIndex: 0,
        explanation:
          'A long lower wick at a known support floor shows sellers pushed down, real buyers filled their limit orders there, and price closed well above the low.',
      },
      {
        id: 'ch2-q2',
        scenario:
          'A red 4H candle has zero bottom wick, closes at its absolute low on huge red volume, and breaks cleanly beneath the prior floor. Should you market-buy the close?',
        options: [
          'Yes, every red candle automatically bounces next bar',
          'No, wait for sellers to show exhaustion and a higher low / wick reaction at the next floor',
          'Double your budget immediately',
        ],
        correctIndex: 1,
        explanation:
          'Full-body marubozu breakdown candles closing at the low with no wick show unchecked selling momentum. Wait for absorption instead of catching a falling knife.',
      },
      {
        id: 'ch2-q3',
        scenario:
          'Which timeframe gives you the real story of whether buyers actually defended a support level?',
        options: [
          'Watching an unclosed 1-minute tick wiggle',
          'Waiting for the 4H or 1D candle close near the support zone',
          'Refreshing 5-second price alerts every 2 minutes',
        ],
        correctIndex: 1,
        explanation:
          'Candles can spike down mid-bar and recover before the close. Evaluating at 4H or 1D candle closes prevents reacting to fake mid-bar noise.',
      },
    ],
  },
  3: {
    chapter: 3,
    title: 'Using Indicators Without Chart Clutter',
    questions: [
      {
        id: 'ch3-q1',
        scenario:
          'A coin has been printing lower highs and lower lows for 8 straight days, trading far below a steeply falling MA30, and RSI hits 33. Is it automatically a safe Spot buy?',
        options: [
          'Yes, RSI <= 38 always guarantees an instant reversal',
          'No, RSI can stay low throughout a sustained downtrend -- you must check 1D/4H structure and BTC context first',
          'Only if you remove the Stop-Loss',
        ],
        correctIndex: 1,
        explanation:
          'Why "downtrend -> buy" fails in real life: cheap coins in a structural crash keep getting cheaper. Buying dips works best on pullbacks in an uptrend or near proven sideways support.',
      },
      {
        id: 'ch3-q2',
        scenario:
          'SOL current price is $89.73, MA30 is $91.60, and Lower Bollinger Band (BOLL LB) is $88.90. Does Light 1 (Price on Discount) turn ON?',
        options: [
          'Yes -- price is below MA30 ($89.73 < $91.60)',
          'No -- price must fall below $50 first',
          'Only if MACD is green',
        ],
        correctIndex: 0,
        explanation:
          'Light 1 checks whether price is below MA30 or at/below Lower BOLL. Here $89.73 < $91.60 satisfies Light 1.',
      },
      {
        id: 'ch3-q3',
        scenario:
          'While holding SOL from $88.50, price surges to $96.20, above BOLL UB ($95.80), with RSI at 74 and shrinking green MACD bars. What does this tell you?',
        options: [
          'Add 100% more money because it is going up fast',
          'Sellers are likely to take profit soon -- consider taking planned profit into Resistance',
          'Panic and move your stop-loss further away',
        ],
        correctIndex: 1,
        explanation:
          'Price stretched above Upper BOLL with RSI > 70 and fading MACD momentum is a classic Take-Profit warning -- lock gains systematically rather than waiting for greed to fade.',
      },
    ],
  },
  4: {
    chapter: 4,
    title: 'Support Floors, Ceilings & Auto Stops',
    questions: [
      {
        id: 'ch4-q1',
        scenario:
          'Your lowest major Support Floor (S3) on SOL is $81.20. Using the 2% protective stop rule, where should you set your automatic Gate.com TP/SL Stop-Loss?',
        options: [
          '$81.20 exact (0% buffer)',
          '$79.58 (2% below $81.20, so minor wicks do not shake you out unnecessarily)',
          '$65.00 (20% below S3)',
        ],
        correctIndex: 1,
        explanation:
          'Placing the stop 2% below your lowest support ($81.20 * 0.98 = $79.58) gives price room for normal wick noise around support while cutting losses cleanly if the floor breaks.',
      },
      {
        id: 'ch4-q2',
        scenario:
          'You enter SOL at $88.50 (Entry 1) on Gate.com Spot. When should you place your TP/SL Stop-Loss order?',
        options: [
          'Immediately after Entry 1 fills, as an automatic Gate.com Spot TP/SL order',
          'Wait 3 days and decide manually if you feel like selling',
          'Never set a stop on Spot; just hold forever',
        ],
        correctIndex: 0,
        explanation:
          'Setting an automatic exchange TP/SL right after fill eliminates hesitation when price drops while you are asleep or at work.',
      },
      {
        id: 'ch4-q3',
        scenario:
          'Suppose Resistance Ceiling 1 is clearly visible at $95.00, while 2% below S3 implies higher risk than reward if you chase at $94.00. What should you do?',
        options: [
          'Market-buy at $94.00 anyway so you do not miss out',
          'Wait for price to pull back toward Support 1 ($88.50) where upside to $95.00 justifies the risk',
          'Delete the Resistance line from your chart',
        ],
        correctIndex: 1,
        explanation:
          'Buying right under a Resistance ceiling leaves tiny reward and large downside back to support. Good plans enter near support floors, not ceilings.',
      },
    ],
  },
  5: {
    chapter: 5,
    title: 'Running the 3-Light Safety Override',
    questions: [
      {
        id: 'ch5-q1',
        scenario:
          'Historical ETH example: Price $2,420 < MA30 $2,490 (Light 1 ON), RSI is 34 (Light 2 ON), and Order Book Bid% is 22% (Ask 78%). What is your action?',
        options: [
          'Buy immediately because 2 of 3 lights are ON',
          'WAIT -- Light 3 is OFF (sellers dominate the order book at 78%)',
          'Double Entry 1 size to force a bounce',
        ],
        correctIndex: 1,
        explanation:
          'Buying with only 2/3 lights when 78% of nearby book orders are sellers means stepping in front of heavy overhead supply. Wait until Bid >= 40%.',
      },
      {
        id: 'ch5-q2',
        scenario:
          'All 3 SOL lights flicker green (Price < MA30, RSI 36, Bid 41%), BUT Bitcoin dropped -7.2% in the past 24 hours and the 1D trend is vertical red. What does our rule say?',
        options: [
          'Skip or Wait -- BTC <= -5% triggers the market-context crash override',
          'Ignore Bitcoin completely; altcoins never follow BTC',
          'Spend your 36% reserve immediately',
        ],
        correctIndex: 0,
        explanation:
          'Altcoins almost always get dragged down when BTC flushes <= -5%. Respecting the BTC Context Override protects your starter capital from false 3/3 traps.',
      },
      {
        id: 'ch5-q3',
        scenario: 'Which combination legitimately triggers a Spot Buy Zone (Entry 1 limit order)?',
        options: [
          'Price below MA30, RSI <= 38, Bid >= 40%, calm BTC (> -5%), healthy 1D/4H structure, AND automatic TP/SL planned',
          'RSI at 78 and a green Twitter post',
          'Only Light 1 ON while Bid% is 19%',
        ],
        correctIndex: 0,
        explanation:
          'All three lights must align alongside healthy higher-timeframe context and a pre-placed stop/exit plan before risking real USDT.',
      },
    ],
  },
  6: {
    chapter: 6,
    title: 'Splitting a <$50 Starter Budget',
    questions: [
      {
        id: 'ch6-q1',
        scenario:
          'Using the 13% / 21% / 30% / 36% ladder on a $50 starter budget, approximately how much USDT goes into Entry 1 (near Support 1)?',
        options: [
          '$50.00 all at once',
          '~$6.42 (13%), keeping $43.58 safely staged for lower floors and reserve',
          '$0.50 (below the 1 USDT Gate.com minimum)',
        ],
        correctIndex: 1,
        explanation:
          'Starting with ~$6.42 leaves ~$10.70 for Support 2, ~$14.97 for Support 3, and ~$17.91 untouched in reserve -- enough to clear Gate.com 1 USDT minimum with small loss exposure.',
      },
      {
        id: 'ch6-q2',
        scenario:
          'Gate.com charges ~0.2% standard Spot taker/maker fees (approx 0.4% round trip). If your target net profit from Entry 1 ($6.42) to Resistance is only +0.3%, is that worth taking?',
        options: [
          'No -- fees alone would eat the entire +0.3% move; aim for realistic structure targets (+6% to +8%+) from support to resistance',
          'Yes, 0.3% scalp trades on 4H Spot make sense after fees',
          'Gate.com Spot trades have zero fees automatically',
        ],
        correctIndex: 0,
        explanation:
          'Round-trip fees (~0.4% before GT/VIP discounts) wipe out tiny 0.3% swings. Entering near support and targeting genuine resistance levels gives healthy breathing room above fees.',
      },
      {
        id: 'ch6-q3',
        scenario:
          'Your Entry 1 ($6.42) fills, price drops right through Support 3 and hits your automatic Stop-Loss (-2% below Support 3). Should you dip into your 36% Cash Reserve ($17.91) to average down anyway?',
        options: [
          'No -- when the floor breaks, the thesis is invalidated; exit via Stop-Loss and protect the reserve',
          'Yes, push all $17.91 in to try to break even faster',
          'Cancel the Stop-Loss before it triggers',
        ],
        correctIndex: 0,
        explanation:
          'Your 36% Cash Reserve is emergency capital for future valid setups -- never rescue fuel for a trade whose lowest floor already cracked.',
      },
    ],
  },
  7: {
    chapter: 7,
    title: 'Escaping the Valedictorian Trap',
    questions: [
      {
        id: 'ch7-q1',
        scenario:
          'You just bought SOL Entry 1 at $88.50 with an automatic Stop-Loss at $79.58. Two hours later SOL pulls back 4% to $84.95 near Support 2. What is happening?',
        options: [
          'Normal market breathing -- it is still well above your $79.58 stop and moving toward planned Entry 2 ($85.00)',
          'A catastrophic Plan Broken crash requiring immediate panic market selling',
          'Time to stare at the 1-minute chart for 4 hours straight',
        ],
        correctIndex: 0,
        explanation:
          'A 4-6% dip above your lowest support stop is normal crypto volatility (market breathing). Let your limit ladder and automatic Stop-Loss do their job.',
      },
      {
        id: 'ch7-q2',
        scenario:
          'You have finished reading all 8 lessons and understand every definition. What breaks the "Valedictorian Trap" before you fund a real trade?',
        options: [
          'Immediately depositing 5x your comfort budget because you scored 100% on vocabulary',
          'Logging 10 calm 4H/1D checks in the Paper Journal (including Wait/Skip calls) at max 2 check times per day, then starting under $50 Spot',
          'Checking charts 30 times a day so you never miss a candle',
        ],
        correctIndex: 1,
        explanation:
          'Practicing 10 real-chart evaluations (including skipping bad trades and verifying BTC + auto-stop rules) converts textbook knowledge into repeatable live execution.',
      },
      {
        id: 'ch7-q3',
        scenario:
          'On Tuesday morning check #1, nothing hits 3/3 Green Lights. On Tuesday evening check #2, BTC is down -6%. How should you grade your day in the Paper Journal?',
        options: [
          'Failure -- I did not click Buy today',
          '100% Rule-Compliant Win -- choosing WAIT when rules are not met saved my capital',
          'Override rules just to feel active',
        ],
        correctIndex: 1,
        explanation:
          'Sitting in USDT when the market fails your checklist is an active winning decision, not a wasted day.',
      },
    ],
  },
  8: {
    chapter: 8,
    title: 'Gate.com Spot Fluency Check',
    questions: [
      {
        id: 'ch8-q1',
        scenario:
          'In Gate.com trading, you want to buy SOL ONLY if it drops to your exact $88.50 Support 1 floor (never higher). Which order type do you select?',
        options: ['Market Order', 'Limit Order', 'Futures Isolated 20x'],
        correctIndex: 1,
        explanation:
          'A Limit Order sits patiently in the Green Order Book and fills only at $88.50 or better, letting you close the app cleanly.',
      },
      {
        id: 'ch8-q2',
        scenario:
          'In Gate.com Spot, which built-in feature lets you automate BOTH your upside profit exit ($95.00) and your downside safety stop ($79.58) right after filling?',
        options: [
          'Spot TP/SL (Take-Profit / Stop-Loss) trigger order',
          'Cross Margin Borrow toggle',
          'Converting Spot balance into Futures',
        ],
        correctIndex: 0,
        explanation:
          'Spot TP/SL trigger orders automatically sell your Spot coins if either your profit target or protective stop price is hit.',
      },
      {
        id: 'ch8-q3',
        scenario: 'On the order book, "Bid 41% / Ask 59%" tells you what?',
        options: [
          '41% of nearby waiting limit volume is buyers (Bids) underneath, 59% is sellers (Asks) overhead -- Light 3 (>= 40% Bids) is ON',
          'The coin guaranteed +41% return tomorrow',
          'The platform fee is 41%',
        ],
        correctIndex: 0,
        explanation:
          'Bid = waiting buyers; Ask = waiting sellers. Having at least 40% Bids confirms real resting buyer liquidity rather than a one-sided seller wall.',
      },
    ],
  },
};
