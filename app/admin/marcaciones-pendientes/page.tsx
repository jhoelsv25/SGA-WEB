import type { Metadata } from "next";
import { MarcacionesPendientesPage } from "@/features/biometrico";

export const metadata: Metadata = {
  title: "Marcaciones pendientes | SGA",
  description: "Marcaciones del reloj biométrico que no se pudieron asignar a un docente.",
};

export default function MarcacionesPendientesRoute() {
  return <MarcacionesPendientesPage />;
}
