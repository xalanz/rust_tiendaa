// src/page/Auditoria.tsx — timeline de eventos de negocio (solo lectura)
import { useState, type FormEvent } from 'react';
import { useLoad } from '../useJsonApi';
import { dateTime, EVENT_LABELS, money, shortId } from '../format';
import { StatusBadge } from '../StatusBadge';
import type { AuditEvent } from '../types';

type Filters = { user: string; type: string; from: string; to: string; orderId: string };
type AuditResponse = { items: AuditEvent[]; count: number; truncated: boolean };

const pad2 = (n: number) => String(n).padStart(2, '0');
const toDateInput = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

function defaultFilters(): Filters {
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 86400000);
  return { user: '', type: '', from: toDateInput(weekAgo), to: toDateInput(today), orderId: '' };
}

// Las fechas del formulario son locales; se convierten a instantes ISO para que el
// rango cubra exactamente los días elegidos en tu zona horaria.
function buildPath(f: Filters) {
  const p = new URLSearchParams();
  if (f.orderId.trim()) {
    p.set('orderId', f.orderId.trim()); // con un pedido se muestra toda su trazabilidad
  } else {
    if (f.from) p.set('from', new Date(`${f.from}T00:00:00`).toISOString());
    if (f.to) p.set('to', new Date(`${f.to}T23:59:59.999`).toISOString());
  }
  if (f.type) p.set('type', f.type);
  if (f.user.trim()) p.set('user', f.user.trim());
  p.set('limit', '200');
  return `/audit?${p.toString()}`;
}

export default function Auditoria() {
  const [form, setForm] = useState<Filters>(defaultFilters);
  const [applied, setApplied] = useState<Filters>(form);
  const { data, loading, error, reload } = useLoad<AuditResponse>(buildPath(applied));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setApplied(form);
  };

  const traceOrder = (orderId: string) => {
    const next = { ...form, orderId };
    setForm(next);
    setApplied(next);
  };

  const clearOrder = () => {
    const next = { ...form, orderId: '' };
    setForm(next);
    setApplied(next);
  };

  const set = (field: keyof Filters) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <section>
      <div className="orders-toolbar">
        <div>
          <h1 className="page-title">Auditoría</h1>
          <p className="page-subtitle">Línea de tiempo de eventos de negocio · solo lectura</p>
        </div>
        <button type="button" className="orders-button" onClick={reload} disabled={loading}>
          {loading ? 'Cargando...' : 'Actualizar'}
        </button>
      </div>

      <form className="panel filters" onSubmit={handleSubmit}>
        <label className="field">
          Usuario (correo)
          <input value={form.user} onChange={set('user')} placeholder="operador@..." />
        </label>
        <label className="field">
          Tipo de evento
          <select value={form.type} onChange={set('type')}>
            <option value="">Todos</option>
            {Object.entries(EVENT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
        <label className="field">
          Desde
          <input type="date" value={form.from} onChange={set('from')} disabled={!!form.orderId.trim()} />
        </label>
        <label className="field">
          Hasta
          <input type="date" value={form.to} onChange={set('to')} disabled={!!form.orderId.trim()} />
        </label>
        <label className="field field-wide">
          ID de pedido (trazabilidad completa)
          <input value={form.orderId} onChange={set('orderId')} placeholder="ID completo del pedido" />
        </label>
        <div className="form-actions">
          <button type="submit" className="orders-button" disabled={loading}>Buscar</button>
          {applied.orderId && (
            <button type="button" className="orders-button danger" onClick={clearOrder}>
              Quitar filtro de pedido
            </button>
          )}
        </div>
      </form>

      {error && <p className="orders-error">{error}</p>}
      {!data && loading && <p className="orders-empty">Cargando eventos...</p>}
      {data && data.items.length === 0 && (
        <p className="orders-empty">No hay eventos con esos filtros.</p>
      )}

      {data && data.items.length > 0 && (
        <>
          <p className="muted">
            {data.count} evento(s){data.truncated ? ' · hay más resultados: acota los filtros' : ''}
          </p>
          <ol className="timeline">
            {data.items.map((e) => (
              <li key={e.eventId} className="timeline-item">
                <span className="timeline-dot" />
                <div className="timeline-body">
                  <div className="timeline-head">
                    <strong>{EVENT_LABELS[e.eventType] ?? e.eventType}</strong>
                    <span className="muted">{dateTime(e.at)}</span>
                  </div>
                  <div className="timeline-line">
                    {e.fromStatus ? <StatusBadge status={e.fromStatus} /> : <span className="muted">inicio</span>}
                    <span className="muted">→</span>
                    <StatusBadge status={e.toStatus} />
                    <span className="muted">· pedido #{shortId(e.orderId)}</span>
                    {!applied.orderId && (
                      <button type="button" className="link-button" onClick={() => traceOrder(e.orderId)}>
                        ver trazabilidad
                      </button>
                    )}
                  </div>
                  <div className="timeline-meta">
                    <span>
                      Por: {e.actorEmail ?? 'desconocido'}
                      {e.actorRole ? ` (${e.actorRole})` : ''}
                    </span>
                    {e.sourceIp && <span>Desde: {e.sourceIp}</span>}
                    {e.customerEmail && <span>Cliente: {e.customerEmail}</span>}
                    {e.orderTotal !== undefined && <span>Total: {money(e.orderTotal)}</span>}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </>
      )}
    </section>
  );
}
