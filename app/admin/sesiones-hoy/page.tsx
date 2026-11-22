import type { Metadata } from "next";
import { SectionRouteTabs } from "@/components/common/section-route-tabs";
import { SesionesHoyPage } from "@/features/sesiones";

export const metadata: Metadata = {
  title: "Sesiones de hoy | SGA",
  description: "Seguimiento en vivo de las firmas de las sesiones de clase.",
};

export default function SesionesHoyRoute() {
  return (
    <div className="space-y-4">
      <SectionRouteTabs grupo="sesiones-ausencias" />
      <SesionesHoyPage />
    </div>
  );
}
