import type { StatusBadgeTone } from "@/components/common/status-badge";

export interface AuditActionMeta {
  label: string;
  tone: StatusBadgeTone;
}

/**
 * Mapa de configuración de acciones de auditoría según su naturaleza semántica:
 * - Crear: success
 * - Actualizar: info
 * - Eliminar: danger
 * - Acceso / Autenticación: brand
 * - Otros: neutral
 */
export const AUDIT_ACTION_MAP: Record<string, AuditActionMeta> = {
  crear: {
    label: "Crear",
    tone: "success",
  },
  actualizar: {
    label: "Actualizar",
    tone: "info",
  },
  eliminar: {
    label: "Eliminar",
    tone: "danger",
  },
  iniciar_sesion: {
    label: "Inicio de sesión",
    tone: "brand",
  },
  cerrar_sesion: {
    label: "Cierre de sesión",
    tone: "brand",
  },
};

/**
 * Obtiene la configuración de presentación (tono y etiqueta) de una acción de auditoría.
 */
export function getAuditActionMeta(action?: string | null): AuditActionMeta {
  if (!action) {
    return {
      label: "Desconocido",
      tone: "neutral",
    };
  }

  const key = action.toLowerCase().trim();
  const directMatch = AUDIT_ACTION_MAP[key];
  if (directMatch) {
    return directMatch;
  }

  // Acciones de autenticación o control de acceso
  if (key.includes("sesion") || key.includes("login") || key.includes("acceso")) {
    return {
      label: action.replace(/_/g, " "),
      tone: "brand",
    };
  }

  // Cualquier otra acción administrativa o de catálogo
  return {
    label: action.replace(/_/g, " "),
    tone: "neutral",
  };
}
