// src/page/Dashboard.tsx — resumen de actividad según el rol
import { useMsal } from '@azure/msal-react';
import { useRoles } from '../useRoles';
import { useLoad } from '../useJsonApi';
import { StatusBadge } from '../StatusBadge';
import { dateTime, EVENT_LABELS, formatMinutes, money, shortId, STATUS_ORDER } from '../format';
import type { AuditEvent, Order, ReportSummary } from '../types';

function Status({ loading, error }: { loading: boolean; error: string | null }) {
  if (loading) return <p className="orders-empty">Cargando...</p>;
  if (error) return <p className="orders-error">{error}</p>;
  return null;
}

// Admin: KPIs globales
function AdminSummary() {
  const { data, loading, error } = useLoad<ReportSummary>('/report/summary?hours=24');
  if (!data) return <Status loading={loading} error={error} />;

  const kpis = [
    { label: 'Pedidos', value: data.totals.orders },
    { label: 'Pedidos activos', value: data.totals.activeOrders },
    { label: 'Ventas', value: money(data.totals.revenue) },
    { label: 'Clientes', value: data.totals.customers },
    { label: 'Lead time promedio', value: formatMinutes(data.leadTime.avgMinutes) },
  ];

  return (
    <>
      <div className="kpi-grid">
        {kpis.map((k) => (
          <div className="kpi-card" key={k.label}>
            <span>{k.label}</span>
            <strong>{k.value}</strong>
          </div>
        ))}
      </div>
      <div className="panel">
        <h2>Pedidos por estado</h2>
        <div className="badge-row">
          {STATUS_ORDER.map((s) => (
            <span key={s} className="badge-count">
              <StatusBadge status={s} /> {data.statusCounts[s] ?? 0}
            </span>
          ))}
        </div>
        <p className="panel-link">
          <a href="#/reportes">Ver reportes completos →</a>
        </p>
      </div>
    </>
  );
}

function OrderRows({ orders, showCustomer }: { orders: Order[]; showCustomer?: boolean }) {
  if (orders.length === 0) return <p className="orders-empty">No hay pedidos para mostrar.</p>;
  return (
    <ul className="mini-list">
      {orders.map((o) => (
        <li key={o.orderId}>
          <div>
            <strong>#{shortId(o.orderId)}</strong>
            <span className="muted">
              {dateTime(o.createdAt)}
              {showCustomer && o.customerName ? ` · ${o.customerName}` : ''}
            </span>
          </div>
          <div className="mini-list-right">
            <span>{money(o.total)}</span>
            <StatusBadge status={o.status} />
          </div>
        </li>
      ))}
    </ul>
  );
}

// Operador: pedidos pendientes y en curso
function OperatorSummary() {
  const { data, loading, error } = useLoad<{ items: Order[] }>('/orders');
  if (!data) return <Status loading={loading} error={error} />;

  const pending = data.items.filter((o) => o.status === 'CREADO');
  const inProgress = data.items.filter((o) =>
    ['ACEPTADO', 'EN_PREPARACION', 'DESPACHADO'].includes(o.status)
  );
  // Los más antiguos primero: son los que llevan más tiempo esperando
  const queue = [...pending, ...inProgress]
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .slice(0, 8);

  return (
    <>
      <div className="kpi-grid">
        <div className="kpi-card">
          <span>Pendientes por aceptar</span>
          <strong>{pending.length}</strong>
        </div>
        <div className="kpi-card">
          <span>En curso</span>
          <strong>{inProgress.length}</strong>
        </div>
      </div>
      <div className="panel">
        <h2>Pedidos por atender</h2>
        <OrderRows orders={queue} showCustomer />
        <p className="panel-link">
          <a href="#/pedidos">Gestionar pedidos →</a>
        </p>
      </div>
    </>
  );
}

// Cliente: últimos pedidos y su estado
function ClientSummary() {
  const { data, loading, error } = useLoad<{ items: Order[] }>('/orders');
  if (!data) return <Status loading={loading} error={error} />;

  return (
    <div className="panel">
      <h2>Tus últimos pedidos</h2>
      <OrderRows orders={data.items.slice(0, 5)} />
      <p className="panel-link">
        <a href="#/pedidos">Ver todos mis pedidos →</a>
      </p>
    </div>
  );
}

// Auditor: últimos eventos registrados
function AuditorSummary() {
  const { data, loading, error } = useLoad<{ items: AuditEvent[] }>('/audit?limit=8');
  if (!data) return <Status loading={loading} error={error} />;

  return (
    <div className="panel">
      <h2>Últimos eventos</h2>
      {data.items.length === 0 ? (
        <p className="orders-empty">Aún no hay eventos registrados.</p>
      ) : (
        <ul className="mini-list">
          {data.items.map((e) => (
            <li key={e.eventId}>
              <div>
                <strong>{EVENT_LABELS[e.eventType] ?? e.eventType}</strong>
                <span className="muted">
                  #{shortId(e.orderId)} · {e.actorEmail ?? 'sistema'}
                </span>
              </div>
              <span className="muted">{dateTime(e.at)}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="panel-link">
        <a href="#/auditoria">Abrir la auditoría completa →</a>
      </p>
    </div>
  );
}

export default function Dashboard() {
  const { primary } = useRoles();
  const { accounts } = useMsal();

  return (
    <section>
      <h1 className="page-title">Hola, {accounts[0]?.name ?? 'usuario'}</h1>
      <p className="page-subtitle">{primary ? `Rol: ${primary}` : 'Sin rol asignado'}</p>

      {primary === 'Admin' && <AdminSummary />}
      {primary === 'Operador' && <OperatorSummary />}
      {primary === 'Cliente' && <ClientSummary />}
      {primary === 'Auditor' && <AuditorSummary />}
      {!primary && (
        <p className="orders-empty">
          Tu cuenta aún no tiene un rol asignado. Pide a un administrador que te lo asigne.
        </p>
      )}
    </section>
  );
}
