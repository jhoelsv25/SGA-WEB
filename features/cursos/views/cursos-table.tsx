"use client";

import * as React from "react";
import { DataTable } from "@/components/common/data-table";
import { ListToolbar } from "@/components/common/list-toolbar";
import { StatusBadge } from "@/components/common/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useListFilters } from "@/hooks/use-list-filters";
import { cursoFilterDefs } from "../config/filters";
import { getCursoColumns } from "./columns/curso-columns";
import { CursoActions } from "./columns/curso-actions";
import { CursoModal } from "../components/modals/curso-modal";
import {
  useCreateCursoMutation,
  useCursosQuery,
  useDesactivarCursoMutation,
  useReactivarCursoMutation,
  useUpdateCursoMutation,
} from "../hooks";
import type { AreaCurricular, CreateCursoPayload, Curso } from "../types";
import type { CursoFormValues } from "../schemas";

export function CursosTable() {
  const listFilters = useListFilters(cursoFilterDefs);
  const search = listFilters.getString("search");
  const areaRaw = listFilters.getString("areaCurricular");
  const areaCurricular: AreaCurricular | undefined =
    areaRaw && areaRaw !== "all" ? (areaRaw as AreaCurricular) : undefined;
  const estadoRaw = listFilters.getString("estado");
  const estado: "todos" | "activo" | "inactivo" =
    estadoRaw && estadoRaw !== "all" ? (estadoRaw as "activo" | "inactivo") : "todos";

  const hasActiveFilters = Boolean(
    search || (areaRaw && areaRaw !== "all") || (estadoRaw && estadoRaw !== "all"),
  );

  // Queries & Mutations
  const {
    data: cursos = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useCursosQuery({
    estado,
    areaCurricular,
    search: search ? search.trim() : undefined,
  });

  const createMutation = useCreateCursoMutation();
  const updateMutation = useUpdateCursoMutation();
  const desactivarMutation = useDesactivarCursoMutation();
  const reactivarMutation = useReactivarCursoMutation();

  // Modal state
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedCurso, setSelectedCurso] = React.useState<Curso | null>(null);

  const handleOpenCreate = React.useCallback(() => {
    setSelectedCurso(null);
    setModalOpen(true);
  }, []);

  const handleOpenEdit = React.useCallback((curso: Curso) => {
    setSelectedCurso(curso);
    setModalOpen(true);
  }, []);

  const handleFormSubmit = async (values: CursoFormValues) => {
    if (selectedCurso) {
      await updateMutation.mutateAsync({
        id: selectedCurso.id,
        payload: values,
      });
    } else {
      await createMutation.mutateAsync(values as CreateCursoPayload);
    }
    setModalOpen(false);
  };

  const handleDeactivate = React.useCallback(
    async (curso: Curso) => {
      await desactivarMutation.mutateAsync(curso.id);
    },
    [desactivarMutation],
  );

  const handleReactivate = React.useCallback(
    async (curso: Curso) => {
      await reactivarMutation.mutateAsync(curso.id);
    },
    [reactivarMutation],
  );

  const columns = React.useMemo(
    () =>
      getCursoColumns({
        onEdit: handleOpenEdit,
        onDeactivate: handleDeactivate,
        onReactivate: handleReactivate,
        isDeactivating: desactivarMutation.isPending,
      }),
    [handleOpenEdit, handleDeactivate, handleReactivate, desactivarMutation.isPending],
  );

  const renderCursoMobileCard = React.useCallback(
    (curso: Curso) => {
      return (
        <div className="border-border/70 bg-card space-y-3 rounded-xl border p-4 shadow-2xs">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className="size-3 shrink-0 rounded-full border border-black/10 dark:border-white/10"
                  style={{ backgroundColor: curso.colorHex || "#2563EB" }}
                  title={`Color: ${curso.colorHex || "#2563EB"}`}
                />
                <span className="text-foreground font-mono text-xs font-bold">{curso.codigo}</span>
              </div>
              <p className="text-foreground truncate text-sm font-semibold">{curso.nombre}</p>
            </div>
            <CursoActions
              curso={curso}
              onEdit={handleOpenEdit}
              onDeactivate={handleDeactivate}
              onReactivate={handleReactivate}
              isDeactivating={desactivarMutation.isPending}
            />
          </div>

          {curso.descripcion && (
            <p className="text-muted-foreground line-clamp-2 text-xs">{curso.descripcion}</p>
          )}

          <div className="border-border/50 flex flex-wrap items-center justify-between gap-2 border-t pt-2.5 text-xs">
            <Badge variant="secondary" className="rounded-lg px-2.5 py-0.5 text-xs font-medium">
              {curso.areaCurricularNombre}
            </Badge>
            <StatusBadge tone={curso.activo ? "success" : "neutral"} dot size="sm">
              {curso.activo ? "Activo" : "Inactivo"}
            </StatusBadge>
          </div>
        </div>
      );
    },
    [handleOpenEdit, handleDeactivate, handleReactivate, desactivarMutation.isPending],
  );

  return (
    <div className="space-y-4">
      {/* Barra de herramientas y filtros estandarizados */}
      <ListToolbar
        filterDefs={cursoFilterDefs}
        listFilters={listFilters}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
        actions={
          <Button
            size="sm"
            onClick={handleOpenCreate}
            className="shadow-primary/20 h-9 gap-1.5 rounded-full px-4 text-xs font-semibold shadow-xs"
          >
            <HugeiconsIcon icon={PlusSignIcon} className="size-3.5" />
            <span>Nuevo curso</span>
          </Button>
        }
      />

      {/* TanStack Data Table */}
      <DataTable
        columns={columns}
        data={cursos}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => void refetch()}
        hasActiveFilters={hasActiveFilters}
        pagination={false}
        caption="Catálogo institucional de asignaturas curriculares y talleres"
        mobileCard={renderCursoMobileCard}
        emptyMessage="No se encontraron cursos en el catálogo con los filtros aplicados."
      />

      {/* Modal Crear / Editar Curso */}
      <CursoModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        curso={selectedCurso}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
