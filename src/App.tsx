// src/App.tsx
import { useEffect, useState, type ReactNode } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { loginRequest } from "./authConfig";
import { ProtectedData } from "./ProtectedData";
import { CheckoutButton } from "./CheckoutButton";
import { renderPrivateRoute } from "./privateRoutes";
import Pedidos from "./page/Pedidos";
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

function CatalogLayout({
  children,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onClearCart,
}: {
  children: ReactNode;
  cart: Array<{ name: string; price: number; quantity: number }>;
  onAddToCart: (product: { name: string; price: number }) => void;
  onRemoveFromCart: (name: string) => void;
  onClearCart: () => void;
}) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="home-page catalog-layout">
      <BarraSuperior />
      <div className="catalog-shell">
        <main>{children}</main>
        <aside className="cart-panel">
          <div className="cart-header">
            <h3>Carrito</h3>
            <span>{cart.reduce((sum, item) => sum + item.quantity, 0)} items</span>
          </div>

          {cart.length === 0 ? (
            <p className="cart-empty">Tu carrito está vacío.</p>
          ) : (
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.name} className="cart-item">
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.quantity} x ${item.price.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="cart-item-actions">
                    <span>${(item.price * item.quantity).toLocaleString('es-AR')}</span>
                    <div className="cart-control-row">
                      <button type="button" className="qty-button" onClick={() => onRemoveFromCart(item.name)}>-</button>
                      <span className="qty-label">{item.quantity}</span>
                      <button type="button" className="qty-button" onClick={() => onAddToCart(item)}>+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="cart-total">
            <span>Total</span>
            <strong>${total.toLocaleString('es-AR')}</strong>
          </div>
          {cart.length > 0 && (
            <button type="button" className="clear-cart-button" onClick={onClearCart}>
              Vaciar carrito
            </button>
          )}
          <CheckoutButton cart={cart} onSuccess={onClearCart} />
        </aside>
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const currentUser = accounts[0];
  const [route, setRoute] = useState(getRoute);
  const [cart, setCart] = useState<Array<{ name: string; price: number; quantity: number }>>([]);

  const addToCart = (product: { name: string; price: number }) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.name === product.name);

      if (existingItem) {
        return currentCart.map((item) =>
          item.name === product.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (name: string) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.name === name
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

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

  const privatePage = renderPrivateRoute(route);
  if (privatePage) return privatePage;
  
  if (route === "armas") {
    return (
      <CatalogLayout
        cart={cart}
        onAddToCart={addToCart}
        onRemoveFromCart={removeFromCart}
        onClearCart={clearCart}
      >
        <Armas onAddToCart={addToCart} />
      </CatalogLayout>
    );
  }

  if (route === "ropa") {
    return (
      <CatalogLayout
        cart={cart}
        onAddToCart={addToCart}
        onRemoveFromCart={removeFromCart}
        onClearCart={clearCart}
      >
        <Ropa onAddToCart={addToCart} />
      </CatalogLayout>
    );
  }

  if (route === "herramientas") {
    return (
      <CatalogLayout
        cart={cart}
        onAddToCart={addToCart}
        onRemoveFromCart={removeFromCart}
        onClearCart={clearCart}
      >
        <Herramientas onAddToCart={addToCart} />
      </CatalogLayout>
    );
  }

  if (route === "pedidos") { 
    return (
    <div className="home-page">
      <BarraSuperior /><main className="container"><Pedidos /></main><Footer />
    </div>
  ); }

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
