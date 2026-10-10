import type { ListFilterDef } from "@/components/common/list-toolbar";

export function createMatriculaFilterDefs(
  grados: { id: string; numero: number }[] = [],
  secciones: { id: string; gradoNumero: number; nombre: string }[] = [],
): ListFilterDef[] {
  return [
    {
      type: "search",
      key: "search",
      placeholder: "Buscar por estudiante, DNI o código...",
    },
    {
      type: "select",
      key: "gradoId",
      label: "Grado",
      options: [
        { value: "all", label: "Todos los grados" },
        ...grados.map((g) => ({
          value: g.id,
          label: `${g.numero}.° Secundaria`,
        })),
      ],
    },
    {
      type: "select",
      key: "seccionId",
      label: "Sección",
      options: [
        { value: "all", label: "Todas las secciones" },
        ...secciones.map((s) => ({
          value: s.id,
          label: `${s.gradoNumero}.° ${s.nombre}`,
        })),
      ],
    },
    {
      type: "select",
      key: "tipo",
      label: "Tipo",
      options: [
        { value: "all", label: "Todos los tipos" },
        { value: "nuevo", label: "Nuevo ingreso" },
        { value: "continuador", label: "Continuador" },
        { value: "traslado", label: "Traslado" },
      ],
      // Se agrupa en Popover de overflow para mantener la barra limpia
      inline: false,
    },
    {
      type: "select",
      key: "estado",
      label: "Estado",
      options: [
        { value: "all", label: "Todos los estados" },
        { value: "matriculado", label: "Matriculado" },
        { value: "retirado", label: "Retirado" },
        { value: "traslado", label: "Trasladado" },
        { value: "culminado", label: "Culminado" },
      ],
      // Se agrupa en Popover de overflow para mantener la barra limpia
      inline: false,
    },
  ];
}
