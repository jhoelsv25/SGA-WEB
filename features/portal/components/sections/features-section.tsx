import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon, Award01Icon } from "@hugeicons/core-free-icons";

export function FeaturesSection() {
  return (
    <section
      id="caracteristicas"
      className="border-border bg-muted/30 relative overflow-hidden border-y py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <Badge
              variant="outline"
              className="border-primary/30 bg-primary/5 text-primary text-xs font-semibold"
            >
              Identidad Institucional
            </Badge>
            <h2 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl">
              Diseñado para la Gestión Educativa Moderna
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              El {siteConfig.acronym} centraliza toda la información de la institución educativa en
              una arquitectura moderna, confiable y auditable, facilitando la toma de decisiones
              basada en datos y liberando tiempo administrativo para el aprendizaje.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="bg-primary/15 text-primary mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4" />
                </div>
                <div>
                  <h3 className="text-foreground text-sm font-semibold">
                    Seguridad y Control de Acceso Riguroso
                  </h3>
                  <p className="text-muted-foreground text-xs">
                    Autenticación con sesiones cifradas y permisos estrictos por rol funcional
                    (Administrador, Director, Secretaria, Docente, Estudiante y Apoderado).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="bg-primary/15 text-primary mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4" />
                </div>
                <div>
                  <h3 className="text-foreground text-sm font-semibold">
                    Exportación de Datos Oficiales en un Clic
                  </h3>
                  <p className="text-muted-foreground text-xs">
                    Generación de nóminas, actas consolidadas y estadísticas en formato Excel y PDF
                    alineadas con SIAGIE.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="bg-primary/15 text-primary mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4" />
                </div>
                <div>
                  <h3 className="text-foreground text-sm font-semibold">
                    Auditoría y Trazabilidad Completa
                  </h3>
                  <p className="text-muted-foreground text-xs">
                    Bitácora inmutable de todas las operaciones realizadas para garantizar la máxima
                    transparencia institucional.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta de Lema Institucional */}
          <div className="flex justify-center">
            <div className="from-primary to-primary-700 text-primary-foreground relative w-full max-w-md overflow-hidden rounded-3xl bg-linear-to-br p-8 shadow-2xl">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 size-40 rounded-full bg-white/10 blur-2xl" />

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-xs">
                  <HugeiconsIcon icon={Award01Icon} className="size-7 text-white" />
                </div>

                <blockquote className="mb-4 text-base leading-relaxed text-white/95 italic">
                  &ldquo;{siteConfig.institution.motto}&rdquo;
                </blockquote>

                <p className="text-xs font-semibold tracking-wider text-white/80 uppercase">
                  {siteConfig.institution.name}
                </p>

                <div className="mt-8 w-full border-t border-white/20 pt-6">
                  <div className="flex items-center justify-between text-xs text-white/90">
                    <span>Plataforma {siteConfig.acronym}</span>
                    <span className="font-semibold">
                      {siteConfig.institution.location.reference}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
