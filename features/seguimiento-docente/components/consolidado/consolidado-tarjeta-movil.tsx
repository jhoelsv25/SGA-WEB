"use client";

import * as React from "react";
import { StatusBadge } from "@/components/common/status-badge";
import { Badge } from "@/components/ui/badge";
import type { ConsolidadoResumenDto } from "../../types";
import { formatearTiempoMinutos, obtenerEtiquetaDecision, VARIANTES_DECISION } from "../../utils";
import { ConsolidadoFilaAcciones } from "./consolidado-fila-acciones";

export interface ConsolidadoTarjetaMovilProps {
  consolidado: ConsolidadoResumenDto;
  puedeGestionar: boolean;
  onVerDetalle: (consolidado: ConsolidadoResumenDto) => void;
  onVerHistorial: (consolidado: ConsolidadoResumenDto) => void;
  onDescargarFicha: (consolidado: ConsolidadoResumenDto) => void;
  onReabrir?: (consolidado: ConsolidadoResumenDto) => void;
  onCerrar?: (consolidado: ConsolidadoResumenDto) => void;
  onRegistrarDecision?: (consolidado: ConsolidadoResumenDto) => void;
  onGenerarUno?: (consolidado: ConsolidadoResumenDto) => void;
}

/**
 * Tarjeta adaptativa móvil para visualizar el consolidado de un docente en celulares (≤ 360 px).
 */
export function ConsolidadoTarjetaMovil({
  consolidado,
  puedeGestionar,
  onVerDetalle,
  onVerHistorial,
  onDescargarFicha,
  onReabrir,
  onCerrar,
  onRegistrarDecision,
  onGenerarUno,
}: ConsolidadoTarjetaMovilProps) {
  const esCerrado = consolidado.estado === "cerrado";
  const decisionInfo = VARIANTES_DECISION[consolidado.decision];
  const decisionLabel = obtenerEtiquetaDecision(consolidado.decision);

  return (
    <div className="border-border/60 bg-card flex flex-col gap-2.5 rounded-xl border p-3.5 shadow-2xs">
      {/* Cabecera: Docente y Menú de Acciones */}
      <div className="flex items-start justify-between gap-2 border-b pb-2">
        <div className="min-w-0 flex-1">
          <p className="text-foreground truncate text-xs font-bold">{consolidado.docenteNombre}</p>
          <p className="text-2xs text-muted-foreground font-mono">
            DNI/Doc: {consolidado.docenteDocumento}
          </p>
        </div>
        <div className="shrink-0">
          <ConsolidadoFilaAcciones
            consolidado={consolidado}
            puedeGestionar={puedeGestionar}
            onVerDetalle={onVerDetalle}
            onVerHistorial={onVerHistorial}
            onDescargarFicha={onDescargarFicha}
            onReabrir={onReabrir}
            onCerrar={onCerrar}
            onRegistrarDecision={onRegistrarDecision}
            onGenerarUno={onGenerarUno}
          />
        </div>
      </div>

      {/* Métrica principal: Tiempo fuera de clase */}
      <div className="bg-primary/5 border-primary/20 flex items-center justify-between rounded-lg border p-2.5">
        <div>
          <span className="text-2xs text-muted-foreground block font-medium">
            Total fuera de clase
          </span>
          <span className="text-primary font-heading text-sm font-bold">
            {consolidado.tiempoFueraClaseTexto}
          </span>
        </div>
        <div className="text-2xs text-muted-foreground text-right">
          <p>Firma: {formatearTiempoMinutos(consolidado.minutosPerdidosFirma)}</p>
          <p>
            Ausencias: {consolidado.totalAusencias} (
            {formatearTiempoMinutos(consolidado.minutosFueraAula)})
          </p>
        </div>
      </div>

      {/* Resumen de Sesiones */}
      <div className="text-2xs grid grid-cols-5 gap-1 text-center">
        <div className="border-border/40 bg-muted/20 rounded p-1">
          <span className="text-muted-foreground text-3xs block">Prog</span>
          <span className="text-foreground font-mono font-bold">
            {consolidado.sesionesProgramadas}
          </span>
        </div>
        <div className="border-border/40 bg-muted/20 rounded p-1">
          <span className="text-muted-foreground text-3xs block">Cump</span>
          <span className="text-foreground font-mono font-bold">
            {consolidado.sesionesCumplidas}
          </span>
        </div>
        <div className="border-border/40 bg-muted/20 rounded p-1">
          <span className="text-muted-foreground text-3xs block">Parc</span>
          <span className="text-muted-foreground font-mono">{consolidado.sesionesParciales}</span>
        </div>
        <div className="border-border/40 bg-muted/20 rounded p-1">
          <span className="text-muted-foreground text-3xs block">No Cump</span>
          <span
            className={`font-mono font-bold ${
              consolidado.sesionesNoCumplidas > 0 ? "text-destructive" : "text-muted-foreground"
            }`}
          >
            {consolidado.sesionesNoCumplidas}
          </span>
        </div>
        <div className="border-border/40 bg-muted/20 rounded p-1">
          <span className="text-muted-foreground text-3xs block">Just</span>
          <span className="text-muted-foreground font-mono">
            {consolidado.sesionesJustificadas}
          </span>
        </div>
      </div>

      {/* Badges de estado en el pie */}
      <div className="text-2xs flex flex-wrap items-center justify-between gap-1.5 border-t pt-2">
        <div className="flex items-center gap-1.5">
          <StatusBadge tone={esCerrado ? "neutral" : "warning"} dot size="sm">
            {esCerrado ? "Cerrado" : "Reabierto"}
          </StatusBadge>
          <Badge variant="outline" className="text-2xs font-mono">
            v{consolidado.version}
          </Badge>
        </div>

        <StatusBadge tone={decisionInfo?.tone ?? "neutral"} size="sm">
          {decisionLabel}
        </StatusBadge>
      </div>
    </div>
  );
}
