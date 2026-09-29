// src/page/Pedidos.tsx
import { useCallback, useEffect, useState } from "react";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { useApi } from "../useApi";
import "../orders.css";

type OrderItem = { productId: string; name: string; price: number; quantity: number };
type Order = {
  orderId: string;
  customerName?: string;
  customerEmail?: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
  deliveredAt?: string;
};

const LABELS: Record<string, string> = {
  CREADO: "Creado",
  ACEPTADO: "Aceptado",
  EN_PREPARACION: "En preparación",
  DESPACHADO: "Despachado",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

// Solo para decidir qué botones mostrar; la regla real se valida en el servidor.
const NEXT: Record<string, string[]> = {
  CREADO: ["ACEPTADO", "CANCELADO"],
  ACEPTADO: ["EN_PREPARACION", "CANCELADO"],
  EN_PREPARACION: ["DESPACHADO", "CANCELADO"],
  DESPACHADO: ["ENTREGADO"],
  ENTREGADO: [],
  CANCELADO: [],
};

function leadTime(order: Order) {
  if (!order.deliveredAt) return null;
  const minutes = Math.round(
    (new Date(order.deliveredAt).getTime() - new Date(order.createdAt).getTime()) / 60000
  );
  const h = Math.floor(minutes / 60);
  return h > 0 ? `${h} h ${minutes % 60} min` : `${minutes} min`;
}

export default function Pedidos() {
  const isAuthenticated = useIsAuthenticated();
  const { accounts } = useMsal();
  const { fetchWithToken } = useApi();

  const roles = ((accounts[0]?.idTokenClaims?.roles as string[] | undefined) ?? []);
  const isStaff = roles.includes("Operador") || roles.includes("Admin");
  const isClient = roles.includes("Cliente");

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = isStaff && filter ? `?status=${filter}` : "";
      const res = await fetchWithToken(`${import.meta.env.VITE_API_URL}/orders${query}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
      setOrders(data.items);
    } catch (err: any) {
      setError(err.message || "No se pudieron cargar los pedidos");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStaff, filter]);

  useEffect(() => {
    if (isAuthenticated && (isStaff || isClient)) load();
  }, [isAuthenticated, isStaff, isClient, load]);

  const changeStatus = async (orderId: string, status: string) => {
    setBusyId(orderId);
    setError(null);
    try {
      const res = await fetchWithToken(
        `${import.meta.env.VITE_API_URL}/orders/${orderId}/status`,
        { method: "PUT", body: JSON.stringify({ status }) }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
      setOrders((current) => current.map((o) => (o.orderId === orderId ? data : o)));
    } catch (err: any) {
      setError(err.message || "No se pudo cambiar el estado");
    } finally {
      setBusyId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="orders-page">
        <h1>Pedidos</h1>
        <p className="orders-empty">
          Debes <a href="#/login">iniciar sesión</a> para ver tus pedidos.
        </p>
      </section>
    );
  }

  if (!isStaff && !isClient) {
    return (
      <section className="orders-page">
        <h1>Pedidos</h1>
        <p className="orders-empty">Tu rol no tiene acceso a los pedidos.</p>
      </section>
    );
  }

  return (
    <section className="orders-page">
      <div className="orders-toolbar">
        <h1>{isStaff ? "Gestión de pedidos" : "Mis pedidos"}</h1>
        <div className="orders-toolbar-actions">
          {isStaff && (
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="">Todos los estados</option>
              {Object.entries(LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          )}
          <button type="button" className="orders-button" onClick={load} disabled={loading}>
            {loading ? "Cargando..." : "Actualizar"}
          </button>
        </div>
      </div>

      {error && <p className="orders-error">{error}</p>}
      {!loading && orders.length === 0 && !error && (
        <p className="orders-empty">No hay pedidos para mostrar.</p>
      )}

      <div className="orders-list">
        {orders.map((order) => {
          // Un cliente solo puede cancelar mientras el pedido esté en CREADO
          const actions = isStaff
            ? NEXT[order.status]
            : order.status === "CREADO" ? ["CANCELADO"] : [];
          const lead = leadTime(order);

          return (
            <article key={order.orderId} className="order-card">
              <header>
                <div>
                  <strong>#{order.orderId.slice(-8).toUpperCase()}</strong>
                  <span className="order-date">
                    {new Date(order.createdAt).toLocaleString("es-CL")}
                  </span>
                </div>
                <span className={`status-badge status-${order.status}`}>
                  {LABELS[order.status] ?? order.status}
                </span>
              </header>

              {isStaff && (
                <p className="order-customer">
                  {order.customerName} · {order.customerEmail}
                </p>
              )}

              <ul className="order-items">
                {order.items.map((it) => (
                  <li key={it.productId}>
                    <span>{it.quantity} × {it.name}</span>
                    <span>${(it.price * it.quantity).toLocaleString("es-AR")}</span>
                  </li>
                ))}
              </ul>

              <footer>
                <div>
                  <strong>Total ${order.total.toLocaleString("es-AR")}</strong>
                  {lead && <span className="order-date">Lead time: {lead}</span>}
                </div>
                <div className="order-actions">
                  {actions.map((next) => (
                    <button
                      key={next}
                      type="button"
                      className={next === "CANCELADO" ? "orders-button danger" : "orders-button"}
                      disabled={busyId === order.orderId}
                      onClick={() => changeStatus(order.orderId, next)}
                    >
                      {next === "CANCELADO" ? "Cancelar" : `Marcar ${LABELS[next].toLowerCase()}`}
                    </button>
                  ))}
                </div>
              </footer>
            </article>
          );
        })}
      </div>
    </section>
  );
}
