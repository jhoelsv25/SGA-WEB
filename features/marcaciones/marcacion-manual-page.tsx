import Link from "next/link";
import { Clock01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { FormularioMarcacionManual } from "./components";

export function MarcacionManualPage() {
  return (
    <div className="animate-in fade-in-50 flex flex-col gap-6 duration-300">
      <PageHeader
        title="Marcación manual"
        description="Registre la marcación de quien no pudo usar el kiosko, con la hora real y el motivo."
        icon={Clock01Icon}
        breadcrumbs={[{ label: "Inicio", href: "/admin/dashboard" }, { label: "Marcación manual" }]}
        actions={
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link href="/admin/marcaciones-hoy">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4 text-emerald-500" />
              <span>Ver marcaciones de hoy</span>
            </Link>
          </Button>
        }
      />
      <FormularioMarcacionManual />
    </div>
  );
}
