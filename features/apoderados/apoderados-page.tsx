"use client";

import * as React from "react";
import { RegistroPersonaAcciones } from "@/features/personas/components/registro-persona-acciones";
import type { Persona } from "@/features/personas/types/personas.types";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  FileExportIcon,
  Key01Icon,
  ShieldCheckIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { ListToolbar } from "@/components/common/list-toolbar";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useListFilters } from "@/hooks/use-list-filters";
import { useExportarReporte } from "@/hooks/use-exportar-reporte";
import { apoderadoFilterDefs } from "./config/filters";
import { useApoderadosQuery, useResumenApoderadosQuery } from "./hooks/use-apoderados";
import { ApoderadosTable } from "./views/apoderados-table";
import { CreateApoderadoModal } from "./components/modals/create-apoderado-modal";

export function ApoderadosPage() {
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [personaElegida, setPersonaElegida] = React.useState<Persona | null>(null);

  const abrirRegistro = (persona: Persona | null) => {
    setPersonaElegida(persona);
    setCreateModalOpen(true);
  };

  // Filtros sincronizados con la URL
  const listFilters = useListFilters(apoderadoFilterDefs);
  const search = listFilters.getString("search");
  const gradoRaw = listFilters.getString("gradoInstruccion");
  const gradoInstruccion = gradoRaw && gradoRaw !== "all" ? gradoRaw : undefined;

  // Paginación por cursores
  const limit = 10;
  const [cursorHistory, setCursorHistory] = React.useState<(string | null)[]>([null]);
  const [pageIndex, setPageIndex] = React.useState<number>(0);
  const currentCursor = cursorHistory[pageIndex] ?? null;

  const [prevFilters, setPrevFilters] = React.useState({
    search,
    gradoInstruccion,
  });

  if (prevFilters.search !== search || prevFilters.gradoInstruccion !== gradoInstruccion) {
    setPrevFilters({ search, gradoInstruccion });
    setCursorHistory([null]);
    setPageIndex(0);
  }

  const { data, isLoading, refetch, isFetching } = useApoderadosQuery({
    search,
    gradoInstruccion,
    cursor: currentCursor || undefined,
    limit,
  });

  const { data: resumen, refetch: refetchResumen } = useResumenApoderadosQuery({
    search,
    gradoInstruccion,
  });

  const apoderados = data?.data ?? [];

  const handleNextPage = () => {
    if (data?.nextCursor) {
      setCursorHistory((prev) => [...prev.slice(0, pageIndex + 1), data.nextCursor]);
      setPageIndex((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageIndex > 0) {
      setPageIndex((prev) => prev - 1);
    }
  };

  const { exportar, isExporting } = useExportarReporte("apoderados");

  const handleExport = () => {
    void exportar({ search, gradoInstruccion });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Padrón de Apoderados"
        description="Gestión de padres de familia, tutores legales, parentescos y responsabilidades escolares."
        icon={UserGroupIcon}
      />

      {/* Métricas del Padrón de Apoderados */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60">
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium">Total Apoderados</p>
              <p className="text-2xl font-bold">{resumen?.total ?? 0}</p>
            </div>
            <div className="bg-primary/10 text-primary rounded-full p-2.5">
              <HugeiconsIcon icon={UserGroupIcon} className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium">Con Estudiantes</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {resumen?.conEstudiantes ?? 0}
              </p>
            </div>
            <div className="rounded-full bg-emerald-500/10 p-2.5 text-emerald-600">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium">Apoderado Principal</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {resumen?.principales ?? 0}
              </p>
            </div>
            <div className="rounded-full bg-blue-500/10 p-2.5 text-blue-600">
              <HugeiconsIcon icon={ShieldCheckIcon} className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium">Con Acceso Digital</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {resumen?.conCuenta ?? 0}
              </p>
            </div>
            <div className="rounded-full bg-amber-500/10 p-2.5 text-amber-600">
              <HugeiconsIcon icon={Key01Icon} className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <ListToolbar
          filterDefs={apoderadoFilterDefs}
          listFilters={listFilters}
          actions={
            <div className="flex items-center gap-2">
              <RegistroPersonaAcciones
                destino="apoderado"
                tipoImportacion="apoderados"
                onVincular={(persona) => abrirRegistro(persona)}
                onRegistrar={() => abrirRegistro(null)}
                onImportSuccess={() => {
                  void refetch();
                  void refetchResumen();
                }}
                onRefresh={() => {
                  void refetch();
                  void refetchResumen();
                }}
                isRefreshing={isFetching}
                extraMenuItems={
                  <DropdownMenuItem
                    disabled={isExporting || apoderados.length === 0}
                    onSelect={() => void handleExport()}
                  >
                    <HugeiconsIcon icon={FileExportIcon} className="h-4 w-4" />
                    Exportar Excel
                  </DropdownMenuItem>
                }
              />
            </div>
          }
        />

        <ApoderadosTable
          apoderados={apoderados}
          isLoading={isLoading || (isFetching && apoderados.length === 0)}
          cursorPagination={{
            hasNextPage: Boolean(data?.hasMore),
            hasPreviousPage: pageIndex > 0,
            onNextPage: handleNextPage,
            onPreviousPage: handlePreviousPage,
            isLoading: isFetching,
            loadedCount: apoderados.length,
          }}
        />
      </div>

      <CreateApoderadoModal
        persona={personaElegida}
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
    </div>
  );
}
