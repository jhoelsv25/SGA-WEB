import type { Metadata } from "next";
import { AccesosPage } from "@/features/accesos";

export const metadata: Metadata = {
  title: "Accesos y credenciales",
  description: "Restablecer PIN, carné, código biométrico y contraseña.",
};

export default function AdminAccesosRoute() {
  return <AccesosPage />;
}
