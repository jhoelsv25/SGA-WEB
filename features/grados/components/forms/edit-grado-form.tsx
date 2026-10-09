"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/common/spinner";
import { updateGradoSchema, type UpdateGradoFormValues } from "../../schemas";
import type { Grado } from "../../types";

interface EditGradoFormProps {
  grado: Grado;
  onSubmit: (values: UpdateGradoFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function EditGradoForm({ grado, onSubmit, onCancel, isLoading }: EditGradoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateGradoFormValues>({
    resolver: zodResolver(updateGradoSchema),
    defaultValues: {
      nombre: grado.nombre,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="grado-numero" className="text-sm font-medium">
          Nivel y orden
        </Label>
        <Input
          id="grado-numero"
          value={`${grado.numero}.° de secundaria`}
          disabled
          className="bg-muted/50 cursor-not-allowed font-medium"
        />
        <p className="text-muted-foreground text-xs">
          El número de grado es una constante del CNEB y no se puede modificar.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="grado-nombre" className="text-sm font-medium">
          Nombre visible *
        </Label>
        <Input
          id="grado-nombre"
          placeholder="Ej. 1.° de secundaria"
          disabled={isLoading}
          aria-invalid={!!errors.nombre}
          autoFocus
          {...register("nombre")}
        />
        {errors.nombre && (
          <p className="text-destructive text-xs font-medium">{errors.nombre.message}</p>
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
          <span>Guardar cambios</span>
        </Button>
      </div>
    </form>
  );
}
