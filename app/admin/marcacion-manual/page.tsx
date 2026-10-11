import type { Metadata } from "next";
import { MarcacionManualPage } from "@/features/marcaciones";

export const metadata: Metadata = {
  title: "Marcación manual | SGA",
  description: "Registro manual de marcaciones con hora real y observación.",
};

export default function MarcacionManualRoute() {
  return <MarcacionManualPage />;
}
