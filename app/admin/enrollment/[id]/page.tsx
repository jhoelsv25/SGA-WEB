import type { Metadata } from "next";
import { MatriculaDetalleView } from "@/features/matriculas";

interface EnrollmentDetailPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Expediente de Matrícula | SGA",
  description: "Ficha oficial de matrícula escolar, asignación de salón y estado del estudiante",
};

export default async function EnrollmentDetailPage({ params }: EnrollmentDetailPageProps) {
  const { id } = await params;
  return <MatriculaDetalleView matriculaId={id} />;
}
