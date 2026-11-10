"use client";

import * as React from "react";
import { Download01Icon, InformationCircleIcon, Clock01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/common/page-state";
import { CardSkeleton, TableSkeleton } from "@/components/common/skeletons";
import { Spinner } from "@/components/common/spinner";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import { toast } from "@/lib/toast";
import { descargarExcelApoyo } from "../../api";
import { TITULO_SECCION_APOYO } from "../../consts";
import { useApoyoQuery, useMisApoyoQuery } from "../../hooks";
import type { FiltroApoyoQueryDto, FiltroIndicadoresQueryDto, IndicadorApoyo } from "../../types";
import { valorCortoApoyo } from "../../utils";
import { TableroFiltros } from "../tablero/tablero-filtros";
import { EvolucionApoyo } from "./evolucion-apoyo";
import { RankingApoyoTabla } from "./ranking-apoyo-tabla";
import { TarjetaApoyo } from "./tarjeta-apoyo";

interface SeccionApoyoProps {
  /** `directivo`: Director, Subdirector o Administrador (con ranking y Excel). `docente`: solo lo propio. */
  modo: "directivo" | "docente";
}

/**
 * Sección «Indicadores de apoyo» del seguimiento docente (RF-020 V2).
 * Va separada de CSP, ISA e IGM, no se congela y no tiene meta ni semáforo.
 */
export function SeccionApoyo({ modo }: SeccionApoyoProps) {
  const esDirectivo = modo === "directivo";
  const { anio } = useAnioLectivo();
  const [filtros, setFiltros] = React.useState<FiltroIndicadoresQueryDto>({});
  const [ordenarPor, setOrdenarPor] = React.useState<IndicadorApoyo>("jornadasEfectivas");
  const [orden, setOrden] = React.useState<"asc" | "desc">("desc");
  const [exportando, setExportando] = React.useState(false);

  const consulta = React.useMemo<FiltroApoyoQueryDto>(
    () => (esDirectivo ? { ...filtros, ordenarPor, orden } : { ...filtros }),
    [esDirectivo, filtros, ordenarPor, orden],
  );
  const habilitado = Boolean(anio?.id);
  const directivo = useApoyoQuery(consulta, habilitado && esDirectivo);
  const propio = useMisApoyoQuery(consulta, habilitado && !esDirectivo);
  const { data, isLoading, isError, error, refetch, isFetching } = esDirectivo ? directivo : propio;

  const alternarOrden = (columna: IndicadorApoyo) => {
    if (columna === ordenarPor) {
      setOrden((actual) => (actual === "desc" ? "asc" : "desc"));
    } else {
      setOrdenarPor(columna);
      setOrden("desc");
    }
  };

  const exportar = async () => {
    setExportando(true);
    try {
      await descargarExcelApoyo(consulta);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo exportar el archivo.");
    } finally {
      setExportando(false);
    }
  };

  const bimestres = anio?.bimestres ?? [];

  return (
    <section className="space-y-6" aria-label={TITULO_SECCION_APOYO}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-foreground text-lg font-semibold">
            {data?.titulo ?? TITULO_SECCION_APOYO}
          </h2>
          {data?.mensaje && (
            <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <HugeiconsIcon icon={InformationCircleIcon} size={14} className="shrink-0" />
              {data.mensaje}
            </p>
          )}
        </div>
        {esDirectivo && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void exportar()}
            disabled={exportando || !data}
            className="gap-2"
          >
            {exportando ? <Spinner /> : <HugeiconsIcon icon={Download01Icon} size={15} />}
            Exportar a Excel
          </Button>
        )}
      </div>

      <TableroFiltros
        filtros={filtros}
        onChange={setFiltros}
        onLimpiar={() => setFiltros({})}
        bimestres={bimestres}
        cargando={isFetching}
        modo="apoyo"
        ocultarDocente={!esDirectivo}
      />

      {isLoading && (
        <div className="space-y-6" aria-busy="true" aria-live="polite">
          <CardSkeleton count={3} className="grid grid-cols-1 md:grid-cols-3" />
          {esDirectivo && <TableSkeleton rows={4} columns={4} />}
        </div>
      )}

      {isError && !isLoading && (
        <ErrorState
          title="No se pudieron cargar los indicadores de apoyo"
          description={error instanceof Error ? error.message : undefined}
          onRetry={() => void refetch()}
        />
      )}

      {data && !isLoading && !isError && (
        <>
          {data.enCurso && data.mensajeEnCurso && (
            <Alert className="border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200">
              <HugeiconsIcon icon={Clock01Icon} size={18} className="shrink-0 text-amber-600" />
              <AlertDescription className="text-xs">{data.mensajeEnCurso}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <TarjetaApoyo
              titulo="Jornadas efectivas"
              valor={valorCortoApoyo(data.resumen, "jornadasEfectivas")}
              etiquetaSinDatos={data.etiquetaSinDatos}
              detalles={[
                `${data.resumen.jornadasEfectivas.minutosEfectivos} de ${data.resumen.jornadasEfectivas.minutosProgramados} min programados`,
              ]}
            />
            <TarjetaApoyo
              titulo="Minutos perdidos"
              valor={valorCortoApoyo(data.resumen, "minutosPerdidos")}
              etiquetaSinDatos={data.etiquetaSinDatos}
              detalles={[
                `Promedio por sesión: ${valorCortoApoyo(data.resumen, "promedioMinutosPerdidos") ?? data.etiquetaSinDatos}`,
                `${data.resumen.minutosPerdidos.sesionesEjecutadas} sesiones ejecutadas`,
              ]}
            />
            <TarjetaApoyo
              titulo="Puntualidad"
              valor={valorCortoApoyo(data.resumen, "puntualidad")}
              etiquetaSinDatos={data.etiquetaSinDatos}
              detalles={[
                `${data.resumen.puntualidad.puntuales} de ${data.resumen.puntualidad.sesionesConIngreso} sesiones con ingreso`,
              ]}
            />
            <TarjetaApoyo
              titulo="Minutos fuera del aula"
              valor={valorCortoApoyo(data.resumen, "minutosFueraAula")}
              etiquetaSinDatos={data.etiquetaSinDatos}
              detalles={[`${data.resumen.minutosFueraAula.supervisiones} supervisiones`]}
            />
            <TarjetaApoyo
              titulo="Tiempo de resolución de justificaciones"
              valor={valorCortoApoyo(data.resumen, "tiempoResolucion")}
              etiquetaSinDatos={data.etiquetaSinDatos}
              detalles={[
                `${data.resumen.tiempoResolucion.resueltas} resueltas · ${data.resumen.tiempoResolucion.vencidas} vencidas`,
              ]}
            />
          </div>

          {esDirectivo && data.ranking && (
            <RankingApoyoTabla
              filas={data.ranking}
              etiquetaSinDatos={data.etiquetaSinDatos}
              ordenarPor={ordenarPor}
              orden={orden}
              onOrdenar={alternarOrden}
            />
          )}

          <EvolucionApoyo evolucion={data.evolucion} etiquetaSinDatos={data.etiquetaSinDatos} />
        </>
      )}
    </section>
  );
}
