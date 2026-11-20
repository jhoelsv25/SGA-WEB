"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "../../schemas/change-password.schema";
import { useRouter } from "next/navigation";
import { useChangePassword, useSession } from "../../hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/common/spinner";
import { PasswordInput } from "../password-input";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon, CheckmarkCircle02Icon, Cancel01Icon } from "@hugeicons/core-free-icons";

export function ChangePasswordForm() {
  const router = useRouter();
  const { data: session, isLoading: isCheckingSession, isError } = useSession();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { mutate: changePassword, isPending: isSubmitting, isSuccess, error } = useChangePassword();

  React.useEffect(() => {
    // Mientras se guarda (onSuccess cierra la sesión antes de marcar "éxito") no se debe
    // redirigir al login con redirectTo=/change-password: provocaría volver aquí tras ingresar.
    if (isSubmitting || isSuccess) return;
    if (!isCheckingSession && (isError || !session?.user)) {
      router.replace("/login");
    } else if (session?.user && !session.user.mustChangePassword) {
      // La contraseña ya fue cambiada: esta pantalla no corresponde.
      router.replace("/admin/dashboard");
    }
  }, [isSubmitting, isSuccess, isCheckingSession, isError, session, router]);

  const newPasswordValue = useWatch({ control, name: "newPassword" }) ?? "";
  const currentPasswordValue = useWatch({ control, name: "currentPassword" }) ?? "";

  // Validaciones en tiempo real para checklist visual
  const hasMinLength = newPasswordValue.length >= 8;
  const hasLetter = /[A-Za-z]/.test(newPasswordValue);
  const hasNumber = /\d/.test(newPasswordValue);
  const isDifferent =
    newPasswordValue.length > 0 &&
    currentPasswordValue.length > 0 &&
    newPasswordValue !== currentPasswordValue;

  const onSubmit = (values: ChangePasswordFormValues) => {
    changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
  };

  if (isCheckingSession) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-8">
        <Spinner size="md" className="text-primary" />
        <p className="text-muted-foreground text-xs font-medium">Verificando sesión...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Alerta de Error del Servidor */}
      {error && (
        <div
          role="alert"
          className="bg-destructive/10 border-destructive/20 text-destructive animate-in fade-in flex items-start gap-2.5 rounded-xl border p-3 text-xs font-medium duration-200"
        >
          <HugeiconsIcon icon={AlertCircleIcon} className="mt-0.5 size-4 shrink-0" />
          <div className="flex-1 space-y-0.5">
            <p className="leading-tight font-semibold">Error al cambiar contraseña</p>
            <p className="text-xs leading-relaxed opacity-90">{error.message}</p>
          </div>
        </div>
      )}

      {/* Contraseña Actual con PasswordInput */}
      <div className="space-y-1.5">
        <Label htmlFor="currentPassword">Contraseña actual *</Label>
        <PasswordInput
          id="currentPassword"
          autoComplete="current-password"
          disabled={isSubmitting}
          placeholder="Ingresa tu contraseña actual"
          {...register("currentPassword")}
          aria-invalid={!!errors.currentPassword}
          aria-describedby={errors.currentPassword ? "currentPassword-error" : undefined}
        />
        {errors.currentPassword && (
          <p
            id="currentPassword-error"
            className="text-destructive animate-in fade-in pl-1 text-xs font-medium duration-150"
          >
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      {/* Nueva Contraseña con PasswordInput */}
      <div className="space-y-1.5">
        <Label htmlFor="newPassword">Nueva contraseña *</Label>
        <PasswordInput
          id="newPassword"
          autoComplete="new-password"
          disabled={isSubmitting}
          placeholder="Mínimo 8 caracteres con letras y números"
          {...register("newPassword")}
          aria-invalid={!!errors.newPassword}
          aria-describedby={
            errors.newPassword
              ? "newPassword-error newPassword-requisitos"
              : "newPassword-requisitos"
          }
        />
        {errors.newPassword && (
          <p
            id="newPassword-error"
            className="text-destructive animate-in fade-in pl-1 text-xs font-medium duration-150"
          >
            {errors.newPassword.message}
          </p>
        )}
      </div>

      {/* Checklist de Requisitos de Seguridad con aria-live y token text-success-text */}
      <div
        id="newPassword-requisitos"
        role="region"
        aria-label="Requisitos de la contraseña"
        aria-live="polite"
        className="bg-muted/50 space-y-1.5 rounded-2xl p-3 text-xs"
      >
        <p className="text-muted-foreground text-xs font-semibold">
          Requisitos de la nueva contraseña:
        </p>
        <div className="grid grid-cols-1 gap-1.5 text-xs sm:grid-cols-2">
          <span
            className={cn(
              "flex items-center gap-1.5 transition-colors",
              hasMinLength ? "text-success-text font-medium" : "text-muted-foreground",
            )}
          >
            <HugeiconsIcon
              icon={hasMinLength ? CheckmarkCircle02Icon : Cancel01Icon}
              className="size-3.5"
            />
            <span>Mínimo 8 caracteres</span>
          </span>
          <span
            className={cn(
              "flex items-center gap-1.5 transition-colors",
              hasLetter ? "text-success-text font-medium" : "text-muted-foreground",
            )}
          >
            <HugeiconsIcon
              icon={hasLetter ? CheckmarkCircle02Icon : Cancel01Icon}
              className="size-3.5"
            />
            <span>Al menos una letra</span>
          </span>
          <span
            className={cn(
              "flex items-center gap-1.5 transition-colors",
              hasNumber ? "text-success-text font-medium" : "text-muted-foreground",
            )}
          >
            <HugeiconsIcon
              icon={hasNumber ? CheckmarkCircle02Icon : Cancel01Icon}
              className="size-3.5"
            />
            <span>Al menos un número</span>
          </span>
          <span
            className={cn(
              "flex items-center gap-1.5 transition-colors",
              isDifferent ? "text-success-text font-medium" : "text-muted-foreground",
            )}
          >
            <HugeiconsIcon
              icon={isDifferent ? CheckmarkCircle02Icon : Cancel01Icon}
              className="size-3.5"
            />
            <span>Distinta de la actual</span>
          </span>
        </div>
      </div>

      {/* Confirmar Nueva Contraseña con PasswordInput */}
      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Confirmar nueva contraseña *</Label>
        <PasswordInput
          id="confirmPassword"
          autoComplete="new-password"
          disabled={isSubmitting}
          placeholder="Repite tu nueva contraseña"
          {...register("confirmPassword")}
          aria-invalid={!!errors.confirmPassword}
          aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
        />
        {errors.confirmPassword && (
          <p
            id="confirmPassword-error"
            className="text-destructive animate-in fade-in pl-1 text-xs font-medium duration-150"
          >
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Botón de Envío */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="shadow-primary/20 h-11 w-full gap-2 rounded-full text-sm font-bold shadow-md transition-all hover:shadow-lg active:scale-[0.99]"
      >
        {isSubmitting ? (
          <>
            <Spinner size="sm" />
            <span>Actualizando contraseña...</span>
          </>
        ) : (
          <>
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4.5" />
            <span>Guardar nueva contraseña</span>
          </>
        )}
      </Button>
    </form>
  );
}
