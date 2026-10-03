"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "../../schemas/change-password.schema";
import { useChangePassword } from "../../hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/common/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  LockIcon,
  ViewIcon,
  ViewOffSlashIcon,
  AlertCircleIcon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";

export function ChangePasswordForm() {
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

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

  const { mutate: changePassword, isPending: isSubmitting, error } = useChangePassword();

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Alerta de Error del Servidor */}
      {error && (
        <div className="bg-destructive/10 border-destructive/20 text-destructive animate-in fade-in flex items-start gap-2.5 rounded-xl border p-3 text-xs font-medium duration-200">
          <HugeiconsIcon icon={AlertCircleIcon} className="mt-0.5 size-4 shrink-0" />
          <div className="flex-1 space-y-0.5">
            <p className="leading-tight font-semibold">Error al cambiar contraseña</p>
            <p className="text-[11px] leading-relaxed opacity-90">{error.message}</p>
          </div>
        </div>
      )}

      {/* Contraseña Actual */}
      <div className="space-y-1.5">
        <Label htmlFor="currentPassword" className="text-foreground text-xs font-semibold">
          Contraseña Actual *
        </Label>
        <div className="relative">
          <div className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2">
            <HugeiconsIcon icon={LockIcon} className="size-4" />
          </div>
          <input
            id="currentPassword"
            type={showCurrentPassword ? "text" : "password"}
            autoComplete="current-password"
            disabled={isSubmitting}
            placeholder="Ingresa tu contraseña actual"
            {...register("currentPassword")}
            className={`bg-background placeholder:text-muted-foreground/60 focus:ring-primary/30 focus:border-primary h-11 w-full rounded-full border pr-10 pl-10 text-sm transition-all outline-none focus:ring-2 disabled:opacity-50 ${
              errors.currentPassword
                ? "border-destructive ring-destructive/20 ring-1"
                : "border-input"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword((prev) => !prev)}
            tabIndex={-1}
            disabled={isSubmitting}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
          >
            <HugeiconsIcon
              icon={showCurrentPassword ? ViewOffSlashIcon : ViewIcon}
              className="size-4"
            />
          </button>
        </div>
        {errors.currentPassword && (
          <p className="text-destructive animate-in fade-in pl-1 text-[11px] font-medium duration-150">
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      {/* Nueva Contraseña */}
      <div className="space-y-1.5">
        <Label htmlFor="newPassword" className="text-foreground text-xs font-semibold">
          Nueva Contraseña *
        </Label>
        <div className="relative">
          <div className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2">
            <HugeiconsIcon icon={LockIcon} className="size-4" />
          </div>
          <input
            id="newPassword"
            type={showNewPassword ? "text" : "password"}
            autoComplete="new-password"
            disabled={isSubmitting}
            placeholder="Mínimo 8 caracteres con letras y números"
            {...register("newPassword")}
            className={`bg-background placeholder:text-muted-foreground/60 focus:ring-primary/30 focus:border-primary h-11 w-full rounded-full border pr-10 pl-10 text-sm transition-all outline-none focus:ring-2 disabled:opacity-50 ${
              errors.newPassword ? "border-destructive ring-destructive/20 ring-1" : "border-input"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword((prev) => !prev)}
            tabIndex={-1}
            disabled={isSubmitting}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
          >
            <HugeiconsIcon
              icon={showNewPassword ? ViewOffSlashIcon : ViewIcon}
              className="size-4"
            />
          </button>
        </div>
        {errors.newPassword && (
          <p className="text-destructive animate-in fade-in pl-1 text-[11px] font-medium duration-150">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      {/* Checklist de Requisitos de Seguridad */}
      <div className="bg-muted/50 space-y-1 rounded-xl p-2.5 text-[11px]">
        <p className="text-muted-foreground font-semibold">Requisitos de la nueva contraseña:</p>
        <div className="grid grid-cols-1 gap-1 text-[11px] sm:grid-cols-2">
          <span
            className={`flex items-center gap-1.5 ${hasMinLength ? "font-medium text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}
          >
            <HugeiconsIcon
              icon={hasMinLength ? CheckmarkCircle02Icon : Cancel01Icon}
              className="size-3.5"
            />
            Mínimo 8 caracteres
          </span>
          <span
            className={`flex items-center gap-1.5 ${hasLetter ? "font-medium text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}
          >
            <HugeiconsIcon
              icon={hasLetter ? CheckmarkCircle02Icon : Cancel01Icon}
              className="size-3.5"
            />
            Al menos una letra
          </span>
          <span
            className={`flex items-center gap-1.5 ${hasNumber ? "font-medium text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}
          >
            <HugeiconsIcon
              icon={hasNumber ? CheckmarkCircle02Icon : Cancel01Icon}
              className="size-3.5"
            />
            Al menos un número
          </span>
          <span
            className={`flex items-center gap-1.5 ${isDifferent ? "font-medium text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}
          >
            <HugeiconsIcon
              icon={isDifferent ? CheckmarkCircle02Icon : Cancel01Icon}
              className="size-3.5"
            />
            Distinta de la actual
          </span>
        </div>
      </div>

      {/* Confirmar Nueva Contraseña */}
      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword" className="text-foreground text-xs font-semibold">
          Confirmar Nueva Contraseña *
        </Label>
        <div className="relative">
          <div className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2">
            <HugeiconsIcon icon={LockIcon} className="size-4" />
          </div>
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            disabled={isSubmitting}
            placeholder="Repite tu nueva contraseña"
            {...register("confirmPassword")}
            className={`bg-background placeholder:text-muted-foreground/60 focus:ring-primary/30 focus:border-primary h-11 w-full rounded-full border pr-10 pl-10 text-sm transition-all outline-none focus:ring-2 disabled:opacity-50 ${
              errors.confirmPassword
                ? "border-destructive ring-destructive/20 ring-1"
                : "border-input"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            tabIndex={-1}
            disabled={isSubmitting}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
          >
            <HugeiconsIcon
              icon={showConfirmPassword ? ViewOffSlashIcon : ViewIcon}
              className="size-4"
            />
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-destructive animate-in fade-in pl-1 text-[11px] font-medium duration-150">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Botón de Envío */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-11 w-full rounded-full font-semibold shadow-md transition-all active:scale-[0.99]"
      >
        {isSubmitting ? (
          <>
            <Spinner className="mr-2 size-4 text-white" />
            Actualizando contraseña...
          </>
        ) : (
          "Guardar Nueva Contraseña"
        )}
      </Button>
    </form>
  );
}
