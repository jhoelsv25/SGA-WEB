import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  LogInIcon,
  Time02Icon,
  ArrowRight01Icon,
  Shield01Icon,
  UserGroupIcon,
  Book02Icon,
} from "@hugeicons/core-free-icons";

export function HeroSection() {
  return (
    <section className="border-border from-background via-muted/30 to-background relative overflow-hidden border-b bg-linear-to-b py-16 sm:py-24 lg:py-28">
      {/* Luces y resplandores de fondo */}
      <div className="bg-primary/10 pointer-events-none absolute -top-32 left-1/2 -z-10 h-125 w-125 -translate-x-1/2 rounded-full blur-3xl" />
      <div className="bg-primary/5 pointer-events-none absolute top-1/3 -right-24 -z-10 h-80 w-80 rounded-full blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Lado Izquierdo: Propuesta de Valor Contundente */}
          <div className="flex flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left">
            <Badge
              variant="outline"
              className="border-primary/30 bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 px-3.5 py-1 text-xs font-semibold shadow-xs"
            >
              <span className="bg-primary size-2 animate-ping rounded-full" />
              Año Académico 2026 · {siteConfig.institution.badge}
            </Badge>

            <h1 className="text-foreground text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.12]">
              Transformamos la{" "}
              <span className="text-primary decoration-primary/40 underline decoration-wavy underline-offset-8">
                gestión escolar
              </span>{" "}
              con datos en tiempo real
            </h1>

            <p className="text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed sm:text-lg">
              La plataforma integral de la <strong>{siteConfig.institution.name}</strong> que
              elimina el papeleo administrativo, automatiza la asistencia en portería, centraliza
              las calificaciones por competencias y conecta a las familias al instante.
            </p>

            {/* Llamados a la acción de alto impacto */}
            <div className="mt-8 flex w-full flex-col items-center justify-center gap-3.5 sm:flex-row lg:justify-start">
              <Button
                asChild
                size="lg"
                className="shadow-primary/25 h-12 w-full gap-2.5 rounded-full px-7 font-semibold shadow-lg transition-all hover:scale-[1.02] sm:w-auto"
              >
                <Link href={siteConfig.routes.login}>
                  <HugeiconsIcon icon={LogInIcon} className="size-5" />
                  <span>Acceso Institucional</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-border hover:bg-muted/80 h-12 w-full gap-2.5 rounded-full px-6 font-medium sm:w-auto"
              >
                <Link href={siteConfig.routes.kiosk}>
                  <HugeiconsIcon icon={Time02Icon} className="text-primary size-5" />
                  <span>Terminal Kiosco en Vivo</span>
                </Link>
              </Button>
            </div>

            {/* Métricas de Impacto Directo */}
            <div className="border-border/80 mt-10 grid w-full max-w-lg grid-cols-2 gap-4 border-t pt-6 sm:grid-cols-4">
              <div>
                <p className="text-foreground text-2xl font-extrabold sm:text-3xl">+1,200</p>
                <p className="text-muted-foreground text-[11px] leading-tight font-medium">
                  Alumnos Monitoreados
                </p>
              </div>
              <div>
                <p className="text-foreground text-2xl font-extrabold sm:text-3xl">99.8%</p>
                <p className="text-muted-foreground text-[11px] leading-tight font-medium">
                  Puntualidad y Precisión
                </p>
              </div>
              <div>
                <p className="text-foreground text-2xl font-extrabold sm:text-3xl">100%</p>
                <p className="text-muted-foreground text-[11px] leading-tight font-medium">
                  Alineado con SIAGIE
                </p>
              </div>
              <div>
                <p className="text-foreground text-2xl font-extrabold sm:text-3xl">Cero</p>
                <p className="text-muted-foreground text-[11px] leading-tight font-medium">
                  Pérdida de Registros
                </p>
              </div>
            </div>
          </div>

          {/* Lado Derecho: Mockup Visual Vivo del Sistema */}
          <div className="flex justify-center lg:col-span-5">
            <div className="relative w-full max-w-md">
              <div className="from-primary/25 via-primary/10 absolute -inset-1.5 rounded-3xl bg-linear-to-tr to-transparent opacity-80 blur-xl" />

              <div className="border-border/80 bg-card/95 relative overflow-hidden rounded-3xl border shadow-2xl backdrop-blur-md">
                {/* Cabecera del Mockup */}
                <div className="border-border/60 bg-muted/40 flex items-center justify-between border-b px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-rose-500/80" />
                    <span className="size-3 rounded-full bg-amber-500/80" />
                    <span className="size-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-muted-foreground font-mono text-[11px] font-medium">
                    sga.carmelinas.edu.pe
                  </span>
                  <div className="text-primary flex items-center gap-1 text-[10px] font-semibold">
                    <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
                    <span>EN LÍNEA</span>
                  </div>
                </div>

                {/* Contenido del Panel */}
                <div className="p-6">
                  {/* Tarjeta de Resumen Institucional */}
                  <div className="mb-5 flex items-center gap-3.5">
                    <div className="bg-card ring-border relative flex size-14 shrink-0 items-center justify-center rounded-2xl p-1.5 shadow-md ring-1">
                      <Image
                        src={siteConfig.branding.logo}
                        alt={`Logo ${siteConfig.institution.name}`}
                        width={46}
                        height={46}
                        priority
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h2 className="text-foreground text-base leading-tight font-bold">
                        {siteConfig.institution.shortName}
                      </h2>
                      <p className="text-muted-foreground text-xs">
                        Código Modular: {siteConfig.institution.modularCode}
                      </p>
                      <span className="text-primary text-[10px] font-semibold tracking-wider uppercase">
                        UGEL Angaraes · DRE Huancavelica
                      </span>
                    </div>
                  </div>

                  {/* Indicadores en Vivo */}
                  <div className="space-y-2.5">
                    <div className="bg-muted/40 border-border/50 flex items-center justify-between rounded-xl border p-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                          <HugeiconsIcon icon={UserGroupIcon} className="size-4" />
                        </div>
                        <div>
                          <p className="text-foreground font-semibold">Asistencia en Portería</p>
                          <p className="text-muted-foreground text-[11px]">Monitoreo de Kiosco</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        98.4% Presentes
                      </span>
                    </div>

                    <div className="bg-muted/40 border-border/50 flex items-center justify-between rounded-xl border p-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                          <HugeiconsIcon icon={Book02Icon} className="size-4" />
                        </div>
                        <div>
                          <p className="text-foreground font-semibold">Calificaciones CNEB</p>
                          <p className="text-muted-foreground text-[11px]">Bimestre I en curso</p>
                        </div>
                      </div>
                      <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[11px] font-bold">
                        Competencias AD/A
                      </span>
                    </div>

                    <div className="bg-muted/40 border-border/50 flex items-center justify-between rounded-xl border p-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                          <HugeiconsIcon icon={Shield01Icon} className="size-4" />
                        </div>
                        <div>
                          <p className="text-foreground font-semibold">Seguridad & Auditoría</p>
                          <p className="text-muted-foreground text-[11px]">
                            Trazabilidad inmutable
                          </p>
                        </div>
                      </div>
                      <span className="text-muted-foreground font-mono text-[11px]">
                        0 incidentes
                      </span>
                    </div>
                  </div>

                  <Button asChild className="mt-5 w-full rounded-full font-semibold shadow-md">
                    <Link href={siteConfig.routes.login}>
                      <span>Iniciar Sesión en el SGA</span>
                      <HugeiconsIcon icon={ArrowRight01Icon} className="ml-1.5 size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
