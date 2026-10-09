"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserGroupIcon, UserAdd01Icon, FileExportIcon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { ListToolbar } from "@/components/common/list-toolbar";
import { Button } from "@/components/ui/button";
import { useListFilters } from "@/hooks/use-list-filters";
import { useExportExcel } from "@/hooks/use-export-excel";
import { apoderadoFilterDefs } from "./config/filters";
import { apoderadoExportColumns } from "./config/export";
import { useApoderadosQuery } from "./hooks/use-apoderados";
import { ApoderadosTable } from "./views/apoderados-table";
import { CreateApoderadoModal } from "./components/modals/create-apoderado-modal";
import type { Apoderado } from "./types/apoderados.types";

export function ApoderadosPage() {
  const [createModalOpen, setCreateModalOpen] = React.useState(false);

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

  const { exportToExcel, isExporting } = useExportExcel<Apoderado>({
    columns: apoderadoExportColumns,
    filenamePrefix: "padron-apoderados-sga",
    sheetName: "Apoderados",
  });

  const handleExport = () => {
    exportToExcel(apoderados);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Padrón de Apoderados"
        description="Gestión de padres de familia, tutores legales, parentescos y responsabilidades escolares (RF-007 V3)."
        icon={UserGroupIcon}
      />

      <div className="space-y-4">
        <ListToolbar
          filterDefs={apoderadoFilterDefs}
          listFilters={listFilters}
          onRefresh={refetch}
          isRefreshing={isFetching}
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={isExporting || apoderados.length === 0}
                className="h-8 gap-1.5 text-xs"
              >
                <HugeiconsIcon icon={FileExportIcon} className="h-4 w-4" />
                {isExporting ? "Exportando..." : "Exportar"}
              </Button>
              <Button
                size="sm"
                onClick={() => setCreateModalOpen(true)}
                className="h-8 gap-1.5 text-xs"
              >
                <HugeiconsIcon icon={UserAdd01Icon} className="h-4 w-4" />
                Registrar Apoderado
              </Button>
            </div>
          }
        />

        <ApoderadosTable
          apoderados={apoderados}
          isLoading={isLoading}
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

      <CreateApoderadoModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
    </div>
  );
}
