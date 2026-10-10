import { Metadata } from "next";
import { MatriculasPage } from "@/features/matriculas";

export const metadata: Metadata = {
  title: "Matrícula, Retiro y Traslado | SGA",
  description:
    "Gestión de matrículas individuales, masivas, retiros, traslados y constancias oficiales de matrícula según RF-009.",
};

export default function EnrollmentRoute() {
  return <MatriculasPage />;
}
