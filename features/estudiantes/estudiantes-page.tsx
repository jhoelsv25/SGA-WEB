"use client";

import * as React from "react";
import { RegistroPersonaAcciones } from "@/features/personas/components/registro-persona-acciones";
import type { Persona } from "@/features/personas/types/personas.types";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  FileExportIcon,
  StudentIcon,
  UserGroupIcon,
  UserRemove01Icon,
} from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { ListToolbar } from "@/components/common/list-toolbar";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useListFilters } from "@/hooks/use-list-filters";
import { useCursorPagination } from "@/hooks/use-cursor-pagination";
import { useExportarReporte } from "@/hooks/use-exportar-reporte";
import { estudianteFilterDefs } from "./config/filters";
import { useEstudiantesQuery, useResumenEstudiantesQuery } from "./hooks/use-estudiantes";
import { EstudiantesTable } from "./views/estudiantes-table";
import { CreateEstudianteModal } from "./components/modals/create-estudiante-modal";
import { CredentialsModal } from "./components/modals/credentials-modal";
import type { CreateEstudianteResponse, EstadoEstudiante } from "./types/estudiantes.types";

export function EstudiantesPage() {
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [personaElegida, setPersonaElegida] = React.useState<Persona | null>(null);

  const abrirRegistro = (persona: Persona | null) => {
    setPersonaElegida(persona);
    setCreateModalOpen(true);
  };
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

  const searchLimpio = search ? search.trim() : undefined;

  const { data, isLoading, refetch, isFetching } = useEstudiantesQuery({
    cursor: pagination.cursor,
    limit,
    search: searchLimpio,
    estado,
  });

  const { data: resumen, refetch: refetchResumen } = useResumenEstudiantesQuery({
    search: searchLimpio,
  });

  const estudiantes = data?.data ?? [];
  const totalBajas = (resumen?.retirados ?? 0) + (resumen?.egresados ?? 0);

  const { exportar, isExporting } = useExportarReporte("estudiantes");

  const handleExport = async () => {
    await exportar({ search: search?.trim(), estado });
  };

  const handleCreatedSuccess = (res: CreateEstudianteResponse) => {
    setCreatedData(res);
    setCredentialsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Padrón de Estudiantes"
        description="Ficha escolar, códigos SIAGIE, condiciones médicas y credenciales de marcación."
        icon={StudentIcon}
      />

      {/* Métricas del Padrón */}
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
              <p className="text-muted-foreground text-xs font-medium">Estudiantes Activos</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {resumen?.activos ?? 0}
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
              <p className="text-muted-foreground text-xs font-medium">Trasladados</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {resumen?.trasladados ?? 0}
              </p>
            </div>
            <div className="rounded-full bg-amber-500/10 p-2.5 text-amber-600">
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium">Retirados / Egresados</p>
              <p className="text-destructive text-2xl font-bold">{totalBajas}</p>
            </div>
            <div className="bg-destructive/10 text-destructive rounded-full p-2.5">
              <HugeiconsIcon icon={UserRemove01Icon} className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <ListToolbar
          filterDefs={estudianteFilterDefs}
          listFilters={listFilters}
          actions={
            <div className="flex items-center gap-2">
              <RegistroPersonaAcciones
                destino="estudiante"
                tipoImportacion="estudiantes"
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
                    disabled={isExporting || estudiantes.length === 0}
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

        <EstudiantesTable
          estudiantes={estudiantes}
          isLoading={isLoading || (isFetching && estudiantes.length === 0)}
          cursorPagination={{
            ...pagination.getPaginationProps(data),
            isLoading: isFetching,
            loadedCount: estudiantes.length,
          }}
        />
      </div>

      {/* Modal para Crear Estudiante */}
      <CreateEstudianteModal
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
