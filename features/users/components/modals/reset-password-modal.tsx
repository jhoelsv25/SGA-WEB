"use client";

import * as React from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/common/modal";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PasswordInput } from "@/features/auth/components/password-input";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Key01Icon,
  MagicWand01Icon,
  PencilEdit02Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { useResetPasswordMutation } from "../../hooks/use-users-mutations";
import { resetPasswordSchema, type ResetPasswordFormValues } from "../../schemas/users.schema";
import type { TempPasswordResetResponse, UserItem } from "../../types/users.types";

interface ResetPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserItem | null;
  currentUserId?: string;
  /** Solo se llama cuando la clave la generó el sistema (hay que mostrarla una vez). */
  onGenerated: (data: TempPasswordResetResponse, username: string) => void;
}

const MODOS = [
  {
    value: "generar",
    label: "Generar automáticamente",
    hint: "El sistema crea una clave temporal segura.",
    icon: MagicWand01Icon,
  },
  {
    value: "manual",
    label: "Escribir manualmente",
    hint: "Tú defines la nueva contraseña.",
    icon: PencilEdit02Icon,
  },
] as const;

const DEFAULT_VALUES: ResetPasswordFormValues = {
  modo: "generar",
  contrasena: "",
  confirmarContrasena: "",
  debeCambiarContrasena: true,
};

export function ResetPasswordModal({
  open,
  onOpenChange,
  user,
  currentUserId,
  onGenerated,
}: ResetPasswordModalProps) {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [pending, setPending] = React.useState<ResetPasswordFormValues | null>(null);
  const mutation = useResetPasswordMutation();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const modo = useWatch({ control, name: "modo" });

  // Cada apertura empieza limpia: nunca queda una contraseña escrita de una vez anterior.
  React.useEffect(() => {
    if (open) reset(DEFAULT_VALUES);
  }, [open, reset]);

  if (!user) return null;

  const isSelf = currentUserId === user.id;
  const fullName = `${user.persona.nombres} ${user.persona.apellidoPaterno}`;

  const onSubmit = (values: ResetPasswordFormValues) => {
    setPending(values);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!pending) return;
    const manual = pending.modo === "manual";
    try {
      const data = await mutation.mutateAsync({
        id: user.id,
        input: {
          contrasena: manual ? pending.contrasena : undefined,
          debeCambiarContrasena: pending.debeCambiarContrasena,
        },
      });
      onOpenChange(false);
      if (!manual) onGenerated(data, user.nombreUsuario);
    } catch {
      // El error ya se notifica con toast; el formulario queda abierto para corregir.
    } finally {
      setPending(null);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        title="Restablecer contraseña"
        description={`Define la nueva credencial de ${fullName} (${user.nombreUsuario}).`}
        icon={Key01Icon}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <Controller
            control={control}
            name="modo"
            render={({ field }) => (
              <div
                role="radiogroup"
                aria-label="Forma de restablecer"
                className="grid gap-2 sm:grid-cols-2"
              >
                {MODOS.map((m) => {
                  const selected = field.value === m.value;
                  return (
                    <button
                      key={m.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => field.onChange(m.value)}
                      disabled={mutation.isPending}
                      className={cn(
                        "flex items-start gap-2.5 rounded-lg border p-3 text-left transition-colors",
                        "focus-visible:ring-ring/50 outline-none focus-visible:ring-3",
                        selected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/50",
                      )}
                    >
                      <HugeiconsIcon
                        icon={m.icon}
                        className={cn(
                          "mt-0.5 size-4 shrink-0",
                          selected ? "text-primary" : "text-muted-foreground",
                        )}
                      />
                      <span>
                        <span className="block text-sm font-medium">{m.label}</span>
                        <span className="text-muted-foreground block text-xs">{m.hint}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          />

          {modo === "manual" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="contrasena" className="text-sm font-medium">
                  Nueva contraseña *
                </Label>
                <PasswordInput
                  id="contrasena"
                  autoComplete="new-password"
                  placeholder="Mínimo 8 caracteres, letras y números"
                  disabled={mutation.isPending}
                  aria-invalid={!!errors.contrasena}
                  {...register("contrasena")}
                />
                {errors.contrasena && (
                  <p className="text-destructive text-xs font-medium">
                    {errors.contrasena.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmarContrasena" className="text-sm font-medium">
                  Confirmar contraseña *
                </Label>
                <PasswordInput
                  id="confirmarContrasena"
                  autoComplete="new-password"
                  disabled={mutation.isPending}
                  aria-invalid={!!errors.confirmarContrasena}
                  {...register("confirmarContrasena")}
                />
                {errors.confirmarContrasena && (
                  <p className="text-destructive text-xs font-medium">
                    {errors.confirmarContrasena.message}
                  </p>
                )}
              </div>
            </div>
          )}

          <Controller
            control={control}
            name="debeCambiarContrasena"
            render={({ field }) => (
              <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
                <div>
                  <Label htmlFor="debeCambiarContrasena" className="text-sm font-medium">
                    Exigir cambio al iniciar sesión
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    El usuario deberá crear su propia contraseña en el próximo ingreso.
                  </p>
                </div>
                <Switch
                  id="debeCambiarContrasena"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={mutation.isPending}
                />
              </div>
            )}
          />

          <div className="flex justify-end gap-2.5 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
              className="h-10 gap-1.5 rounded-full px-4.5 text-xs font-semibold"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
              <span>Cancelar</span>
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="shadow-primary/20 h-10 gap-1.5 rounded-full px-5 text-xs font-semibold shadow-md"
            >
              <HugeiconsIcon icon={Key01Icon} className="size-3.5" />
              <span>Restablecer contraseña</span>
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={(value) => {
          setConfirmOpen(value);
          if (!value && !mutation.isPending) setPending(null);
        }}
        variant="warning"
        title={`¿Restablecer la contraseña de "${user.nombreUsuario}"?`}
        description={
          isSelf
            ? "Es tu propia cuenta: tu contraseña actual dejará de funcionar y se cerrarán todas tus sesiones, incluida esta."
            : "La contraseña actual dejará de funcionar y se cerrarán todas las sesiones abiertas de este usuario."
        }
        confirmText="Sí, restablecer"
        onConfirm={handleConfirm}
        isLoading={mutation.isPending}
      />
    </>
  );
}
