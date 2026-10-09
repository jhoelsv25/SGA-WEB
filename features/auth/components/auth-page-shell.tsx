import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { siteConfig } from "@/config";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { cn } from "@/lib/utils";

export interface AuthPageShellProps {
  /** Ruta a la que apunta el botón o enlace de regreso */
  backHref?: string;
  /** Texto del enlace de regreso */
  backLabel?: string;
  /** Si true, el enlace de regreso se oculta en pantallas lg (desktop) */
  backHideOnLg?: boolean;
  /** Elemento personalizado en la esquina superior izquierda (ej. CerrarSesionEnlace) */
  topBarLeft?: React.ReactNode;
  /** Texto institucional o componente central de la barra superior */
  topBarCenter?: React.ReactNode;
  /** Insignia que acompaña al título (por defecto el distintivo institucional) */
  badge?: string;
  /** Título principal de la tarjeta de autenticación */
  title: string;
  /** Descripción o instrucción bajo el título */
  description: string;
  /** Mensaje de asistencia o canal de soporte en el pie */
  supportText?: React.ReactNode;
  /** Contenido del formulario */
  children: React.ReactNode;
}

/**
 * Marco unificado para las pantallas del flujo de autenticación (Login, Recuperación, Cambio de contraseña).
 * Centraliza la barra superior con navegación y selector de tema, el encabezado institucional con logo e insignia,
 * y el pie de soporte.
 */
export function AuthPageShell({
  backHref,
  backLabel = "Volver",
  backHideOnLg = false,
  topBarLeft,
  topBarCenter,
  badge,
  title,
  description,
  supportText,
  children,
}: AuthPageShellProps) {
  const anioActual = new Date().getFullYear();

  return (
    <div className="bg-background relative flex min-h-screen w-full flex-col justify-between px-6 py-8 sm:px-12 lg:px-16">
      {/* Barra superior */}
      <div className="flex items-center justify-between">
        {topBarLeft ? (
          topBarLeft
        ) : backHref ? (
          <Link
            href={backHref}
            className={cn(
              "text-muted-foreground hover:text-primary focus-visible:ring-ring/40 inline-flex min-h-11 items-center gap-1.5 rounded-full text-xs font-semibold transition-colors outline-none focus-visible:ring-2",
              backHideOnLg && "lg:hidden",
            )}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-3.5" />
            <span>{backLabel}</span>
          </Link>
        ) : (
          <div aria-hidden="true" />
        )}

        {topBarCenter && (
          <span className="text-muted-foreground hidden text-xs font-semibold tracking-wider uppercase lg:inline">
            {topBarCenter}
          </span>
        )}

        <ThemeToggle />
      </div>

      {/* Contenedor central del formulario */}
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
              {badge ?? siteConfig.institution.badge}
            </span>
            <h1 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl">
              {title}
            </h1>
            <p className="text-muted-foreground text-xs">{description}</p>
          </div>
        </div>

        {children}
      </div>

      {/* Pie de página con información de soporte y derechos */}
      <div className="text-muted-foreground space-y-1 text-center text-xs">
        {supportText && <p>{supportText}</p>}
        <p className="text-[11px] opacity-75">
          © {anioActual} {siteConfig.institution.badge}. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
