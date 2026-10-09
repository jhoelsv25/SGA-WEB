import * as React from "react";
import Link from "next/link";
import { Brand } from "@/components/common/brand";
import { siteConfig } from "@/config";
import { HugeiconsIcon } from "@hugeicons/react";
import { Call02Icon, Mail01Icon, Location01Icon, Shield01Icon } from "@hugeicons/core-free-icons";

export function PortalFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="contacto"
      className="border-border bg-card/50 text-foreground border-t transition-colors"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Columna 1: Identidad Institucional */}
          <div className="space-y-4 md:col-span-1">
            <Brand
              size="md"
              title={siteConfig.acronym}
              subtitle="Sistema de Gestión Académica"
              className="mb-2"
            />
            <p className="text-muted-foreground text-xs leading-relaxed">
              Plataforma integral orientada a la modernización de los procesos académicos, control
              de asistencia escolar y seguimiento pedagógico en tiempo real de la{" "}
              {siteConfig.institution.shortName}.
            </p>
            <div className="text-primary flex items-center gap-2 text-xs font-medium">
              <HugeiconsIcon icon={Shield01Icon} className="size-4 shrink-0" />
              <span>Conexión institucional cifrada</span>
            </div>
          </div>

          {/* Columna 2: Acceso Rápido */}
          <div className="space-y-3">
            <h3 className="text-foreground text-xs font-bold tracking-wider uppercase">
              Plataforma
            </h3>
            <ul className="text-muted-foreground space-y-2 text-xs">
              <li>
                <Link
                  href={siteConfig.routes.login}
                  className="hover:text-primary transition-colors"
                >
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link
                  href={siteConfig.routes.kiosk}
                  className="hover:text-primary transition-colors"
                >
                  Kiosko de marcación
                </Link>
              </li>
              <li>
                <Link href="/#modulos" className="hover:text-primary transition-colors">
                  Módulos de Acceso
                </Link>
              </li>
              <li>
                <Link href="/#caracteristicas" className="hover:text-primary transition-colors">
                  Capacidades del Sistema
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Información y Soporte */}
          <div className="space-y-3">
            <h3 className="text-foreground text-xs font-bold tracking-wider uppercase">
              Soporte y Normativa
            </h3>
            <ul className="text-muted-foreground space-y-2 text-xs">
              <li>
                <Link
                  href={siteConfig.routes.privacy}
                  className="hover:text-primary transition-colors"
                >
                  Políticas de Privacidad y Datos
                </Link>
              </li>
              <li>
                <Link
                  href={siteConfig.routes.terms}
                  className="hover:text-primary transition-colors"
                >
                  Términos y Condiciones de Uso
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.institution.contact.supportEmail}`}
                  className="hover:text-primary transition-colors"
                >
                  Mesa de Ayuda Técnica
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div className="space-y-3">
            <h3 className="text-foreground text-xs font-bold tracking-wider uppercase">
              Contacto Institucional
            </h3>
            <div className="text-muted-foreground space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <HugeiconsIcon
                  icon={Location01Icon}
                  className="text-primary mt-0.5 size-4 shrink-0"
                />
                <span>{siteConfig.institution.address}</span>
              </div>
              <a
                href={`tel:${siteConfig.institution.contact.supportPhone.replace(/[^\d+]/g, "")}`}
                className="hover:text-primary flex items-center gap-2"
              >
                <HugeiconsIcon icon={Call02Icon} className="text-primary size-4 shrink-0" />
                <span>{siteConfig.institution.contact.supportPhone} (Soporte)</span>
              </a>
              <a
                href={`mailto:${siteConfig.institution.contact.email}`}
                className="hover:text-primary flex items-center gap-2"
              >
                <HugeiconsIcon icon={Mail01Icon} className="text-primary size-4 shrink-0" />
                <span>{siteConfig.institution.contact.email}</span>
              </a>
              <p className="text-muted-foreground/75 text-xs">
                Atención: {siteConfig.institution.contact.schedule}
              </p>
            </div>
          </div>
        </div>

        {/* Barra Inferior */}
        <div className="border-border text-muted-foreground mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 text-xs sm:flex-row">
          <p>
            © {currentYear} {siteConfig.institution.name}. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link href={siteConfig.routes.privacy} className="hover:text-primary transition-colors">
              Privacidad
            </Link>
            <span>·</span>
            <Link href={siteConfig.routes.terms} className="hover:text-primary transition-colors">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
