import { useIsAuthenticated } from '@azure/msal-react'
import { useRoles } from '../useRoles'

// Menú según el rol del usuario. Ocultar un enlace no es seguridad:
// el backend valida el rol en cada petición.
export default function NavegacionSuperior() {
  const isAuthenticated = useIsAuthenticated()
  const { has } = useRoles()

  return (
    <div className="nav-links">
      <a href="#/armas">Armas</a>
      <a href="#/ropa">Ropa</a>
      <a href="#/herramientas">Herramientas</a>
      {isAuthenticated && <a href="#/dashboard">Dashboard</a>}
      {has('Cliente', 'Operador', 'Admin') && <a href="#/pedidos">Pedidos</a>}
      {has('Admin', 'Operador') && <a href="#/gestion-catalogo">Catálogo</a>}
      {has('Admin') && <a href="#/reportes">Reportes</a>}
      {has('Admin', 'Auditor') && <a href="#/auditoria">Auditoría</a>}
    </div>
  )
}
