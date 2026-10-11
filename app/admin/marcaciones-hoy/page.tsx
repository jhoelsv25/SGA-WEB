import type { Metadata } from "next";
import { MarcacionesHoyPage } from "@/features/marcaciones";

export const metadata: Metadata = {
  title: "Marcaciones de hoy | SGA",
  description: "Panel en vivo de las marcaciones de estudiantes y personal.",
};

export default function MarcacionesHoyRoute() {
  return <MarcacionesHoyPage />;
}
