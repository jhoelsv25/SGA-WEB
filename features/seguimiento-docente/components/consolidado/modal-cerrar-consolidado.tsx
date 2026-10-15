"use client";

import * as React from "react";
import { LockKeyIcon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MENSAJES_CONSOLIDADO } from "../../consts";
import { useCerrarConsolidado } from "../../hooks";
import type { ConsolidadoResumenDto } from "../../types";

export interface ModalCerrarConsolidadoProps {
  consolidado: ConsolidadoResumenDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface FormularioCerrarProps {
  consolidado: ConsolidadoResumenDto;
  onCerrar: () => void;
  onSuccess?: () => void;
}

function FormularioCerrar({ consolidado, onCerrar, onSuccess }: FormularioCerrarProps) {
  const [motivoCambio, setMotivoCambio] = React.useState("");
  const [errorValidacion, setErrorValidacion] = React.useState<string | null>(null);

  const cerrarMutation = useCerrarConsolidado();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const motivoLimpio = motivoCambio.trim();
    if (!motivoLimpio) {
      setErrorValidacion(MENSAJES_CONSOLIDADO.NUEVO_CIERRE_SIN_MOTIVO);
      return;
    }

    try {
      await cerrarMutation.mutateAsync({
        id: consolidado.id,
        dto: { motivoCambio: motivoLimpio },
      });
      onCerrar();
      onSuccess?.();
    } catch {
      // El error ya es capturado y emitido por useCerrarConsolidado vía toast
    }
  };

  const isPending = cerrarMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="motivo-cambio" className="text-foreground text-xs font-semibold">
          Motivo del cambio <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="motivo-cambio"
          placeholder="Ej: Ausencia anulada tras revisión institucional o corrección de sesiones..."
          value={motivoCambio}
          onChange={(e) => {
            setMotivoCambio(e.target.value);
            if (errorValidacion) setErrorValidacion(null);
          }}
          disabled={isPending}
          rows={4}
          maxLength={500}
          className={`resize-none text-xs ${
            errorValidacion ? "border-destructive focus-visible:ring-destructive/20" : ""
          }`}
          aria-invalid={Boolean(errorValidacion)}
          aria-describedby={errorValidacion ? "motivo-error" : undefined}
        />
        <div className="text-2xs text-muted-foreground flex items-center justify-between">
          {errorValidacion ? (
            <span id="motivo-error" className="text-destructive font-medium">
              {errorValidacion}
            </span>
          ) : (
            <span>Obligatorio para la trazabilidad del versionado.</span>
          )}
          <span className="font-mono">{motivoCambio.length}/500</span>
        </div>
      </div>

      <div className="border-border/50 flex items-center justify-end gap-2 border-t pt-3">
        <Button type="button" variant="outline" size="sm" onClick={onCerrar} disabled={isPending}>
          Cancelar
        </Button>

        <Button
          type="submit"
          variant="default"
          size="sm"
          disabled={isPending}
          aria-busy={isPending}
        >
          {isPending && <Spinner className="mr-1.5 size-3.5" />}
          <span>Cerrar consolidado</span>
        </Button>
      </div>
    </form>
  );
}

/**
 * Modal para volver a cerrar un consolidado reabierto (RF-013 HU2).
 * Exige el motivo del cambio para crear la versión recalculada (CP-RF013-08, CP-RF013-09).
 */
export function ModalCerrarConsolidado({
  consolidado,
  open,
  onOpenChange,
  onSuccess,
}: ModalCerrarConsolidadoProps) {
  if (!consolidado) return null;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Cerrar consolidado y generar nueva versión"
      description={`Se recalcularán las firmas y ausencias vigentes del docente ${consolidado.docenteNombre}. La versión actual (v${consolidado.version}) pasará a no vigente.`}
      icon={LockKeyIcon}
      size="md"
    >
      <FormularioCerrar
        key={consolidado.id}
        consolidado={consolidado}
        onCerrar={() => onOpenChange(false)}
        onSuccess={onSuccess}
      />
    </Modal>
  );
}
