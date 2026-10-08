import type { Metadata } from "next";
import { AuditPage } from "@/features/audit";

export const metadata: Metadata = {
  title: "Bitácora de Auditoría",
  description: "Trazabilidad inmutable de eventos y cambios del sistema institucional SGA",
};

export default function AdminAuditRoute() {
  return <AuditPage />;
}
