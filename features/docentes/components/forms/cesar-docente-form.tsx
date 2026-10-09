"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/common/date-picker";
import { Spinner } from "@/components/common/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, UserRemove01Icon } from "@hugeicons/core-free-icons";
import { cesarDocenteSchema, type CesarDocenteFormValues } from "../../schemas/docentes.schema";
import { parseIsoDate, formatToIsoDate } from "../../utils/dates";
import type { Docente } from "../../types/docentes.types";

interface CesarDocenteFormProps {
  docente: Docente;
  onSubmit: (values: CesarDocenteFormValues) => Promise<void> | void;
  isLoading?: boolean;
  onCancel: () => void;
}

export function CesarDocenteForm({
  docente,
  onSubmit,
  isLoading = false,
  onCancel,
}: CesarDocenteFormProps) {
  const minDate = React.useMemo(() => parseIsoDate(docente.fechaIngreso), [docente.fechaIngreso]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CesarDocenteFormValues>({
    resolver: zodResolver(cesarDocenteSchema),
    defaultValues: {
      fechaCese: formatToIsoDate(new Date()),
      motivo: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Resumen del docente */}
      <div className="border-border/60 bg-muted/30 space-y-1 rounded-xl border p-3.5">
        <p className="text-foreground text-sm font-semibold">{docente.persona.nombreCompleto}</p>
        <p className="text-muted-foreground text-xs">
          Código: <span className="font-mono font-medium">{docente.codigo}</span> · Ingreso:{" "}
          <span className="font-mono font-medium">{docente.fechaIngreso}</span>
        </p>
      </div>

      {/* Fecha de cese */}
      <div className="space-y-1.5">
        <Label htmlFor="fechaCese" className="text-sm font-medium">
          Fecha de cese laboral *
        </Label>
        <Controller
          control={control}
          name="fechaCese"
          render={({ field }) => (
            <DatePicker
              date={parseIsoDate(field.value)}
              onSelect={(date) => field.onChange(formatToIsoDate(date))}
              minDate={minDate}
              disabled={isLoading}
              clearable={false}
              dateFormat="dd/MM/yyyy"
              placeholder="Seleccionar fecha de cese"
              className={
                errors.fechaCese ? "border-destructive ring-destructive/20 w-full ring-1" : "w-full"
              }
            />
          )}
        />
        <p className="text-muted-foreground text-xs">
          Debe ser posterior o igual a la fecha de ingreso ({docente.fechaIngreso}).
        </p>
        {errors.fechaCese && (
          <p className="text-destructive text-xs font-medium">{errors.fechaCese.message}</p>
        )}
      </div>

      {/* Motivo del cese */}
      <div className="space-y-1.5">
        <Label htmlFor="motivo" className="text-sm font-medium">
          Motivo del cese (Opcional)
        </Label>
        <Textarea
          id="motivo"
          placeholder="Ej. Término de contrato, renuncia voluntaria..."
          disabled={isLoading}
          rows={3}
          {...register("motivo")}
        />
        {errors.motivo && (
          <p className="text-destructive text-xs font-medium">{errors.motivo.message}</p>
        )}
      </div>

      {/* Acciones */}
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
          variant="destructive"
          disabled={isLoading}
          className="h-10 gap-1.5 rounded-full px-5 text-xs font-semibold shadow-md"
        >
          {isLoading ? (
            <Spinner className="size-3.5" />
          ) : (
            <HugeiconsIcon icon={UserRemove01Icon} className="size-3.5" />
          )}
          <span>Confirmar cese</span>
        </Button>
      </div>
    </form>
  );
}
