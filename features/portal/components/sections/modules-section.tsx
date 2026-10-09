import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Book02Icon,
  Time02Icon,
  UserGroupIcon,
  School01Icon,
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";

interface Modulo {
  icono: IconSvgElement;
  categoria: string;
  titulo: string;
  descripcion: string;
  puntos: string[];
  enlace: { texto: string; href: string };
}

const MODULOS: Modulo[] = [
  {
    icono: School01Icon,
    categoria: "Gestión institucional",
    titulo: "Dirección y Secretaría",
    descripcion:
      "Organización del año académico, grados, cursos, plan de estudios, matrícula y libretas.",
    puntos: [
      "Año académico con sus cuatro bimestres",
      "Libretas del SIAGIE en PDF por estudiante",
      "Bitácora de auditoría de cambios",
    ],
    enlace: { texto: "Iniciar sesión", href: siteConfig.routes.login },
  },
  {
    icono: Book02Icon,
    categoria: "Plana docente",
    titulo: "Docentes",
    descripcion:
      "Registro de las sesiones de clase y aula virtual de reforzamiento para sus cursos.",
    puntos: [
      "Firma de ingreso y salida de la sesión",
      "Unidades, materiales y tareas de reforzamiento",
      "Seguimiento por la subdirección",
    ],
    enlace: { texto: "Iniciar sesión", href: siteConfig.routes.login },
  },
  {
    icono: Time02Icon,
    categoria: "Control en portería",
    titulo: "Kiosko de marcación",
    descripcion:
      "Marcación de ingreso y salida en equipos autorizados del colegio, con código personal.",
    puntos: [
      "Solo en equipos autorizados",
      "Tardanzas según el turno y su tolerancia",
      "Preparado para lector biométrico",
    ],
    enlace: { texto: "Abrir el kiosko", href: siteConfig.routes.kiosk },
  },
  {
    icono: UserGroupIcon,
    categoria: "Comunidad educativa",
    titulo: "Estudiantes y apoderados",
    descripcion: "Consulta de asistencia, libretas, comunicados y aula virtual.",
    puntos: [
      "Asistencia propia o de sus hijos",
      "Libretas del SIAGIE descargables",
      "Comunicados del colegio",
    ],
    enlace: { texto: "Iniciar sesión", href: siteConfig.routes.login },
  },
];

export function ModulesSection() {
  return (
    <section id="modulos" className="bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary text-xs">
            Módulos
          </Badge>
          <h2 className="text-foreground mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Una opción para cada rol del colegio
          </h2>
          <p className="text-muted-foreground mt-4 text-base leading-relaxed">
            Cada persona entra con su rol y ve solo las opciones que le corresponden.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {MODULOS.map((modulo) => (
            <Card
              key={modulo.titulo}
              className="border-border/80 bg-card flex flex-col justify-between rounded-2xl shadow-sm"
            >
              <CardHeader className="space-y-4 pb-4">
                <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-2xl">
                  <HugeiconsIcon icon={modulo.icono} className="size-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-primary text-xs font-semibold">{modulo.categoria}</span>
                  <CardTitle className="text-xl font-bold">{modulo.titulo}</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  {modulo.descripcion}
                </CardDescription>
                <ul className="space-y-2 border-t pt-3 text-sm">
                  {modulo.puntos.map((punto) => (
                    <li key={punto} className="text-muted-foreground flex items-start gap-2">
                      <HugeiconsIcon
                        icon={CheckmarkCircle02Icon}
                        className="text-primary mt-0.5 size-4 shrink-0"
                      />
                      <span>{punto}</span>
                    </li>
                  ))}
                </ul>
              </CardHeader>

              <CardContent className="pt-2">
                <Link
                  href={modulo.enlace.href}
                  className="text-primary inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold hover:underline"
                >
                  <span>{modulo.enlace.texto}</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
