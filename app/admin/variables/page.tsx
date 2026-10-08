import { Metadata } from "next";
import { VariablesPage } from "@/features/variables-sistema";

export const metadata: Metadata = {
  title: "Variables del Sistema | SGA",
  description: "Parámetros configurables, tolerancias de asistencia, plazos y límites.",
};

export default function AdminVariablesRoute() {
  return <VariablesPage />;
}
