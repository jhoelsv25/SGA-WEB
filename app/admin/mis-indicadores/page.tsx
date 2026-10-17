import type { Metadata } from "next";
import { MisIndicadoresVista } from "@/features/indicadores/components/mis-indicadores";

export const metadata: Metadata = {
  title: "Mis indicadores | SGA",
  description:
    "Cumplimiento de sesiones planificadas (CSP) y gestión de materiales (IGM) del docente.",
};

export default function MisIndicadoresPage() {
  return <MisIndicadoresVista />;
}
