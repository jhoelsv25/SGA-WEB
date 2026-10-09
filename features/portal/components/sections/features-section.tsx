import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Shield01Icon,
  Time02Icon,
  Award01Icon,
  DatabaseIcon,
  LockIcon,
  SmartPhone01Icon,
} from "@hugeicons/core-free-icons";

const CARACTERISTICAS: { icono: IconSvgElement; titulo: string; detalle: string }[] = [
  {
    icono: LockIcon,
    titulo: "Acceso por rol",
    detalle:
      "Cada cuenta entra con un rol y ve solo el menú que el administrador le asignó. La cuenta se bloquea tras varios intentos fallidos.",
  },
  {
    icono: Time02Icon,
    titulo: "Marcación en equipos autorizados",
    detalle:
      "La asistencia solo se registra en equipos del colegio que Soporte TI autorizó, sin depender del GPS del celular.",
  },
  {
    icono: DatabaseIcon,
    titulo: "Bitácora de auditoría",
    detalle:
      "Los cambios importantes quedan registrados con el usuario, la fecha y el detalle de lo que cambió.",
  },
  {
    icono: Award01Icon,
    titulo: "Libretas del SIAGIE",
    detalle:
      "La libreta oficial se descarga del SIAGIE en PDF y queda disponible para el estudiante y su apoderado.",
  },
  {
    icono: SmartPhone01Icon,
    titulo: "Pensado para el celular",
    detalle:
      "Docentes y apoderados pueden consultar desde el navegador del celular, también con conexión limitada.",
  },
  {
    icono: Shield01Icon,
    titulo: "Protección de datos",
    detalle:
      "Los datos de estudiantes y familias se tratan conforme a la Ley N.° 29733 de Protección de Datos Personales.",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="caracteristicas"
      className="border-border bg-muted/30 relative overflow-hidden border-y py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary text-xs">
            Características
          </Badge>
          <h2 className="text-foreground mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Cómo funciona el {siteConfig.acronym}
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CARACTERISTICAS.map((item) => (
            <div key={item.titulo} className="bg-card border-border/80 rounded-2xl border p-6">
              <div className="bg-primary/10 text-primary mb-4 flex size-11 items-center justify-center rounded-xl">
                <HugeiconsIcon icon={item.icono} className="size-6" />
              </div>
              <h3 className="text-foreground text-lg font-bold">{item.titulo}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{item.detalle}</p>
            </div>
          ))}
        </div>

        <div className="bg-primary text-primary-foreground relative mt-16 overflow-hidden rounded-3xl p-8 sm:p-12">
          <div className="relative z-10 space-y-2 text-center lg:text-left">
            <span className="bg-primary-foreground/15 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold">
              Lema institucional
            </span>
            <p className="text-2xl font-extrabold sm:text-3xl">
              &ldquo;{siteConfig.institution.motto}&rdquo;
            </p>
            <p className="text-primary-foreground/85 text-sm">
              {siteConfig.institution.name} · {siteConfig.institution.location.reference}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
