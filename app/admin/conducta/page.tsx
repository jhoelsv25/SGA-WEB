import type { Metadata } from "next";
import { ConductaPage } from "@/features/conducta";

export const metadata: Metadata = {
  title: "Conducta y Convivencia Escolar | SGA",
  description:
    "Registro de incidencias, méritos y observaciones formativas del estudiante (RF-018)",
};

export default function ConductaRoute() {
  return <ConductaPage />;
}
