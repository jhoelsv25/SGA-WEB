import type { Metadata } from "next";
import { ComputerIcon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { GuiaMarcado } from "@/features/biometrico/components/guia-marcado";
import { EquiposRelojView } from "@/features/biometrico/views/equipos-reloj-view";

export const metadata: Metadata = {
  title: "Equipos del reloj",
  description: "Aprobación de las computadoras con el programa del reloj.",
};

export default function AdminBiometricoEquiposRoute() {
  return (
    <div className="animate-in fade-in-50 space-y-6 duration-300">
      <PageHeader
        title="Equipos del reloj"
        description="Aprobación de las computadoras con el programa del reloj."
        icon={ComputerIcon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Biométrico" },
          { label: "Equipos del reloj" },
        ]}
      />
      <GuiaMarcado abierta />
      <EquiposRelojView />
    </div>
  );
}
