"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, RefreshIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/common/spinner";
import { reabrirSchema, type ReabrirFormValues } from "../../schemas";
import { CampoFecha } from "@/components/common/date-field";

interface ReabrirFormProps {
  onSubmit: (values: ReabrirFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function ReabrirForm({ onSubmit, onCancel, isSubmitting = false }: ReabrirFormProps) {
  const form = useForm<ReabrirFormValues>({
    resolver: zodResolver(reabrirSchema),
    defaultValues: { motivo: "", fechaLimite: "" },
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
        <Label htmlFor="motivo" className="text-sm font-medium">
          Motivo *
        </Label>
        <Input
          id="motivo"
          placeholder="Ej. Corrección de libretas"
          disabled={isSubmitting}
          aria-invalid={Boolean(form.formState.errors.motivo)}
          {...form.register("motivo")}
        />
        <p className="text-muted-foreground text-xs">Queda registrado junto con la reapertura.</p>
        {form.formState.errors.motivo ? (
          <p className="text-destructive text-xs font-medium">
            {form.formState.errors.motivo.message}
          </p>
        ) : null}
      </div>
      <CampoFecha
        control={form.control}
        name="fechaLimite"
        label="Fecha límite *"
        required
        hint="El año sigue abierto hasta ese día. Al día siguiente vuelve a cerrado."
        disabled={isSubmitting}
        error={form.formState.errors.fechaLimite?.message}
      />
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
            <HugeiconsIcon icon={RefreshIcon} className="size-3.5" />
          )}
          <span>Reabrir</span>
        </Button>
      </div>
    </form>
  );
}
