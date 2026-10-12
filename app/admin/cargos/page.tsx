import type { Metadata } from "next";
import { CargosPage } from "@/features/cargos";

export const metadata: Metadata = {
  title: "Cargos",
  description: "Catálogo de cargos del personal y sus roles sugeridos",
};

export default function AdminCargosRoute() {
  return <CargosPage />;
}
