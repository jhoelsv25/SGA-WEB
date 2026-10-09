import { Metadata } from "next";
import { PersonasPage } from "@/features/personas";

export const metadata: Metadata = {
  title: "Padrón de Personas | SGA",
  description:
    "Padrón único de docentes, estudiantes, apoderados y personas provisionales de la comunidad educativa.",
};

export default function AdminPersonasRoute() {
  return <PersonasPage />;
}
