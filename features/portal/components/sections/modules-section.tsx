import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Book02Icon,
  Time02Icon,
  UserGroupIcon,
  School01Icon,
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";

export function ModulesSection() {
  return (
    <section id="modulos" className="bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge
            variant="outline"
            className="border-primary/30 bg-primary/5 text-primary text-xs font-semibold"
          >
            Ecosistema Digital Especializado
          </Badge>
          <h2 className="text-foreground mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Soluciones diseñadas a la medida de cada rol escolar
          </h2>
          <p className="text-muted-foreground mt-4 text-base leading-relaxed">
            El {siteConfig.acronym} elimina los cuellos de botella administrativos y conecta de
            manera transparente a directivos, profesores, estudiantes y familias.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Dirección y Secretaría */}
          <Card className="border-border/80 bg-card hover:border-primary/40 flex flex-col justify-between rounded-2xl shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
            <CardHeader className="space-y-4 pb-4">
              <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-2xl shadow-inner">
                <HugeiconsIcon icon={School01Icon} className="size-6" />
              </div>
              <div className="space-y-1">
                <span className="text-primary text-[10px] font-bold tracking-widest uppercase">
                  Gestión Institucional
                </span>
                <CardTitle className="text-xl font-bold">Dirección y Secretaría</CardTitle>
              </div>
              <CardDescription className="text-xs leading-relaxed">
                Centralización integral de períodos académicos, nóminas oficiales SIAGIE, matrícula
                automatizada y emisión de actas consolidadas.
              </CardDescription>

              <div className="space-y-2 border-t pt-3 text-xs">
                <div className="text-muted-foreground flex items-center gap-2">
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    className="text-primary size-3.5 shrink-0"
                  />
                  <span>Reportes en Excel y PDF listos para UGEL</span>
                </div>
                <div className="text-muted-foreground flex items-center gap-2">
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    className="text-primary size-3.5 shrink-0"
                  />
                  <span>Bitácora de auditoría inmutable</span>
                </div>
                <div className="text-muted-foreground flex items-center gap-2">
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    className="text-primary size-3.5 shrink-0"
                  />
                  <span>Control de expedientes y vacantes</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-2">
              <Link
                href={siteConfig.routes.login}
                className="text-primary inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
              >
                <span>Acceder como Directivo</span>
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
              </Link>
            </CardContent>
          </Card>

          {/* Card 2: Docencia y Tutoría */}
          <Card className="border-border/80 bg-card hover:border-primary/40 flex flex-col justify-between rounded-2xl shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
            <CardHeader className="space-y-4 pb-4">
              <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-2xl shadow-inner">
                <HugeiconsIcon icon={Book02Icon} className="size-6" />
              </div>
              <div className="space-y-1">
                <span className="text-primary text-[10px] font-bold tracking-widest uppercase">
                  Plana Pedagógica
                </span>
                <CardTitle className="text-xl font-bold">Docentes y Tutores</CardTitle>
              </div>
              <CardDescription className="text-xs leading-relaxed">
                Cuaderno pedagógico digital, registro por competencias curriculares CNEB (AD, A, B,
                C), asistencia por hora y control de sesiones.
              </CardDescription>

              <div className="space-y-2 border-t pt-3 text-xs">
                <div className="text-muted-foreground flex items-center gap-2">
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    className="text-primary size-3.5 shrink-0"
                  />
                  <span>Evaluación por competencias oficiales</span>
                </div>
                <div className="text-muted-foreground flex items-center gap-2">
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    className="text-primary size-3.5 shrink-0"
                  />
                  <span>Cálculo automático de promedios</span>
                </div>
                <div className="text-muted-foreground flex items-center gap-2">
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    className="text-primary size-3.5 shrink-0"
                  />
                  <span>Detección temprana de ausentismo</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-2">
              <Link
                href={siteConfig.routes.login}
                className="text-primary inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
              >
                <span>Acceso Docente</span>
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
              </Link>
            </CardContent>
          </Card>

          {/* Card 3: Portería y Kiosco */}
          <Card className="border-border/80 bg-card hover:border-primary/40 flex flex-col justify-between rounded-2xl shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
            <CardHeader className="space-y-4 pb-4">
              <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-2xl shadow-inner">
                <HugeiconsIcon icon={Time02Icon} className="size-6" />
              </div>
              <div className="space-y-1">
                <span className="text-primary text-[10px] font-bold tracking-widest uppercase">
                  Control en Portería
                </span>
                <CardTitle className="text-xl font-bold">Terminal Kiosco</CardTitle>
              </div>
              <CardDescription className="text-xs leading-relaxed">
                Marcación de ingreso y salida ultrarrápida mediante lector de código de barras o
                DNI, con pantalla interactiva y tolerancia programada.
              </CardDescription>

              <div className="space-y-2 border-t pt-3 text-xs">
                <div className="text-muted-foreground flex items-center gap-2">
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    className="text-primary size-3.5 shrink-0"
                  />
                  <span>Sin filas: 1 segundo por estudiante</span>
                </div>
                <div className="text-muted-foreground flex items-center gap-2">
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    className="text-primary size-3.5 shrink-0"
                  />
                  <span>Registro automático de tardanzas</span>
                </div>
                <div className="text-muted-foreground flex items-center gap-2">
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    className="text-primary size-3.5 shrink-0"
                  />
                  <span>Verificación fotográfica en pantalla</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-2">
              <Link
                href={siteConfig.routes.kiosk}
                className="text-primary inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
              >
                <span>Abrir Terminal de Portería</span>
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
              </Link>
            </CardContent>
          </Card>

          {/* Card 4: Familias y Comunidad */}
          <Card className="border-border/80 bg-card hover:border-primary/40 flex flex-col justify-between rounded-2xl shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
            <CardHeader className="space-y-4 pb-4">
              <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-2xl shadow-inner">
                <HugeiconsIcon icon={UserGroupIcon} className="size-6" />
              </div>
              <div className="space-y-1">
                <span className="text-primary text-[10px] font-bold tracking-widest uppercase">
                  Comunidad Educativa
                </span>
                <CardTitle className="text-xl font-bold">Familias y Estudiantes</CardTitle>
              </div>
              <CardDescription className="text-xs leading-relaxed">
                Acceso transparente a libretas bimestrales, historial de puntualidad,
                justificaciones de inasistencias y comunicados institucionales.
              </CardDescription>

              <div className="space-y-2 border-t pt-3 text-xs">
                <div className="text-muted-foreground flex items-center gap-2">
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    className="text-primary size-3.5 shrink-0"
                  />
                  <span>Visualización de notas al instante</span>
                </div>
                <div className="text-muted-foreground flex items-center gap-2">
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    className="text-primary size-3.5 shrink-0"
                  />
                  <span>Alerta de hora de entrada a portería</span>
                </div>
                <div className="text-muted-foreground flex items-center gap-2">
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    className="text-primary size-3.5 shrink-0"
                  />
                  <span>Descarga de boletas en PDF</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-2">
              <Link
                href={siteConfig.routes.login}
                className="text-primary inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
              >
                <span>Portal de Familias</span>
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
