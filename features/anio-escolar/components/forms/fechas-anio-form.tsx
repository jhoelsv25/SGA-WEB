"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/common/spinner";
import { fechasAnioSchema, type FechasAnioFormValues } from "../../schemas";
import type { AnioAcademico } from "../../types";
import { CampoFecha } from "@/components/common/date-field";

interface FechasAnioFormProps {
  anio: AnioAcademico;
  isSubmitting?: boolean;
  onSubmit: (values: FechasAnioFormValues) => Promise<void>;
}

export function FechasAnioForm({ anio, isSubmitting = false, onSubmit }: FechasAnioFormProps) {
  const planificado = anio.estado === "planificado";
  const form = useForm<FechasAnioFormValues>({
    resolver: zodResolver(fechasAnioSchema),
    values: {
      nombre: anio.nombre ?? "",
      fechaInicio: anio.fechaInicio,
      fechaFin: anio.fechaFin,
    },
  });

  return (
    <form
      className="grid gap-3 sm:grid-cols-3"
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit(values);
      })}
    >
      <div className="space-y-1.5 sm:col-span-3">
        <Label htmlFor="nombre-anio" className="text-sm font-medium">
          Denominación (Opcional)
        </Label>
        <Input id="nombre-anio" disabled={!planificado} {...form.register("nombre")} />
      </div>
      <CampoFecha
        control={form.control}
        name="fechaInicio"
        label="Inicio *"
        required
        disabled={!planificado}
      />
      <CampoFecha
        control={form.control}
        name="fechaFin"
        label="Fin *"
        required
        disabled={!planificado}
        error={form.formState.errors.fechaFin?.message}
      />
      {planificado ? (
        <div className="flex items-end">
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
            <span>Guardar fechas</span>
          </Button>
        </div>
      ) : null}
    </form>
  );
}
