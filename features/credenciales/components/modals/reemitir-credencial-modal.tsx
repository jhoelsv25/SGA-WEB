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
import { Alert02Icon, Cancel01Icon, RefreshIcon } from "@hugeicons/core-free-icons";
import {
  reemitirCredencialSchema,
  type ReemitirCredencialFormValues,
} from "../../schemas/credenciales.schema";
import { useReemitirCredencialMutation } from "../../hooks/use-credenciales";
import type { CredencialResponse } from "../../types/credenciales.types";

interface ReemitirCredencialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personaId: string;
  nombreCompleto: string;
  codigoActual?: string;
  onSuccess?: (nuevaCredencial: CredencialResponse) => void;
}

export function ReemitirCredencialModal({
  open,
  onOpenChange,
  personaId,
  nombreCompleto,
  codigoActual,
  onSuccess,
}: ReemitirCredencialModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReemitirCredencialFormValues>({
    resolver: zodResolver(reemitirCredencialSchema),
    defaultValues: {
      motivo: "Pérdida de carné",
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({ motivo: "Pérdida de carné" });
    }
  }, [open, reset]);

  const reemitirMutation = useReemitirCredencialMutation((data) => {
    onOpenChange(false);
    onSuccess?.(data);
  });

  const onSubmit = async (values: ReemitirCredencialFormValues) => {
    await reemitirMutation.mutateAsync({
      personaId,
      motivo: values.motivo.trim(),
    });
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Anular y Emitir Nueva Credencial (Carné Perdido)"
      description="La credencial anterior dejará de funcionar en los kioskos escolares y se generará un nuevo código y PIN."
      icon={Alert02Icon}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Datos de la persona */}
        <div className="border-border/60 bg-muted/30 space-y-1 rounded-xl border p-3.5">
          <p className="text-muted-foreground text-xs">Persona</p>
          <p className="text-foreground text-sm font-semibold">{nombreCompleto}</p>
          {codigoActual && (
            <p className="text-muted-foreground font-mono text-xs">
              Credencial actual a anular:{" "}
              <span className="text-destructive font-semibold">{codigoActual}</span>
            </p>
          )}
        </div>

        {/* Advertencia institucional */}
        <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300">
          <HugeiconsIcon icon={Alert02Icon} className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Al confirmar, el código y PIN anteriores se anulan de forma irreversible y quedan
            registrados en la bitácora de auditoría (RF-007 HU5).
          </p>
        </div>

        {/* Motivo de anulación */}
        <div className="space-y-1.5">
          <Label htmlFor="motivo-reemision" className="text-xs">
            Motivo de la Anulación *
          </Label>
          <Input
            id="motivo-reemision"
            placeholder="Ej. Pérdida de carné, deterioro, robo..."
            {...register("motivo")}
            disabled={reemitirMutation.isPending}
            className="h-9 text-xs"
          />
          {errors.motivo && <p className="text-destructive text-xs">{errors.motivo.message}</p>}
        </div>

        {/* Botones */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={reemitirMutation.isPending}
            className="gap-1.5 text-xs"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="destructive"
            disabled={reemitirMutation.isPending}
            className="gap-1.5 text-xs"
          >
            {reemitirMutation.isPending ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <HugeiconsIcon icon={RefreshIcon} className="h-4 w-4" />
            )}
            Anular y Emitir Nueva
          </Button>
        </div>
      </form>
    </Modal>
  );
}
