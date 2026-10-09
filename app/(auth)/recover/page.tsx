import * as React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config";
import { RecoverForm } from "@/features/auth";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";

export const metadata: Metadata = {
  title: "Recuperar Acceso",
  description: `Recuperación segura de contraseña institucional mediante código y fecha de nacimiento en ${siteConfig.institution.shortName}.`,
  alternates: {
    canonical: siteConfig.routes.recover,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RecoverPage() {
  return (
    <div className="bg-background relative flex min-h-screen w-full flex-col justify-between px-6 py-8 sm:px-12 lg:px-16">
      {/* Barra superior de la página */}
      <div className="flex items-center justify-between">
        <Link
          href={siteConfig.routes.login}
          className="text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="size-3.5" />
          <span>Volver al inicio de sesión</span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Contenedor central del Formulario */}
      <div className="mx-auto w-full max-w-sm py-8">
        {/* Cabecera estática con Logo Institucional */}
        <div className="mb-8 flex flex-col items-center text-center">
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
            <span className="bg-primary/10 text-primary border-primary/20 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase">
              {siteConfig.institution.badge}
            </span>
            <h1 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl">
              Recuperar acceso
            </h1>
            <p className="text-muted-foreground text-xs">
              Valida tu identidad institucional con tu código y fecha de nacimiento.
            </p>
          </div>
        </div>

        {/* Formulario Puro */}
        <RecoverForm />
      </div>

      {/* Pie de página estático */}
      <div className="text-muted-foreground space-y-1 text-center text-xs">
        <p>¿Problemas para acceder? Comunícate con la secretaría del colegio.</p>
        <p className="text-[11px] opacity-75">
          © {new Date().getFullYear()} {siteConfig.institution.badge}.
        </p>
      </div>
    </div>
  );
}
