"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { copiarHorarioSchema, type CopiarHorarioFormValues } from "../../schemas";
import type { SeccionHorarioItem } from "../../types";

interface CopiarHorarioFormProps {
  seccionesDisponibles: SeccionHorarioItem[];
  seccionDestinoNombre: string;
  onSubmit: (values: CopiarHorarioFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function CopiarHorarioForm({
  seccionesDisponibles,
  seccionDestinoNombre,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CopiarHorarioFormProps) {
  const form = useForm<CopiarHorarioFormValues>({
    resolver: zodResolver(copiarHorarioSchema),
    defaultValues: {
      origenId: "",
    },
  });

  const errors = form.formState.errors;

  return (
    <form
      className="space-y-4"
      noValidate
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit(values);
      })}
    >
      <div className="border-border/60 bg-muted/30 text-muted-foreground rounded-lg border p-3 text-xs">
        Esta acción copiará la estructura y los bloques semanales a la sección{" "}
        <strong className="text-foreground">{seccionDestinoNombre}</strong>. Si el docente asignado
        a algún curso presenta cruces de horario, se generará una lista de conflictos para su
        revisión y corrección.
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="origenId" className="text-sm font-medium">
          Sección origen a copiar *
        </Label>
        <Controller
          control={form.control}
          name="origenId"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(val) => field.onChange(val)}
              disabled={isSubmitting}
            >
              <SelectTrigger id="origenId" className="h-10 w-full">
                <SelectValue placeholder="Selecciona la sección de origen" />
              </SelectTrigger>
              <SelectContent>
                {seccionesDisponibles.map((sec) => (
                  <SelectItem key={sec.id} value={sec.id}>
                    Sección {sec.nombre} ({sec.gradoNombre})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.origenId && (
          <p className="text-destructive text-xs font-medium">{errors.origenId.message}</p>
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
          <span>Copiar horario</span>
        </Button>
      </div>
    </form>
  );
}
