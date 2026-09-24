"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "../../schemas/login.schema";
import { useLogin } from "../../hooks/use-auth";
import { getInitialLoginValues, saveRememberedUsername } from "../../utils/auth-storage.utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/common/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  LockIcon,
  ViewIcon,
  ViewOffSlashIcon,
  LogInIcon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";

export function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const initialValues = React.useMemo(() => getInitialLoginValues(), []);
  const [rememberUser, setRememberUser] = React.useState(initialValues.rememberUser);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: initialValues,
  });

  const { mutate: login, isPending: isSubmitting, error } = useLogin();

  const onSubmit = (values: LoginFormValues) => {
    saveRememberedUsername(values.username, values.rememberUser);
    login({
      username: values.username,
      password: values.password,
      rememberMe: values.rememberUser,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Alerta de Error del Servidor */}
      {error && (
        <div className="bg-destructive/10 border-destructive/20 text-destructive animate-in fade-in flex items-start gap-2.5 rounded-xl border p-3 text-xs font-medium duration-200">
          <HugeiconsIcon icon={AlertCircleIcon} className="mt-0.5 size-4 shrink-0" />
          <div className="flex-1 space-y-0.5">
            <p className="leading-tight font-semibold">Error de autenticación</p>
            <p className="text-[11px] leading-relaxed opacity-90">{error.message}</p>
          </div>
        </div>
      )}

      {/* Campo Usuario */}
      <div className="space-y-1.5">
        <Label htmlFor="username" className="text-foreground text-xs font-semibold">
          Usuario o Código *
        </Label>
        <div className="relative">
          <div className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2">
            <HugeiconsIcon icon={UserIcon} className="size-4" />
          </div>
          <input
            id="username"
            type="text"
            autoComplete="username"
            disabled={isSubmitting}
            placeholder="Usuario o DNI"
            {...register("username")}
            className={`bg-background placeholder:text-muted-foreground/60 focus:ring-primary/30 focus:border-primary h-11 w-full rounded-full border pr-4 pl-10 text-sm transition-all outline-none focus:ring-2 disabled:opacity-50 ${
              errors.username ? "border-destructive ring-destructive/20 ring-1" : "border-input"
            }`}
          />
        </div>
        {errors.username && (
          <p className="text-destructive px-2 text-[11px] font-medium">{errors.username.message}</p>
        )}
      </div>

      {/* Campo Contraseña */}
      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-foreground text-xs font-semibold">
          Contraseña *
        </Label>
        <div className="relative">
          <div className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2">
            <HugeiconsIcon icon={LockIcon} className="size-4" />
          </div>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            disabled={isSubmitting}
            placeholder="Contraseña"
            {...register("password")}
            className={`bg-background placeholder:text-muted-foreground/60 focus:ring-primary/30 focus:border-primary h-11 w-full rounded-full border pr-11 pl-10 text-sm transition-all outline-none focus:ring-2 disabled:opacity-50 ${
              errors.password ? "border-destructive ring-destructive/20 ring-1" : "border-input"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3.5 -translate-y-1/2 p-0.5 focus:outline-hidden"
            aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
          >
            <HugeiconsIcon icon={showPassword ? ViewOffSlashIcon : ViewIcon} className="size-4" />
          </button>
        </div>
        {errors.password && (
          <p className="text-destructive px-2 text-[11px] font-medium">{errors.password.message}</p>
        )}
      </div>

      {/* Fila Recordar Usuario y Recuperar Contraseña */}
      <div className="flex items-center justify-between pt-1 text-xs">
        <div className="flex items-center gap-2">
          <Checkbox
            id="rememberUser"
            checked={rememberUser}
            onCheckedChange={(checked) => {
              const val = !!checked;
              setValue("rememberUser", val);
              setRememberUser(val);
            }}
          />
          <Label
            htmlFor="rememberUser"
            className="text-muted-foreground cursor-pointer text-xs font-medium select-none"
          >
            Recordar usuario
          </Label>
        </div>

        <Link
          href="/recover"
          className="text-foreground/80 decoration-muted-foreground/40 hover:text-primary text-xs font-medium underline underline-offset-4 transition-colors"
        >
          He olvidado mi contraseña
        </Link>
      </div>

      {/* Botón Ingresar */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="shadow-primary/20 h-11 w-full gap-2 rounded-full text-sm font-bold shadow-md transition-all hover:shadow-lg"
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" />
              <span>Verificando...</span>
            </>
          ) : (
            <>
              <HugeiconsIcon icon={LogInIcon} className="size-4.5" />
              <span>Ingresar</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
