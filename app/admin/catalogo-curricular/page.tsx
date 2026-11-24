import type { Metadata } from "next";
import { CatalogoCurricularPage } from "@/features/planificacion-sesiones";

export const metadata: Metadata = {
  title: "Catálogo curricular | SGA",
  description: "Competencias, capacidades y desempeños del CNEB.",
};

export default function CatalogoCurricularRoute() {
  return <CatalogoCurricularPage />;
}
