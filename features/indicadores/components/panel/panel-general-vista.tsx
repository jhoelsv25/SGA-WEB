"use client";

import { Analytics01Icon, Calendar03Icon, RefreshIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { PageHeader } from "@/components/common/page-header";
import { ErrorState } from "@/components/common/page-state";
import { CardSkeleton } from "@/components/common/skeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import { usePanelGeneralQuery } from "../../hooks";
import { GraficoBarrasPanel } from "./grafico-barras-panel";
import { PanelIndicadoresBimestreCard } from "./panel-indicadores-bimestre-card";
import { PanelResumenAsistenciaCard } from "./panel-resumen-asistencia-card";
import { PanelResumenLibretasCard } from "./panel-resumen-libretas-card";
import { PanelResumenSesionesCard } from "./panel-resumen-sesiones-card";

export interface PanelGeneralVistaProps {
  className?: string;
}

/**
 * Vista del panel general de apoyo directivo (Director, Subdirector, Administrador).
 * Reúne las métricas prioritarias del día: asistencia al colegio, tardanzas en puerta,
 * sesiones de clase programadas y libretas pendientes, junto con los indicadores de la tesis.
 */
export function PanelGeneralVista({ className = "" }: PanelGeneralVistaProps) {
  const { anio } = useAnioLectivo();
  const { data, isLoading, isError, error, refetch, isFetching } = usePanelGeneralQuery();

  const breadcrumbs = [{ label: "Inicio", href: "/admin/dashboard" }, { label: "Panel general" }];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Encabezado del panel directivo */}
      <PageHeader
        title="Panel general de apoyo directivo"
        description="Resumen operativo en tiempo real de asistencia, tardanzas, sesiones de clase y libretas del día."
        icon={Analytics01Icon}
        breadcrumbs={breadcrumbs}
        badge={
          <div className="flex flex-wrap items-center gap-1.5">
            {anio && (
              <Badge variant="outline" className="gap-1 text-xs">
                <HugeiconsIcon icon={Calendar03Icon} size={13} />
                Año académico {anio.anio}
              </Badge>
            )}
            {data?.fecha && (
              <Badge variant="secondary" className="text-xs">
                Fecha: {data.fecha}
              </Badge>
            )}
          </div>
        }
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="gap-2 text-xs"
          >
            <HugeiconsIcon
              icon={RefreshIcon}
              size={14}
              className={isFetching ? "animate-spin" : ""}
            />
            <span>Actualizar</span>
          </Button>
        }
      />

      {/* Estado de carga */}
      {isLoading && (
        <div className="space-y-6" aria-busy="true" aria-live="polite">
          <CardSkeleton count={4} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="border-border/60 bg-card h-64 animate-pulse rounded-2xl border p-6" />
            <div className="border-border/60 bg-card h-64 animate-pulse rounded-2xl border p-6" />
          </div>
        </div>
      )}

      {/* Estado de error */}
      {isError && !isLoading && (
        <ErrorState
          title="No se pudo cargar el panel directivo"
          description={
            error instanceof Error
              ? error.message
              : "Ocurrió un error al consultar las métricas del día en el servidor."
          }
          onRetry={() => void refetch()}
        />
      )}

      {/* Estado con datos disponibles */}
      {!isLoading && !isError && data && (
        <div className="space-y-6">
          {/* Mosaico de tarjetas resumen principales */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-2">
            <PanelResumenAsistenciaCard
              asistencia={data.asistenciaHoy}
              tardanzas={data.tardanzasHoy}
            />
            <PanelResumenSesionesCard sesiones={data.sesionesHoy} />
            <PanelResumenLibretasCard libretas={data.libretasPendientes} />
            <PanelIndicadoresBimestreCard indicadores={data.indicadoresBimestreActual} />
          </div>

          {/* Gráficos vectoriales en SVG nativo propio */}
          <GraficoBarrasPanel
            sesionesHoy={data.sesionesHoy}
            indicadoresBimestreActual={data.indicadoresBimestreActual}
          />
        </div>
      )}
    </div>
  );
}
