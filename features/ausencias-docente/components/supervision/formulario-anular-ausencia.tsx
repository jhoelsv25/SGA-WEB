"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAnularAusencia } from "@/features/ausencias-docente/hooks";
import type { AusenciaResponseDto } from "@/features/ausencias-docente/types";
import { formatearFechaLimite } from "@/features/ausencias-docente/utils";
import { anularAusenciaSchema, type AnularAusenciaFormValues } from "./anulacion.schema";

export interface FormularioAnularAusenciaProps {
  ausencia: AusenciaResponseDto;
  onCerrar: () => void;
}

/**
 * Formulario desacoplado con React Hook Form y Zod para anulación de ausencia docente.
 */
export function FormularioAnularAusencia({ ausencia, onCerrar }: FormularioAnularAusenciaProps) {
  const anularMutation = useAnularAusencia();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnularAusenciaFormValues>({
    resolver: zodResolver(anularAusenciaSchema),
    defaultValues: {
      motivoAnulacion: "",
    },
  });

  const onSubmit = (values: AnularAusenciaFormValues) => {
    anularMutation.mutate(
      {
        id: ausencia.id,
        dto: { motivoAnulacion: values.motivoAnulacion },
      },
      {
        onSuccess: onCerrar,
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Resumen de la ausencia a anular */}
      <div className="border-border/60 bg-muted/30 space-y-1.5 rounded-xl border p-3.5 text-xs">
        <p className="text-foreground font-semibold">{ausencia.sesion.docenteNombre}</p>
        <p className="text-muted-foreground">
          {formatearFechaLimite(ausencia.sesion.fecha)} · {ausencia.sesion.cursoNombre} (
          {ausencia.sesion.seccionNombre})
        </p>
        <p className="text-muted-foreground font-mono">
          Tramo: {ausencia.horaDesde} a {ausencia.horaHasta} ({ausencia.minutos} minutos)
        </p>
      </div>

      {/* Advertencia institucional con tokens semánticos */}
      <div className="border-warning/30 bg-warning/10 text-foreground flex items-start gap-2.5 rounded-xl border p-3 text-xs">
        <HugeiconsIcon icon={AlertCircleIcon} className="text-warning mt-0.5 size-4 shrink-0" />
        <p>
          La ausencia permanecerá visible en el historial y registros como «Anulada» para fines de
          auditoría, pero no computará penalizaciones de tiempo al docente.
        </p>
      </div>

      {/* Motivo de anulación obligatorio */}
      <div className="space-y-1.5">
        <Label htmlFor="motivoAnulacion" className="text-foreground text-sm font-medium">
          Motivo de la anulación *
        </Label>
        <Textarea
          id="motivoAnulacion"
          rows={3}
          placeholder="Indique la justificación para anular este registro..."
          disabled={anularMutation.isPending}
          aria-invalid={Boolean(errors.motivoAnulacion)}
          className="resize-none text-xs"
          {...register("motivoAnulacion")}
        />
        {errors.motivoAnulacion && (
          <p className="text-destructive text-xs font-medium">{errors.motivoAnulacion.message}</p>
        )}
      </div>

      {/* Botones de acción */}
      <div className="border-border/50 flex justify-end gap-2.5 border-t pt-3">
        <Button
          type="button"
          variant="outline"
          disabled={anularMutation.isPending}
          onClick={onCerrar}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="destructive"
          disabled={anularMutation.isPending}
          className="gap-2"
        >
          {anularMutation.isPending && <Spinner className="size-4" />}
          Anular ausencia
        </Button>
      </div>
    </form>
  );
}
