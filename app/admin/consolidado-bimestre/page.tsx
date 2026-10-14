import * as React from "react";
import type { Metadata } from "next";
import { LoadingScreen } from "@/components/common/loading-screen";
import { ConsolidadoBimestreVista } from "@/features/seguimiento-docente/components/consolidado";

export const metadata: Metadata = {
  title: "Consolidado del bimestre | SGA",
  description:
    "Supervisión de sesiones, firmas y ausencias docentes con control de versiones y decisiones directivas.",
};

/**
 * Página principal de supervisión del consolidado del bimestre (Director / Subdirector) (RF-013).
 */
export default function ConsolidadoBimestreRoute() {
  return (
    <React.Suspense
      fallback={<LoadingScreen fullScreen={false} message="Cargando consolidado del bimestre..." />}
    >
      <ConsolidadoBimestreVista />
    </React.Suspense>
  );
}
