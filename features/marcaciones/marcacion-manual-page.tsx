"use client";

import { Clock01Icon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { FormularioMarcacionManual } from "./components";

export function MarcacionManualPage() {
  return (
    <div className="animate-in fade-in-50 flex flex-col gap-6 duration-300">
      <PageHeader
        title="Marcación manual"
        description="Registre la marcación de quien no pudo usar el kiosko, con la hora real y el motivo."
        icon={Clock01Icon}
        breadcrumbs={[{ label: "Inicio", href: "/admin/dashboard" }, { label: "Marcación manual" }]}
      />
      <FormularioMarcacionManual />
    </div>
  );
}
