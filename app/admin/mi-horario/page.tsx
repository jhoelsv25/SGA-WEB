import type { Metadata } from "next";
import { MiHorarioPage } from "@/features/mi-horario";

export const metadata: Metadata = {
  title: "Mi horario | SGA",
  description: "Consulta semanal de horario escolar de clases y recesos.",
};

export default function MiHorarioRoute() {
  return <MiHorarioPage />;
}
