import type { Metadata } from "next";
import { AsistenciaSeccionPage } from "@/features/asistencia";

export const metadata: Metadata = {
  title: "Asistencia de mi sección | SGA",
  description: "Faltas y tardanzas de los estudiantes de una sección.",
};

export default function AsistenciaSeccionRoute() {
  return <AsistenciaSeccionPage />;
}
