"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SecurityLockIcon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  AlertCircleIcon,
  Key01Icon,
  LockIcon,
} from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/common/spinner";
import { PasswordInput } from "@/features/auth/components/password-input";
import { authApi } from "@/features/auth/api/auth.api";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/features/auth/schemas/change-password.schema";
import { toast } from "@/lib/toast";
import { setAccessToken, type ApiClientError } from "@/lib/api-client";

interface CambiarPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CambiarPasswordModal({ open, onOpenChange }: CambiarPasswordModalProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
  }, [open, reset]);

  const newPasswordValue = useWatch({ control, name: "newPassword" }) ?? "";
  const currentPasswordValue = useWatch({ control, name: "currentPassword" }) ?? "";

  // Validaciones en tiempo real para checklist
  const hasMinLength = newPasswordValue.length >= 8;
  const hasLetter = /[A-Za-z]/.test(newPasswordValue);
  const hasNumber = /\d/.test(newPasswordValue);
  const isDifferent =
    newPasswordValue.length > 0 &&
    currentPasswordValue.length > 0 &&
    newPasswordValue !== currentPasswordValue;

  const {
    mutate: changePassword,
    isPending,
    error,
  } = useMutation<{ message?: string }, ApiClientError, ChangePasswordFormValues>({
    mutationFn: (values) =>
      authApi.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }),
    onSuccess: async (data) => {
      onOpenChange(false);
      toast.success(
        data?.message
          ? `${data.message} Inicia sesión con tu nueva contraseña.`
          : "Contraseña actualizada exitosamente. Inicia sesión con tu nueva contraseña.",
      );
      try {
        await authApi.logout();
      } catch {
        // En caso de que el backend ya haya revocado la sesión
      }
      setAccessToken(null);
      queryClient.clear();
      router.replace("/login?passwordChanged=true");
      router.refresh();
    },
    onError: (err) => {
      toast.error(err?.message || "No se pudo actualizar la contraseña.");
    },
  });

  const onSubmit = (values: ChangePasswordFormValues) => {
    changePassword(values);
  };

  return (
    <Modal
      open={open}
      onOpenChange={(val) => {
        if (!isPending) onOpenChange(val);
      }}
      title="Cambiar Contraseña"
      description="Actualiza la contraseña de acceso a tu cuenta institucional"
      icon={SecurityLockIcon}
      size="md"
      preventClose={isPending}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-1" noValidate>
        {/* Error del servidor */}
        {error && (
          <div
            role="alert"
            className="bg-destructive/10 border-destructive/20 text-destructive flex items-start gap-2.5 rounded-xl border p-3 text-xs font-medium"
          >
            <HugeiconsIcon icon={AlertCircleIcon} className="mt-0.5 size-4 shrink-0" />
            <div className="flex-1 space-y-0.5">
              <p className="font-semibold">Error al cambiar contraseña</p>
              <p className="text-xs leading-relaxed opacity-90">{error.message}</p>
            </div>
          </div>
        )}

        {/* Contraseña Actual */}
        <div className="space-y-1.5">
          <Label
            htmlFor="currentPassword"
            className="flex items-center gap-1.5 text-xs font-semibold"
          >
            <HugeiconsIcon icon={LockIcon} className="text-primary size-3.5" />
            <span>Contraseña actual *</span>
          </Label>
          <PasswordInput
            id="currentPassword"
            autoComplete="current-password"
            disabled={isPending}
            placeholder="Ingresa tu contraseña actual"
            {...register("currentPassword")}
            aria-invalid={!!errors.currentPassword}
          />
          {errors.currentPassword && (
            <p className="text-destructive text-xs">{errors.currentPassword.message}</p>
          )}
        </div>

        {/* Nueva Contraseña */}
        <div className="space-y-1.5">
          <Label htmlFor="newPassword" className="flex items-center gap-1.5 text-xs font-semibold">
            <HugeiconsIcon icon={Key01Icon} className="text-primary size-3.5" />
            <span>Nueva contraseña *</span>
          </Label>
          <PasswordInput
            id="newPassword"
            autoComplete="new-password"
            disabled={isPending}
            placeholder="Crea tu nueva contraseña"
            {...register("newPassword")}
            aria-invalid={!!errors.newPassword}
          />
          {errors.newPassword && (
            <p className="text-destructive text-xs">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirmar Nueva Contraseña */}
        <div className="space-y-1.5">
          <Label
            htmlFor="confirmPassword"
            className="flex items-center gap-1.5 text-xs font-semibold"
          >
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="text-primary size-3.5" />
            <span>Confirmar nueva contraseña *</span>
          </Label>
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            disabled={isPending}
            placeholder="Repite tu nueva contraseña"
            {...register("confirmPassword")}
            aria-invalid={!!errors.confirmPassword}
          />
          {errors.confirmPassword && (
            <p className="text-destructive text-xs">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Checklist en tiempo real */}
        <div className="bg-muted/40 border-border/50 space-y-1.5 rounded-xl border p-3 text-xs">
          <p className="text-foreground font-semibold">Requisitos de seguridad:</p>
          <div className="grid grid-cols-1 gap-1 text-[11px] sm:grid-cols-2">
            <span
              className={`flex items-center gap-1.5 ${
                hasMinLength
                  ? "font-medium text-emerald-600 dark:text-emerald-400"
                  : "text-muted-foreground"
              }`}
            >
              <HugeiconsIcon
                icon={hasMinLength ? CheckmarkCircle02Icon : Cancel01Icon}
                className="size-3.5 shrink-0"
              />
              Mínimo 8 caracteres
            </span>

            <span
              className={`flex items-center gap-1.5 ${
                hasLetter
                  ? "font-medium text-emerald-600 dark:text-emerald-400"
                  : "text-muted-foreground"
              }`}
            >
              <HugeiconsIcon
                icon={hasLetter ? CheckmarkCircle02Icon : Cancel01Icon}
                className="size-3.5 shrink-0"
              />
              Al menos una letra
            </span>

            <span
              className={`flex items-center gap-1.5 ${
                hasNumber
                  ? "font-medium text-emerald-600 dark:text-emerald-400"
                  : "text-muted-foreground"
              }`}
            >
              <HugeiconsIcon
                icon={hasNumber ? CheckmarkCircle02Icon : Cancel01Icon}
                className="size-3.5 shrink-0"
              />
              Al menos un número
            </span>

            <span
              className={`flex items-center gap-1.5 ${
                isDifferent
                  ? "font-medium text-emerald-600 dark:text-emerald-400"
                  : "text-muted-foreground"
              }`}
            >
              <HugeiconsIcon
                icon={isDifferent ? CheckmarkCircle02Icon : Cancel01Icon}
                className="size-3.5 shrink-0"
              />
              Distinta a la actual
            </span>
          </div>
        </div>

        {/* Botones de acción con iconos */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
            className="h-8 gap-1.5 text-xs font-medium"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
            <span>Cancelar</span>
          </Button>

          <Button
            type="submit"
            size="sm"
            disabled={isPending}
            className="h-8 gap-1.5 text-xs font-semibold"
          >
            {isPending ? (
              <span className="flex items-center gap-1.5">
                <Spinner size="xs" />
                <span>Actualizando...</span>
              </span>
            ) : (
              <>
                <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
                <span>Actualizar contraseña</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
