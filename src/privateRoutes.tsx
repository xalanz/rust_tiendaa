// src/privateRoutes.tsx — páginas que requieren sesión y rol
import type { ReactNode } from 'react';
import './orders.css';
import './app-pages.css';
import { PageShell } from './PageShell';
import { RoleGuard } from './RoleGuard';
import type { Role } from './useRoles';
import Dashboard from './page/Dashboard';
import Pedidos from './page/Pedidos';
import GestionCatalogo from './page/GestionCatalogo';
import Reportes from './page/Reportes';
import Auditoria from './page/Auditoria';

type Page = { allow: Role[]; element: ReactNode };

// Ruta (#/ruta) -> roles permitidos y página
const pages = new Map<string, Page>([
  ['dashboard', { allow: ['Admin', 'Operador', 'Cliente', 'Auditor'], element: <Dashboard /> }],
  ['pedidos', { allow: ['Admin', 'Operador', 'Cliente'], element: <Pedidos /> }],
  ['gestion-catalogo', { allow: ['Admin', 'Operador'], element: <GestionCatalogo /> }],
  ['reportes', { allow: ['Admin'], element: <Reportes /> }],
  ['auditoria', { allow: ['Admin', 'Auditor'], element: <Auditoria /> }],
]);

// Devuelve la página protegida para la ruta, o null si la ruta no es privada.
export function renderPrivateRoute(route: string): ReactNode | null {
  const page = pages.get(route);
  if (!page) return null;

  return (
    <PageShell>
      <RoleGuard allow={page.allow}>{page.element}</RoleGuard>
    </PageShell>
  );
}
