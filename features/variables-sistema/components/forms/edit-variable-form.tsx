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
import {
  createEditVariableSchema,
  type EditVariableFormValues,
} from "../../schemas/variable.schema";
import type { VariableSistema } from "../../types";

interface EditVariableFormProps {
  variable: VariableSistema;
  onSubmit: (codigo: string, valor: string, motivoCambio: string) => Promise<void>;
  isLoading?: boolean;
  onCancel: () => void;
}

export function EditVariableForm({
  variable,
  onSubmit,
  isLoading = false,
  onCancel,
}: EditVariableFormProps) {
  const schema = React.useMemo(() => createEditVariableSchema(variable), [variable]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditVariableFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      valor: variable.valor,
      motivoCambio: "",
    },
  });

  const rangoTexto = React.useMemo(() => {
    if (variable.valorMinimo !== null && variable.valorMaximo !== null) {
      return `Entre ${variable.valorMinimo} y ${variable.valorMaximo}${variable.unidad ? ` ${variable.unidad}` : ""}`;
    }
    if (variable.valorMinimo !== null) {
      return `Mínimo ${variable.valorMinimo}${variable.unidad ? ` ${variable.unidad}` : ""}`;
    }
    if (variable.valorMaximo !== null) {
      return `Máximo ${variable.valorMaximo}${variable.unidad ? ` ${variable.unidad}` : ""}`;
    }
    return null;
  }, [variable]);

  const handleFormSubmit = async (values: EditVariableFormValues) => {
    await onSubmit(variable.codigo, values.valor, values.motivoCambio);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="valor" className="text-sm font-medium">
          Nuevo valor *{variable.unidad ? ` (${variable.unidad})` : ""}
        </Label>
        <Input
          id="valor"
          placeholder="Ingrese el nuevo valor"
          disabled={!variable.editable || isLoading}
          aria-invalid={Boolean(errors.valor)}
          {...register("valor")}
        />
        {rangoTexto && (
          <p className="text-muted-foreground text-xs">Límites permitidos: {rangoTexto}.</p>
        )}
        {variable.tipo === "booleano" && (
          <p className="text-muted-foreground text-xs">
            Valores aceptados: true o false (o 1 / 0).
          </p>
        )}
        {variable.tipo === "lista" && (
          <p className="text-muted-foreground text-xs">
            Escriba los valores separados por comas, sin espacios dentro de cada valor (por ejemplo:
            descanso_medico,licencia).
          </p>
        )}
        {errors.valor && (
          <p className="text-destructive text-xs font-medium">{errors.valor.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="motivoCambio" className="text-sm font-medium">
          Motivo del cambio *
        </Label>
        <Textarea
          id="motivoCambio"
          placeholder="Indique la justificación o acuerdo directivo para este cambio..."
          rows={3}
          disabled={!variable.editable || isLoading}
          aria-invalid={Boolean(errors.motivoCambio)}
          {...register("motivoCambio")}
        />
        <p className="text-muted-foreground text-xs">
          Este motivo quedará registrado de forma inmutable en el historial y en la bitácora de
          auditoría.
        </p>
        {errors.motivoCambio && (
          <p className="text-destructive text-xs font-medium">{errors.motivoCambio.message}</p>
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
          disabled={!variable.editable || isLoading}
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
