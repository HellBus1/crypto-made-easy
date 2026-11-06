import { useEffect, useRef, useState } from 'react';
import {
  createChart,
  CandlestickSeries,
  LineSeries,
  HistogramSeries,
  ColorType,
  LineStyle,
  type UTCTimestamp,
} from 'lightweight-charts';
import {
  generateScenarioCandles,
  aggregateCandles,
  type ScenarioName,
  type Candle,
} from '../../lib/candles';
import { sma, ema, bollinger, rsi, macd } from '../../lib/indicators';

export interface PriceLineConfig {
  price: number;
  title: string;
  color: string;
  dashed?: boolean;
}

export interface MarketChartProps {
  title?: string;
  subtitle?: string;
  initialScenario?: ScenarioName;
  allowScenarioSwitch?: boolean;
  allowTimeframeSwitch?: boolean;
  allowIndicatorToggles?: boolean;
  defaultShowMa30?: boolean;
  defaultShowEma30?: boolean;
  defaultShowBoll?: boolean;
  defaultShowVolume?: boolean;
  defaultShowRsi?: boolean;
  defaultShowMacd?: boolean;
  priceLines?: PriceLineConfig[];
}

export default function MarketChart({
  title = 'Spot Chart Inspector (SOL / USDT Example)',
  subtitle = 'Synthetic 4H / 1D teaching dataset. Toggle overlays to see how indicators summarize price.',
  initialScenario = 'dip-at-support',
  allowScenarioSwitch = true,
  allowTimeframeSwitch = true,
  allowIndicatorToggles = true,
  defaultShowMa30 = true,
  defaultShowEma30 = false,
  defaultShowBoll = false,
  defaultShowVolume = true,
  defaultShowRsi = true,
  defaultShowMacd = false,
  priceLines = [
    { price: 88.5, title: 'Support 1 (88.50)', color: '#247b50', dashed: true },
    { price: 79.58, title: 'Stop-Loss (79.58)', color: '#c4242a', dashed: true },
  ],
}: MarketChartProps) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const [scenario, setScenario] = useState<ScenarioName>(initialScenario);
  const [timeframe, setTimeframe] = useState<'4H' | '1D'>('4H');
  const [showMa30, setShowMa30] = useState(defaultShowMa30);
  const [showEma30, setShowEma30] = useState(defaultShowEma30);
  const [showBoll, setShowBoll] = useState(defaultShowBoll);
  const [showVolume, setShowVolume] = useState(defaultShowVolume);
  const [showRsi, setShowRsi] = useState(defaultShowRsi);
  const [showMacd, setShowMacd] = useState(defaultShowMacd);

  const raw4h = generateScenarioCandles(scenario, 60, 1337);
  const candles: Candle[] = timeframe === '4H' ? raw4h : aggregateCandles(raw4h, 6);
  const closes = candles.map((c) => c.close);
  const maPeriod = timeframe === '4H' ? 15 : 5;
  const maSeries = sma(closes, maPeriod);
  const emaSeries = ema(closes, maPeriod);
  const bollSeries = bollinger(closes, Math.min(12, Math.max(5, closes.length - 2)), 2);
  const rsiSeries = rsi(closes, Math.min(14, Math.max(5, closes.length - 3)));
  const macdSeries = macd(closes, 6, 13, 5);

  const latestCandle = candles[candles.length - 1];
  const latestMa = maSeries[maSeries.length - 1];
  const latestRsi = rsiSeries[rsiSeries.length - 1];
  const latestMacd = macdSeries[macdSeries.length - 1];

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const bgColor = isDark ? '#141414' : '#ffffff';
    const textColor = isDark ? '#b4b4b4' : '#5f6672';
    const gridColor = isDark ? '#242424' : '#eaeef4';
    const borderColor = isDark ? '#262626' : '#dde2ea';

    const chart = createChart(container, {
      width: container.clientWidth || 640,
      height: 300,
      layout: {
        background: { type: ColorType.Solid, color: bgColor },
        textColor,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        fontSize: 12,
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: gridColor, style: LineStyle.Solid },
      },
      rightPriceScale: {
        borderColor,
      },
      timeScale: {
        borderColor,
        timeVisible: true,
      },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#247b50',
      downColor: '#c4242a',
      borderUpColor: '#247b50',
      borderDownColor: '#c4242a',
      wickUpColor: '#247b50',
      wickDownColor: '#c4242a',
    });

    candleSeries.setData(
      candles.map((c) => ({
        time: c.time as UTCTimestamp,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      }))
    );

    for (const pl of priceLines) {
      candleSeries.createPriceLine({
        price: pl.price,
        color: pl.color,
        lineWidth: 1,
        lineStyle: pl.dashed ? LineStyle.Dashed : LineStyle.Solid,
        axisLabelVisible: true,
        title: pl.title,
      });
    }

    if (showMa30) {
      const maLine = chart.addSeries(LineSeries, {
        color: '#1d5fbf',
        lineWidth: 2,
        title: 'MA30',
      });
      maLine.setData(
        candles
          .map((c, idx) =>
            maSeries[idx] !== null
              ? { time: c.time as UTCTimestamp, value: maSeries[idx] as number }
              : null
          )
          .filter((item): item is { time: UTCTimestamp; value: number } => item !== null)
      );
    }

    if (showEma30) {
      const emaLine = chart.addSeries(LineSeries, {
        color: '#0a0a0a',
        lineWidth: 2,
        lineStyle: LineStyle.Dashed,
        title: 'EMA30',
      });
      emaLine.setData(
        candles
          .map((c, idx) =>
            emaSeries[idx] !== null
              ? { time: c.time as UTCTimestamp, value: emaSeries[idx] as number }
              : null
          )
          .filter((item): item is { time: UTCTimestamp; value: number } => item !== null)
      );
    }

    if (showBoll) {
      const upperLine = chart.addSeries(LineSeries, {
        color: '#767d8a',
        lineWidth: 1,
        lineStyle: LineStyle.Dotted,
        title: 'BOLL Upper',
      });
      const lowerLine = chart.addSeries(LineSeries, {
        color: '#767d8a',
        lineWidth: 1,
        lineStyle: LineStyle.Dotted,
        title: 'BOLL Lower',
      });

      upperLine.setData(
        candles
          .map((c, idx) =>
            bollSeries[idx].upper !== null
              ? { time: c.time as UTCTimestamp, value: bollSeries[idx].upper as number }
              : null
          )
          .filter((item): item is { time: UTCTimestamp; value: number } => item !== null)
      );

      lowerLine.setData(
        candles
          .map((c, idx) =>
            bollSeries[idx].lower !== null
              ? { time: c.time as UTCTimestamp, value: bollSeries[idx].lower as number }
              : null
          )
          .filter((item): item is { time: UTCTimestamp; value: number } => item !== null)
      );
    }

    if (showVolume) {
      const volSeries = chart.addSeries(HistogramSeries, {
        priceFormat: { type: 'volume' },
        priceScaleId: '',
      });
      volSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      });
      volSeries.setData(
        candles.map((c) => ({
          time: c.time as UTCTimestamp,
          value: c.volume,
          color: c.close >= c.open ? 'rgba(36, 123, 80, 0.28)' : 'rgba(196, 36, 42, 0.28)',
        }))
      );
    }

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (container) {
        chart.applyOptions({ width: container.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [
    scenario,
    timeframe,
    showMa30,
    showEma30,
    showBoll,
    showVolume,
    candles,
    maSeries,
    emaSeries,
    bollSeries,
    priceLines,
  ]);

  return (
    <div data-ui="market-chart" className="surface-card" style={{ marginBlock: 'var(--space-6)' }}>
      {/* Header & Controls */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 'var(--space-3)',
          marginBottom: 'var(--space-3)',
        }}
      >
        <div>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <p className="text-muted" style={{ fontSize: 'var(--font-size-xs)', margin: 0 }}>
            {subtitle}
          </p>
        </div>

        {/* Live Latest Reading Strip */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          <span className="status-pill status-pill--neutral num">
            Last: {latestCandle.close.toFixed(2)} USDT
          </span>
          {latestMa !== null && (
            <span className="status-pill status-pill--info num">
              MA: {latestMa.toFixed(2)} USDT
            </span>
          )}
          {latestRsi !== null && (
            <span
              className={`status-pill num ${
                latestRsi <= 36
                  ? 'status-pill--positive'
                  : latestRsi > 70
                    ? 'status-pill--negative'
                    : 'status-pill--neutral'
              }`}
            >
              RSI: {latestRsi.toFixed(1)}
            </span>
          )}
        </div>
      </div>

      {/* Control Toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-2)',
          paddingBottom: 'var(--space-3)',
          marginBottom: 'var(--space-3)',
          borderBottom: '1px solid var(--color-border-subtle)',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          {allowScenarioSwitch &&
            (
              [
                { id: 'dip-at-support', label: 'Dip to Support (Buy Zone)' },
                { id: 'uptrend', label: 'Healthy Uptrend' },
                { id: 'range', label: 'Sideways Range' },
                { id: 'broken-trend', label: 'Broken Support Floor' },
              ] as const
            ).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setScenario(s.id)}
                aria-pressed={scenario === s.id}
                style={{
                  height: '30px',
                  paddingInline: 'var(--space-2)',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: scenario === s.id ? 600 : 400,
                  backgroundColor:
                    scenario === s.id ? 'var(--color-brand-primary)' : 'var(--color-bg-surface)',
                  color:
                    scenario === s.id
                      ? 'var(--color-brand-primary-text)'
                      : 'var(--color-text-main)',
                  border: '1px solid var(--color-border-control)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                }}
              >
                {s.label}
              </button>
            ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          {allowTimeframeSwitch &&
            (['4H', '1D'] as const).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                aria-pressed={timeframe === tf}
                style={{
                  height: '30px',
                  paddingInline: 'var(--space-2)',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: timeframe === tf ? 600 : 400,
                  backgroundColor:
                    timeframe === tf ? 'var(--color-bg-subtle)' : 'var(--color-bg-surface)',
                  color: 'var(--color-text-main)',
                  border: '1px solid var(--color-border-control)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                }}
              >
                {tf}
              </button>
            ))}

          {allowIndicatorToggles &&
            [
              { label: 'MA30', active: showMa30, toggle: () => setShowMa30(!showMa30) },
              { label: 'EMA30', active: showEma30, toggle: () => setShowEma30(!showEma30) },
              { label: 'BOLL', active: showBoll, toggle: () => setShowBoll(!showBoll) },
              { label: 'VOL', active: showVolume, toggle: () => setShowVolume(!showVolume) },
              { label: 'RSI', active: showRsi, toggle: () => setShowRsi(!showRsi) },
              { label: 'MACD', active: showMacd, toggle: () => setShowMacd(!showMacd) },
            ].map((ind) => (
              <button
                key={ind.label}
                type="button"
                onClick={ind.toggle}
                aria-pressed={ind.active}
                style={{
                  height: '30px',
                  paddingInline: 'var(--space-2)',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: ind.active ? 600 : 400,
                  backgroundColor: ind.active
                    ? 'var(--color-data-hue-subtle)'
                    : 'var(--color-bg-surface)',
                  color: 'var(--color-text-main)',
                  border: `1px solid ${
                    ind.active ? 'var(--color-data-hue)' : 'var(--color-border-control)'
                  }`,
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {ind.active && (
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="2 6 5 9 10 3" />
                  </svg>
                )}
                {ind.label}
              </button>
            ))}
        </div>
      </div>

      {/* Lightweight Charts Canvas Container */}
      <div
        ref={chartContainerRef}
        style={{
          width: '100%',
          height: '300px',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
        }}
      />

      {/* Optional RSI & MACD Sub-Pane Readouts */}
      {(showRsi || showMacd) && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-3)',
            marginTop: 'var(--space-3)',
          }}
        >
          {showRsi && (
            <div
              style={{
                padding: 'var(--space-3)',
                backgroundColor: 'var(--color-bg-canvas)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-xs)',
              }}
            >
              <div
                style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}
              >
                <strong>RSI (14) Momentum Pane</strong>
                <span className="num" style={{ fontWeight: 600 }}>
                  {latestRsi !== null ? latestRsi.toFixed(1) : 'N/A'} / 100
                </span>
              </div>
              <p className="text-muted" style={{ margin: 0, fontSize: 'var(--font-size-xs)' }}>
                {latestRsi !== null && latestRsi <= 36
                  ? '[ON] Light 2 ON (<= 36): Sellers are stretched and running out of steam.'
                  : latestRsi !== null && latestRsi > 70
                    ? '[!] Sell Warning (> 70): Momentum is overheated.'
                    : '[--] Neutral zone (36 to 70): Wait for <= 36 before triggering Light 2.'}
              </p>
            </div>
          )}

          {showMacd && (
            <div
              style={{
                padding: 'var(--space-3)',
                backgroundColor: 'var(--color-bg-canvas)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-xs)',
              }}
            >
              <div
                style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}
              >
                <strong>MACD Histogram (Context)</strong>
                <span className="num" style={{ fontWeight: 600 }}>
                  {latestMacd?.histogram !== null && latestMacd?.histogram !== undefined
                    ? latestMacd.histogram.toFixed(3)
                    : 'N/A'}
                </span>
              </div>
              <p className="text-muted" style={{ margin: 0, fontSize: 'var(--font-size-xs)' }}>
                Supporting note only: shrinking negative bars show downward momentum is fading near
                support.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Accessible Data-Table Alternative */}
      <details style={{ marginTop: 'var(--space-3)', fontSize: 'var(--font-size-xs)' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 500, color: 'var(--color-text-muted)' }}>
          View tabular data alternative (latest 5 candles)
        </summary>
        <div style={{ overflowX: 'auto', marginTop: 'var(--space-2)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border-default)' }}>
                <th style={{ textAlign: 'left', padding: '4px' }}>Period</th>
                <th data-numeric="true" style={{ padding: '4px' }}>
                  Open
                </th>
                <th data-numeric="true" style={{ padding: '4px' }}>
                  High
                </th>
                <th data-numeric="true" style={{ padding: '4px' }}>
                  Low
                </th>
                <th data-numeric="true" style={{ padding: '4px' }}>
                  Close
                </th>
                <th data-numeric="true" style={{ padding: '4px' }}>
                  Volume
                </th>
              </tr>
            </thead>
            <tbody>
              {candles.slice(-5).map((c, idx) => (
                <tr key={c.time} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: '4px' }}>#{candles.length - 4 + idx}</td>
                  <td data-numeric="true" className="num" style={{ padding: '4px' }}>
                    {c.open.toFixed(2)}
                  </td>
                  <td data-numeric="true" className="num" style={{ padding: '4px' }}>
                    {c.high.toFixed(2)}
                  </td>
                  <td data-numeric="true" className="num" style={{ padding: '4px' }}>
                    {c.low.toFixed(2)}
                  </td>
                  <td data-numeric="true" className="num" style={{ padding: '4px' }}>
                    {c.close.toFixed(2)}
                  </td>
                  <td data-numeric="true" className="num" style={{ padding: '4px' }}>
                    {c.volume.toLocaleString('en-US')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
