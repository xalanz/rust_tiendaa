// src/StatusBadge.tsx — estado del pedido con color (OrderStatusBadgeComponent del caso)
import { STATUS_LABELS } from './format';

export function StatusBadge({ status }: { status: string }) {
  return <span className={`status-badge status-${status}`}>{STATUS_LABELS[status] ?? status}</span>;
}
