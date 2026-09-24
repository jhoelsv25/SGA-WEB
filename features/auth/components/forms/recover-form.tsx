"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { recoverSchema, type RecoverFormValues } from "../../schemas/recover.schema";
import { useRecoverPasswordMutation } from "../../hooks/use-recover-password-mutation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/common/date-picker";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Spinner } from "@/components/common/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  HelpCircleIcon,
} from "@hugeicons/core-free-icons";

export function RecoverForm() {
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const recoverMutation = useRecoverPasswordMutation();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<RecoverFormValues>({
    resolver: zodResolver(recoverSchema),
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = (values: RecoverFormValues) => {
    setSuccessMessage(null);
    const birthdateStr = format(values.birthdate, "yyyy-MM-dd");

    recoverMutation.mutate(
      {
        username: values.username,
        birthdate: birthdateStr,
      },
      {
        onSuccess: (res) => {
          setSuccessMessage(
            res.message ||
              "Solicitud enviada exitosamente. Sigue el flujo definido por la institución educativa para continuar.",
          );
        },
        onError: (err) => {
          if (err.errors) {
            Object.entries(err.errors).forEach(([field, messages]) => {
              setError(field as keyof RecoverFormValues, {
                type: "manual",
                message: messages[0],
              });
            });
          }
        },
      },
    );
  };

  const isSubmitting = recoverMutation.isPending;

  return (
    <div className="bg-background relative flex min-h-screen w-full flex-col justify-between px-6 py-8 sm:px-12 lg:px-16">
      {/* Barra superior */}
      <div className="flex items-center justify-between">
        <Link
          href="/login"
          className="text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="size-3.5" />
          <span>Volver al login</span>
        </Link>
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
              Recuperar contraseña
            </h1>
            <p className="text-muted-foreground text-xs">
              Ingresa tu código o usuario institucional y tu fecha de nacimiento registrada.
            </p>
          </div>
        </div>

        {/* Mensaje de Éxito si ya fue enviado */}
        {successMessage ? (
          <div className="space-y-6">
            <div className="space-y-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center">
              <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-6" />
              </div>
              <h2 className="text-foreground text-sm font-bold">Solicitud Recibida</h2>
              <p className="text-muted-foreground text-xs leading-relaxed">{successMessage}</p>
            </div>

            <Button asChild className="h-11 w-full rounded-full font-bold">
              <Link href="/login">Regresar a Iniciar Sesión</Link>
            </Button>
          </div>
        ) : (
          /* Formulario */
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Campo Usuario / Código */}
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-foreground text-xs font-semibold">
                Código o Usuario Institucional *
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
                  placeholder="Ej: CARM-2026 o DNI"
                  {...register("username")}
                  className={`bg-background placeholder:text-muted-foreground/60 focus:ring-primary/30 focus:border-primary h-11 w-full rounded-full border pr-4 pl-10 text-sm transition-all outline-none focus:ring-2 disabled:opacity-50 ${
                    errors.username
                      ? "border-destructive ring-destructive/20 ring-1"
                      : "border-input"
                  }`}
                />
              </div>
              {errors.username && (
                <p className="text-destructive px-2 text-[11px] font-medium">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Campo Fecha de Nacimiento */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="birthdate" className="text-foreground text-xs font-semibold">
                Fecha de Nacimiento *
              </Label>
              <Controller
                name="birthdate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    date={field.value}
                    onSelect={field.onChange}
                    placeholder="Día / Mes / Año"
                    disabled={isSubmitting}
                    className="border-input h-11 w-full rounded-full"
                  />
                )}
              />
              {errors.birthdate && (
                <p className="text-destructive px-2 text-[11px] font-medium">
                  {errors.birthdate.message}
                </p>
              )}
            </div>

            {/* Alerta de Ayuda */}
            <div className="bg-muted/60 text-muted-foreground border-border/50 flex items-start gap-2.5 rounded-xl border p-3 text-xs">
              <HugeiconsIcon
                icon={HelpCircleIcon}
                className="text-primary mt-0.5 size-4 shrink-0"
              />
              <span>
                La fecha de nacimiento debe coincidir con la registrada en el sistema de matrícula o
                legajo institucional.
              </span>
            </div>

            {/* Botón Solicitar */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="shadow-primary/20 h-11 w-full gap-2 rounded-full text-sm font-bold shadow-md transition-all hover:shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" />
                    <span>Verificando datos...</span>
                  </>
                ) : (
                  <span>Solicitar recuperación</span>
                )}
              </Button>
            </div>

            <div className="pt-2 text-center">
              <Link href="/login" className="text-primary text-xs font-semibold hover:underline">
                ¿Ya recuerdas tus credenciales? Inicia sesión
              </Link>
            </div>
          </form>
        )}
      </div>

      {/* Pie de página con soporte institucional */}
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
