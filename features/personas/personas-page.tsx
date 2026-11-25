"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FileExportIcon,
  FileImportIcon,
  IdIcon,
  Key01Icon,
  UserAdd01Icon,
  UserGroupIcon,
  UserQuestion01Icon,
} from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { ListToolbar } from "@/components/common/list-toolbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useListFilters } from "@/hooks/use-list-filters";
import { useExportarReporte } from "@/hooks/use-exportar-reporte";
import { personaFilterDefs } from "./config/filters";
import { usePersonasQuery, useResumenPersonasQuery } from "./hooks/use-personas";
import { PersonasTable } from "./views/personas-table";
import { CreatePersonaModal } from "./components/modals/create-persona-modal";
import { ImportarModal } from "@/features/importacion";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import type { TipoDocumento } from "./types/personas.types";

export function PersonasPage() {
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [importOpen, setImportOpen] = React.useState(false);

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

  const searchLimpio = search ? search.trim() : undefined;

  const { data, isLoading, refetch, isFetching } = usePersonasQuery({
    cursor: currentCursor,
    limit,
    search: searchLimpio,
    tipoDocumento,
    esProvisional,
  });

  const { data: resumen, refetch: refetchResumen } = useResumenPersonasQuery({
    search: searchLimpio,
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

      {/* Métricas del Padrón Único */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60">
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium">Total en Padrón</p>
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
              <p className="text-muted-foreground text-xs font-medium">Con Ficha Académica</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {resumen?.conFicha ?? 0}
              </p>
            </div>
            <div className="rounded-full bg-emerald-500/10 p-2.5 text-emerald-600">
              <HugeiconsIcon icon={IdIcon} className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium">Con Acceso Digital</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {resumen?.conCuenta ?? 0}
              </p>
            </div>
            <div className="rounded-full bg-blue-500/10 p-2.5 text-blue-600">
              <HugeiconsIcon icon={Key01Icon} className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium">Provisionales</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {resumen?.provisionales ?? 0}
              </p>
            </div>
            <div className="rounded-full bg-amber-500/10 p-2.5 text-amber-600">
              <HugeiconsIcon icon={UserQuestion01Icon} className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {/* Barra de Herramientas y Filtros común */}
        <ListToolbar
          filterDefs={personaFilterDefs}
          listFilters={listFilters}
          onRefresh={() => {
            void refetch();
            void refetchResumen();
          }}
          isRefreshing={isFetching}
          actions={
            <Button size="sm" onClick={() => setCreateModalOpen(true)} className="h-10 gap-2">
              <HugeiconsIcon icon={UserAdd01Icon} className="h-4 w-4" />
              Registrar persona
            </Button>
          }
          secondaryActions={
            <>
              <DropdownMenuItem onSelect={() => setImportOpen(true)}>
                <HugeiconsIcon icon={FileImportIcon} className="h-4 w-4" />
                Importar Excel
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={isExporting || personas.length === 0}
                onSelect={() =>
                  void exportar({ search: search?.trim(), tipoDocumento, esProvisional })
                }
              >
                <HugeiconsIcon icon={FileExportIcon} className="h-4 w-4" />
                Exportar Excel
              </DropdownMenuItem>
            </>
          }
        />

        {/* Tabla estandarizada con DataTable y paginación por cursores */}
        <PersonasTable
          personas={personas}
          isLoading={isLoading || (isFetching && personas.length === 0)}
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

      <ImportarModal
        open={importOpen}
        onOpenChange={setImportOpen}
        tipo="personas"
        onSuccess={() => {
          void refetch();
          void refetchResumen();
        }}
      />

      {/* Modal para Crear Persona */}
      <CreatePersonaModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
    </div>
  );
}
