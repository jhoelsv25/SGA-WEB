import type { Metadata } from "next";
import { TableroIndicadoresVista } from "@/features/indicadores/components/tablero";

export const metadata: Metadata = {
  title: "Indicadores de la Tesis | SGA",
  description:
    "Panel de control y evaluación de los tres indicadores de la tesis: CSP, ISA e IGM con comparación pretest-postest (RF-020)",
};

/**
 * Página principal del módulo de Indicadores de la Tesis y Panel (RF-020).
 * Ruta: /admin/indicadores (acceso para Director, Subdirector y Administrador).
 */
export default function IndicadoresRoute() {
  return <TableroIndicadoresVista />;
}
