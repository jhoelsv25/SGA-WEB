"use client";

import * as React from "react";
import { Camera01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { StatusBadge } from "@/components/common/status-badge";
import { Badge } from "@/components/ui/badge";
import { ETIQUETAS_MOTIVO_AUSENCIA } from "@/features/ausencias-docente/consts";
import type { AusenciaResponseDto } from "@/features/ausencias-docente/types";
import { formatearFechaLimite, formatearMinutos } from "@/features/ausencias-docente/utils";
import { AusenciaFilaAcciones } from "./ausencia-fila-acciones";

export interface AusenciaTarjetaMovilProps {
  ausencia: AusenciaResponseDto;
  usuarioActualId?: string;
  onVerDetalle: (ausencia: AusenciaResponseDto) => void;
  onVerHistorial: (ausencia: AusenciaResponseDto) => void;
  onCorregir: (ausencia: AusenciaResponseDto) => void;
  onAnular: (ausencia: AusenciaResponseDto) => void;
}

/**
 * Tarjeta adaptativa para dispositivos móviles (≤ 360 px sin desbordamiento horizontal).
 * Ofrece todas las acciones y datos principales de la ausencia con tokens semánticos.
 */
export function AusenciaTarjetaMovil({
  ausencia,
  usuarioActualId,
  onVerDetalle,
  onVerHistorial,
  onCorregir,
  onAnular,
}: AusenciaTarjetaMovilProps) {
  const etiquetaMotivo = ETIQUETAS_MOTIVO_AUSENCIA[ausencia.motivo] ?? ausencia.motivo;
  const cantidadFotos = ausencia.fotos?.length ?? 0;

  return (
    <div className="border-border/60 bg-card flex flex-col gap-2.5 rounded-xl border p-3.5 shadow-2xs">
      {/* Cabecera de la tarjeta: Docente y Acciones */}
      <div className="flex items-start justify-between gap-2 border-b pb-2">
        <div className="min-w-0 flex-1">
          <p className="text-foreground truncate text-xs font-bold">
            {ausencia.sesion.docenteNombre}
          </p>
          <p className="text-2xs text-muted-foreground truncate">
            {formatearFechaLimite(ausencia.sesion.fecha)} · {ausencia.sesion.cursoNombre} (
            {ausencia.sesion.seccionNombre})
          </p>
        </div>
        <div className="shrink-0">
          <AusenciaFilaAcciones
            ausencia={ausencia}
            usuarioActualId={usuarioActualId}
            onVerDetalle={onVerDetalle}
            onVerHistorial={onVerHistorial}
            onCorregir={onCorregir}
            onAnular={onAnular}
          />
        </div>
      </div>

      {/* Datos del tramo horario y motivo */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs">
        <div className="flex items-center gap-1.5 font-mono">
          <span className="text-foreground font-semibold">
            {ausencia.horaDesde} – {ausencia.horaHasta}
          </span>
          <Badge
            variant="secondary"
            className={`text-2xs font-mono ${
              ausencia.anulada ? "text-muted-foreground line-through opacity-60" : ""
            }`}
          >
            {formatearMinutos(ausencia.minutos)}
          </Badge>
        </div>

        <span className="text-2xs text-foreground font-medium">{etiquetaMotivo}</span>
      </div>

      {ausencia.observacion && (
        <p className="border-border/40 bg-muted/30 text-2xs text-muted-foreground rounded-lg border p-2 leading-relaxed">
          «{ausencia.observacion}»
        </p>
      )}

      {/* Badges de estado en el pie con tokens semánticos */}
      <div className="text-2xs flex flex-wrap items-center justify-between gap-1.5 border-t pt-2">
        <div>
          {ausencia.anulada ? (
            <StatusBadge tone="danger" dot size="sm">
              Anulada
            </StatusBadge>
          ) : ausencia.vigente ? (
            <StatusBadge tone="success" dot size="sm">
              Vigente
            </StatusBadge>
          ) : (
            <StatusBadge tone="neutral" dot size="sm">
              Anterior
            </StatusBadge>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {cantidadFotos > 0 && (
            <Badge variant="outline" className="text-2xs gap-1 px-1.5 py-0.5">
              <HugeiconsIcon icon={Camera01Icon} className="size-3" />
              <span>{cantidadFotos}</span>
            </Badge>
          )}

          {ausencia.descargo ? (
            <StatusBadge tone="success" size="sm">
              Con descargo
            </StatusBadge>
          ) : ausencia.puedeDescargar ? (
            <StatusBadge tone="warning" size="sm">
              Pendiente
            </StatusBadge>
          ) : (
            <StatusBadge tone="neutral" size="sm">
              Sin descargo
            </StatusBadge>
          )}
        </div>
      </div>
    </div>
  );
}
