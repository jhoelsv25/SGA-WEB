import * as React from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatearMinutos } from "@/features/ausencias-docente/utils";
import type { CorregirAusenciaFormValues } from "./correccion.schema";

interface CamposHorarioEdicionProps {
  register: UseFormRegister<CorregirAusenciaFormValues>;
  errors: FieldErrors<CorregirAusenciaFormValues>;
  minutosCalculados: number;
  disabled?: boolean;
}

/**
 * Subcomponente para los campos de hora de inicio, fin y cálculo de duración de la ausencia.
 */
export function CamposHorarioEdicion({
  register,
  errors,
  minutosCalculados,
  disabled = false,
}: CamposHorarioEdicionProps) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:items-end">
        <div className="space-y-1.5">
          <Label htmlFor="horaDesde" className="text-xs font-medium">
            Hora de inicio *
          </Label>
          <Input
            id="horaDesde"
            type="time"
            disabled={disabled}
            aria-invalid={Boolean(errors.horaDesde)}
            className="h-9 font-mono text-xs"
            {...register("horaDesde")}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="horaHasta" className="text-xs font-medium">
            Hora de fin *
          </Label>
          <Input
            id="horaHasta"
            type="time"
            disabled={disabled}
            aria-invalid={Boolean(errors.horaHasta)}
            className="h-9 font-mono text-xs"
            {...register("horaHasta")}
          />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <div className="bg-muted/40 flex h-9 items-center justify-between gap-1 rounded-lg border px-2.5 text-xs">
            <span className="text-muted-foreground">Duración:</span>
            <Badge variant="secondary" className="font-mono text-xs">
              {formatearMinutos(minutosCalculados)}
            </Badge>
          </div>
        </div>
      </div>
      {errors.horaDesde && (
        <p className="text-destructive text-xs font-medium">{errors.horaDesde.message}</p>
      )}
      {errors.horaHasta && (
        <p className="text-destructive text-xs font-medium">{errors.horaHasta.message}</p>
      )}
    </div>
  );
}
