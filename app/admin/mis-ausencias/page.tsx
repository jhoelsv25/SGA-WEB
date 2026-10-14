import type { Metadata } from "next";
import { MisAusenciasView } from "@/features/ausencias-docente/components/mis-ausencias";

export const metadata: Metadata = {
  title: "Mis ausencias | SGA",
  description: "Historial de ausencias en sesiones de clase y presentación de descargos.",
};

export default function MisAusenciasRoute() {
  return <MisAusenciasView />;
}
