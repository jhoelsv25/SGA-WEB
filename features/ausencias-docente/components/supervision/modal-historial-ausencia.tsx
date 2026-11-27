"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon, Time02Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { Spinner } from "@/components/common/spinner";
import { StatusBadge } from "@/components/common/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ETIQUETAS_MOTIVO_AUSENCIA,
  type MotivoAusencia,
} from "@/features/ausencias-docente/consts";
import { useHistorialAusencia } from "@/features/ausencias-docente/hooks";
import type { AusenciaResponseDto } from "@/features/ausencias-docente/types";
import { formatearFechaLimite, formatearMinutos } from "@/features/ausencias-docente/utils";
import { formatDateTime } from "@/lib/formatters/date";
import { GaleriaEvidencias } from "./galeria-evidencias";

interface ModalHistorialAusenciaProps {
  ausencia: AusenciaResponseDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal para visualizar el historial completo de versiones de una ausencia (RF-012 HU2).
 * Muestra versiones de la más reciente a la más antigua, marcando la versión vigente.
 */
export function ModalHistorialAusencia({
  ausencia,
  open,
  onOpenChange,
}: ModalHistorialAusenciaProps) {
  const ausenciaId = ausencia?.id ?? "";
  const { data, isLoading, isError, refetch } = useHistorialAusencia(ausenciaId, open);

  // Ordenar de la versión más reciente a la más antigua (versión DESC)
  const versiones = React.useMemo(() => {
    if (!data?.versiones) return [];
    return [...data.versiones].sort((a, b) => b.version - a.version);
  }, [data]);

  if (!ausencia) return null;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Historial de versiones de la ausencia"
      description="Trazabilidad y registro cronológico de todas las modificaciones aplicadas a este registro."
      icon={Time02Icon}
      size="lg"
    >
      <div className="space-y-4">
        {/* Cabecera contextual */}
        <div className="border-border/60 bg-muted/30 space-y-1 rounded-xl border p-3 text-xs">
          <p className="text-foreground font-semibold">{ausencia.sesion.docenteNombre}</p>
          <p className="text-muted-foreground">
            {formatearFechaLimite(ausencia.sesion.fecha)} · {ausencia.sesion.cursoNombre} (
            {ausencia.sesion.seccionNombre})
          </p>
        </div>

        {/* Estado de carga */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Spinner className="text-primary size-6" />
            <p className="text-muted-foreground mt-2 text-xs">Cargando versiones del registro...</p>
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

        {/* Listado de versiones */}
        {!isLoading && !isError && versiones.length === 0 && (
          <div className="border-border/60 bg-muted/20 text-muted-foreground rounded-xl border p-6 text-center text-xs">
            No se encontraron registros de versiones anteriores para esta ausencia.
          </div>
        )}

        {!isLoading && !isError && versiones.length > 0 && (
          <div className="space-y-3">
            {versiones.map((v) => {
              const etiquetaMotivo =
                ETIQUETAS_MOTIVO_AUSENCIA[v.motivo as MotivoAusencia] ?? v.motivo;

              return (
                <div
                  key={v.version}
                  className={`border-border/70 rounded-xl border p-3.5 shadow-2xs transition-all ${
                    v.vigente
                      ? "bg-card border-primary/40 ring-primary/20 ring-1"
                      : "bg-muted/30 opacity-90"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground text-xs font-bold">Versión {v.version}</span>
                      {v.vigente ? (
                        <StatusBadge tone="success" dot size="sm">
                          Vigente
                        </StatusBadge>
                      ) : (
                        <Badge variant="outline" className="text-2xs text-muted-foreground">
                          Anterior
                        </Badge>
                      )}
                    </div>
                    <span className="text-2xs text-muted-foreground font-mono">
                      {formatDateTime(v.registradoEn)}
                    </span>
                  </div>

                  <div className="mt-2.5 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                    <div>
                      <span className="text-muted-foreground">Tramo y tiempo: </span>
                      <span className="text-foreground font-mono font-semibold">
                        {v.horaDesde} a {v.horaHasta} ({formatearMinutos(v.minutos)})
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground">Motivo: </span>
                      <span className="text-foreground font-medium">{etiquetaMotivo}</span>
                    </div>

                    <div className="sm:col-span-2">
                      <span className="text-muted-foreground">Registrado por: </span>
                      <span className="text-foreground font-medium">
                        {v.registradoPor.nombreCompleto}
                      </span>
                    </div>

                    {v.observacion && (
                      <div className="sm:col-span-2">
                        <span className="text-muted-foreground">Observación: </span>
                        <span className="text-foreground">{v.observacion}</span>
                      </div>
                    )}
                  </div>

                  {/* Motivo del cambio obligatorio */}
                  {v.motivoCambio && (
                    <div className="border-border/50 bg-background mt-2.5 rounded-lg border p-2 text-xs">
                      <p className="text-primary font-semibold">Motivo del cambio:</p>
                      <p className="text-foreground">{v.motivoCambio}</p>
                    </div>
                  )}

                  {/* Fotos adjuntas en esta versión */}
                  {v.fotos && v.fotos.length > 0 && (
                    <div className="border-border/40 mt-3 border-t pt-2">
                      <p className="text-2xs text-muted-foreground mb-1 font-semibold">
                        Evidencias de esta versión ({v.fotos.length}):
                      </p>
                      <GaleriaEvidencias fotos={v.fotos} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="border-border/50 flex justify-end border-t pt-3">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
