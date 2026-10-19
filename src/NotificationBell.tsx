// src/NotificationBell.tsx
import { useEffect, useRef, useState } from 'react';
import { useIsAuthenticated } from '@azure/msal-react';
import { useNotifications } from './useNotifications';
import { dateTime, shortId } from './format';
import './notifications.css';

export function NotificationBell() {
  const isAuthenticated = useIsAuthenticated();
  const { items, unread, markAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // Cerrar el desplegable al hacer clic fuera
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  if (!isAuthenticated) return null;

  return (
    <div className="notif-bell" ref={boxRef}>
      <button
        type="button"
        className="notif-bell-button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notificaciones${unread > 0 ? `, ${unread} sin leer` : ''}`}
      >
        🔔
        {unread > 0 && <span className="notif-badge">{unread > 9 ? '9+' : unread}</span>}
      </button>

      {open && (
        <div className="notif-panel">
          <div className="notif-panel-head">Notificaciones</div>
          {items.length === 0 ? (
            <p className="notif-empty">Sin notificaciones por ahora.</p>
          ) : (
            <ul className="notif-list">
              {items.map((n) => (
                <li
                  key={n.notificationId}
                  className={n.read ? 'notif-item' : 'notif-item unread'}
                  onClick={() => !n.read && markAsRead(n.notificationId)}
                >
                  <span>{n.message}</span>
                  <span className="notif-meta">
                    #{shortId(n.orderId)} · {dateTime(n.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
