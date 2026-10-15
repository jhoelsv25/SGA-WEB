"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon, RefreshIcon } from "@hugeicons/core-free-icons";
import { DataTable } from "@/components/common/data-table";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import { Button } from "@/components/ui/button";
import { usePuedeGestionarAusencias } from "@/features/ausencias-docente/hooks";
import { RegistrarAusenciaModal } from "@/features/ausencias-docente/components/registro";
import { ModalReemplazo, getSesionesHoyColumns } from "./components";
import { usePanelSesionesHoy, usePuedeGestionarSesiones } from "./hooks";
import type { Sesion, SesionPanel } from "./types";

export function SesionesHoyPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = usePanelSesionesHoy();
  const puedeGestionar = usePuedeGestionarSesiones();
  const puedeGestionarAusencias = usePuedeGestionarAusencias();
  const [aReemplazar, setAReemplazar] = React.useState<Sesion | null>(null);
  const [aRegistrarAusencia, setARegistrarAusencia] = React.useState<Sesion | null>(null);

  const handleReemplazo = React.useCallback((sesion: SesionPanel) => {
    setAReemplazar(sesion);
  }, []);

  const handleRegistrarAusencia = React.useCallback((sesion: SesionPanel) => {
    setARegistrarAusencia(sesion);
  }, []);

  const columns = React.useMemo(
    () =>
      getSesionesHoyColumns({
        puedeGestionar,
        puedeGestionarAusencias,
        onReemplazo: handleReemplazo,
        onRegistrarAusencia: handleRegistrarAusencia,
      }),
    [puedeGestionar, puedeGestionarAusencias, handleReemplazo, handleRegistrarAusencia],
  );

  return (
    <div className="animate-in fade-in-50 flex flex-col gap-6 duration-300">
      <PageHeader
        title="Sesiones de hoy"
        description="Quién firmó cada sesión, a qué hora y con qué tema. Se actualiza solo cada 30 segundos."
        icon={Clock01Icon}
        breadcrumbs={[{ label: "Inicio", href: "/admin/dashboard" }, { label: "Sesiones de hoy" }]}
        actions={
          <Button
            type="button"
            variant="outline"
            onClick={() => void refetch()}
            disabled={isFetching}
            aria-label="Actualizar sesiones"
            className="min-h-10 gap-1.5 rounded-full px-3.5 text-xs font-semibold"
          >
            <HugeiconsIcon
              icon={RefreshIcon}
              className={`size-3.5 ${isFetching ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            <span className="hidden sm:inline">Actualizar</span>
          </Button>
        }
      />

      <PageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        errorTitle="No se pudo cargar el panel"
      >
        {data && (
          <div className="space-y-3">
            {data.sesiones.length > 0 && (
              <p role="status" className="text-sm">
                {data.sesiones.length} sesiones ·{" "}
                <span className={data.totalAlertas > 0 ? "text-destructive font-semibold" : ""}>
                  {data.totalAlertas} sin firma pasada la tolerancia
                </span>
              </p>
            )}

            <DataTable
              columns={columns}
              data={data.sesiones}
              pagination={false}
              emptyState={{
                title: "No hay sesiones programadas hoy",
                description:
                  "Puede ser un día sin clases, vacaciones o aún no hay horarios con docente.",
              }}
            />
          </div>
        )}
      </PageState>

      <ModalReemplazo
        sesion={aReemplazar}
        onOpenChange={(abierto) => !abierto && setAReemplazar(null)}
      />

      <RegistrarAusenciaModal
        sesion={aRegistrarAusencia}
        open={Boolean(aRegistrarAusencia)}
        onOpenChange={(abierto) => !abierto && setARegistrarAusencia(null)}
      />
    </div>
  );
}
