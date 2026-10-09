import { Metadata } from "next";
import { EquiposPage } from "@/features/equipos";

export const metadata: Metadata = {
  title: "Equipos Autorizados",
  description:
    "Administración de kioskos y relojes biométricos para marcación y firma de sesiones.",
};

export default function AdminEquiposRoute() {
  return <EquiposPage />;
}
