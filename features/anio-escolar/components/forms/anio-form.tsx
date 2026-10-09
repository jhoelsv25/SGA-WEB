"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/common/spinner";
import { NOMBRES_BIMESTRE } from "../../types";
import { anioSchema, type AnioFormValues } from "../../schemas";
import { fechasSugeridas } from "../../utils";
import { CampoFecha } from "@/components/common/date-field";

interface AnioFormProps {
  onSubmit: (values: AnioFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function AnioForm({ onSubmit, onCancel, isSubmitting = false }: AnioFormProps) {
  const sugerido = fechasSugeridas(2027);
  const form = useForm<AnioFormValues>({
    resolver: zodResolver(anioSchema),
    defaultValues: {
      anio: 2027,
      nombre: "",
      fechaInicio: sugerido.fechaInicio,
      fechaFin: sugerido.fechaFin,
      bimestres: sugerido.bimestres,
    },
  });

  const aplicarAnio = (valor: number) => {
    if (!Number.isInteger(valor) || valor < 2000 || valor > 2100) return;
    const fechas = fechasSugeridas(valor);
    form.setValue("fechaInicio", fechas.fechaInicio, { shouldValidate: true });
    form.setValue("fechaFin", fechas.fechaFin, { shouldValidate: true });
    form.setValue("bimestres", fechas.bimestres, { shouldValidate: true });
  };

  return (
    <form
      className="space-y-4"
      noValidate
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit(values);
      })}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="anio" className="text-sm font-medium">
            Año *
          </Label>
          <Input
            id="anio"
            type="number"
            min={2000}
            max={2100}
            disabled={isSubmitting}
            aria-invalid={Boolean(form.formState.errors.anio)}
            {...form.register("anio", {
              valueAsNumber: true,
              onBlur: (event) => aplicarAnio(Number(event.target.value)),
            })}
          />
          <p className="text-muted-foreground text-xs">
            Al cambiar el año se proponen las fechas de clases y de los bimestres.
          </p>
          {form.formState.errors.anio ? (
            <p className="text-destructive text-xs font-medium">
              {form.formState.errors.anio.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="nombre" className="text-sm font-medium">
            Denominación (Opcional)
          </Label>
          <Input
            id="nombre"
            placeholder="Ej. Año académico 2027"
            disabled={isSubmitting}
            {...form.register("nombre")}
          />
          <p className="text-muted-foreground text-xs">
            Nombre visible del periodo. Si lo dejas vacío, se usa el número del año.
          </p>
        </div>
        <CampoFecha
          control={form.control}
          name="fechaInicio"
          label="Inicio de clases *"
          required
          hint="Primer día del periodo escolar."
          disabled={isSubmitting}
          error={form.formState.errors.fechaInicio?.message}
        />
        <CampoFecha
          control={form.control}
          name="fechaFin"
          label="Fin de clases *"
          required
          hint="Debe ser posterior al inicio."
          disabled={isSubmitting}
          error={form.formState.errors.fechaFin?.message}
        />
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <p className="text-sm font-medium">Bimestres I al IV</p>
          <p className="text-muted-foreground text-xs">
            Cada bimestre va dentro del año y empieza después de que termina el anterior.
          </p>
        </div>
        {NOMBRES_BIMESTRE.map((nombre, indice) => (
          <div key={nombre} className="grid gap-4 sm:grid-cols-[4rem_1fr_1fr]">
            <p className="pt-7 text-sm font-medium">{nombre}</p>
            <CampoFecha
              control={form.control}
              name={`bimestres.${indice}.fechaInicio`}
              label="Inicio *"
              required
              disabled={isSubmitting}
              error={form.formState.errors.bimestres?.[indice]?.fechaInicio?.message}
            />
            <CampoFecha
              control={form.control}
              name={`bimestres.${indice}.fechaFin`}
              label="Fin *"
              required
              disabled={isSubmitting}
              error={form.formState.errors.bimestres?.[indice]?.fechaFin?.message}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2.5 pt-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="h-10 gap-1.5 rounded-full px-4.5 text-xs font-semibold"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
          <span>Cancelar</span>
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="shadow-primary/20 h-10 gap-1.5 rounded-full px-5 text-xs font-semibold shadow-md"
        >
          {isSubmitting ? (
            <Spinner className="size-3.5" />
          ) : (
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
          )}
          <span>Guardar año</span>
        </Button>
      </div>
    </form>
  );
}
