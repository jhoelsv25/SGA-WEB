"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SelectOption } from "@/components/common/select";
import { Spinner } from "@/components/common/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { useRolesQuery } from "@/features/roles/hooks/use-roles-query";
import { createCargoSchema, type CreateCargoFormValues } from "../../schemas/cargos.schema";
import type { CargoItem } from "../../types/cargos.types";

interface CargoFormProps {
  initialData?: CargoItem | null;
  onSubmit: (values: CreateCargoFormValues) => Promise<void> | void;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function CargoForm({ initialData, onSubmit, isLoading = false, onCancel }: CargoFormProps) {
  const { data: roles = [], isLoading: isLoadingRoles } = useRolesQuery(true);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateCargoFormValues>({
    resolver: zodResolver(createCargoSchema),
    defaultValues: {
      nombre: initialData?.nombre ?? "",
      descripcion: initialData?.descripcion ?? "",
      rolesSugeridosIds: initialData?.rolesSugeridos.map((r) => r.id) ?? [],
    },
  });

  const roleOptions = React.useMemo(
    () => roles.filter((r) => r.activo).map((r) => ({ value: r.id, label: r.nombre })),
    [roles],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="nombre" className="text-sm font-medium">
          Nombre del cargo *
        </Label>
        <Input
          id="nombre"
          {...register("nombre")}
          placeholder="Ej. Coordinador(a) académico"
          disabled={isLoading}
          aria-invalid={!!errors.nombre}
        />
        {errors.nombre && (
          <p className="text-destructive text-xs font-medium">{errors.nombre.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="descripcion" className="text-sm font-medium">
          Descripción (Opcional)
        </Label>
        <Textarea
          id="descripcion"
          {...register("descripcion")}
          placeholder="Describe el puesto..."
          rows={3}
          disabled={isLoading}
        />
        {errors.descripcion && (
          <p className="text-destructive text-xs font-medium">{errors.descripcion.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="rolesSugeridosIds" className="text-sm font-medium">
          Roles sugeridos (Opcional)
        </Label>
        <Controller
          control={control}
          name="rolesSugeridosIds"
          render={({ field }) => (
            <SelectOption
              multi
              options={roleOptions}
              values={field.value ?? []}
              onValuesChange={(vals) => field.onChange(vals)}
              placeholder={isLoadingRoles ? "Cargando roles..." : "Seleccionar roles sugeridos..."}
              disabled={isLoading || isLoadingRoles}
            />
          )}
        />
        <p className="text-muted-foreground text-xs">
          El cargo no da accesos; solo sugiere estos roles al registrar una cuenta con él.
        </p>
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
          <span>{initialData ? "Guardar cambios" : "Crear cargo"}</span>
        </Button>
      </div>
    </form>
  );
}
