"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "../../schemas/login.schema";
import { useRouter, useSearchParams } from "next/navigation";
import { useLogin, useLogout, useSelectRole, useSession } from "../../hooks/use-auth";
import type { AuthResponse } from "../../types/auth.types";
import { getInitialLoginValues, saveRememberedUsername } from "../../utils/auth-storage.utils";
import { getAccessToken } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/common/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  LockIcon,
  ViewIcon,
  ViewOffSlashIcon,
  LogInIcon,
  AlertCircleIcon,
  UserSwitchIcon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";

/**
 * RF-001 V3: segundo paso del inicio de sesión. Siempre se elige el rol con el que se
 * ingresa (aunque tenga uno solo); viene marcado el rol principal.
 */
function SeleccionRol({
  session,
  redirectTo,
  onVolver,
}: {
  session: AuthResponse;
  redirectTo: string;
  onVolver: () => void;
}) {
  const roles = session.user?.userRoles ?? [];
  const principal = roles.find((r) => r.isPrincipal) ?? roles[0];
  const [rolId, setRolId] = React.useState(session.user?.activeRoleId ?? principal?.id ?? "");
  const { mutate: seleccionar, isPending: isSelecting } = useSelectRole({ redirectTo });
  // Volver descarta la sesión abierta en el paso 1 para pedir de nuevo las credenciales
  const { mutate: logout, isPending: isLoggingOut } = useLogout({ onSuccess: onVolver });
  const isPending = isSelecting || isLoggingOut;

  const ingresar = (event: React.FormEvent) => {
    event.preventDefault();
    if (rolId) seleccionar(rolId);
  };

  return (
    <form onSubmit={ingresar} className="space-y-4" noValidate>
      <div className="space-y-1">
        <p className="text-sm font-semibold">
          Hola, {session.user?.firstName ?? session.user?.username}
        </p>
        <p className="text-muted-foreground text-xs">Elige el rol con el que quieres ingresar.</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="rol">Rol *</Label>
        <Select value={rolId} onValueChange={setRolId} disabled={isPending}>
          <SelectTrigger id="rol" className="w-full">
            <SelectValue placeholder="Elige un rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {roles.map((rol) => (
                <SelectItem key={rol.id} value={rol.id}>
                  {rol.name}
                  {rol.isPrincipal ? " (principal)" : ""}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <Button
          type="submit"
          disabled={isPending || !rolId}
          className="shadow-primary/20 h-11 w-full gap-2 rounded-full text-sm font-bold shadow-md transition-all hover:shadow-lg"
        >
          {isPending ? (
            <>
              <Spinner size="sm" />
              <span>Ingresando...</span>
            </>
          ) : (
            <>
              <HugeiconsIcon icon={UserSwitchIcon} className="size-4.5" />
              <span>Ingresar</span>
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={isPending}
          onClick={() => logout()}
          className="h-9 gap-2 rounded-full text-xs"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
          <span>Volver</span>
        </Button>
      </div>
    </form>
  );
}

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/admin/dashboard";
  const isExpired = searchParams.get("expired") === "true";

  const { data: session, isLoading: isCheckingSession } = useSession();
  // RF-001 V3: tras validar las credenciales, sigue el paso de selección de rol
  const [autenticado, setAutenticado] = React.useState<AuthResponse | null>(null);

  // Si ya existe sesión institucional activa y no está expirada, redirigir automáticamente
  React.useEffect(() => {
    if (!autenticado && !isExpired && session?.user) {
      if (session.user.mustChangePassword) {
        router.replace("/change-password");
      } else {
        router.replace(redirectTo);
      }
    }
  }, [autenticado, session, isExpired, redirectTo, router]);

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

  const {
    mutate: login,
    isPending: isSubmitting,
    error,
  } = useLogin({ redirectTo, redirect: false, onSuccess: setAutenticado });

  const onSubmit = (values: LoginFormValues) => {
    saveRememberedUsername(values.username, values.rememberUser);
    login({
      username: values.username,
      password: values.password,
      rememberMe: values.rememberUser,
    });
  };

  if (autenticado) {
    return (
      <SeleccionRol
        session={autenticado}
        redirectTo={redirectTo}
        onVolver={() => setAutenticado(null)}
      />
    );
  }

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
        <div
          role="status"
          className="animate-in fade-in flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs font-medium text-amber-600 duration-200 dark:text-amber-400"
        >
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
        <div
          role="alert"
          className="bg-destructive/10 border-destructive/20 text-destructive animate-in fade-in flex items-start gap-2.5 rounded-xl border p-3 text-xs font-medium duration-200"
        >
          <HugeiconsIcon icon={AlertCircleIcon} className="mt-0.5 size-4 shrink-0" />
          <div className="flex-1 space-y-0.5">
            <p className="leading-tight font-semibold">Error de autenticación</p>
            <p className="text-[11px] leading-relaxed opacity-90">{error.message}</p>
          </div>
        </div>
      )}

      {/* Campo Usuario */}
      <div className="space-y-1.5">
        <Label htmlFor="username">Usuario o DNI *</Label>
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
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/40 -mr-2 flex size-9 cursor-pointer items-center justify-center rounded-full transition-colors outline-none focus-visible:ring-2"
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
          ¿Olvidaste tu contraseña?
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
