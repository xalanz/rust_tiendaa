// src/useRoles.ts
import { useMsal } from '@azure/msal-react';

export type Role = 'Admin' | 'Operador' | 'Cliente' | 'Auditor';

const PRIORITY: Role[] = ['Admin', 'Operador', 'Cliente', 'Auditor'];

// Lee los roles del ID token de Entra ID.
// OJO: esto solo sirve para ajustar la interfaz. La seguridad real la aplica el
// backend, que valida el rol en cada petición.
export function useRoles() {
  const { accounts } = useMsal();
  const roles = (accounts[0]?.idTokenClaims?.roles as string[] | undefined) ?? [];

  const has = (...allowed: Role[]) => allowed.some((role) => roles.includes(role));
  const primary = PRIORITY.find((role) => roles.includes(role));

  return { roles, has, primary };
}
