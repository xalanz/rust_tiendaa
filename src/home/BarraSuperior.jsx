import NavegacionSuperior from './NavegacionSuperior.jsx'
import { useMsal, useIsAuthenticated } from '@azure/msal-react'
import { InteractionStatus } from '@azure/msal-browser'
import { loginRequest } from '../authConfig'

export default function BarraSuperior() {
  const { instance, inProgress } = useMsal()
  const isAuthenticated = useIsAuthenticated()

  const handleLogin = () => {
    if (inProgress === InteractionStatus.None) {
      instance.loginRedirect(loginRequest).catch((error) => console.error(error))
    }
  }

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
          <button
            className="button button-primary button-small"
            onClick={handleLogin}
            disabled={inProgress !== InteractionStatus.None}
          >
            Iniciar sesión
          </button>
        )}
      </nav>
    </header>
  )
}
