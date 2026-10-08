"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/common/spinner";
import { SelectOption } from "@/components/common/select";
import { addCursoPlanSchema, type AddCursoPlanFormValues } from "../../schemas";
import type { Curso } from "../../types";

interface AddCursoPlanFormProps {
  availableCursos: Curso[];
  onSubmit: (values: AddCursoPlanFormValues) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export function AddCursoPlanForm({
  availableCursos,
  onSubmit,
  isLoading,
  onCancel,
}: AddCursoPlanFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<AddCursoPlanFormValues>({
    resolver: zodResolver(addCursoPlanSchema),
    defaultValues: {
      cursoId: "",
      horasSemanales: 4,
    },
  });

  const selectedCursoId = useWatch({ control, name: "cursoId" });

  const cursoOptions = React.useMemo(() => {
    return availableCursos.map((c) => ({
      value: c.id,
      label: `[${c.codigo}] ${c.nombre} (${c.areaCurricularNombre})`,
    }));
  }, [availableCursos]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Selector de Asignatura */}
      <div className="space-y-1.5">
        <Label htmlFor="cursoId" className="text-sm font-medium">
          Asignatura *
        </Label>
        <SelectOption
          options={cursoOptions}
          value={selectedCursoId}
          onSelect={(val) => setValue("cursoId", val, { shouldValidate: true })}
          placeholder="Seleccionar curso disponible..."
          searchPlaceholder="Buscar por código o nombre..."
          emptyMessage="No hay cursos activos disponibles para agregar."
          disabled={isLoading}
        />
        <p className="text-muted-foreground text-xs">
          Solo se ofrecen cursos activos que no forman parte del plan de este grado.
        </p>
        {errors.cursoId && (
          <p className="text-destructive text-xs font-medium">{errors.cursoId.message}</p>
        )}
      </div>

      {/* Horas Semanales */}
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
          Cantidad de horas lectivas a la semana (debe ser mayor que 0).
        </p>
        {errors.horasSemanales && (
          <p className="text-destructive text-xs font-medium">{errors.horasSemanales.message}</p>
        )}
      </div>

      {/* Botones de acción */}
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
          <span>Agregar al plan</span>
        </Button>
      </div>
    </form>
  );
}
