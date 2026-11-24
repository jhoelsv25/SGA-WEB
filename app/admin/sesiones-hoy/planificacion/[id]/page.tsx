import type { Metadata } from "next";
import { SupervisionDetallePage } from "@/features/planificacion-sesiones";

export const metadata: Metadata = {
  title: "Sesión planificada | SGA",
  description: "Sesión planificada por el docente, en solo lectura.",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SupervisionPlanificacionRoute({ params }: PageProps) {
  const { id } = await params;
  return <SupervisionDetallePage id={id} />;
}
