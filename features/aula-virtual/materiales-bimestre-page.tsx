"use client";

import { ChartBarLineIcon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { MaterialesBimestreTable } from "./views/materiales-bimestre-table";

export function MaterialesBimestrePage() {
  return (
    <div className="animate-in fade-in-50 flex flex-col gap-6 duration-300">
      <PageHeader
        title="Materiales del bimestre"
        description="Cumplimiento de los materiales planificados por docente y curso (indicador IGM)."
        icon={ChartBarLineIcon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Materiales del bimestre" },
        ]}
      />

      <MaterialesBimestreTable />
    </div>
  );
}
