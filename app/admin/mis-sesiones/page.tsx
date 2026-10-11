import type { Metadata } from "next";
import { MisSesionesPage } from "@/features/sesiones";

export const metadata: Metadata = {
  title: "Mis sesiones | SGA",
  description: "Historial de sesiones de clase del docente.",
};

export default function MisSesionesRoute() {
  return <MisSesionesPage />;
}
