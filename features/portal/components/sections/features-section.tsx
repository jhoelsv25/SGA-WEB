import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Shield01Icon,
  Analytics01Icon,
  Time02Icon,
  Award01Icon,
  DatabaseIcon,
  LockIcon,
  FileCheckIcon,
} from "@hugeicons/core-free-icons";

export function FeaturesSection() {
  return (
    <section
      id="caracteristicas"
      className="border-border bg-muted/30 relative overflow-hidden border-y py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge
            variant="outline"
            className="border-primary/30 bg-primary/5 text-primary text-xs font-semibold"
          >
            Ventajas Competitivas
          </Badge>
          <h2 className="text-foreground mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            ¿Por qué la {siteConfig.institution.shortName} confía en el {siteConfig.acronym}?
          </h2>
          <p className="text-muted-foreground mt-4 text-base leading-relaxed">
            Una plataforma robusta, auditada y diseñada con estándares modernos de ingeniería de
            software para responder a las exigencias normativas del Ministerio de Educación.
          </p>
        </div>

        {/* Grid de 6 Ventajas Contundentes */}
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* 1. Cumplimiento SIAGIE & MINEDU */}
          <div className="bg-card border-border/80 rounded-2xl border p-6 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="bg-primary/10 text-primary mb-4 flex size-11 items-center justify-center rounded-xl">
              <HugeiconsIcon icon={FileCheckIcon} className="size-6" />
            </div>
            <h3 className="text-foreground text-lg font-bold">100% Alineado a Normativa SIAGIE</h3>
            <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
              Exportación instantánea de nóminas de matrícula y actas finales en formato Excel
              oficial, eliminando semanas de digitación manual y errores de inconsistencia.
            </p>
          </div>

          {/* 2. Marcación Ininterrumpida en Kiosco */}
          <div className="bg-card border-border/80 rounded-2xl border p-6 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="bg-primary/10 text-primary mb-4 flex size-11 items-center justify-center rounded-xl">
              <HugeiconsIcon icon={Time02Icon} className="size-6" />
            </div>
            <h3 className="text-foreground text-lg font-bold">Terminal Kiosco en Portería</h3>
            <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
              Registro biométrico o por código de barras de más de 1,200 estudiantes en minutos.
              Detección automática de tardanzas según el horario y tolerancia institucional.
            </p>
          </div>

          {/* 3. Trazabilidad y Auditoría RF-003 */}
          <div className="bg-card border-border/80 rounded-2xl border p-6 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="bg-primary/10 text-primary mb-4 flex size-11 items-center justify-center rounded-xl">
              <HugeiconsIcon icon={DatabaseIcon} className="size-6" />
            </div>
            <h3 className="text-foreground text-lg font-bold">Bitácora de Auditoría Inmutable</h3>
            <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
              Cada calificación registrada, justificación ingresada o acceso al sistema queda
              sellado criptográficamente con usuario, IP y fecha para total transparencia ante la
              UGEL.
            </p>
          </div>

          {/* 4. Seguridad de Grado Bancario */}
          <div className="bg-card border-border/80 rounded-2xl border p-6 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="bg-primary/10 text-primary mb-4 flex size-11 items-center justify-center rounded-xl">
              <HugeiconsIcon icon={LockIcon} className="size-6" />
            </div>
            <h3 className="text-foreground text-lg font-bold">Cifrado y Bloqueo Antifraude</h3>
            <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
              Contraseñas con hash bcrypt, cookies blindadas contra ataques CSRF/XSS y bloqueo
              preventivo de cuentas tras 5 intentos fallidos (RF-001) para resguardar la identidad.
            </p>
          </div>

          {/* 5. Alertas Tempranas de Deserción */}
          <div className="bg-card border-border/80 rounded-2xl border p-6 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="bg-primary/10 text-primary mb-4 flex size-11 items-center justify-center rounded-xl">
              <HugeiconsIcon icon={Analytics01Icon} className="size-6" />
            </div>
            <h3 className="text-foreground text-lg font-bold">Monitoreo Preventivo de Tutoría</h3>
            <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
              Reportes automatizados que alertan a tutores y directivos ante patrones de ausentismo
              o bajo rendimiento escolar antes del cierre del período bimestral.
            </p>
          </div>

          {/* 6. Cumplimiento de Ley N° 29733 */}
          <div className="bg-card border-border/80 rounded-2xl border p-6 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="bg-primary/10 text-primary mb-4 flex size-11 items-center justify-center rounded-xl">
              <HugeiconsIcon icon={Shield01Icon} className="size-6" />
            </div>
            <h3 className="text-foreground text-lg font-bold">Protección de Datos de Menores</h3>
            <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
              Políticas de privacidad y gestión de datos sensibles en estricto cumplimiento de la
              Ley de Protección de Datos Personales del Perú. Cero publicidad y cero venta de datos.
            </p>
          </div>
        </div>

        {/* Banner de Identidad Institucional */}
        <div className="from-primary to-primary/80 text-primary-foreground relative mt-16 overflow-hidden rounded-3xl bg-linear-to-r p-8 shadow-2xl sm:p-12">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 size-60 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold tracking-wider uppercase backdrop-blur-xs">
                <HugeiconsIcon icon={Award01Icon} className="size-3.5 text-white" />
                Misión y Lema Institucional
              </span>
              <h3 className="text-2xl font-extrabold text-white sm:text-3xl">
                &ldquo;{siteConfig.institution.motto}&rdquo;
              </h3>
              <p className="text-xs text-white/80 sm:text-sm">
                {siteConfig.institution.name} · {siteConfig.institution.location.reference}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-6 border-t border-white/20 pt-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
              <div className="text-center">
                <p className="text-3xl font-extrabold text-white">2026</p>
                <p className="text-[11px] text-white/80">Año Escolar Activo</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-extrabold text-white">Secundaria</p>
                <p className="text-[11px] text-white/80">Nivel Educativo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
