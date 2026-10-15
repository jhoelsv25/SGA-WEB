"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCerrarConsolidadoMutation } from "../../hooks";
import { cerrarConsolidadoSchema, type CerrarConsolidadoFormValues } from "../../schemas";
import type { ConsolidadoResumenItem } from "../../types";

export interface FormularioCerrarConsolidadoProps {
  consolidado: ConsolidadoResumenItem;
  onCerrar: () => void;
}

export function FormularioCerrarConsolidado({
  consolidado,
  onCerrar,
}: FormularioCerrarConsolidadoProps) {
  const { mutateAsync: cerrar, isPending } = useCerrarConsolidadoMutation();
  const requiereMotivo = consolidado.version >= 1;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CerrarConsolidadoFormValues>({
    resolver: zodResolver(cerrarConsolidadoSchema),
    defaultValues: {
      motivoCambio: "",
    },
  });

  const onSubmit = async (values: CerrarConsolidadoFormValues) => {
    if (requiereMotivo && (!values.motivoCambio || values.motivoCambio.trim().length < 5)) {
      setError("motivoCambio", {
        type: "manual",
        message:
          "Indique el motivo del cambio o ajuste para generar la nueva versión (mínimo 5 caracteres).",
      });
      return;
    }

    await cerrar({
      id: consolidado.id,
      dto: {
        motivoCambio: values.motivoCambio?.trim() || undefined,
      },
    });
    onCerrar();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Resumen institucional */}
      <div className="border-border/60 bg-muted/30 space-y-1 rounded-xl border p-3.5 text-xs">
        <p className="text-foreground font-semibold">{consolidado.docenteNombre}</p>
        <p className="text-muted-foreground">
          {consolidado.periodoNombre} · Versión actual: v{consolidado.version} → Nueva versión: v
          {consolidado.version + 1}
        </p>
      </div>

      {/* Alerta de bloqueo */}
      <div className="border-warning/30 bg-warning/10 text-foreground flex items-start gap-2.5 rounded-xl border p-3 text-xs">
        <HugeiconsIcon icon={AlertCircleIcon} className="text-warning mt-0.5 size-4 shrink-0" />
        <p>
          Al cerrar el consolidado, se congelarán las sesiones y ausencias del docente en este
          bimestre. El estado pasará a <strong>CERRADO</strong> y las modificaciones quedarán
          bloqueadas en el registro de sesiones y ausencias.
        </p>
      </div>

      {/* Motivo de cambio */}
      <div className="space-y-1.5">
        <Label htmlFor="motivoCambio" className="text-foreground text-sm font-medium">
          {requiereMotivo ? "Motivo del cambio o reajuste *" : "Nota de cierre (Opcional)"}
        </Label>
        <Textarea
          id="motivoCambio"
          rows={3}
          placeholder={
            requiereMotivo
              ? "Detalle qué correcciones o justificaciones motivaron la nueva versión..."
              : "Observaciones de cierre bimestral..."
          }
          disabled={isPending}
          aria-invalid={Boolean(errors.motivoCambio)}
          className="resize-none text-xs"
          {...register("motivoCambio")}
        />
        {errors.motivoCambio && (
          <p className="text-destructive text-xs font-medium">{errors.motivoCambio.message}</p>
        )}
      </div>

      {/* Botones de acción */}
      <div className="border-border/50 flex justify-end gap-2.5 border-t pt-3">
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={onCerrar}
          className="gap-1.5"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
          <span>Cancelar</span>
        </Button>
        <Button type="submit" disabled={isPending} className="gap-1.5">
          {isPending ? (
            <Spinner className="size-3.5" />
          ) : (
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
          )}
          <span>Confirmar cierre y versionar</span>
        </Button>
      </div>
    </form>
  );
}
