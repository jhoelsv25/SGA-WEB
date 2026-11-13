import type { Metadata } from "next";
import { MisObservacionesPage } from "@/features/observaciones-aula";

export const metadata: Metadata = {
  title: "Mis observaciones | SGA",
  description: "Visitas a mi aula y su retroalimentación.",
};

export default function MisObservacionesRoute() {
  return <MisObservacionesPage />;
}
