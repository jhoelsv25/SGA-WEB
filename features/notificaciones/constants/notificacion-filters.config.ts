import type { ListFilterDef } from "@/components/common/list-toolbar";

export function createNotificacionFilterDefs(): ListFilterDef[] {
  return [
    {
      type: "search",
      key: "search",
      placeholder: "Buscar por título o contenido...",
    },
    {
      type: "select",
      key: "estado",
      label: "Estado",
      options: [
        { value: "all", label: "Todos los estados" },
        { value: "no_leidas", label: "Sin leer" },
        { value: "leidas", label: "Leídas" },
      ],
      inline: true,
    },
    {
      type: "select",
      key: "tipo",
      label: "Tipo",
      options: [
        { value: "all", label: "Todos los tipos" },
        { value: "informacion", label: "Información" },
        { value: "alerta", label: "Alertas" },
        { value: "recordatorio", label: "Recordatorios" },
      ],
      inline: true,
    },
  ];
}
