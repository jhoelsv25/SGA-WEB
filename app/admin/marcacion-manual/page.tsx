import type { Metadata } from "next";
import { SectionRouteTabs } from "@/components/common/section-route-tabs";
import { MarcacionManualPage } from "@/features/marcaciones";

export const metadata: Metadata = {
  title: "Marcación manual | SGA",
  description: "Registro manual de marcaciones con hora real y observación.",
};

export default function MarcacionManualRoute() {
  return (
    <div className="space-y-4">
      <SectionRouteTabs grupo="control-asistencia" />
      <MarcacionManualPage />
    </div>
  );
}
