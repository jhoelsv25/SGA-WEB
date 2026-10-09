import * as React from "react";
import Link from "next/link";
import { siteConfig } from "@/config";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FileCheckIcon,
  Shield01Icon,
  UserCheck01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

export function TermsContent() {
  return (
    <article className="prose prose-slate dark:prose-invert max-w-none space-y-10">
      {/* Resumen Destacado */}
      <div className="border-primary/20 bg-primary/5 rounded-2xl border p-6 text-sm leading-relaxed">
        <div className="text-primary mb-2 flex items-center gap-2 font-bold">
          <HugeiconsIcon icon={FileCheckIcon} className="size-5 shrink-0" />
          <span>Condiciones de Uso del Entorno Educativo Institucional</span>
        </div>
        <p className="text-muted-foreground m-0">
          El acceso y uso del{" "}
          <strong>
            {siteConfig.name} ({siteConfig.acronym})
          </strong>{" "}
          de la <strong>{siteConfig.institution.name}</strong> está regulado por los presentes
          Términos y Condiciones. Al ingresar a la plataforma, cada usuario (directivo, docente,
          estudiante o apoderado) acepta cumplir con estas disposiciones éticas, técnicas y
          normativas.
        </p>
      </div>

      {/* 1. Naturaleza y Finalidad del Sistema */}
      <section className="space-y-3">
        <h2 className="text-foreground flex items-center gap-2.5 text-xl font-bold tracking-tight">
          <span className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-lg text-xs">
            1
          </span>
          Naturaleza y Finalidad del Servicio
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          El SGA es la herramienta oficial de soporte tecnológico para la gestión pedagógica,
          control de asistencia y seguimiento curricular de la institución educativa. Su propósito
          es brindar transparencia, agilidad y seguridad a los procesos escolares. Su uso se
          restringe exclusivamente a fines académicos y formativos.
        </p>
      </section>

      {/* 2. Cuentas de Acceso, Credenciales y Bloqueo */}
      <section className="space-y-3">
        <h2 className="text-foreground flex items-center gap-2.5 text-xl font-bold tracking-tight">
          <span className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-lg text-xs">
            2
          </span>
          Cuentas, Credenciales y Políticas de Seguridad (RF-001)
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          El acceso a la plataforma está sujeto a las siguientes condiciones de seguridad:
        </p>
        <ul className="text-muted-foreground space-y-1.5 text-sm">
          <li>
            • <strong>Cuenta Personal e Intransferible:</strong> Cada usuario recibe credenciales
            asociadas a su rol. Queda terminantemente prohibido ceder, prestar o divulgar
            contraseñas a terceros.
          </li>
          <li>
            • <strong>Cambio Obligatorio de Contraseña:</strong> Por política de seguridad, las
            cuentas nuevas o restablecidas por el Administrador deben actualizar su clave en el
            primer ingreso antes de operar cualquier módulo.
          </li>
          <li>
            • <strong>Política de Claves Seguras:</strong> Toda contraseña debe tener un mínimo de 8
            caracteres, contener al menos una letra y un número, y ser distinta de la actual.
          </li>
          <li>
            • <strong>Bloqueo por Intentos Fallidos:</strong> Al acumularse 5 intentos fallidos
            consecutivos, la cuenta se bloquea automáticamente para salvaguardar la identidad del
            titular. El desbloqueo requiere solicitud ante la administración.
          </li>
        </ul>
      </section>

      {/* 3. Deberes y Responsabilidades por Perfil */}
      <section className="space-y-4">
        <h2 className="text-foreground flex items-center gap-2.5 text-xl font-bold tracking-tight">
          <span className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-lg text-xs">
            3
          </span>
          Deberes y Compromisos de la Comunidad Educativa
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="bg-card border-border rounded-xl border p-4 text-xs">
            <div className="text-primary mb-2 flex items-center gap-2 font-bold">
              <HugeiconsIcon icon={UserCheck01Icon} className="size-4" />
              <span>Personal Docente y Directivo</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Tienen la responsabilidad ética y administrativa de ingresar oportunamente notas y
              asistencias verídicas, custodiar la confidencialidad de la información y utilizar las
              herramientas de reporte bajo las directivas del MINEDU.
            </p>
          </div>

          <div className="bg-card border-border rounded-xl border p-4 text-xs">
            <div className="text-primary mb-2 flex items-center gap-2 font-bold">
              <HugeiconsIcon icon={Shield01Icon} className="size-4" />
              <span>Estudiantes y Apoderados</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Tienen derecho a consultar información académica actualizada y el deber de respetar la
              propiedad del software, comunicar oportunamente inconsistencias y velar por la
              seguridad de sus dispositivos de acceso.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Auditoría y Trazabilidad Inmutable */}
      <section className="space-y-3">
        <h2 className="text-foreground flex items-center gap-2.5 text-xl font-bold tracking-tight">
          <span className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-lg text-xs">
            4
          </span>
          Auditoría de Operaciones y Bitácora (RF-003)
        </h2>
        <div className="bg-muted/40 rounded-xl p-4 text-xs leading-relaxed">
          <p className="text-muted-foreground m-0">
            Con el fin de garantizar la veracidad y transparencia de las calificaciones, asistencias
            y movimientos escolares, el sistema cuenta con un{" "}
            <strong className="text-foreground">bitácora de auditoría</strong> que registra cada
            inicio de sesión, cambio de notas, justificación y exportación, junto con el usuario
            responsable, dirección IP y marca de tiempo del servidor.
          </p>
        </div>
      </section>

      {/* 5. Uso Prohibido y Sanciones */}
      <section className="space-y-3">
        <h2 className="text-foreground flex items-center gap-2.5 text-xl font-bold tracking-tight">
          <span className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-lg text-xs">
            5
          </span>
          Usos Prohibidos y Sanciones Disciplinarias
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Constituye falta grave sujeta a medidas administrativas y normativas institucionales:
        </p>
        <ul className="text-muted-foreground space-y-1 text-xs">
          <li>• Intentar ingresar con credenciales pertenecientes a otra persona.</li>
          <li>
            • Realizar pruebas de vulnerabilidad, denegación de servicio (DoS) o fuerza bruta.
          </li>
          <li>• Alterar fraudulentamente registros de notas o justificaciones de asistencia.</li>
          <li>
            • Extraer masivamente datos mediante programas automatizados (bots, web scraping).
          </li>
        </ul>
      </section>

      {/* 6. Enlace a Privacidad */}
      <div className="border-border bg-card flex flex-col items-start justify-between gap-4 rounded-2xl border p-6 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <h3 className="text-foreground text-sm font-bold">Protección y Privacidad de Datos</h3>
          <p className="text-muted-foreground text-xs">
            Conoce cómo protegemos la información personal y datos sensibles de los alumnos.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={siteConfig.routes.privacy}
            className="text-primary hover:text-primary/80 inline-flex items-center gap-1.5 text-xs font-semibold"
          >
            <span>Ver Política de Privacidad</span>
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
