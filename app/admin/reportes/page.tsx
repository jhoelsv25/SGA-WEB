import type { Metadata } from "next";
import { ReportesPage } from "@/features/reportes";

export const metadata: Metadata = {
  title: "Centro de Reportes",
  description:
    "Descarga oficial de reportes en Excel y PDF filtrados por año académico, bimestre y sección.",
};

export default function AdminReportesRoute() {
  return <ReportesPage />;
}
