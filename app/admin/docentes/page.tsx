import { Metadata } from "next";
import { DocentesPage } from "@/features/docentes";

export const metadata: Metadata = {
  title: "Plana Docente | SGA",
  description: "Gestión de docentes, contratos laborales y credenciales de marcación.",
};

export default function DocentesRoute() {
  return <DocentesPage />;
}
