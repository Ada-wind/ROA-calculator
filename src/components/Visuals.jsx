import { formatPercent } from "../calculations";

function MetricCard({ label, value, accent }) {
  return (
    <article className={`metric-card${accent ? " metric-card--accent" : ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function FormulaCard({ title, value, hint }) {
  return (
    <article className="formula-card">
      <span>{title}</span>
      <strong>{value}</strong>
      {hint ? <p>{hint}</p> : null}
    </article>
  );
}

function ChartSwitcher({ copy, selectedView, onChange }) {
  return (
    <div className="view-switcher">
      {["table", "bar", "line"].map((view) => (
        <button
          className={`view-switcher__button${selectedView === view ? " is-active" : ""}`}
          key={view}
          type="button"
          onClick={() => onChange(view)}
        >
          {copy[view]}
        </button>
      ))}
    </div>
  );
}

function SimpleTable({ columns, rows, summaryRow }) {
  return (
    <div className="data-table">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={row.id ?? rowIndex}>
              {columns.map((column) => (
                <td key={column.key}>{row[column.key]}</td>
              ))}
            </tr>
          ))}
          {summaryRow ? (
            <tr className="data-table__summary">
              {columns.map((column) => (
                <td key={column.key}>{summaryRow[column.key]}</td>
              ))}
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

function BarChart({ points }) {
  const max = Math.max(...points.map((point) => Math.abs(point.value)), 1);

  return (
    <div className="chart chart--bars">
      {points.map((point) => {
        const height = `${(Math.abs(point.value) / max) * 100}%`;
        return (
          <div className="chart__column" key={point.label}>
            <div className={`chart__bar${point.value < 0 ? " is-negative" : ""}`} style={{ height }} />
            <strong>{formatPercent(point.value)}</strong>
            <span>{point.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function LineChart({ points }) {
  const width = 520;
  const height = 240;
  const max = Math.max(...points.map((point) => point.value), 0);
  const min = Math.min(...points.map((point) => point.value), 0);
  const range = max - min || 1;

  const coordinates = points.map((point, index) => {
    const x = (index / Math.max(points.length - 1, 1)) * (width - 40) + 20;
    const y = height - ((point.value - min) / range) * (height - 40) - 20;
    return { ...point, x, y };
  });

  const path = coordinates
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return (
    <div className="chart chart--line">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="ROA trend line">
        <defs>
          <linearGradient id="lineGradient" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
        <path className="chart__path-shadow" d={path} />
        <path className="chart__path" d={path} />
        {coordinates.map((point) => (
          <g key={point.label}>
            <circle className="chart__dot" cx={point.x} cy={point.y} r="5" />
            <text className="chart__point-label" x={point.x} y={point.y - 12} textAnchor="middle">
              {formatPercent(point.value)}
            </text>
            <text className="chart__axis-label" x={point.x} y={height - 4} textAnchor="middle">
              {point.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export { BarChart, ChartSwitcher, FormulaCard, LineChart, MetricCard, SimpleTable };
