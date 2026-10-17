import type { SelectOptionItem } from "@/components/common/select";
import type { DirigidoA, EstadoComunicado, PrioridadComunicado } from "../types";

export interface EstadoVisualConfig {
  label: string;
  badgeClass: string;
}

export const COMUNICADO_ESTADO_CONFIG: Record<EstadoComunicado, EstadoVisualConfig> = {
  borrador: {
    label: "Borrador",
    badgeClass: "bg-muted text-muted-foreground border-border",
  },
  publicado: {
    label: "Publicado",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  archivado: {
    label: "Archivado",
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
};

export interface PrioridadVisualConfig {
  label: string;
  badgeClass: string;
}

export const COMUNICADO_PRIORIDAD_CONFIG: Record<PrioridadComunicado, PrioridadVisualConfig> = {
  normal: {
    label: "Normal",
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  importante: {
    label: "Importante",
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  urgente: {
    label: "Urgente",
    badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 font-semibold",
  },
};

export const COMUNICADO_DIRIGIDO_LABELS: Record<DirigidoA, string> = {
  todos: "Toda la comunidad",
  docentes: "Solo Docentes",
  estudiantes: "Solo Estudiantes",
  apoderados: "Solo Apoderados",
};

export const OPCIONES_DIRIGIDO_A: SelectOptionItem<DirigidoA>[] = [
  { value: "todos", label: "Toda la comunidad" },
  { value: "docentes", label: "Solo Docentes" },
  { value: "estudiantes", label: "Solo Estudiantes" },
  { value: "apoderados", label: "Solo Apoderados" },
];

export const OPCIONES_PRIORIDAD: SelectOptionItem<PrioridadComunicado>[] = [
  { value: "normal", label: "Normal" },
  { value: "importante", label: "Importante" },
  { value: "urgente", label: "Urgente" },
];

export const COMUNICADOS_ENDPOINTS = {
  BASE: "/comunicados",
  POR_ID: (id: string) => `/comunicados/${id}`,
  PUBLICAR: (id: string) => `/comunicados/${id}/publicar`,
  ARCHIVAR: (id: string) => `/comunicados/${id}/archivar`,
  LECTURA: (id: string) => `/comunicados/${id}/lectura`,
  AVANCE_LECTURA: (id: string) => `/comunicados/${id}/avance-lectura`,
} as const;
