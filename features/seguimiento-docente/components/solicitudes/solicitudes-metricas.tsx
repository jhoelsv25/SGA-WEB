"use client";

import * as React from "react";
import {
  AlertCircleIcon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  FileEditIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { SolicitudRevisionResponseDto } from "../../types";

export interface SolicitudesMetricasProps {
  solicitudes: SolicitudRevisionResponseDto[];
  isLoading?: boolean;
}

/**
 * Panel de métricas y contador de solicitudes pendientes del Año académico.
 * Permite al Director visualizar de inmediato el volumen total y cuántas
 * solicitudes requieren atención directiva.
 */
export function SolicitudesMetricas({ solicitudes, isLoading = false }: SolicitudesMetricasProps) {
  const metricas = React.useMemo(() => {
    let pendientes = 0;
    let aceptadas = 0;
    let rechazadas = 0;

    for (const s of solicitudes) {
      if (s.estado === "solicitada") pendientes++;
      else if (s.estado === "aceptada") aceptadas++;
      else if (s.estado === "rechazada") rechazadas++;
    }

    return {
      total: solicitudes.length,
      pendientes,
      aceptadas,
      rechazadas,
    };
  }, [solicitudes]);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {/* Total solicitudes */}
      <div className="border-border/70 bg-card flex items-center gap-3 rounded-xl border p-3.5 shadow-2xs">
        <div className="border-border/60 bg-muted/50 text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg border">
          <HugeiconsIcon icon={FileEditIcon} className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-muted-foreground truncate text-xs font-medium">Total solicitudes</p>
          <p className="text-foreground text-lg font-bold tracking-tight">
            {isLoading ? "–" : metricas.total}
          </p>
        </div>
      </div>

      {/* Pendientes de revisión (resaltado) */}
      <div className="border-warning/30 bg-warning/5 flex items-center gap-3 rounded-xl border p-3.5 shadow-2xs">
        <div className="border-warning/30 bg-warning/15 text-warning-text flex size-10 shrink-0 items-center justify-center rounded-lg border">
          <HugeiconsIcon icon={AlertCircleIcon} className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-warning-text truncate text-xs font-semibold">Pendientes</p>
          <p className="text-foreground text-lg font-extrabold tracking-tight">
            {isLoading ? "–" : metricas.pendientes}
          </p>
        </div>
      </div>

      {/* Aceptadas */}
      <div className="border-primary/25 bg-primary/5 flex items-center gap-3 rounded-xl border p-3.5 shadow-2xs">
        <div className="border-primary/30 bg-primary/15 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg border">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-primary truncate text-xs font-semibold">Aceptadas</p>
          <p className="text-foreground text-lg font-bold tracking-tight">
            {isLoading ? "–" : metricas.aceptadas}
          </p>
        </div>
      </div>

      {/* Rechazadas */}
      <div className="border-border/70 bg-card flex items-center gap-3 rounded-xl border p-3.5 shadow-2xs">
        <div className="border-destructive/25 bg-destructive/10 text-destructive flex size-10 shrink-0 items-center justify-center rounded-lg border">
          <HugeiconsIcon icon={Cancel01Icon} className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-muted-foreground truncate text-xs font-medium">Rechazadas</p>
          <p className="text-foreground text-lg font-bold tracking-tight">
            {isLoading ? "–" : metricas.rechazadas}
          </p>
        </div>
      </div>
    </div>
  );
}
