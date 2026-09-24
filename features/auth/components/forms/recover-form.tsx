"use client";

import Image from "next/image";
import Link from "next/link";
import { Controller } from "react-hook-form";
import { useRecoverForm } from "../../hooks/use-recover-form";
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
  const { register, control, onSubmit, errors, isSubmitting, successMessage, clearSuccessMessage } =
    useRecoverForm();

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
              Recuperar acceso
            </h1>
            <p className="text-muted-foreground text-xs">
              Valida tu identidad institucional con tu código y fecha de nacimiento.
            </p>
          </div>
        </div>

        {/* Estado de Éxito / Instrucciones */}
        {successMessage ? (
          <div className="border-primary/20 bg-primary/5 space-y-4 rounded-2xl border p-5 text-center shadow-xs">
            <div className="bg-primary/10 text-primary mx-auto flex size-12 items-center justify-center rounded-full">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-foreground text-sm font-bold">Solicitud procesada</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">{successMessage}</p>
            </div>
            <div className="pt-2">
              <Button
                variant="outline"
                onClick={clearSuccessMessage}
                className="h-10 w-full rounded-full text-xs font-semibold"
              >
                Volver a consultar
              </Button>
            </div>
          </div>
        ) : (
          /* Formulario */
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            {/* Campo Usuario o Código */}
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-foreground text-xs font-semibold">
                Usuario, DNI o Código Modular *
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
                  placeholder="Ej: 74839201 o docente01"
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

            {/* Campo Fecha de Nacimiento con DatePicker */}
            <div className="space-y-1.5">
              <Label htmlFor="birthdate" className="text-foreground text-xs font-semibold">
                Fecha de nacimiento *
              </Label>
              <Controller
                control={control}
                name="birthdate"
                render={({ field }) => (
                  <DatePicker
                    date={field.value}
                    onSelect={field.onChange}
                    disabled={isSubmitting}
                    placeholder="Selecciona tu fecha de nacimiento"
                    className={
                      errors.birthdate ? "border-destructive ring-destructive/20 ring-1" : ""
                    }
                  />
                )}
              />
              {errors.birthdate && (
                <p className="text-destructive px-2 text-[11px] font-medium">
                  {errors.birthdate.message}
                </p>
              )}
            </div>

            {/* Aviso informativo */}
            <div className="bg-muted/40 text-muted-foreground flex items-start gap-2.5 rounded-xl p-3 text-xs">
              <HugeiconsIcon icon={HelpCircleIcon} className="mt-0.5 size-4 shrink-0" />
              <p className="leading-relaxed">
                Tu fecha de nacimiento valida tu identidad en el registro institucional. Si tus
                datos no coinciden, comunícate con la secretaría de la I.E. Carmelitas.
              </p>
            </div>

            {/* Botón Solicitar Recuperación */}
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
                  <span>Recuperar contraseña</span>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Pie de página */}
      <div className="text-muted-foreground space-y-1 text-center text-xs">
        <p>¿Problemas para acceder? Dirígete a la coordinación académica de la I.E.</p>
        <p className="text-[11px] opacity-75">
          © {new Date().getFullYear()} I.E. Carmelitas · Lircay, Huancavelica.
        </p>
      </div>
    </div>
  );
}
