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
  CheckmarkCircle02Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

export function HeroSection() {
  return (
    <section className="border-border from-background via-muted/20 to-background relative overflow-hidden border-b bg-linear-to-b py-16 sm:py-24 lg:py-28">
      {/* Glows y patrones decorativos */}
      <div className="bg-primary/10 pointer-events-none absolute -top-24 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full blur-3xl" />
      <div className="bg-primary/5 pointer-events-none absolute top-1/2 right-0 -z-10 h-72 w-72 rounded-full blur-2xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Texto Hero */}
          <div className="flex flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left">
            <Badge
              variant="outline"
              className="border-primary/30 bg-primary/5 text-primary mb-4 inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold"
            >
              <span className="bg-primary size-2 animate-pulse rounded-full" />
              Portal Oficial · {siteConfig.institution.shortName}
            </Badge>

            <h1 className="text-foreground text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.15]">
              Excelencia en la{" "}
              <span className="text-primary decoration-primary/30 underline underline-offset-8">
                Gestión Educativa
              </span>{" "}
              y Control Escolar
            </h1>

            <p className="text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed sm:text-lg">
              Plataforma integral diseñada para optimizar los procesos pedagógicos, la asistencia
              escolar, la evaluación por competencias y la comunicación directa con las familias en
              un entorno digital seguro.
            </p>

            {/* Botones de acción */}
            <div className="mt-8 flex w-full flex-col items-center justify-center gap-3.5 sm:flex-row lg:justify-start">
              <Button
                asChild
                size="lg"
                className="shadow-primary/20 w-full gap-2.5 px-6 font-semibold shadow-md transition-all hover:shadow-lg sm:w-auto"
              >
                <Link href={siteConfig.routes.login}>
                  <HugeiconsIcon icon={LogInIcon} className="size-5" />
                  <span>Acceder a la Plataforma</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-border hover:bg-muted w-full gap-2.5 px-6 font-medium sm:w-auto"
              >
                <Link href="/access-control/kiosk">
                  <HugeiconsIcon icon={Time02Icon} className="text-primary size-5" />
                  <span>Terminal de Marcado (Kiosco)</span>
                </Link>
              </Button>
            </div>

            {/* Indicadores clave */}
            <div className="border-border/80 mt-10 grid w-full max-w-lg grid-cols-3 gap-4 border-t pt-6">
              <div className="text-center lg:text-left">
                <p className="text-foreground text-2xl font-bold">100%</p>
                <p className="text-muted-foreground text-xs font-medium">
                  Digital y en Tiempo Real
                </p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-foreground text-2xl font-bold">MINEDU</p>
                <p className="text-muted-foreground text-xs font-medium">Cumplimiento Normativo</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-foreground text-2xl font-bold">Multi-Rol</p>
                <p className="text-muted-foreground text-xs font-medium">
                  Seguridad y Trazabilidad
                </p>
              </div>
            </div>
          </div>

          {/* Tarjeta Visual de Identidad Institucional */}
          <div className="flex justify-center lg:col-span-5">
            <div className="relative w-full max-w-md">
              <div className="from-primary/20 via-primary/5 absolute inset-0 rounded-3xl bg-linear-to-tr to-transparent blur-xl" />

              <div className="border-border bg-card relative overflow-hidden rounded-3xl border p-8 shadow-xl">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-muted/60 ring-border relative mb-5 flex h-28 w-28 items-center justify-center rounded-2xl p-3 shadow-inner ring-1">
                    <Image
                      src={siteConfig.branding.logo}
                      alt={`Logo Institucional ${siteConfig.institution.name}`}
                      width={96}
                      height={96}
                      priority
                      className="object-contain transition-transform duration-300 hover:scale-105"
                    />
                  </div>

                  <h2 className="text-foreground text-xl font-bold tracking-tight">
                    Portal Institucional {siteConfig.acronym}
                  </h2>
                  <p className="text-muted-foreground mt-1 text-xs font-medium tracking-wider uppercase">
                    {siteConfig.institution.shortName}
                  </p>

                  <div className="mt-6 w-full space-y-2.5 text-left">
                    <div className="bg-muted/50 flex items-center gap-3 rounded-xl p-3 text-xs">
                      <div className="bg-primary/10 text-primary flex size-7 shrink-0 items-center justify-center rounded-lg">
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4" />
                      </div>
                      <span className="text-foreground font-medium">
                        Registro de Asistencia Escolar y del Personal
                      </span>
                    </div>

                    <div className="bg-muted/50 flex items-center gap-3 rounded-xl p-3 text-xs">
                      <div className="bg-primary/10 text-primary flex size-7 shrink-0 items-center justify-center rounded-lg">
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4" />
                      </div>
                      <span className="text-foreground font-medium">
                        Gestión Curricular y Calificaciones Oficiales
                      </span>
                    </div>

                    <div className="bg-muted/50 flex items-center gap-3 rounded-xl p-3 text-xs">
                      <div className="bg-primary/10 text-primary flex size-7 shrink-0 items-center justify-center rounded-lg">
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4" />
                      </div>
                      <span className="text-foreground font-medium">
                        Generación y Exportación de Actas y Reportes
                      </span>
                    </div>
                  </div>

                  <Button asChild className="mt-6 w-full gap-2 font-semibold" variant="default">
                    <Link href={siteConfig.routes.login}>
                      <span>Ingresar con mis Credenciales</span>
                      <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
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
