import type { LoginFormValues } from "../schemas/login.schema";

export const AUTH_STORAGE_KEYS = {
  REMEMBERED_USERNAME: "sga_remembered_username",
} as const;

/**
 * Obtiene el nombre de usuario previamente recordado en localStorage de forma segura.
 */
export function getRememberedUsername(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(AUTH_STORAGE_KEYS.REMEMBERED_USERNAME) ?? "";
  } catch {
    // Entornos con restricciones de cookies/storage (p.ej. iframe sandboxed o navegación privada estricta)
    return "";
  }
}

/**
 * Persiste o elimina el nombre de usuario en localStorage según la preferencia del usuario.
 */
export function saveRememberedUsername(username: string, remember: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (remember && username.trim()) {
      localStorage.setItem(AUTH_STORAGE_KEYS.REMEMBERED_USERNAME, username.trim());
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEYS.REMEMBERED_USERNAME);
    }
  } catch {
    // Ignorar si el almacenamiento local está restringido o lleno
  }
}

/**
 * Genera los valores iniciales para el formulario de login considerando el usuario guardado.
 */
export function getInitialLoginValues(): LoginFormValues {
  const saved = getRememberedUsername();
  return {
    username: saved,
    password: "",
    rememberUser: Boolean(saved),
  };
}
