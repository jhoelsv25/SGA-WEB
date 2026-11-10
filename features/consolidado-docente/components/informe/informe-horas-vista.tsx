"use client";

import * as React from "react";
import { FileExportIcon, Clock01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { PageHeader } from "@/components/common/page-header";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/toast";
import { descargarInformeMensualExcel, guardarArchivoEnNavegador } from "../../api";

const FORMATO_MES = /^\d{4}-(0[1-9]|1[0-2])$/;

function mesActual(): string {
  const hoy = new Date();
  return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}`;
}

export function InformeHorasVista() {
  const [mes, setMes] = React.useState(mesActual);
  const [descargando, setDescargando] = React.useState(false);
  const [mensaje, setMensaje] = React.useState<string | null>(null);
  const mesValido = FORMATO_MES.test(mes);

  const handleDescargar = async () => {
    setMensaje(null);
    setDescargando(true);
    try {
      guardarArchivoEnNavegador(await descargarInformeMensualExcel(mes));
      toast.success("Informe generado.");
    } catch (error) {
      // Un mes sin sesiones responde 404 con su propio mensaje; se muestra tal cual.
      setMensaje(error instanceof Error ? error.message : "No se pudo generar el informe.");
    } finally {
      setDescargando(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Informe mensual de horas efectivas"
        description="Horas programadas, dictadas y perdidas por docente en el mes elegido."
        icon={Clock01Icon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Informe de horas efectivas" },
        ]}
      />

      <div className="border-border/60 bg-card max-w-xl space-y-4 rounded-2xl border p-5 shadow-xs">
        <div className="space-y-1.5">
          <Label htmlFor="mes" className="text-sm font-medium">
            Mes (AAAA-MM)
          </Label>
          <Input
            id="mes"
            type="month"
            value={mes}
            onChange={(e) => {
              setMes(e.target.value);
              setMensaje(null);
            }}
            disabled={descargando}
            aria-invalid={!mesValido}
          />
          {!mesValido && (
            <p className="text-destructive text-xs font-medium">Elija un mes válido.</p>
          )}
        </div>

        {mensaje && (
          <p role="alert" className="border-warning/30 bg-warning/10 rounded-xl border p-3 text-xs">
            {mensaje}
          </p>
        )}

        <div className="flex items-center justify-between gap-3">
          <p className="text-muted-foreground text-xs">
            El archivo se descarga para uso interno. El sistema no lo envía a ninguna instancia.
          </p>
          <Button
            onClick={handleDescargar}
            disabled={!mesValido || descargando}
            className="gap-1.5"
          >
            {descargando ? (
              <Spinner className="size-3.5" />
            ) : (
              <HugeiconsIcon icon={FileExportIcon} className="size-3.5" />
            )}
            <span>Descargar Excel</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
