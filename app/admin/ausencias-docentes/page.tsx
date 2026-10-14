import type { Metadata } from "next";
import { AusenciasSupervisionVista } from "@/features/ausencias-docente/components/supervision";

export const metadata: Metadata = {
  title: "Ausencias docentes | SGA",
  description: "Supervisión y control de ausencias de docentes en sesiones de clase.",
};

export default function AusenciasDocentesRoute() {
  return <AusenciasSupervisionVista />;
}
