"use client";

import * as React from "react";
import { AlertCircleIcon, Time02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Modal } from "@/components/common/modal";
import { Spinner } from "@/components/common/spinner";
import { StatusBadge } from "@/components/common/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/formatters/date";
import { useHistorialConsolidado } from "../../hooks";
import { formatearTiempoMinutos, obtenerEtiquetaDecision, VARIANTES_DECISION } from "../../utils";

export interface ModalHistorialConsolidadoProps {
  consolidadoId: string | null;
  docenteNombre?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal para visualizar el historial completo de versiones de un consolidado docente (RF-013 HU2).
 * Disponible para Director y Subdirector.
 */
export function ModalHistorialConsolidado({
  consolidadoId,
  docenteNombre,
  open,
  onOpenChange,
}: ModalHistorialConsolidadoProps) {
  const { data, isLoading, isError, refetch } = useHistorialConsolidado(
    consolidadoId ?? undefined,
    open,
  );

  const versiones = React.useMemo(() => {
    if (!data?.versiones) return [];
    return [...data.versiones].sort((a, b) => b.version - a.version);
  }, [data]);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Historial de versiones del consolidado"
      description="Trazabilidad cronológica de recálculos, reaperturas y versiones generadas (RF-013 HU2)."
      icon={Time02Icon}
      size="xl"
    >
      <div className="space-y-4">
        {/* Cabecera contextual */}
        <div className="border-border/60 bg-muted/30 flex items-center justify-between rounded-xl border p-3 text-xs">
          <div>
            <p className="text-foreground font-semibold">
              {docenteNombre || data?.docenteNombre || "Docente"}
            </p>
            <p className="text-muted-foreground text-2xs">
              {data?.periodoNombre || "Bimestre"} · {versiones.length}{" "}
              {versiones.length === 1 ? "versión registrada" : "versiones registradas"}
            </p>
          </div>
        </div>

        {/* Estado de carga */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Spinner className="text-primary size-7" />
            <p className="text-muted-foreground mt-2 text-xs">Cargando historial de versiones...</p>
          </div>
        )}

        {/* Estado de error */}
        {isError && (
          <div className="border-destructive/30 bg-destructive/10 rounded-xl border p-4 text-center">
            <HugeiconsIcon icon={AlertCircleIcon} className="text-destructive mx-auto size-6" />
            <p className="text-destructive mt-1.5 text-xs font-semibold">
              No se pudo cargar el historial de versiones.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
              className="mt-2 text-xs"
            >
              Reintentar
            </Button>
          </div>
        )}

        {/* Sin versiones */}
        {!isLoading && !isError && versiones.length === 0 && (
          <div className="border-border/60 bg-muted/20 text-muted-foreground rounded-xl border p-6 text-center text-xs">
            No se encontraron registros de versiones para este consolidado.
          </div>
        )}

        {/* Listado de versiones */}
        {!isLoading && !isError && versiones.length > 0 && (
          <div className="space-y-3">
            {versiones.map((v) => {
              const decisionInfo = VARIANTES_DECISION[v.decision];
              const decisionLabel = obtenerEtiquetaDecision(v.decision);

              return (
                <div
                  key={`version-${v.id}-${v.version}`}
                  className={`border-border/70 rounded-xl border p-4 shadow-2xs transition-all ${
                    v.vigente
                      ? "bg-card border-primary/40 ring-primary/20 ring-1"
                      : "bg-muted/30 opacity-90"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground text-sm font-bold">Versión {v.version}</span>
                      {v.vigente ? (
                        <StatusBadge tone="success" dot size="sm">
                          Vigente
                        </StatusBadge>
                      ) : (
                        <Badge variant="outline" className="text-2xs text-muted-foreground">
                          Anterior
                        </Badge>
                      )}
                      <StatusBadge tone={v.estado === "cerrado" ? "neutral" : "warning"} size="sm">
                        {v.estado === "cerrado" ? "Cerrado" : "Reabierto"}
                      </StatusBadge>
                    </div>

                    <span className="text-2xs text-muted-foreground font-mono">
                      {formatDateTime(v.generadoEn)}
                    </span>
                  </div>

                  {/* Motivo del cambio (si existe) */}
                  {v.motivoCambio && (
                    <div className="border-primary/20 bg-primary/5 mt-2.5 rounded-lg border p-2.5 text-xs">
                      <span className="text-primary block font-semibold">Motivo del cambio:</span>
                      <p className="text-foreground mt-0.5">{v.motivoCambio}</p>
                    </div>
                  )}

                  {/* Resumen de totales */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                    <div className="border-border/40 bg-background/60 rounded-lg border p-2">
                      <span className="text-2xs text-muted-foreground block">Fuera de clase</span>
                      <span className="text-primary font-heading text-xs font-bold">
                        {v.tiempoFueraClaseTexto}
                      </span>
                    </div>

                    <div className="border-border/40 bg-background/60 rounded-lg border p-2">
                      <span className="text-2xs text-muted-foreground block">Sesiones</span>
                      <span className="text-foreground font-mono text-xs">
                        {v.sesionesCumplidas}/{v.sesionesProgramadas} cump.
                      </span>
                    </div>

                    <div className="border-border/40 bg-background/60 rounded-lg border p-2">
                      <span className="text-2xs text-muted-foreground block">Ausencias</span>
                      <span className="text-foreground font-mono text-xs">
                        {v.totalAusencias} ({formatearTiempoMinutos(v.minutosFueraAula)})
                      </span>
                    </div>

                    <div className="border-border/40 bg-background/60 rounded-lg border p-2">
                      <span className="text-2xs text-muted-foreground block">Firma retrasos</span>
                      <span className="text-foreground font-mono text-xs">
                        {formatearTiempoMinutos(v.minutosPerdidosFirma)}
                      </span>
                    </div>
                  </div>

                  {/* Metadatos de autoría y decisión */}
                  <div className="text-2xs text-muted-foreground mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t pt-2">
                    <div>
                      <span>Generado por: </span>
                      <span className="text-foreground font-medium">{v.generadoPorNombre}</span>
                      {v.reabiertoPorNombre && (
                        <span className="ml-2">
                          · Reabierto por:{" "}
                          <span className="text-foreground font-medium">
                            {v.reabiertoPorNombre}
                          </span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span>Decisión: </span>
                      <StatusBadge tone={decisionInfo?.tone ?? "neutral"} size="sm">
                        {decisionLabel}
                      </StatusBadge>
                    </div>
                  </div>

                  {v.observacion && (
                    <p className="text-2xs text-muted-foreground mt-1 italic">
                      Observación: «{v.observacion}»
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="border-border/50 flex justify-end border-t pt-3">
          <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
