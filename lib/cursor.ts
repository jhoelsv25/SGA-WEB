/**
 * Utilidad para codificar y decodificar cursores de paginación en base64 de forma segura.
 */

export interface DefaultCursorPayload {
  created_at: string;
  id: string;
}

export function encodeCursor<T = DefaultCursorPayload>(
  payload: T | null | undefined,
): string | null {
  if (!payload) return null;
  try {
    const json = JSON.stringify(payload);
    if (typeof window !== "undefined" && typeof window.btoa === "function") {
      return window.btoa(json);
    }
    return Buffer.from(json, "utf8").toString("base64");
  } catch (error) {
    console.error("Error al codificar cursor:", error);
    return null;
  }
}

export function decodeCursor<T = DefaultCursorPayload>(cursor?: string | null): T | null {
  if (!cursor || typeof cursor !== "string" || !cursor.trim()) {
    return null;
  }
  try {
    let json = "";
    if (typeof window !== "undefined" && typeof window.atob === "function") {
      json = window.atob(cursor);
    } else {
      json = Buffer.from(cursor, "base64").toString("utf8");
    }
    return JSON.parse(json) as T;
  } catch (error) {
    console.error("Error al decodificar cursor:", error);
    return null;
  }
}
