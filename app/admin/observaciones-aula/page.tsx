import type { Metadata } from "next";
import { ObservacionesAulaPage } from "@/features/observaciones-aula";

export const metadata: Metadata = {
  title: "Observaciones de aula | SGA",
  description:
    "Cronograma, toma de notas, calificación y retroalimentación de las observaciones de aula.",
};

export default function ObservacionesAulaRoute() {
  return <ObservacionesAulaPage />;
}
