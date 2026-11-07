import type { ListFilterDef } from "@/components/common/list-toolbar/filters";

export const personaFilterDefs: readonly ListFilterDef[] = [
  {
    type: "search",
    key: "search",
    placeholder: "Buscar por DNI, nombres o apellidos...",
  },
  {
    type: "select",
    key: "tipoDocumento",
    inline: false,
    label: "Tipo Documento",
    options: [
      { label: "Todos los tipos", value: "all" },
      { label: "DNI", value: "dni" },
      { label: "Carné Extranjería", value: "carne_extranjeria" },
      { label: "Pasaporte", value: "pasaporte" },
      { label: "Partida Nacimiento", value: "partida_nacimiento" },
    ],
  },
  {
    type: "select",
    key: "provisional",
    inline: false,
    label: "Ficha Vinculada",
    options: [
      { label: "Todas las personas", value: "all" },
      { label: "Solo provisionales", value: "si" },
      { label: "Con ficha activa", value: "no" },
    ],
  },
] as const;
