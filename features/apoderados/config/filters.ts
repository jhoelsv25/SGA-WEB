import type { ListFilterDef } from "@/components/common/list-toolbar/filters";

export const apoderadoFilterDefs: readonly ListFilterDef[] = [
  {
    type: "search",
    key: "search",
    placeholder: "Buscar por DNI, nombres, apellidos, teléfono u ocupación...",
  },
  {
    type: "select",
    key: "gradoInstruccion",
    label: "Instrucción",
    options: [
      { label: "Todos los niveles", value: "all" },
      { label: "Universitaria", value: "universitaria" },
      { label: "Técnica", value: "tecnica" },
      { label: "Secundaria", value: "secundaria" },
      { label: "Primaria", value: "primaria" },
      { label: "Posgrado", value: "posgrado" },
      { label: "Sin estudios", value: "sin_estudios" },
    ],
  },
] as const;
