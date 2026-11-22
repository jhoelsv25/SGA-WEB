"use client";

import Link from "next/link";
import { Download01Icon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ReportesSinAcceso() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Centro de Reportes"
        description="Módulo reservado a Dirección, Secretaría y Administración."
        icon={Download01Icon}
      />
      <Card>
        <CardContent className="flex flex-col gap-3 py-8 text-sm">
          <p className="text-muted-foreground">
            Tu rol actual no tiene acceso a los reportes institucionales globales. Puedes consultar
            tus reportes propios desde las opciones asignadas a tu rol (como{" "}
            <strong>Mis libretas</strong>, <strong>Mis indicadores</strong> o{" "}
            <strong>Mi asistencia</strong>).
          </p>
          <div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/dashboard">Volver al panel principal</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
