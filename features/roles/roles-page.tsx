"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { IdVerifiedIcon, ShieldCheckIcon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { RolesTable } from "./views/table/roles-table";

export function RolesPage() {
  return (
    <div className="animate-in fade-in-50 space-y-6 duration-300">
      <PageHeader
        title="Roles y Permisos"
        description="Administra los roles del sistema y su matriz de permisos."
        icon={ShieldCheckIcon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Administración" },
          { label: "Roles y Permisos" },
        ]}
        actions={
          <Button variant="outline" asChild>
            <Link href="/admin/cargos">
              <HugeiconsIcon icon={IdVerifiedIcon} className="size-4" />
              Cargos
            </Link>
          </Button>
        }
      />

      <RolesTable />
    </div>
  );
}
