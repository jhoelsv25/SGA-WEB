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
  UserGroupIcon,
  TeacherIcon,
  Book02Icon,
  Calendar03Icon,
} from "@hugeicons/core-free-icons";

const AREAS = [
  { icono: Time02Icon, titulo: "Asistencia", detalle: "Marcación en equipos autorizados" },
  { icono: TeacherIcon, titulo: "Seguimiento docente", detalle: "Sesiones de clase y supervisión" },
  { icono: Book02Icon, titulo: "Aula virtual", detalle: "Reforzamiento por curso" },
  { icono: Calendar03Icon, titulo: "Año académico", detalle: "Bimestres y calendario" },
];

export function HeroSection() {
  return (
    <section className="border-border from-background via-muted/30 to-background relative overflow-hidden border-b bg-linear-to-b py-16 sm:py-24 lg:py-28">
      <div className="bg-primary/10 pointer-events-none absolute -top-32 left-1/2 -z-10 h-125 w-125 -translate-x-1/2 rounded-full blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left">
            <Badge
              variant="outline"
              className="border-primary/30 bg-primary/10 text-primary mb-4 px-3.5 py-1 text-xs font-semibold"
            >
              {siteConfig.institution.badge} · Secundaria
            </Badge>

            <h1 className="text-foreground text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.12]">
              Sistema de <span className="text-primary">gestión académica</span> del colegio
            </h1>

            <p className="text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed sm:text-lg">
              Plataforma de la <strong>{siteConfig.institution.name}</strong> para registrar la
              asistencia, acompañar el trabajo docente, organizar el año académico y comunicar a
              estudiantes y familias.
            </p>

            <div className="mt-8 flex w-full flex-col items-center justify-center gap-3.5 sm:flex-row lg:justify-start">
              <Button asChild size="lg" className="h-12 w-full rounded-full px-7 sm:w-auto">
                <Link href={siteConfig.routes.login}>
                  <HugeiconsIcon icon={LogInIcon} className="size-5" />
                  <span>Iniciar sesión</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 w-full rounded-full px-6 font-medium sm:w-auto"
              >
                <Link href={siteConfig.routes.kiosk}>
                  <HugeiconsIcon icon={Time02Icon} className="text-primary size-5" />
                  <span>Kiosko de marcación</span>
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex justify-center lg:col-span-5">
            <div className="border-border/80 bg-card w-full max-w-md rounded-3xl border p-6 shadow-xl">
              <div className="mb-5 flex items-center gap-3.5">
                <div className="bg-card ring-border flex size-14 shrink-0 items-center justify-center rounded-2xl p-1.5 shadow-md ring-1">
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
                    {siteConfig.institution.administration.ugel} ·{" "}
                    {siteConfig.institution.administration.dre}
                  </p>
                </div>
              </div>

              <ul className="space-y-2.5">
                {AREAS.map((area) => (
                  <li
                    key={area.titulo}
                    className="bg-muted/40 border-border/50 flex items-center gap-3 rounded-xl border p-3"
                  >
                    <span className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
                      <HugeiconsIcon icon={area.icono} className="size-4.5" />
                    </span>
                    <span>
                      <span className="text-foreground block text-sm font-semibold">
                        {area.titulo}
                      </span>
                      <span className="text-muted-foreground block text-xs">{area.detalle}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <p className="text-muted-foreground mt-4 flex items-center gap-2 text-xs">
                <HugeiconsIcon icon={UserGroupIcon} className="text-primary size-4" />
                Directivos, docentes, estudiantes y apoderados, cada uno con su rol.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
