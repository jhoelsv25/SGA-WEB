"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/common/spinner";
import { NOMBRES_BIMESTRE, type AnioAcademico } from "../types";
import { bimestresSchema, type BimestresFormValues } from "../schemas";
import { CampoFecha } from "./campo-fecha";

interface BimestresFormProps {
  anio: AnioAcademico;
  onSubmit: (values: BimestresFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

export function BimestresForm({ anio, onSubmit, isSubmitting = false }: BimestresFormProps) {
  const existentes = [...anio.bimestres].sort((a, b) => a.numero - b.numero);
  const form = useForm<BimestresFormValues>({
    resolver: zodResolver(bimestresSchema),
    defaultValues: {
      fechaInicio: anio.fechaInicio,
      fechaFin: anio.fechaFin,
      bimestres: [1, 2, 3, 4].map((numero) => {
        const actual = existentes.find((item) => item.numero === numero);
        return {
          numero,
          fechaInicio: actual?.fechaInicio ?? "",
          fechaFin: actual?.fechaFin ?? "",
        };
      }),
    },
  });

  const bloqueado = anio.estado !== "planificado";

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit(values);
      })}
    >
      {NOMBRES_BIMESTRE.map((nombre, indice) => (
        <div key={nombre} className="grid items-end gap-3 sm:grid-cols-[3rem_1fr_1fr]">
          <p className="pb-2 text-sm font-semibold">{nombre}</p>
          <CampoFecha
            control={form.control}
            name={`bimestres.${indice}.fechaInicio`}
            label="Inicio"
            disabled={bloqueado}
            error={form.formState.errors.bimestres?.[indice]?.fechaInicio?.message}
          />
          <CampoFecha
            control={form.control}
            name={`bimestres.${indice}.fechaFin`}
            label="Fin"
            disabled={bloqueado}
            error={form.formState.errors.bimestres?.[indice]?.fechaFin?.message}
          />
        </div>
      ))}
      {bloqueado ? (
        <p className="text-muted-foreground text-xs">
          Solo se pueden modificar las fechas de un año planificado.
        </p>
      ) : (
        <div className="flex justify-end pt-3">
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
            <span>Guardar bimestres</span>
          </Button>
        </div>
      )}
    </form>
  );
}
