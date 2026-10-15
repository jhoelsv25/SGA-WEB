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
import { useReabrirConsolidadoMutation } from "../../hooks";
import { reabrirConsolidadoSchema, type ReabrirConsolidadoFormValues } from "../../schemas";
import type { ConsolidadoResumenItem } from "../../types";

export interface FormularioReabrirConsolidadoProps {
  consolidado: ConsolidadoResumenItem;
  onCerrar: () => void;
}

export function FormularioReabrirConsolidado({
  consolidado,
  onCerrar,
}: FormularioReabrirConsolidadoProps) {
  const { mutateAsync: reabrir, isPending } = useReabrirConsolidadoMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReabrirConsolidadoFormValues>({
    resolver: zodResolver(reabrirConsolidadoSchema),
    defaultValues: {
      motivoReapertura: "",
    },
  });

  const onSubmit = async (_values: ReabrirConsolidadoFormValues) => {
    await reabrir(consolidado.id);
    onCerrar();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Resumen institucional */}
      <div className="border-border/60 bg-muted/30 space-y-1 rounded-xl border p-3.5 text-xs">
        <p className="text-foreground font-semibold">{consolidado.docenteNombre}</p>
        <p className="text-muted-foreground">
          {consolidado.periodoNombre} · Versión actual: {consolidado.version}
        </p>
      </div>

      {/* Alerta de desbloqueo */}
      <div className="border-warning/30 bg-warning/10 text-foreground flex items-start gap-2.5 rounded-xl border p-3 text-xs">
        <HugeiconsIcon icon={AlertCircleIcon} className="text-warning mt-0.5 size-4 shrink-0" />
        <p>
          Al reabrir el consolidado, se desbloquearán las sesiones y ausencias del docente en este
          bimestre para permitir correcciones o justificaciones autorizadas. Al concluir deberá
          cerrarlo generando una nueva versión.
        </p>
      </div>

      {/* Motivo de reapertura */}
      <div className="space-y-1.5">
        <Label htmlFor="motivoReapertura" className="text-foreground text-sm font-medium">
          Motivo de la reapertura *
        </Label>
        <Textarea
          id="motivoReapertura"
          rows={3}
          placeholder="Indique la justificación para reabrir este consolidado..."
          disabled={isPending}
          aria-invalid={Boolean(errors.motivoReapertura)}
          className="resize-none text-xs"
          {...register("motivoReapertura")}
        />
        {errors.motivoReapertura && (
          <p className="text-destructive text-xs font-medium">{errors.motivoReapertura.message}</p>
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
        <Button type="submit" variant="default" disabled={isPending} className="gap-1.5">
          {isPending ? (
            <Spinner className="size-3.5" />
          ) : (
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
          )}
          <span>Confirmar reapertura</span>
        </Button>
      </div>
    </form>
  );
}
