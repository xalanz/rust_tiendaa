// src/App.tsx
import { useEffect, useState, type ReactNode } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { loginRequest } from "./authConfig";
import { ProtectedData } from "./ProtectedData";
import BarraSuperior from "./home/BarraSuperior.jsx";
import Footer from "./home/Footer.jsx";
import Armas from "./page/Armas.jsx";
import Herramientas from "./page/Herramientas.jsx";
import Home from "./page/Home.jsx";
import Login from "./page/Login";
import Ropa from "./page/Ropa.jsx";
import "./App.css";

function getRoute() {
  return window.location.hash.replace(/^#\/?/, "") || "inicio";
}

function CatalogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="home-page catalog-layout">
      <BarraSuperior />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const currentUser = accounts[0];
  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRoute());
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleLogin = () => {
    if (inProgress === InteractionStatus.None) {
      instance.loginRedirect(loginRequest).catch((error) => console.error(error));
    }
  };

  const handleLogout = () => {
    if (inProgress === InteractionStatus.None) {
      instance
        .logoutRedirect({ postLogoutRedirectUri: "/" })
        .catch((error) => console.error(error));
    }
  };

  if (route === "inicio") {
    return <Home />;
  }

  if (route === "login") {
    return <Login onMicrosoftLogin={handleLogin} busy={inProgress !== InteractionStatus.None} />;
  }

  if (route === "armas") {
    return (
      <CatalogLayout>
        <Armas />
      </CatalogLayout>
    );
  }

  if (route === "ropa") {
    return (
      <CatalogLayout>
        <Ropa />
      </CatalogLayout>
    );
  }

  if (route === "herramientas") {
    return (
      <CatalogLayout>
        <Herramientas />
      </CatalogLayout>
    );
  }

  return (
    <div className="layout">
      <header className="navbar">
        <div className="logo">
          ⚡ <span>Portal MiApp</span>
        </div>
        <div>
          {isAuthenticated ? (
            <button
              className="btn btn-logout"
              onClick={handleLogout}
              disabled={inProgress !== InteractionStatus.None}
            >
              Cerrar Sesión
            </button>
          ) : (
            <button
              className="btn btn-login"
              onClick={handleLogin}
              disabled={inProgress !== InteractionStatus.None}
            >
              Iniciar Sesión
            </button>
          )}
        </div>
      </header>

      <main className="container">
        {isAuthenticated ? (
          <div className="card">
            <div className="avatar">
              {currentUser?.name
                ? currentUser.name.charAt(0).toUpperCase()
                : "U"}
            </div>
            <h2>¡Bienvenido, {currentUser?.name || "Usuario"}!</h2>
            <p className="subtitle">Autenticado con Microsoft Entra ID</p>

            <div className="user-details">
              <div className="detail-item">
                <strong>Correo / Usuario:</strong>
                <span>{currentUser?.username}</span>
              </div>
              <div className="detail-item">
                <strong>Tenant ID:</strong>
                <code>{currentUser?.tenantId}</code>
              </div>
            </div>

            <hr style={{ margin: "1.5rem 0", borderColor: "#eee" }} />
            <ProtectedData />
          </div>
        ) : (
          <div className="card text-center">
            <h2>Acceso Requerido</h2>
            <p className="subtitle">
              Para ingresar al sistema debes validar tus credenciales
              corporativas o institucionales.
            </p>
            <button
              className="btn btn-login btn-lg"
              onClick={handleLogin}
              disabled={inProgress !== InteractionStatus.None}
            >
              {inProgress !== InteractionStatus.None
                ? "Cargando..."
                : "Iniciar Sesión con Microsoft"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
