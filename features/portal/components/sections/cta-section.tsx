import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config";
import { HugeiconsIcon } from "@hugeicons/react";
import { LogInIcon, Time02Icon, Call02Icon, Mail01Icon } from "@hugeicons/core-free-icons";

export function CtaSection() {
  return (
    <section className="bg-background py-20 text-center sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="border-primary/20 from-primary/15 via-primary/5 to-background relative overflow-hidden rounded-3xl border bg-linear-to-b p-8 shadow-xl sm:p-14">
          <div className="bg-primary/10 pointer-events-none absolute -top-20 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 rounded-full blur-2xl" />

          <span className="bg-primary/10 text-primary border-primary/20 inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-[11px] font-bold tracking-widest uppercase">
            {siteConfig.institution.badge} · Plataforma Oficial
          </span>

          <h2 className="text-foreground mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Moderniza tu experiencia escolar hoy
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-sm leading-relaxed sm:text-base">
            Ingresa al portal institucional con tus credenciales asignadas para acceder a tu panel
            de control, o consulta el estado de asistencia en el terminal de portería.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="shadow-primary/25 h-12 w-full gap-2.5 rounded-full px-8 font-semibold shadow-lg transition-all hover:scale-[1.02] sm:w-auto"
            >
              <Link href={siteConfig.routes.login}>
                <HugeiconsIcon icon={LogInIcon} className="size-5" />
                <span>Ingresar a mi Cuenta SGA</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-border hover:bg-muted/80 h-12 w-full gap-2.5 rounded-full px-6 font-medium sm:w-auto"
            >
              <Link href="/access-control/kiosk">
                <HugeiconsIcon icon={Time02Icon} className="text-primary size-5" />
                <span>Abrir Marcado en Portería</span>
              </Link>
            </Button>
          </div>

          {/* Soporte Directo */}
          <div className="border-border/60 text-muted-foreground mt-10 flex flex-wrap items-center justify-center gap-6 border-t pt-6 text-xs">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Call02Icon} className="text-primary size-4 shrink-0" />
              <span>Soporte: {siteConfig.institution.contact.supportPhone}</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Mail01Icon} className="text-primary size-4 shrink-0" />
              <span>{siteConfig.institution.contact.supportEmail}</span>
            </div>
            <span>·</span>
            <span>Horario: {siteConfig.institution.contact.schedule}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
