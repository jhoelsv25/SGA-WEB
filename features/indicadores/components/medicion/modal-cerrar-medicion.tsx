"use client";

import * as React from "react";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/common/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  Archive02Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { MENSAJES_INDICADORES } from "../../consts";
import { useCerrarMedicionMutation } from "../../hooks/use-indicadores-mutations";
import { cn } from "@/lib/utils";

export interface ModalCerrarMedicionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  periodo: {
    id: string;
    nombre: string;
    estado: string; // "cerrado", "en_curso", "planificado"
  } | null;
  onExito?: () => void;
  onSolicitarNuevaVersion?: () => void;
}

export function ModalCerrarMedicion({
  open,
  onOpenChange,
  periodo,
  onExito,
  onSolicitarNuevaVersion,
}: ModalCerrarMedicionProps) {
  const [errorLocal, setErrorLocal] = React.useState<string | null>(null);
  const cerrarMutation = useCerrarMedicionMutation();

  const handleCerrar = (val: boolean) => {
    if (!val) {
      setErrorLocal(null);
    }
    onOpenChange(val);
  };

  if (!periodo) return null;

  const esBimestreCerrado = periodo.estado === "cerrado";

  const manejarConfirmar = async () => {
    setErrorLocal(null);

    // Validación funcional en cliente previa al envío
    if (!esBimestreCerrado) {
      setErrorLocal(MENSAJES_INDICADORES.BIMESTRE_ABIERTO);
      return;
    }

    await cerrarMutation.mutateAsync(
      { periodoId: periodo.id },
      {
        onSuccess: () => {
          onOpenChange(false);
          onExito?.();
        },
        onError: (err) => {
          const mensajeError = err.message || "Error al cerrar la medición del bimestre.";
          setErrorLocal(mensajeError);
        },
      },
    );
  };

  const yaTieneMedicionCerrada =
    errorLocal === MENSAJES_INDICADORES.MEDICION_YA_CERRADA ||
    Boolean(errorLocal?.includes("ya tiene una medición cerrada"));

  return (
    <Modal
      open={open}
      onOpenChange={handleCerrar}
      title={`Cerrar medición — ${periodo.nombre}`}
      description="Calcula y congela de manera definitiva e inmutable los indicadores CSP, ISA e IGM para la tesis."
      icon={Archive02Icon}
      size="md"
    >
      <div className="space-y-4 pt-1">
        {/* Advertencia si el bimestre no está cerrado */}
        {!esBimestreCerrado && (
          <div className="border-destructive/40 bg-destructive/10 text-destructive flex items-start gap-3 rounded-xl border p-3.5 text-xs">
            <HugeiconsIcon icon={AlertCircleIcon} size={20} className="shrink-0" />
            <div className="space-y-1">
              <p className="font-semibold">{MENSAJES_INDICADORES.BIMESTRE_ABIERTO}</p>
              <p className="text-destructive/90">
                El período se encuentra en estado «{periodo.estado}». Para cerrar la medición
                oficial, el bimestre debe cerrarse previamente en el calendario académico.
              </p>
            </div>
          </div>
        )}

        {/* Explicación de congelamiento inmutable */}
        {esBimestreCerrado && !yaTieneMedicionCerrada && (
          <div className="border-primary/20 bg-primary/5 text-foreground flex items-start gap-3 rounded-xl border p-3.5 text-xs leading-relaxed">
            <HugeiconsIcon
              icon={InformationCircleIcon}
              size={20}
              className="text-primary shrink-0"
            />
            <div className="space-y-1">
              <p className="font-semibold">Congelamiento inmutable (Línea final postest)</p>
              <p className="text-muted-foreground">
                El sistema calculará automáticamente en este instante los 3 indicadores
                institucionales (CSP, ISA, IGM) con sus desgloses detallados. Los datos congelados
                permanecerán inalterados ante futuros cambios de sesiones o materiales, garantizando
                rigurosidad científica en la tesis.
              </p>
            </div>
          </div>
        )}

        {/* Caso especial: el bimestre ya tiene una medición cerrada */}
        {yaTieneMedicionCerrada && (
          <div className="space-y-2 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3.5 text-xs text-amber-900 dark:text-amber-300">
            <div className="flex items-start gap-2.5">
              <HugeiconsIcon icon={AlertCircleIcon} size={20} className="shrink-0" />
              <p className="font-medium">{MENSAJES_INDICADORES.MEDICION_YA_CERRADA}</p>
            </div>
            {onSolicitarNuevaVersion && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onSolicitarNuevaVersion();
                }}
                className="bg-background h-8 w-full border-amber-500/40 text-xs font-semibold hover:bg-amber-500/10"
              >
                Generar nueva versión con motivo
              </Button>
            )}
          </div>
        )}

        {/* Error local alternativo */}
        {errorLocal && !yaTieneMedicionCerrada && !!esBimestreCerrado && (
          <div className="border-destructive/30 bg-destructive/10 text-destructive rounded-xl border p-3 text-xs font-medium">
            {errorLocal}
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex justify-end gap-2.5 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleCerrar(false)}
            disabled={cerrarMutation.isPending}
            className="h-10 gap-1.5 rounded-full px-4.5 text-xs font-semibold"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
            <span>Cancelar</span>
          </Button>

          <Button
            type="button"
            onClick={manejarConfirmar}
            disabled={!esBimestreCerrado || cerrarMutation.isPending || yaTieneMedicionCerrada}
            className={cn(
              "shadow-primary/20 h-10 gap-1.5 rounded-full px-5 text-xs font-semibold shadow-md",
              !esBimestreCerrado && "cursor-not-allowed opacity-50",
            )}
          >
            {cerrarMutation.isPending ? (
              <Spinner className="size-3.5" />
            ) : (
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
            )}
            <span>Confirmar y congelar</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
