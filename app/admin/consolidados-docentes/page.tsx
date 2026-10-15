import type { Metadata } from "next";
import { ConsolidadosVista } from "@/features/consolidado-docente";

export const metadata: Metadata = {
  title: "Consolidados docentes | SGA",
  description: "Fichas de seguimiento bimestral, cumplimiento de horas y decisiones del Director.",
};

export default function ConsolidadosDocentesPage() {
  return <ConsolidadosVista />;
}
