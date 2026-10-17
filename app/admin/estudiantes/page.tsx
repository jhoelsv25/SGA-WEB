import { Metadata } from "next";
import { EstudiantesPage } from "@/features/estudiantes";

export const metadata: Metadata = {
  title: "Padrón de Estudiantes | SGA",
  description: "Ficha escolar, códigos SIAGIE, condiciones médicas y credenciales de marcación.",
};

export default function EstudiantesRoute() {
  return <EstudiantesPage />;
}
