"use client";

import * as React from "react";
import { EyeIcon, FileEditIcon, Image01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/formatters/date";
import { ETIQUETAS_MOTIVO_AUSENCIA } from "../../consts";
import type { AusenciaResponseDto } from "../../types";
import { esDescargoPermitido, formatearMinutos } from "../../utils";
import { EstadoAusenciaBadge } from "./estado-ausencia-badge";

interface MisAusenciasTarjetasProps {
  ausencias: AusenciaResponseDto[];
  onVerDetalle: (ausencia: AusenciaResponseDto) => void;
  onAbrirDescargo: (ausencia: AusenciaResponseDto) => void;
}

/**
 * Listado de tarjetas de ausencias optimizado para dispositivos móviles (360 px).
 */
export function MisAusenciasTarjetas({
  ausencias,
  onVerDetalle,
  onAbrirDescargo,
}: MisAusenciasTarjetasProps) {
  return (
    <div className="space-y-3">
      {ausencias.map((ausencia) => {
        const fechaSesion = formatDate(ausencia.sesion.fecha, "dd/MM/yyyy");
        const etiquetaMotivo = ETIQUETAS_MOTIVO_AUSENCIA[ausencia.motivo] || ausencia.motivo;
        const puedeDescargar = esDescargoPermitido(ausencia);

        return (
          <div
            key={ausencia.id}
            className="border-border/70 bg-card rounded-2xl border p-4 shadow-2xs"
          >
            {/* Cabecera de la tarjeta */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-sm font-bold">
                  {ausencia.sesion.cursoNombre}
                </p>
                <p className="text-muted-foreground text-xs">
                  {ausencia.sesion.seccionNombre} ·{" "}
                  <span className="text-foreground font-mono">{fechaSesion}</span>
                </p>
              </div>
              <EstadoAusenciaBadge ausencia={ausencia} className="shrink-0" />
            </div>

            {/* Tramo y duración */}
            <div className="bg-muted/30 mt-3 flex items-baseline justify-between rounded-xl p-2.5">
              <div>
                <span className="text-2xs text-muted-foreground font-semibold uppercase">
                  Tramo ausente
                </span>
                <p className="text-foreground font-mono text-sm font-extrabold">
                  {ausencia.horaDesde} a {ausencia.horaHasta}
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xs text-muted-foreground font-semibold uppercase">
                  Duración
                </span>
                <p className="text-foreground text-sm font-bold">
                  {formatearMinutos(ausencia.minutos)}
                </p>
              </div>
            </div>

            {/* Motivo y observación */}
            <div className="mt-2.5 space-y-1 text-xs">
              <p className="text-muted-foreground">
                Motivo: <strong className="text-foreground">{etiquetaMotivo}</strong>
              </p>
              {ausencia.observacion && (
                <p className="bg-muted/20 text-foreground line-clamp-2 rounded-lg p-2 italic">
                  «{ausencia.observacion}»
                </p>
              )}
            </div>

            {/* Indicador de fotos si existen */}
            {ausencia.fotos.length > 0 && (
              <div className="text-muted-foreground mt-2.5 flex items-center gap-1.5 text-xs">
                <HugeiconsIcon icon={Image01Icon} className="size-3.5" />
                <span>
                  {ausencia.fotos.length}{" "}
                  {ausencia.fotos.length === 1 ? "foto adjunta" : "fotos adjuntas"}
                </span>
              </div>
            )}

            {/* Acciones móviles con área táctil cómoda (44 px) */}
            <div className="border-border/40 mt-4 flex flex-wrap gap-2 border-t pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => onVerDetalle(ausencia)}
                className="h-11 min-h-11 flex-1 gap-1.5 rounded-full text-xs font-semibold"
                aria-label={`Ver detalle completo de ${ausencia.sesion.cursoNombre}`}
              >
                <HugeiconsIcon icon={EyeIcon} className="size-3.5" />
                <span>Ver detalle</span>
              </Button>

              {!ausencia.anulada && ausencia.descargo === null && puedeDescargar && (
                <Button
                  type="button"
                  onClick={() => onAbrirDescargo(ausencia)}
                  className="h-11 min-h-11 flex-1 gap-1.5 rounded-full text-xs font-semibold"
                  aria-label={`Presentar descargo de ${ausencia.sesion.cursoNombre}`}
                >
                  <HugeiconsIcon icon={FileEditIcon} className="size-3.5" />
                  <span>Descargo</span>
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
