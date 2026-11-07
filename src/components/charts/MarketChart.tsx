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
  title = 'Interactive Spot Chart Sandbox (SOL / USDT)',
  subtitle = 'Drag left/right to pan, scroll to zoom, and toggle the 4 Beginner Essentials (MA30, BOLL, VOL, RSI) on a real interactive chart canvas.',
  initialScenario = 'dip-at-support',
  allowScenarioSwitch = true,
  allowTimeframeSwitch = true,
  allowIndicatorToggles = true,
  defaultShowMa30 = true,
  defaultShowEma30 = false,
  defaultShowBoll = true,
  defaultShowVolume = true,
  defaultShowRsi = true,
  defaultShowMacd = false,
  priceLines = [
    { price: 88.5, title: 'Support Floor 1 ($88.50)', color: '#15803d', dashed: true },
    { price: 79.58, title: 'Stop-Loss ($79.58)', color: '#b91c1c', dashed: true },
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
  const latestBoll = bollSeries[bollSeries.length - 1];
  const latestRsi = rsiSeries[rsiSeries.length - 1];
  const latestMacd = macdSeries[macdSeries.length - 1];

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const bgColor = isDark ? '#111827' : '#ffffff';
    const textColor = isDark ? '#cbd5e1' : '#334155';
    const gridColor = isDark ? '#1e293b' : '#e2e8f0';
    const borderColor = isDark ? '#334155' : '#cbd5e1';

    const chart = createChart(container, {
      width: container.clientWidth || 640,
      height: 340,
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
      upColor: '#15803d',
      downColor: '#b91c1c',
      borderUpColor: '#15803d',
      borderDownColor: '#b91c1c',
      wickUpColor: '#15803d',
      wickDownColor: '#b91c1c',
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
        color: '#0284c7',
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
        color: '#0369a1',
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
        color: '#b45309',
        lineWidth: 1,
        lineStyle: LineStyle.Dotted,
        title: 'BOLL Roof (UB)',
      });
      const lowerLine = chart.addSeries(LineSeries, {
        color: '#15803d',
        lineWidth: 1,
        lineStyle: LineStyle.Dotted,
        title: 'BOLL Floor (LB)',
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
          color: c.close >= c.open ? 'rgba(21, 128, 61, 0.28)' : 'rgba(185, 28, 28, 0.28)',
        }))
      );
    }

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (container && container.clientWidth > 0) {
        chart.applyOptions({ width: container.clientWidth });
      }
    };

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => handleResize());
      resizeObserver.observe(container);
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
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
    <div data-ui="market-chart" className="sim-box">
      {/* Header & Live Pill Readouts */}
      <div className="sim-box__header">
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '4px' }}>
            <span className="status-pill status-pill--info">
              Interactive TradingView Chart Canvas
            </span>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-subtle)' }}>
              Hover candles to inspect OHLC · Scroll or drag to pan &amp; zoom
            </span>
          </div>
          <h3 className="sim-box__title">{title}</h3>
          <p className="sim-box__subtitle">{subtitle}</p>
        </div>

        {/* Live Latest Reading Strip */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          <span className="status-pill status-pill--neutral num">
            Current: ${latestCandle.close.toFixed(2)}
          </span>
          {latestMa !== null && (
            <span className="status-pill status-pill--info num">MA30: ${latestMa.toFixed(2)}</span>
          )}
          {latestBoll?.lower !== null && latestBoll?.upper !== null && (
            <span className="status-pill status-pill--warning num">
              BOLL: ${latestBoll.lower.toFixed(1)} to ${latestBoll.upper.toFixed(1)}
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

      <div className="sim-box__body">
        {/* Control Toolbar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-3)',
            paddingBottom: 'var(--space-3)',
            marginBottom: 'var(--space-3)',
            borderBottom: '1px solid var(--color-border-subtle)',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {allowScenarioSwitch &&
              (
                [
                  { id: 'dip-at-support', label: '1. Dip to Support (Buy Zone)' },
                  { id: 'uptrend', label: '2. Healthy Uptrend' },
                  { id: 'range', label: '3. Sideways Range' },
                  { id: 'broken-trend', label: '4. Broken Support Floor' },
                ] as const
              ).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setScenario(s.id)}
                  aria-pressed={scenario === s.id}
                  className={scenario === s.id ? 'btn-primary' : 'btn-secondary'}
                  style={{ minHeight: '32px', padding: '4px 10px', fontSize: '12px' }}
                >
                  {s.label}
                </button>
              ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
            {allowTimeframeSwitch &&
              (['4H', '1D'] as const).map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setTimeframe(tf)}
                  aria-pressed={timeframe === tf}
                  className={timeframe === tf ? 'btn-primary' : 'btn-subtle'}
                  style={{ minHeight: '32px', padding: '4px 10px', fontSize: '12px' }}
                >
                  {tf}
                </button>
              ))}

            {allowIndicatorToggles &&
              [
                {
                  label: 'MA30 (Essential)',
                  active: showMa30,
                  toggle: () => setShowMa30(!showMa30),
                },
                {
                  label: 'BOLL (Essential)',
                  active: showBoll,
                  toggle: () => setShowBoll(!showBoll),
                },
                {
                  label: 'VOL (Essential)',
                  active: showVolume,
                  toggle: () => setShowVolume(!showVolume),
                },
                {
                  label: 'RSI (Essential)',
                  active: showRsi,
                  toggle: () => setShowRsi(!showRsi),
                },
                {
                  label: 'EMA30 (Optional)',
                  active: showEma30,
                  toggle: () => setShowEma30(!showEma30),
                },
                {
                  label: 'MACD (Optional)',
                  active: showMacd,
                  toggle: () => setShowMacd(!showMacd),
                },
              ].map((ind) => (
                <button
                  key={ind.label}
                  type="button"
                  onClick={ind.toggle}
                  aria-pressed={ind.active}
                  style={{
                    minHeight: '32px',
                    padding: '4px 10px',
                    fontSize: '12px',
                    fontWeight: ind.active ? 700 : 500,
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
                      strokeWidth="2.2"
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
            height: '340px',
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
          }}
        />

        {/* RSI & MACD Sub-Pane Readouts */}
        {(showRsi || showMacd) && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 'var(--space-3)',
              marginTop: 'var(--space-3)',
            }}
          >
            {showRsi && (
              <div
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  backgroundColor: 'var(--color-bg-canvas)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-xs)',
                }}
              >
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}
                >
                  <strong>Light 2 Check: RSI (14) Exhaustion Meter</strong>
                  <span className="num" style={{ fontWeight: 700 }}>
                    {latestRsi !== null ? latestRsi.toFixed(1) : 'N/A'} / 100
                  </span>
                </div>
                <p className="text-muted" style={{ margin: 0, fontSize: 'var(--font-size-xs)' }}>
                  {latestRsi !== null && latestRsi <= 36
                    ? 'Light 2 ON (<= 36): Sellers are stretched and running out of steam.'
                    : latestRsi !== null && latestRsi > 70
                      ? 'Sell Warning (> 70): Buyers are overheated near the roof.'
                      : 'Neutral zone (36 to 70): Wait for RSI <= 36 before triggering Light 2.'}
                </p>
              </div>
            )}

            {showMacd && (
              <div
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  backgroundColor: 'var(--color-bg-canvas)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-xs)',
                }}
              >
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}
                >
                  <strong>Optional Wave Helper: MACD Histogram</strong>
                  <span className="num" style={{ fontWeight: 700 }}>
                    {latestMacd?.histogram !== null && latestMacd?.histogram !== undefined
                      ? latestMacd.histogram.toFixed(3)
                      : 'N/A'}
                  </span>
                </div>
                <p className="text-muted" style={{ margin: 0, fontSize: 'var(--font-size-xs)' }}>
                  Supporting note only: shrinking red bars show downward momentum is fading near the
                  support floor.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Accessible Data-Table Alternative */}
        <details style={{ marginTop: 'var(--space-3)', fontSize: 'var(--font-size-xs)' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--color-text-muted)' }}>
            View tabular data alternative (latest 5 candles)
          </summary>
          <div style={{ overflowX: 'auto', marginTop: 'var(--space-2)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border-default)' }}>
                  <th style={{ textAlign: 'left', padding: '6px' }}>Bar</th>
                  <th data-numeric="true" style={{ padding: '6px' }}>
                    Open
                  </th>
                  <th data-numeric="true" style={{ padding: '6px' }}>
                    High
                  </th>
                  <th data-numeric="true" style={{ padding: '6px' }}>
                    Low
                  </th>
                  <th data-numeric="true" style={{ padding: '6px' }}>
                    Close
                  </th>
                  <th data-numeric="true" style={{ padding: '6px' }}>
                    Volume
                  </th>
                </tr>
              </thead>
              <tbody>
                {candles.slice(-5).map((c, idx) => (
                  <tr key={c.time} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <td style={{ padding: '6px' }}>#{candles.length - 4 + idx}</td>
                    <td data-numeric="true" className="num" style={{ padding: '6px' }}>
                      ${c.open.toFixed(2)}
                    </td>
                    <td data-numeric="true" className="num" style={{ padding: '6px' }}>
                      ${c.high.toFixed(2)}
                    </td>
                    <td data-numeric="true" className="num" style={{ padding: '6px' }}>
                      ${c.low.toFixed(2)}
                    </td>
                    <td data-numeric="true" className="num" style={{ padding: '6px' }}>
                      ${c.close.toFixed(2)}
                    </td>
                    <td data-numeric="true" className="num" style={{ padding: '6px' }}>
                      {c.volume.toLocaleString('en-US')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </div>
    </div>
  );
}
