"use client";

import * as React from "react";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import { MatriculasTable } from "./views";
import { useSession } from "@/features/auth";

export function MatriculasPage() {
  const { data: session } = useSession();
  const { anio: anioActivo, cargando: cargandoAnio } = useAnioLectivo();

  // Roles autorizados para gestionar según RF-009
  const rol = session?.user?.activeRoleName || session?.user?.roles?.[0] || "";
  const puedeGestionar =
    rol === "Administrador" ||
    rol === "Secretaria" ||
    rol.toLowerCase().includes("admin") ||
    rol.toLowerCase().includes("secretaria");

  const anioBadge = React.useMemo(() => {
    if (cargandoAnio) return undefined;
    if (!anioActivo) return "Sin año académico activo";
    return `Año ${anioActivo.anio}`;
  }, [anioActivo, cargandoAnio]);

  return (
    <div className="space-y-6">
      {/* Cabecera Principal */}
      <PageHeader
        title="Matrícula y Traslados"
        description="Gestión oficial de matrículas de estudiantes, promoción masiva de continuadores, retiros, traslados y emisión de constancias oficiales."

        icon={CheckmarkCircle02Icon}
        badge={anioBadge}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Comunidad y Matrícula" },
          { label: "Matrícula y Traslados" },
        ]}
      />

      {/* Contenido Principal */}
      <MatriculasTable puedeGestionar={puedeGestionar} />
    </div>
  );
}
