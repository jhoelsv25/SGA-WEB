"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { StatusBadge } from "@/components/common/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ETIQUETAS_MOTIVO_AUSENCIA } from "@/features/ausencias-docente/consts";
import type { AusenciaResponseDto } from "@/features/ausencias-docente/types";
import { formatearFechaLimite, formatearMinutos } from "@/features/ausencias-docente/utils";
import { formatDateTime } from "@/lib/formatters/date";
import { GaleriaEvidencias } from "./galeria-evidencias";

interface ModalDetalleAusenciaProps {
  ausencia: AusenciaResponseDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal para ver el detalle integral de una ausencia docente supervisada (RF-012 HU2 y HU4).
 * Presenta información de la sesión, evidencias fotográficas y el descargo del docente.
 */
export function ModalDetalleAusencia({ ausencia, open, onOpenChange }: ModalDetalleAusenciaProps) {
  if (!ausencia) return null;

  const etiquetaMotivo = ETIQUETAS_MOTIVO_AUSENCIA[ausencia.motivo] ?? ausencia.motivo;
  const fechaLimite =
    ausencia.fechaLimiteDescargoFormateada || formatearFechaLimite(ausencia.fechaLimiteDescargo);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Detalle de ausencia docente"
      description="Consulta integral del registro de ausencia, evidencias y descargos remitidos."
      icon={ViewIcon}
      size="lg"
    >
      <div className="space-y-4">
        {/* Cabecera con estado y datos de sesión */}
        <div className="border-border/60 bg-card flex flex-col gap-3 rounded-xl border p-4 shadow-2xs">
          <div className="flex flex-wrap items-start justify-between gap-2 border-b pb-3">
            <div>
              <p className="text-foreground text-sm font-bold">{ausencia.sesion.docenteNombre}</p>
              <p className="text-muted-foreground text-xs">
                {ausencia.sesion.cursoNombre} · Sección {ausencia.sesion.seccionNombre}
              </p>
            </div>
            <div>
              {ausencia.anulada ? (
                <StatusBadge tone="danger" dot>
                  Anulada
                </StatusBadge>
              ) : ausencia.vigente ? (
                <StatusBadge tone="success" dot>
                  Vigente (v{ausencia.version})
                </StatusBadge>
              ) : (
                <StatusBadge tone="neutral" dot>
                  Versión anterior (v{ausencia.version})
                </StatusBadge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2.5 text-xs sm:grid-cols-2">
            <div>
              <span className="text-muted-foreground">Fecha de la sesión: </span>
              <span className="text-foreground font-semibold">
                {formatearFechaLimite(ausencia.sesion.fecha)}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground">Horario programado: </span>
              <span className="text-foreground font-mono">
                {ausencia.sesion.horaInicio} a {ausencia.sesion.horaFin}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground">Tramo de ausencia: </span>
              <span className="text-foreground font-mono font-semibold">
                {ausencia.horaDesde} a {ausencia.horaHasta}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground">Minutos computados: </span>
              <Badge variant="secondary" className="font-mono text-xs">
                {formatearMinutos(ausencia.minutos)}
              </Badge>
            </div>

            <div>
              <span className="text-muted-foreground">Motivo: </span>
              <span className="text-foreground font-medium">{etiquetaMotivo}</span>
            </div>

            <div>
              <span className="text-muted-foreground">Registrado por: </span>
              <span className="text-foreground">{ausencia.registradoPor.nombreCompleto}</span>
            </div>

            <div className="sm:col-span-2">
              <span className="text-muted-foreground">Fecha y hora de registro: </span>
              <span className="text-foreground font-mono">
                {formatDateTime(ausencia.registradoEn)}
              </span>
            </div>

            {ausencia.observacion && (
              <div className="border-border/40 bg-muted/30 rounded-lg border p-2.5 sm:col-span-2">
                <span className="text-foreground font-semibold">Observación: </span>
                <p className="text-foreground mt-0.5 leading-relaxed">{ausencia.observacion}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sección de Anulación si corresponde */}
        {ausencia.anulada && (
          <div className="border-destructive/30 bg-destructive/5 space-y-1 rounded-xl border p-3.5 text-xs">
            <div className="text-destructive flex items-center gap-2 font-semibold">
              <HugeiconsIcon icon={Alert02Icon} className="size-4" />
              <span>Registro anulado</span>
            </div>
            {ausencia.anuladaEn && (
              <p className="text-muted-foreground">
                Fecha de anulación: {formatDateTime(ausencia.anuladaEn)}
              </p>
            )}
            {ausencia.motivoAnulacion && (
              <p className="text-foreground mt-1">
                <span className="font-medium">Motivo:</span> {ausencia.motivoAnulacion}
              </p>
            )}
          </div>
        )}

        {/* Sección de Descargo del Docente con tokens semánticos */}
        <div className="border-border/60 bg-card space-y-2 rounded-xl border p-4 shadow-2xs">
          <p className="text-foreground text-xs font-bold">Descargo del docente</p>

          {ausencia.descargo ? (
            <div className="border-success/30 bg-success/10 space-y-1.5 rounded-lg border p-3 text-xs">
              <div className="text-success flex items-center gap-1.5 font-semibold">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4" />
                <span>Descargo remitido</span>
              </div>
              <p className="text-foreground leading-relaxed italic">«{ausencia.descargo}»</p>
              {ausencia.descargoEn && (
                <p className="text-2xs text-muted-foreground font-mono">
                  Registrado el {formatDateTime(ausencia.descargoEn)}
                </p>
              )}
            </div>
          ) : (
            <div className="border-border/50 bg-muted/20 text-muted-foreground flex items-start gap-2.5 rounded-lg border p-3 text-xs">
              <HugeiconsIcon icon={Clock01Icon} className="text-warning mt-0.5 size-4 shrink-0" />
              <div>
                <p className="text-foreground font-medium">Sin descargo presentado</p>
                <p className="text-2xs mt-0.5">
                  {ausencia.puedeDescargar
                    ? `El docente se encuentra dentro del plazo de 7 días para presentar su descargo (hasta el ${fechaLimite}).`
                    : `El plazo para que el docente presente su descargo venció el ${fechaLimite}.`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Evidencias fotográficas */}
        <div className="border-border/60 bg-card space-y-2.5 rounded-xl border p-4 shadow-2xs">
          <p className="text-foreground text-xs font-bold">
            Evidencias fotográficas ({ausencia.fotos?.length ?? 0})
          </p>
          <GaleriaEvidencias fotos={ausencia.fotos ?? []} />
        </div>

        <div className="border-border/50 flex justify-end border-t pt-3">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
