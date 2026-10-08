"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/common/spinner";
import { updateHorasPlanSchema, type UpdateHorasPlanFormValues } from "../../schemas";
import type { PlanEstudioItem } from "../../types";

interface UpdateHorasFormProps {
  item: PlanEstudioItem;
  onSubmit: (values: UpdateHorasPlanFormValues) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export function UpdateHorasForm({ item, onSubmit, isLoading, onCancel }: UpdateHorasFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateHorasPlanFormValues>({
    resolver: zodResolver(updateHorasPlanSchema),
    defaultValues: {
      horasSemanales: item.horasSemanales,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="border-border/60 bg-muted/40 rounded-lg border p-3 text-xs">
        <p className="text-foreground font-semibold">
          [{item.curso.codigo}] {item.curso.nombre}
        </p>
        <p className="text-muted-foreground">{item.curso.areaCurricularNombre}</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="horasSemanales" className="text-sm font-medium">
          Horas Pedagógicas Semanales *
        </Label>
        <Input
          id="horasSemanales"
          type="number"
          min={1}
          max={40}
          placeholder="Ej. 6"
          disabled={isLoading}
          aria-invalid={!!errors.horasSemanales}
          {...register("horasSemanales", { valueAsNumber: true })}
        />
        <p className="text-muted-foreground text-xs">
          Ajusta las horas semanales del curso en este grado (mayor que 0).
        </p>
        {errors.horasSemanales && (
          <p className="text-destructive text-xs font-medium">{errors.horasSemanales.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2.5 pt-3">
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
          <span>Actualizar horas</span>
        </Button>
      </div>
    </form>
  );
}
