import type { ListFilterDef } from "@/components/common/list-toolbar/filters";

export const docenteFilterDefs: readonly ListFilterDef[] = [
  {
    type: "search",
    key: "search",
    placeholder: "Buscar por código, DNI o apellidos del docente...",
  },
  {
    type: "select",
    key: "tipoContrato",
    label: "Régimen Contrato",
    options: [
      { label: "Todos los contratos", value: "all" },
      { label: "Nombrado", value: "nombrado" },
      { label: "Contratado", value: "contratado" },
      { label: "Destacado", value: "destacado" },
      { label: "Encargado", value: "encargado" },
      { label: "Practicante", value: "practicante" },
    ],
  },
  {
    type: "select",
    key: "estado",
    label: "Estado",
    options: [
      { label: "Todos los estados", value: "all" },
      { label: "Activo", value: "activo" },
      { label: "Licencia", value: "licencia" },
      { label: "Cesado", value: "cesado" },
    ],
  },
] as const;
