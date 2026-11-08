"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  RefreshIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { DataTable } from "@/components/common/data-table";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePuedeGestionarAusencias } from "@/features/ausencias-docente/hooks";
import { RegistrarAusenciaModal } from "@/features/ausencias-docente/components/registro";
import { ModalReemplazo } from "./components";
import { getSesionesHoyColumns } from "./views";
import { usePanelSesionesHoy, usePuedeGestionarSesiones } from "./hooks";
import type { Sesion, SesionPanel } from "./types";

export function SesionesHoyPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = usePanelSesionesHoy();
  const puedeGestionar = usePuedeGestionarSesiones();
  const puedeGestionarAusencias = usePuedeGestionarAusencias();
  const [aReemplazar, setAReemplazar] = React.useState<Sesion | null>(null);
  const [aRegistrarAusencia, setARegistrarAusencia] = React.useState<Sesion | null>(null);

  // Filtros reactivos
  const [busqueda, setBusqueda] = React.useState("");
  const [filtroEstado, setFiltroEstado] = React.useState<
    "todas" | "alertas" | "firmadas" | "pendientes"
  >("todas");

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

  // Cálculos de métricas ejecutivas
  const metricas = React.useMemo(() => {
    const sesiones = data?.sesiones ?? [];
    const total = sesiones.length;
    const alertas = data?.totalAlertas ?? sesiones.filter((s) => s.alerta).length;
    const firmadas = sesiones.filter((s) =>
      ["cumplida", "parcial", "en_curso"].includes(s.estado),
    ).length;
    const pendientes = sesiones.filter((s) => s.estado === "pendiente" && !s.alerta).length;

    return { total, alertas, firmadas, pendientes };
  }, [data]);

  // Filtrado reactivo de sesiones
  const sesionesFiltradas = React.useMemo(() => {
    const sesiones = data?.sesiones ?? [];
    return sesiones.filter((s) => {
      const matchBusqueda =
        !busqueda ||
        s.docenteNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        s.cursoNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        s.seccionNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        (s.tema && s.tema.toLowerCase().includes(busqueda.toLowerCase()));

      let matchEstado = true;
      if (filtroEstado === "alertas") matchEstado = Boolean(s.alerta);
      else if (filtroEstado === "firmadas") {
        matchEstado = ["cumplida", "parcial", "en_curso"].includes(s.estado);
      } else if (filtroEstado === "pendientes") {
        matchEstado = s.estado === "pendiente" && !s.alerta;
      }

      return matchBusqueda && matchEstado;
    });
  }, [data?.sesiones, busqueda, filtroEstado]);

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
            className="min-h-10 gap-1.5 rounded-full px-3.5 text-xs font-semibold shadow-2xs"
          >
            <HugeiconsIcon
              icon={RefreshIcon}
              className={`size-3.5 ${isFetching ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            <span className="hidden sm:inline">Actualizar en vivo</span>
          </Button>
        }
      />

      <PageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        errorTitle="No se pudo cargar el panel de sesiones"
      >
        {data && (
          <div className="space-y-6">
            {/* KPI Cards Ejecutivas */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="border-border/80 bg-card flex flex-col justify-between rounded-2xl border p-4 shadow-xs">
                <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                  <HugeiconsIcon icon={Clock01Icon} size={15} />
                  <span>Programadas</span>
                </span>
                <p className="text-foreground mt-2 text-2xl font-extrabold tracking-tight">
                  {metricas.total}
                </p>
                <span className="text-muted-foreground/80 text-[11px]">En la jornada de hoy</span>
              </div>

              <div className="flex flex-col justify-between rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 shadow-xs">
                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} />
                  <span>Firmadas / En curso</span>
                </span>
                <p className="mt-2 text-2xl font-extrabold tracking-tight text-emerald-700 dark:text-emerald-400">
                  {metricas.firmadas}
                </p>
                <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80">
                  {metricas.total > 0
                    ? `${Math.round((metricas.firmadas / metricas.total) * 100)}% del total`
                    : "0%"}
                </span>
              </div>

              <div
                className={`flex flex-col justify-between rounded-2xl border p-4 shadow-xs ${
                  metricas.alertas > 0
                    ? "border-destructive/30 bg-destructive/5 text-destructive"
                    : "border-border/80 bg-card text-muted-foreground"
                }`}
              >
                <span className="flex items-center gap-1.5 text-xs font-medium">
                  <HugeiconsIcon icon={AlertCircleIcon} size={15} />
                  <span>Alertas de tolerancia</span>
                </span>
                <p
                  className={`mt-2 text-2xl font-extrabold tracking-tight ${
                    metricas.alertas > 0 ? "text-destructive" : "text-foreground"
                  }`}
                >
                  {metricas.alertas}
                </p>
                <span className="text-[11px]">
                  {metricas.alertas > 0 ? "Requieren reemplazo o descargo" : "Todo bajo control"}
                </span>
              </div>

              <div className="border-border/80 bg-card flex flex-col justify-between rounded-2xl border p-4 shadow-xs">
                <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                  <HugeiconsIcon icon={Clock01Icon} size={15} />
                  <span>Pendientes</span>
                </span>
                <p className="text-foreground mt-2 text-2xl font-extrabold tracking-tight">
                  {metricas.pendientes}
                </p>
                <span className="text-muted-foreground/80 text-[11px]">
                  Por iniciar en su horario
                </span>
              </div>
            </div>

            {/* Barra de Búsqueda y Filtros Rápidos */}
            <div className="border-border/80 bg-card flex flex-col justify-between gap-3 rounded-2xl border p-4 shadow-xs sm:flex-row sm:items-center">
              <div className="relative max-w-md min-w-60 flex-1">
                <HugeiconsIcon
                  icon={Search01Icon}
                  size={16}
                  className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
                />
                <Input
                  placeholder="Buscar docente, curso, sección o tema..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="h-9 rounded-xl pr-3 pl-9 text-xs"
                />
              </div>

              {/* Segmented Pills de Estado */}
              <div className="bg-muted/60 flex flex-wrap items-center rounded-xl p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setFiltroEstado("todas")}
                  className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                    filtroEstado === "todas"
                      ? "bg-card text-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Todas ({metricas.total})
                </button>
                <button
                  type="button"
                  onClick={() => setFiltroEstado("alertas")}
                  className={`flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                    filtroEstado === "alertas"
                      ? "bg-card text-destructive font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {metricas.alertas > 0 && (
                    <span className="bg-destructive size-1.5 rounded-full" />
                  )}
                  <span>Alertas ({metricas.alertas})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFiltroEstado("firmadas")}
                  className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                    filtroEstado === "firmadas"
                      ? "bg-card font-semibold text-emerald-700 shadow-xs dark:text-emerald-400"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Firmadas ({metricas.firmadas})
                </button>
                <button
                  type="button"
                  onClick={() => setFiltroEstado("pendientes")}
                  className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                    filtroEstado === "pendientes"
                      ? "bg-card text-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Pendientes ({metricas.pendientes})
                </button>
              </div>
            </div>

            {/* Tabla de Sesiones */}
            <DataTable
              columns={columns}
              data={sesionesFiltradas}
              pagination={false}
              caption="Supervisión en vivo de sesiones de clase del día"
              emptyState={{
                title:
                  busqueda || filtroEstado !== "todas"
                    ? "No se encontraron sesiones"
                    : "No hay sesiones programadas hoy",
                description:
                  busqueda || filtroEstado !== "todas"
                    ? "Prueba cambiando el término de búsqueda o el filtro seleccionado."
                    : "Puede ser un día sin clases, vacaciones o aún no hay horarios con docente.",
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
