import type { Metadata } from "next";
import { NotificacionesPage } from "@/features/notificaciones";

export const metadata: Metadata = {
  title: "Centro de Notificaciones | SGA",
  description: "Bandeja y centro de notificaciones personales del sistema escolar",
};

export default function NotificacionesRoute() {
  return <NotificacionesPage />;
}
