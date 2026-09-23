"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "../../schemas/login.schema";
import { authService } from "../../services/auth.service";
import { ApiClientError } from "@/lib/api-client";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Spinner } from "@/components/common/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  LockIcon,
  ViewIcon,
  ViewOffSlashIcon,
  LogInIcon,
} from "@hugeicons/core-free-icons";

function getInitialLoginValues(): LoginFormValues {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("sga_remembered_username");
      if (saved) {
        return {
          username: saved,
          password: "",
          rememberUser: true,
        };
      }
    } catch {
      // Ignorar en entornos de almacenamiento restringido
    }
  }
  return {
    username: "",
    password: "",
    rememberUser: false,
  };
}

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);

  const initialValues = React.useMemo(() => getInitialLoginValues(), []);
  const [rememberUser, setRememberUser] = React.useState(initialValues.rememberUser);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: initialValues,
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      if (values.rememberUser) {
        localStorage.setItem("sga_remembered_username", values.username);
      } else {
        localStorage.removeItem("sga_remembered_username");
      }

      const response = await authService.login({
        username: values.username,
        password: values.password,
        rememberMe: values.rememberUser,
      });

      toast.success(response.message || "Bienvenido al sistema");

      // Redirección al panel del dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof ApiClientError) {
        if (err.errors) {
          Object.entries(err.errors).forEach(([field, messages]) => {
            setError(field as keyof LoginFormValues, {
              type: "manual",
              message: messages[0],
            });
          });
        }
        toast.error(err.message || "Credenciales incorrectas");
      } else {
        toast.error("Ocurrió un error inesperado al conectar con el servidor.");
      }
    }
  };

  return (
    <div className="bg-background relative flex min-h-screen w-full flex-col justify-between px-6 py-8 sm:px-12 lg:px-16">
      {/* Barra superior del formulario */}
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
          SGA · Acceso Institucional
        </span>
        <ThemeToggle />
      </div>

      {/* Contenedor central del Formulario */}
      <div className="mx-auto w-full max-w-sm py-8">
        {/* Cabecera con Logo Institucional */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="bg-card ring-border relative mb-3 flex size-16 items-center justify-center rounded-2xl p-2 shadow-md ring-1">
            <Image
              src="/logo.png"
              alt="Logo Institución Educativa Carmelitas"
              width={52}
              height={52}
              priority
              className="object-contain"
            />
          </div>

          <div className="space-y-1">
            <span className="bg-primary/10 text-primary border-primary/20 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase">
              I.E. Carmelitas · Lircay
            </span>
            <h1 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl">
              Inicia sesión
            </h1>
            <p className="text-muted-foreground text-xs">
              Ingresa tus credenciales institucionales para continuar.
            </p>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Campo Usuario */}
          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-foreground text-xs font-semibold">
              Usuario *
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
              <p className="text-destructive px-2 text-[11px] font-medium">
                {errors.username.message}
              </p>
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
                <HugeiconsIcon
                  icon={showPassword ? ViewOffSlashIcon : ViewIcon}
                  className="size-4"
                />
              </button>
            </div>
            {errors.password && (
              <p className="text-destructive px-2 text-[11px] font-medium">
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
              href="/auth/forgot-password"
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
      </div>

      {/* Pie de página con información de soporte institucional */}
      <div className="text-muted-foreground space-y-1 text-center text-xs">
        <p>¿Necesitas ayuda? Central de soporte: Lunes a Viernes de 8:00am a 5:30pm</p>
        <p className="text-[11px] opacity-75">
          © {new Date().getFullYear()} I.E. Carmelitas · Lircay, Huancavelica. Todos los derechos
          reservados.
        </p>
      </div>
    </div>
  );
}
