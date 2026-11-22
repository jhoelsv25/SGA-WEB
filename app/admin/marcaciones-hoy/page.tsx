import type { Metadata } from "next";
import { SectionRouteTabs } from "@/components/common/section-route-tabs";
import { MarcacionesHoyPage } from "@/features/marcaciones";

export const metadata: Metadata = {
  title: "Marcaciones de hoy | SGA",
  description: "Panel en vivo de las marcaciones de estudiantes y personal.",
};

export default function MarcacionesHoyRoute() {
  return (
    <div className="space-y-4">
      <SectionRouteTabs grupo="control-asistencia" />
      <MarcacionesHoyPage />
    </div>
  );
}
