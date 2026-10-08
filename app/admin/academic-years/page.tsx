import type { Metadata } from "next";
import { AniosPage } from "@/features/anio-escolar";

export const metadata: Metadata = {
  title: "Año escolar",
  description: "Apertura del año escolar, bimestres y reapertura con fecha límite.",
};

export default function AdminAniosRoute() {
  return <AniosPage />;
}
