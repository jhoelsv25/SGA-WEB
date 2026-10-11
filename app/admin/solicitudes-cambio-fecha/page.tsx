import type { Metadata } from "next";
import { SolicitudesCambioFechaPage } from "@/features/aula-virtual";

export const metadata: Metadata = {
  title: "Solicitudes de cambio de fecha | SGA",
  description: "Pedidos de los docentes para mover la fecha de un material congelado.",
};

export default function SolicitudesCambioFechaRoute() {
  return <SolicitudesCambioFechaPage />;
}
