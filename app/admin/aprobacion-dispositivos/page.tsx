import type { Metadata } from "next";
import { AprobacionDispositivosPage } from "@/features/equipos";

export const metadata: Metadata = {
  title: "Aprobación de dispositivos",
  description: "Aprobación de los navegadores que operan como kiosko.",
};

export default function AdminAprobacionDispositivosRoute() {
  return <AprobacionDispositivosPage />;
}
