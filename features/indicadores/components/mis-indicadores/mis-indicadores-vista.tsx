"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Analytics01Icon, Calendar03Icon, UserIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { PageHeader } from "@/components/common/page-header";
import { ErrorState } from "@/components/common/page-state";
import { CardSkeleton, TableSkeleton } from "@/components/common/skeletons";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import { MENSAJES_INDICADORES } from "../../consts";
import { useMisIndicadoresQuery } from "../../hooks";
import { GraficoBarrasMisIndicadores } from "./grafico-barras-mis-indicadores";
import { MisIndicadoresCursosTabla } from "./mis-indicadores-cursos-tabla";
import { MisIndicadoresFiltro } from "./mis-indicadores-filtro";
import { TarjetaIndicadorDocente } from "./tarjeta-indicador-docente";
import { SeccionApoyo } from "../apoyo/seccion-apoyo";

export interface MisIndicadoresVistaProps {
  className?: string;
}

/**
 * Vista principal de Mis Indicadores para el docente autenticado.
 * Muestra el CSP (Sesiones) y el IGM (Materiales) propios, su desglose por cursos
 * y el gráfico vectorial comparativo.
 */
export function MisIndicadoresVista({ className = "" }: MisIndicadoresVistaProps) {
  const searchParams = useSearchParams();
  const periodoParam = searchParams.get("periodoId") ?? undefined;

  const [periodoSeleccionado, setPeriodoSeleccionado] = React.useState<string | undefined>(
    periodoParam,
  );

  const { anio } = useAnioLectivo();
  const bimestres = anio?.bimestres ?? [];

  const { data, isLoading, isError, error, refetch } = useMisIndicadoresQuery(periodoSeleccionado);

  const handlePeriodoChange = (nuevoPeriodoId?: string) => {
    setPeriodoSeleccionado(nuevoPeriodoId);
  };

  const breadcrumbs = [{ label: "Inicio", href: "/admin/dashboard" }, { label: "Mis indicadores" }];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Encabezado oficial con migas de pan y filtros */}
      <PageHeader
        title="Mis indicadores"
        description="Cumplimiento de sesiones planificadas (CSP) y gestión de materiales (IGM) en tus cursos asignados."
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
            {data?.docenteNombre && (
              <Badge variant="secondary" className="gap-1 text-xs">
                <HugeiconsIcon icon={UserIcon} size={13} />
                {data.docenteNombre}
              </Badge>
            )}
          </div>
        }
        actions={
          <MisIndicadoresFiltro
            bimestres={bimestres}
            periodoSeleccionado={periodoSeleccionado}
            onPeriodoChange={handlePeriodoChange}
          />
        }
      />

      {/* Estado de carga */}
      {isLoading && (
        <div className="space-y-6" aria-busy="true" aria-live="polite">
          <CardSkeleton count={2} className="grid grid-cols-1 md:grid-cols-2" />
          <div className="border-border/60 bg-card h-64 animate-pulse rounded-2xl border p-6" />
          <TableSkeleton rows={4} columns={4} />
        </div>
      )}

      {/* Estado de error */}
      {isError && !isLoading && (
        <ErrorState
          title="No se pudieron cargar tus indicadores"
          description={
            error instanceof Error
              ? error.message
              : "Ocurrió un inconveniente al consultar la información en el servidor."
          }
          onRetry={() => void refetch()}
        />
      )}

      {/* Estado exitoso */}
      {!isLoading && !isError && data && (
        <>
          {/* Si ambos indicadores están sin datos y no hay cursos */}
          {data.csp.sinDatos && data.igm.sinDatos && data.cursos.length === 0 ? (
            <EmptyState
              icon={Analytics01Icon}
              title="Sin registros para mostrar"
              description={MENSAJES_INDICADORES.SIN_DATOS}
            />
          ) : (
            <div className="space-y-6">
              {/* Tarjetas resumen de los dos indicadores propios */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <TarjetaIndicadorDocente indicador={data.csp} />
                <TarjetaIndicadorDocente indicador={data.igm} />
              </div>

              {/* Gráfico de barras vectorial en SVG propio */}
              <GraficoBarrasMisIndicadores
                cspPorcentaje={data.csp.porcentaje}
                igmPorcentaje={data.igm.porcentaje}
                cursos={data.cursos}
              />

              {/* Tabla detallada de cursos asignados con CSP e IGM */}
              <MisIndicadoresCursosTabla cursos={data.cursos} />
            </div>
          )}
        </>
      )}

      {/* Indicadores de apoyo propios (RF-020 V2): aparte de la tesis, sin ranking ni datos de otros */}
      <SeccionApoyo modo="docente" />
    </div>
  );
}
