import type { Metadata } from "next";
import { SectionRouteTabs } from "@/components/common/section-route-tabs";
import { AusenciasSupervisionVista } from "@/features/ausencias-docente/components/supervision";

export const metadata: Metadata = {
  title: "Ausencias docentes | SGA",
  description: "Supervisión y control de ausencias de docentes en sesiones de clase.",
};

export default function AusenciasDocentesRoute() {
  return (
    <div className="space-y-4">
      <SectionRouteTabs grupo="sesiones-ausencias" />
      <AusenciasSupervisionVista />
    </div>
  );
}
