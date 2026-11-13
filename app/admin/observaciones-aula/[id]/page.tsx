import type { Metadata } from "next";
import { ObservacionDetallePage } from "@/features/observaciones-aula";

export const metadata: Metadata = {
  title: "Observación de aula | SGA",
  description: "Detalle de una observación de aula.",
};

export default async function ObservacionDetalleRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ObservacionDetallePage id={id} />;
}
