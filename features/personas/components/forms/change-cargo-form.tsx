"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SelectOption } from "@/components/common/select";
import { Spinner } from "@/components/common/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { useCargosQuery } from "@/features/cargos/hooks/use-cargos-query";
import type { Persona } from "../../types/personas.types";

const changeCargoSchema = z.object({
  cargoId: z.string().uuid("Seleccione un cargo"),
  fechaInicio: z.string().optional().or(z.literal("")),
});

export type ChangeCargoFormValues = z.infer<typeof changeCargoSchema>;

interface ChangeCargoFormProps {
  persona: Persona;
  onSubmit: (values: ChangeCargoFormValues) => Promise<void> | void;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function ChangeCargoForm({
  persona,
  onSubmit,
  isLoading = false,
  onCancel,
}: ChangeCargoFormProps) {
  const { data: cargos = [], isLoading: isLoadingCargos } = useCargosQuery(true);

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm<ChangeCargoFormValues>({
    resolver: zodResolver(changeCargoSchema),
    defaultValues: { cargoId: "", fechaInicio: "" },
  });

  const cargoOptions = React.useMemo(
    () => cargos.map((c) => ({ value: c.id, label: c.nombre })),
    [cargos],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="bg-muted/30 text-muted-foreground rounded-lg border p-3 text-xs">
        Persona: <strong className="text-foreground">{persona.nombreCompleto}</strong>
        <br />
        Cargo vigente:{" "}
        <strong className="text-foreground">{persona.cargoVigente ?? "Sin cargo"}</strong>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cargoId" className="text-sm font-medium">
          Nuevo cargo *
        </Label>
        <Controller
          control={control}
          name="cargoId"
          render={({ field }) => (
            <SelectOption
              options={cargoOptions}
              value={field.value}
              onSelect={(val) => field.onChange(val)}
              placeholder={isLoadingCargos ? "Cargando cargos..." : "Seleccionar nuevo cargo..."}
              disabled={isLoading || isLoadingCargos}
            />
          )}
        />
        {errors.cargoId && (
          <p className="text-destructive text-xs font-medium">{errors.cargoId.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="fechaInicio" className="text-sm font-medium">
          Fecha desde (Opcional)
        </Label>
        <Input id="fechaInicio" type="date" {...register("fechaInicio")} disabled={isLoading} />
        <p className="text-muted-foreground text-xs">Por defecto, hoy.</p>
      </div>

      <div className="flex justify-end gap-2.5 pt-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="h-10 gap-1.5 rounded-full px-4.5 text-xs font-semibold"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
            <span>Cancelar</span>
          </Button>
        )}
        <Button
          type="submit"
          disabled={isLoading}
          className="shadow-primary/20 h-10 gap-1.5 rounded-full px-5 text-xs font-semibold shadow-md"
        >
          {isLoading ? (
            <Spinner className="size-3.5" />
          ) : (
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
          )}
          <span>Cambiar cargo</span>
        </Button>
      </div>
    </form>
  );
}
