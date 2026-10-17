"use client";

import * as React from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/common/date-picker";
import { Spinner } from "@/components/common/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { INDICADORES_LISTA, MENSAJES_INDICADORES, NOMBRES_INDICADORES } from "../../consts";
import type { Indicador, RegistrarPretestDto } from "../../types";
import { cn } from "@/lib/utils";

export interface FormRegistrarPretestValues {
  indicador: Indicador;
  periodoDescrito: string;
  fechaInicio: string;
  fechaFin: string;
  numerador: number;
  denominador: number;
  fuente: string;
}

interface Props {
  indicadorInicial?: Indicador;
  onSubmit: (dto: RegistrarPretestDto) => Promise<void> | void;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function FormRegistrarPretest({
  indicadorInicial = "CSP",
  onSubmit,
  isLoading = false,
  onCancel,
}: Props) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FormRegistrarPretestValues>({
    defaultValues: {
      indicador: indicadorInicial,
      periodoDescrito: "",
      fechaInicio: "",
      fechaFin: "",
      numerador: 0,
      denominador: 100,
      fuente: "",
    },
    mode: "onBlur",
  });

  const indicadorSeleccionado = useWatch({ control, name: "indicador" });
  const numeradorValor = useWatch({ control, name: "numerador" });
  const denominadorValor = useWatch({ control, name: "denominador" });
  const fechaInicioValor = useWatch({ control, name: "fechaInicio" });

  // Cálculo reactivo del porcentaje estimado
  const calculoPretest = React.useMemo(() => {
    const num = Number(numeradorValor);
    const den = Number(denominadorValor);
    if (Number.isNaN(num) || Number.isNaN(den) || den <= 0) {
      return { esValido: false, porcentaje: null, texto: "—" };
    }
    if (num > den) {
      return {
        esValido: false,
        porcentaje: null,
        texto: MENSAJES_INDICADORES.NUMERADOR_MAYOR,
      };
    }
    const pct = (num / den) * 100;
    return {
      esValido: true,
      porcentaje: pct,
      texto: `${pct.toFixed(2)} %`,
    };
  }, [numeradorValor, denominadorValor]);

  const manejarEnvio = (valores: FormRegistrarPretestValues) => {
    clearErrors();

    // 1. Validación de fuente obligatoria
    if (!valores.fuente || !valores.fuente.trim()) {
      setError("fuente", { message: MENSAJES_INDICADORES.PRETEST_SIN_FUENTE });
      return;
    }

    // 2. Validación de fechas coherentes
    if (!valores.fechaInicio) {
      setError("fechaInicio", { message: "La fecha de inicio es obligatoria." });
      return;
    }
    if (!valores.fechaFin) {
      setError("fechaFin", { message: "La fecha de fin es obligatoria." });
      return;
    }
    if (valores.fechaFin < valores.fechaInicio) {
      setError("fechaFin", { message: MENSAJES_INDICADORES.FECHAS_INCOHERENTES });
      return;
    }

    // 3. Validación de números
    const num = Number(valores.numerador);
    const den = Number(valores.denominador);

    if (num < 0) {
      setError("numerador", { message: MENSAJES_INDICADORES.NUMERADOR_NEGATIVO });
      return;
    }
    if (den <= 0) {
      setError("denominador", { message: MENSAJES_INDICADORES.DENOMINADOR_CERO });
      return;
    }
    if (num > den) {
      setError("numerador", { message: MENSAJES_INDICADORES.NUMERADOR_MAYOR });
      return;
    }

    const payload: RegistrarPretestDto = {
      indicador: valores.indicador,
      periodoDescrito: valores.periodoDescrito.trim(),
      fechaInicio: valores.fechaInicio,
      fechaFin: valores.fechaFin,
      numerador: Math.round(num),
      denominador: Math.round(den),
      fuente: valores.fuente.trim(),
    };

    void onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(manejarEnvio)} className="space-y-4" noValidate>
      {/* Selector de Indicador */}
      <div className="space-y-1.5">
        <Label className="text-foreground text-sm font-medium">Indicador de la tesis *</Label>
        <div className="grid grid-cols-3 gap-2">
          {INDICADORES_LISTA.map((ind) => {
            const activo = indicadorSeleccionado === ind;
            return (
              <button
                key={ind}
                type="button"
                onClick={() => setValue("indicador", ind, { shouldValidate: true })}
                disabled={isLoading}
                className={cn(
                  "flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all",
                  activo
                    ? "border-primary bg-primary/10 text-primary ring-primary/40 font-bold shadow-xs ring-1"
                    : "border-border/70 bg-card hover:bg-muted/50 text-foreground font-medium",
                )}
              >
                <span className="text-sm">{ind}</span>
                <span className="text-muted-foreground line-clamp-1 text-[10px]">
                  {NOMBRES_INDICADORES[ind]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Periodo descrito */}
      <div className="space-y-1.5">
        <Label htmlFor="periodoDescrito" className="text-foreground text-sm font-medium">
          Período histórico evaluado *
        </Label>
        <Input
          id="periodoDescrito"
          placeholder="Ej. I Bimestre 2026 (o período previo al sistema)"
          disabled={isLoading}
          maxLength={120}
          aria-invalid={Boolean(errors.periodoDescrito)}
          {...register("periodoDescrito", {
            required: "El período descrito es obligatorio.",
            maxLength: { value: 120, message: "No puede superar los 120 caracteres." },
          })}
        />
        {errors.periodoDescrito && (
          <p className="text-destructive text-xs font-medium">{errors.periodoDescrito.message}</p>
        )}
      </div>

      {/* Rango de Fechas */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-foreground text-sm font-medium">Fecha de inicio *</Label>
          <Controller
            control={control}
            name="fechaInicio"
            render={({ field }) => (
              <DatePicker
                date={field.value ? parseISO(field.value) : undefined}
                onSelect={(d) => {
                  field.onChange(d ? format(d, "yyyy-MM-dd") : "");
                }}
                disabled={isLoading}
                placeholder="Seleccionar fecha"
                className="w-full"
              />
            )}
          />
          {errors.fechaInicio && (
            <p className="text-destructive text-xs font-medium">{errors.fechaInicio.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-foreground text-sm font-medium">Fecha de fin *</Label>
          <Controller
            control={control}
            name="fechaFin"
            render={({ field }) => (
              <DatePicker
                date={field.value ? parseISO(field.value) : undefined}
                onSelect={(d) => {
                  field.onChange(d ? format(d, "yyyy-MM-dd") : "");
                }}
                disabled={isLoading}
                minDate={fechaInicioValor ? parseISO(fechaInicioValor) : undefined}
                placeholder="Seleccionar fecha"
                className="w-full"
              />
            )}
          />
          {errors.fechaFin && (
            <p className="text-destructive text-xs font-medium">{errors.fechaFin.message}</p>
          )}
        </div>
      </div>

      {/* Numerador y Denominador */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="numerador" className="text-foreground text-sm font-medium">
            Numerador (conteo favorable) *
          </Label>
          <Input
            id="numerador"
            type="number"
            min={0}
            step={1}
            disabled={isLoading}
            aria-invalid={Boolean(errors.numerador)}
            {...register("numerador", {
              valueAsNumber: true,
              min: { value: 0, message: MENSAJES_INDICADORES.NUMERADOR_NEGATIVO },
            })}
          />
          <p className="text-muted-foreground text-[11px]">
            {indicadorSeleccionado === "CSP" && "Sesiones cumplidas + parciales"}
            {indicadorSeleccionado === "ISA" && "Libretas publicadas a tiempo"}
            {indicadorSeleccionado === "IGM" && "Materiales planificados a tiempo"}
          </p>
          {errors.numerador && (
            <p className="text-destructive text-xs font-medium">{errors.numerador.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="denominador" className="text-foreground text-sm font-medium">
            Denominador (total programado) *
          </Label>
          <Input
            id="denominador"
            type="number"
            min={1}
            step={1}
            disabled={isLoading}
            aria-invalid={Boolean(errors.denominador)}
            {...register("denominador", {
              valueAsNumber: true,
              min: { value: 1, message: MENSAJES_INDICADORES.DENOMINADOR_CERO },
            })}
          />
          <p className="text-muted-foreground text-[11px]">
            {indicadorSeleccionado === "CSP" && "Planificadas − justificadas"}
            {indicadorSeleccionado === "ISA" && "Libretas programadas totales"}
            {indicadorSeleccionado === "IGM" && "Materiales planificados"}
          </p>
          {errors.denominador && (
            <p className="text-destructive text-xs font-medium">{errors.denominador.message}</p>
          )}
        </div>
      </div>

      {/* Tarjeta de cálculo reactivo previo */}
      <div
        className={cn(
          "flex items-center justify-between rounded-xl border p-3 transition-colors",
          calculoPretest.esValido
            ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400"
            : "border-border/80 bg-muted/40 text-muted-foreground",
        )}
      >
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={InformationCircleIcon} size={18} className="shrink-0" />
          <span className="text-xs font-medium">Porcentaje calculado de pretest:</span>
        </div>
        <span className="text-base font-bold tracking-tight">{calculoPretest.texto}</span>
      </div>

      {/* Fuente obligatoria */}
      <div className="space-y-1.5">
        <Label htmlFor="fuente" className="text-foreground text-sm font-medium">
          Fuente física o documental del dato *
        </Label>
        <Textarea
          id="fuente"
          rows={3}
          maxLength={500}
          placeholder="Ej. Hojas físicas de firma de la subdirección / Registro manual de dirección"
          disabled={isLoading}
          aria-invalid={Boolean(errors.fuente)}
          {...register("fuente", {
            required: MENSAJES_INDICADORES.PRETEST_SIN_FUENTE,
            maxLength: { value: 500, message: "La fuente no puede superar los 500 caracteres." },
          })}
        />
        <p className="text-muted-foreground text-xs">
          Obligatorio según el marco metodológico de la tesis para asegurar trazabilidad.
        </p>
        {errors.fuente && (
          <p className="text-destructive text-xs font-medium">{errors.fuente.message}</p>
        )}
      </div>

      {/* Botones de acción del formulario */}
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
          <span>Guardar pretest</span>
        </Button>
      </div>
    </form>
  );
}
