import type { Metadata } from "next";
import { MaterialesBimestrePage } from "@/features/aula-virtual";

export const metadata: Metadata = {
  title: "Materiales del bimestre | SGA",
  description: "Cumplimiento de los materiales planificados por docente y curso.",
};

export default function MaterialesBimestreRoute() {
  return <MaterialesBimestrePage />;
}
