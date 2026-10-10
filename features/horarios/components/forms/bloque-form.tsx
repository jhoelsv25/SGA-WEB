"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { Spinner } from "@/components/common/spinner";
import { bloqueSchema, type BloqueFormValues } from "../../schemas";
import type { BloqueHorario, CargaItemHorario } from "../../types";
import { DIAS_SEMANA } from "../../utils";

interface BloqueFormProps {
  bloque?: BloqueHorario | null;
  diaSemanaInicial?: number;
  horaInicioInicial?: string;
  horaFinInicial?: string;
  cursoSeccionIdInicial?: string | null;
  tipoBloqueInicial?: "clase" | "receso";
  cargaItems: CargaItemHorario[];
  onSubmit: (values: BloqueFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function BloqueForm({
  bloque,
  diaSemanaInicial = 1,
  horaInicioInicial = "",
  horaFinInicial = "",
  cursoSeccionIdInicial = null,
  tipoBloqueInicial = "clase",
  cargaItems,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: BloqueFormProps) {
  const form = useForm<BloqueFormValues>({
    resolver: zodResolver(bloqueSchema),
    defaultValues: {
      tipoBloque: bloque?.tipoBloque ?? tipoBloqueInicial,
      cursoSeccionId: bloque?.cursoSeccionId ?? cursoSeccionIdInicial ?? "",
      diaSemana: bloque?.diaSemana ?? diaSemanaInicial,
      horaInicio: bloque?.horaInicio ?? horaInicioInicial,
      horaFin: bloque?.horaFin ?? horaFinInicial,
      aula: bloque?.aula ?? "",
    },
  });

  const tipoBloque = useWatch({
    control: form.control,
    name: "tipoBloque",
    defaultValue: bloque?.tipoBloque ?? tipoBloqueInicial,
  });
  const errors = form.formState.errors;

  return (
    <form className="space-y-4" noValidate onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-1.5">
        <Label htmlFor="tipoBloque" className="text-sm font-medium">
          Tipo de bloque *
        </Label>
        <Controller
          control={form.control}
          name="tipoBloque"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(val) => {
                field.onChange(val);
                if (val === "receso") form.setValue("cursoSeccionId", null);
              }}
              disabled={isSubmitting}
            >
              <SelectTrigger id="tipoBloque" className="h-10 w-full">
                <SelectValue placeholder="Selecciona el tipo de bloque" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clase">Clase pedagógica</SelectItem>
                <SelectItem value="receso">Receso / Recreo</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.tipoBloque && (
          <p className="text-destructive text-xs font-medium">{errors.tipoBloque.message}</p>
        )}
      </div>

      {tipoBloque === "clase" && (
        <div className="space-y-1.5">
          <Label htmlFor="cursoSeccionId" className="text-sm font-medium">
            Curso de la sección *
          </Label>
          <Controller
            control={form.control}
            name="cursoSeccionId"
            render={({ field }) => (
              <Select
                value={field.value ?? ""}
                onValueChange={(val) => field.onChange(val)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="cursoSeccionId" className="h-10 w-full">
                  <SelectValue placeholder="Selecciona el curso" />
                </SelectTrigger>
                <SelectContent>
                  {cargaItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      <span className="flex items-center gap-2">
                        {item.colorHex && (
                          <span
                            className="inline-block size-2.5 rounded-full"
                            style={{ backgroundColor: item.colorHex }}
                          />
                        )}
                        <span>{item.cursoNombre}</span>
                        <span className="text-muted-foreground text-xs">
                          {item.docente ? `(${item.docente.nombreCompleto})` : "(Sin docente)"}
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.cursoSeccionId && (
            <p className="text-destructive text-xs font-medium">{errors.cursoSeccionId.message}</p>
          )}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="diaSemana" className="text-sm font-medium">
          Día escolar *
        </Label>
        <Controller
          control={form.control}
          name="diaSemana"
          render={({ field }) => (
            <Select
              value={String(field.value)}
              onValueChange={(val) => field.onChange(Number(val))}
              disabled={isSubmitting}
            >
              <SelectTrigger id="diaSemana" className="h-10 w-full">
                <SelectValue placeholder="Selecciona el día" />
              </SelectTrigger>
              <SelectContent>
                {DIAS_SEMANA.map((d) => (
                  <SelectItem key={d.dia} value={String(d.dia)}>
                    {d.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.diaSemana && (
          <p className="text-destructive text-xs font-medium">{errors.diaSemana.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="horaInicio" className="text-sm font-medium">
            Hora de inicio *
          </Label>
          <Input
            id="horaInicio"
            type="text"
            placeholder="Ej. 07:45"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.horaInicio)}
            {...form.register("horaInicio")}
          />
          <p className="text-muted-foreground text-xs">Formato HH:mm</p>
          {errors.horaInicio && (
            <p className="text-destructive text-xs font-medium">{errors.horaInicio.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="horaFin" className="text-sm font-medium">
            Hora de fin *
          </Label>
          <Input
            id="horaFin"
            type="text"
            placeholder="Ej. 08:30 o 10:00"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.horaFin)}
            {...form.register("horaFin")}
          />
          <p className="text-muted-foreground text-xs">Bloque doble permitido</p>
          {errors.horaFin && (
            <p className="text-destructive text-xs font-medium">{errors.horaFin.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="aula" className="text-sm font-medium">
          Aula o ambiente (Opcional)
        </Label>
        <Input
          id="aula"
          placeholder="Ej. Pab. B – 201 o Lab. de Cómputo"
          disabled={isSubmitting}
          maxLength={50}
          aria-invalid={Boolean(errors.aula)}
          {...form.register("aula")}
        />
        {errors.aula && (
          <p className="text-destructive text-xs font-medium">{errors.aula.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2.5 pt-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="h-10 min-h-[44px] gap-1.5 rounded-full px-4.5 text-xs font-semibold"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
          <span>Cancelar</span>
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="shadow-primary/20 h-10 min-h-[44px] gap-1.5 rounded-full px-5 text-xs font-semibold shadow-md"
        >
          {isSubmitting ? (
            <Spinner className="size-3.5" />
          ) : (
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
          )}
          <span>{bloque ? "Guardar cambios" : "Guardar bloque"}</span>
        </Button>
      </div>
    </form>
  );
}
