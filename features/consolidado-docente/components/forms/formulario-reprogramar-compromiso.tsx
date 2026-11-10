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
import { useReprogramarCompromisoMutation } from "../../hooks";
import { reprogramarCompromisoSchema, type ReprogramarCompromisoFormValues } from "../../schemas";
import type { CompromisoItem } from "../../types";

export interface FormularioReprogramarCompromisoProps {
  compromiso: CompromisoItem;
  onCerrar: () => void;
}

export function FormularioReprogramarCompromiso({
  compromiso,
  onCerrar,
}: FormularioReprogramarCompromisoProps) {
  const { mutateAsync: reprogramar, isPending } = useReprogramarCompromisoMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ReprogramarCompromisoFormValues>({
    resolver: zodResolver(reprogramarCompromisoSchema),
    defaultValues: {
      fechaRevision: compromiso.fechaRevision,
      descripcion: compromiso.descripcion,
    },
  });

  const onSubmit = async (values: ReprogramarCompromisoFormValues) => {
    const descripcion = values.descripcion?.trim();
    try {
      await reprogramar({
        id: compromiso.compromisoId,
        dto: {
          // Solo se envía lo que cambió; la API pide al menos un cambio.
          fechaRevision:
            values.fechaRevision !== compromiso.fechaRevision ? values.fechaRevision : undefined,
          descripcion:
            descripcion && descripcion !== compromiso.descripcion ? descripcion : undefined,
        },
      });
      onCerrar();
    } catch {
      // El mensaje de la API ya se muestra en el aviso de error.
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <CampoFecha
        control={control}
        name="fechaRevision"
        label="Nueva fecha de revisión"
        required
        disabled={isPending}
        error={errors.fechaRevision?.message}
      />

      <div className="space-y-1.5">
        <Label htmlFor="descripcion" className="text-sm font-medium">
          Descripción
        </Label>
        <Textarea
          id="descripcion"
          rows={3}
          disabled={isPending}
          aria-invalid={Boolean(errors.descripcion)}
          className="resize-none text-xs"
          {...register("descripcion")}
        />
        <p className="text-muted-foreground text-xs">
          Se guarda como una versión nueva; la anterior queda en el historial.
        </p>
        {errors.descripcion && (
          <p className="text-destructive text-xs font-medium">{errors.descripcion.message}</p>
        )}
      </div>

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
          <span>Reprogramar</span>
        </Button>
      </div>
    </form>
  );
}
