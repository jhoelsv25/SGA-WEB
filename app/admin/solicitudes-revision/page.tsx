import type { Metadata } from "next";
import { SolicitudesRevisionVista } from "@/features/seguimiento-docente/components/solicitudes";

export const metadata: Metadata = {
  title: "Solicitudes de revisión | SGA",
  description:
    "Bandeja directiva para revisar, aceptar o rechazar solicitudes de revisión de consolidados docentes.",
};

export default function SolicitudesRevisionPage() {
  return <SolicitudesRevisionVista />;
}
