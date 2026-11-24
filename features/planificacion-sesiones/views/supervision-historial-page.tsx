"use client";

import Link from "next/link";
import { Archive01Icon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { HistorialPlanificacionesView } from "./historial-page";

/** Dirección revisa las planificaciones de cualquier día, por bimestre y semana. */
export function PlanificacionesSupervisionPage() {
  return (
    <div className="animate-in fade-in-50 flex flex-col gap-2 duration-300">
      <PageHeader
        title="Planificaciones de los docentes"
        description="Solo lectura. Abra una sesión para comentarla."
        icon={Archive01Icon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Sesiones de hoy", href: "/admin/sesiones-hoy" },
          { label: "Planificaciones" },
        ]}
        actions={
          <Button asChild variant="outline">
            <Link href="/admin/sesiones-hoy">Volver</Link>
          </Button>
        }
      />
      <HistorialPlanificacionesView supervision />
    </div>
  );
}
