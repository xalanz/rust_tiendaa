// src/RoleGuard.tsx — guard por rol para las rutas privadas
import type { ReactNode } from 'react';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { useRoles, type Role } from './useRoles';

export function RoleGuard({ allow, children }: { allow: Role[]; children: ReactNode }) {
  const isAuthenticated = useIsAuthenticated();
  const { inProgress } = useMsal();
  const { has } = useRoles();

  // Mientras MSAL procesa el inicio de sesión no se sabe aún si hay sesión
  if (inProgress === InteractionStatus.Startup || inProgress === InteractionStatus.HandleRedirect) {
    return <p className="orders-empty">Cargando sesión...</p>;
  }

  if (!isAuthenticated) {
    return (
      <section className="access-box">
        <h1>Acceso requerido</h1>
        <p>
          Debes <a href="#/login">iniciar sesión</a> para ver esta página.
        </p>
      </section>
    );
  }

  if (!has(...allow)) {
    return (
      <section className="access-box">
        <h1>Acceso denegado</h1>
        <p>Tu rol no tiene permiso para esta sección.</p>
        <p>
          <a href="#/dashboard">Volver al dashboard</a>
        </p>
      </section>
    );
  }

  return <>{children}</>;
}
