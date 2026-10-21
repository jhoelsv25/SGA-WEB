import type { Indicador, MetadataIndicador } from "../types";

export const INDICADORES = ["CSP", "ISA", "IGM"] as const;
export const INDICADORES_LISTA: readonly Indicador[] = ["CSP", "ISA", "IGM"] as const;

export const METADATA_INDICADORES: Record<Indicador, MetadataIndicador> = {
  CSP: {
    codigo: "CSP",
    nombre: "Cumplimiento de sesiones planificadas",
    dimension: "Prácticas pedagógicas",
    fuente: "Sesiones de clase",
    formula: "(cumplidas + parciales) ÷ (planificadas − justificadas) × 100",
  },
  ISA: {
    codigo: "ISA",
    nombre: "Informes de seguimiento académico",
    dimension: "Seguimiento académico",
    fuente: "Libretas",
    formula: "libretas publicadas a tiempo ÷ libretas programadas × 100",
  },
  IGM: {
    codigo: "IGM",
    nombre: "Gestión de materiales",
    dimension: "Aula virtual",
    fuente: "Materiales del aula virtual",
    formula: "materiales planificados publicados a tiempo ÷ materiales planificados × 100",
  },
} as const;

export const DIMENSIONES_INDICADORES: Record<Indicador, string> = {
  CSP: "Prácticas pedagógicas",
  ISA: "Seguimiento académico",
  IGM: "Aula virtual",
};

export const NOMBRES_INDICADORES: Record<Indicador, string> = {
  CSP: "Cumplimiento de sesiones planificadas",
  ISA: "Informes de seguimiento académico",
  IGM: "Gestión de materiales",
};

export const FORMULAS_INDICADORES: Record<Indicador, string> = {
  CSP: "(cumplidas + parciales) ÷ (planificadas − justificadas) × 100",
  ISA: "libretas publicadas a tiempo ÷ libretas programadas × 100",
  IGM: "materiales planificados publicados a tiempo ÷ materiales planificados × 100",
};

export const FUENTES_INDICADORES: Record<Indicador, string> = {
  CSP: "Sesiones de clase",
  ISA: "Libretas",
  IGM: "Materiales del aula virtual",
};
