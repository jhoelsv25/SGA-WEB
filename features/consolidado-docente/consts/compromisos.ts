import type { EstadoCompromiso, TipoPendiente } from "../types";

export const COMPROMISOS_ENDPOINTS = {
  BASE: "/compromisos-consolidado",
  POR_ID: (id: string) => `/compromisos-consolidado/${id}`,
  CERRAR: (id: string) => `/compromisos-consolidado/${id}/cerrar`,
  REPROGRAMAR: (id: string) => `/compromisos-consolidado/${id}/reprogramar`,
  ANULAR: (id: string) => `/compromisos-consolidado/${id}/anular`,
  ENTERADO: (id: string) => `/compromisos-consolidado/${id}/enterado`,
} as const;

export const SEGUIMIENTO_REPORTES_ENDPOINTS = {
  PENDIENTES: "/seguimiento-docente/pendientes",
  PENDIENTES_EXCEL: "/seguimiento-docente/pendientes/exportar/excel",
  INFORME_MENSUAL_EXCEL: "/seguimiento-docente/informe-mensual/excel",
} as const;

/** Decisiones del consolidado que admiten compromisos (el backend lo valida también). */
export const DECISIONES_CON_COMPROMISO = ["compromiso_mejora", "llamada_atencion"] as const;

export const ESTADOS_COMPROMISO_CONFIG: Record<
  EstadoCompromiso,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    className?: string;
  }
> = {
  pendiente: { label: "Pendiente", variant: "secondary" },
  cumplido: {
    label: "Cumplido",
    variant: "outline",
    className: "border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
  },
  no_cumplido: { label: "No cumplido", variant: "destructive" },
};

export const OPCIONES_RESULTADO_COMPROMISO = [
  { value: "cumplido", label: "Cumplido" },
  { value: "no_cumplido", label: "No cumplido" },
] as const;

/** Orden en que se muestran los conteos de los pendientes de seguimiento. */
export const TIPOS_PENDIENTE_ORDEN: readonly TipoPendiente[] = [
  "justificacion_sin_resolver",
  "descargo_vencido",
  "consolidado_sin_generar",
  "consolidado_sin_decision",
  "solicitud_revision_abierta",
  "compromiso_vencido",
];

export const ETIQUETAS_PENDIENTE: Record<TipoPendiente, string> = {
  justificacion_sin_resolver: "Justificación sin resolver",
  descargo_vencido: "Ausencia con descargo vencido",
  consolidado_sin_generar: "Consolidado sin generar",
  consolidado_sin_decision: "Consolidado sin decisión",
  solicitud_revision_abierta: "Solicitud de revisión abierta",
  compromiso_vencido: "Compromiso vencido",
};
