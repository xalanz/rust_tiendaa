// src/useApi.ts
import { useMsal } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { loginRequest } from "./authConfig";

export function useApi() {
  const { instance, accounts } = useMsal();

  const fetchWithToken = async (url: string, options: RequestInit = {}) => {
    const account = accounts[0] || instance.getActiveAccount();
    if (!account) {
      throw new Error("No hay una cuenta activa");
    }

    // Solicitar token silenciosamente (sin redirigir al usuario)
    let accessToken: string;
    try {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account,
      });
      accessToken = response.accessToken;
    } catch (error) {
      // Si la sesión expiró, se redirige a Microsoft para renovarla
      if (error instanceof InteractionRequiredAuthError) {
        await instance.acquireTokenRedirect({ ...loginRequest, account });
        throw new Error("Renovando la sesión...");
      }
      throw error;
    }

    // Adjuntar token en el header Bearer (y Content-Type si se envía un body)
    return fetch(url, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };

  return { fetchWithToken };
}
