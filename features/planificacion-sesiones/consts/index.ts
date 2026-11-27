export const MENU_PLANIFICACION_SESIONES = "/admin/planificacion-sesiones";
export const MENU_CATALOGO_CURRICULAR = "/admin/catalogo-curricular";

export const MOMENTOS = [
  {
    codigo: "inicio",
    nombre: "Inicio",
    ayuda: "Motivación, saberes previos y propósito.",
    ejemplo:
      "Ej.: Saludo, pregunta motivadora, recojo de saberes previos y presentación del propósito.",
  },
  {
    codigo: "desarrollo",
    nombre: "Desarrollo",
    ayuda: "Estrategias y proceso didáctico (teoría, ejercicios).",
    ejemplo: "Ej.: Explicación con ejemplos en la pizarra, práctica guiada y trabajo en parejas.",
  },
  {
    codigo: "cierre",
    nombre: "Cierre",
    ayuda: "Metacognición y evaluación.",
    ejemplo: "Ej.: Preguntas de reflexión (¿qué aprendí?, ¿cómo lo aprendí?) y ficha de salida.",
  },
] as const;

export const ESTADOS_PLANIFICACION = {
  sin_planificar: { etiqueta: "Sin planificar", tono: "neutral" },
  borrador: { etiqueta: "Borrador", tono: "warning" },
  lista: { etiqueta: "Lista", tono: "success" },
  ejecutada: { etiqueta: "Ejecutada", tono: "info" },
} as const;

export const PLANIFICACION_ENDPOINTS = {
  BASE: "/planificacion-sesiones",
  SEMANA: "/planificacion-sesiones/semana",
  HISTORIAL: "/planificacion-sesiones/historial",
  SUPERVISION_HISTORIAL: "/supervision-planificaciones/historial",
  POR_ID: (id: string) => `/planificacion-sesiones/${id}`,
  LISTA: (id: string) => `/planificacion-sesiones/${id}/lista`,
  COPIAR: (id: string) => `/planificacion-sesiones/${id}/copiar`,
  DOCUMENTO: (id: string) => `/planificacion-sesiones/${id}/documento`,
  PDF: (id: string) => `/planificacion-sesiones/${id}/documento.pdf`,
  DOCX: (id: string) => `/planificacion-sesiones/${id}/documento.docx`,
  AREAS: "/catalogo-curricular/areas",
  COMPETENCIAS: "/catalogo-curricular/competencias",
  DESEMPENOS: (competenciaId: string) =>
    `/catalogo-curricular/competencias/${competenciaId}/desempenos`,
  DESEMPENO: (id: string) => `/catalogo-curricular/desempenos/${id}`,
  DESEMPENOS_BASE: "/catalogo-curricular/desempenos",
  ENFOQUES: "/catalogo-curricular/enfoques",
  OPCIONES: "/catalogo-curricular/opciones",
  SUPERVISION: "/supervision-planificaciones",
  SUPERVISION_DETALLE: (id: string) => `/supervision-planificaciones/${id}`,
  COMENTARIOS: (id: string) => `/supervision-planificaciones/${id}/comentarios`,
  HORAS_REALES: (sesionId: string) =>
    `/supervision-planificaciones/sesiones/${sesionId}/horas-reales`,
} as const;
export * from "./documento-sesion";
