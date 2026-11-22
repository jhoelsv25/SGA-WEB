import type { Metadata } from "next";
import { SectionRouteTabs } from "@/components/common/section-route-tabs";
import { ObservacionesAulaPage } from "@/features/observaciones-aula";

export const metadata: Metadata = {
  title: "Observaciones de aula | SGA",
  description:
    "Cronograma, toma de notas, calificación y retroalimentación de las observaciones de aula.",
};

export default function ObservacionesAulaRoute() {
  return (
    <div className="space-y-4">
      <SectionRouteTabs grupo="consolidado-aula" />
      <ObservacionesAulaPage />
    </div>
  );
}
