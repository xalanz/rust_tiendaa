// src/page/Reportes.tsx — panel de KPIs (solo Admin)
import { useState } from 'react';
import { useLoad } from '../useJsonApi';
import { BarChart, HBarChart } from '../Charts';
import {
  compact,
  dateTime,
  formatMinutes,
  money,
  STATUS_LABELS,
  STATUS_ORDER,
} from '../format';
import type { ReportSummary } from '../types';

const pad2 = (n: number) => String(n).padStart(2, '0');

// "2026-09-28T14" (UTC) -> "28/09 11h" (hora local)
function hourLabel(hour: string) {
  const d = new Date(`${hour}:00:00Z`);
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)} ${pad2(d.getHours())}h`;
}

export default function Reportes() {
  const [hours, setHours] = useState(48);
  const { data, loading, error, reload } = useLoad<ReportSummary>(
    `/report/summary?hours=${hours}&days=14`
  );

  const hasSales = data?.salesByHour.some((h) => h.revenue > 0 || h.orders > 0) ?? false;

  return (
    <section>
      <div className="orders-toolbar">
        <div>
          <h1 className="page-title">Reportería y KPIs</h1>
          <p className="page-subtitle">
            {data ? `Actualizado: ${dateTime(data.generatedAt)}` : 'Datos generados a partir de los eventos de pedidos'}
          </p>
        </div>
        <div className="orders-toolbar-actions">
          <select value={hours} onChange={(e) => setHours(Number(e.target.value))}>
            <option value={24}>Últimas 24 horas</option>
            <option value={48}>Últimas 48 horas</option>
            <option value={168}>Últimos 7 días</option>
          </select>
          <button type="button" className="orders-button" onClick={reload} disabled={loading}>
            {loading ? 'Cargando...' : 'Actualizar'}
          </button>
        </div>
      </div>

      {error && <p className="orders-error">{error}</p>}
      {!data && loading && <p className="orders-empty">Cargando reportes...</p>}

      {data && (
        <>
          <div className="kpi-grid">
            <div className="kpi-card">
              <span>Ventas confirmadas</span>
              <strong>{money(data.totals.revenue)}</strong>
            </div>
            <div className="kpi-card">
              <span>Pedidos confirmados</span>
              <strong>{data.totals.confirmedOrders}</strong>
            </div>
            <div className="kpi-card">
              <span>Pedidos activos</span>
              <strong>{data.totals.activeOrders}</strong>
            </div>
            <div className="kpi-card">
              <span>Clientes</span>
              <strong>{data.totals.customers}</strong>
            </div>
            <div className="kpi-card">
              <span>Lead time promedio</span>
              <strong>{formatMinutes(data.leadTime.avgMinutes)}</strong>
            </div>
          </div>

          <div className="panel">
            <h2>Ventas por hora</h2>
            <p className="panel-note">Pedidos aceptados, en hora local. Se descuentan los cancelados después de aceptar.</p>
            {hasSales ? (
              <BarChart
                ariaLabel="Ventas por hora"
                formatAxis={(n) => `$${compact(n)}`}
                data={data.salesByHour.map((h) => ({
                  label: hourLabel(h.hour),
                  value: h.revenue,
                  tooltip: `${hourLabel(h.hour)} · ${money(h.revenue)} · ${h.orders} pedido(s)`,
                }))}
              />
            ) : (
              <p className="orders-empty">Aún no hay ventas en este período.</p>
            )}
          </div>

          <div className="panel-grid">
            <div className="panel">
              <h2>Lead time por día</h2>
              <p className="panel-note">Minutos entre crear y entregar un pedido (promedio del día de entrega).</p>
              {data.leadTime.byDay.length > 0 ? (
                <BarChart
                  ariaLabel="Lead time promedio por día"
                  formatAxis={(n) => `${n} min`}
                  data={data.leadTime.byDay.map((d) => ({
                    label: `${d.day.slice(8, 10)}/${d.day.slice(5, 7)}`,
                    value: d.avgMinutes,
                    tooltip: `${d.day} · ${formatMinutes(d.avgMinutes)} promedio · ${d.delivered} entregado(s)`,
                  }))}
                />
              ) : (
                <p className="orders-empty">Aún no hay pedidos entregados.</p>
              )}
            </div>

            <div className="panel">
              <h2>Pedidos por estado</h2>
              <HBarChart
                data={STATUS_ORDER.map((s) => ({
                  label: STATUS_LABELS[s],
                  value: data.statusCounts[s] ?? 0,
                  display: String(data.statusCounts[s] ?? 0),
                  fill: `fill-${s}`,
                }))}
              />
            </div>
          </div>

          <div className="panel">
            <h2>Productos más vendidos</h2>
            {data.topProducts.length > 0 ? (
              <HBarChart
                data={data.topProducts.map((p) => ({
                  label: p.name,
                  value: p.units,
                  display: `${p.units} u. · ${money(p.revenue)}`,
                }))}
              />
            ) : (
              <p className="orders-empty">Aún no hay productos vendidos.</p>
            )}
          </div>
        </>
      )}
    </section>
  );
}
