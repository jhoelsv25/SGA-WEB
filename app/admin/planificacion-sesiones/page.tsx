import type { Metadata } from "next";
import { SemanaPlanificacionPage } from "@/features/planificacion-sesiones";

export const metadata: Metadata = {
  title: "Planificación de sesiones | SGA",
  description: "Planifique las sesiones de aprendizaje de su semana.",
};

export default function PlanificacionSesionesRoute() {
  return <SemanaPlanificacionPage />;
}
