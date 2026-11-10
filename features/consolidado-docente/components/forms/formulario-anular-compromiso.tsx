"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAnularCompromisoMutation } from "../../hooks";
import { anularCompromisoSchema, type AnularCompromisoFormValues } from "../../schemas";
import type { CompromisoItem } from "../../types";

export interface FormularioAnularCompromisoProps {
  compromiso: CompromisoItem;
  onCerrar: () => void;
}

export function FormularioAnularCompromiso({
  compromiso,
  onCerrar,
}: FormularioAnularCompromisoProps) {
  const { mutateAsync: anular, isPending } = useAnularCompromisoMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnularCompromisoFormValues>({
    resolver: zodResolver(anularCompromisoSchema),
    defaultValues: { motivo: "" },
  });

  const onSubmit = async (values: AnularCompromisoFormValues) => {
    try {
      await anular({ id: compromiso.compromisoId, dto: { motivo: values.motivo.trim() } });
      onCerrar();
    } catch {
      // El mensaje de la API ya se muestra en el aviso de error.
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <p className="text-muted-foreground text-xs">
        {compromiso.docenteNombre}: {compromiso.descripcion}. El compromiso no se elimina: queda
        anulado con su motivo.
      </p>

      <div className="space-y-1.5">
        <Label htmlFor="motivo" className="text-sm font-medium">
          Motivo de la anulación *
        </Label>
        <Textarea
          id="motivo"
          rows={3}
          disabled={isPending}
          aria-invalid={Boolean(errors.motivo)}
          className="resize-none text-xs"
          {...register("motivo")}
        />
        {errors.motivo && (
          <p className="text-destructive text-xs font-medium">{errors.motivo.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2.5 pt-3">
        <Button type="button" variant="outline" disabled={isPending} onClick={onCerrar}>
          <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
          <span>Cancelar</span>
        </Button>
        <Button type="submit" variant="destructive" disabled={isPending}>
          {isPending ? (
            <Spinner className="size-3.5" />
          ) : (
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
          )}
          <span>Anular compromiso</span>
        </Button>
      </div>
    </form>
  );
}
