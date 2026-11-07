"use client";

import * as React from "react";
import { Settings02Icon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import {
  ConfiguracionNav,
  TabInstitucion,
  TabVariables,
  TabTurnos,
  TabEquipos,
  TabSeguridad,
  TabNotificaciones,
} from "./components";
import type { TabConfiguracion } from "./types";

export function ConfiguracionPage() {
  const [tabActiva, setTabActiva] = React.useState<TabConfiguracion>("institucion");

  return (
    <div className="animate-in fade-in-50 space-y-6 duration-300">
      <PageHeader
        title="Configuración del Sistema"
        description="Centro integral de parámetros institucionales, reglas de asistencia, turnos y seguridad."
        icon={Settings02Icon}
        breadcrumbs={[{ label: "Inicio", href: "/admin/dashboard" }, { label: "Configuración" }]}
      />

      {/* Grid principal de configuración */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Navegación lateral de Ajustes */}
        <ConfiguracionNav tabActiva={tabActiva} onSelectTab={setTabActiva} />

        {/* Panel de Contenido de Ajustes */}
        <div className="min-w-0 space-y-6 lg:col-span-8 xl:col-span-9">
          {tabActiva === "institucion" && <TabInstitucion />}
          {tabActiva === "variables" && <TabVariables />}
          {tabActiva === "turnos" && <TabTurnos />}
          {tabActiva === "equipos" && <TabEquipos />}
          {tabActiva === "seguridad" && <TabSeguridad />}
          {tabActiva === "notificaciones" && <TabNotificaciones />}
        </div>
      </div>
    </div>
  );
}
