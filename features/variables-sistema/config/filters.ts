import type { ListFilterDef } from "@/components/common/list-toolbar/filters";

export const variableFilterDefs: readonly ListFilterDef[] = [
  {
    type: "search",
    key: "search",
    placeholder: "Buscar variable...",
  },
  {
    type: "chips",
    key: "modulo",
    label: "Módulo",
    allValue: "todos",
    options: [
      { label: "Todos", value: "todos" },
      { label: "Seguridad", value: "seguridad" },
      { label: "Sesiones", value: "sesiones" },
      { label: "Supervisión", value: "supervision" },
      { label: "Aula Virtual", value: "aula_virtual" },
      { label: "Libretas", value: "libretas" },
      { label: "Jornada", value: "organizacion" },
      { label: "Consolidado", value: "consolidado" },
      { label: "Observación", value: "observacion" },
      { label: "Auditoría", value: "auditoria" },
      { label: "Convivencia", value: "convivencia" },
    ],
  },
] as const;
