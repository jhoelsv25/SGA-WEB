import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Award01Icon,
  DatabaseIcon,
  LockIcon,
  Shield01Icon,
  SmartPhone01Icon,
  Time02Icon,
} from "@hugeicons/core-free-icons";

interface ServicioItem {
  numero: string;
  icono: IconSvgElement;
  titulo: string;
  detalle: string;
}

const SERVICIOS: ServicioItem[] = [
  {
    numero: "01",
    icono: Time02Icon,
    titulo: "Marcación en equipos autorizados",
    detalle:
      "La asistencia se registra en kioskos habilitados por Soporte TI dentro del colegio, con cálculo automático de tardanzas según turno y compatibilidad con lector biométrico.",
  },
  {
    numero: "02",
    icono: Award01Icon,
    titulo: "Libretas oficiales del SIAGIE",
    detalle:
      "Las boletas oficiales se publican en PDF para descarga directa de estudiantes y apoderados al cierre de cada bimestre.",
  },
  {
    numero: "03",
    icono: LockIcon,
    titulo: "Acceso estricto por rol",
    detalle:
      "Cada cuenta ve únicamente las herramientas de su perfil y bloquea el acceso ante intentos fallidos repetidos.",
  },
  {
    numero: "04",
    icono: DatabaseIcon,
    titulo: "Trazabilidad y auditoría",
    detalle:
      "Cada cambio relevante en notas, asistencias o matrículas queda registrado con usuario, fecha y detalle.",
  },
  {
    numero: "05",
    icono: SmartPhone01Icon,
    titulo: "Listo para cualquier pantalla",
    detalle:
      "Docentes y familias acceden desde celular, tablet o computadora sin instalar aplicaciones adicionales.",
  },
  {
    numero: "06",
    icono: Shield01Icon,
    titulo: "Protección de datos (Ley N.° 29733)",
    detalle:
      "Toda la información de estudiantes, docentes y apoderados se resguarda conforme a la normativa vigente.",
  },
];

export function FeaturesSection() {
  return (
    <section id="caracteristicas" className="border-border bg-muted/25 border-y py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Columna editorial fija */}
          <div className="lg:col-span-4">
            <Badge
              variant="outline"
              className="border-primary/30 bg-primary/5 text-primary text-xs"
            >
              Servicios del colegio
            </Badge>
            <h2 className="text-foreground mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Pensado para la jornada escolar diaria
            </h2>
            <p className="text-muted-foreground mt-4 text-base leading-relaxed">
              {siteConfig.acronym} conecta portería, aula, dirección y familias sin procesos
              complicados ni pantallas recargadas.
            </p>
            <div className="border-primary/40 mt-8 border-l-2 pl-4">
              <p className="text-foreground text-sm font-semibold">
                {siteConfig.institution.shortName}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                {siteConfig.institution.administration.ugel} ·{" "}
                {siteConfig.institution.administration.dre}
              </p>
            </div>
          </div>

          {/* Lista limpia sin cards ni bordes cerrados */}
          <div className="divide-border/70 grid grid-cols-1 divide-y sm:grid-cols-2 sm:gap-x-10 sm:divide-y-0 lg:col-span-8">
            {SERVICIOS.map((item) => (
              <div
                key={item.numero}
                className="border-border/70 flex gap-4 py-6 sm:border-t sm:first:border-t-0 sm:nth-2:border-t-0"
              >
                <div className="flex flex-col items-center gap-2 pt-0.5">
                  <span className="text-primary/60 font-mono text-xs font-bold">{item.numero}</span>
                  <span className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-xl">
                    <HugeiconsIcon icon={item.icono} className="size-4.5" />
                  </span>
                </div>
                <div>
                  <h3 className="text-foreground text-base font-bold">{item.titulo}</h3>
                  <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                    {item.detalle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
