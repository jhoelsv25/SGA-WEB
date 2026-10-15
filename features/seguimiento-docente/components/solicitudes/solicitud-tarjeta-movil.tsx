"use client";

import * as React from "react";
import {
  Attachment01Icon,
  Calendar01Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  EyeIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/formatters/date";
import type { SolicitudRevisionResponseDto } from "../../types";
import { VARIANTES_ESTADO_SOLICITUD } from "../../utils";

export interface SolicitudTarjetaMovilProps {
  solicitud: SolicitudRevisionResponseDto;
  onVerDetalle: (solicitud: SolicitudRevisionResponseDto) => void;
  onAceptar: (solicitud: SolicitudRevisionResponseDto) => void;
  onRechazar: (solicitud: SolicitudRevisionResponseDto) => void;
}

/**
 * Tarjeta adaptativa para dispositivos móviles (≤ 360 px) que representa
 * una solicitud de revisión en la bandeja del Director.
 */
export function SolicitudTarjetaMovil({
  solicitud,
  onVerDetalle,
  onAceptar,
  onRechazar,
}: SolicitudTarjetaMovilProps) {
  const configEstado = VARIANTES_ESTADO_SOLICITUD[solicitud.estado];
  const estaPendiente = solicitud.estado === "solicitada";

  return (
    <div className="border-border/70 bg-card flex flex-col gap-2.5 rounded-xl border p-3.5 shadow-2xs">
      {/* Cabecera: Docente y Estado */}
      <div className="flex items-start justify-between gap-2 border-b pb-2">
        <div className="min-w-0 flex-1">
          <p className="text-foreground truncate text-xs font-bold">{solicitud.docenteNombre}</p>
          <p className="text-muted-foreground text-2xs font-mono">
            DNI: {solicitud.docenteDocumento}
          </p>
        </div>
        <StatusBadge tone={configEstado.tone} dot size="sm" className="shrink-0">
          {configEstado.label}
        </StatusBadge>
      </div>

      {/* Bimestre y Fecha */}
      <div className="text-muted-foreground text-2xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <HugeiconsIcon icon={Calendar01Icon} className="size-3" />
          <span className="text-foreground font-medium">{solicitud.periodoNombre}</span>
        </div>
        <div className="flex items-center gap-1 font-mono">
          <HugeiconsIcon icon={Clock01Icon} className="size-3" />
          <span>{formatDate(solicitud.creadoEn)}</span>
        </div>
      </div>

      {/* Motivo del docente */}
      <div className="border-border/40 bg-muted/20 rounded-lg border p-2">
        <p className="text-muted-foreground text-2xs line-clamp-2 leading-relaxed">
          «{solicitud.motivo}»
        </p>
      </div>

      {/* Indicador de archivo adjunto si existe */}
      {solicitud.adjuntoUrl && (
        <div className="text-primary text-2xs flex items-center gap-1 font-medium">
          <HugeiconsIcon icon={Attachment01Icon} className="size-3" />
          <span className="truncate">
            {solicitud.adjuntoNombre || "Archivo adjunto de evidencia"}
          </span>
        </div>
      )}

      {/* Si ya está resuelta, extracto de la respuesta */}
      {!estaPendiente && solicitud.respuesta && (
        <div className="border-border/30 bg-muted/30 text-2xs text-muted-foreground rounded-md border p-1.5">
          <span className="text-foreground font-semibold">Respuesta: </span>
          <span className="line-clamp-2">{solicitud.respuesta}</span>
        </div>
      )}

      {/* Acciones */}
      <div className="flex flex-wrap items-center justify-end gap-1.5 border-t pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onVerDetalle(solicitud)}
          className="text-2xs h-7.5 gap-1 px-2.5 font-medium"
        >
          <HugeiconsIcon icon={EyeIcon} className="size-3" />
          <span>Detalle</span>
        </Button>

        {estaPendiente && (
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onRechazar(solicitud)}
              className="text-2xs text-destructive hover:bg-destructive/10 h-7.5 gap-1 px-2.5 font-semibold"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="size-3" />
              <span>Rechazar</span>
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => onAceptar(solicitud)}
              className="text-2xs h-7.5 gap-1 px-2.5 font-semibold"
            >
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3" />
              <span>Aceptar</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
