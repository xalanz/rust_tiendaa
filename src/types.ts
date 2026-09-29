// src/types.ts — formas de los datos que devuelve la API

export type OrderItem = { productId: string; name: string; price: number; quantity: number };

export type Order = {
  orderId: string;
  customerName?: string;
  customerEmail?: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
  deliveredAt?: string;
};

export type Product = {
  productId: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  tag?: string;
  imageKey?: string;
};

export type ReportSummary = {
  totals: {
    orders: number;
    activeOrders: number;
    confirmedOrders: number;
    revenue: number;
    customers: number;
  };
  statusCounts: Record<string, number>;
  salesByHour: { hour: string; orders: number; revenue: number }[];
  leadTime: {
    avgMinutes: number | null;
    delivered: number;
    byDay: { day: string; delivered: number; avgMinutes: number }[];
  };
  topProducts: { productId: string; name: string; units: number; revenue: number }[];
  generatedAt: string;
};

export type AuditEvent = {
  orderId: string;
  eventId: string;
  eventType: string;
  at: string;
  fromStatus: string | null;
  toStatus: string;
  actorEmail?: string;
  actorName?: string;
  actorRole?: string;
  sourceIp?: string;
  customerEmail?: string;
  customerName?: string;
  orderTotal?: number;
};
