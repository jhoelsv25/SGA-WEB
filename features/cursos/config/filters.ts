import type { ListFilterDef } from "@/components/common/list-toolbar/filters";
import { AREA_CURRICULAR_OPTIONS } from "../consts";

export const cursoFilterDefs: readonly ListFilterDef[] = [
  {
    type: "search",
    key: "search",
    placeholder: "Buscar por código o nombre del curso...",
  },
  {
    type: "select",
    key: "areaCurricular",
    label: "Área Curricular",
    options: [
      { label: "Todas las áreas", value: "all" },
      ...AREA_CURRICULAR_OPTIONS.map((a) => ({
        label: a.label,
        value: a.value,
      })),
    ],
  },
  {
    type: "select",
    key: "estado",
    label: "Estado",
    options: [
      { label: "Todos los estados", value: "all" },
      { label: "Activos", value: "activo" },
      { label: "Inactivos", value: "inactivo" },
    ],
  },
] as const;
