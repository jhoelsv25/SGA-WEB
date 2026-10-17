"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/common/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  RepeatIcon,
} from "@hugeicons/core-free-icons";
import { MENSAJES_INDICADORES } from "../../consts";
import { useNuevaVersionMedicionMutation } from "../../hooks/use-indicadores-mutations";
import type { NuevaVersionMedicionDto } from "../../types";

export interface ModalNuevaVersionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medicion: {
    id: string;
    periodoNombre: string;
    versionActual: number;
  } | null;
  onExito?: () => void;
}

interface FormValues {
  motivoCambio: string;
}

export function ModalNuevaVersion({
  open,
  onOpenChange,
  medicion,
  onExito,
}: ModalNuevaVersionProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { motivoCambio: "" },
  });

  const nuevaVersionMutation = useNuevaVersionMedicionMutation();

  React.useEffect(() => {
    if (open) {
      reset({ motivoCambio: "" });
      clearErrors();
    }
  }, [open, reset, clearErrors]);

  if (!medicion) return null;

  const nuevaVersionNumero = medicion.versionActual + 1;

  const manejarEnvio = async (valores: FormValues) => {
    clearErrors();

    if (!valores.motivoCambio || !valores.motivoCambio.trim()) {
      setError("motivoCambio", {
        message: MENSAJES_INDICADORES.NUEVA_VERSION_SIN_MOTIVO,
      });
      return;
    }

    const dto: NuevaVersionMedicionDto = {
      motivoCambio: valores.motivoCambio.trim(),
    };

    await nuevaVersionMutation.mutateAsync(
      { id: medicion.id, dto },
      {
        onSuccess: () => {
          onOpenChange(false);
          onExito?.();
        },
      },
    );
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={`Nueva versión — ${medicion.periodoNombre} (v${nuevaVersionNumero})`}
      description="Recalcula y congela una nueva versión histórica de la medición justificando el motivo del cambio."
      icon={RepeatIcon}
      size="md"
    >
      <form onSubmit={handleSubmit(manejarEnvio)} className="space-y-4 pt-1" noValidate>
        {/* Información metodológica */}
        <div className="border-primary/20 bg-primary/5 text-foreground flex items-start gap-3 rounded-xl border p-3.5 text-xs leading-relaxed">
          <HugeiconsIcon icon={InformationCircleIcon} size={20} className="text-primary shrink-0" />
          <div className="space-y-1">
            <p className="font-semibold">Versionado formal de la medición</p>
            <p className="text-muted-foreground">
              La versión vigente actual (v{medicion.versionActual}) pasará a histórico con vigencia
              inactiva (vigencia 0). El sistema recalculará los indicadores con los datos actuales y
              registrará la versión v{nuevaVersionNumero} como vigente.
            </p>
          </div>
        </div>

        {/* Motivo de cambio obligatorio */}
        <div className="space-y-1.5">
          <Label htmlFor="motivoCambio" className="text-foreground text-sm font-medium">
            Motivo de la nueva versión *
          </Label>
          <Textarea
            id="motivoCambio"
            rows={3}
            maxLength={500}
            placeholder="Ej. Justificaciones aprobadas tarde / Regularización de sesiones rezagadas"
            disabled={nuevaVersionMutation.isPending}
            aria-invalid={Boolean(errors.motivoCambio)}
            {...register("motivoCambio", {
              required: MENSAJES_INDICADORES.NUEVA_VERSION_SIN_MOTIVO,
              maxLength: { value: 500, message: "El motivo no puede superar los 500 caracteres." },
            })}
          />
          <p className="text-muted-foreground text-xs">
            Indica claramente por qué se requiere recalcular y congelar esta nueva versión.
          </p>
          {errors.motivoCambio && (
            <p className="text-destructive text-xs font-medium">{errors.motivoCambio.message}</p>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-2.5 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={nuevaVersionMutation.isPending}
            className="h-10 gap-1.5 rounded-full px-4.5 text-xs font-semibold"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
            <span>Cancelar</span>
          </Button>

          <Button
            type="submit"
            disabled={nuevaVersionMutation.isPending}
            className="shadow-primary/20 h-10 gap-1.5 rounded-full px-5 text-xs font-semibold shadow-md"
          >
            {nuevaVersionMutation.isPending ? (
              <Spinner className="size-3.5" />
            ) : (
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
            )}
            <span>Generar versión {nuevaVersionNumero}</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}
