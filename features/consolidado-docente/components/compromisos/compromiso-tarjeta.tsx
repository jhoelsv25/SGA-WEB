"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatDateTime } from "@/lib/formatters/date";
import { ESTADOS_COMPROMISO_CONFIG } from "../../consts";
import type { CompromisoItem } from "../../types";

export interface CompromisoTarjetaProps {
  compromiso: CompromisoItem;
  /** Botones de acción que cambian según quién mira (Director o docente). */
  acciones?: React.ReactNode;
}

export function CompromisoTarjeta({ compromiso, acciones }: CompromisoTarjetaProps) {
  const config = ESTADOS_COMPROMISO_CONFIG[compromiso.estado];
  return (
    <li className="border-border/60 bg-card flex flex-col gap-2 rounded-xl border p-3 text-xs">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="text-foreground text-sm font-medium">{compromiso.descripcion}</p>
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant={config.variant} className={config.className}>
            {config.label}
          </Badge>
          {compromiso.vencido && <Badge variant="destructive">Vencido</Badge>}
          {compromiso.anulado && <Badge variant="outline">Anulado</Badge>}
        </div>
      </div>

      <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
        <span>Revisión: {formatDate(compromiso.fechaRevision)}</span>
        <span>Registrado sobre el consolidado v{compromiso.consolidadoVersion}</span>
        <span>
          {compromiso.enteradoEn
            ? `Enterado el ${formatDateTime(compromiso.enteradoEn)}`
            : "Sin «Enterado» del docente"}
        </span>
      </div>

      {compromiso.observacionCierre && (
        <p className="text-muted-foreground">Cierre: {compromiso.observacionCierre}</p>
      )}
      {compromiso.motivoAnulacion && (
        <p className="text-muted-foreground">Anulación: {compromiso.motivoAnulacion}</p>
      )}

      {acciones ? <div className="flex flex-wrap justify-end gap-2 pt-1">{acciones}</div> : null}
    </li>
  );
}
