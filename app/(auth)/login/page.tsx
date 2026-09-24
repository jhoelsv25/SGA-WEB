import * as React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/features/auth";
import { ThemeToggle } from "@/components/common/theme-toggle";

export const metadata: Metadata = {
  title: "Iniciar Sesión | I.E. Carmelitas",
  description: "Ingresa con tus credenciales institucionales.",
};

export default function LoginPage() {
  return (
    <div className="bg-background relative flex min-h-screen w-full flex-col justify-between px-6 py-8 sm:px-12 lg:px-16">
      {/* Barra superior de la página */}
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
          SGA · Acceso Institucional
        </span>
        <ThemeToggle />
      </div>

      {/* Contenedor central del Formulario */}
      <div className="mx-auto w-full max-w-sm py-8">
        {/* Cabecera estática con Logo Institucional */}
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

        {/* Formulario Puro */}
        <LoginForm />
      </div>

      {/* Pie de página estático con información de soporte institucional */}
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
