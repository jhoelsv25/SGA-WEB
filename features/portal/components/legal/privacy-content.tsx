import * as React from "react";
import Link from "next/link";
import { siteConfig } from "@/config";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Shield01Icon,
  LockIcon,
  UserCheck01Icon,
  DatabaseIcon,
  FileCheckIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

export function PrivacyContent() {
  return (
    <article className="prose prose-slate dark:prose-invert max-w-none space-y-10">
      {/* Resumen Destacado */}
      <div className="border-primary/20 bg-primary/5 rounded-2xl border p-6 text-sm leading-relaxed">
        <div className="text-primary mb-2 flex items-center gap-2 font-bold">
          <HugeiconsIcon icon={Shield01Icon} className="size-5 shrink-0" />
          <span>Compromiso de Privacidad y Protección de Datos Escolares</span>
        </div>
        <p className="text-muted-foreground m-0">
          La <strong>{siteConfig.institution.name}</strong>, a través del{" "}
          <strong>
            {siteConfig.name} ({siteConfig.acronym})
          </strong>
          , garantiza el tratamiento seguro, confidencial y lícito de la información académica y
          personal de los estudiantes, apoderados y personal educativo, en estricto cumplimiento de
          la <strong>Ley N° 29733 (Ley de Protección de Datos Personales del Perú)</strong> y su
          Reglamento (D.S. 003-2013-JUS).
        </p>
      </div>

      {/* 1. Responsable del Tratamiento */}
      <section className="space-y-3">
        <h2 className="text-foreground flex items-center gap-2.5 text-xl font-bold tracking-tight">
          <span className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-lg text-xs">
            1
          </span>
          Responsable del Tratamiento
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          El titular del banco de datos personales administrado en esta plataforma es la{" "}
          <strong>{siteConfig.institution.name}</strong> (Código Modular{" "}
          {siteConfig.institution.modularCode}), con sede central en{" "}
          {siteConfig.institution.address}.
        </p>
      </section>

      {/* 2. Datos Personales Recopilados */}
      <section className="space-y-4">
        <h2 className="text-foreground flex items-center gap-2.5 text-xl font-bold tracking-tight">
          <span className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-lg text-xs">
            2
          </span>
          Datos Personales Objeto de Tratamiento
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Para garantizar la prestación del servicio educativo y el cumplimiento de las normativas
          del Ministerio de Educación (MINEDU), el sistema recopila y procesa las siguientes
          categorías de datos:
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="bg-card border-border rounded-xl border p-4">
            <div className="text-primary mb-2 flex items-center gap-2 text-xs font-semibold">
              <HugeiconsIcon icon={UserCheck01Icon} className="size-4" />
              <span>Estudiantes</span>
            </div>
            <ul className="text-muted-foreground space-y-1 text-xs">
              <li>• Nombres y apellidos completos</li>
              <li>• Tipo y número de documento (DNI)</li>
              <li>• Código de estudiante SIAGIE</li>
              <li>• Fecha de nacimiento y sexo</li>
              <li>• Calificaciones y evaluaciones</li>
              <li>• Asistencias, tardanzas y justificaciones</li>
            </ul>
          </div>

          <div className="bg-card border-border rounded-xl border p-4">
            <div className="text-primary mb-2 flex items-center gap-2 text-xs font-semibold">
              <HugeiconsIcon icon={DatabaseIcon} className="size-4" />
              <span>Padres y Apoderados</span>
            </div>
            <ul className="text-muted-foreground space-y-1 text-xs">
              <li>• Nombres y apellidos del titular</li>
              <li>• DNI o documento de identidad</li>
              <li>• Parentesco legal acreditado</li>
              <li>• Teléfono móvil y correo de contacto</li>
              <li>• Dirección domiciliaria declarada</li>
            </ul>
          </div>

          <div className="bg-card border-border rounded-xl border p-4">
            <div className="text-primary mb-2 flex items-center gap-2 text-xs font-semibold">
              <HugeiconsIcon icon={FileCheckIcon} className="size-4" />
              <span>Docentes y Personal</span>
            </div>
            <ul className="text-muted-foreground space-y-1 text-xs">
              <li>• Datos de identificación laboral</li>
              <li>• Especialidad, áreas y asignaturas</li>
              <li>• Marcaciones de asistencia en kiosco</li>
              <li>• Registros pedagógicos y actas</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Finalidad del Tratamiento */}
      <section className="space-y-3">
        <h2 className="text-foreground flex items-center gap-2.5 text-xl font-bold tracking-tight">
          <span className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-lg text-xs">
            3
          </span>
          Finalidades del Tratamiento de Datos
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Los datos personales almacenados en el SGA se utilizan exclusivamente para los siguientes
          fines institucionales y académicos:
        </p>
        <ul className="text-muted-foreground space-y-1.5 text-sm">
          <li>
            • <strong>Gestión Escolar y Pedagógica:</strong> Registro de matrícula, generación de
            nóminas oficiales, seguimiento curricular y emisión de libretas de calificaciones.
          </li>
          <li>
            • <strong>Control de Asistencia y Puntualidad:</strong> Registro automatizado en
            portería mediante terminal kiosco para la seguridad de los alumnos.
          </li>
          <li>
            • <strong>Comunicación Institucional:</strong> Notificaciones directas a las familias
            sobre citaciones, justificaciones y progreso formativo.
          </li>
          <li>
            • <strong>Cumplimiento de Mandato Legal:</strong> Reportes oficiales exigidos por UGEL
            Angaraes, DRE Huancavelica y el Sistema de Información de Apoyo a la Gestión de la
            Institución Educativa (SIAGIE).
          </li>
        </ul>
      </section>

      {/* 4. Seguridad de la Información y Cifrado */}
      <section className="space-y-3">
        <h2 className="text-foreground flex items-center gap-2.5 text-xl font-bold tracking-tight">
          <span className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-lg text-xs">
            4
          </span>
          Medidas de Seguridad Técnicas y Organizativas
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Implementamos altos estándares técnicos de seguridad de la información:
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="bg-muted/40 rounded-xl p-3.5 text-xs">
            <div className="text-foreground mb-1 flex items-center gap-2 font-semibold">
              <HugeiconsIcon icon={LockIcon} className="text-primary size-4" />
              <span>Cifrado y Hashes Criptográficos</span>
            </div>
            <p className="text-muted-foreground">
              Las contraseñas se almacenan mediante algoritmos unidireccionales (bcrypt costo 10) y
              las sesiones se firman con tokens seguros con hash SHA-256. Nunca se guardan
              contraseñas en texto plano.
            </p>
          </div>
          <div className="bg-muted/40 rounded-xl p-3.5 text-xs">
            <div className="text-foreground mb-1 flex items-center gap-2 font-semibold">
              <HugeiconsIcon icon={Shield01Icon} className="text-primary size-4" />
              <span>Cookies Seguras y Aislamiento</span>
            </div>
            <p className="text-muted-foreground">
              La autenticación web utiliza cookies protegidas contra ataques XSS y CSRF con
              atributos <code>HttpOnly</code>, <code>SameSite</code> y canal cifrado{" "}
              <code>HTTPS</code>.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Transferencia y No Comercialización */}
      <section className="space-y-3">
        <h2 className="text-foreground flex items-center gap-2.5 text-xl font-bold tracking-tight">
          <span className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-lg text-xs">
            5
          </span>
          Política de No Comercialización y Terceros
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          La institución educativa <strong>jamás comercializa, alquila ni cede</strong> datos
          personales a empresas comerciales, anunciantes ni entidades externas lucrativas. La
          información únicamente se comparte con las autoridades del sector educativo público
          (MINEDU/UGEL/DRE) por estricta disposición legal.
        </p>
      </section>

      {/* 6. Ejercicio de Derechos ARCO */}
      <section className="space-y-3">
        <h2 className="text-foreground flex items-center gap-2.5 text-xl font-bold tracking-tight">
          <span className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-lg text-xs">
            6
          </span>
          Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Los titulares de los datos o sus representantes legales acreditados pueden ejercer sus
          derechos reconocidos en la Ley N° 29733:
        </p>
        <ul className="text-muted-foreground space-y-1 text-xs">
          <li>
            • <strong>Acceso:</strong> Conocer los datos personales almacenados en el sistema y los
            registros de asistencia y notas asociados.
          </li>
          <li>
            • <strong>Rectificación:</strong> Solicitar la corrección de datos inexactos,
            desactualizados o erróneos.
          </li>
          <li>
            • <strong>Cancelación u Oposición:</strong> Solicitar la supresión de datos no sujetos a
            obligación legal de conservación académica por normativa nacional.
          </li>
        </ul>
        <p className="text-muted-foreground text-xs">
          Para iniciar este trámite, el apoderado o titular debe presentar una solicitud formal ante
          la Dirección o Secretaría de la institución educativa o enviar un correo a{" "}
          <a
            href={`mailto:${siteConfig.institution.contact.email}`}
            className="text-primary font-medium hover:underline"
          >
            {siteConfig.institution.contact.email}
          </a>
          .
        </p>
      </section>

      {/* 7. Dudas y Mesa de Ayuda */}
      <div className="border-border bg-card flex flex-col items-start justify-between gap-4 rounded-2xl border p-6 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <h3 className="text-foreground text-sm font-bold">¿Tienes dudas sobre tu privacidad?</h3>
          <p className="text-muted-foreground text-xs">
            Consulta los términos y condiciones de la plataforma o comunícate con soporte.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={siteConfig.routes.terms}
            className="text-primary hover:text-primary/80 inline-flex items-center gap-1.5 text-xs font-semibold"
          >
            <span>Ver Términos de Servicio</span>
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
