import { Metadata } from "next";
import { EstudiantesPage } from "@/features/estudiantes";

export const metadata: Metadata = {
  title: "Padrón de Estudiantes | SGA",
  description:
    "Ficha escolar, códigos SIAGIE, condiciones médicas y credenciales de marcación según RF-007.",
};

export default function EstudiantesRoute() {
  return <EstudiantesPage />;
}
