import * as React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  LogInIcon,
  Time02Icon,
  Book02Icon,
  UserGroupIcon,
  Award01Icon,
  CheckmarkCircle02Icon,
  ArrowRight01Icon,
  School01Icon,
} from "@hugeicons/core-free-icons";

export const metadata: Metadata = {
  title: "Portal Institucional",
  description:
    "Portal Oficial del Sistema de Gestión Académica (SGA) de la Institución Educativa Carmelitas en Lircay, Huancavelica. Servicios educativos, control escolar y vida institucional.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Portal Institucional · I.E. Carmelitas Lircay",
    description: "Excelencia en la Gestión Educativa y Control Escolar en Lircay, Huancavelica.",
    url: "/",
  },
};

export default function PortalPage() {
  return (
    <div id="inicio" className="flex flex-col">
      {/* 1. SECCIÓN HERO */}
      <section className="border-border from-background via-muted/20 to-background relative overflow-hidden border-b bg-linear-to-b py-16 sm:py-24 lg:py-28">
        {/* Glows y patrones sutiles */}
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
                Portal Oficial · Sistema de Gestión Académica
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
                escolar, la evaluación por competencias y la comunicación directa con las familias
                en un entorno digital seguro.
              </p>

              {/* Botones de acción */}
              <div className="mt-8 flex w-full flex-col items-center justify-center gap-3.5 sm:flex-row lg:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="shadow-primary/20 w-full gap-2.5 px-6 font-semibold shadow-md transition-all hover:shadow-lg sm:w-auto"
                >
                  <Link href="/login">
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
                  <p className="text-muted-foreground text-xs font-medium">
                    Cumplimiento Normativo
                  </p>
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
                {/* Glow decorativo detrás del card */}
                <div className="from-primary/20 via-primary/5 absolute inset-0 rounded-3xl bg-linear-to-tr to-transparent blur-xl" />

                <div className="border-border bg-card relative overflow-hidden rounded-3xl border p-8 shadow-xl">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-muted/60 ring-border relative mb-5 flex h-28 w-28 items-center justify-center rounded-2xl p-3 shadow-inner ring-1">
                      <Image
                        src="/logo.png"
                        alt="Logo Institucional SGA"
                        width={96}
                        height={96}
                        priority
                        className="object-contain transition-transform duration-300 hover:scale-105"
                      />
                    </div>

                    <h2 className="text-foreground text-xl font-bold tracking-tight">
                      Portal Institucional SGA
                    </h2>
                    <p className="text-muted-foreground mt-1 text-xs font-medium tracking-wider uppercase">
                      Sistema Administrativo Educativo
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
                      <Link href="/login">
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

      {/* 2. MÓDULOS DE ACCESO PRINCIPALES */}
      <section id="modulos" className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-primary text-xs font-bold tracking-widest uppercase">
              Ecosistema Integrado
            </h2>
            <p className="text-foreground mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Módulos y Servicios del SGA
            </p>
            <p className="text-muted-foreground mt-3 text-sm">
              Cada perfil cuenta con herramientas dedicadas para una gestión escolar eficiente y
              transparente.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Gestión Docente */}
            <Card className="border-border/80 hover:border-primary/40 flex flex-col justify-between transition-all hover:shadow-md">
              <CardHeader className="space-y-3 pb-4">
                <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl">
                  <HugeiconsIcon icon={Book02Icon} className="size-6" />
                </div>
                <CardTitle className="text-lg font-bold">Gestión Pedagógica</CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  Registro de sesiones de clase, programación curricular, competencias y
                  calificaciones periódicas.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link
                  href="/login"
                  className="text-primary inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
                >
                  <span>Acceso Docente</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
                </Link>
              </CardContent>
            </Card>

            {/* Card 2: Control de Asistencia & Kiosco */}
            <Card className="border-border/80 hover:border-primary/40 flex flex-col justify-between transition-all hover:shadow-md">
              <CardHeader className="space-y-3 pb-4">
                <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl">
                  <HugeiconsIcon icon={Time02Icon} className="size-6" />
                </div>
                <CardTitle className="text-lg font-bold">Control de Asistencia</CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  Terminal interactivo tipo Kiosco para registro y verificación en portería con
                  reportes de puntualidad.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link
                  href="/access-control/kiosk"
                  className="text-primary inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
                >
                  <span>Abrir Terminal Kiosco</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
                </Link>
              </CardContent>
            </Card>

            {/* Card 3: Familias y Comunidad */}
            <Card className="border-border/80 hover:border-primary/40 flex flex-col justify-between transition-all hover:shadow-md">
              <CardHeader className="space-y-3 pb-4">
                <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl">
                  <HugeiconsIcon icon={UserGroupIcon} className="size-6" />
                </div>
                <CardTitle className="text-lg font-bold">Comunidad y Familias</CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  Acceso a libretas de notas, historial de asistencia, justificaciones y comunicados
                  de la institución.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link
                  href="/login"
                  className="text-primary inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
                >
                  <span>Portal Familiar</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
                </Link>
              </CardContent>
            </Card>

            {/* Card 4: Administración & Matrícula */}
            <Card className="border-border/80 hover:border-primary/40 flex flex-col justify-between transition-all hover:shadow-md">
              <CardHeader className="space-y-3 pb-4">
                <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl">
                  <HugeiconsIcon icon={School01Icon} className="size-6" />
                </div>
                <CardTitle className="text-lg font-bold">Dirección y Matrícula</CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  Configuración de períodos académicos, grados, secciones, nóminas de matrícula y
                  reportes oficiales.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link
                  href="/login"
                  className="text-primary inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
                >
                  <span>Módulo Directivo</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. SECCIÓN DE VALORES Y PROPÓSITO INSTITUCIONAL */}
      <section
        id="caracteristicas"
        className="border-border bg-muted/30 relative overflow-hidden border-y py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <Badge
                variant="outline"
                className="border-primary/30 bg-primary/5 text-primary text-xs font-semibold"
              >
                Identidad Institucional
              </Badge>
              <h2 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl">
                Diseñado para la Gestión Educativa Moderna
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                El SGA centraliza toda la información de la institución educativa en una
                arquitectura moderna y confiable, facilitando la toma de decisiones basada en datos
                y liberando tiempo administrativo para el aprendizaje.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="bg-primary/15 text-primary mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-foreground text-sm font-semibold">
                      Seguridad y Control de Acceso Riguroso
                    </h3>
                    <p className="text-muted-foreground text-xs">
                      Autenticación con sesiones cifradas y permisos estrictos por rol funcional.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="bg-primary/15 text-primary mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-foreground text-sm font-semibold">
                      Exportación de Datos Oficiales en un Clic
                    </h3>
                    <p className="text-muted-foreground text-xs">
                      Generación de nóminas, actas y consolidados en formato Excel y PDF.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="bg-primary/15 text-primary mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-foreground text-sm font-semibold">
                      Auditoría y Trazabilidad Completa
                    </h3>
                    <p className="text-muted-foreground text-xs">
                      Registro de todas las operaciones realizadas para garantizar la transparencia.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mensaje Motivacional */}
            <div className="flex justify-center">
              <div className="from-primary to-primary-700 text-primary-foreground relative w-full max-w-md overflow-hidden rounded-3xl bg-linear-to-br p-8 shadow-2xl">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 size-40 rounded-full bg-white/10 blur-2xl" />

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-xs">
                    <HugeiconsIcon icon={Award01Icon} className="size-7 text-white" />
                  </div>

                  <blockquote className="mb-4 text-base leading-relaxed text-white/95 italic">
                    &ldquo;La educación es el arma más poderosa que puedes usar para cambiar el
                    mundo.&rdquo;
                  </blockquote>

                  <p className="text-xs font-semibold tracking-wider text-white/80 uppercase">
                    — Nelson Mandela
                  </p>

                  <div className="mt-8 w-full border-t border-white/20 pt-6">
                    <div className="flex items-center justify-between text-xs text-white/90">
                      <span>Plataforma SGA</span>
                      <span className="font-semibold">Año Académico 2026</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION FINAL */}
      <section className="bg-background py-16 text-center sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="border-primary/20 from-primary/10 via-primary/5 rounded-3xl border bg-linear-to-b to-transparent p-8 shadow-sm sm:p-12">
            <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
              ¿Listo para ingresar al sistema?
            </h2>
            <p className="text-muted-foreground mx-auto mt-3 max-w-xl text-sm leading-relaxed">
              Utiliza tus credenciales institucionales para acceder a tu panel de control, o
              consulta la terminal de marcado escolar.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="w-full gap-2 font-semibold shadow-sm sm:w-auto">
                <Link href="/login">
                  <HugeiconsIcon icon={LogInIcon} className="size-5" />
                  <span>Iniciar Sesión en SGA</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full gap-2 sm:w-auto">
                <Link href="/access-control/kiosk">
                  <HugeiconsIcon icon={Time02Icon} className="text-primary size-5" />
                  <span>Ir al Marcado Kiosco</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
