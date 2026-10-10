import type { Metadata } from "next";
import { NotificacionesView } from "@/features/notificaciones";

export const metadata: Metadata = {
  title: "Notificaciones | SGA",
  description: "Bandeja y centro de notificaciones personales del sistema escolar",
};

export default function NotificacionesPage() {
  return <NotificacionesView />;
}
