import type { Metadata } from "next";
import { MiAsistenciaPage } from "@/features/asistencia";

export const metadata: Metadata = {
  title: "Asistencia | SGA",
  description: "Asistencia al colegio y por curso del estudiante.",
};

export default function MiAsistenciaRoute() {
  return <MiAsistenciaPage />;
}
