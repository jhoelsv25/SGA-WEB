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
        title="Equipos autorizados"
        description="Gestiona las estaciones de marcación de asistencia (kioskos y biométricos) y firma de sesiones docentes dentro del colegio."
        icon={ComputerIcon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Configuración" },
          { label: "Equipos autorizados" },
        ]}
      />

      {/* Banner Informativo sobre Seguridad y Autorización */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="border-primary/20 bg-primary/5 space-y-1.5 rounded-xl border p-4 md:col-span-2">
          <div className="text-primary flex items-center gap-2 text-xs font-semibold">
            <HugeiconsIcon icon={ShieldCheckIcon} className="h-4 w-4" />
            Control de asistencia en la institución
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Las asistencias y firmas de sesiones de clase solo son válidas cuando se registran en
            los <strong>equipos autorizados del colegio</strong>. Desde cada computadora o tableta,
            un administrador debe presionar <em>&quot;Autorizar este dispositivo&quot;</em> para
            habilitarlo en la institución.
          </p>
        </div>

        <div className="border-info/20 bg-info/10 space-y-1.5 rounded-xl border p-4">
          <div className="text-info flex items-center gap-2 text-xs font-semibold">
            <HugeiconsIcon icon={Key01Icon} className="h-4 w-4" />
            Kiosko de sesiones
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Los equipos con propósito de <strong>sesiones</strong> están reservados para la firma
            digital de clases de los docentes y operan como kioskos web dedicados.
          </p>
        </div>
      </div>

      {/* Tabla de Equipos */}
      <EquiposTable />
    </div>
  );
}
