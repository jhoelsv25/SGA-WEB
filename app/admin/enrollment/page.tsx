import { Metadata } from "next";
import { MatriculasPage } from "@/features/matriculas";

export const metadata: Metadata = {
  title: "Matrícula, Retiro y Traslado | SGA",
  description:
    "Gestión de matrículas individuales, masivas, retiros, traslados y constancias oficiales de matrícula.",
};

export default function EnrollmentRoute() {
  return <MatriculasPage />;
}
