"use client";

import * as React from "react";
import { InformationCircleIcon, UserCheck01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/formatters/date";
import type { ConsolidadoResumenDto } from "../../types";
import {
  obtenerEtiquetaDecision,
  obtenerEtiquetaEstadoConsolidado,
  VARIANTES_DECISION,
  VARIANTES_ESTADO_CONSOLIDADO,
} from "../../utils";

interface MiDecisionDirectivaProps {
  consolidado: ConsolidadoResumenDto;
}

/**
 * Panel de decisión directiva, estado y versión del consolidado docente (HU1, HU3).
 * Muestra la postura autónoma del Director (ninguna, llamada de atención, compromiso de mejora, derivado)
 * y la observación correspondiente, sin exponer el historial de versiones anteriores.
 */
export function MiDecisionDirectiva({ consolidado }: MiDecisionDirectivaProps) {
  const varianteDecision = VARIANTES_DECISION[consolidado.decision];
  const varianteEstado = VARIANTES_ESTADO_CONSOLIDADO[consolidado.estado];

  return (
    <div className="border-border/70 bg-card overflow-hidden rounded-2xl border shadow-2xs">
      <div className="border-border/60 bg-muted/20 flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
            <HugeiconsIcon icon={UserCheck01Icon} className="size-4" />
          </div>
          <div>
            <h2 className="text-foreground text-xs font-bold tracking-wider uppercase">
              Decisión directiva y estado
            </h2>
            <p className="text-muted-foreground text-2xs">
              Resolución adoptada por la Dirección del colegio
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Badge de versión del consolidado */}
          <Badge variant="outline" className="text-xs font-semibold">
            Versión {consolidado.version}
          </Badge>

          {/* Badge de estado del consolidado */}
          <Badge
            variant={varianteEstado.tone === "brand" ? "default" : "secondary"}
            className="text-xs font-semibold capitalize"
          >
            {obtenerEtiquetaEstadoConsolidado(consolidado.estado)}
          </Badge>

          {/* Badge de decisión directiva */}
          <Badge
            variant={
              varianteDecision.tone === "warning"
                ? "outline"
                : varianteDecision.tone === "danger"
                  ? "destructive"
                  : varianteDecision.tone === "brand"
                    ? "default"
                    : "secondary"
            }
            className="text-xs font-semibold"
          >
            {obtenerEtiquetaDecision(consolidado.decision)}
          </Badge>
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        {/* Observación o comentario que acompaña la decisión */}
        <div>
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Observación o indicación de la Dirección
          </p>
          <div className="border-border/50 bg-muted/15 mt-1.5 rounded-xl border p-3.5 text-sm">
            {consolidado.observacion ? (
              <p className="text-foreground whitespace-pre-wrap">{consolidado.observacion}</p>
            ) : (
              <p className="text-muted-foreground text-xs italic">
                No se registraron observaciones adicionales para este consolidado.
              </p>
            )}
          </div>
        </div>

        {/* Metadatos de auditoría y generación */}
        <div className="border-border/40 bg-muted/10 grid grid-cols-1 gap-2.5 rounded-xl border p-3 text-xs sm:grid-cols-2">
          <div>
            <span className="text-muted-foreground">Generado por: </span>
            <span className="text-foreground font-medium">{consolidado.generadoPorNombre}</span>
            <p className="text-muted-foreground text-2xs">
              {formatDateTime(consolidado.generadoEn)}
            </p>
          </div>

          {consolidado.reabiertoEn && (
            <div>
              <span className="text-muted-foreground">Reabierto por: </span>
              <span className="text-foreground font-medium">
                {consolidado.reabiertoPorNombre ?? "Dirección"}
              </span>
              <p className="text-muted-foreground text-2xs">
                {formatDateTime(consolidado.reabiertoEn)}
              </p>
            </div>
          )}

          {consolidado.version > 1 && consolidado.motivoCambio && (
            <div className="sm:col-span-2">
              <span className="text-muted-foreground">
                Motivo de recálculo (V{consolidado.version}):{" "}
              </span>
              <span className="text-foreground font-medium">{consolidado.motivoCambio}</span>
            </div>
          )}
        </div>

        {/* Nota informativa de negocio */}
        <div className="border-border/50 bg-muted/20 flex items-start gap-2 rounded-xl border p-3 text-xs">
          <HugeiconsIcon
            icon={InformationCircleIcon}
            className="text-muted-foreground mt-0.5 size-4 shrink-0"
          />
          <p className="text-muted-foreground">
            <span className="text-foreground font-medium">Propósito pedagógico:</span> El
            consolidado de seguimiento y la decisión directiva son de carácter informativo. No
            generan descuentos automáticos de haberes ni sanciones salariales.
          </p>
        </div>
      </div>
    </div>
  );
}
