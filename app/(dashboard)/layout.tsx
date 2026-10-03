import * as React from "react";
import type { Metadata } from "next";
import { DashboardLayout, DashboardRoleProvider } from "@/components/layouts";

export const metadata: Metadata = {
  title: {
    default: "Panel Principal",
    template: "%s | SGA Carmelinas",
  },
  description:
    "Panel de Control y Gestión Académica de la Institución Educativa Carmelinas de Lircay, Huancavelica.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardRoleProvider initialRole="teacher">
      <DashboardLayout>{children}</DashboardLayout>
    </DashboardRoleProvider>
  );
}
