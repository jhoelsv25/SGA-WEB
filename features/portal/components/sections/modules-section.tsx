"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config";
import { cn } from "@/lib/utils";
import { Revelar } from "../interactivo";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  ArrowRight01Icon,
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
    <section
      id="modulos"
      className="from-primary/8 via-primary/4 to-background relative isolate overflow-hidden bg-linear-to-b py-20 sm:py-28"
    >
      <div
        aria-hidden="true"
        className="bg-primary/10 pointer-events-none absolute -top-32 -left-32 -z-10 size-[28rem] rounded-full blur-3xl"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Revelar className="mx-auto max-w-3xl text-center">
          <p className="text-primary inline-flex items-center gap-3 text-xs font-bold tracking-[0.2em] uppercase">
            <span className="bg-primary h-px w-8" />
            Comunidad educativa
            <span className="bg-primary h-px w-8" />
          </p>
          <h2 className="text-foreground mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:leading-[1.05]">
            Una intranet adaptada a cada miembro del colegio
          </h2>
          <p className="text-muted-foreground mt-4 text-base leading-relaxed">
            Elige un rol para ver qué herramientas encuentra al ingresar.
          </p>
        </Revelar>

        <div
          role="tablist"
          aria-label="Roles del sistema"
          className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-2 sm:grid-cols-4"
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
                  "flex flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-center text-sm font-semibold transition-all",
                  seleccionado
                    ? "border-primary from-primary shadow-primary/30 -translate-y-0.5 bg-linear-to-br to-[#2a0714] text-white shadow-lg"
                    : "border-border bg-background/70 text-muted-foreground hover:border-primary/40 hover:text-foreground hover:-translate-y-0.5",
                )}
              >
                <HugeiconsIcon icon={rol.icono} className="size-6" />
                <span>{rol.tab}</span>
              </button>
            );
          })}
        </div>

        <div
          key={activo.id}
          className="animate-in fade-in slide-in-from-bottom-4 mt-12 grid grid-cols-1 items-center gap-10 duration-500 lg:grid-cols-12 lg:gap-14"
        >
          <div className="space-y-5 lg:col-span-6">
            <span className="text-primary inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
              <HugeiconsIcon icon={activo.icono} className="size-4" />
              {activo.categoria}
            </span>
            <h3 className="text-foreground text-3xl font-black tracking-tight sm:text-4xl">
              {activo.titulo}
            </h3>
            <p className="text-muted-foreground text-base leading-relaxed">{activo.descripcion}</p>
            <ul className="space-y-3 pt-1">
              {activo.puntos.map((punto) => (
                <li key={punto} className="text-foreground flex items-start gap-3 text-base">
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    className="text-primary mt-0.5 size-5 shrink-0"
                  />
                  <span>{punto}</span>
                </li>
              ))}
            </ul>
            <div className="pt-3">
              <Button asChild size="lg" className="h-12 gap-2 rounded-lg px-7 font-semibold">
                <Link href={activo.enlace.href}>
                  <span>{activo.enlace.texto}</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Vista previa estilo ventana de la aplicación */}
          <div className="lg:col-span-6">
            <div className="border-border bg-card overflow-hidden rounded-2xl border shadow-2xl">
              <div className="from-primary flex items-center gap-2 bg-linear-to-r to-[#2a0714] px-4 py-3">
                <span className="size-3 rounded-full bg-white/40" />
                <span className="size-3 rounded-full bg-white/40" />
                <span className="size-3 rounded-full bg-white/40" />
                <span className="ml-3 truncate text-xs font-semibold text-white/85">
                  {siteConfig.acronym} · {activo.vistaTitulo}
                </span>
              </div>
              <div className="p-6 sm:p-8">
                <p className="text-foreground text-lg font-black">{activo.vistaTitulo}</p>
                <p className="text-muted-foreground text-sm">{activo.vistaSubtitulo}</p>
                <ul className="mt-5 space-y-3">
                  {activo.itemsVista.map((item) => (
                    <li
                      key={item.titulo}
                      className="bg-muted/60 hover:bg-primary/8 flex items-center justify-between gap-3 rounded-xl px-4 py-4 transition-colors"
                    >
                      <span className="text-foreground text-sm font-medium">{item.titulo}</span>
                      <span className="bg-primary/10 text-primary shrink-0 rounded-full px-3 py-1 text-xs font-bold">
                        {item.estado}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
