import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Award01Icon,
  Book02Icon,
  LogInIcon,
  TeacherIcon,
  Time02Icon,
} from "@hugeicons/core-free-icons";

const ACCESOS_RAPIDOS = [
  { label: "Docentes", href: "/#modulos" },
  { label: "Estudiantes", href: "/#modulos" },
  { label: "Apoderados", href: "/#modulos" },
  { label: "Dirección", href: "/#modulos" },
];

const SERVICIOS_PORTADA = [
  {
    titulo: "Sesiones de clase",
    detalle: "Firma de ingreso, tema del día y seguimiento docente.",
    icono: TeacherIcon,
  },
  {
    titulo: "Control de asistencia",
    detalle: "Marcación en kiosko con cálculo automático de tardanzas.",
    icono: Time02Icon,
  },
  { titulo: "Aula virtual", detalle: "Materiales y tareas por bimestre.", icono: Book02Icon },
  { titulo: "Libretas SIAGIE", detalle: "Descarga segura para familias.", icono: Award01Icon },
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

          {/* Columna de servicios: lista abierta, sin tarjetas */}
          <ul className="divide-border border-border divide-y border-y lg:col-span-5 lg:col-start-8">
            {SERVICIOS_PORTADA.map((item) => (
              <li key={item.titulo} className="flex items-start gap-4 py-5">
                <HugeiconsIcon
                  icon={item.icono}
                  className="text-primary mt-0.5 size-6 shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-foreground text-base font-bold">{item.titulo}</p>
                  <p className="text-muted-foreground mt-0.5 text-sm">{item.detalle}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
