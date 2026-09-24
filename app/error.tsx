"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon, RefreshIcon, Home01Icon } from "@hugeicons/core-free-icons";

export interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  React.useEffect(() => {
    console.error("Runtime Error capturado por app/error.tsx:", error);
  }, [error]);

  return (
    <div className="bg-background relative flex min-h-screen w-full flex-col justify-between px-6 py-8 sm:px-12 lg:px-16">
      {/* Barra Superior */}
      <div className="flex items-center justify-between">
        <Link
          href={siteConfig.routes.home}
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-xs font-semibold transition-colors"
        >
          <div className="bg-card ring-border flex size-8 items-center justify-center rounded-lg p-1 shadow-xs ring-1">
            <Image
              src={siteConfig.branding.logo}
              alt={`Logo ${siteConfig.institution.shortName}`}
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <span>
            {siteConfig.acronym} · {siteConfig.institution.badge}
          </span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Contenido Central */}
      <div className="mx-auto flex max-w-lg flex-col items-center py-12 text-center">
        {/* Badge Error & Icono */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="bg-destructive/10 text-destructive ring-destructive/20 flex size-24 items-center justify-center rounded-3xl shadow-lg ring-1 sm:size-28">
            <HugeiconsIcon icon={AlertCircleIcon} className="size-12 sm:size-14" />
          </div>
          <span className="bg-destructive text-destructive-foreground absolute -top-2 -right-2 rounded-full px-2.5 py-0.5 text-xs font-black tracking-wider uppercase shadow-xs">
            Error
          </span>
        </div>

        {/* Títulos y Explicación */}
        <div className="space-y-3">
          <span className="bg-destructive/10 text-destructive border-destructive/20 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold tracking-widest uppercase">
            Incidencia Técnica
          </span>
          <h1 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl">
            Ocurrió un problema inesperado
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
            Se ha producido un error al procesar la información en esta pantalla. Puedes reintentar
            la operación o regresar a la página de inicio.
          </p>
          {error.digest && (
            <p className="bg-muted text-muted-foreground mx-auto max-w-xs rounded-lg px-3 py-1 font-mono text-[11px]">
              ID de rastreo: {error.digest}
            </p>
          )}
        </div>

        {/* Botones de Acción */}
        <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            onClick={() => reset()}
            size="lg"
            className="shadow-primary/20 h-11 w-full gap-2 rounded-full text-sm font-bold shadow-md transition-all hover:shadow-lg sm:w-auto"
          >
            <HugeiconsIcon icon={RefreshIcon} className="size-4.5" />
            <span>Reintentar Operación</span>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-11 w-full gap-2 rounded-full text-sm font-semibold sm:w-auto"
          >
            <Link href={siteConfig.routes.home}>
              <HugeiconsIcon icon={Home01Icon} className="size-4.5" />
              <span>Volver al Portal</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Pie de página institucional */}
      <div className="text-muted-foreground space-y-1 text-center text-xs">
        <p>
          Si el problema persiste, contacta al administrador del sistema en la{" "}
          {siteConfig.institution.shortName}.
        </p>
        <p className="text-[11px] opacity-75">
          © {new Date().getFullYear()} {siteConfig.institution.badge}.
        </p>
      </div>
    </div>
  );
}
