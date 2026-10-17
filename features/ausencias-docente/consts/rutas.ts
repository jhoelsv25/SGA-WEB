export const AUSENCIAS_ENDPOINTS = {
  BASE: "/ausencias-docente",
  POR_ID: (id: string) => `/ausencias-docente/${id}`,
  ANULAR: (id: string) => `/ausencias-docente/${id}/anular`,
  HISTORIAL: (id: string) => `/ausencias-docente/${id}/historial`,
  MIS_AUSENCIAS: "/ausencias-docente/mis-ausencias",
  DETALLE_DOCENTE: (id: string) => `/ausencias-docente/mis-ausencias/${id}`,
  DESCARGO: (id: string) => `/ausencias-docente/mis-ausencias/${id}/descargo`,
} as const;
