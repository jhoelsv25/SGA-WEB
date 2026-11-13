import type { Metadata } from "next";
import { MiObservacionDetallePage } from "@/features/observaciones-aula";

export const metadata: Metadata = {
  title: "Mi observación | SGA",
  description: "Resultado de la visita a mi aula.",
};

export default async function MiObservacionDetalleRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MiObservacionDetallePage id={id} />;
}
