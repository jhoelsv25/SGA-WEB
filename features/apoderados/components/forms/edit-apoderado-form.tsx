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
import {
  updateApoderadoSchema,
  type UpdateApoderadoFormValues,
} from "../../schemas/apoderados.schema";
import type { Apoderado, GradoInstruccion } from "../../types/apoderados.types";

const gradoInstruccionOptions: { value: GradoInstruccion; label: string }[] = [
  { value: "sin_estudios", label: "Sin estudios" },
  { value: "primaria", label: "Primaria completa/incompleta" },
  { value: "secundaria", label: "Secundaria completa/incompleta" },
  { value: "tecnica", label: "Educación Técnica" },
  { value: "universitaria", label: "Educación Universitaria" },
  { value: "posgrado", label: "Posgrado (Maestría / Doctorado)" },
];

interface EditApoderadoFormProps {
  apoderado: Apoderado;
  onSubmit: (values: UpdateApoderadoFormValues) => Promise<void> | void;
  isLoading?: boolean;
  onCancel: () => void;
}

export function EditApoderadoForm({
  apoderado,
  onSubmit,
  isLoading = false,
  onCancel,
}: EditApoderadoFormProps) {
  const { register, handleSubmit, control } = useForm<UpdateApoderadoFormValues>({
    resolver: zodResolver(updateApoderadoSchema),
    defaultValues: {
      ocupacion: apoderado.ocupacion || "",
      centroLaboral: apoderado.centroLaboral || "",
      telefonoLaboral: apoderado.telefonoLaboral || "",
      gradoInstruccion: apoderado.gradoInstruccion || "universitaria",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Resumen de la persona */}
      <div className="border-border/60 bg-muted/30 space-y-1 rounded-xl border p-3.5">
        <p className="text-foreground text-sm font-semibold">{apoderado.persona.nombreCompleto}</p>
        <p className="text-muted-foreground font-mono text-xs">
          {apoderado.persona.tipoDocumento.toUpperCase()}: {apoderado.persona.numeroDocumento}
          {apoderado.persona.celular && ` · Cel: ${apoderado.persona.celular}`}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs">Grado de Instrucción</Label>
          <Controller
            control={control}
            name="gradoInstruccion"
            render={({ field }) => (
              <SelectOption
                options={gradoInstruccionOptions}
                value={field.value || "universitaria"}
                onSelect={(val) => field.onChange(val as GradoInstruccion)}
                disabled={isLoading}
              />
            )}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="edit-apod-ocupacion" className="text-xs">
            Ocupación / Profesión
          </Label>
          <Input
            id="edit-apod-ocupacion"
            placeholder="Ocupación"
            {...register("ocupacion")}
            disabled={isLoading}
            className="h-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="edit-apod-centro" className="text-xs">
            Centro laboral / Empresa
          </Label>
          <Input
            id="edit-apod-centro"
            placeholder="Centro laboral"
            {...register("centroLaboral")}
            disabled={isLoading}
            className="h-9"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="edit-apod-tel-lab" className="text-xs">
            Teléfono laboral
          </Label>
          <Input
            id="edit-apod-tel-lab"
            placeholder="Teléfono laboral"
            {...register("telefonoLaboral")}
            disabled={isLoading}
            className="h-9 font-mono"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="gap-2"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading} className="gap-2">
          {isLoading ? (
            <Spinner className="h-4 w-4" />
          ) : (
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-4 w-4" />
          )}
          Guardar Cambios
        </Button>
      </div>
    </form>
  );
}
