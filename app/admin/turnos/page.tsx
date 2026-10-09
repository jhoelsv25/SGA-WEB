import { Metadata } from "next";
import { TurnosPage } from "@/features/turnos";

export const metadata: Metadata = {
  title: "Turnos de Marcación",
  description: "Configuración de horarios de entrada, salida y tolerancias por estamento.",
};

export default function AdminTurnosRoute() {
  return <TurnosPage />;
}
