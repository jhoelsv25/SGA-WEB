import type { EstadoObservacion, Nivel } from "../types";

export const MENU_OBSERVACIONES_AULA = "/admin/observaciones-aula";
export const MENU_MIS_OBSERVACIONES = "/admin/mis-observaciones";

export const ROL_ADMINISTRADOR = "Administrador";
export const ROL_DIRECTOR = "Director";

/** Marcador que deja el seed en los niveles cuyo texto oficial aún no se cargó (P-80). */
export const TEXTO_NIVEL_PENDIENTE = "Texto oficial pendiente de cargar desde el instructivo 2025.";

export const DURACION_HABITUAL = { min: 45, max: 90 } as const;

export const OBSERVACIONES_ENDPOINTS = {
  BASE: "/observaciones-aula",
  CRONOGRAMA: "/observaciones-aula/cronograma",
  SEGUIMIENTOS: "/observaciones-aula/seguimientos",
  MATRIZ: "/observaciones-aula/reporte/matriz",
  MATRIZ_EXCEL: "/observaciones-aula/reporte/matriz/excel",
  RESUMEN_CONSOLIDADO: "/observaciones-aula/resumen-consolidado",
  HISTORIAL: (docenteId: string) => `/observaciones-aula/historial/${docenteId}`,
  POR_ID: (id: string) => `/observaciones-aula/${id}`,
  REPROGRAMAR: (id: string) => `/observaciones-aula/${id}/reprogramar`,
  CANCELAR: (id: string) => `/observaciones-aula/${id}/cancelar`,
  REOBSERVACION: (id: string) => `/observaciones-aula/${id}/reobservacion`,
  INICIAR: (id: string) => `/observaciones-aula/${id}/iniciar`,
  NOTAS: (id: string) => `/observaciones-aula/${id}/notas`,
  NOTA: (id: string, notaId: string) => `/observaciones-aula/${id}/notas/${notaId}`,
  CERRAR_NOTAS: (id: string) => `/observaciones-aula/${id}/cerrar-notas`,
  FICHA: (id: string) => `/observaciones-aula/${id}/calificacion`,
  CALIFICAR: (id: string, desempeno: number) =>
    `/observaciones-aula/${id}/calificaciones/${desempeno}`,
  CORREGIR_CALIFICACION: (id: string, desempeno: number) =>
    `/observaciones-aula/${id}/calificaciones/${desempeno}/corregir`,
  CERRAR_CALIFICACION: (id: string) => `/observaciones-aula/${id}/cerrar-calificacion`,
  REUNION: (id: string) => `/observaciones-aula/${id}/reunion`,
  COMPROMISOS: (id: string) => `/observaciones-aula/${id}/compromisos`,
  CERRAR_RETRO: (id: string) => `/observaciones-aula/${id}/cerrar-retroalimentacion`,
  PROTOCOLO_PDF: (id: string) => `/observaciones-aula/${id}/protocolo/pdf`,
  ARCHIVO_FIRMADO: (id: string) => `/observaciones-aula/${id}/archivo-firmado`,
  CERRAR_COMPROMISO: (compromisoId: string) =>
    `/observaciones-aula/compromisos/${compromisoId}/cerrar`,
  INSTRUMENTOS: "/instrumentos-observacion",
  INSTRUMENTO_VIGENTE: "/instrumentos-observacion/vigente",
  INSTRUMENTO_MARCAR_VIGENTE: (id: string) => `/instrumentos-observacion/${id}/vigente`,
  MIS: "/mis-observaciones",
  MI: (id: string) => `/mis-observaciones/${id}`,
  MI_ENTERADO: (id: string) => `/mis-observaciones/${id}/enterado`,
  MI_COMENTARIO: (id: string) => `/mis-observaciones/${id}/comentario`,
} as const;

export const ESTADOS_OBSERVACION_CONFIG: Record<
  EstadoObservacion,
  { label: string; tone: "info" | "warning" | "brand" | "success" | "neutral" | "danger" }
> = {
  programada: { label: "Programada", tone: "info" },
  en_observacion: { label: "En observación", tone: "warning" },
  notas_cerradas: { label: "Notas cerradas", tone: "brand" },
  calificada: { label: "Calificada", tone: "brand" },
  retroalimentada: { label: "Retroalimentada", tone: "success" },
  cancelada: { label: "Cancelada", tone: "danger" },
};

export const OPCIONES_ESTADO = (Object.keys(ESTADOS_OBSERVACION_CONFIG) as EstadoObservacion[]).map(
  (estado) => ({ value: estado, label: ESTADOS_OBSERVACION_CONFIG[estado].label }),
);

export const NIVELES: ReadonlyArray<{ nivel: Nivel; romano: string; nombre: string }> = [
  { nivel: 1, romano: "I", nombre: "Muy deficiente" },
  { nivel: 2, romano: "II", nombre: "En proceso" },
  { nivel: 3, romano: "III", nombre: "Suficiente" },
  { nivel: 4, romano: "IV", nombre: "Destacado" },
];

export const NIVEL_ROMANO: Record<number, string> = { 1: "I", 2: "II", 3: "III", 4: "IV" };

export const ETIQUETA_EVOLUCION: Record<string, string> = {
  sube: "Sube",
  igual: "Se mantiene",
  baja: "Baja",
};

export const RESULTADOS_COMPROMISO = [
  { value: "cumplido", label: "Cumplido" },
  { value: "no_cumplido", label: "No cumplido" },
] as const;
