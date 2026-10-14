"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/common/date-picker";
import { SelectOption } from "@/components/common/select";
import { Spinner } from "@/components/common/spinner";
import { aFechaIso, desdeFechaIso, tituloBimestre } from "../../constants";
import { programarLibretasSchema, type ProgramarLibretasFormValues } from "../../schemas";
import type { PeriodoLibreta } from "../../types";

interface ProgramarLibretasFormProps {
  periodos: PeriodoLibreta[];
  periodoFijo?: PeriodoLibreta;
  isLoading?: boolean;
  onSubmit: (valores: ProgramarLibretasFormValues) => void;
  onCancel: () => void;
}

export function ProgramarLibretasForm({
  periodos,
  periodoFijo,
  isLoading,
  onSubmit,
  onCancel,
}: ProgramarLibretasFormProps) {
  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<ProgramarLibretasFormValues>({
    resolver: zodResolver(programarLibretasSchema),
    mode: "onSubmit",
    reValidateMode: "onBlur",
    defaultValues: {
      periodoId: periodoFijo?.id ?? "",
      fechaLimite: periodoFijo?.fechaLimite?.slice(0, 10) ?? "",
    },
  });

  const periodoId = useWatch({ control, name: "periodoId" });
  const fechaLimite = useWatch({ control, name: "fechaLimite" });
  const opciones = (periodoFijo ? [periodoFijo] : periodos).map((periodo) => ({
    value: periodo.id,
    label: tituloBimestre(periodo.nombre),
    description: periodo.programada
      ? `Programado · límite ${periodo.fechaLimite?.slice(0, 10) ?? ""}`
      : "Sin programar",
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Bimestre *</Label>
        <SelectOption
          options={opciones}
          value={periodoId || undefined}
          onSelect={(valor) => setValue("periodoId", valor, { shouldValidate: true })}
          placeholder="Elige el bimestre"
          disabled={Boolean(periodoFijo) || isLoading}
        />
        {errors.periodoId ? (
          <p className="text-destructive text-xs font-medium">{errors.periodoId.message}</p>
        ) : (
          <p className="text-muted-foreground text-xs">
            Se crean las libretas pendientes de los estudiantes matriculados en ese bimestre.
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Fecha límite *</Label>
        <DatePicker
          date={fechaLimite ? desdeFechaIso(fechaLimite) : undefined}
          onSelect={(fecha) =>
            setValue("fechaLimite", fecha ? aFechaIso(fecha) : "", { shouldValidate: true })
          }
          disabled={isLoading}
          placeholder="Elige la fecha límite"
          className="w-full"
        />
        {errors.fechaLimite ? (
          <p className="text-destructive text-xs font-medium">{errors.fechaLimite.message}</p>
        ) : (
          <p className="text-muted-foreground text-xs">
            Publicar ese día o antes queda a tiempo. Después queda fuera de plazo.
          </p>
        )}
      </div>

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
          <span>{periodoFijo?.programada ? "Guardar fecha" : "Fijar fecha límite"}</span>
        </Button>
      </div>
    </form>
  );
}
