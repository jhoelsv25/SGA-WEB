import * as React from "react";
import Link from "next/link";
import { Brand } from "@/components/common/brand";
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
            <Brand size="md" title="SGA" subtitle="Sistema de Gestión Académica" className="mb-2" />
            <p className="text-muted-foreground text-xs leading-relaxed">
              Plataforma integral orientada a la modernización de los procesos académicos, control
              de asistencia escolar y seguimiento pedagógico en tiempo real.
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
                <Link href="/login" className="hover:text-primary transition-colors">
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link href="/access-control/kiosk" className="hover:text-primary transition-colors">
                  Terminal de Marcado (Kiosco)
                </Link>
              </li>
              <li>
                <a href="#modulos" className="hover:text-primary transition-colors">
                  Módulos de Acceso
                </a>
              </li>
              <li>
                <a href="#caracteristicas" className="hover:text-primary transition-colors">
                  Capacidades del Sistema
                </a>
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
                <span className="hover:text-primary cursor-pointer transition-colors">
                  Mesa de Ayuda Técnica
                </span>
              </li>
              <li>
                <span className="hover:text-primary cursor-pointer transition-colors">
                  Políticas de Seguridad y Privacidad
                </span>
              </li>
              <li>
                <span className="hover:text-primary cursor-pointer transition-colors">
                  Lineamientos MINEDU / SIAGIE
                </span>
              </li>
              <li>
                <span className="hover:text-primary cursor-pointer transition-colors">
                  Guías para Docentes y Familias
                </span>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div className="space-y-3">
            <h3 className="text-foreground text-xs font-bold tracking-wider uppercase">
              Contacto Institucional
            </h3>
            <div className="text-muted-foreground space-y-2.5 text-xs">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Location01Icon} className="text-primary size-4 shrink-0" />
                <span>Sede Central Administrativa</span>
              </div>
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Call02Icon} className="text-primary size-4 shrink-0" />
                <span>(01) 600-0000 · Central de Soporte</span>
              </div>
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Mail01Icon} className="text-primary size-4 shrink-0" />
                <span>soporte@sga.edu.pe</span>
              </div>
            </div>
          </div>
        </div>

        {/* Barra Inferior */}
        <div className="border-border text-muted-foreground mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 text-xs sm:flex-row">
          <p>© {currentYear} SGA · Sistema de Gestión Académica. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <span className="bg-primary/10 border-primary/20 text-primary inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold">
              Versión Web 1.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
