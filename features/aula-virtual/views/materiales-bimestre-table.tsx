"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  FileEditIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/common/status-badge";
import { DataTable } from "@/components/common/data-table";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import { formatearBimestre } from "../utils";
import { useSeguimiento } from "../hooks";
import { getMaterialesBimestreColumns } from "./columns/materiales-bimestre-columns";

export function MaterialesBimestreTable() {
  const { anio } = useAnioLectivo();
  const bimestres = React.useMemo(() => anio?.bimestres ?? [], [anio?.bimestres]);
  const enCurso = React.useMemo(
    () => bimestres.find((b) => b.estado === "en_curso") ?? bimestres[0],
    [bimestres],
  );
  const [periodoSeleccionado, setPeriodoSeleccionado] = React.useState<string | null>(null);
  const [busqueda, setBusqueda] = React.useState("");

  const periodoId = periodoSeleccionado ?? enCurso?.id ?? "";
  const { data, isLoading, isError, refetch } = useSeguimiento(periodoId || undefined);

  const columns = React.useMemo(() => getMaterialesBimestreColumns(), []);

  // Filtrado reactivo de filas por docente o curso
  const filasFiltradas = React.useMemo(() => {
    const filas = data?.filas ?? [];
    if (!busqueda.trim()) return filas;
    const q = busqueda.toLowerCase();
    return filas.filter(
      (f) =>
        f.docenteNombre.toLowerCase().includes(q) ||
        f.cursoNombre.toLowerCase().includes(q) ||
        f.seccionNombre.toLowerCase().includes(q),
    );
  }, [data?.filas, busqueda]);

  return (
    <div className="space-y-6">
      {/* Selector de Bimestres con Segmented Control Moderno */}
      {bimestres.length > 0 && (
        <div className="border-border/80 bg-card flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Bimestre académico:
            </span>
          </div>

          <div className="bg-muted/60 flex flex-wrap items-center rounded-xl p-0.5 text-xs">
            {bimestres.map((b) => {
              const esActivo = periodoId === b.id;
              const esEnCurso = b.estado === "en_curso";

              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setPeriodoSeleccionado(b.id)}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    esActivo
                      ? "bg-card text-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {esEnCurso && (
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                  )}
                  <span>{formatearBimestre(b.nombre)}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* KPI Cards Ejecutivas del Bimestre */}
      {data && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {/* Cumplimiento Global IGM */}
          <div className="border-border/80 bg-card col-span-2 flex flex-col justify-between rounded-2xl border p-4 shadow-xs sm:col-span-1">
            <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4" />
              <span>Cumplimiento IGM</span>
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-foreground text-2xl font-extrabold tracking-tight">
                {data.totales.porcentajeATiempo}%
              </span>
              <StatusBadge
                tone={data.totales.porcentajeATiempo >= 80 ? "success" : "warning"}
                className="text-[10px]"
              >
                {data.totales.porcentajeATiempo >= 80 ? "Óptimo" : "Mejorable"}
              </StatusBadge>
            </div>
            <span className="text-muted-foreground/80 text-[11px]">Materiales a tiempo</span>
          </div>

          {/* Planificados */}
          <div className="border-border/80 bg-card flex flex-col justify-between rounded-2xl border p-4 shadow-xs">
            <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
              <HugeiconsIcon icon={Calendar03Icon} className="size-4" />
              <span>Planificados</span>
            </span>
            <p className="text-foreground mt-2 text-2xl font-extrabold tracking-tight">
              {data.totales.planificados}
            </p>
            <span className="text-muted-foreground/80 text-[11px]">En la malla bimestral</span>
          </div>

          {/* Publicados A Tiempo */}
          <div className="flex flex-col justify-between rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 shadow-xs">
            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4" />
              <span>A tiempo</span>
            </span>
            <p className="mt-2 text-2xl font-extrabold tracking-tight text-emerald-700 dark:text-emerald-400">
              {data.totales.aTiempo}
            </p>
            <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80">
              Dentro del plazo
            </span>
          </div>

          {/* Fuera de plazo o no publicados */}
          <div className="flex flex-col justify-between rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 shadow-xs">
            <span className="flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400">
              <HugeiconsIcon icon={Clock01Icon} className="size-4" />
              <span>Con retraso</span>
            </span>
            <p className="mt-2 text-2xl font-extrabold tracking-tight text-amber-700 dark:text-amber-400">
              {data.totales.fueraDePlazo + data.totales.noPublicados}
            </p>
            <span className="text-[11px] text-amber-600/80 dark:text-amber-400/80">
              {data.totales.fueraDePlazo} tarde · {data.totales.noPublicados} sin publicar
            </span>
          </div>

          {/* Solicitudes de cambio de fecha */}
          <div className="border-border/80 bg-card flex flex-col justify-between rounded-2xl border p-4 shadow-xs">
            <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
              <HugeiconsIcon icon={FileEditIcon} className="size-4" />
              <span>Solicitudes</span>
            </span>
            <p className="text-foreground mt-2 text-2xl font-extrabold tracking-tight">
              {data.totales.solicitudesPendientes}
            </p>
            <span className="text-muted-foreground/80 text-[11px]">Cambio de fecha pendientes</span>
          </div>
        </div>
      )}

      {/* Barra de Búsqueda de Docente o Materia */}
      <div className="border-border/80 bg-card flex items-center justify-between gap-3 rounded-2xl border p-3 shadow-xs">
        <div className="relative max-w-sm min-w-60 flex-1">
          <HugeiconsIcon
            icon={Search01Icon}
            size={16}
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
          />
          <Input
            placeholder="Buscar docente o materia..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="h-9 rounded-xl pr-3 pl-9 text-xs"
          />
        </div>

        <span className="text-muted-foreground pr-2 text-xs font-medium">
          {filasFiltradas.length}{" "}
          {filasFiltradas.length === 1 ? "curso supervisado" : "cursos supervisados"}
        </span>
      </div>

      {/* Tabla con DataTable */}
      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={filasFiltradas}
          isLoading={isLoading}
          isError={isError}
          onRetry={() => void refetch()}
          pagination={false}
          caption="Seguimiento de cumplimiento de materiales planificados por docente y curso"
          emptyState={{
            title: busqueda ? "Sin resultados" : "Sin materiales planificados",
            description: busqueda
              ? "Prueba cambiando el término de búsqueda."
              : "Ningún docente ha planificado materiales en este bimestre.",
          }}
        />
      </div>
    </div>
  );
}
