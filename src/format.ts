// src/format.ts — formatos y textos compartidos

export const money = (n: number) => `$${n.toLocaleString('es-AR')}`;

export const compact = (n: number) =>
  new Intl.NumberFormat('es-CL', { notation: 'compact', maximumFractionDigits: 1 }).format(n);

export const dateTime = (iso: string) => new Date(iso).toLocaleString('es-CL');

export const shortId = (id: string) => id.slice(-8).toUpperCase();

export function formatMinutes(minutes: number | null | undefined) {
  if (minutes === null || minutes === undefined) return '—';
  if (minutes >= 60) return `${Math.floor(minutes / 60)} h ${Math.round(minutes % 60)} min`;
  return `${minutes} min`;
}

export const STATUS_ORDER = [
  'CREADO',
  'ACEPTADO',
  'EN_PREPARACION',
  'DESPACHADO',
  'ENTREGADO',
  'CANCELADO',
];

export const STATUS_LABELS: Record<string, string> = {
  CREADO: 'Creado',
  ACEPTADO: 'Aceptado',
  EN_PREPARACION: 'En preparación',
  DESPACHADO: 'Despachado',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
};

export const EVENT_LABELS: Record<string, string> = {
  OrderCreated: 'Pedido creado',
  OrderAccepted: 'Pedido aceptado',
  OrderPreparing: 'Pedido en preparación',
  OrderDispatched: 'Pedido despachado',
  OrderDelivered: 'Pedido entregado',
  OrderCancelled: 'Pedido cancelado',
};
