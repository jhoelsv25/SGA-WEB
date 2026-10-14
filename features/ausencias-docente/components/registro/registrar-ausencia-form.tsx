"use client";

import * as React from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { SelectOption } from "@/components/common/select";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OPCIONES_MOTIVO_AUSENCIA, type MotivoAusencia } from "../../consts";
import { useRegistrarAusencia } from "../../hooks";
import { AdjuntarFotos } from "./adjuntar-fotos";
import { CalculadorMinutosBadge } from "./calculador-minutos-badge";
import { ResumenSesionAusencia } from "./resumen-sesion-ausencia";
import { esquemaRegistroAusencia, type EsquemaRegistroAusenciaValores } from "./schemas";
import type { FotoEvidenciaLocal, SesionParaRegistroAusencia } from "./types";

interface RegistrarAusenciaFormProps {
  sesion: SesionParaRegistroAusencia;
  onExito?: () => void;
  onCancel?: () => void;
}

/**
 * Formulario de registro de ausencia docente (RF-012 HU1).
 * Implementa validaciones locales con react-hook-form y Zod,
 * cálculo de minutos en vivo y adjunto de evidencias fotográficas.
 */
export function RegistrarAusenciaForm({ sesion, onExito, onCancel }: RegistrarAusenciaFormProps) {
  const [fotos, setFotos] = React.useState<FotoEvidenciaLocal[]>([]);
  const registrarMutation = useRegistrarAusencia();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EsquemaRegistroAusenciaValores>({
    resolver: zodResolver(esquemaRegistroAusencia),
    defaultValues: {
      horaDesde: "",
      horaHasta: "",
      motivo: "fuera_del_aula",
      observacion: "",
    },
  });

  const horaDesde = useWatch({ control, name: "horaDesde" });
  const horaHasta = useWatch({ control, name: "horaHasta" });
  const motivoSeleccionado = useWatch({ control, name: "motivo" });

  const onSubmit = async (values: EsquemaRegistroAusenciaValores) => {
    const metadatosFotos =
      fotos.length > 0 ? JSON.stringify(fotos.map((f) => ({ tomadaEn: f.tomadaEn }))) : undefined;

    await registrarMutation.mutateAsync({
      datos: {
        sesionClaseId: sesion.id,
        horaDesde: values.horaDesde,
        horaHasta: values.horaHasta,
        motivo: values.motivo,
        observacion: values.observacion?.trim() || undefined,
        metadatosFotos,
      },
      fotos: fotos.map((f) => f.archivo),
    });

    onExito?.();
  };

  const isPending = registrarMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Resumen de la sesión */}
      <ResumenSesionAusencia sesion={sesion} />

      {/* Tramos horarios de la ausencia */}
      <div className="space-y-2">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="horaDesde" className="text-sm font-medium">
              Hora desde *
            </Label>
            <Input
              id="horaDesde"
              type="time"
              step="60"
              disabled={isPending}
              aria-invalid={Boolean(errors.horaDesde)}
              {...register("horaDesde")}
            />
            {errors.horaDesde && (
              <p className="text-destructive text-xs font-medium">{errors.horaDesde.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="horaHasta" className="text-sm font-medium">
              Hora hasta *
            </Label>
            <Input
              id="horaHasta"
              type="time"
              step="60"
              disabled={isPending}
              aria-invalid={Boolean(errors.horaHasta)}
              {...register("horaHasta")}
            />
            {errors.horaHasta && (
              <p className="text-destructive text-xs font-medium">{errors.horaHasta.message}</p>
            )}
          </div>
        </div>

        {/* Minutos calculados en tiempo real */}
        <div className="pt-0.5">
          <CalculadorMinutosBadge horaDesde={horaDesde ?? ""} horaHasta={horaHasta ?? ""} />
        </div>
      </div>

      {/* Motivo de la ausencia */}
      <div className="space-y-1.5">
        <Label htmlFor="motivo" className="text-sm font-medium">
          Motivo *
        </Label>
        <Controller
          control={control}
          name="motivo"
          render={({ field }) => (
            <SelectOption<MotivoAusencia>
              options={OPCIONES_MOTIVO_AUSENCIA}
              value={field.value}
              onSelect={(val) => field.onChange(val)}
              placeholder="Seleccionar motivo..."
              searchPlaceholder="Buscar motivo..."
              disabled={isPending}
            />
          )}
        />
        {errors.motivo && (
          <p className="text-destructive text-xs font-medium">{errors.motivo.message}</p>
        )}
      </div>

      {/* Observación (obligatoria cuando el motivo es «otro») */}
      <div className="space-y-1.5">
        <Label htmlFor="observacion" className="text-sm font-medium">
          Observación {motivoSeleccionado === "otro" ? "*" : "(Opcional)"}
        </Label>
        <Textarea
          id="observacion"
          placeholder={
            motivoSeleccionado === "otro"
              ? "Describa la situación observada..."
              : "Detalles adicionales sobre la ausencia constatada..."
          }
          disabled={isPending}
          aria-invalid={Boolean(errors.observacion)}
          {...register("observacion")}
        />
        <p className="text-muted-foreground text-xs">
          {motivoSeleccionado === "otro"
            ? "Describa la situación cuando el motivo es «Otro»."
            : "Opcional. Máximo 1000 caracteres."}
        </p>
        {errors.observacion && (
          <p className="text-destructive text-xs font-medium">{errors.observacion.message}</p>
        )}
      </div>

      {/* Fotos de evidencia */}
      <AdjuntarFotos fotos={fotos} onFotosChange={setFotos} disabled={isPending} />

      {/* Botones de acción */}
      <div className="flex justify-end gap-2.5 pt-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
            className="min-h-10 gap-1.5 rounded-full px-4.5 text-xs font-semibold"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" aria-hidden="true" />
            <span>Cancelar</span>
          </Button>
        )}
        <Button
          type="submit"
          disabled={isPending}
          className="shadow-primary/20 min-h-10 gap-1.5 rounded-full px-5 text-xs font-semibold shadow-md"
        >
          {isPending ? (
            <Spinner className="size-3.5" />
          ) : (
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" aria-hidden="true" />
          )}
          <span>Guardar ausencia</span>
        </Button>
      </div>
    </form>
  );
}
