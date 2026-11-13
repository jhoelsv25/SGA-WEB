"use client";

import { formatDate } from "@/lib/formatters/date";
import { useResumenConsolidado } from "../hooks";

/**
 * Resumen de solo lectura de la última observación retroalimentada del bimestre (RF-013).
 * No cambia los totales ni la decisión. Sin observación o sin permiso, no muestra nada.
 */
export function ResumenObservacionConsolidado({
  docenteId,
  periodoId,
}: {
  docenteId: string;
  periodoId: string;
}) {
  const { data } = useResumenConsolidado(docenteId, periodoId);
  const observacion = data?.observacion;
  if (!observacion) return null;
  const niveles = [...observacion.niveles].sort((a, b) => a.desempeno - b.desempeno);
  return (
    <section
      aria-label="Última observación de aula del bimestre"
      className="border-border/60 bg-muted/30 rounded-xl border p-3 text-xs"
    >
      <p className="text-foreground mb-1 font-semibold">
        Observación de aula del {formatDate(observacion.fecha)}
      </p>
      <ul className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
        {niveles.map((n) => (
          <li key={n.desempeno}>
            D{n.desempeno}: nivel {n.nivelRomano}
          </li>
        ))}
      </ul>
    </section>
  );
}
