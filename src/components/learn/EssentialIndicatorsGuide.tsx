import { useState } from 'react';

type TimeframeKey = '1m' | '4h' | '1D';
type EssentialId = 'timeframe' | 'ma' | 'boll' | 'rsi' | 'volume';

interface EssentialToolInfo {
  id: EssentialId;
  buttonLabel: string;
  whereOnGate: string;
  whatItDraws: string;
  beginnerQuestion: string;
  plainMeaning: string;
  analogy: string;
  howToRead: string;
}

const ESSENTIAL_TOOLS: EssentialToolInfo[] = [
  {
    id: 'timeframe',
    buttonLabel: '4h / 1D (Instead of 1m)',
    whereOnGate: 'Top-left row directly above the chart: [1m] [15m] [1h] [4h] [1D]',
    whatItDraws: 'Changes how much time 1 candlestick bar represents (4 hours or 1 day).',
    beginnerQuestion: 'Am I looking at calm market trends or noisy 1-minute static?',
    plainMeaning:
      'In your Gate.com screenshot, "1h" is underlined next to "1m" and "15m". Fast timeframes like 1m make the chart jump every second. Switching to 4h or 1D slows the chart down so you only need to check once or twice a day.',
    analogy:
      'Watching a 1m chart is like staring at individual raindrops hitting a windshield. Switching to 4h or 1D is like checking the daily weather forecast.',
    howToRead:
      'Click "4h" or "1D" first. Never make a buying decision while looking at the "1m" button.',
  },
  {
    id: 'ma',
    buttonLabel: 'MA (Moving Average)',
    whereOnGate: 'Bottom indicator bar under the chart: 3rd button from the left [MA]',
    whatItDraws: 'Draws a smooth line right across the candlesticks showing the 30-bar average.',
    beginnerQuestion: 'Light 1: Is the coin currently cheaper than its recent normal price?',
    plainMeaning:
      'When you tap [MA] on Gate.com\'s bottom bar, a smooth line appears on top of the candles and prints "MA30" at the top-left of the chart. It tells you the average closing price of the last 30 bars.',
    analogy:
      'If a pair of shoes averaged $100 over the last 30 days (MA line) and is priced at $92 today (below the line), you know it is genuinely on sale.',
    howToRead:
      'Candles BELOW the smooth MA line = On Discount (Light 1 ON). Candles far ABOVE the MA line = Overpriced.',
  },
  {
    id: 'boll',
    buttonLabel: 'BOLL (Bollinger Tunnel)',
    whereOnGate: 'Bottom indicator bar under the chart: 7th button from the left [BOLL]',
    whatItDraws:
      'Draws 3 lines around the candles: an Upper Roof (UB), Middle Line (MB), and Lower Floor (LB).',
    beginnerQuestion: 'Where is the normal price floor and price roof right now?',
    plainMeaning:
      'Instead of guessing how high or low price usually swings, tapping [BOLL] wraps a visible price tunnel around the candlesticks. About 95% of normal trading stays inside this tunnel.',
    analogy:
      'Think of bowling lane bumpers: when the ball touches the bottom bumper (Lower Band), it tends to bounce back toward the middle of the lane.',
    howToRead:
      'Touching the Lower Band (LB) = Cheap bounce zone. Touching the Upper Band (UB) = Expensive roof (never buy here).',
  },
  {
    id: 'rsi',
    buttonLabel: 'RSI (Exhaustion Meter)',
    whereOnGate: 'Bottom indicator bar: click the [>] arrow on the far right to reveal [RSI]',
    whatItDraws: 'Opens a 0-to-100 speedometer sub-chart at the very bottom of the screen.',
    beginnerQuestion: 'Light 2: Are sellers tired and running out of steam yet?',
    plainMeaning:
      'RSI measures how fast and hard price has been pushed from 0 to 100. When RSI drops to 36 or lower, sellers have already dumped hard and are getting exhausted. When RSI rises above 70, buyers are overheated.',
    analogy:
      'Stretching a rubber band downward: once the meter hits 36 or lower, the rubber band is stretched tight and ready to snap back up.',
    howToRead:
      'RSI 36 or lower = Sellers tired (Light 2 ON). RSI 70 or higher = Overheated (Take Profit zone).',
  },
  {
    id: 'volume',
    buttonLabel: 'Volume (Activity Bars)',
    whereOnGate: 'Bottom indicator bar: 5th button [Volume] (already open in your screenshot)',
    whatItDraws: 'Vertical green and red pillars directly underneath the candlesticks.',
    beginnerQuestion: 'How many people actually traded during that candle?',
    plainMeaning:
      'In your Gate.com screenshot, you can see "Volume 14.51" right below the main chart. Tall bars mean a huge crowd of traders participated; tiny bars mean almost nobody was trading.',
    analogy:
      'One person shouting in an empty room is noise (low volume). A thousand shoppers lining up at the door is real conviction (high volume).',
    howToRead:
      'A tall red Volume spike followed by smaller bars near a Support floor often marks the final panic dump before a bounce.',
  },
];

interface GateBottomButton {
  label: string;
  essential: boolean;
  toolId?: EssentialId;
  ignoreReason?: string;
}

const GATE_BOTTOM_BUTTONS: GateBottomButton[] = [
  {
    label: 'SRL',
    essential: false,
    ignoreReason: 'Auto support lines; better to read real bounce floors yourself.',
  },
  {
    label: 'Turnover',
    essential: false,
    ignoreReason: 'Duplicates Volume in dollar terms; not needed for beginners.',
  },
  { label: 'MA', essential: true, toolId: 'ma' },
  {
    label: 'EMA',
    essential: false,
    ignoreReason: 'Almost identical to MA; using both just clutters the chart.',
  },
  { label: 'Volume', essential: true, toolId: 'volume' },
  {
    label: 'MACD',
    essential: false,
    ignoreReason: 'Optional wave helper; you can skip it until Chapter 5.',
  },
  { label: 'BOLL', essential: true, toolId: 'boll' },
  {
    label: 'VPVR',
    essential: false,
    ignoreReason: 'Sideways volume histogram for advanced day traders.',
  },
  {
    label: 'SAR',
    essential: false,
    ignoreReason: 'Trailing dots for leveraged trend followers; ignore on Spot.',
  },
  { label: 'AVL', essential: false, ignoreReason: 'Average price line that duplicates MA.' },
  {
    label: 'MTM',
    essential: false,
    ignoreReason: 'Raw momentum math; RSI is much easier to read.',
  },
  { label: 'VR', essential: false, ignoreReason: 'Volume ratio oscillator; unnecessary clutter.' },
  { label: 'DMA', essential: false, ignoreReason: 'Dual moving average difference; skip.' },
  { label: 'SKDJ', essential: false, ignoreReason: 'Fast stochastic lines for scalpers; skip.' },
  { label: 'PSY', essential: false, ignoreReason: 'Psychological line count; skip.' },
  { label: 'BBI', essential: false, ignoreReason: 'Bull/bear index blend; skip.' },
  { label: 'RSI', essential: true, toolId: 'rsi' },
];

export default function EssentialIndicatorsGuide() {
  const [selectedToolId, setSelectedToolId] = useState<EssentialId>('ma');
  const [timeframe, setTimeframe] = useState<TimeframeKey>('4h');
  const [showMA, setShowMA] = useState<boolean>(true);
  const [showBOLL, setShowBOLL] = useState<boolean>(false);
  const [showRSI, setShowRSI] = useState<boolean>(true);
  const [showVolume, setShowVolume] = useState<boolean>(true);
  const [essentialsOnlyFilter, setEssentialsOnlyFilter] = useState<boolean>(true);

  const activeTool =
    ESSENTIAL_TOOLS.find((item) => item.id === selectedToolId) ?? ESSENTIAL_TOOLS[0];

  const handleSelectTool = (id: EssentialId) => {
    setSelectedToolId(id);
    if (id === 'ma') {
      setShowMA(true);
    } else if (id === 'boll') {
      setShowBOLL(true);
    } else if (id === 'rsi') {
      setShowRSI(true);
    } else if (id === 'volume') {
      setShowVolume(true);
    } else if (id === 'timeframe') {
      setTimeframe('4h');
    }
  };

  return (
    <div className="sim-box" data-ui="essential-indicators-guide">
      <div className="sim-box__header">
        <div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '4px',
            }}
          >
            <span className="status-pill status-pill--positive">
              Beginner Essentials Filter (4 Tools vs 17 Buttons)
            </span>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-subtle)' }}>
              Click any button below to see where it lives and what it draws on the graph
            </span>
          </div>
          <h3 className="sim-box__title">
            Where to Find 1m / 4H, MA, BOLL &amp; RSI (And the 13 Buttons You Can Ignore)
          </h3>
          <p className="sim-box__subtitle">
            Gate.com packs 17 tiny indicator buttons along the bottom of the chart. As a beginner,
            you only need <strong>4 essential controls</strong> to read the market and trade safely.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setEssentialsOnlyFilter(!essentialsOnlyFilter)}
          className={essentialsOnlyFilter ? 'btn-primary' : 'btn-secondary'}
          style={{ flexShrink: 0 }}
        >
          <span>
            {essentialsOnlyFilter
              ? 'Highlighting 4 Essentials Only'
              : 'Showing All 17 Gate.com Buttons'}
          </span>
        </button>
      </div>

      <div className="sim-box__body">
        {/* Part 1: Interactive Replicated Gate.com Top & Bottom Button Bars + Live Graph */}
        <div className="essentials-layout">
          {/* Left Column: Replicated Gate.com Chart Frame with Top Bar, Graph, and Bottom Strip */}
          <div className="gate-chart-frame">
            {/* Top Bar: Timeframe Row (1m 15m 1h 4h 1D) */}
            <div
              className={`gate-bar gate-bar--top ${
                selectedToolId === 'timeframe' ? 'gate-bar--focused' : ''
              }`}
            >
              <div className="gate-bar__label-row">
                <span className="gate-pin-badge">A. Top-Left Timeframe Row</span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-subtle)' }}>
                  Click 4h or 1D (avoid 1m noise)
                </span>
              </div>

              <div className="gate-tf-row">
                <span className="gate-pair-tag num">BTC/USDT · GATE</span>

                <div className="gate-tf-buttons" role="group" aria-label="Timeframe buttons">
                  <button
                    type="button"
                    onClick={() => {
                      setTimeframe('1m');
                      setSelectedToolId('timeframe');
                    }}
                    className={`gate-btn ${timeframe === '1m' ? 'gate-btn--warn-active' : 'gate-btn--muted'}`}
                  >
                    1m (Noisy)
                  </button>
                  <span className="gate-btn gate-btn--disabled" aria-hidden="true">
                    15m
                  </span>
                  <span className="gate-btn gate-btn--disabled" aria-hidden="true">
                    1h
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setTimeframe('4h');
                      setSelectedToolId('timeframe');
                    }}
                    className={`gate-btn ${timeframe === '4h' ? 'gate-btn--essential-active' : 'gate-btn--essential'}`}
                  >
                    4h (Recommended)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTimeframe('1D');
                      setSelectedToolId('timeframe');
                    }}
                    className={`gate-btn ${timeframe === '1D' ? 'gate-btn--essential-active' : 'gate-btn--essential'}`}
                  >
                    1D (Daily)
                  </button>
                </div>
              </div>

              {/* OHLC Legend Strip */}
              <div className="gate-ohlc-row num">
                <span>
                  O <strong>75,903.3</strong>
                </span>
                <span>
                  H <strong>75,932.4</strong>
                </span>
                <span>
                  L <strong>75,889.6</strong>
                </span>
                <span style={{ color: 'var(--color-success)' }}>
                  C <strong>75,925.4</strong> (+0.03%)
                </span>
                {showMA && (
                  <span style={{ color: '#0284c7', fontWeight: 700 }}>MA30: 76,410.0</span>
                )}
                {showBOLL && (
                  <span style={{ color: '#b45309', fontWeight: 700 }}>
                    BOLL UB: 78,200 / LB: 75,600
                  </span>
                )}
              </div>
            </div>

            {/* Interactive SVG Candlestick + MA + BOLL + Volume + RSI Graph */}
            <div className="gate-svg-wrapper">
              <div className="gate-overlay-toggles">
                <span
                  style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)' }}
                >
                  Toggle on graph:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setShowMA(!showMA);
                    setSelectedToolId('ma');
                  }}
                  className={`gate-mini-toggle ${showMA ? 'gate-mini-toggle--on' : ''}`}
                >
                  {showMA ? '[x] MA Line' : '[ ] MA Line'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowBOLL(!showBOLL);
                    setSelectedToolId('boll');
                  }}
                  className={`gate-mini-toggle ${showBOLL ? 'gate-mini-toggle--on' : ''}`}
                >
                  {showBOLL ? '[x] BOLL Tunnel' : '[ ] BOLL Tunnel'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowVolume(!showVolume);
                    setSelectedToolId('volume');
                  }}
                  className={`gate-mini-toggle ${showVolume ? 'gate-mini-toggle--on' : ''}`}
                >
                  {showVolume ? '[x] Volume' : '[ ] Volume'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowRSI(!showRSI);
                    setSelectedToolId('rsi');
                  }}
                  className={`gate-mini-toggle ${showRSI ? 'gate-mini-toggle--on' : ''}`}
                >
                  {showRSI ? '[x] RSI Meter' : '[ ] RSI Meter'}
                </button>
              </div>

              <svg
                viewBox="0 0 600 310"
                style={{ width: '100%', height: 'auto', display: 'block' }}
                role="img"
                aria-label="Interactive Gate.com chart showing candlesticks, MA30 line, BOLL bands, Volume bars, and RSI meter"
              >
                {/* Horizontal Price Grid Lines */}
                <line
                  x1="20"
                  y1="30"
                  x2="530"
                  y2="30"
                  stroke="var(--color-chart-grid)"
                  strokeDasharray="3 3"
                />
                <line
                  x1="20"
                  y1="75"
                  x2="530"
                  y2="75"
                  stroke="var(--color-chart-grid)"
                  strokeDasharray="3 3"
                />
                <line
                  x1="20"
                  y1="120"
                  x2="530"
                  y2="120"
                  stroke="var(--color-chart-grid)"
                  strokeDasharray="3 3"
                />
                <line
                  x1="20"
                  y1="165"
                  x2="530"
                  y2="165"
                  stroke="var(--color-chart-grid)"
                  strokeDasharray="3 3"
                />

                {/* Right Y-Axis Price Labels */}
                <text
                  x="536"
                  y="34"
                  fontSize="10"
                  fill="var(--color-text-subtle)"
                  fontFamily="monospace"
                >
                  80,000
                </text>
                <text
                  x="536"
                  y="79"
                  fontSize="10"
                  fill="var(--color-text-subtle)"
                  fontFamily="monospace"
                >
                  78,000
                </text>
                <text
                  x="536"
                  y="124"
                  fontSize="10"
                  fill="var(--color-text-subtle)"
                  fontFamily="monospace"
                >
                  76,500
                </text>
                <text
                  x="536"
                  y="168"
                  fontSize="10"
                  fill="var(--color-text-subtle)"
                  fontFamily="monospace"
                >
                  75,000
                </text>

                {/* BOLL Tunnel (Upper Band UB, Middle Band MB, Lower Band LB) */}
                {showBOLL && (
                  <g>
                    <path
                      d="M 35 55 Q 150 20, 260 45 T 510 105 L 510 162 Q 380 168, 260 140 T 35 125 Z"
                      fill="#fef3c7"
                      fillOpacity="0.45"
                    />
                    <path
                      d="M 35 55 Q 150 20, 260 45 T 510 105"
                      fill="none"
                      stroke="#b45309"
                      strokeWidth="1.75"
                      strokeDasharray="4 2"
                    />
                    <text x="38" y="48" fontSize="10" fontWeight="bold" fill="#b45309">
                      BOLL Upper Roof (UB: Expensive)
                    </text>
                    <path
                      d="M 35 125 Q 150 95, 260 140 T 510 162"
                      fill="none"
                      stroke="#15803d"
                      strokeWidth="1.75"
                      strokeDasharray="4 2"
                    />
                    <text x="330" y="176" fontSize="10" fontWeight="bold" fill="#15803d">
                      BOLL Lower Floor (LB: Bounce Zone)
                    </text>
                  </g>
                )}

                {/* Candlesticks (Modeling the user's Gate.com screenshot rally -> drop -> support base) */}
                {timeframe === '1m' ? (
                  /* Noisy 1m whipsaw bars warning */
                  <g>
                    {[
                      { x: 45, top: 60, bot: 145, up: false },
                      { x: 85, top: 45, bot: 135, up: true },
                      { x: 125, top: 70, bot: 155, up: false },
                      { x: 165, top: 40, bot: 130, up: true },
                      { x: 205, top: 65, bot: 160, up: false },
                      { x: 245, top: 50, bot: 140, up: true },
                      { x: 285, top: 75, bot: 158, up: false },
                      { x: 325, top: 55, bot: 148, up: true },
                      { x: 365, top: 60, bot: 152, up: false },
                      { x: 405, top: 48, bot: 138, up: true },
                      { x: 445, top: 72, bot: 155, up: false },
                      { x: 485, top: 58, bot: 142, up: true },
                    ].map((c, idx) => (
                      <g key={idx}>
                        <line
                          x1={c.x}
                          y1={c.top}
                          x2={c.x}
                          y2={c.bot}
                          stroke={c.up ? '#15803d' : '#b91c1c'}
                          strokeWidth="2"
                        />
                        <rect
                          x={c.x - 7}
                          y={c.top + 18}
                          width="14"
                          height={Math.max(16, (c.bot - c.top) * 0.5)}
                          fill={c.up ? '#15803d' : '#b91c1c'}
                          rx="1"
                        />
                      </g>
                    ))}
                    <rect
                      x="110"
                      y="72"
                      width="310"
                      height="32"
                      rx="6"
                      fill="#fee2e2"
                      stroke="#b91c1c"
                    />
                    <text x="124" y="92" fontSize="11" fontWeight="bold" fill="#7f1d1d">
                      1m View = Random Second-by-Second Noise! Click 4h or 1D.
                    </text>
                  </g>
                ) : (
                  /* Calm 4H / 1D structure matching the Gate.com screenshot */
                  <g>
                    {[
                      { x: 45, wTop: 105, wBot: 135, bTop: 112, bH: 18, up: true },
                      { x: 80, wTop: 85, wBot: 120, bTop: 92, bH: 22, up: true },
                      { x: 115, wTop: 55, wBot: 96, bTop: 62, bH: 28, up: true },
                      { x: 150, wTop: 32, wBot: 68, bTop: 38, bH: 24, up: true },
                      { x: 185, wTop: 28, wBot: 58, bTop: 35, bH: 16, up: false },
                      { x: 220, wTop: 36, wBot: 95, bTop: 42, bH: 45, up: false },
                      { x: 255, wTop: 82, wBot: 158, bTop: 86, bH: 64, up: false },
                      { x: 290, wTop: 132, wBot: 162, bTop: 138, bH: 16, up: true },
                      { x: 325, wTop: 136, wBot: 160, bTop: 142, bH: 12, up: false },
                      { x: 360, wTop: 134, wBot: 162, bTop: 140, bH: 15, up: true },
                      { x: 395, wTop: 138, wBot: 164, bTop: 144, bH: 14, up: false },
                      { x: 430, wTop: 135, wBot: 158, bTop: 140, bH: 13, up: true },
                      { x: 465, wTop: 132, wBot: 155, bTop: 136, bH: 14, up: true },
                      { x: 500, wTop: 128, wBot: 150, bTop: 132, bH: 14, up: true },
                    ].map((c, idx) => (
                      <g key={idx}>
                        <line
                          x1={c.x}
                          y1={c.wTop}
                          x2={c.x}
                          y2={c.wBot}
                          stroke={c.up ? '#15803d' : '#b91c1c'}
                          strokeWidth="1.75"
                        />
                        <rect
                          x={c.x - 6}
                          y={c.bTop}
                          width="12"
                          height={c.bH}
                          fill={c.up ? '#15803d' : '#b91c1c'}
                          rx="1"
                        />
                      </g>
                    ))}

                    {/* Current Price Dashed Line + Green Right Tag (75,925.4) like Gate.com */}
                    <line
                      x1="20"
                      y1="136"
                      x2="530"
                      y2="136"
                      stroke="#15803d"
                      strokeWidth="1.2"
                      strokeDasharray="2 2"
                    />
                    <rect x="530" y="126" width="66" height="18" rx="3" fill="#15803d" />
                    <text
                      x="535"
                      y="138"
                      fontSize="10"
                      fontWeight="bold"
                      fill="#ffffff"
                      fontFamily="monospace"
                    >
                      75,925.4
                    </text>
                  </g>
                )}

                {/* MA30 Smooth Average Line (Light 1) */}
                {showMA && (
                  <g>
                    <path
                      d="M 35 118 Q 160 52, 275 96 T 510 116"
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="3"
                    />
                    <rect
                      x="295"
                      y="82"
                      width="210"
                      height="20"
                      rx="4"
                      fill="#e0f2fe"
                      stroke="#0284c7"
                    />
                    <text x="303" y="95" fontSize="10" fontWeight="bold" fill="#0c4a6e">
                      MA30 Fair-Price Line (Candles below = Discount)
                    </text>
                  </g>
                )}

                {/* Divider between Main Chart and Volume */}
                <line x1="20" y1="184" x2="590" y2="184" stroke="var(--color-border-default)" />

                {/* Volume Sub-Pane (matching Gate.com screenshot) */}
                {showVolume ? (
                  <g>
                    <text
                      x="26"
                      y="198"
                      fontSize="10"
                      fontWeight="bold"
                      fill="var(--color-text-muted)"
                    >
                      Volume 14.51 (Crowd Activity Bars)
                    </text>
                    {[
                      { x: 45, h: 12, up: true },
                      { x: 80, h: 16, up: true },
                      { x: 115, h: 28, up: true },
                      { x: 150, h: 22, up: true },
                      { x: 185, h: 14, up: false },
                      { x: 220, h: 24, up: false },
                      { x: 255, h: 36, up: false },
                      { x: 290, h: 18, up: true },
                      { x: 325, h: 12, up: false },
                      { x: 360, h: 15, up: true },
                      { x: 395, h: 20, up: false },
                      { x: 430, h: 16, up: true },
                      { x: 465, h: 12, up: true },
                      { x: 500, h: 14, up: true },
                    ].map((v, idx) => (
                      <rect
                        key={idx}
                        x={v.x - 5}
                        y={238 - v.h}
                        width="10"
                        height={v.h}
                        fill={v.up ? '#86efac' : '#fca5a5'}
                      />
                    ))}
                  </g>
                ) : (
                  <text x="26" y="215" fontSize="10" fill="var(--color-text-subtle)">
                    Volume Sub-Chart Hidden (Click [Volume] below to show)
                  </text>
                )}

                {/* Divider between Volume and RSI */}
                <line x1="20" y1="242" x2="590" y2="242" stroke="var(--color-border-default)" />

                {/* RSI Sub-Pane (0 to 100 Exhaustion Meter - Light 2) */}
                {showRSI ? (
                  <g>
                    <rect x="20" y="282" width="510" height="20" fill="#dcfce7" fillOpacity="0.6" />
                    <line
                      x1="20"
                      y1="282"
                      x2="530"
                      y2="282"
                      stroke="#15803d"
                      strokeDasharray="3 3"
                    />
                    <text x="26" y="256" fontSize="10" fontWeight="bold" fill="#0369a1">
                      RSI(14) = 33.4 (Light 2 ON: Below 36 means sellers are tired!)
                    </text>
                    <text
                      x="536"
                      y="260"
                      fontSize="9"
                      fill="var(--color-text-subtle)"
                      fontFamily="monospace"
                    >
                      70 Hot
                    </text>
                    <text
                      x="536"
                      y="286"
                      fontSize="9"
                      fontWeight="bold"
                      fill="#15803d"
                      fontFamily="monospace"
                    >
                      36 Buy
                    </text>
                    <path
                      d="M 45 268 L 115 254 L 185 258 L 255 292 L 325 289 L 395 286 L 500 284"
                      fill="none"
                      stroke="#0369a1"
                      strokeWidth="2.2"
                    />
                    <circle cx="500" cy="284" r="4" fill="#15803d" />
                  </g>
                ) : (
                  <text x="26" y="278" fontSize="10" fill="var(--color-text-subtle)">
                    RSI Speedometer Hidden (Click [RSI] on the bottom bar below to turn it on)
                  </text>
                )}
              </svg>
            </div>

            {/* Bottom Indicator Strip (Exact Gate.com 17 Buttons!) */}
            <div className="gate-bar gate-bar--bottom">
              <div className="gate-bar__label-row">
                <span className="gate-pin-badge">
                  B. Bottom Indicator Bar on Gate.com (&ldquo;The Dozens of Tiny Buttons&rdquo;)
                </span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-subtle)' }}>
                  Only <strong>MA</strong>, <strong>Volume</strong>, <strong>BOLL</strong>, and{' '}
                  <strong>RSI</strong> matter for beginners
                </span>
              </div>

              <div
                className="gate-bottom-strip"
                role="group"
                aria-label="Gate.com bottom indicator bar"
              >
                {GATE_BOTTOM_BUTTONS.map((btn) => {
                  const isFocused = btn.toolId && btn.toolId === selectedToolId;
                  if (btn.essential && btn.toolId) {
                    const toolId = btn.toolId;
                    const isToggledOn =
                      (toolId === 'ma' && showMA) ||
                      (toolId === 'boll' && showBOLL) ||
                      (toolId === 'rsi' && showRSI) ||
                      (toolId === 'volume' && showVolume);

                    return (
                      <button
                        key={btn.label}
                        type="button"
                        onClick={() => handleSelectTool(toolId)}
                        className={`gate-ind-btn gate-ind-btn--essential ${
                          isFocused ? 'gate-ind-btn--focused' : ''
                        } ${isToggledOn ? 'gate-ind-btn--on' : ''}`}
                        title={`Essential Beginner Indicator: ${btn.label}`}
                      >
                        <span>{btn.label}</span>
                        <span className="gate-ind-btn__tag">USE</span>
                      </button>
                    );
                  }

                  return (
                    <span
                      key={btn.label}
                      className={`gate-ind-btn gate-ind-btn--ignore ${
                        essentialsOnlyFilter ? 'gate-ind-btn--dimmed' : ''
                      }`}
                      title={btn.ignoreReason}
                    >
                      {btn.label}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Beginner Essential Card + Why We Ignore the Rest */}
          <div className="essentials-detail-card">
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                {ESSENTIAL_TOOLS.map((tool) => {
                  const active = tool.id === selectedToolId;
                  return (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => handleSelectTool(tool.id)}
                      className={active ? 'btn-primary' : 'btn-subtle'}
                      style={{
                        minHeight: '32px',
                        padding: '4px 10px',
                        fontSize: 'var(--font-size-xs)',
                      }}
                    >
                      {tool.buttonLabel}
                    </button>
                  );
                })}
              </div>

              <div
                style={{
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--color-bg-subtle)',
                  border: '1px solid var(--color-border-default)',
                  marginBottom: 'var(--space-4)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    marginBottom: '6px',
                  }}
                >
                  <span className="status-pill status-pill--positive">
                    Essential Beginner Control
                  </span>
                  <code style={{ fontSize: '11px', fontWeight: 700 }}>
                    {activeTool.buttonLabel}
                  </code>
                </div>

                <h4 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '6px' }}>
                  {activeTool.buttonLabel}
                </h4>

                <p
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-data-hue)',
                    fontWeight: 700,
                    marginBottom: '8px',
                  }}
                >
                  Where to find it on Gate.com: {activeTool.whereOnGate}
                </p>

                <p style={{ fontSize: 'var(--font-size-sm)', marginBottom: '10px' }}>
                  {activeTool.plainMeaning}
                </p>

                <div className="analogy-callout" style={{ marginBlock: '0 10px' }}>
                  <div className="analogy-callout__header">Everyday Analogy</div>
                  <p>{activeTool.analogy}</p>
                </div>

                <div
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border-subtle)',
                    fontSize: 'var(--font-size-xs)',
                  }}
                >
                  <strong>How to read it in 3 seconds: </strong>
                  <span>{activeTool.howToRead}</span>
                </div>
              </div>
            </div>

            {/* Beginner Cheat-Sheet: Keep vs Ignore */}
            <div
              style={{
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border-default)',
                backgroundColor: 'var(--color-bg-surface)',
                fontSize: 'var(--font-size-xs)',
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: '6px' }}>
                Why do we ignore the other 13 buttons on Gate.com?
              </div>
              <p
                style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-muted)',
                  marginBottom: '8px',
                }}
              >
                Buttons like <code>SRL</code>, <code>VPVR</code>, <code>SAR</code>, <code>AVL</code>
                , <code>MTM</code>, <code>VR</code>, <code>DMA</code>, <code>SKDJ</code>,{' '}
                <code>PSY</code>, and <code>BBI</code> are specialized math formulas for high-speed
                scalpers. Turning them all on covers your candlesticks in spaghetti lines and causes
                analysis paralysis.
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    padding: '8px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-pill-positive-bg)',
                    color: 'var(--color-pill-positive-ink)',
                  }}
                >
                  <strong>Turn ON (Essentials):</strong>
                  <div>4h / 1D, MA, BOLL, RSI, Volume</div>
                </div>
                <div
                  style={{
                    padding: '8px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-bg-subtle)',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  <strong>Leave OFF (Clutter):</strong>
                  <div>1m, SRL, SAR, VPVR, SKDJ, PSY, BBI</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .essentials-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-4);
        }
        @media (min-width: 1024px) {
          .essentials-layout {
            grid-template-columns: 1.25fr 1fr;
            align-items: start;
          }
        }
        @media (min-width: 1536px) {
          .essentials-layout {
            grid-template-columns: 1.45fr 1fr;
            gap: var(--space-6);
          }
        }
        .gate-chart-frame {
          border: 1px solid var(--color-border-default);
          border-radius: var(--radius-lg);
          background-color: var(--color-bg-surface);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .gate-bar {
          padding: var(--space-3);
          background-color: var(--color-bg-subtle);
        }
        .gate-bar--top {
          border-bottom: 1px solid var(--color-border-default);
        }
        .gate-bar--bottom {
          border-top: 1px solid var(--color-border-default);
        }
        .gate-bar--focused {
          background-color: var(--color-data-hue-subtle);
        }
        .gate-bar__label-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
          margin-bottom: 8px;
        }
        .gate-pin-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          background-color: var(--color-data-hue);
          color: #ffffff;
        }
        .gate-tf-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .gate-pair-tag {
          font-size: var(--font-size-xs);
          font-weight: 700;
        }
        .gate-tf-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        .gate-btn {
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          font-size: 11px;
          font-weight: 600;
          border: 1px solid var(--color-border-default);
          background-color: var(--color-bg-surface);
          color: var(--color-text-main);
          cursor: pointer;
        }
        .gate-btn--muted {
          color: var(--color-text-subtle);
        }
        .gate-btn--warn-active {
          background-color: var(--color-pill-negative-bg);
          color: var(--color-pill-negative-ink);
          border-color: var(--color-pill-negative-border);
          font-weight: 700;
        }
        .gate-btn--disabled {
          opacity: 0.45;
          cursor: default;
        }
        .gate-btn--essential {
          border-color: var(--color-data-hue);
          color: var(--color-data-hue);
          font-weight: 700;
        }
        .gate-btn--essential-active {
          background-color: var(--color-data-hue);
          color: #ffffff;
          border-color: var(--color-data-hue);
          font-weight: 700;
        }
        .gate-ohlc-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 8px;
          padding-top: 6px;
          border-top: 1px dashed var(--color-border-default);
          font-size: 11px;
          color: var(--color-text-muted);
        }
        .gate-svg-wrapper {
          padding: var(--space-2) var(--space-3);
          background-color: var(--color-bg-surface);
        }
        .gate-overlay-toggles {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
        }
        .gate-mini-toggle {
          padding: 3px 8px;
          border-radius: var(--radius-sm);
          font-size: 11px;
          font-weight: 600;
          border: 1px solid var(--color-border-default);
          background-color: var(--color-bg-subtle);
          color: var(--color-text-muted);
          cursor: pointer;
        }
        .gate-mini-toggle--on {
          background-color: var(--color-pill-positive-bg);
          color: var(--color-pill-positive-ink);
          border-color: var(--color-pill-positive-border);
          font-weight: 700;
        }
        .gate-bottom-strip {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .gate-ind-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          font-size: 11px;
          border: 1px solid var(--color-border-default);
        }
        .gate-ind-btn--essential {
          background-color: var(--color-bg-surface);
          color: var(--color-text-main);
          border-color: var(--color-data-hue);
          font-weight: 700;
          cursor: pointer;
        }
        .gate-ind-btn--on {
          background-color: var(--color-pill-positive-bg);
          color: var(--color-pill-positive-ink);
          border-color: var(--color-pill-positive-border);
        }
        .gate-ind-btn--focused {
          outline: 2px solid var(--color-data-hue);
          outline-offset: 1px;
        }
        .gate-ind-btn__tag {
          font-size: 9px;
          padding: 1px 4px;
          border-radius: 3px;
          background-color: var(--color-data-hue);
          color: #ffffff;
        }
        .gate-ind-btn--ignore {
          background-color: var(--color-bg-surface);
          color: var(--color-text-subtle);
          font-weight: 500;
        }
        .gate-ind-btn--dimmed {
          opacity: 0.38;
          text-decoration: line-through;
        }
        .essentials-detail-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: var(--space-3);
        }
      `}</style>
    </div>
  );
}
