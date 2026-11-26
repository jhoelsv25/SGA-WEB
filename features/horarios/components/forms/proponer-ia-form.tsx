"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { Spinner } from "@/components/common/spinner";
import { proponerIaSchema, type ProponerIaFormValues } from "../../schemas";

export interface ProponerIaValores {
  horaEntrada?: string;
  preferencias?: string;
}

interface ProponerIaFormProps {
  onSubmit: (valores: ProponerIaValores) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProponerIaForm({ onSubmit, onCancel, isLoading = false }: ProponerIaFormProps) {
  const form = useForm<ProponerIaFormValues>({
    resolver: zodResolver(proponerIaSchema),
    defaultValues: {
      horaEntrada: "",
      preferencias: "",
    },
  });

  const errors = form.formState.errors;
  const preferencias = form.watch("preferencias") ?? "";

  return (
    <form
      className="space-y-4"
      noValidate
      onSubmit={form.handleSubmit((values) => {
        const hora = values.horaEntrada?.trim();
        const nota = values.preferencias?.trim();
        onSubmit({
          horaEntrada: hora && hora.length > 0 ? hora : undefined,
          preferencias: nota && nota.length > 0 ? nota : undefined,
        });
      })}
    >
      <div className="border-border/60 bg-muted/30 text-muted-foreground rounded-xl border p-3.5 text-xs leading-relaxed">
        La propuesta aparece en la grilla de esta página. Puedes mover cursos antes de guardarla en
        lote. Si la IA no responde, se usa el reparto automático sin cruces.
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="horaEntradaIa" className="text-sm font-medium">
          Hora de entrada al colegio (opcional)
        </Label>
        <Input
          id="horaEntradaIa"
          type="text"
          placeholder="Ej. 07:45"
          disabled={isLoading}
          aria-invalid={Boolean(errors.horaEntrada)}
          {...form.register("horaEntrada")}
        />
        <p className="text-muted-foreground text-xs">
          Formato HH:mm. En blanco se usa la hora de inicio de la institución.
        </p>
        {errors.horaEntrada && (
          <p className="text-destructive text-xs font-medium">{errors.horaEntrada.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="preferenciasIa" className="text-sm font-medium">
          Preferencias (opcional)
        </Label>
        <Textarea
          id="preferenciasIa"
          placeholder="Ej. Matemática y Comunicación temprano; evitar bloques triples."
          disabled={isLoading}
          maxLength={500}
          aria-invalid={Boolean(errors.preferencias)}
          {...form.register("preferencias")}
        />
        <p className="text-muted-foreground text-xs">{preferencias.length}/500</p>
        {errors.preferencias && (
          <p className="text-destructive text-xs font-medium">{errors.preferencias.message}</p>
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
          <span>Proponer horario</span>
        </Button>
      </div>
    </form>
  );
}
