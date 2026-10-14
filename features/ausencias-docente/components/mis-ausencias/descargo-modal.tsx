"use client";

import * as React from "react";
import { AlertCircleIcon, CheckmarkCircle02Icon, FileEditIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/formatters/date";
import { MENSAJES_AUSENCIA } from "../../consts";
import { usePresentarDescargo } from "../../hooks";
import type { AusenciaResponseDto } from "../../types";
import { esDescargoPermitido, formatearFechaLimite } from "../../utils";
import { DescargoForm } from "./descargo-form";
import type { DescargoFormValues } from "./descargo.schema";

interface DescargoModalProps {
  ausencia: AusenciaResponseDto | null;
  abierto: boolean;
  onOpenChange: (abierto: boolean) => void;
  onDescargoExitoso?: () => void;
}

/**
 * Modal contenedor para la presentación o visualización del descargo docente (HU3).
 */
export function DescargoModal({
  ausencia,
  abierto,
  onOpenChange,
  onDescargoExitoso,
}: DescargoModalProps) {
  const presentarDescargoMutation = usePresentarDescargo();
  if (!ausencia) return null;

  const fechaLimite =
    ausencia.fechaLimiteDescargoFormateada ?? formatearFechaLimite(ausencia.fechaLimiteDescargo);
  const puedePresentar = esDescargoPermitido(ausencia);

  const handleEnviar = (valores: DescargoFormValues) => {
    presentarDescargoMutation.mutate(
      { id: ausencia.id, dto: valores },
      {
        onSuccess: () => {
          onDescargoExitoso?.();
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Modal
      open={abierto}
      onOpenChange={onOpenChange}
      title={ausencia.descargo !== null ? "Descargo registrado" : "Presentar descargo"}
      description={`${ausencia.sesion.cursoNombre} · ${ausencia.sesion.seccionNombre} (${ausencia.horaDesde} a ${ausencia.horaHasta})`}
      icon={FileEditIcon}
      size="lg"
    >
      <div className="space-y-4 py-1">
        {ausencia.anulada && (
          <div className="border-destructive/20 bg-destructive/10 text-destructive flex items-start gap-3 rounded-2xl border p-4 text-xs">
            <HugeiconsIcon icon={AlertCircleIcon} className="mt-0.5 size-4 shrink-0" />
            <div>
              <p className="font-semibold">Ausencia anulada</p>
              <p className="mt-1">
                Esta ausencia fue anulada por la Dirección. No requiere descargo.
              </p>
            </div>
          </div>
        )}

        {!ausencia.anulada && ausencia.descargo !== null && (
          <div className="space-y-3">
            <div className="border-success/30 bg-success/10 text-success-text flex items-start gap-3 rounded-2xl border p-4 text-xs">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="mt-0.5 size-4 shrink-0" />
              <div>
                <p className="font-semibold">Su descargo ya fue presentado</p>
                <p className="text-muted-foreground">
                  Registrado el{" "}
                  <span className="text-foreground font-medium">
                    {formatDateTime(ausencia.descargoEn)}
                  </span>
                  .
                </p>
              </div>
            </div>

            <div className="border-border/70 bg-card rounded-2xl border p-4 shadow-2xs">
              <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Texto del descargo registrado
              </p>
              <p className="text-foreground mt-2 text-sm whitespace-pre-wrap">
                {ausencia.descargo}
              </p>
            </div>

            <p className="text-muted-foreground text-center text-xs">
              {MENSAJES_AUSENCIA.DESCARGO_REPETIDO}
            </p>

            <div className="flex justify-end pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-10 min-h-10 rounded-full px-5 text-xs font-semibold"
              >
                Cerrar
              </Button>
            </div>
          </div>
        )}

        {!ausencia.anulada && ausencia.descargo === null && !puedePresentar && (
          <div className="space-y-4">
            <div className="border-destructive/20 bg-destructive/10 text-destructive flex items-start gap-3 rounded-2xl border p-4 text-xs">
              <HugeiconsIcon icon={AlertCircleIcon} className="mt-0.5 size-4 shrink-0" />
              <div>
                <p className="font-semibold">Plazo vencido</p>
                <p className="mt-1">{MENSAJES_AUSENCIA.DESCARGO_FUERA_DE_PLAZO(fechaLimite)}</p>
                <p className="text-muted-foreground mt-1">
                  El periodo de 7 días calendario para presentar su versión ha concluido.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-10 min-h-10 rounded-full px-5 text-xs font-semibold"
              >
                Cerrar
              </Button>
            </div>
          </div>
        )}

        {!ausencia.anulada && ausencia.descargo === null && puedePresentar && (
          <DescargoForm
            fechaLimite={fechaLimite}
            cargando={presentarDescargoMutation.isPending}
            onSubmit={handleEnviar}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </div>
    </Modal>
  );
}
