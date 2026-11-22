import type { Metadata } from "next";
import { CierrePromocionPage } from "@/features/anio-escolar";

export const metadata: Metadata = {
  title: "Cierre y promoción anual",
  description:
    "Asistente guiado para cierre del año académico, clonación de secciones, promoción de 1.° a 4.° y egreso de 5.° grado.",
};

export default function AdminCierrePromocionRoute() {
  return <CierrePromocionPage />;
}
