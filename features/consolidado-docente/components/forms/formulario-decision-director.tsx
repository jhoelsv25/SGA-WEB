"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { SelectOption } from "@/components/common/select";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OPCIONES_DECISION } from "../../consts";
import { useRegistrarDecisionMutation } from "../../hooks";
import { decisionDirectorSchema, type DecisionDirectorFormValues } from "../../schemas";
import type { ConsolidadoResumenItem } from "../../types";

export interface FormularioDecisionDirectorProps {
  consolidado: ConsolidadoResumenItem;
  onCerrar: () => void;
}

export function FormularioDecisionDirector({
  consolidado,
  onCerrar,
}: FormularioDecisionDirectorProps) {
  const { mutateAsync: registrarDecision, isPending } = useRegistrarDecisionMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DecisionDirectorFormValues>({
    resolver: zodResolver(decisionDirectorSchema),
    defaultValues: {
      decision: consolidado.decision || "ninguna",
      observacion: consolidado.observacion || "",
    },
  });

  const onSubmit = async (values: DecisionDirectorFormValues) => {
    try {
      await registrarDecision({
        id: consolidado.id,
        dto: {
          decision: values.decision,
          observacion: values.observacion?.trim() || undefined,
        },
      });
      onCerrar();
    } catch {
      // Si la API la rechaza (por ejemplo, con compromisos pendientes), el mensaje ya se
      // muestra en el aviso de error y el formulario queda abierto.
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Resumen institucional del docente */}
      <div className="border-border/60 bg-muted/30 space-y-1 rounded-xl border p-3.5 text-xs">
        <p className="text-foreground font-semibold">{consolidado.docenteNombre}</p>
        <p className="text-muted-foreground">
          DNI: {consolidado.docenteDni} · {consolidado.periodoNombre} · Versión{" "}
          {consolidado.version}
        </p>
      </div>

      {/* Selector de decisión directiva */}
      <div className="space-y-1.5">
        <Label htmlFor="decision" className="text-foreground text-sm font-medium">
          Evaluación / Decisión *
        </Label>
        <Controller
          name="decision"
          control={control}
          render={({ field }) => (
            <SelectOption
              options={OPCIONES_DECISION.map((o) => ({ value: o.value, label: o.label }))}
              value={field.value}
              onSelect={(val) => field.onChange(val)}
              disabled={isPending}
              placeholder="Seleccione una decisión..."
              searchPlaceholder="Buscar decisión..."
            />
          )}
        />
        {errors.decision && (
          <p className="text-destructive text-xs font-medium">{errors.decision.message}</p>
        )}
      </div>

      {/* Observación o recomendación pedagógica */}
      <div className="space-y-1.5">
        <Label htmlFor="observacion" className="text-foreground text-sm font-medium">
          Observaciones o Recomendaciones (Opcional)
        </Label>
        <Textarea
          id="observacion"
          rows={3}
          placeholder="Indique las pautas, compromisos acordados o justificantes observados..."
          disabled={isPending}
          aria-invalid={Boolean(errors.observacion)}
          className="resize-none text-xs"
          {...register("observacion")}
        />
        <p className="text-muted-foreground text-xs">
          Se incluirá en el reporte y ficha de seguimiento docente del bimestre.
        </p>
        {errors.observacion && (
          <p className="text-destructive text-xs font-medium">{errors.observacion.message}</p>
        )}
      </div>

      {/* Botones de acción estandarizados */}
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
          <span>Guardar decisión</span>
        </Button>
      </div>
    </form>
  );
}
