// src/useNotifications.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import { useIsAuthenticated } from '@azure/msal-react';
import { useJsonApi } from './useJsonApi';

type Notification = {
  notificationId: string;
  orderId: string;
  status: string;
  message: string;
  read: boolean;
  createdAt: string;
};

const POLL_MS = 30_000; // 30 segundos: suficiente para una demo, sin abusar de la API

export function useNotifications() {
  const isAuthenticated = useIsAuthenticated();
  const request = useJsonApi();
  const [state, setState] = useState<{ items: Notification[]; unread: number }>({
    items: [],
    unread: 0,
  });

  // Referencia estable para no reiniciar el intervalo en cada render
  const latest = useRef(request);
  useEffect(() => {
    latest.current = request;
  });

  const load = useCallback(async () => {
    try {
      const res = await latest.current<{ items: Notification[]; unread: number }>('/notifications');
      setState(res);
    } catch {
      // Silencioso: una notificación que no carga no debe interrumpir la navegación
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return; // el valor "sin sesión" se deriva más abajo, no aquí
    let cancelled = false;
    load().then(() => {
      if (cancelled) return; // ya se cerró sesión cuando la respuesta llegó
    });
    const id = setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [isAuthenticated, load]);

  const markAsRead = useCallback(
    async (notificationId: string) => {
      setState((prev) => ({
        items: prev.items.map((n) => (n.notificationId === notificationId ? { ...n, read: true } : n)),
        unread: Math.max(0, prev.unread - 1),
      }));
      try {
        await latest.current(`/notifications/${notificationId}/read`, { method: 'PUT' });
      } catch {
        load(); // si falla, se corrige con la próxima carga real
      }
    },
    [load]
  );

  if (!isAuthenticated) return { items: [], unread: 0, markAsRead, reload: load };
  return { items: state.items, unread: state.unread, markAsRead, reload: load };
}
