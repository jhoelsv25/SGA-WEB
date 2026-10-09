import type { Metadata } from "next";
import { CalendarioPage } from "@/features/calendario";

export const metadata: Metadata = {
  title: "Calendario escolar",
  description: "Feriados, suspensiones y actividades del año académico en curso.",
};

export default function AdminCalendarioRoute() {
  return <CalendarioPage />;
}
