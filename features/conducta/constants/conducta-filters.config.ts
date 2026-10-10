import type { ListFilterDef } from "@/components/common/list-toolbar";

export const GRAVEDAD_CONFIG = {
  leve: {
    label: "Falta Leve",
    badgeClass:
      "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  },
  grave: {
    label: "Falta Grave",
    badgeClass:
      "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  },
  muy_grave: {
    label: "Falta Muy Grave",
    badgeClass: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
  },
} as const;

export const TIPO_OBSERVACION_CONFIG = {
  academica: {
    label: "Académica",
    color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200",
  },
  conductual: {
    label: "Conductual",
    color: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200",
  },
  socioemocional: {
    label: "Socioemocional",
    color: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200",
  },
  salud: {
    label: "Salud",
    color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200",
  },
  familiar: {
    label: "Familiar",
    color: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-200",
  },
} as const;

export function createIncidenciasFilterDefs(): ListFilterDef[] {
  return [
    {
      type: "select",
      key: "tipo",
      label: "Tipo",
      options: [
        { value: "all", label: "Méritos y Faltas" },
        { value: "merito", label: "Méritos (+) " },
        { value: "falta", label: "Faltas (−)" },
      ],
      inline: true,
    },
    {
      type: "select",
      key: "gravedad",
      label: "Gravedad",
      options: [
        { value: "all", label: "Todas las gravedades" },
        { value: "leve", label: "Leve" },
        { value: "grave", label: "Grave" },
        { value: "muy_grave", label: "Muy Grave" },
      ],
      inline: true,
    },
  ];
}
