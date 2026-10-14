import type { ListFilterDef } from "@/components/common/list-toolbar";
import type { Bimestre } from "@/features/anio-escolar/types";
import type { Docente } from "@/features/docentes/types/docentes.types";

/**
 * Genera la configuración de filtros para la barra de herramientas de supervisión.
 */
export function generarFiltroDefsSupervision(
  bimestres: Bimestre[] = [],
  docentes: Docente[] = [],
): readonly ListFilterDef[] {
  const bimestresOptions = bimestres.map((b) => ({
    value: b.id,
    label: `Bimestre ${b.nombre}`,
  }));

  const docenteOptions = docentes.map((d) => ({
    value: d.id,
    label: d.persona.nombreCompleto,
    description: d.codigo,
  }));

  return [
    {
      type: "search",
      key: "search",
      placeholder: "Buscar por curso, sección o detalle...",
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
    {
      type: "select",
      key: "docenteId",
      label: "Docente",
      placeholder: "Todos los docentes",
      searchPlaceholder: "Buscar docente...",
      options: docenteOptions,
      inline: true,
    },
    {
      type: "dateRange",
      fromKey: "fechaDesde",
      toKey: "fechaHasta",
      label: "Rango de fechas",
      fromPlaceholder: "Desde",
      toPlaceholder: "Hasta",
      inline: false,
    },
  ];
}
