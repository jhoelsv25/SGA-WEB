"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CampoFecha } from "@/components/common/date-field";
import { SelectOption } from "@/components/common/select";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PersonaBuscadorField } from "@/features/personas/components/persona-buscador-field";
import type { Persona } from "@/features/personas/types/personas.types";
import { TIPOS_MARCACION_LABEL } from "../consts";
import { useRegistrarMarcacionManual } from "../hooks";
import { marcacionManualSchema, type MarcacionManualFormValues } from "../schemas";

function hoyIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function FormularioMarcacionManual() {
  const [persona, setPersona] = React.useState<Persona | null>(null);
  const registrar = useRegistrarMarcacionManual();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MarcacionManualFormValues>({
    resolver: zodResolver(marcacionManualSchema),
    defaultValues: { personaId: "", tipo: "entrada", fecha: hoyIso(), hora: "", observacion: "" },
  });

  const enviar = (values: MarcacionManualFormValues) => {
    registrar.mutate(values, {
      onSuccess: () => {
        setPersona(null);
        reset({ ...values, personaId: "", hora: "", observacion: "" });
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(enviar)}
      className="border-border/60 bg-card max-w-2xl space-y-4 rounded-2xl border p-5 shadow-xs"
      noValidate
    >
      <div className="space-y-1.5">
        <Label htmlFor="busqueda-persona" className="text-sm font-medium">
          Persona *
        </Label>
        <Controller
          control={control}
          name="personaId"
          render={({ field }) => (
            <PersonaBuscadorField
              id="busqueda-persona"
              destino="cualquiera"
              value={persona}
              onChange={(elegida) => {
                setPersona(elegida);
                field.onChange(elegida?.id ?? "");
              }}
              disabled={registrar.isPending}
            />
          )}
        />
        {errors.personaId && (
          <p className="text-destructive text-xs font-medium">{errors.personaId.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Marcación *</Label>
          <Controller
            control={control}
            name="tipo"
            render={({ field }) => (
              <SelectOption
                options={[
                  { value: "entrada", label: TIPOS_MARCACION_LABEL.entrada },
                  { value: "salida", label: TIPOS_MARCACION_LABEL.salida },
                ]}
                value={field.value}
                onSelect={field.onChange}
              />
            )}
          />
        </div>
        <CampoFecha
          control={control}
          name="fecha"
          label="Fecha"
          required
          error={errors.fecha?.message}
        />
        <div className="space-y-1.5">
          <Label htmlFor="hora-manual" className="text-sm font-medium">
            Hora real *
          </Label>
          <Input
            id="hora-manual"
            type="time"
            disabled={registrar.isPending}
            aria-invalid={Boolean(errors.hora)}
            {...register("hora")}
          />
          {errors.hora && (
            <p className="text-destructive text-xs font-medium">{errors.hora.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="observacion-manual" className="text-sm font-medium">
          Observación *
        </Label>
        <Textarea
          id="observacion-manual"
          placeholder="Ej. Kiosko sin conexión"
          maxLength={500}
          disabled={registrar.isPending}
          aria-invalid={Boolean(errors.observacion)}
          {...register("observacion")}
        />
        {errors.observacion && (
          <p className="text-destructive text-xs font-medium">{errors.observacion.message}</p>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={registrar.isPending} className="gap-2">
          {registrar.isPending && <Spinner className="size-4" />}
          Registrar marcación
        </Button>
      </div>
    </form>
  );
}
