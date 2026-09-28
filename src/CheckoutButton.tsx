// src/CheckoutButton.tsx
import { useState } from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import { useApi } from "./useApi";
import "./orders.css";

type CartItem = { id?: string; name: string; price: number; quantity: number };

export function CheckoutButton({
  cart,
  onSuccess,
}: {
  cart: CartItem[];
  onSuccess: () => void;
}) {
  const isAuthenticated = useIsAuthenticated();
  const { fetchWithToken } = useApi();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    if (!isAuthenticated) {
      window.location.hash = "#/login";
      return;
    }

    if (cart.some((item) => !item.id)) {
      setMessage({ type: "error", text: "Hay productos sin identificador. Vacía el carrito y agrégalos de nuevo." });
      return;
    }

    setBusy(true);
    setMessage(null);
    try {
      // Solo se envían productId y cantidad: el precio lo calcula el servidor.
      const res = await fetchWithToken(`${import.meta.env.VITE_API_URL}/orders`, {
        method: "POST",
        body: JSON.stringify({
          items: cart.map((item) => ({ productId: item.id, quantity: item.quantity })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Error ${res.status}`);

      onSuccess();
      setMessage({ type: "ok", text: `Pedido #${data.orderId.slice(-8).toUpperCase()} creado.` });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "No se pudo crear el pedido" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        className="checkout-button"
        type="button"
        onClick={handleCheckout}
        disabled={busy || cart.length === 0}
      >
        {busy ? "Procesando..." : "Finalizar compra"}
      </button>
      {message && (
        <p className={`checkout-message ${message.type}`}>
          {message.text}{" "}
          {message.type === "ok" && <a href="#/pedidos">Ver mis pedidos</a>}
        </p>
      )}
    </>
  );
}
