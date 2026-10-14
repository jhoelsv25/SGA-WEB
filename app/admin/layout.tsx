import * as React from "react";
import type { Metadata } from "next";
import { AdminGuard, DashboardLayout, DashboardRoleProvider } from "@/components/layouts";

export const metadata: Metadata = {
  title: {
    default: "Panel Principal",
    template: "%s | SGA Nuestra Señora del Carmen",
  },
  description:
    "Panel de Control y Gestión Académica de la I.E. De Mujeres Nuestra Señora del Carmen, Lircay, Huancavelica.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardRoleProvider>
      <AdminGuard>
        <DashboardLayout>{children}</DashboardLayout>
      </AdminGuard>
    </DashboardRoleProvider>
  );
}
