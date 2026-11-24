import type { Metadata } from "next";
import { EstudianteDetalleView } from "@/features/estudiantes";

interface EstudianteDetailPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Ficha del Estudiante | SGA",
  description: "Expediente escolar completo, datos personales, condición médica y credenciales",
};

export default async function EstudianteDetailPage({ params }: EstudianteDetailPageProps) {
  const { id } = await params;
  return <EstudianteDetalleView estudianteId={id} />;
}
