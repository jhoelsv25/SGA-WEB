import type { ListFilterDef } from "@/components/common/list-toolbar";
import type { Bimestre } from "@/features/anio-escolar/types";

/**
 * Genera las definiciones de filtros para la barra de herramientas de la bandeja
 * de solicitudes de revisión del Director. Sincronizada al 100 % con la URL.
 */
export function generarFiltroDefsSolicitudes(bimestres: Bimestre[] = []): readonly ListFilterDef[] {
  const bimestresOptions = bimestres.map((b) => ({
    value: b.id,
    label: `Bimestre ${b.nombre}`,
  }));

  const estadosOptions = [
    { value: "solicitada", label: "Pendientes (Solicitadas)" },
    { value: "aceptada", label: "Aceptadas" },
    { value: "rechazada", label: "Rechazadas" },
  ];

  return [
    {
      type: "search",
      key: "search",
      placeholder: "Buscar por docente, documento o motivo...",
    },
    {
      type: "select",
      key: "estado",
      label: "Estado",
      placeholder: "Todos los estados",
      searchPlaceholder: "Filtrar por estado...",
      options: estadosOptions,
      inline: true,
    },
    {
      type: "select",
      key: "periodoId",
      label: "Bimestre",
      placeholder: "Todos los bimestres",
      searchPlaceholder: "Buscar bimestre...",
      options: bimestresOptions,
      inline: true,
    },
  ];
}
