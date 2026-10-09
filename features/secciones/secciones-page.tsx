"use client";

import * as React from "react";
import { School01Icon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import { SeccionesTable } from "./views/secciones-table";

export function SeccionesPage() {
  const { anio: anioActivo, cargando: cargandoAnio } = useAnioLectivo();

  const anioBadge = React.useMemo(() => {
    if (cargandoAnio) return undefined;
    if (!anioActivo) return "Sin año académico activo";
    return `Año ${anioActivo.anio}`;
  }, [anioActivo, cargandoAnio]);

  return (
    <div className="space-y-6">
      {/* Cabecera Principal */}
      <PageHeader
        title="Secciones"
        description="Gestión de secciones por grado, vacantes, asignación de tutores y acceso a la carga académica del año académico."
        icon={School01Icon}
        badge={anioBadge}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Organización Escolar" },
          { label: "Secciones" },
        ]}
      />

      {/* Tabla y Contenido Principal */}
      <SeccionesTable />
    </div>
  );
}
