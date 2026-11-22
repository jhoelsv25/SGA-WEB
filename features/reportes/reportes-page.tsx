"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  ModalGenerarReporte,
  ReporteCatalogCard,
  ReportesColaPanel,
  ReportesSinAcceso,
} from "./components";
import { CATEGORIAS_REPORTES } from "./constants";
import { type FiltroCategoriaTab, useReportes } from "./hooks";

export function ReportesPage() {
  const {
    anio,
    permisos,
    grados,
    secciones,
    categoriaTab,
    setCategoriaTab,
    busqueda,
    setBusqueda,
    reportesPermitidos,
    reportesVisibles,
    reporteActivo,
    setReporteActivo,
    trabajos,
    encolando,
    encolarReporte,
    descargandoKey,
    descargadosIds,
    eliminandoId,
    limpiandoTrabajos,
    ejecutarDescarga,
    descargarTrabajo,
    eliminarTrabajo,
    limpiarTrabajos,
  } = useReportes();

  if (!permisos.tieneAcceso) {
    return <ReportesSinAcceso />;
  }

  const tabsCategorias: Array<{ id: FiltroCategoriaTab; label: string; total: number }> = [
    { id: "todos", label: "Todos", total: reportesPermitidos.length },
    ...CATEGORIAS_REPORTES.map((c) => ({
      id: c.id as FiltroCategoriaTab,
      label: c.label,
      total: reportesPermitidos.filter((r) => r.categoria === c.id).length,
    })).filter((c) => c.total > 0),
  ];

  return (
    <div className="animate-in fade-in-50 space-y-6 duration-300">
      <PageHeader
        title="Centro de Reportes"
        description="Elija un reporte para configurar sus filtros específicos y generarlo en Excel o PDF."
        icon={Download01Icon}
        badge={anio ? `Año ${anio.anio}` : undefined}
        breadcrumbs={[{ label: "Inicio", href: "/admin/dashboard" }, { label: "Reportes" }]}
      />

      {/* Panel de descargas recientes (aparece cuando hay reportes recientes o en proceso) */}
      <ReportesColaPanel
        trabajos={trabajos}
        descargandoKey={descargandoKey}
        descargadosIds={descargadosIds}
        eliminandoId={eliminandoId}
        limpiandoTrabajos={limpiandoTrabajos}
        onDescargarTrabajo={descargarTrabajo}
        onEliminarTrabajo={eliminarTrabajo}
        onLimpiarTrabajos={limpiarTrabajos}
      />

      {/* Barra de búsqueda y pestañas de categoría */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          {tabsCategorias.map((tab) => {
            const activa = categoriaTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCategoriaTab(tab.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all",
                  activa
                    ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                    : "bg-card border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "py-0.2 rounded-full px-1.5 text-[10px] font-semibold",
                    activa ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted",
                  )}
                >
                  {tab.total}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <HugeiconsIcon
            icon={Search01Icon}
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          />
          <Input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar reporte..."
            className="h-9 rounded-full pl-9 text-xs"
          />
        </div>
      </div>

      {/* Grid de Cards del Catálogo */}
      {reportesVisibles.length === 0 ? (
        <div className="border-border/60 bg-card rounded-2xl border py-12 text-center">
          <p className="text-muted-foreground text-sm">
            No se encontraron reportes que coincidan con «{busqueda}».
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {reportesVisibles.map((reporte) => (
            <ReporteCatalogCard key={reporte.id} reporte={reporte} onSelect={setReporteActivo} />
          ))}
        </div>
      )}

      {/* Modal dedicado con los filtros exactos del reporte elegido */}
      {reporteActivo ? (
        <ModalGenerarReporte
          key={reporteActivo.id}
          reporte={reporteActivo}
          onClose={() => setReporteActivo(null)}
          anio={anio}
          grados={grados}
          secciones={secciones}
          encolando={encolando}
          descargandoKey={descargandoKey}
          onEncolar={encolarReporte}
          onDescargarDirecto={ejecutarDescarga}
        />
      ) : null}
    </div>
  );
}
