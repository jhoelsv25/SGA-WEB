import type { Metadata } from "next";
import { EditorSesionPage } from "@/features/planificacion-sesiones";

export const metadata: Metadata = {
  title: "Planificar sesión | SGA",
  description: "Editor de la sesión de aprendizaje.",
};

interface PageProps {
  searchParams: Promise<{ id?: string; horarioId?: string; fecha?: string }>;
}

export default async function EditorSesionRoute({ searchParams }: PageProps) {
  const { id, horarioId, fecha } = await searchParams;
  return <EditorSesionPage id={id} horarioId={horarioId} fecha={fecha} />;
}
