"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { CampoFecha } from "@/components/common/date-field";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRegistrarCompromisoMutation } from "../../hooks";
import { registrarCompromisoSchema, type RegistrarCompromisoFormValues } from "../../schemas";
import type { ConsolidadoResumenItem } from "../../types";

export interface FormularioRegistrarCompromisoProps {
  consolidado: ConsolidadoResumenItem;
  onCerrar: () => void;
}

export function FormularioRegistrarCompromiso({
  consolidado,
  onCerrar,
}: FormularioRegistrarCompromisoProps) {
  const { mutateAsync: registrar, isPending } = useRegistrarCompromisoMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegistrarCompromisoFormValues>({
    resolver: zodResolver(registrarCompromisoSchema),
    defaultValues: { descripcion: "", fechaRevision: "" },
  });

  const onSubmit = async (values: RegistrarCompromisoFormValues) => {
    try {
      await registrar({
        consolidadoId: consolidado.id,
        descripcion: values.descripcion.trim(),
        fechaRevision: values.fechaRevision,
      });
      onCerrar();
    } catch {
      // El mensaje de la API ya se muestra en el aviso de error.
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="descripcion" className="text-sm font-medium">
          Compromiso *
        </Label>
        <Textarea
          id="descripcion"
          rows={3}
          placeholder="Ej. Firmar el ingreso dentro de la tolerancia"
          disabled={isPending}
          aria-invalid={Boolean(errors.descripcion)}
          className="resize-none text-xs"
          {...register("descripcion")}
        />
        {errors.descripcion && (
          <p className="text-destructive text-xs font-medium">{errors.descripcion.message}</p>
        )}
      </div>

      <CampoFecha
        control={control}
        name="fechaRevision"
        label="Fecha de revisión"
        required
        disabled={isPending}
        error={errors.fechaRevision?.message}
        hint="Ese día se le recordará al Director revisar el compromiso."
      />

      <div className="flex justify-end gap-2.5 pt-3">
        <Button type="button" variant="outline" disabled={isPending} onClick={onCerrar}>
          <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
          <span>Cancelar</span>
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Spinner className="size-3.5" />
          ) : (
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
          )}
          <span>Registrar compromiso</span>
        </Button>
      </div>
    </form>
  );
}
