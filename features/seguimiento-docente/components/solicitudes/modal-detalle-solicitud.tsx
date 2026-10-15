"use client";

import * as React from "react";
import {
  Calendar01Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  FileEditIcon,
  InformationCircleIcon,
  UserCircle02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Modal } from "@/components/common/modal";
import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/formatters/date";
import { useDetalleConsolidado } from "../../hooks";
import type { SolicitudRevisionResponseDto } from "../../types";
import {
  formatearTiempoMinutos,
  obtenerEtiquetaDecision,
  obtenerEtiquetaEstadoConsolidado,
  VARIANTES_ESTADO_SOLICITUD,
} from "../../utils";
import { VisorAdjuntoSolicitud } from "./visor-adjunto-solicitud";

export interface ModalDetalleSolicitudProps {
  solicitud: SolicitudRevisionResponseDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAceptar?: (solicitud: SolicitudRevisionResponseDto) => void;
  onRechazar?: (solicitud: SolicitudRevisionResponseDto) => void;
}

/**
 * Modal de consulta detallada de una solicitud de revisión:
 * - Motivo expuesto por el docente.
 * - Archivo adjunto (vista previa y descarga).
 * - Datos del consolidado asociado (versión, estado y métricas consolidadas).
 * - Historial o formulario de resolución directiva.
 */
export function ModalDetalleSolicitud({
  solicitud,
  open,
  onOpenChange,
  onAceptar,
  onRechazar,
}: ModalDetalleSolicitudProps) {
  const consolidadoId = solicitud?.consolidadoId;
  const { data: consolidado, isLoading: cargandoConsolidado } = useDetalleConsolidado(
    consolidadoId,
    Boolean(open && consolidadoId),
  );

  if (!solicitud) return null;

  const configEstado = VARIANTES_ESTADO_SOLICITUD[solicitud.estado];
  const estaPendiente = solicitud.estado === "solicitada";

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Detalle de solicitud de revisión"
      description={`Solicitud emitida por ${solicitud.docenteNombre} sobre el ${solicitud.periodoNombre}.`}
      icon={FileEditIcon}
      size="2xl"
    >
      <div className="space-y-4 text-xs">
        {/* Ficha resumen del docente y estado */}
        <div className="border-border/70 bg-muted/30 flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3.5">
          <div className="flex items-center gap-3">
            <div className="border-border/60 bg-background text-foreground flex size-10 shrink-0 items-center justify-center rounded-full border">
              <HugeiconsIcon icon={UserCircle02Icon} className="text-muted-foreground size-5" />
            </div>
            <div>
              <p className="text-foreground text-sm font-bold">{solicitud.docenteNombre}</p>
              <p className="text-muted-foreground text-2xs font-mono">
                Documento: {solicitud.docenteDocumento}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="text-muted-foreground text-2xs flex items-center gap-1.5">
              <HugeiconsIcon icon={Calendar01Icon} className="size-3.5" />
              <span>{solicitud.periodoNombre}</span>
            </div>
            <div className="text-muted-foreground text-2xs flex items-center gap-1.5">
              <HugeiconsIcon icon={Clock01Icon} className="size-3.5" />
              <span>{formatDate(solicitud.creadoEn)}</span>
            </div>
            <StatusBadge tone={configEstado.tone} dot size="sm">
              {configEstado.label}
            </StatusBadge>
          </div>
        </div>

        {/* Motivo expuesto por el docente */}
        <div className="border-border/70 bg-card space-y-1.5 rounded-xl border p-3.5 shadow-2xs">
          <p className="text-foreground text-xs font-bold">Motivo de la solicitud</p>
          <div className="border-border/40 bg-muted/20 rounded-lg border p-3">
            <p className="text-foreground leading-relaxed whitespace-pre-wrap italic">
              «{solicitud.motivo}»
            </p>
          </div>
        </div>

        {/* Archivo adjunto presentado */}
        <div className="space-y-1.5">
          <p className="text-foreground text-xs font-bold">Archivo adjunto de sustento</p>
          <VisorAdjuntoSolicitud
            adjuntoUrl={solicitud.adjuntoUrl}
            adjuntoNombre={solicitud.adjuntoNombre}
          />
        </div>

        {/* Datos y totales del consolidado asociado */}
        <div className="border-border/70 bg-card space-y-3 rounded-xl border p-3.5 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={InformationCircleIcon} className="text-primary size-4" />
              <p className="text-foreground text-xs font-bold">Datos del consolidado docente</p>
            </div>
            {consolidado && (
              <div className="text-2xs flex items-center gap-2">
                <span className="border-border bg-muted/60 text-foreground rounded-md border px-2 py-0.5 font-semibold">
                  Versión {consolidado.version}
                </span>
                <span className="border-border bg-muted/60 text-muted-foreground rounded-md border px-2 py-0.5">
                  Estado: {obtenerEtiquetaEstadoConsolidado(consolidado.estado)}
                </span>
              </div>
            )}
          </div>

          {cargandoConsolidado ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <Skeleton key={`skeleton-cons-${idx}`} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : consolidado ? (
            <div className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <div className="border-border/50 bg-muted/20 rounded-lg border p-2.5">
                  <p className="text-muted-foreground text-2xs font-medium">Sesiones programadas</p>
                  <p className="text-foreground text-sm font-bold">
                    {consolidado.sesionesProgramadas}
                  </p>
                </div>
                <div className="border-border/50 bg-muted/20 rounded-lg border p-2.5">
                  <p className="text-muted-foreground text-2xs font-medium">
                    Cumplidas / Parciales
                  </p>
                  <p className="text-foreground text-sm font-bold">
                    {consolidado.sesionesCumplidas} / {consolidado.sesionesParciales}
                  </p>
                </div>
                <div className="border-border/50 bg-muted/20 rounded-lg border p-2.5">
                  <p className="text-muted-foreground text-2xs font-medium">
                    No cumplidas / Justif.
                  </p>
                  <p className="text-foreground text-sm font-bold">
                    {consolidado.sesionesNoCumplidas} / {consolidado.sesionesJustificadas}
                  </p>
                </div>
                <div className="border-primary/25 bg-primary/8 rounded-lg border p-2.5">
                  <p className="text-primary text-2xs font-semibold">Tiempo fuera de clase</p>
                  <p className="text-foreground text-sm font-extrabold">
                    {consolidado.tiempoFueraClaseTexto ||
                      formatearTiempoMinutos(consolidado.totalMinutosFueraClase)}
                  </p>
                </div>
              </div>

              <div className="border-border/40 bg-muted/15 text-2xs text-muted-foreground flex flex-wrap items-center justify-between gap-2 rounded-lg border p-2">
                <span>
                  Minutos perdidos por firma:{" "}
                  <strong>{consolidado.minutosPerdidosFirma} min</strong>
                </span>
                <span>
                  Ausencias vigentes: <strong>{consolidado.totalAusencias}</strong> (
                  {consolidado.minutosFueraAula} min fuera de aula)
                </span>
                <span>
                  Decisión: <strong>{obtenerEtiquetaDecision(consolidado.decision)}</strong>
                </span>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-2xs italic">
              No fue posible cargar el detalle del consolidado.
            </p>
          )}
        </div>

        {/* Sección de resolución directiva */}
        {!estaPendiente ? (
          <div className="border-border/70 bg-card space-y-2 rounded-xl border p-3.5 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-1.5 border-b pb-2">
              <p className="text-foreground text-xs font-bold">
                Resolución directiva registrada (Solo lectura)
              </p>
              <StatusBadge tone={configEstado.tone} size="sm">
                {configEstado.label}
              </StatusBadge>
            </div>
            <div className="space-y-1.5">
              <p className="text-muted-foreground text-2xs">
                Resuelta por:{" "}
                <strong className="text-foreground">
                  {solicitud.resueltaPorNombre || "Director de la institución"}
                </strong>
                {solicitud.resueltaEn && <> · {formatDate(solicitud.resueltaEn)}</>}
              </p>
              <div className="border-border/40 bg-muted/20 rounded-lg border p-2.5">
                <p className="text-muted-foreground text-2xs font-semibold tracking-wider uppercase">
                  Respuesta enviada al docente:
                </p>
                <p className="text-foreground mt-1 leading-relaxed whitespace-pre-wrap">
                  {solicitud.respuesta || "Sin fundamentación textual registrada."}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="border-warning/30 bg-warning/8 flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3.5">
            <div>
              <p className="text-warning-text text-xs font-bold">Solicitud pendiente de atención</p>
              <p className="text-muted-foreground text-2xs mt-0.5">
                Puede aceptar la solicitud para reabrir el consolidado o rechazarla con una
                respuesta fundamentada.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {onRechazar && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onOpenChange(false);
                    onRechazar(solicitud);
                  }}
                  className="text-destructive hover:bg-destructive/10 h-8 gap-1.5 px-3 text-xs font-semibold"
                >
                  <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
                  <span>Rechazar</span>
                </Button>
              )}
              {onAceptar && (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    onOpenChange(false);
                    onAceptar(solicitud);
                  }}
                  className="h-8 gap-1.5 px-3 text-xs font-semibold"
                >
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
                  <span>Aceptar y reabrir</span>
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Pie del modal con botón de cierre */}
        <div className="flex justify-end border-t pt-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-9 px-4 text-xs font-semibold"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
