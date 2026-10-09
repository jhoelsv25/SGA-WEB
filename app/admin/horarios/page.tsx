import type { Metadata } from "next";
import { HorariosPage } from "@/features/horarios";

export const metadata: Metadata = {
  title: "Horarios | Sistema de Gestión Académica",
  description: "Planificación y gestión del horario semanal por sección escolar",
};

export default function AdminHorariosPage() {
  return <HorariosPage />;
}
