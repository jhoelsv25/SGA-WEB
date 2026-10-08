"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/common/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { createRoleSchema, type CreateRoleFormValues } from "../../schemas/roles.schema";
import type { RoleItem } from "../../types/roles.types";

interface RoleFormProps {
  initialData?: RoleItem | null;
  onSubmit: (values: CreateRoleFormValues) => Promise<void> | void;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function RoleForm({ initialData, onSubmit, isLoading = false, onCancel }: RoleFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRoleFormValues>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      nombre: initialData?.nombre ?? "",
      descripcion: initialData?.descripcion ?? "",
    },
  });

  const isSystemRole = initialData?.esSistema ?? false;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="nombre" className="text-sm font-medium">
          Nombre del rol *
        </Label>
        <Input
          id="nombre"
          {...register("nombre")}
          placeholder="Ej. Coordinador Pedagógico"
          disabled={isLoading || isSystemRole}
          aria-invalid={!!errors.nombre}
        />
        {isSystemRole && (
          <p className="text-muted-foreground text-xs">
            Los roles del sistema no pueden renombrarse.
          </p>
        )}
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
          placeholder="Describe las responsabilidades y alcance de este rol..."
          rows={3}
          disabled={isLoading}
        />
        {errors.descripcion && (
          <p className="text-destructive text-xs font-medium">{errors.descripcion.message}</p>
        )}
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
          <span>{initialData ? "Guardar cambios" : "Crear rol"}</span>
        </Button>
      </div>
    </form>
  );
}
