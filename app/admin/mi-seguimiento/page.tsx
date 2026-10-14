import type { Metadata } from "next";
import { MiSeguimientoView } from "@/features/seguimiento-docente/components/mi-seguimiento";

export const metadata: Metadata = {
  title: "Mi seguimiento | SGA",
  description:
    "Consolidado de seguimiento docente, métricas por bimestre y solicitudes de revisión.",
};

export default function MiSeguimientoRoute() {
  return <MiSeguimientoView />;
}
