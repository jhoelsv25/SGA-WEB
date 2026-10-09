import type { ListFilterDef } from "@/components/common/list-toolbar/filters";

export const estudianteFilterDefs: readonly ListFilterDef[] = [
  {
    type: "search",
    key: "search",
    placeholder: "Buscar por código SIAGIE, DNI o apellidos del estudiante...",
  },
  {
    type: "select",
    key: "estado",
    label: "Estado",
    options: [
      { label: "Todos los estados", value: "all" },
      { label: "Activo", value: "activo" },
      { label: "Retirado", value: "retirado" },
      { label: "Trasladado", value: "trasladado" },
      { label: "Egresado", value: "egresado" },
    ],
  },
] as const;
