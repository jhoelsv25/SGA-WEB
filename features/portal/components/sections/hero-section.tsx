import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Award01Icon,
  Book02Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  LogInIcon,
  Shield01Icon,
  TeacherIcon,
  Time02Icon,
} from "@hugeicons/core-free-icons";

const ACCESOS_RAPIDOS = [
  { label: "Docentes", href: "/#modulos" },
  { label: "Estudiantes", href: "/#modulos" },
  { label: "Apoderados", href: "/#modulos" },
  { label: "Dirección", href: "/#modulos" },
];

export function HeroSection() {
  return (
    <section className="border-border relative overflow-hidden border-b py-14 sm:py-20 lg:py-24">
      {/* Atmósfera institucional sutil */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,var(--color-primary)/12%,transparent_55%),radial-gradient(ellipse_at_bottom_left,var(--color-primary)/8%,transparent_50%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--color-border)/35_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)/35_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_center,black_40%,transparent_80%)] bg-size-[36px_36px]"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Columna editorial */}
          <div className="flex flex-col items-center text-center lg:col-span-6 lg:items-start lg:text-left">
            <div className="border-primary/25 bg-primary/10 text-primary mb-5 inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-semibold">
              <span className="bg-primary size-2 animate-pulse rounded-full" />
              <span>
                {siteConfig.institution.badge} · {siteConfig.institution.location.reference}
              </span>
            </div>

            <h1 className="text-foreground text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-[3.35rem] lg:leading-[1.08]">
              Intranet educativa de{" "}
              <span className="text-primary">{siteConfig.institution.shortName}</span>
            </h1>

            <p className="text-muted-foreground mt-5 max-w-xl text-base leading-relaxed sm:text-lg">
              Espacio digital de la <strong>{siteConfig.institution.name}</strong> para gestionar la
              asistencia escolar, el seguimiento de clases, el aula virtual y la comunicación con
              estudiantes y familias.
            </p>

            <div className="mt-7 flex w-full flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <Button
                asChild
                size="lg"
                className="shadow-primary/20 h-12 w-full gap-2 rounded-full px-7 font-semibold shadow-lg sm:w-auto"
              >
                <Link href={siteConfig.routes.login}>
                  <HugeiconsIcon icon={LogInIcon} className="size-5" />
                  <span>Ingresar a la intranet</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-background/80 h-12 w-full gap-2 rounded-full px-6 font-medium backdrop-blur-sm sm:w-auto"
              >
                <Link href={siteConfig.routes.kiosk}>
                  <HugeiconsIcon icon={Time02Icon} className="text-primary size-5" />
                  <span>Registro de asistencia</span>
                </Link>
              </Button>
            </div>

            {/* Perfiles de la comunidad */}
            <div className="border-border/70 mt-8 flex flex-wrap items-center justify-center gap-2 border-t pt-5 lg:justify-start">
              <span className="text-muted-foreground mr-1 text-xs font-medium">
                Accesos por perfil:
              </span>
              {ACCESOS_RAPIDOS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="bg-muted/70 hover:bg-primary/10 hover:text-primary text-foreground inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors"
                >
                  <span>{item.label}</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
                </Link>
              ))}
            </div>
          </div>

          {/* Columna visual: Vista previa tipo Intranet Escolar */}
          <div className="lg:col-span-6">
            <div className="border-border/80 bg-card/95 relative overflow-hidden rounded-3xl border shadow-2xl backdrop-blur-md">
              {/* Barra superior de ventana de intranet */}
              <div className="border-border/70 bg-muted/50 flex items-center justify-between border-b px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="bg-card ring-border flex size-8 items-center justify-center rounded-lg p-1 ring-1">
                    <Image
                      src={siteConfig.branding.logo}
                      alt={`Insignia ${siteConfig.institution.shortName}`}
                      width={24}
                      height={24}
                      priority
                      className="object-contain"
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-foreground text-xs font-bold">
                      Portal {siteConfig.acronym} · Intranet
                    </p>
                    <p className="text-muted-foreground text-[11px]">
                      {siteConfig.institution.administration.ugel} ·{" "}
                      {siteConfig.institution.administration.dre}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="border-emerald-500/30 bg-emerald-500/10 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300"
                >
                  En línea
                </Badge>
              </div>

              {/* Contenido simulado de la intranet */}
              <div className="space-y-3.5 p-5">
                {/* Banner interno institucional */}
                <div className="from-primary to-primary/85 text-primary-foreground relative overflow-hidden rounded-2xl bg-linear-to-r p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-medium opacity-85">
                        {siteConfig.institution.motto}
                      </p>
                      <p className="mt-0.5 text-base font-bold">Año Académico · Nivel Secundaria</p>
                    </div>
                    <div className="bg-primary-foreground/15 flex size-10 shrink-0 items-center justify-center rounded-xl">
                      <HugeiconsIcon icon={Calendar03Icon} className="size-5" />
                    </div>
                  </div>
                </div>

                {/* Mosaico de módulos vivos */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="border-border/70 bg-muted/30 rounded-2xl border p-3.5">
                    <div className="flex items-center justify-between">
                      <span className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                        <HugeiconsIcon icon={TeacherIcon} className="size-4" />
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        Jornada activa
                      </span>
                    </div>
                    <p className="text-foreground mt-2.5 text-sm font-bold">Sesiones de clase</p>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      Firma de ingreso, tema del día y seguimiento docente.
                    </p>
                  </div>

                  <div className="border-border/70 bg-muted/30 rounded-2xl border p-3.5">
                    <div className="flex items-center justify-between">
                      <span className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                        <HugeiconsIcon icon={Time02Icon} className="size-4" />
                      </span>
                      <span className="text-muted-foreground text-[11px] font-medium">
                        Portería
                      </span>
                    </div>
                    <p className="text-foreground mt-2.5 text-sm font-bold">
                      Control de asistencia
                    </p>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      Marcación en kiosko con cálculo automático de tardanzas.
                    </p>
                  </div>

                  <div className="border-border/70 bg-muted/30 rounded-2xl border p-3.5">
                    <div className="flex items-center gap-2">
                      <span className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                        <HugeiconsIcon icon={Book02Icon} className="size-4" />
                      </span>
                      <div>
                        <p className="text-foreground text-sm font-bold">Aula virtual</p>
                        <p className="text-muted-foreground text-[11px]">
                          Materiales y tareas por bimestre
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-border/70 bg-muted/30 rounded-2xl border p-3.5">
                    <div className="flex items-center gap-2">
                      <span className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                        <HugeiconsIcon icon={Award01Icon} className="size-4" />
                      </span>
                      <div>
                        <p className="text-foreground text-sm font-bold">Libretas SIAGIE</p>
                        <p className="text-muted-foreground text-[11px]">
                          Descarga segura para familias
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pie de confianza */}
                <div className="border-border/60 text-muted-foreground flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} className="text-primary size-3.5" />
                    Acceso seguro para familias y docentes
                  </span>
                  <span className="flex items-center gap-1.5">
                    <HugeiconsIcon icon={Shield01Icon} className="text-primary size-3.5" />
                    Ley N.° 29733
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
