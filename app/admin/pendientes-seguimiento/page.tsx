import type { Metadata } from "next";
import { SectionRouteTabs } from "@/components/common/section-route-tabs";
import { PendientesVista } from "@/features/consolidado-docente";

export const metadata: Metadata = {
  title: "Pendientes de seguimiento | SGA",
  description: "Justificaciones, descargos, consolidados y compromisos que aún falta atender.",
};

export default function PendientesSeguimientoPage() {
  return (
    <div className="space-y-4">
      <SectionRouteTabs grupo="consolidado-aula" />
      <PendientesVista />
    </div>
  );
}
