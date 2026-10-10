import type { Metadata } from "next";
import { DocenteCargaView } from "@/features/carga-academica";

interface DocenteCargaPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Carga académica del docente | SGA",
  description: "Carga horaria y cursos asignados al docente frente a su jornada laboral",
};

export default async function DocenteCargaPage({ params }: DocenteCargaPageProps) {
  const { id } = await params;
  return <DocenteCargaView docenteId={id} />;
}
