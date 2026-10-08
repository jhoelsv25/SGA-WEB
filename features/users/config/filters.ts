import type { ListFilterDef } from "@/components/common/list-toolbar/filters";

export const userFilterDefs: readonly ListFilterDef[] = [
  {
    type: "search",
    key: "search",
    placeholder: "Buscar por nombre, apellido o usuario...",
  },
  {
    type: "select",
    key: "estado",
    label: "Estado",
    options: [
      { label: "Todos los estados", value: "all" },
      { label: "Activo", value: "activo" },
      { label: "Bloqueado", value: "bloqueado" },
      { label: "Inactivo", value: "inactivo" },
    ],
  },
] as const;
