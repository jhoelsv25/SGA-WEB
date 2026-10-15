"use client";

import * as React from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { SelectOption } from "@/components/common/select";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OPCIONES_ACCION_SOLICITUD } from "../../consts";
import { useResolverSolicitudMutation } from "../../hooks";
import { resolverSolicitudSchema, type ResolverSolicitudFormValues } from "../../schemas";
import type { SolicitudRevisionItem } from "../../types";

export interface FormularioResolverSolicitudProps {
  solicitud: SolicitudRevisionItem;
  onCerrar: () => void;
}

export function FormularioResolverSolicitud({
  solicitud,
  onCerrar,
}: FormularioResolverSolicitudProps) {
  const { mutateAsync: resolver, isPending } = useResolverSolicitudMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ResolverSolicitudFormValues>({
    resolver: zodResolver(resolverSolicitudSchema),
    defaultValues: {
      accion: "aceptar",
      respuesta: "",
    },
  });

  const accionSeleccionada = useWatch({ control, name: "accion" });

  const onSubmit = async (values: ResolverSolicitudFormValues) => {
    await resolver({
      solicitudId: solicitud.id,
      dto: {
        accion: values.accion,
        respuesta: values.respuesta?.trim() || undefined,
      },
    });
    onCerrar();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Solicitud del docente */}
      <div className="border-border/60 bg-muted/30 space-y-1.5 rounded-xl border p-3.5 text-xs">
        <p className="text-foreground font-semibold">Docente: {solicitud.docenteNombre}</p>
        <p className="text-foreground font-medium">Motivo alegado:</p>
        <p className="text-muted-foreground italic">&ldquo;{solicitud.motivo}&rdquo;</p>
        {solicitud.adjuntoUrl && (
          <p className="pt-1">
            <a
              href={solicitud.adjuntoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-primary font-medium hover:underline"
            >
              Ver evidencia adjunta ↗
            </a>
          </p>
        )}
      </div>

      {/* Acción a tomar */}
      <div className="space-y-1.5">
        <Label htmlFor="accion" className="text-foreground text-sm font-medium">
          Resolución / Decisión *
        </Label>
        <Controller
          name="accion"
          control={control}
          render={({ field }) => (
            <SelectOption
              options={OPCIONES_ACCION_SOLICITUD.map((o) => ({ value: o.value, label: o.label }))}
              value={field.value}
              onSelect={(val) => field.onChange(val as "aceptar" | "rechazar")}
              disabled={isPending}
              placeholder="Seleccionar resolución..."
              searchPlaceholder="Buscar opción..."
            />
          )}
        />
        {errors.accion && (
          <p className="text-destructive text-xs font-medium">{errors.accion.message}</p>
        )}
      </div>

      {/* Respuesta o fundamento */}
      <div className="space-y-1.5">
        <Label htmlFor="respuesta" className="text-foreground text-sm font-medium">
          {accionSeleccionada === "rechazar"
            ? "Fundamento del rechazo *"
            : "Instrucciones o respuesta al docente (Opcional)"}
        </Label>
        <Textarea
          id="respuesta"
          rows={3}
          placeholder={
            accionSeleccionada === "rechazar"
              ? "Indique la justificación por la cual se rechaza la solicitud de revisión..."
              : "Observaciones para la corrección o registro de la versión..."
          }
          disabled={isPending}
          aria-invalid={Boolean(errors.respuesta)}
          className="resize-none text-xs"
          {...register("respuesta")}
        />
        {errors.respuesta && (
          <p className="text-destructive text-xs font-medium">{errors.respuesta.message}</p>
        )}
      </div>

      {/* Botones de acción */}
      <div className="border-border/50 flex justify-end gap-2.5 border-t pt-3">
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={onCerrar}
          className="gap-1.5"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
          <span>Cancelar</span>
        </Button>
        <Button
          type="submit"
          variant={accionSeleccionada === "rechazar" ? "destructive" : "default"}
          disabled={isPending}
          className="gap-1.5"
        >
          {isPending ? (
            <Spinner className="size-3.5" />
          ) : (
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
          )}
          <span>
            {accionSeleccionada === "rechazar" ? "Rechazar solicitud" : "Aceptar y reabrir"}
          </span>
        </Button>
      </div>
    </form>
  );
}
