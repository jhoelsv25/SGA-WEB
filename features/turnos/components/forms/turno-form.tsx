"use client";

import * as React from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Clock01Icon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
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
          Tipo de persona destinataria <span className="text-destructive">*</span>
        </Label>
        {isEditing ? (
          <div className="bg-muted/60 border-border/80 flex items-center justify-between rounded-lg border p-2.5">
            <span className="text-foreground text-sm font-semibold capitalize">
              {initialTurno?.tipoPersona}
            </span>
            <Badge variant="outline" className="text-xs">
              Configuración de turno oficial
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
      <div className="border-info/20 bg-info/10 space-y-4 rounded-xl border p-4">
        <div className="flex items-center justify-between">
          <h4 className="text-info flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
            <HugeiconsIcon icon={Clock01Icon} className="h-4 w-4" />
            1. Horario y ventana de entrada
          </h4>
          <span className="text-muted-foreground text-xs">Marcación matutina</span>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="space-y-1">
            <Label htmlFor="horaEntrada" className="text-foreground text-xs font-semibold">
              Hora oficial de entrada <span className="text-destructive">*</span>
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
              Ventana desde
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
              Ventana hasta
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
      <div className="border-warning/20 bg-warning/10 space-y-4 rounded-xl border p-4">
        <div className="flex items-center justify-between">
          <h4 className="text-warning flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
            <HugeiconsIcon icon={Clock01Icon} className="h-4 w-4" />
            2. Horario y ventana de salida
          </h4>
          <span className="text-muted-foreground text-xs">Término de jornada</span>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="space-y-1">
            <Label htmlFor="horaSalida" className="text-foreground text-xs font-semibold">
              Hora oficial de salida <span className="text-destructive">*</span>
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
              Ventana desde
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
              Ventana hasta
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
            Tolerancia de ingreso (minutos) (Opcional)
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
                Estado del turno
              </Label>
              <p className="text-muted-foreground text-xs">
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
            Días laborables <span className="text-destructive">*</span>
          </Label>
          <div className="flex gap-2 text-xs">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSelectLunesViernes}
              className="h-7 px-2 text-xs"
            >
              Lunes a viernes
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
                aria-pressed={isSelected}
                aria-label={`Día ${dia.label}`}
                className={`focus-visible:ring-primary/40 flex min-h-11 flex-col items-center justify-center rounded-lg border p-2 text-xs font-semibold transition-all outline-none focus-visible:ring-2 ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-background text-muted-foreground border-border hover:bg-muted/70"
                }`}
              >
                <span>{dia.short}</span>
                <span className="hidden text-xs font-normal sm:inline">
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
      <div className="border-info/20 bg-info/10 text-foreground flex items-start gap-2.5 rounded-lg border p-3 text-xs">
        <HugeiconsIcon icon={InformationCircleIcon} className="text-info mt-0.5 h-4 w-4 shrink-0" />
        <p>
          <strong>Sin efecto retroactivo:</strong> Los cambios en este turno aplican exclusivamente
          a las nuevas marcaciones que se registren a partir de ahora.
        </p>
      </div>

      {/* Botones de acción */}
      <div className="flex items-center justify-end gap-2.5 pt-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="h-10 gap-1.5 rounded-full px-4.5 text-xs font-semibold"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
          <span>Cancelar</span>
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="shadow-primary/20 h-10 gap-1.5 rounded-full px-5 text-xs font-semibold shadow-md"
        >
          {isSubmitting ? (
            <Spinner className="size-3.5" />
          ) : (
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
          )}
          <span>Guardar turno</span>
        </Button>
      </div>
    </form>
  );
}
