"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { siteConfig } from "@/config";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "../../schemas/login.schema";
import { useRouter, useSearchParams } from "next/navigation";
import { useLogin, useLogout, useSelectRole, useSession } from "../../hooks/use-auth";
import type { AuthResponse } from "../../types/auth.types";
import { getRememberedUsername, saveRememberedUsername } from "../../utils/auth-storage.utils";
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
import { PasswordInput } from "../password-input";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
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

/**
 * Pantalla independiente para el paso 2: tapa el layout dividido del login (slider + panel)
 * con una tarjeta limpia y centrada en toda la ventana, igual al resto de pantallas de
 * un solo paso del sistema (p. ej. el kiosko).
 */
function PantallaSeleccionRol(props: {
  session: AuthResponse;
  redirectTo: string;
  onVolver: () => void;
}) {
  return (
    <div className="bg-background fixed inset-0 z-50 flex flex-col items-center justify-center px-6 py-8">
      <div className="border-border/80 bg-card w-full max-w-sm rounded-3xl border p-8 shadow-2xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="bg-card ring-border relative mb-3 flex size-16 items-center justify-center rounded-2xl p-2 shadow-md ring-1">
            <Image
              src={siteConfig.branding.logo}
              alt={`Logo ${siteConfig.institution.name}`}
              width={52}
              height={52}
              priority
              className="object-contain"
            />
          </div>
          <div className="space-y-1">
            <span className="bg-primary/10 text-primary border-primary/20 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-widest uppercase">
              {siteConfig.institution.badge}
            </span>
            <h1 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl">
              Elige tu rol
            </h1>
            <p className="text-muted-foreground text-xs">
              Confirma con qué rol quieres ingresar al sistema.
            </p>
          </div>
        </div>

        <SeleccionRol {...props} />
      </div>
    </div>
  );
}

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirectTo");
  // Nunca volver a /change-password por un redirectTo arrastrado: ya se resuelve según mustChangePassword.
  const redirectTo =
    redirectParam && !redirectParam.startsWith("/change-password")
      ? redirectParam
      : "/admin/dashboard";
  const isExpired = searchParams.get("expired") === "true";

  const { data: session, isLoading: isCheckingSession } = useSession();
  // RF-001 V3: tras validar las credenciales, sigue el paso de selección de rol
  const [autenticado, setAutenticado] = React.useState<AuthResponse | null>(null);

  // Sincronización segura de montaje SSR/Cliente sin provocar re-renders en cascada
  const isMounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const savedUsername = React.useSyncExternalStore(
    () => () => {},
    () => getRememberedUsername(),
    () => "",
  );

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

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberUser: false,
    },
  });

  const rememberUser = useWatch({ control, name: "rememberUser", defaultValue: false });

  // Rellenar usuario recordado una vez disponible en cliente
  React.useEffect(() => {
    if (savedUsername) {
      setValue("username", savedUsername);
      setValue("rememberUser", true);
    }
  }, [savedUsername, setValue]);

  const {
    mutate: login,
    isPending: isSubmitting,
    error,
  } = useLogin({
    redirectTo,
    redirect: false,
    onSuccess: (data) => {
      const roles = data.user?.userRoles ?? [];
      if (roles.length > 1) {
        setAutenticado(data);
      } else {
        if (data.user?.mustChangePassword) {
          router.replace("/change-password");
        } else {
          router.replace(redirectTo);
        }
      }
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    saveRememberedUsername(values.username, values.rememberUser);
    login({
      username: values.username,
      password: values.password,
      rememberMe: values.rememberUser,
    });
  };

  if (autenticado && (autenticado.user?.userRoles?.length ?? 0) > 1) {
    return (
      <PantallaSeleccionRol
        session={autenticado}
        redirectTo={redirectTo}
        onVolver={() => setAutenticado(null)}
      />
    );
  }

  // Solo mostrar el spinner de validación de sesión si el componente ya montó en cliente
  if (isMounted && !isExpired && isCheckingSession) {
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
      {/* Alerta de Sesión Expirada con tokens del tema */}
      {isExpired && !error && (
        <div
          role="status"
          className="border-warning/20 bg-warning/10 text-warning-text animate-in fade-in flex items-start gap-2.5 rounded-xl border p-3 text-xs font-medium duration-200"
        >
          <HugeiconsIcon icon={AlertCircleIcon} className="mt-0.5 size-4 shrink-0" />
          <div className="flex-1 space-y-0.5">
            <p className="leading-tight font-semibold">Sesión finalizada</p>
            <p className="text-xs leading-relaxed opacity-90">
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
            <p className="text-xs leading-relaxed opacity-90">{error.message}</p>
          </div>
        </div>
      )}

      {/* Campo Usuario con id y aria-describedby */}
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
          aria-describedby={errors.username ? "username-error" : undefined}
        />
        {errors.username && (
          <p id="username-error" className="text-destructive px-2 text-xs font-medium">
            {errors.username.message}
          </p>
        )}
      </div>

      {/* Campo Contraseña con PasswordInput accesible */}
      <div className="space-y-1.5">
        <Label htmlFor="password">Contraseña *</Label>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          disabled={isSubmitting}
          placeholder="Contraseña"
          {...register("password")}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
        />
        {errors.password && (
          <p id="password-error" className="text-destructive px-2 text-xs font-medium">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Fila Recordar Usuario y Recuperar Contraseña */}
      <div className="flex items-center justify-between pt-1 text-xs">
        <div className="flex items-center gap-2">
          <Checkbox
            id="rememberUser"
            checked={rememberUser}
            onCheckedChange={(checked) => {
              setValue("rememberUser", checked === true);
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
          className="text-foreground/80 decoration-muted-foreground/40 hover:text-primary focus-visible:ring-ring/40 rounded-sm text-xs font-medium underline underline-offset-4 transition-colors outline-none focus-visible:ring-2"
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
