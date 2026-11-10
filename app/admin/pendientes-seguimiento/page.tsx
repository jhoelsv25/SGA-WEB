import type { Metadata } from "next";
import { PendientesVista } from "@/features/consolidado-docente";

export const metadata: Metadata = {
  title: "Pendientes de seguimiento | SGA",
  description: "Justificaciones, descargos, consolidados y compromisos que aún falta atender.",
};

export default function PendientesSeguimientoPage() {
  return <PendientesVista />;
}
