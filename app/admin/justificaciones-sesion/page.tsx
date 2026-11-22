import type { Metadata } from "next";
import { SectionRouteTabs } from "@/components/common/section-route-tabs";
import { JustificacionesSesionPage } from "@/features/sesiones";

export const metadata: Metadata = {
  title: "Justificaciones de sesiones | SGA",
  description: "Revisión de las justificaciones de sesiones no cumplidas.",
};

export default function JustificacionesSesionRoute() {
  return (
    <div className="space-y-4">
      <SectionRouteTabs grupo="sesiones-ausencias" />
      <JustificacionesSesionPage />
    </div>
  );
}
