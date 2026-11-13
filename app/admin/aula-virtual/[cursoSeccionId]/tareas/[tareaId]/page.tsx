import type { Metadata } from "next";
import { TareaEntregasPage } from "@/features/aula-virtual";

export const metadata: Metadata = {
  title: "Entregas y Calificación | SGA",
  description: "Espacio de revisión y calificación de entregas de estudiantes.",
};

interface PageProps {
  params: Promise<{
    cursoSeccionId: string;
    tareaId: string;
  }>;
}

export default async function TareaEntregasRoute({ params }: PageProps) {
  const { cursoSeccionId, tareaId } = await params;

  return <TareaEntregasPage cursoSeccionId={cursoSeccionId} tareaId={tareaId} />;
}
