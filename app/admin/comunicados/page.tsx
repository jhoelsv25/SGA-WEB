import type { Metadata } from "next";
import { ComunicadosPage } from "@/features/comunicados";

export const metadata: Metadata = {
  title: "Comunicados Oficiales | SGA",
  description: "Anuncios institucionales y seguimiento de lectura escolar",
};

export default function ComunicadosRoute() {
  return <ComunicadosPage />;
}
