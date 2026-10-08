"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/common/spinner";
import { NOMBRES_BIMESTRE } from "../types";
import { anioSchema, type AnioFormValues } from "../schemas";
import { fechasSugeridas } from "../utils";
import { CampoFecha } from "./campo-fecha";

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
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit(values);
      })}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="anio">Año</Label>
          <Input
            id="anio"
            type="number"
            min={2000}
            max={2100}
            aria-invalid={Boolean(form.formState.errors.anio)}
            {...form.register("anio", {
              valueAsNumber: true,
              onBlur: (event) => aplicarAnio(Number(event.target.value)),
            })}
          />
          {form.formState.errors.anio ? (
            <p className="text-destructive text-xs">{form.formState.errors.anio.message}</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="nombre">Denominación</Label>
          <Input id="nombre" placeholder="Opcional" {...form.register("nombre")} />
        </div>
        <CampoFecha
          control={form.control}
          name="fechaInicio"
          label="Inicio de clases"
          error={form.formState.errors.fechaInicio?.message}
        />
        <CampoFecha
          control={form.control}
          name="fechaFin"
          label="Fin de clases"
          error={form.formState.errors.fechaFin?.message}
        />
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">Bimestres I al IV</p>
        {NOMBRES_BIMESTRE.map((nombre, indice) => (
          <div
            key={nombre}
            className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[4rem_1fr_1fr]"
          >
            <p className="text-sm font-semibold">{nombre}</p>
            <CampoFecha
              control={form.control}
              name={`bimestres.${indice}.fechaInicio`}
              label="Inicio"
              error={form.formState.errors.bimestres?.[indice]?.fechaInicio?.message}
            />
            <CampoFecha
              control={form.control}
              name={`bimestres.${indice}.fechaFin`}
              label="Fin"
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
