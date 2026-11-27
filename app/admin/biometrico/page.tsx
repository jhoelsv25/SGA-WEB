import type { Metadata } from "next";
import { Clock01Icon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { GuiaMarcado } from "@/features/biometrico/components/guia-marcado";
import { HorasSincronizacionView } from "@/features/biometrico/views/horas-sincronizacion-view";

export const metadata: Metadata = {
  title: "Horas de sincronización",
  description: "Horas en las que el programa del reloj trae las marcas.",
};

export default function AdminBiometricoHorasRoute() {
  return (
    <div className="animate-in fade-in-50 space-y-6 duration-300">
      <PageHeader
        title="Horas de sincronización"
        description="Horas en las que el programa del reloj trae las marcas."
        icon={Clock01Icon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Biométrico" },
          { label: "Horas de sincronización" },
        ]}
      />
      <GuiaMarcado />
      <HorasSincronizacionView />
    </div>
  );
}
