import * as React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { siteConfig } from "@/config";
import { LoginForm } from "@/features/auth";
import { ThemeToggle } from "@/components/common/theme-toggle";

export const metadata: Metadata = {
  title: "Iniciar Sesión",
  description: `Acceso seguro a la plataforma del ${siteConfig.name} para estudiantes, docentes y directivos de la ${siteConfig.institution.shortName}.`,
  alternates: {
    canonical: siteConfig.routes.login,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LoginPage() {
  return (
    <div className="bg-background relative flex min-h-screen w-full flex-col justify-between px-6 py-8 sm:px-12 lg:px-16">
      <div className="flex items-center justify-between">
        <Link
          href={siteConfig.routes.home}
          className="text-muted-foreground hover:text-primary inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold transition-colors lg:hidden"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="size-3.5" />
          <span>Volver al portal</span>
        </Link>
        <span className="text-muted-foreground hidden text-xs font-semibold tracking-wider uppercase lg:inline">
          {siteConfig.acronym} · Acceso institucional
        </span>
        <ThemeToggle />
      </div>

      <div className="mx-auto w-full max-w-sm py-8">
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
              Inicia sesión
            </h1>
            <p className="text-muted-foreground text-xs">
              Ingresa tus credenciales institucionales para continuar.
            </p>
          </div>
        </div>

        <LoginForm />
      </div>

      <div className="text-muted-foreground space-y-1 text-center text-xs">
        <p>¿Necesitas ayuda? Central de soporte: {siteConfig.institution.contact.schedule}</p>
        <p className="text-[11px] opacity-75">
          © {new Date().getFullYear()} {siteConfig.institution.badge}. Todos los derechos
          reservados.
        </p>
      </div>
    </div>
  );
}
