import type { Metadata } from "next";
import { SeccionesPage } from "@/features/secciones";

export const metadata: Metadata = {
  title: "Secciones",
  description: "Gestión de secciones, aulas, vacantes y tutores por grado escolar.",
};

export default function AdminSeccionesRoute() {
  return <SeccionesPage />;
}
