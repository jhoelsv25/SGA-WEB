import type { Metadata } from "next";
import { SectionRouteTabs } from "@/components/common/section-route-tabs";
import { InformeHorasVista } from "@/features/consolidado-docente";

export const metadata: Metadata = {
  title: "Informe de horas efectivas | SGA",
  description: "Informe mensual de horas pedagógicas programadas, dictadas y perdidas.",
};

export default function InformeHorasEfectivasPage() {
  return (
    <div className="space-y-4">
      <SectionRouteTabs grupo="consolidado-aula" />
      <InformeHorasVista />
    </div>
  );
}
