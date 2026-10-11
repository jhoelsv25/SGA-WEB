import type { Metadata } from "next";
import { JustificacionesSesionPage } from "@/features/sesiones";

export const metadata: Metadata = {
  title: "Justificaciones de sesiones | SGA",
  description: "Revisión de las justificaciones de sesiones no cumplidas.",
};

export default function JustificacionesSesionRoute() {
  return <JustificacionesSesionPage />;
}
