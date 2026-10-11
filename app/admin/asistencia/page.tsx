import type { Metadata } from "next";
import { AsistenciaSesionPage } from "@/features/asistencia";

export const metadata: Metadata = {
  title: "Asistencia | SGA",
  description: "Asistencia de los estudiantes en cada sesión de clase.",
};

interface PageProps {
  searchParams: Promise<{ sesionId?: string | string[] }>;
}

export default async function AsistenciaRoute({ searchParams }: PageProps) {
  const { sesionId } = await searchParams;
  return <AsistenciaSesionPage sesionId={typeof sesionId === "string" ? sesionId : undefined} />;
}
