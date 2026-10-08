"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Copy01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/common/spinner";
import { SelectOption } from "@/components/common/select";
import type { Grado } from "@/features/grados";
import { copyPlanSchema, type CopyPlanFormValues } from "../../schemas";

interface CopyPlanFormProps {
  currentGrado: Grado;
  allGrados: Grado[];
  onSubmit: (values: CopyPlanFormValues) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export function CopyPlanForm({
  currentGrado,
  allGrados,
  onSubmit,
  isLoading,
  onCancel,
}: CopyPlanFormProps) {
  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<CopyPlanFormValues>({
    resolver: zodResolver(copyPlanSchema),
    defaultValues: {
      origenGradoId: "",
    },
  });

  const selectedOrigenId = useWatch({ control, name: "origenGradoId" });

  const gradoOptions = React.useMemo(() => {
    return allGrados
      .filter((g) => g.id !== currentGrado.id)
      .map((g) => ({
        value: g.id,
        label: g.nombre,
      }));
  }, [allGrados, currentGrado.id]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="border-primary/20 bg-primary/5 text-primary rounded-lg border p-3 text-xs">
        <p className="font-semibold">Destino: {currentGrado.nombre}</p>
        <p className="text-muted-foreground mt-0.5">
          Se copiarán todas las asignaturas activas y sus horas pedagógicas semanales. Luego podrás
          ajustar las horas según corresponda.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="origenGradoId" className="text-sm font-medium">
          Copiar plan de *
        </Label>
        <SelectOption
          options={gradoOptions}
          value={selectedOrigenId}
          onSelect={(val) => setValue("origenGradoId", val, { shouldValidate: true })}
          placeholder="Seleccionar grado de origen..."
          searchPlaceholder="Buscar grado..."
          emptyMessage="No hay otros grados disponibles."
          disabled={isLoading}
        />
        {errors.origenGradoId && (
          <p className="text-destructive text-xs font-medium">{errors.origenGradoId.message}</p>
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
            <HugeiconsIcon icon={Copy01Icon} className="size-3.5" />
          )}
          <span>Copiar plan de estudios</span>
        </Button>
      </div>
    </form>
  );
}
