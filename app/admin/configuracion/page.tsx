import type { Metadata } from "next";
import { ConfiguracionPage } from "@/features/configuracion";

export const metadata: Metadata = {
  title: "Configuración",
  description: "Accesos a variables, turnos y equipos autorizados del sistema.",
};

export default function AdminConfiguracionRoute() {
  return <ConfiguracionPage />;
}
