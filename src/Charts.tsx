// src/Charts.tsx — gráficos livianos en SVG/HTML, sin dependencias externas

type Bar = { label: string; value: number; tooltip: string };

// Gráfico de barras verticales. La ventana se ajusta sola al ancho del contenedor.
export function BarChart({
  data,
  formatAxis,
  ariaLabel,
}: {
  data: Bar[];
  formatAxis: (n: number) => string;
  ariaLabel: string;
}) {
  const width = 640;
  const height = 240;
  const pad = { top: 16, right: 12, bottom: 34, left: 56 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const max = Math.max(1, ...data.map((d) => d.value));
  const slot = innerW / Math.max(1, data.length);
  const barW = Math.max(2, slot * 0.7);
  const step = Math.max(1, Math.ceil(data.length / 8)); // etiquetas del eje X visibles

  return (
    <svg className="chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={ariaLabel}>
      {[0, 0.5, 1].map((t) => {
        const y = pad.top + innerH * (1 - t);
        return (
          <g key={t}>
            <line className="chart-grid" x1={pad.left} x2={width - pad.right} y1={y} y2={y} />
            <text className="chart-axis" x={pad.left - 8} y={y + 4} textAnchor="end">
              {formatAxis(Math.round(max * t))}
            </text>
          </g>
        );
      })}

      {data.map((d, i) => {
        const h = (d.value / max) * innerH;
        const x = pad.left + i * slot + (slot - barW) / 2;
        return (
          <g key={`${d.label}-${i}`}>
            <rect className="chart-bar" x={x} y={pad.top + innerH - h} width={barW} height={h} rx={2}>
              <title>{d.tooltip}</title>
            </rect>
            {i % step === 0 && (
              <text className="chart-axis" x={x + barW / 2} y={height - 12} textAnchor="middle">
                {d.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

type HBar = { label: string; value: number; display: string; fill?: string };

// Barras horizontales con etiqueta y valor (top de productos, estados)
export function HBarChart({ data }: { data: HBar[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="hbars">
      {data.map((d) => (
        <div className="hbar-row" key={d.label}>
          <span className="hbar-label">{d.label}</span>
          <div className="hbar-track">
            <div
              className={`hbar-fill ${d.fill ?? ''}`}
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
          <span className="hbar-value">{d.display}</span>
        </div>
      ))}
    </div>
  );
}
