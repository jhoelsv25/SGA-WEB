"use client";

import * as React from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectOption } from "@/components/common/select";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OPCIONES_MOTIVO_AUSENCIA, type MotivoAusencia } from "@/features/ausencias-docente/consts";
import { useCorregirAusencia } from "@/features/ausencias-docente/hooks";
import type { AusenciaResponseDto } from "@/features/ausencias-docente/types";
import { calcularMinutosEntre, validarArchivosFotos } from "@/features/ausencias-docente/utils";
import { CamposHorarioEdicion } from "./campos-horario-edicion";
import { crearCorregirAusenciaSchema, type CorregirAusenciaFormValues } from "./correccion.schema";
import { ResumenSesionEdicion } from "./resumen-sesion-edicion";
import { SelectorFotosEdicion } from "./selector-fotos-edicion";

export interface FormularioCorregirAusenciaProps {
  ausencia: AusenciaResponseDto;
  onCerrar: () => void;
}

/**
 * Formulario desacoplado con React Hook Form y Zod para corregir una ausencia docente.
 */
export function FormularioCorregirAusencia({
  ausencia,
  onCerrar,
}: FormularioCorregirAusenciaProps) {
  const [fotosRetiradasIds, setFotosRetiradasIds] = React.useState<string[]>([]);
  const [nuevasFotos, setNuevasFotos] = React.useState<File[]>([]);
  const [metadatosFotos, setMetadatosFotos] = React.useState<string>("");
  const [errorFotos, setErrorFotos] = React.useState<string | null>(null);

  const corregirMutation = useCorregirAusencia();

  const esquema = React.useMemo(
    () =>
      crearCorregirAusenciaSchema({
        horaInicio: ausencia.sesion.horaInicio,
        horaFin: ausencia.sesion.horaFin,
      }),
    [ausencia.sesion.horaInicio, ausencia.sesion.horaFin],
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CorregirAusenciaFormValues>({
    resolver: zodResolver(esquema),
    defaultValues: {
      horaDesde: ausencia.horaDesde || "",
      horaHasta: ausencia.horaHasta || "",
      motivo: ausencia.motivo || "fuera_del_aula",
      observacion: ausencia.observacion || "",
      motivoCambio: "",
    },
  });

  const horaDesdeActual = useWatch({ control, name: "horaDesde" });
  const horaHastaActual = useWatch({ control, name: "horaHasta" });
  const motivoActual = useWatch({ control, name: "motivo" });
  const minutosCalculados = calcularMinutosEntre(horaDesdeActual, horaHastaActual);

  const onSubmit = (values: CorregirAusenciaFormValues) => {
    if (nuevasFotos.length > 0) {
      const errFotos = validarArchivosFotos(nuevasFotos);
      if (errFotos) {
        setErrorFotos(errFotos);
        return;
      }
    }

    corregirMutation.mutate(
      {
        id: ausencia.id,
        datos: {
          horaDesde: values.horaDesde,
          horaHasta: values.horaHasta,
          motivo: values.motivo,
          observacion: values.observacion ? values.observacion.trim() : undefined,
          motivoCambio: values.motivoCambio.trim(),
          fotosRetiradasIds: fotosRetiradasIds.length > 0 ? fotosRetiradasIds : undefined,
          metadatosFotos: metadatosFotos || undefined,
        },
        fotos: nuevasFotos.length > 0 ? nuevasFotos : undefined,
      },
      {
        onSuccess: onCerrar,
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Cabecera contextual informativa */}
      <ResumenSesionEdicion sesion={ausencia.sesion} />

      {/* Tramo horario de la ausencia */}
      <CamposHorarioEdicion
        register={register}
        errors={errors}
        minutosCalculados={minutosCalculados}
        disabled={corregirMutation.isPending}
      />

      {/* Motivo de la ausencia */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Motivo de la ausencia *</Label>
        <Controller
          control={control}
          name="motivo"
          render={({ field }) => (
            <SelectOption
              options={OPCIONES_MOTIVO_AUSENCIA}
              value={field.value}
              onSelect={(val) => field.onChange(val as MotivoAusencia)}
              placeholder="Seleccione el motivo"
              searchPlaceholder="Buscar motivo..."
              disabled={corregirMutation.isPending}
            />
          )}
        />
        {errors.motivo && (
          <p className="text-destructive text-xs font-medium">{errors.motivo.message}</p>
        )}
      </div>

      {/* Observación (obligatoria si motivo es 'otro') */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="observacion" className="text-xs font-medium">
            Observación {motivoActual === "otro" ? "*" : "(opcional)"}
          </Label>
          {motivoActual === "otro" && (
            <span className="text-destructive text-2xs font-semibold">Obligatoria para «Otro»</span>
          )}
        </div>
        <Textarea
          id="observacion"
          rows={2}
          placeholder="Detalles complementarios de la ausencia observada..."
          disabled={corregirMutation.isPending}
          aria-invalid={Boolean(errors.observacion)}
          className="resize-none text-xs"
          {...register("observacion")}
        />
        {errors.observacion && (
          <p className="text-destructive text-xs font-medium">{errors.observacion.message}</p>
        )}
      </div>

      {/* Motivo obligatorio del cambio */}
      <div className="space-y-1.5">
        <Label htmlFor="motivoCambio" className="text-foreground text-xs font-semibold">
          Motivo de la corrección *
        </Label>
        <Textarea
          id="motivoCambio"
          rows={2}
          placeholder="Indique la justificación del cambio realizado (ej. Corrección en horario)..."
          disabled={corregirMutation.isPending}
          aria-invalid={Boolean(errors.motivoCambio)}
          className="resize-none text-xs"
          {...register("motivoCambio")}
        />
        {errors.motivoCambio && (
          <p className="text-destructive text-xs font-medium">{errors.motivoCambio.message}</p>
        )}
      </div>

      {/* Gestión modular de evidencias fotográficas */}
      <div className="border-border/60 border-t pt-3">
        <SelectorFotosEdicion
          fotosExistentes={ausencia.fotos ?? []}
          fotosRetiradasIds={fotosRetiradasIds}
          onFotosRetiradasChange={setFotosRetiradasIds}
          onNuevasFotosChange={(fotos, metadatos) => {
            setNuevasFotos(fotos);
            setMetadatosFotos(metadatos);
            if (errorFotos) setErrorFotos(null);
          }}
          disabled={corregirMutation.isPending}
        />
        {errorFotos && <p className="text-destructive mt-1 text-xs font-medium">{errorFotos}</p>}
      </div>

      {/* Botones de acción */}
      <div className="border-border/50 flex justify-end gap-2.5 border-t pt-3">
        <Button
          type="button"
          variant="outline"
          disabled={corregirMutation.isPending}
          onClick={onCerrar}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={corregirMutation.isPending} className="gap-2">
          {corregirMutation.isPending && <Spinner className="size-4" />}
          Guardar corrección
        </Button>
      </div>
    </form>
  );
}
