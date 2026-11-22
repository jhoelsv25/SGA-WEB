import type { Metadata } from "next";
import { SectionRouteTabs } from "@/components/common/section-route-tabs";
import { AsistenciaSeccionPage } from "@/features/asistencia";

export const metadata: Metadata = {
  title: "Asistencia de mi sección | SGA",
  description: "Faltas y tardanzas de los estudiantes de una sección.",
};

export default function AsistenciaSeccionRoute() {
  return (
    <div className="space-y-4">
      <SectionRouteTabs grupo="control-asistencia" />
      <AsistenciaSeccionPage />
    </div>
  );
}
