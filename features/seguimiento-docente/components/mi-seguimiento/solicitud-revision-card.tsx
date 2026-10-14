"use client";

import * as React from "react";
import {
  AlertCircleIcon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  File02Icon,
  LinkSquare02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/formatters/date";
import { urlDeAdjunto } from "../../api";
import { MENSAJES_CONSOLIDADO } from "../../consts";
import type { SolicitudRevisionResponseDto } from "../../types";
import { obtenerEtiquetaEstadoSolicitud, VARIANTES_ESTADO_SOLICITUD } from "../../utils";

interface SolicitudRevisionCardProps {
  solicitud: SolicitudRevisionResponseDto;
}

/**
 * Tarjeta de estado de la solicitud de revisión del consolidado (HU3).
 * Muestra el estado actual (solicitada, aceptada, rechazada), el motivo,
 * los comprobantes adjuntos y la respuesta emitida por el Director.
 */
export function SolicitudRevisionCard({ solicitud }: SolicitudRevisionCardProps) {
  const variante = VARIANTES_ESTADO_SOLICITUD[solicitud.estado];
  const urlAdjunto = urlDeAdjunto(solicitud.adjuntoUrl);

  return (
    <div className="border-border/70 bg-card overflow-hidden rounded-2xl border shadow-2xs">
      {/* Cabecera del estado de la solicitud */}
      <div className="border-border/60 bg-muted/20 flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
            <HugeiconsIcon icon={Clock01Icon} className="size-4" />
          </div>
          <div>
            <h2 className="text-foreground text-xs font-bold tracking-wider uppercase">
              Solicitud de revisión del consolidado
            </h2>
            <p className="text-muted-foreground text-2xs">
              Registrada el {formatDateTime(solicitud.creadoEn)}
            </p>
          </div>
        </div>

        <Badge
          variant={
            variante.tone === "warning"
              ? "outline"
              : variante.tone === "danger"
                ? "destructive"
                : "default"
          }
          className="text-xs font-semibold capitalize"
        >
          {obtenerEtiquetaEstadoSolicitud(solicitud.estado)}
        </Badge>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        {/* Motivo registrado por el docente */}
        <div>
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Motivo indicado por usted
          </p>
          <div className="border-border/50 bg-muted/10 mt-1.5 rounded-xl border p-3 text-sm">
            <p className="text-foreground whitespace-pre-wrap">{solicitud.motivo}</p>
          </div>
        </div>

        {/* Archivo adjunto (si se incluyó en la solicitud) */}
        {solicitud.adjuntoUrl && (
          <div>
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Comprobante adjunto
            </p>
            <div className="mt-1.5 flex items-center gap-2">
              <a
                href={urlAdjunto}
                target="_blank"
                rel="noopener noreferrer"
                className="border-border/70 bg-background hover:bg-muted/30 text-foreground inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium shadow-2xs transition-colors"
              >
                <HugeiconsIcon icon={File02Icon} className="text-primary size-4 shrink-0" />
                <span className="max-w-xs truncate">
                  {solicitud.adjuntoNombre ?? "Ver archivo de evidencia"}
                </span>
                <HugeiconsIcon
                  icon={LinkSquare02Icon}
                  className="text-muted-foreground size-3.5 shrink-0"
                />
              </a>
            </div>
          </div>
        )}

        {/* Estados contextuales y respuesta directiva */}
        {solicitud.estado === "solicitada" && (
          <div className="border-warning/30 bg-warning/10 text-warning-text flex items-start gap-2.5 rounded-xl border p-3 text-xs">
            <HugeiconsIcon icon={Clock01Icon} className="mt-0.5 size-4 shrink-0" />
            <div>
              <p className="font-semibold">Solicitud en evaluación</p>
              <p className="text-muted-foreground mt-0.5">
                {MENSAJES_CONSOLIDADO.SOLICITUD_REPETIDA} El Director revisará sus observaciones
                para determinar la reapertura del consolidado.
              </p>
            </div>
          </div>
        )}

        {solicitud.estado === "aceptada" && (
          <div className="border-success/30 bg-success/10 text-success-text space-y-2 rounded-xl border p-3.5 text-xs">
            <div className="flex items-start gap-2.5">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="mt-0.5 size-4 shrink-0" />
              <div>
                <p className="font-semibold">Solicitud aceptada por la Dirección</p>
                <p className="mt-0.5">
                  El consolidado fue reabierto para permitir la regularización o corrección de
                  sesiones y ausencias de este bimestre.
                </p>
                {solicitud.resueltaEn && (
                  <p className="text-muted-foreground text-2xs mt-1">
                    Aceptada el {formatDateTime(solicitud.resueltaEn)}
                  </p>
                )}
              </div>
            </div>

            {solicitud.respuesta && (
              <div className="border-border/40 bg-card text-foreground rounded-lg border p-2.5">
                <p className="text-muted-foreground text-2xs font-semibold tracking-wider uppercase">
                  Respuesta del Director
                </p>
                <p className="mt-1 text-xs whitespace-pre-wrap">{solicitud.respuesta}</p>
              </div>
            )}
          </div>
        )}

        {solicitud.estado === "rechazada" && (
          <div className="border-destructive/30 bg-destructive/10 text-destructive space-y-2 rounded-xl border p-3.5 text-xs">
            <div className="flex items-start gap-2.5">
              <HugeiconsIcon icon={AlertCircleIcon} className="mt-0.5 size-4 shrink-0" />
              <div>
                <p className="font-semibold">Solicitud rechazada por la Dirección</p>
                <p className="mt-0.5">
                  El Director evaluó su solicitud y determinó no reabrir el consolidado. El
                  consolidado permanece cerrado.
                </p>
                {solicitud.resueltaEn && (
                  <p className="text-muted-foreground text-2xs mt-1">
                    Resuelta el {formatDateTime(solicitud.resueltaEn)}
                  </p>
                )}
              </div>
            </div>

            {solicitud.respuesta && (
              <div className="border-border/40 bg-card text-foreground rounded-lg border p-2.5">
                <p className="text-muted-foreground text-2xs font-semibold tracking-wider uppercase">
                  Respuesta y fundamentación del Director
                </p>
                <p className="mt-1 text-xs whitespace-pre-wrap">{solicitud.respuesta}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
