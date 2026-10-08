"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ComputerIcon, ShieldCheckIcon, Key01Icon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { EquiposTable } from "./views/table/equipos-table";

export function EquiposPage() {
  return (
    <div className="animate-in fade-in-50 space-y-6 duration-300">
      <PageHeader
        title="Equipos Autorizados"
        description="Gestiona las estaciones de marcación de asistencia (kioskos y biométricos) y firma de sesiones docentes dentro del colegio."
        icon={ComputerIcon}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Configuración" },
          { label: "Equipos Autorizados" },
        ]}
      />

      {/* Banner Informativo sobre Seguridad y Autorización */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="border-primary/20 bg-primary/5 space-y-1.5 rounded-xl border p-4 md:col-span-2">
          <div className="text-primary flex items-center gap-2 text-xs font-semibold">
            <HugeiconsIcon icon={ShieldCheckIcon} className="h-4 w-4" />
            Control de Acceso Físico sin Dependencia de GPS
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed">
            La validez de las asistencias y firmas de sesiones de clase está estrictamente
            subordinada a que se realicen en <strong>terminales físicas autorizadas</strong>. El
            personal de Soporte TI o Administración debe ingresar desde cada PC y presionar{" "}
            <em>&quot;Autorizar este dispositivo&quot;</em> para instalar su clave criptográfica
            local.
          </p>
        </div>

        <div className="space-y-1.5 rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 dark:text-purple-300">
            <HugeiconsIcon icon={Key01Icon} className="h-4 w-4" />
            Kiosko de Sesiones
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Los terminales con propósito de <strong>sesiones</strong> están reservados con
            exclusividad a la firma digital de clases de docentes y operan como kioskos web
            dedicados.
          </p>
        </div>
      </div>

      {/* Tabla de Equipos */}
      <EquiposTable />
    </div>
  );
}
