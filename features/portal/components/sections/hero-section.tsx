import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config";
import { HeroCarrusel } from "./hero-carrusel";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Award01Icon,
  Book02Icon,
  LogInIcon,
  TeacherIcon,
  Time02Icon,
} from "@hugeicons/core-free-icons";

interface AccesoRapido {
  titulo: string;
  detalle: string;
  icono: IconSvgElement;
  href: string;
}

const ACCESOS: AccesoRapido[] = [
  {
    titulo: "Sesiones de clase",
    detalle: "Firma de ingreso, tema del día y seguimiento docente",
    icono: TeacherIcon,
    href: siteConfig.routes.login,
  },
  {
    titulo: "Asistencia",
    detalle: "Marcación en kiosko y tardanzas automáticas",
    icono: Time02Icon,
    href: siteConfig.routes.kiosk,
  },
  {
    titulo: "Aula virtual",
    detalle: "Materiales y tareas por bimestre",
    icono: Book02Icon,
    href: siteConfig.routes.login,
  },
  {
    titulo: "Libretas SIAGIE",
    detalle: "Descarga en PDF para estudiantes y apoderados",
    icono: Award01Icon,
    href: siteConfig.routes.login,
  },
];

export function HeroSection() {
  return (
    <section className="bg-background -mt-17">
      <div className="bg-primary relative isolate overflow-hidden text-white">
        <HeroCarrusel />
        <div className="animate-in fade-in slide-in-from-bottom-6 relative z-10 mx-auto flex min-h-136 max-w-7xl flex-col justify-center px-4 pt-32 pb-36 duration-1000 sm:px-6 lg:min-h-160 lg:px-8">
          <p className="flex items-center gap-3 text-xs font-bold tracking-[0.2em] text-white/85 uppercase">
            <span className="h-px w-10 bg-white/70" />
            {siteConfig.institution.shortName} · {siteConfig.institution.location.reference}
          </p>
          <h1 className="mt-6 max-w-3xl text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl lg:leading-[1.02]">
            Aprender, enseñar y crecer juntos
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">
            Intranet de la <strong>{siteConfig.institution.name}</strong>: asistencia, clases, aula
            virtual y libretas para docentes, estudiantes y apoderados.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 gap-2 rounded-lg px-7 font-semibold">
              <Link href={siteConfig.routes.login}>
                <HugeiconsIcon icon={LogInIcon} className="size-5" />
                <span>Ingresar a la intranet</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 gap-2 rounded-lg border-white/40 bg-white/10 px-6 font-medium text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
            >
              <Link href={siteConfig.routes.kiosk}>
                <HugeiconsIcon icon={Time02Icon} className="size-5" />
                <span>Registro de asistencia</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="h-12 gap-2 rounded-lg px-5 font-medium text-white hover:bg-white/15 hover:text-white"
            >
              <a href={siteConfig.institution.website} target="_blank" rel="noopener noreferrer">
                <span>Sitio web del colegio</span>
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Franja de accesos rápidos, montada sobre el borde de la imagen */}
      <nav
        aria-label="Accesos rápidos"
        className="animate-in fade-in slide-in-from-bottom-8 relative z-20 mx-auto -mt-16 max-w-7xl px-4 delay-300 duration-1000 sm:px-6 lg:px-8"
      >
        <ul className="bg-card border-border divide-border grid grid-cols-1 divide-y overflow-hidden rounded-xl border shadow-xl sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {ACCESOS.map((item) => (
            <li key={item.titulo}>
              <Link
                href={item.href}
                className="group hover:bg-primary/5 flex h-full items-center gap-4 p-6 transition-colors"
              >
                <span className="bg-primary/10 text-primary flex size-12 shrink-0 items-center justify-center rounded-full">
                  <HugeiconsIcon icon={item.icono} className="size-6" aria-hidden="true" />
                </span>
                <span className="flex-1">
                  <span className="text-foreground block text-base font-bold">{item.titulo}</span>
                  <span className="text-muted-foreground block text-sm leading-snug">
                    {item.detalle}
                  </span>
                </span>
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className="text-muted-foreground group-hover:text-primary size-5 shrink-0 transition-transform group-hover:translate-x-1"
                />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="h-16 sm:h-20" />
    </section>
  );
}
