"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectOption } from "@/components/common/select";
import { Spinner } from "@/components/common/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { editDocenteSchema, type EditDocenteFormValues } from "../../schemas/docentes.schema";
import type {
  Docente,
  JornadaHoras,
  TipoContrato,
  EstadoDocente,
} from "../../types/docentes.types";

const contratoOptions: { value: TipoContrato; label: string }[] = [
  { value: "nombrado", label: "Nombrado" },
  { value: "contratado", label: "Contratado" },
  { value: "destacado", label: "Destacado" },
  { value: "encargado", label: "Encargado" },
  { value: "practicante", label: "Practicante" },
];

const jornadaOptions: { value: string; label: string }[] = [
  { value: "20", label: "20 horas pedagógicas" },
  { value: "24", label: "24 horas pedagógicas" },
  { value: "30", label: "30 horas pedagógicas" },
  { value: "40", label: "40 horas pedagógicas" },
];

const estadoOptions: { value: EstadoDocente; label: string }[] = [
  { value: "activo", label: "Activo" },
  { value: "licencia", label: "Licencia" },
  { value: "cesado", label: "Cesado" },
];

interface EditDocenteFormProps {
  docente: Docente;
  onSubmit: (values: EditDocenteFormValues) => Promise<void> | void;
  isLoading?: boolean;
  onCancel: () => void;
}

export function EditDocenteForm({
  docente,
  onSubmit,
  isLoading = false,
  onCancel,
}: EditDocenteFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EditDocenteFormValues>({
    resolver: zodResolver(editDocenteSchema),
    defaultValues: {
      especialidad: docente.especialidad || "",
      tituloProfesional: docente.tituloProfesional || "",
      tipoContrato: docente.tipoContrato,
      jornadaHoras: docente.jornadaHoras,
      estado: docente.estado,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Resumen del docente */}
      <div className="border-border/60 bg-muted/30 space-y-1 rounded-xl border p-3.5">
        <p className="text-foreground text-sm font-semibold">{docente.persona.nombreCompleto}</p>
        <p className="text-muted-foreground text-xs">
          Código: <span className="font-mono font-medium">{docente.codigo}</span> · Documento:{" "}
          <span className="font-mono font-medium">{docente.persona.numeroDocumento}</span>
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="especialidad" className="text-sm font-medium">
          Especialidad pedagógica (Opcional)
        </Label>
        <Input
          id="especialidad"
          placeholder="Ej. Matemáticas, Comunicación, Ciencias..."
          disabled={isLoading}
          {...register("especialidad")}
        />
        {errors.especialidad && (
          <p className="text-destructive text-xs font-medium">{errors.especialidad.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tituloProfesional" className="text-sm font-medium">
          Título profesional (Opcional)
        </Label>
        <Input
          id="tituloProfesional"
          placeholder="Ej. Licenciado en Educación Secundaria"
          disabled={isLoading}
          {...register("tituloProfesional")}
        />
        {errors.tituloProfesional && (
          <p className="text-destructive text-xs font-medium">{errors.tituloProfesional.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Régimen de contrato *</Label>
          <Controller
            control={control}
            name="tipoContrato"
            render={({ field }) => (
              <SelectOption
                options={contratoOptions}
                value={field.value}
                onSelect={(val) => field.onChange(val as TipoContrato)}
                placeholder="Seleccionar contrato..."
                disabled={isLoading}
              />
            )}
          />
          {errors.tipoContrato && (
            <p className="text-destructive text-xs font-medium">{errors.tipoContrato.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Jornada laboral *</Label>
          <Controller
            control={control}
            name="jornadaHoras"
            render={({ field }) => (
              <SelectOption
                options={jornadaOptions}
                value={String(field.value)}
                onSelect={(val) => field.onChange(Number(val) as JornadaHoras)}
                placeholder="Seleccionar jornada..."
                disabled={isLoading}
              />
            )}
          />
          {errors.jornadaHoras && (
            <p className="text-destructive text-xs font-medium">{errors.jornadaHoras.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Estado administrativo *</Label>
        <Controller
          control={control}
          name="estado"
          render={({ field }) => (
            <SelectOption
              options={estadoOptions}
              value={field.value}
              onSelect={(val) => field.onChange(val as EstadoDocente)}
              placeholder="Seleccionar estado..."
              disabled={isLoading}
            />
          )}
        />
        {errors.estado && (
          <p className="text-destructive text-xs font-medium">{errors.estado.message}</p>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-2.5 pt-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="h-10 gap-1.5 rounded-full px-4.5 text-xs font-semibold"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
          <span>Cancelar</span>
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="shadow-primary/20 h-10 gap-1.5 rounded-full px-5 text-xs font-semibold shadow-md"
        >
          {isLoading ? (
            <Spinner className="size-3.5" />
          ) : (
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
          )}
          <span>Guardar cambios</span>
        </Button>
      </div>
    </form>
  );
}
