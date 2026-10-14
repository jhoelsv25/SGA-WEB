import type { Metadata } from "next";
import { LibretasPage } from "@/features/libretas";

export const metadata: Metadata = {
  title: "Libretas del SIAGIE | SGA",
  description: "Programación, carga y seguimiento de las libretas oficiales del SIAGIE (RF-014)",
};

export default function LibretasRoute() {
  return <LibretasPage />;
}
