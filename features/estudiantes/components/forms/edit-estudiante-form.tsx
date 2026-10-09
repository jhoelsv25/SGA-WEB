"use client";

import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/common/date-picker";
import { SelectOption } from "@/components/common/select";
import { Spinner } from "@/components/common/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import {
  updateEstudianteSchema,
  type UpdateEstudianteFormValues,
} from "../../schemas/estudiantes.schema";
import { parseIsoDate, formatToIsoDate } from "../../utils/dates";
import type { Estudiante, EstadoEstudiante } from "../../types/estudiantes.types";

const estadoOptions: { value: EstadoEstudiante; label: string }[] = [
  { value: "activo", label: "Activo" },
  { value: "retirado", label: "Retirado" },
  { value: "trasladado", label: "Trasladado" },
  { value: "egresado", label: "Egresado" },
];

const discapacidadOptions: { value: string; label: string }[] = [
  { value: "false", label: "No presenta discapacidad" },
  { value: "true", label: "Sí presenta discapacidad certificada" },
];

interface EditEstudianteFormProps {
  estudiante: Estudiante;
  onSubmit: (values: UpdateEstudianteFormValues) => Promise<void> | void;
  isLoading?: boolean;
  onCancel: () => void;
}

export function EditEstudianteForm({
  estudiante,
  onSubmit,
  isLoading = false,
  onCancel,
}: EditEstudianteFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UpdateEstudianteFormValues>({
    resolver: zodResolver(updateEstudianteSchema),
    defaultValues: {
      fechaIngreso: estudiante.fechaIngreso,
      lenguaMaterna: estudiante.lenguaMaterna || "",
      religion: estudiante.religion || "",
      tieneDiscapacidad: estudiante.tieneDiscapacidad,
      detalleDiscapacidad: estudiante.detalleDiscapacidad || "",
      grupoSanguineo: estudiante.grupoSanguineo || "",
      alergias: estudiante.alergias || "",
      condicionesMedicas: estudiante.condicionesMedicas || "",
      seguroSalud: estudiante.seguroSalud || "",
      estado: estudiante.estado,
      motivo: "",
    },
  });

  const tieneDiscapacidadValor = useWatch({ control, name: "tieneDiscapacidad" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Resumen del estudiante */}
      <div className="border-border/60 bg-muted/30 space-y-1 rounded-xl border p-3.5">
        <p className="text-foreground text-sm font-semibold">{estudiante.persona.nombreCompleto}</p>
        <p className="text-muted-foreground text-xs">
          Código SIAGIE: <span className="font-mono font-medium">{estudiante.codigo}</span> ·
          Documento:{" "}
          <span className="font-mono font-medium">
            {estudiante.persona.tipoDocumento.toUpperCase()}: {estudiante.persona.numeroDocumento}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Fecha de ingreso *</Label>
          <Controller
            control={control}
            name="fechaIngreso"
            render={({ field }) => (
              <DatePicker
                date={parseIsoDate(field.value)}
                onSelect={(date) => field.onChange(formatToIsoDate(date))}
                disabled={isLoading}
                clearable={false}
                dateFormat="dd/MM/yyyy"
                placeholder="Seleccionar fecha"
                className="w-full"
              />
            )}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Estado escolar *</Label>
          <Controller
            control={control}
            name="estado"
            render={({ field }) => (
              <SelectOption
                options={estadoOptions}
                value={field.value}
                onSelect={(val) => field.onChange(val as EstadoEstudiante)}
                placeholder="Seleccionar estado..."
                disabled={isLoading}
              />
            )}
          />
          {errors.estado && (
            <p className="text-destructive text-xs font-medium">{errors.estado.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="lenguaMaterna" className="text-sm font-medium">
            Lengua materna
          </Label>
          <Input
            id="lenguaMaterna"
            placeholder="Ej. Castellano"
            disabled={isLoading}
            {...register("lenguaMaterna")}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="religion" className="text-sm font-medium">
            Religión
          </Label>
          <Input
            id="religion"
            placeholder="Ej. Católica"
            disabled={isLoading}
            {...register("religion")}
          />
        </div>
      </div>

      {/* Discapacidad */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Discapacidad certificada</Label>
          <Controller
            control={control}
            name="tieneDiscapacidad"
            render={({ field }) => (
              <SelectOption
                options={discapacidadOptions}
                value={String(field.value)}
                onSelect={(val) => field.onChange(val === "true")}
                placeholder="Seleccionar condición..."
                disabled={isLoading}
              />
            )}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="detalleDiscapacidad" className="text-sm font-medium">
            Detalle de discapacidad {tieneDiscapacidadValor ? "*" : "(Opcional)"}
          </Label>
          <Input
            id="detalleDiscapacidad"
            placeholder="Ej. Auditiva moderada..."
            disabled={isLoading || !tieneDiscapacidadValor}
            {...register("detalleDiscapacidad")}
          />
          {errors.detalleDiscapacidad && (
            <p className="text-destructive text-xs font-medium">
              {errors.detalleDiscapacidad.message}
            </p>
          )}
        </div>
      </div>

      {/* Salud */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="grupoSanguineo" className="text-sm font-medium">
            Grupo sanguíneo
          </Label>
          <Input
            id="grupoSanguineo"
            placeholder="Ej. O+"
            disabled={isLoading}
            {...register("grupoSanguineo")}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="alergias" className="text-sm font-medium">
            Alergias
          </Label>
          <Input
            id="alergias"
            placeholder="Ej. Penicilina..."
            disabled={isLoading}
            {...register("alergias")}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="seguroSalud" className="text-sm font-medium">
            Seguro de salud
          </Label>
          <Input
            id="seguroSalud"
            placeholder="Ej. SIS"
            disabled={isLoading}
            {...register("seguroSalud")}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="condicionesMedicas" className="text-sm font-medium">
          Condiciones médicas relevantes
        </Label>
        <Input
          id="condicionesMedicas"
          placeholder="Ej. Asma bronquial..."
          disabled={isLoading}
          {...register("condicionesMedicas")}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="motivo" className="text-sm font-medium">
          Motivo de la actualización (Opcional)
        </Label>
        <Textarea
          id="motivo"
          placeholder="Indique el motivo del cambio para auditoría..."
          rows={2}
          disabled={isLoading}
          {...register("motivo")}
        />
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
