"use client";

import * as React from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Clock01Icon,
  CheckmarkCircle02Icon,
  Calendar03Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/common/spinner";
import { SelectOption } from "@/components/common/select";
import { DIAS_SEMANA, DIAS_LABORABLES_DEFAULT } from "../../consts";
import { turnoSchema, type TurnoFormValues } from "../../schemas";
import type { Turno } from "../../types";

const TIPO_PERSONA_OPTIONS = [
  { value: "estudiantes", label: "Estudiantes" },
  { value: "docentes", label: "Docentes" },
  { value: "administrativos", label: "Administrativos" },
];

interface TurnoFormProps {
  initialTurno?: Turno | null;
  onSubmit: (values: TurnoFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function TurnoForm({
  initialTurno,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: TurnoFormProps) {
  const isEditing = Boolean(initialTurno);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<TurnoFormValues>({
    resolver: zodResolver(turnoSchema),
    defaultValues: {
      tipoPersona: initialTurno?.tipoPersona || "docentes",
      horaEntrada: initialTurno?.horaEntrada || "07:45",
      ventanaEntradaInicio: initialTurno?.ventanaEntradaInicio || "06:30",
      ventanaEntradaFin: initialTurno?.ventanaEntradaFin || "09:30",
      horaSalida: initialTurno?.horaSalida || "13:15",
      ventanaSalidaInicio: initialTurno?.ventanaSalidaInicio || "12:30",
      ventanaSalidaFin: initialTurno?.ventanaSalidaFin || "15:00",
      toleranciaMinutos: initialTurno?.toleranciaMinutos ?? 10,
      diasLaborables: initialTurno?.diasLaborables || DIAS_LABORABLES_DEFAULT,
      activo: initialTurno?.activo ?? true,
    },
  });

  const selectedDias = useWatch({ control, name: "diasLaborables" });

  const toggleDia = (diaValue: number) => {
    const current = selectedDias || [];
    if (current.includes(diaValue)) {
      setValue(
        "diasLaborables",
        current.filter((d) => d !== diaValue),
        { shouldValidate: true },
      );
    } else {
      setValue("diasLaborables", [...current, diaValue].sort(), {
        shouldValidate: true,
      });
    }
  };

  const handleSelectLunesViernes = () => {
    setValue("diasLaborables", [1, 2, 3, 4, 5], { shouldValidate: true });
  };

  const handleSelectTodos = () => {
    setValue("diasLaborables", [1, 2, 3, 4, 5, 6, 7], { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Tipo de Persona */}
      <div className="space-y-2">
        <Label htmlFor="tipoPersona" className="text-xs font-semibold">
          Tipo de Persona destinataria <span className="text-destructive">*</span>
        </Label>
        {isEditing ? (
          <div className="bg-muted/60 border-border/80 flex items-center justify-between rounded-lg border p-2.5">
            <span className="text-foreground text-sm font-semibold capitalize">
              {initialTurno?.tipoPersona}
            </span>
            <Badge variant="outline" className="text-xs">
              Configuración de Turno Oficial
            </Badge>
          </div>
        ) : (
          <Controller
            control={control}
            name="tipoPersona"
            render={({ field }) => (
              <SelectOption
                value={field.value}
                onSelect={field.onChange}
                options={TIPO_PERSONA_OPTIONS}
                placeholder="Seleccione tipo de persona"
                disabled={isSubmitting}
              />
            )}
          />
        )}
        {errors.tipoPersona && (
          <p className="text-destructive text-xs">{errors.tipoPersona.message}</p>
        )}
      </div>

      {/* Bloque: Ventana y Hora Oficial de ENTRADA */}
      <div className="space-y-4 rounded-xl border border-blue-500/20 bg-blue-50/40 p-4 dark:bg-blue-950/20">
        <div className="flex items-center justify-between">
          <h4 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-blue-700 uppercase dark:text-blue-400">
            <HugeiconsIcon icon={Clock01Icon} className="h-4 w-4" />
            1. Horario y Ventana de Entrada
          </h4>
          <span className="text-muted-foreground text-[11px]">Marcación Matutina</span>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="space-y-1">
            <Label htmlFor="horaEntrada" className="text-foreground text-xs font-semibold">
              Hora Oficial Entrada <span className="text-destructive">*</span>
            </Label>
            <Input
              id="horaEntrada"
              type="time"
              {...register("horaEntrada")}
              disabled={isSubmitting}
              className="bg-background"
            />
            {errors.horaEntrada && (
              <p className="text-destructive text-xs">{errors.horaEntrada.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="ventanaEntradaInicio"
              className="text-muted-foreground text-xs font-medium"
            >
              Ventana Desde
            </Label>
            <Input
              id="ventanaEntradaInicio"
              type="time"
              {...register("ventanaEntradaInicio")}
              disabled={isSubmitting}
              className="bg-background"
            />
            {errors.ventanaEntradaInicio && (
              <p className="text-destructive text-xs">{errors.ventanaEntradaInicio.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="ventanaEntradaFin"
              className="text-muted-foreground text-xs font-medium"
            >
              Ventana Hasta
            </Label>
            <Input
              id="ventanaEntradaFin"
              type="time"
              {...register("ventanaEntradaFin")}
              disabled={isSubmitting}
              className="bg-background"
            />
            {errors.ventanaEntradaFin && (
              <p className="text-destructive text-xs">{errors.ventanaEntradaFin.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Bloque: Ventana y Hora Oficial de SALIDA */}
      <div className="space-y-4 rounded-xl border border-amber-500/20 bg-amber-50/40 p-4 dark:bg-amber-950/20">
        <div className="flex items-center justify-between">
          <h4 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-amber-700 uppercase dark:text-amber-400">
            <HugeiconsIcon icon={Clock01Icon} className="h-4 w-4" />
            2. Horario y Ventana de Salida
          </h4>
          <span className="text-muted-foreground text-[11px]">Término de Jornada</span>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="space-y-1">
            <Label htmlFor="horaSalida" className="text-foreground text-xs font-semibold">
              Hora Oficial Salida <span className="text-destructive">*</span>
            </Label>
            <Input
              id="horaSalida"
              type="time"
              {...register("horaSalida")}
              disabled={isSubmitting}
              className="bg-background"
            />
            {errors.horaSalida && (
              <p className="text-destructive text-xs">{errors.horaSalida.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="ventanaSalidaInicio"
              className="text-muted-foreground text-xs font-medium"
            >
              Ventana Desde
            </Label>
            <Input
              id="ventanaSalidaInicio"
              type="time"
              {...register("ventanaSalidaInicio")}
              disabled={isSubmitting}
              className="bg-background"
            />
            {errors.ventanaSalidaInicio && (
              <p className="text-destructive text-xs">{errors.ventanaSalidaInicio.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="ventanaSalidaFin" className="text-muted-foreground text-xs font-medium">
              Ventana Hasta
            </Label>
            <Input
              id="ventanaSalidaFin"
              type="time"
              {...register("ventanaSalidaFin")}
              disabled={isSubmitting}
              className="bg-background"
            />
            {errors.ventanaSalidaFin && (
              <p className="text-destructive text-xs">{errors.ventanaSalidaFin.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Tolerancia y Estado Activo */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="bg-muted/20 space-y-2 rounded-xl border p-3.5">
          <Label htmlFor="toleranciaMinutos" className="text-xs font-semibold">
            Tolerancia de Ingreso (Minutos)
          </Label>
          <div className="flex items-center gap-3">
            <Input
              id="toleranciaMinutos"
              type="number"
              min={0}
              max={60}
              {...register("toleranciaMinutos", { valueAsNumber: true })}
              disabled={isSubmitting}
              className="w-28"
            />
            <span className="text-muted-foreground text-xs">
              De 0 a 60 min. Pasado este tiempo se computa como tardanza.
            </span>
          </div>
          {errors.toleranciaMinutos && (
            <p className="text-destructive text-xs">{errors.toleranciaMinutos.message}</p>
          )}
        </div>

        <div className="bg-muted/20 flex flex-col justify-between space-y-2 rounded-xl border p-3.5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="activo" className="text-xs font-semibold">
                Estado del Turno
              </Label>
              <p className="text-muted-foreground text-[11px]">
                Si está inactivo, las marcaciones no calculan tardanzas.
              </p>
            </div>
            <Controller
              control={control}
              name="activo"
              render={({ field }) => (
                <Switch
                  id="activo"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* Días Laborables */}
      <div className="bg-muted/20 space-y-3 rounded-xl border p-4">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-1.5 text-xs font-semibold">
            <HugeiconsIcon icon={Calendar03Icon} className="text-primary h-4 w-4" />
            Días Laborables <span className="text-destructive">*</span>
          </Label>
          <div className="flex gap-2 text-xs">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSelectLunesViernes}
              className="h-7 px-2 text-xs"
            >
              Lunes a Viernes
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSelectTodos}
              className="h-7 px-2 text-xs"
            >
              Todos
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {DIAS_SEMANA.map((dia) => {
            const isSelected = selectedDias?.includes(dia.value);
            return (
              <button
                key={dia.value}
                type="button"
                onClick={() => toggleDia(dia.value)}
                disabled={isSubmitting}
                className={`flex flex-col items-center justify-center rounded-lg border p-2 text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-background text-muted-foreground border-border hover:bg-muted/70"
                }`}
              >
                <span>{dia.short}</span>
                <span className="hidden text-[10px] font-normal sm:inline">
                  {dia.label.slice(0, 3)}
                </span>
              </button>
            );
          })}
        </div>
        {errors.diasLaborables && (
          <p className="text-destructive text-xs">{errors.diasLaborables.message}</p>
        )}
      </div>

      {/* Nota de negocio */}
      <div className="flex items-start gap-2.5 rounded-lg border border-blue-500/20 bg-blue-500/10 p-3 text-xs text-blue-900 dark:text-blue-200">
        <HugeiconsIcon
          icon={InformationCircleIcon}
          className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400"
        />
        <p>
          <strong>Sin efecto retroactivo:</strong> Los cambios en este turno aplican exclusivamente
          a las nuevas marcaciones que se registren a partir de ahora.
        </p>
      </div>

      {/* Botones de acción */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting} className="gap-2 px-5">
          {isSubmitting ? (
            <>
              <Spinner className="h-4 w-4" />
              Guardando turno...
            </>
          ) : (
            <>
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-4 w-4" />
              Guardar Turno
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
