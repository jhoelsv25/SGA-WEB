import type { Metadata } from "next";
import { InformeHorasVista } from "@/features/consolidado-docente";

export const metadata: Metadata = {
  title: "Informe de horas efectivas | SGA",
  description: "Informe mensual de horas pedagógicas programadas, dictadas y perdidas.",
};

export default function InformeHorasEfectivasPage() {
  return <InformeHorasVista />;
}
