"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { Spinner } from "@/components/common/spinner";
import { eventoSchema, type EventoFormValues } from "../schemas";
import { CampoFecha } from "./campo-fecha";
import {
  TIPOS_EVENTO,
  TIPOS_SUSPENDEN_POR_DEFECTO,
  type EventoCalendario,
  type TipoEvento,
} from "../types";

const ETIQUETAS: Record<TipoEvento, string> = {
  feriado: "Feriado",
  suspension: "Suspensión",
  jornada_pedagogica: "Jornada pedagógica",
  reunion: "Reunión",
  actividad: "Actividad",
  examen: "Examen",
};

interface EventoFormProps {
  evento?: EventoCalendario | null;
  onSubmit: (values: EventoFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function EventoForm({ evento, onSubmit, onCancel, isSubmitting = false }: EventoFormProps) {
  const form = useForm<EventoFormValues>({
    resolver: zodResolver(eventoSchema),
    defaultValues: {
      titulo: evento?.titulo ?? "",
      descripcion: evento?.descripcion ?? "",
      tipo: evento?.tipo ?? "feriado",
      fechaInicio: evento?.fechaInicio ?? "",
      fechaFin: evento?.fechaFin ?? "",
      suspendeClases: evento?.suspendeClases ?? true,
    },
  });

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit(values);
      })}
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="titulo">Título</Label>
        <Input
          id="titulo"
          aria-invalid={Boolean(form.formState.errors.titulo)}
          {...form.register("titulo")}
        />
        {form.formState.errors.titulo ? (
          <p className="text-destructive text-xs">{form.formState.errors.titulo.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="tipo">Tipo</Label>
        <Controller
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(valor) => {
                const tipo = valor as TipoEvento;
                field.onChange(tipo);
                form.setValue("suspendeClases", TIPOS_SUSPENDEN_POR_DEFECTO.has(tipo));
              }}
            >
              <SelectTrigger id="tipo" className="w-full">
                <SelectValue placeholder="Tipo de evento" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {TIPOS_EVENTO.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {ETIQUETAS[tipo]}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <CampoFecha
          control={form.control}
          name="fechaInicio"
          label="Inicio"
          error={form.formState.errors.fechaInicio?.message}
        />
        <CampoFecha
          control={form.control}
          name="fechaFin"
          label="Fin"
          error={form.formState.errors.fechaFin?.message}
        />
      </div>

      <div className="flex items-center gap-2">
        <Controller
          control={form.control}
          name="suspendeClases"
          render={({ field }) => (
            <Checkbox
              id="suspende"
              checked={field.value}
              onCheckedChange={(marcado) => field.onChange(marcado === true)}
            />
          )}
        />
        <Label htmlFor="suspende">Suspende clases</Label>
      </div>
      <p className="text-muted-foreground text-xs">
        Feriados, suspensiones y jornadas pedagógicas suspenden clases. Una reunión o actividad no,
        salvo que lo marques.
      </p>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea id="descripcion" rows={3} {...form.register("descripcion")} />
      </div>

      <div className="flex justify-end gap-2.5 pt-3">
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
          <span>Guardar evento</span>
        </Button>
      </div>
    </form>
  );
}

export { ETIQUETAS as ETIQUETAS_EVENTO };
