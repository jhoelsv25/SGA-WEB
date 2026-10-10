import type { ListFilterDef } from "@/components/common/list-toolbar";

export function createComunicadoFilterDefs(): ListFilterDef[] {
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
        { value: "publicado", label: "Publicados" },
        { value: "borrador", label: "Borradores" },
        { value: "archivado", label: "Archivados" },
      ],
      inline: true,
    },
    {
      type: "select",
      key: "dirigidoA",
      label: "Público",
      options: [
        { value: "all", label: "Todo el público" },
        { value: "todos", label: "Toda la comunidad" },
        { value: "docentes", label: "Docentes" },
        { value: "estudiantes", label: "Estudiantes" },
        { value: "apoderados", label: "Apoderados" },
      ],
      inline: true,
    },
    {
      type: "select",
      key: "prioridad",
      label: "Prioridad",
      options: [
        { value: "all", label: "Todas las prioridades" },
        { value: "normal", label: "Normal" },
        { value: "importante", label: "Importante" },
        { value: "urgente", label: "Urgente" },
      ],
      inline: false, // Filtro secundario agrupado en Popover según reglas del proyecto
    },
  ];
}
