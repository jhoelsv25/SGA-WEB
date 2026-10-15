import type { Metadata } from "next";
import { MiSeguimientoVista } from "@/features/consolidado-docente";

export const metadata: Metadata = {
  title: "Mi seguimiento | SGA",
  description: "Consolidado de cumplimiento de mis clases por bimestre y solicitudes de revisión.",
};

export default function MiSeguimientoPage() {
  return <MiSeguimientoVista />;
}
