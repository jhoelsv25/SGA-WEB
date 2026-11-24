import type { Metadata } from "next";
import { PlanificacionesSupervisionPage } from "@/features/planificacion-sesiones";

export const metadata: Metadata = {
  title: "Planificaciones de los docentes | SGA",
  description: "Sesiones planificadas por bimestre y semana, en solo lectura.",
};

export default function PlanificacionesSupervisionRoute() {
  return <PlanificacionesSupervisionPage />;
}
