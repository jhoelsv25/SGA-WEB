"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { SelectOption } from "@/components/common/select";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OPCIONES_RESULTADO_COMPROMISO } from "../../consts";
import { useCerrarCompromisoMutation } from "../../hooks";
import { cerrarCompromisoSchema, type CerrarCompromisoFormValues } from "../../schemas";
import type { CompromisoItem } from "../../types";

export interface FormularioCerrarCompromisoProps {
  compromiso: CompromisoItem;
  onCerrar: () => void;
}

export function FormularioCerrarCompromiso({
  compromiso,
  onCerrar,
}: FormularioCerrarCompromisoProps) {
  const { mutateAsync: cerrar, isPending } = useCerrarCompromisoMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CerrarCompromisoFormValues>({
    resolver: zodResolver(cerrarCompromisoSchema),
    defaultValues: { resultado: "cumplido", observacion: "" },
  });

  const onSubmit = async (values: CerrarCompromisoFormValues) => {
    try {
      await cerrar({
        id: compromiso.compromisoId,
        dto: { resultado: values.resultado, observacion: values.observacion.trim() },
      });
      onCerrar();
    } catch {
      // El mensaje de la API ya se muestra en el aviso de error.
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <p className="text-muted-foreground text-xs">
        {compromiso.docenteNombre}: {compromiso.descripcion}
      </p>

      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Resultado *</Label>
        <Controller
          name="resultado"
          control={control}
          render={({ field }) => (
            <SelectOption
              options={OPCIONES_RESULTADO_COMPROMISO.map((o) => ({
                value: o.value,
                label: o.label,
              }))}
              value={field.value}
              onSelect={(val) => field.onChange(val)}
              disabled={isPending}
              placeholder="Seleccione el resultado..."
              searchPlaceholder="Buscar resultado..."
            />
          )}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="observacion" className="text-sm font-medium">
          Observación de cierre *
        </Label>
        <Textarea
          id="observacion"
          rows={3}
          disabled={isPending}
          aria-invalid={Boolean(errors.observacion)}
          className="resize-none text-xs"
          {...register("observacion")}
        />
        {errors.observacion && (
          <p className="text-destructive text-xs font-medium">{errors.observacion.message}</p>
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
          <span>Cerrar compromiso</span>
        </Button>
      </div>
    </form>
  );
}
