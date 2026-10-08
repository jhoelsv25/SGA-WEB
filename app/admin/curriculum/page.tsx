import { Metadata } from "next";
import { CurriculumPage } from "@/features/curriculum";

export const metadata: Metadata = {
  title: "Grados, Cursos y Plan de Estudios | SGA",
  description:
    "Gestión de grados de secundaria, catálogo de asignaturas del CNEB y planes de estudios.",
};

export default function AdminCurriculumRoute() {
  return <CurriculumPage />;
}
