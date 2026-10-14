"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon, Cancel01Icon, Clock01Icon } from "@hugeicons/core-free-icons";
import { formatearMinutos } from "@/features/ausencias-docente/utils";

interface AusenciasMetricasProps {
  totalMinutos: number;
  totalAusencias: number;
  totalAnuladas: number;
}

/**
 * Tarjetas de métricas consolidadas del listado de ausencias docentes (RF-012 HU4).
 * Muestra el total de minutos devuelto por el servidor excluyendo ausencias anuladas.
 */
export function AusenciasMetricas({
  totalMinutos,
  totalAusencias,
  totalAnuladas,
}: AusenciasMetricasProps) {
  const ausenciasEfectivas = Math.max(0, totalAusencias - totalAnuladas);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {/* Total Minutos sin anuladas (exigido por el RF) */}
      <div className="border-border/60 bg-card flex items-center gap-3.5 rounded-xl border p-4 shadow-2xs">
        <div className="border-primary/20 bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg border">
          <HugeiconsIcon icon={Clock01Icon} className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-2xs text-muted-foreground font-semibold tracking-wider uppercase">
            Minutos acumulados
          </p>
          <p className="text-foreground font-mono text-xl font-bold">
            {formatearMinutos(totalMinutos)}
          </p>
          <p className="text-2xs text-muted-foreground">Excluye ausencias anuladas</p>
        </div>
      </div>

      {/* Total de ausencias en el filtro */}
      <div className="border-border/60 bg-card flex items-center gap-3.5 rounded-xl border p-4 shadow-2xs">
        <div className="border-border/80 bg-muted/50 text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg border">
          <HugeiconsIcon icon={AlertCircleIcon} className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-2xs text-muted-foreground font-semibold tracking-wider uppercase">
            Total de ausencias
          </p>
          <p className="text-foreground font-mono text-xl font-bold">{totalAusencias}</p>
          <p className="text-2xs text-muted-foreground">
            {ausenciasEfectivas} {ausenciasEfectivas === 1 ? "efectiva" : "efectivas"}
          </p>
        </div>
      </div>

      {/* Total anuladas */}
      <div className="border-border/60 bg-card flex items-center gap-3.5 rounded-xl border p-4 shadow-2xs">
        <div className="border-destructive/20 bg-destructive/10 text-destructive flex size-10 shrink-0 items-center justify-center rounded-lg border">
          <HugeiconsIcon icon={Cancel01Icon} className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-2xs text-muted-foreground font-semibold tracking-wider uppercase">
            Ausencias anuladas
          </p>
          <p className="text-foreground font-mono text-xl font-bold">{totalAnuladas}</p>
          <p className="text-2xs text-muted-foreground">No computan minutos</p>
        </div>
      </div>
    </div>
  );
}
