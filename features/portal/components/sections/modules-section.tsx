import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Book02Icon,
  Time02Icon,
  UserGroupIcon,
  School01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

export function ModulesSection() {
  return (
    <section id="modulos" className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-primary text-xs font-bold tracking-widest uppercase">
            Ecosistema Integrado
          </h2>
          <p className="text-foreground mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Módulos y Servicios del {siteConfig.acronym}
          </p>
          <p className="text-muted-foreground mt-3 text-sm">
            Cada perfil cuenta con herramientas dedicadas para una gestión escolar eficiente y
            transparente en la {siteConfig.institution.shortName}.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Gestión Pedagógica */}
          <Card className="flex flex-col justify-between shadow-sm transition-all hover:shadow-lg">
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
                href={siteConfig.routes.login}
                className="text-primary inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
              >
                <span>Acceso Docente</span>
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
              </Link>
            </CardContent>
          </Card>

          {/* Card 2: Control de Asistencia & Kiosco */}
          <Card className="flex flex-col justify-between shadow-sm transition-all hover:shadow-lg">
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
          <Card className="flex flex-col justify-between shadow-sm transition-all hover:shadow-lg">
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
                href={siteConfig.routes.login}
                className="text-primary inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
              >
                <span>Portal Familiar</span>
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
              </Link>
            </CardContent>
          </Card>

          {/* Card 4: Administración & Matrícula */}
          <Card className="flex flex-col justify-between shadow-sm transition-all hover:shadow-lg">
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
                href={siteConfig.routes.login}
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
  );
}
