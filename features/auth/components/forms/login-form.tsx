"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "../../schemas/login.schema";
import { useRouter, useSearchParams } from "next/navigation";
import { useLogin, useSession } from "../../hooks/use-auth";
import { getInitialLoginValues, saveRememberedUsername } from "../../utils/auth-storage.utils";
import { getAccessToken } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
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

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/admin/dashboard";
  const isExpired = searchParams.get("expired") === "true";

  const { data: session, isLoading: isCheckingSession } = useSession();

  // Si ya existe sesión institucional activa y no está expirada, redirigir automáticamente
  React.useEffect(() => {
    if (!isExpired && session?.user) {
      if (session.user.mustChangePassword) {
        router.replace("/change-password");
      } else {
        router.replace(redirectTo);
      }
    }
  }, [session, isExpired, redirectTo, router]);

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

  const { mutate: login, isPending: isSubmitting, error } = useLogin({ redirectTo });

  const onSubmit = (values: LoginFormValues) => {
    saveRememberedUsername(values.username, values.rememberUser);
    login({
      username: values.username,
      password: values.password,
      rememberMe: values.rememberUser,
    });
  };

  if (!isExpired && isCheckingSession && !!getAccessToken()) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-8">
        <Spinner size="md" className="text-primary" />
        <p className="text-muted-foreground text-xs font-medium">
          Validando sesión institucional...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Alerta de Sesión Expirada */}
      {isExpired && !error && (
        <div className="animate-in fade-in flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs font-medium text-amber-600 duration-200 dark:text-amber-400">
          <HugeiconsIcon icon={AlertCircleIcon} className="mt-0.5 size-4 shrink-0" />
          <div className="flex-1 space-y-0.5">
            <p className="leading-tight font-semibold">Sesión finalizada</p>
            <p className="text-[11px] leading-relaxed opacity-90">
              Tu sesión ha expirado o debes autenticarte para continuar.
            </p>
          </div>
        </div>
      )}

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
        <Label htmlFor="username">Usuario o Código *</Label>
        <Input
          id="username"
          type="text"
          autoComplete="username"
          disabled={isSubmitting}
          placeholder="Usuario o DNI"
          startIcon={<HugeiconsIcon icon={UserIcon} className="size-4" />}
          {...register("username")}
          aria-invalid={!!errors.username}
        />
        {errors.username && (
          <p className="text-destructive px-2 text-[11px] font-medium">{errors.username.message}</p>
        )}
      </div>

      {/* Campo Contraseña */}
      <div className="space-y-1.5">
        <Label htmlFor="password">Contraseña *</Label>
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          disabled={isSubmitting}
          placeholder="Contraseña"
          startIcon={<HugeiconsIcon icon={LockIcon} className="size-4" />}
          endIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground hover:text-foreground cursor-pointer p-0.5 transition-colors focus:outline-hidden"
              aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
            >
              <HugeiconsIcon icon={showPassword ? ViewOffSlashIcon : ViewIcon} className="size-4" />
            </button>
          }
          {...register("password")}
          aria-invalid={!!errors.password}
        />
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

export function LoginForm() {
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center py-10">
          <Spinner size="md" className="text-primary" />
        </div>
      }
    >
      <LoginFormInner />
    </React.Suspense>
  );
}
