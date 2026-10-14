import * as React from "react";
import type { AusenciaResponseDto } from "../../types";
import { formatearMinutos } from "../../utils";

interface MisAusenciasResumenProps {
  ausencias: AusenciaResponseDto[];
}

function MetricaCard({
  etiqueta,
  valor,
  subtitulo,
}: {
  etiqueta: string;
  valor: string | number;
  subtitulo?: string;
}) {
  return (
    <div className="border-border/60 bg-card rounded-2xl border p-4 shadow-2xs">
      <p className="text-muted-foreground text-xs font-medium">{etiqueta}</p>
      <p className="text-foreground mt-1 text-2xl font-extrabold tabular-nums">{valor}</p>
      {subtitulo && <p className="text-2xs text-muted-foreground mt-0.5">{subtitulo}</p>}
    </div>
  );
}

/**
 * Resumen de indicadores clave sobre las ausencias vigentes del docente.
 */
export function MisAusenciasResumen({ ausencias }: MisAusenciasResumenProps) {
  const totalAusencias = ausencias.length;
  const minutosActivos = ausencias
    .filter((a) => !a.anulada)
    .reduce((acumulado, a) => acumulado + a.minutos, 0);
  const totalConDescargo = ausencias.filter((a) => a.descargo !== null).length;
  const totalAnuladas = ausencias.filter((a) => a.anulada).length;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <MetricaCard
        etiqueta="Ausencias registradas"
        valor={totalAusencias}
        subtitulo="En versión vigente"
      />
      <MetricaCard
        etiqueta="Minutos acumulados"
        valor={formatearMinutos(minutosActivos)}
        subtitulo="Excluye anuladas"
      />
      <MetricaCard
        etiqueta="Con descargo"
        valor={totalConDescargo}
        subtitulo="Versión presentada"
      />
      <MetricaCard
        etiqueta="Anuladas"
        valor={totalAnuladas}
        subtitulo="Sin efecto en consolidado"
      />
    </div>
  );
}
