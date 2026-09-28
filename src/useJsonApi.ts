// src/useJsonApi.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import { useApi } from './useApi';

// Llama a la API con el token, interpreta el JSON y lanza un Error con el mensaje
// del servidor cuando la respuesta no es exitosa.
export function useJsonApi() {
  const { fetchWithToken } = useApi();

  // Se guarda la última versión de fetchWithToken en una referencia para que
  // "request" sea estable y no dispare efectos en cada render.
  const latest = useRef(fetchWithToken);
  useEffect(() => {
    latest.current = fetchWithToken;
  });

  return useCallback(async <T>(path: string, options: RequestInit = {}): Promise<T> => {
    const res = await latest.current(`${import.meta.env.VITE_API_URL}${path}`, options);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data as { error?: string }).error || `Error ${res.status}`);
    return data as T;
  }, []);
}

// Carga un recurso GET al montar la página (y cada vez que cambia la ruta o se recarga).
// Pasa null para no cargar nada todavía. Mientras se recarga se conservan los datos
// anteriores, así la pantalla no parpadea.
export function useLoad<T>(path: string | null) {
  const request = useJsonApi();
  const [tick, setTick] = useState(0);
  const [state, setState] = useState<{ key: string | null; data: T | null; error: string | null }>({
    key: null,
    data: null,
    error: null,
  });

  // Identifica la petición actual; si no coincide con la última respuesta, sigue cargando
  const key = `${path}|${tick}`;

  useEffect(() => {
    if (path === null) return;
    let cancelled = false;

    request<T>(path)
      .then((res) => {
        if (!cancelled) setState({ key, data: res, error: null });
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setState((prev) => ({ key, data: prev.data, error: err.message || 'No se pudieron cargar los datos' }));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [path, request, key]);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  return {
    data: state.data,
    loading: path !== null && state.key !== key,
    error: state.key === key ? state.error : null,
    reload,
  };
}
