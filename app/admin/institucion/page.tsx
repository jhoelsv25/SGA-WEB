import { Metadata } from "next";
import { InstitucionPage } from "@/features/institucion";

export const metadata: Metadata = {
  title: "Datos Institucionales | SGA",
  description: "Configuración de datos generales y logo de la institución educativa.",
};

export default function AdminInstitucionRoute() {
  return <InstitucionPage />;
}
