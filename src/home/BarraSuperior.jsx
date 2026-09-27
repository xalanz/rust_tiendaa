import NavegacionSuperior from './NavegacionSuperior.jsx'
import { useMsal, useIsAuthenticated } from '@azure/msal-react'
import { InteractionStatus } from '@azure/msal-browser'

export default function BarraSuperior() {
  const { instance, inProgress } = useMsal()
  const isAuthenticated = useIsAuthenticated()

  const handleLogout = () => {
    if (inProgress === InteractionStatus.None) {
      instance.logoutRedirect({ postLogoutRedirectUri: '/' }).catch((error) => console.error(error))
    }
  }

  return (
    <header className="site-header">
      <nav className="container nav-bar">
        <a className="brand" href="#inicio" aria-label="Óxido, inicio">
          ÓX<span>IDO</span>
        </a>
        <NavegacionSuperior />
        <a className="button button-primary button-small" href="#/armas">Ver skins</a>
        {isAuthenticated ? (
          <button
            className="button button-secondary button-small"
            onClick={handleLogout}
            disabled={inProgress !== InteractionStatus.None}
          >
            Cerrar sesión
          </button>
        ) : (
          <a className="button button-primary button-small" href="#/login">
            Iniciar sesión
          </a>
        )}
      </nav>
    </header>
  )
}
