"use client";

import * as React from "react";
import { DataTable } from "@/components/common/data-table";
import { Badge } from "@/components/ui/badge";
import { DECISIONES_CONSOLIDADO_CONFIG, ESTADOS_CONSOLIDADO_CONFIG } from "../consts";
import type { ConsolidadoResumenItem } from "../types";
import { ConsolidadoActions } from "./columns/consolidado-actions";
import { getConsolidadoColumns } from "./columns/consolidado-columns";

export interface ConsolidadosTableProps {
  consolidados: ConsolidadoResumenItem[];
  isLoading?: boolean;
  hasActiveFilters?: boolean;
  esDirectorOAdmin?: boolean;
  onRefresh?: () => void;
  onVerDetalle: (id: string) => void;
  onDescargarPdf: (id: string) => void;
  onAbrirDecision: (item: ConsolidadoResumenItem) => void;
  onAbrirReabrir: (item: ConsolidadoResumenItem) => void;
  onAbrirCerrar: (item: ConsolidadoResumenItem) => void;
  onAbrirHistorial: (item: ConsolidadoResumenItem) => void;
  onResolverSolicitud: (consolidadoId: string) => void;
}

export function ConsolidadosTable({
  consolidados,
  isLoading = false,
  hasActiveFilters = false,
  esDirectorOAdmin = false,
  onRefresh,
  onVerDetalle,
  onDescargarPdf,
  onAbrirDecision,
  onAbrirReabrir,
  onAbrirCerrar,
  onAbrirHistorial,
  onResolverSolicitud,
}: ConsolidadosTableProps) {
  const columns = React.useMemo(
    () =>
      getConsolidadoColumns({
        esDirectorOAdmin,
        onVerDetalle,
        onDescargarPdf,
        onAbrirDecision,
        onAbrirReabrir,
        onAbrirCerrar,
        onAbrirHistorial,
        onResolverSolicitud,
      }),
    [
      esDirectorOAdmin,
      onVerDetalle,
      onDescargarPdf,
      onAbrirDecision,
      onAbrirReabrir,
      onAbrirCerrar,
      onAbrirHistorial,
      onResolverSolicitud,
    ],
  );

  const renderMobileCard = React.useCallback(
    (c: ConsolidadoResumenItem) => {
      const tasa =
        c.sesionesProgramadas > 0
          ? Math.round(
              ((c.sesionesCumplidas + c.sesionesJustificadas) / c.sesionesProgramadas) * 100,
            )
          : 0;

      const estadoCfg = ESTADOS_CONSOLIDADO_CONFIG[c.estado] ?? {
        label: c.estado,
        variant: "secondary" as const,
      };

      const decisionCfg = DECISIONES_CONSOLIDADO_CONFIG[c.decision] ?? {
        label: c.decision,
        variant: "outline" as const,
      };

      const tieneSolicitudes = (c.solicitudesPendientesCount ?? 0) > 0;

      return (
        <div className="border-border/70 bg-card space-y-3 rounded-2xl border p-4 shadow-2xs">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-foreground truncate text-sm font-semibold">
                  {c.docenteNombre}
                </span>
                <Badge variant={c.vigente ? "default" : "outline"} className="text-[10px]">
                  v{c.version}
                </Badge>
              </div>
              <p className="text-muted-foreground font-mono text-xs">DNI: {c.docenteDni}</p>
            </div>
            <ConsolidadoActions
              consolidado={c}
              esDirectorOAdmin={esDirectorOAdmin}
              onVerDetalle={onVerDetalle}
              onDescargarPdf={onDescargarPdf}
              onAbrirDecision={onAbrirDecision}
              onAbrirReabrir={onAbrirReabrir}
              onAbrirCerrar={onAbrirCerrar}
              onAbrirHistorial={onAbrirHistorial}
              onResolverSolicitud={onResolverSolicitud}
            />
          </div>

          {tieneSolicitudes && (
            <Badge
              variant="destructive"
              className="animate-pulse cursor-pointer text-[10px]"
              onClick={() => onResolverSolicitud(c.id)}
            >
              {c.solicitudesPendientesCount} solicitud de revisión pendiente
            </Badge>
          )}

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="border-border/50 bg-muted/20 rounded-xl border p-2">
              <span className="text-muted-foreground block text-[11px]">Cumplimiento</span>
              <span className="text-foreground font-mono font-bold">
                {c.sesionesCumplidas}/{c.sesionesProgramadas} ({tasa}%)
              </span>
            </div>
            <div className="border-border/50 bg-muted/20 rounded-xl border p-2">
              <span className="text-muted-foreground block text-[11px]">Tiempo Fuera</span>
              <span className="text-foreground font-mono font-bold">{c.tiempoTotalFueraTexto}</span>
            </div>
          </div>

          <div className="border-border/50 flex flex-wrap items-center justify-between gap-2 border-t pt-2.5 text-xs">
            <Badge variant={estadoCfg.variant} className={estadoCfg.className}>
              {estadoCfg.label}
            </Badge>
            <Badge variant={decisionCfg.variant} className={decisionCfg.className}>
              {decisionCfg.label}
            </Badge>
          </div>
        </div>
      );
    },
    [
      esDirectorOAdmin,
      onVerDetalle,
      onDescargarPdf,
      onAbrirDecision,
      onAbrirReabrir,
      onAbrirCerrar,
      onAbrirHistorial,
      onResolverSolicitud,
    ],
  );

  return (
    <DataTable
      columns={columns}
      data={consolidados}
      isLoading={isLoading}
      onRetry={onRefresh}
      hasActiveFilters={hasActiveFilters}
      pagination={false}
      caption="Consolidado bimestral de seguimiento y horas dictadas por docentes"
      mobileCard={renderMobileCard}
      emptyMessage="No se encontraron consolidados docentes con los filtros aplicados o aún no se han generado para este bimestre."
    />
  );
}
