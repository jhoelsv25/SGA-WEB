"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserGroupIcon, UserAdd01Icon, FileExportIcon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { ListToolbar } from "@/components/common/list-toolbar";
import { Button } from "@/components/ui/button";
import { useListFilters } from "@/hooks/use-list-filters";
import { useExportarReporte } from "@/hooks/use-exportar-reporte";
import { personaFilterDefs } from "./config/filters";
import { usePersonasQuery } from "./hooks/use-personas";
import { PersonasTable } from "./views/personas-table";
import { CreatePersonaModal } from "./components/modals/create-persona-modal";
import { ImportarButton } from "@/features/importacion";
import type { TipoDocumento } from "./types/personas.types";

export function PersonasPage() {
  const [createModalOpen, setCreateModalOpen] = React.useState(false);

  // Filtros sincronizados con la URL mediante el hook del sistema
  const listFilters = useListFilters(personaFilterDefs);
  const search = listFilters.getString("search");
  const tipoRaw = listFilters.getString("tipoDocumento");
  const tipoDocumento: TipoDocumento | undefined =
    tipoRaw && tipoRaw !== "all" ? (tipoRaw as TipoDocumento) : undefined;
  const provisionalRaw = listFilters.getString("provisional");
  const esProvisional: boolean | undefined =
    provisionalRaw === "si" ? true : provisionalRaw === "no" ? false : undefined;

  // Paginación basada en cursores
  const limit = 10;
  const [cursorHistory, setCursorHistory] = React.useState<(string | null)[]>([null]);
  const [pageIndex, setPageIndex] = React.useState<number>(0);
  const currentCursor = cursorHistory[pageIndex] ?? null;

  const [prevFilters, setPrevFilters] = React.useState({
    search,
    tipoDocumento,
    esProvisional,
  });

  if (
    prevFilters.search !== search ||
    prevFilters.tipoDocumento !== tipoDocumento ||
    prevFilters.esProvisional !== esProvisional
  ) {
    setPrevFilters({ search, tipoDocumento, esProvisional });
    setCursorHistory([null]);
    setPageIndex(0);
  }

  const { data, isLoading, refetch, isFetching } = usePersonasQuery({
    cursor: currentCursor,
    limit,
    search: search ? search.trim() : undefined,
    tipoDocumento,
    esProvisional,
  });

  const personas = data?.data ?? [];

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

  // Exportación a Excel estandarizada
  const { exportar, isExporting } = useExportarReporte("personas");

  return (
    <div className="animate-in fade-in-50 space-y-6 duration-300">
      <PageHeader
        title="Padrón de Personas"
        description="Padrón único de la comunidad educativa (docentes, estudiantes, apoderados) y personas provisionales."
        icon={UserGroupIcon}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Comunidad" },
          { label: "Padrón de Personas" },
        ]}
      />

      <div className="space-y-4">
        {/* Barra de Herramientas y Filtros común */}
        <ListToolbar
          filterDefs={personaFilterDefs}
          listFilters={listFilters}
          onRefresh={() => refetch()}
          isRefreshing={isFetching}
          actions={
            <div className="flex items-center gap-2">
              <ImportarButton tipo="personas" onSuccess={() => void refetch()} />
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  void exportar({ search: search?.trim(), tipoDocumento, esProvisional })
                }
                disabled={isExporting || personas.length === 0}
                className="gap-2"
              >
                <HugeiconsIcon icon={FileExportIcon} className="h-4 w-4" />
                Exportar Excel
              </Button>
              <Button size="sm" onClick={() => setCreateModalOpen(true)} className="gap-2">
                <HugeiconsIcon icon={UserAdd01Icon} className="h-4 w-4" />
                Registrar Persona
              </Button>
            </div>
          }
        />

        {/* Tabla estandarizada con DataTable y paginación por cursores */}
        <PersonasTable
          personas={personas}
          isLoading={isLoading}
          cursorPagination={{
            hasNextPage: Boolean(data?.hasMore && data?.nextCursor),
            hasPreviousPage: pageIndex > 0,
            onNextPage: handleNextPage,
            onPreviousPage: handlePreviousPage,
            isLoading: isFetching,
            loadedCount: personas.length,
          }}
        />
      </div>

      {/* Modal para Crear Persona */}
      <CreatePersonaModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
    </div>
  );
}
