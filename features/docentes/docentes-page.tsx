"use client";

import * as React from "react";
import { RegistroPersonaAcciones } from "@/features/personas/components/registro-persona-acciones";
import type { Persona } from "@/features/personas/types/personas.types";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserGroupIcon, FileExportIcon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { ListToolbar } from "@/components/common/list-toolbar";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useListFilters } from "@/hooks/use-list-filters";
import { useExportarReporte } from "@/hooks/use-exportar-reporte";
import { docenteFilterDefs } from "./config/filters";
import { useDocentesQuery } from "./hooks/use-docentes";
import { DocentesTable } from "./views/docentes-table";
import { CreateDocenteModal } from "./components/modals/create-docente-modal";
import { CredentialsModal } from "./components/modals/credentials-modal";
import type { CreateDocenteResponse, EstadoDocente, TipoContrato } from "./types/docentes.types";

export function DocentesPage() {
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [personaElegida, setPersonaElegida] = React.useState<Persona | null>(null);

  const abrirRegistro = (persona: Persona | null) => {
    setPersonaElegida(persona);
    setCreateModalOpen(true);
  };
  const [credentialsModalOpen, setCredentialsModalOpen] = React.useState(false);
  const [createdData, setCreatedData] = React.useState<CreateDocenteResponse | null>(null);

  // Filtros en URL
  const listFilters = useListFilters(docenteFilterDefs);
  const search = listFilters.getString("search");
  const contratoRaw = listFilters.getString("tipoContrato");
  const tipoContrato: TipoContrato | undefined =
    contratoRaw && contratoRaw !== "all" ? (contratoRaw as TipoContrato) : undefined;
  const estadoRaw = listFilters.getString("estado");
  const estado: EstadoDocente | undefined =
    estadoRaw && estadoRaw !== "all" ? (estadoRaw as EstadoDocente) : undefined;

  // Paginación por cursores
  const limit = 10;
  const [cursorHistory, setCursorHistory] = React.useState<(string | null)[]>([null]);
  const [pageIndex, setPageIndex] = React.useState<number>(0);
  const currentCursor = cursorHistory[pageIndex] ?? null;

  const [prevFilters, setPrevFilters] = React.useState({
    search,
    tipoContrato,
    estado,
  });

  if (
    prevFilters.search !== search ||
    prevFilters.tipoContrato !== tipoContrato ||
    prevFilters.estado !== estado
  ) {
    setPrevFilters({ search, tipoContrato, estado });
    setCursorHistory([null]);
    setPageIndex(0);
  }

  const { data, isLoading, refetch, isFetching } = useDocentesQuery({
    cursor: currentCursor,
    limit,
    search: search ? search.trim() : undefined,
    tipoContrato,
    estado,
  });

  const docentes = data?.data ?? [];

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

  // Exportar Excel
  const { exportar, isExporting } = useExportarReporte("docentes");

  const handleCreatedSuccess = (res: CreateDocenteResponse) => {
    setCreatedData(res);
    setCredentialsModalOpen(true);
  };

  return (
    <div className="animate-in fade-in-50 space-y-6 duration-300">
      <PageHeader
        title="Plana Docente"
        description="Gestión de profesores, régimen laboral, credenciales de marcación y asignación académica."
        icon={UserGroupIcon}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Comunidad" },
          { label: "Docentes" },
        ]}
      />

      <div className="space-y-4">
        <ListToolbar
          filterDefs={docenteFilterDefs}
          listFilters={listFilters}
          actions={
            <div className="flex items-center gap-2">
              <RegistroPersonaAcciones
                destino="docente"
                tipoImportacion="docentes"
                onVincular={(persona) => abrirRegistro(persona)}
                onRegistrar={() => abrirRegistro(null)}
                onImportSuccess={() => void refetch()}
                onRefresh={() => void refetch()}
                isRefreshing={isFetching}
                extraMenuItems={
                  <DropdownMenuItem
                    disabled={isExporting || docentes.length === 0}
                    onSelect={() => void exportar({ search: search?.trim(), tipoContrato, estado })}
                  >
                    <HugeiconsIcon icon={FileExportIcon} className="h-4 w-4" />
                    Exportar Excel
                  </DropdownMenuItem>
                }
              />
            </div>
          }
        />

        <DocentesTable
          docentes={docentes}
          isLoading={isLoading}
          cursorPagination={{
            hasNextPage: Boolean(data?.hasMore && data?.nextCursor),
            hasPreviousPage: pageIndex > 0,
            onNextPage: handleNextPage,
            onPreviousPage: handlePreviousPage,
            isLoading: isFetching,
            loadedCount: docentes.length,
          }}
        />
      </div>

      {/* Modal para Crear Docente con Búsqueda Preventiva */}
      <CreateDocenteModal
        persona={personaElegida}
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onCreatedSuccess={handleCreatedSuccess}
      />

      {/* Modal para Mostrar Credenciales Emitidas */}
      {createdData && (
        <CredentialsModal
          open={credentialsModalOpen}
          onOpenChange={setCredentialsModalOpen}
          nombreCompleto={createdData.docente.persona.nombreCompleto}
          codigoDocente={createdData.docente.codigo}
          nombreUsuario={
            createdData.docente.usuario?.nombreUsuario ||
            createdData.docente.persona.numeroDocumento
          }
          tempPassword={createdData.tempPassword}
          codigoCredencial={createdData.credencial.codigo}
          pin={createdData.credencial.pin}
        />
      )}
    </div>
  );
}
