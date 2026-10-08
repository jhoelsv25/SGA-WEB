"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="grado-numero" className="text-xs font-semibold">
          Nivel y Orden
        </Label>
        <Input
          id="grado-numero"
          value={`${grado.numero}.° de secundaria`}
          disabled
          className="bg-muted/50 cursor-not-allowed font-medium"
        />
        <p className="text-muted-foreground text-[11px]">
          El número de grado es una constante del CNEB y no se puede modificar.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="grado-nombre" className="text-xs font-semibold">
          Nombre Visible <span className="text-destructive">*</span>
        </Label>
        <Input
          id="grado-nombre"
          placeholder="Ej. 1.° de secundaria (Avanzado)"
          {...register("nombre")}
          className={errors.nombre ? "border-destructive" : ""}
          autoFocus
        />
        {errors.nombre && <p className="text-destructive text-xs">{errors.nombre.message}</p>}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner className="mr-2 size-4" />
              Guardando...
            </>
          ) : (
            "Guardar Cambios"
          )}
        </Button>
      </div>
    </form>
  );
}
