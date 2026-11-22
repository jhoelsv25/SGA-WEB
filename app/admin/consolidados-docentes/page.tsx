import type { Metadata } from "next";
import { SectionRouteTabs } from "@/components/common/section-route-tabs";
import { ConsolidadosVista } from "@/features/consolidado-docente";

export const metadata: Metadata = {
  title: "Consolidados docentes | SGA",
  description: "Fichas de seguimiento bimestral, cumplimiento de horas y decisiones del Director.",
};

export default function ConsolidadosDocentesPage() {
  return (
    <div className="space-y-4">
      <SectionRouteTabs grupo="consolidado-aula" />
      <ConsolidadosVista />
    </div>
  );
}
