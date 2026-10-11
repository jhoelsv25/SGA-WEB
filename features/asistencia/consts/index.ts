import type { EstadoAsistencia, EstadoMarcableDocente } from "../types";

export const MENU_ASISTENCIA_CLASE = "/admin/asistencia";
export const MENU_ASISTENCIA_SECCION = "/admin/asistencia-seccion";
export const MENU_MI_ASISTENCIA = "/admin/mi-asistencia";

export const ESTADOS_ASISTENCIA_CONFIG: Record<
  EstadoAsistencia,
  { label: string; tone: "success" | "warning" | "danger" | "info" }
> = {
  presente: { label: "Presente", tone: "success" },
  tardanza: { label: "Tardanza", tone: "warning" },
  falta: { label: "Falta", tone: "danger" },
  falta_justificada: { label: "Falta justificada", tone: "info" },
};

export const OPCIONES_DOCENTE: { value: EstadoMarcableDocente; label: string }[] = [
  { value: "presente", label: "Presente" },
  { value: "tardanza", label: "Tardanza" },
  { value: "falta", label: "Falta" },
];
