import type { ListFilterDef } from "@/components/common/list-toolbar";
import type { Bimestre } from "@/features/anio-escolar/types";

export function generarFiltroDefsConsolidados(
  bimestres: Bimestre[] = [],
): readonly ListFilterDef[] {
  const bimestresOptions = bimestres.map((b) => ({
    value: b.id,
    label: `Bimestre ${b.nombre}`,
  }));

  return [
    {
      type: "search",
      key: "search",
      placeholder: "Buscar docente por nombre o DNI...",
    },
    {
      type: "select",
      key: "periodoId",
      label: "Bimestre",
      placeholder: "Seleccionar bimestre",
      searchPlaceholder: "Buscar bimestre...",
      options: bimestresOptions,
      inline: true,
    },
    {
      type: "select",
      key: "estado",
      label: "Estado",
      placeholder: "Todos los estados",
      searchPlaceholder: "Filtrar por estado...",
      options: [
        { value: "cerrado", label: "Cerrado" },
        { value: "reabierto", label: "Reabierto" },
      ],
      inline: true,
    },
    {
      type: "select",
      key: "decision",
      label: "Decisión",
      placeholder: "Todas las decisiones",
      searchPlaceholder: "Filtrar por decisión...",
      options: [
        { value: "ninguna", label: "Conforme / Sin acción" },
        { value: "compromiso_mejora", label: "Compromiso de mejora" },
        { value: "llamada_atencion", label: "Llamada de atención" },
        { value: "derivado", label: "Derivado a UGEL" },
      ],
      inline: false,
    },
  ];
}
