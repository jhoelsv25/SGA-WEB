"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/common/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, CheckmarkCircle02Icon, Key01Icon } from "@hugeicons/core-free-icons";
import { cambiarPinSchema, type CambiarPinFormValues } from "../../schemas/credenciales.schema";
import { useCambiarPinMutation } from "../../hooks/use-credenciales";

interface CambiarPinModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personaId: string;
  nombreCompleto?: string;
}

export function CambiarPinModal({
  open,
  onOpenChange,
  personaId,
  nombreCompleto,
}: CambiarPinModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CambiarPinFormValues>({
    resolver: zodResolver(cambiarPinSchema),
    defaultValues: {
      nuevoPin: "",
      confirmarPin: "",
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({ nuevoPin: "", confirmarPin: "" });
    }
  }, [open, reset]);

  const cambiarPinMutation = useCambiarPinMutation(() => {
    onOpenChange(false);
  });

  const onSubmit = async (values: CambiarPinFormValues) => {
    await cambiarPinMutation.mutateAsync({
      personaId,
      input: { nuevoPin: values.nuevoPin.trim() },
    });
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Cambiar PIN de Marcación"
      description="Solo Soporte TI lo cambia. Entregue el nuevo PIN únicamente a la persona."
      icon={Key01Icon}
      size="sm"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {nombreCompleto && (
          <div className="border-border/60 bg-muted/30 space-y-0.5 rounded-xl border p-3">
            <span className="text-muted-foreground text-xs">Persona:</span>
            <p className="text-foreground text-xs font-semibold">{nombreCompleto}</p>
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="nuevo-pin" className="text-xs">
            Nuevo PIN (4 dígitos) *
          </Label>
          <Input
            id="nuevo-pin"
            type="password"
            maxLength={4}
            placeholder="••••"
            {...register("nuevoPin")}
            disabled={cambiarPinMutation.isPending}
            className="h-9 text-center font-mono text-sm tracking-widest"
          />
          {errors.nuevoPin && <p className="text-destructive text-xs">{errors.nuevoPin.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmar-pin" className="text-xs">
            Confirmar Nuevo PIN *
          </Label>
          <Input
            id="confirmar-pin"
            type="password"
            maxLength={4}
            placeholder="••••"
            {...register("confirmarPin")}
            disabled={cambiarPinMutation.isPending}
            className="h-9 text-center font-mono text-sm tracking-widest"
          />
          {errors.confirmarPin && (
            <p className="text-destructive text-xs">{errors.confirmarPin.message}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={cambiarPinMutation.isPending}
            className="gap-1.5 text-xs"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />
            Cancelar
          </Button>
          <Button type="submit" disabled={cambiarPinMutation.isPending} className="gap-1.5 text-xs">
            {cambiarPinMutation.isPending ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-4 w-4" />
            )}
            Guardar PIN
          </Button>
        </div>
      </form>
    </Modal>
  );
}
