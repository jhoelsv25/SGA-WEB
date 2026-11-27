import type { Metadata } from "next";
import { RefreshIcon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { GuiaMarcado } from "@/features/biometrico/components/guia-marcado";
import { UltimaSincronizacionView } from "@/features/biometrico/views/ultima-sincronizacion-view";

export const metadata: Metadata = {
  title: "Última sincronización",
  description: "Estado de la última sincronización de cada reloj.",
};

export default function AdminBiometricoSincronizacionesRoute() {
  return (
    <div className="animate-in fade-in-50 space-y-6 duration-300">
      <PageHeader
        title="Última sincronización"
        description="Estado de la última sincronización de cada reloj."
        icon={RefreshIcon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Biométrico" },
          { label: "Última sincronización" },
        ]}
      />
      <GuiaMarcado />
      <UltimaSincronizacionView />
    </div>
  );
}
