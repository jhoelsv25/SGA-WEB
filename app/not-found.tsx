import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { HugeiconsIcon } from "@hugeicons/react";
import { Home01Icon, LogInIcon, Search01Icon } from "@hugeicons/core-free-icons";

export const metadata: Metadata = {
  title: "Página No Encontrada (404)",
  description: `La página o recurso que buscas no existe o ha sido movido en ${siteConfig.name}.`,
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
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
        {/* Badge 404 & Icono */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="bg-primary/10 text-primary ring-primary/20 flex size-24 items-center justify-center rounded-3xl shadow-lg ring-1 sm:size-28">
            <HugeiconsIcon icon={Search01Icon} className="size-12 sm:size-14" />
          </div>
          <span className="bg-primary text-primary-foreground absolute -top-2 -right-2 rounded-full px-2.5 py-0.5 text-xs font-black tracking-wider uppercase shadow-xs">
            404
          </span>
        </div>

        {/* Títulos y Explicación */}
        <div className="space-y-3">
          <span className="bg-primary/10 text-primary border-primary/20 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold tracking-widest uppercase">
            Página No Encontrada
          </span>
          <h1 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl">
            Parece que te has perdido
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
            La dirección web que ingresaste no corresponde a ninguna página activa del{" "}
            {siteConfig.name} de la {siteConfig.institution.shortName}. Puede haber sido movida o
            escrita incorrectamente.
          </p>
        </div>

        {/* Botones de Acción */}
        <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="shadow-primary/20 h-11 w-full gap-2 rounded-full text-sm font-bold shadow-md transition-all hover:shadow-lg sm:w-auto"
          >
            <Link href={siteConfig.routes.home}>
              <HugeiconsIcon icon={Home01Icon} className="size-4.5" />
              <span>Ir al Portal Principal</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-11 w-full gap-2 rounded-full text-sm font-semibold sm:w-auto"
          >
            <Link href={siteConfig.routes.login}>
              <HugeiconsIcon icon={LogInIcon} className="size-4.5" />
              <span>Acceso Institucional</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Pie de página institucional */}
      <div className="text-muted-foreground space-y-1 text-center text-xs">
        <p>
          ¿Crees que esto es un error? Comunícate con {siteConfig.institution.contact.supportEmail}.
        </p>
        <p className="text-[11px] opacity-75">
          © {new Date().getFullYear()} {siteConfig.institution.badge}. Todos los derechos
          reservados.
        </p>
      </div>
    </div>
  );
}
