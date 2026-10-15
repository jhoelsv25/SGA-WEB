"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSolicitarRevisionMutation } from "../../hooks";
import { solicitarRevisionSchema, type SolicitarRevisionFormValues } from "../../schemas";

export interface FormularioSolicitarRevisionProps {
  consolidadoId: string;
  bimestreNombre: string;
  onCerrar: () => void;
}

export function FormularioSolicitarRevision({
  consolidadoId,
  bimestreNombre,
  onCerrar,
}: FormularioSolicitarRevisionProps) {
  const { mutateAsync: solicitar, isPending } = useSolicitarRevisionMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SolicitarRevisionFormValues>({
    resolver: zodResolver(solicitarRevisionSchema),
    defaultValues: {
      motivo: "",
      adjuntoUrl: "",
    },
  });

  const onSubmit = async (values: SolicitarRevisionFormValues) => {
    await solicitar({
      id: consolidadoId,
      dto: {
        motivo: values.motivo.trim(),
        adjuntoUrl: values.adjuntoUrl?.trim() || null,
      },
    });
    onCerrar();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Información del plazo normativo */}
      <div className="border-border/60 bg-muted/30 space-y-1 rounded-xl border p-3.5 text-xs">
        <p className="text-foreground font-semibold">Bimestre: {bimestreNombre}</p>
        <p className="text-muted-foreground">
          Plazo normativo: Hasta 5 días hábiles posteriores a la publicación del consolidado para
          solicitar revisión ante la Dirección o Coordinación.
        </p>
      </div>

      {/* Motivo de la solicitud */}
      <div className="space-y-1.5">
        <Label htmlFor="motivo" className="text-foreground text-sm font-medium">
          Motivo o Descargo detallado *
        </Label>
        <Textarea
          id="motivo"
          rows={4}
          placeholder="Describa claramente la discrepancia en horas dictadas, justificación de ausencias o motivo de la reconsideración..."
          disabled={isPending}
          aria-invalid={Boolean(errors.motivo)}
          className="resize-none text-xs"
          {...register("motivo")}
        />
        <p className="text-muted-foreground text-xs">
          Mínimo 10 caracteres. Sea preciso indicando fechas o sesiones específicas.
        </p>
        {errors.motivo && (
          <p className="text-destructive text-xs font-medium">{errors.motivo.message}</p>
        )}
      </div>

      {/* Enlace o evidencia adjunta */}
      <div className="space-y-1.5">
        <Label htmlFor="adjuntoUrl" className="text-foreground text-sm font-medium">
          Enlace a Evidencia o Justificante (Opcional)
        </Label>
        <Input
          id="adjuntoUrl"
          type="url"
          placeholder="https://drive.google.com/... o enlace de sustento"
          disabled={isPending}
          aria-invalid={Boolean(errors.adjuntoUrl)}
          className="text-xs"
          {...register("adjuntoUrl")}
        />
        {errors.adjuntoUrl && (
          <p className="text-destructive text-xs font-medium">{errors.adjuntoUrl.message}</p>
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
        <Button type="submit" disabled={isPending} className="gap-1.5">
          {isPending ? (
            <Spinner className="size-3.5" />
          ) : (
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
          )}
          <span>Enviar solicitud</span>
        </Button>
      </div>
    </form>
  );
}
