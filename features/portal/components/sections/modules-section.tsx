"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config";
import { cn } from "@/lib/utils";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Book02Icon,
  CheckmarkCircle02Icon,
  School01Icon,
  TeacherIcon,
  Time02Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";

interface RolShowcase {
  id: string;
  tab: string;
  icono: IconSvgElement;
  categoria: string;
  titulo: string;
  descripcion: string;
  puntos: string[];
  enlace: { texto: string; href: string };
  vistaTitulo: string;
  vistaSubtitulo: string;
  itemsVista: { titulo: string; estado: string }[];
}

const ROLES_SHOWCASE: RolShowcase[] = [
  {
    id: "docentes",
    tab: "Docentes",
    icono: TeacherIcon,
    categoria: "Plana docente",
    titulo: "Tu jornada de clases y aula virtual en un solo lugar",
    descripcion:
      "Firma el ingreso y salida de tus sesiones, registra el tema desarrollado y comparte materiales de reforzamiento con tus secciones.",
    puntos: [
      "Firma rápida desde kiosko o desde la cabecera de la intranet",
      "Unidades, materiales y tareas de reforzamiento por bimestre",
      "Historial de sesiones y solicitud de justificaciones",
    ],
    enlace: { texto: "Ingresar como docente", href: siteConfig.routes.login },
    vistaTitulo: "Espacio del Docente",
    vistaSubtitulo: "Jornada y cursos asignados",
    itemsVista: [
      { titulo: "08:00–09:30 · Matemática · 3.° A", estado: "En curso" },
      { titulo: "Aula virtual · Unidad II publicada", estado: "Activo" },
      { titulo: "Horario semanal y asistencia propia", estado: "Al día" },
    ],
  },
  {
    id: "familias",
    tab: "Estudiantes y Familias",
    icono: UserGroupIcon,
    categoria: "Comunidad educativa",
    titulo: "Seguimiento cercano del progreso y asistencia escolar",
    descripcion:
      "Estudiantes y apoderados consultan en línea las asistencias diarias, comunicados oficiales del colegio y sus libretas del SIAGIE.",
    puntos: [
      "Control de asistencia y tardanzas en tiempo real",
      "Descarga segura de libretas oficiales del SIAGIE en PDF",
      "Comunicados institucionales y acceso al aula virtual",
    ],
    enlace: { texto: "Ingresar al portal familiar", href: siteConfig.routes.login },
    vistaTitulo: "Portal del Estudiante y Apoderado",
    vistaSubtitulo: "Resumen del año académico",
    itemsVista: [
      { titulo: "Asistencia mensual · Registro diario", estado: "Puntual" },
      { titulo: "Libreta oficial SIAGIE (PDF)", estado: "Disponible" },
      { titulo: "Comunicados de Dirección y Tutoría", estado: "3 nuevos" },
    ],
  },
  {
    id: "direccion",
    tab: "Dirección y Secretaría",
    icono: School01Icon,
    categoria: "Gestión institucional",
    titulo: "Control integral del año académico y supervisión en vivo",
    descripcion:
      "Organiza grados, secciones, horarios y matrículas, monitorea las clases del día y mantén trazabilidad completa en auditoría.",
    puntos: [
      "Configuración del año académico, bimestres y calendario",
      "Panel en vivo de sesiones hoy y ausencias docentes",
      "Bitácora de auditoría y reportes exportables en Excel/PDF",
    ],
    enlace: { texto: "Ingresar a gestión", href: siteConfig.routes.login },
    vistaTitulo: "Panel Directivo",
    vistaSubtitulo: "Supervisión institucional",
    itemsVista: [
      { titulo: "Panel de sesiones en vivo", estado: "Monitoreo" },
      { titulo: "Matrículas, grados y plan de estudios", estado: "Configurado" },
      { titulo: "Bitácora de auditoría del sistema", estado: "Trazable" },
    ],
  },
  {
    id: "kiosko",
    tab: "Asistencia en Portería",
    icono: Time02Icon,
    categoria: "Control presencial",
    titulo: "Registro ágil y seguro en equipos del colegio",
    descripcion:
      "Puntos de control en portería o sala docente para registrar ingresos y salidas con código personal o lector.",
    puntos: [
      "Operación exclusiva en equipos autorizados por Soporte TI",
      "Cálculo automático de tardanzas según turno y tolerancia",
      "Soporte para código personal, PIN y lector biométrico",
    ],
    enlace: { texto: "Abrir registro de asistencia", href: siteConfig.routes.kiosk },
    vistaTitulo: "Terminal de Asistencia",
    vistaSubtitulo: "Control presencial",
    itemsVista: [
      { titulo: "Marcación de ingreso / salida", estado: "Tiempo real" },
      { titulo: "Firma de sesiones de clase", estado: "Código + PIN" },
      { titulo: "Validación por token de equipo", estado: "Seguro" },
    ],
  },
];

export function ModulesSection() {
  const [activoId, setActivoId] = React.useState<string>(ROLES_SHOWCASE[0].id);
  const activo = ROLES_SHOWCASE.find((r) => r.id === activoId) ?? ROLES_SHOWCASE[0];

  return (
    <section id="modulos" className="bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary text-xs">
            Comunidad educativa
          </Badge>
          <h2 className="text-foreground mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Una intranet adaptada a cada miembro del colegio
          </h2>
          <p className="text-muted-foreground mt-4 text-base leading-relaxed">
            Selecciona un perfil para explorar qué herramientas encuentra al ingresar al sistema.
          </p>
        </div>

        {/* Selector de pestañas por rol */}
        <div
          role="tablist"
          aria-label="Perfiles del sistema"
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
        >
          {ROLES_SHOWCASE.map((rol) => {
            const seleccionado = rol.id === activo.id;
            return (
              <button
                key={rol.id}
                type="button"
                role="tab"
                aria-selected={seleccionado}
                onClick={() => setActivoId(rol.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all",
                  seleccionado
                    ? "border-primary bg-primary text-primary-foreground shadow-primary/20 shadow-md"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                <HugeiconsIcon icon={rol.icono} className="size-4" />
                <span>{rol.tab}</span>
              </button>
            );
          })}
        </div>

        {/* Showcase abierto del rol seleccionado (sin envoltorio de card gigante) */}
        <div className="border-border/70 mt-10 grid grid-cols-1 items-center gap-10 border-t pt-10 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-6">
            <span className="text-primary inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
              <HugeiconsIcon icon={activo.icono} className="size-4" />
              {activo.categoria}
            </span>
            <h3 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl">
              {activo.titulo}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
              {activo.descripcion}
            </p>
            <ul className="space-y-2.5 pt-1 text-sm">
              {activo.puntos.map((punto) => (
                <li key={punto} className="text-foreground flex items-start gap-2.5">
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    className="text-primary mt-0.5 size-4.5 shrink-0"
                  />
                  <span>{punto}</span>
                </li>
              ))}
            </ul>
            <div className="pt-2">
              <Button asChild className="gap-2 rounded-full px-6">
                <Link href={activo.enlace.href}>
                  <span>{activo.enlace.texto}</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Vista previa estilizada del rol */}
          <div className="lg:col-span-6">
            <div className="border-border/70 from-muted/60 via-muted/30 to-background rounded-2xl border bg-linear-to-br p-5 sm:p-6">
              <div className="border-border/60 flex items-center justify-between border-b pb-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-xl">
                    <HugeiconsIcon icon={Book02Icon} className="size-4.5" />
                  </span>
                  <div>
                    <p className="text-foreground text-sm font-bold">{activo.vistaTitulo}</p>
                    <p className="text-muted-foreground text-xs">{activo.vistaSubtitulo}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-[11px]">
                  {activo.tab}
                </Badge>
              </div>

              <div className="mt-4 space-y-2.5">
                {activo.itemsVista.map((item) => (
                  <div
                    key={item.titulo}
                    className="border-border/60 bg-card flex items-center justify-between gap-3 rounded-xl border px-4 py-3 shadow-2xs"
                  >
                    <span className="text-foreground text-sm font-medium">{item.titulo}</span>
                    <Badge
                      variant="outline"
                      className="border-primary/30 bg-primary/5 text-primary shrink-0 text-[11px]"
                    >
                      {item.estado}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
