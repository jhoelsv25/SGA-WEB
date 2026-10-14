"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, SentIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/common/spinner";
import { descargoSchema, type DescargoFormValues } from "./descargo.schema";

interface DescargoFormProps {
  fechaLimite?: string | null;
  cargando: boolean;
  onSubmit: (valores: DescargoFormValues) => void;
  onCancel: () => void;
}

/**
 * Formulario para el registro único de descargo docente (HU3).
 */
export function DescargoForm({ fechaLimite, cargando, onSubmit, onCancel }: DescargoFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DescargoFormValues>({
    resolver: zodResolver(descargoSchema),
    defaultValues: {
      descargo: "",
    },
    mode: "onSubmit",
  });

  const textoActual = useWatch({
    control,
    name: "descargo",
    defaultValue: "",
  });
  const caracteresRestantes = Math.max(0, 1000 - (textoActual?.length || 0));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {fechaLimite && (
        <div className="border-warning/30 bg-warning/10 text-warning-text rounded-xl border p-3 text-xs">
          <p className="font-semibold">Plazo de presentación</p>
          <p className="mt-0.5">
            Tiene plazo para presentar su descargo hasta el{" "}
            <span className="font-bold">{fechaLimite}</span>. El descargo se registra una sola vez y
            no podrá ser modificado.
          </p>
        </div>
      )}

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="descargo" className="text-sm font-medium">
            Explicación o descargo *
          </Label>
          <span className="text-2xs text-muted-foreground tabular-nums">
            {caracteresRestantes} caracteres restantes
          </span>
        </div>
        <Textarea
          id="descargo"
          placeholder="Describa detalladamente los motivos o circunstancias por los cuales estuvo ausente durante este tramo..."
          disabled={cargando}
          rows={5}
          aria-invalid={Boolean(errors.descargo)}
          aria-describedby={errors.descargo ? "descargo-error" : "descargo-ayuda"}
          {...register("descargo")}
        />
        <p id="descargo-ayuda" className="text-muted-foreground text-xs">
          Sea claro y específico. Esta respuesta quedará registrada junto a la ausencia para
          revisión de la Dirección.
        </p>
        {errors.descargo && (
          <p id="descargo-error" className="text-destructive text-xs font-medium">
            {errors.descargo.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2.5 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={cargando}
          className="h-10 min-h-10 gap-1.5 rounded-full px-4 text-xs font-semibold"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
          <span>Cancelar</span>
        </Button>
        <Button
          type="submit"
          disabled={cargando}
          className="h-10 min-h-10 gap-1.5 rounded-full px-5 text-xs font-semibold shadow-xs"
        >
          {cargando ? (
            <Spinner className="size-3.5" />
          ) : (
            <HugeiconsIcon icon={SentIcon} className="size-3.5" />
          )}
          <span>{cargando ? "Registrando..." : "Enviar descargo"}</span>
        </Button>
      </div>
    </form>
  );
}
