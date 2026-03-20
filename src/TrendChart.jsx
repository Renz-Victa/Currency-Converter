import React, { useState, useEffect, useRef } from 'react';

const API_BASE = 'https://api.frankfurter.app';

const PERIODS = [
  { label: '7D', days: 7 },
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '1Y', days: 365 },
];

function getDateNDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

function formatDate(dateStr, compact = false) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString(undefined, compact
    ? { month: 'short', day: 'numeric' }
    : { month: 'short', day: 'numeric', year: '2-digit' }
  );
}

// Smooth bezier path through points
function smoothPath(pts) {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const cpx = (prev.x + curr.x) / 2;
    d += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  return d;
}

export default function TrendChart({ from, to }) {
  const [period, setPeriod] = useState(1); // index into PERIODS
  const [data, setData] = useState(null);  // { dates: [], rates: [] }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const svgRef = useRef(null);

  useEffect(() => {
    if (!from || !to || from === to) {
      setData(null); return;
    }
    setLoading(true); setError(null); setData(null); setHoveredIdx(null);
    const start = getDateNDaysAgo(PERIODS[period].days);
    const today = new Date().toISOString().split('T')[0];
    fetch(`${API_BASE}/${start}..${today}?from=${from}&to=${to}`)
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(json => {
        const dates = Object.keys(json.rates).sort();
        const rates = dates.map(d => json.rates[d][to]);
        if (dates.length === 0) throw new Error();
        setData({ dates, rates });
      })
      .catch(() => setError('Could not load historical data.'))
      .finally(() => setLoading(false));
  }, [from, to, period]);

  // ── Derived stats ───────────────────────────────────────
  const stats = data ? (() => {
    const { rates, dates } = data;
    const current = rates[rates.length - 1];
    const previous = rates[0];
    const change = current - previous;
    const changePct = ((change / previous) * 100);
    const high = Math.max(...rates);
    const low = Math.min(...rates);
    const avg = rates.reduce((a, b) => a + b, 0) / rates.length;
    const up = change >= 0;
    return { current, previous, change, changePct, high, low, avg, up, dates, rates };
  })() : null;

  // ── SVG chart ───────────────────────────────────────────
  const W = 800, H = 180, PAD = { top: 16, right: 16, bottom: 28, left: 16 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const chartPoints = data ? (() => {
    const { rates } = data;
    const minR = Math.min(...rates);
    const maxR = Math.max(...rates);
    const range = maxR - minR || 1;
    return rates.map((r, i) => ({
      x: PAD.left + (i / (rates.length - 1)) * chartW,
      y: PAD.top + chartH - ((r - minR) / range) * chartH,
    }));
  })() : [];

  const linePath = smoothPath(chartPoints);
  const areaPath = chartPoints.length
    ? `${linePath} L ${chartPoints[chartPoints.length - 1].x} ${PAD.top + chartH} L ${PAD.left} ${PAD.top + chartH} Z`
    : '';

  // X-axis tick labels (evenly spaced, ~5 ticks)
  const tickCount = 5;
  const tickIndices = data
    ? Array.from({ length: tickCount }, (_, i) =>
      Math.round((i / (tickCount - 1)) * (data.dates.length - 1))
    )
    : [];

  // Hover crosshair
  const hovered = hoveredIdx !== null && data ? {
    pt: chartPoints[hoveredIdx],
    date: data.dates[hoveredIdx],
    rate: data.rates[hoveredIdx],
  } : null;

  const handleMouseMove = (e) => {
    if (!data || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = W / rect.width;
    const mouseX = (e.clientX - rect.left) * scaleX - PAD.left;
    const idx = Math.round((mouseX / chartW) * (data.rates.length - 1));
    setHoveredIdx(Math.max(0, Math.min(data.rates.length - 1, idx)));
  };

  const isUp = stats?.up ?? true;
  const lineColor = isUp ? '#2D6A4F' : '#A83232';
  const fillId = isUp ? 'fill-up' : 'fill-down';
  const fillStart = isUp ? 'rgba(45,106,79,0.18)' : 'rgba(168,50,50,0.15)';

  return (
    <section className="trend-section" id="trends">
      <div className="trend-header">
        <div>
          <div className="section-label">Rate Analysis</div>
          <h2 className="section-title">
            {from} / {to}<br />
            <em>trend.</em>
          </h2>
        </div>

        <div className="period-tabs">
          {PERIODS.map((p, i) => (
            <button
              key={p.label}
              className={`period-tab${period === i ? ' period-tab--active' : ''}`}
              onClick={() => setPeriod(i)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Stat cards ── */}
      {stats && (
        <div className="stat-cards">
          <div className="stat-card stat-card--main">
            <span className="stat-label">Current rate</span>
            <span className="stat-value">{stats.current.toFixed(4)}</span>
            <span className={`stat-badge ${isUp ? 'stat-badge--up' : 'stat-badge--down'}`}>
              {isUp ? '▲' : '▼'} {Math.abs(stats.changePct).toFixed(2)}%
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Period open</span>
            <span className="stat-value stat-value--sm">{stats.previous.toFixed(4)}</span>
            <span className="stat-sub">
              {formatDate(stats.dates[0], true)}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Period high</span>
            <span className="stat-value stat-value--sm stat-value--up">{stats.high.toFixed(4)}</span>
            <span className="stat-sub">
              {formatDate(stats.dates[stats.rates.indexOf(stats.high)], true)}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Period low</span>
            <span className="stat-value stat-value--sm stat-value--down">{stats.low.toFixed(4)}</span>
            <span className="stat-sub">
              {formatDate(stats.dates[stats.rates.indexOf(stats.low)], true)}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Average</span>
            <span className="stat-value stat-value--sm">{stats.avg.toFixed(4)}</span>
            <span className="stat-sub">{PERIODS[period].label} avg</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Net change</span>
            <span className={`stat-value stat-value--sm ${isUp ? 'stat-value--up' : 'stat-value--down'}`}>
              {isUp ? '+' : ''}{stats.change.toFixed(4)}
            </span>
            <span className="stat-sub">vs. period open</span>
          </div>
        </div>
      )}

      {/* ── Chart ── */}
      <div className="chart-wrap">
        {loading && (
          <div className="chart-loading">
            <span className="spinner" />
            Loading historical data…
          </div>
        )}
        {!loading && error && (
          <p className="chart-error">{error}</p>
        )}
        {!loading && !data && !error && (
          <p className="chart-empty">Select different currencies to view trend data.</p>
        )}
        {!loading && data && (
          <>
            {/* Hover tooltip */}
            {hovered && (
              <div
                className="chart-tooltip"
                style={{
                  left: `${(hovered.pt.x / W) * 100}%`,
                }}
              >
                <span className="tooltip-rate">{hovered.rate.toFixed(4)}</span>
                <span className="tooltip-date">{formatDate(hovered.date, true)}</span>
              </div>
            )}

            <svg
              ref={svgRef}
              viewBox={`0 0 ${W} ${H}`}
              className="chart-svg"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoveredIdx(null)}
              aria-label={`${from} to ${to} exchange rate over ${PERIODS[period].label}`}
              role="img"
            >
              <defs>
                <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={fillStart} />
                  <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                </linearGradient>
              </defs>

              {/* Area fill */}
              <path d={areaPath} fill={`url(#${fillId})`} />

              {/* Avg reference line */}
              {stats && (() => {
                const minR = Math.min(...data.rates);
                const maxR = Math.max(...data.rates);
                const range = maxR - minR || 1;
                const avgY = PAD.top + chartH - ((stats.avg - minR) / range) * chartH;
                return (
                  <line
                    x1={PAD.left} y1={avgY}
                    x2={PAD.left + chartW} y2={avgY}
                    stroke="var(--ink-faint)" strokeWidth="0.75"
                    strokeDasharray="4 4"
                  />
                );
              })()}

              {/* Line */}
              <path
                d={linePath}
                fill="none"
                stroke={lineColor}
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Hover crosshair */}
              {hovered && (
                <>
                  <line
                    x1={hovered.pt.x} y1={PAD.top}
                    x2={hovered.pt.x} y2={PAD.top + chartH}
                    stroke="var(--ink-faint)" strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <circle
                    cx={hovered.pt.x} cy={hovered.pt.y}
                    r="4" fill={lineColor} stroke="var(--warm-white)" strokeWidth="2"
                  />
                </>
              )}

              {/* X-axis ticks */}
              {tickIndices.map((idx) => (
                <text
                  key={idx}
                  x={PAD.left + (idx / (data.dates.length - 1)) * chartW}
                  y={H - 4}
                  textAnchor="middle"
                  fontSize="10"
                  fill="var(--ink-faint)"
                  fontFamily="var(--font-mono)"
                >
                  {formatDate(data.dates[idx], true)}
                </text>
              ))}
            </svg>

            <div className="chart-legend">
              <span className="legend-dot" style={{ background: lineColor }} />
              <span className="legend-label">1 {from} in {to}</span>
              <span className="legend-sep">·</span>
              <span className="legend-label legend-label--muted">— avg {stats?.avg.toFixed(4)}</span>
            </div>
          </>
        )}
      </div>
    </section>
  );
}