"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { Spinner } from "@/components/common/spinner";
import { proponerGrillaSchema, type ProponerGrillaFormValues } from "../../schemas";

interface ProponerGrillaFormProps {
  onSubmit: (horaEntrada?: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProponerGrillaForm({
  onSubmit,
  onCancel,
  isLoading = false,
}: ProponerGrillaFormProps) {
  const form = useForm<ProponerGrillaFormValues>({
    resolver: zodResolver(proponerGrillaSchema),
    defaultValues: {
      horaEntrada: "",
    },
  });

  const errors = form.formState.errors;

  return (
    <form
      className="space-y-4"
      noValidate
      onSubmit={form.handleSubmit((values) => {
        const hora = values.horaEntrada?.trim();
        onSubmit(hora && hora.length > 0 ? hora : undefined);
      })}
    >
      <div className="border-border/60 bg-muted/30 text-muted-foreground rounded-lg border p-3 text-xs">
        El sistema calculará las franjas escolares estándar de lunes a viernes según la jornada
        configurada para el turno y las mostrará en la grilla listas para asignarles cursos. Esta
        acción no sobreescribe ni guarda automáticamente en la base de datos.
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="horaEntrada" className="text-sm font-medium">
          Hora de entrada de estudiantes (Opcional)
        </Label>
        <Input
          id="horaEntrada"
          type="text"
          placeholder="Ej. 07:45 (opcional)"
          disabled={isLoading}
          aria-invalid={Boolean(errors.horaEntrada)}
          {...form.register("horaEntrada")}
        />
        <p className="text-muted-foreground text-xs">
          Formato HH:mm (24 horas). Si se deja vacío, la API aplicará el horario de entrada
          institucional del turno.
        </p>
        {errors.horaEntrada && (
          <p className="text-destructive text-xs font-medium">{errors.horaEntrada.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2.5 pt-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="h-10 min-h-[44px] gap-1.5 rounded-full px-4.5 text-xs font-semibold"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
          <span>Cancelar</span>
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="shadow-primary/20 h-10 min-h-[44px] gap-1.5 rounded-full px-5 text-xs font-semibold shadow-md"
        >
          {isLoading ? (
            <Spinner className="size-3.5" />
          ) : (
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
          )}
          <span>Generar propuesta</span>
        </Button>
      </div>
    </form>
  );
}
