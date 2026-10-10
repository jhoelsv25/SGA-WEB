import type { Metadata } from "next";
import { SeccionCargaView } from "@/features/carga-academica";

interface SeccionCargaPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Carga académica | SGA",
  description: "Asignación de docentes y carga horaria por curso de la sección",
};

export default async function SeccionCargaPage({ params }: SeccionCargaPageProps) {
  const { id } = await params;
  return <SeccionCargaView seccionId={id} />;
}
