"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { StudentIcon, UserAdd01Icon, FileExportIcon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { ListToolbar } from "@/components/common/list-toolbar";
import { Button } from "@/components/ui/button";
import { useListFilters } from "@/hooks/use-list-filters";
import { useCursorPagination } from "@/hooks/use-cursor-pagination";
import { useExportExcel } from "@/hooks/use-export-excel";
import { estudianteFilterDefs } from "./config/filters";
import { estudianteExportColumns } from "./config/export";
import { useEstudiantesQuery } from "./hooks/use-estudiantes";
import { EstudiantesTable } from "./views/estudiantes-table";
import { CreateEstudianteModal } from "./components/modals/create-estudiante-modal";
import { CredentialsModal } from "./components/modals/credentials-modal";
import { ImportarButton } from "@/features/importacion";
import type {
  CreateEstudianteResponse,
  Estudiante,
  EstadoEstudiante,
} from "./types/estudiantes.types";

export function EstudiantesPage() {
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [credentialsModalOpen, setCredentialsModalOpen] = React.useState(false);
  const [createdData, setCreatedData] = React.useState<CreateEstudianteResponse | null>(null);

  // Filtros sincronizados con la URL
  const listFilters = useListFilters(estudianteFilterDefs);
  const search = listFilters.getString("search");
  const estadoRaw = listFilters.getString("estado");
  const estado: EstadoEstudiante | undefined =
    estadoRaw && estadoRaw !== "all" ? (estadoRaw as EstadoEstudiante) : undefined;

  // Paginación por cursores mediante hook global
  const limit = 10;
  const pagination = useCursorPagination({
    resetDeps: [search, estado],
  });

  const { data, isLoading, refetch, isFetching } = useEstudiantesQuery({
    cursor: pagination.cursor,
    limit,
    search: search ? search.trim() : undefined,
    estado,
  });

  const estudiantes = data?.data ?? [];

  const { exportToExcel, isExporting } = useExportExcel<Estudiante>({
    columns: estudianteExportColumns,
    filenamePrefix: "Padron_Estudiantes",
    sheetName: "Estudiantes",
  });

  const handleExport = async () => {
    await exportToExcel(estudiantes);
  };

  const handleCreatedSuccess = (res: CreateEstudianteResponse) => {
    setCreatedData(res);
    setCredentialsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Padrón de Estudiantes"
        description="Ficha escolar, códigos SIAGIE, condiciones médicas y credenciales de marcación según RF-007 V3."
        icon={StudentIcon}
      />

      <div className="space-y-4">
        <ListToolbar
          filterDefs={estudianteFilterDefs}
          listFilters={listFilters}
          onRefresh={refetch}
          isRefreshing={isFetching}
          actions={
            <div className="flex items-center gap-2">
              <ImportarButton tipo="estudiantes" onSuccess={() => void refetch()} />
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={isExporting || estudiantes.length === 0}
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
                Registrar Estudiante
              </Button>
            </div>
          }
        />

        <EstudiantesTable
          estudiantes={estudiantes}
          isLoading={isLoading}
          cursorPagination={{
            ...pagination.getPaginationProps(data),
            isLoading: isFetching,
            loadedCount: estudiantes.length,
          }}
        />
      </div>

      {/* Modal para Crear Estudiante */}
      <CreateEstudianteModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onCreatedSuccess={handleCreatedSuccess}
      />

      {/* Modal para Mostrar Credenciales Emitidas */}
      {createdData && (
        <CredentialsModal
          open={credentialsModalOpen}
          onOpenChange={setCredentialsModalOpen}
          nombreCompleto={createdData.estudiante.persona.nombreCompleto}
          codigoSiagie={createdData.estudiante.codigo}
          nombreUsuario={
            createdData.estudiante.usuario?.nombreUsuario || createdData.estudiante.codigo
          }
          tempPassword={createdData.tempPassword}
          codigoCredencial={createdData.credencial.codigo}
          pin={createdData.credencial.pin}
        />
      )}
    </div>
  );
}
