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
import { ETIQUETAS_EVENTO } from "../../consts";
import { CampoFecha } from "@/components/common/date-field";
import { eventoSchema, type EventoFormValues } from "../../schemas";
import {
  TIPOS_EVENTO,
  TIPOS_SUSPENDEN_POR_DEFECTO,
  type EventoCalendario,
  type TipoEvento,
} from "../../types";

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
      className="space-y-4"
      noValidate
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit(values);
      })}
    >
      <div className="space-y-1.5">
        <Label htmlFor="titulo" className="text-sm font-medium">
          Título *
        </Label>
        <Input
          id="titulo"
          placeholder="Nombre del evento"
          disabled={isSubmitting}
          aria-invalid={Boolean(form.formState.errors.titulo)}
          {...form.register("titulo")}
        />
        <p className="text-muted-foreground text-xs">Nombre con el que se ve en el calendario.</p>
        {form.formState.errors.titulo ? (
          <p className="text-destructive text-xs font-medium">
            {form.formState.errors.titulo.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tipo" className="text-sm font-medium">
          Tipo *
        </Label>
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
                      {ETIQUETAS_EVENTO[tipo]}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        <p className="text-muted-foreground text-xs">
          Feriado, suspensión y jornada pedagógica suspenden clases. Reunión, actividad y examen no,
          salvo que lo marques.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <CampoFecha
          control={form.control}
          name="fechaInicio"
          label="Inicio *"
          required
          hint="La fecha de fin puede ser el mismo día."
          disabled={isSubmitting}
          error={form.formState.errors.fechaInicio?.message}
        />
        <CampoFecha
          control={form.control}
          name="fechaFin"
          label="Fin *"
          required
          disabled={isSubmitting}
          error={form.formState.errors.fechaFin?.message}
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <Controller
            control={form.control}
            name="suspendeClases"
            render={({ field }) => (
              <Checkbox
                id="suspende"
                checked={field.value}
                disabled={isSubmitting}
                onCheckedChange={(marcado) => field.onChange(marcado === true)}
              />
            )}
          />
          <Label htmlFor="suspende" className="text-sm font-medium">
            Suspende clases
          </Label>
        </div>
        <p className="text-muted-foreground text-xs">
          Esos días no cuentan como sesión. Las sesiones ya firmadas se conservan.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="descripcion" className="text-sm font-medium">
          Descripción (Opcional)
        </Label>
        <Textarea
          id="descripcion"
          rows={3}
          placeholder="Detalle del evento"
          disabled={isSubmitting}
          {...form.register("descripcion")}
        />
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
