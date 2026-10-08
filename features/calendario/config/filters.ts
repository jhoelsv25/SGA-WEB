import type { ListFilterDef } from "@/components/common/list-toolbar/filters";
import { ETIQUETAS_EVENTO } from "../consts";
import { TIPOS_EVENTO } from "../types";

export const calendarioFilterDefs: readonly ListFilterDef[] = [
  {
    type: "search",
    key: "q",
    placeholder: "Buscar por título del evento...",
  },
  {
    type: "select",
    key: "tipo",
    label: "Tipo",
    options: [
      { label: "Todos los tipos", value: "all" },
      ...TIPOS_EVENTO.map((tipo) => ({ label: ETIQUETAS_EVENTO[tipo], value: tipo })),
    ],
  },
  {
    type: "select",
    key: "clases",
    label: "Clases",
    options: [
      { label: "Con y sin clases", value: "all" },
      { label: "Suspende clases", value: "si" },
      { label: "No suspende clases", value: "no" },
    ],
  },
];
