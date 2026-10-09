"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Settings02Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import { ListToolbar } from "@/components/common/list-toolbar";
import { Button } from "@/components/ui/button";
import { useListFilters } from "@/hooks/use-list-filters";
import { variableFilterDefs } from "./config/filters";
import { useUpdateVariableMutation, useVariablesQuery } from "./hooks";
import { VariablesGroupedList } from "./components/variables-grouped-list";
import { EditVariableModal } from "./components/modals/edit-variable-modal";
import { HistorialVariableModal } from "./components/modals/historial-variable-modal";
import type { VariableSistema } from "./types";

export function VariablesPage() {
  const listFilters = useListFilters(variableFilterDefs, { resetPageOnFilter: false });

  const selectedModulo = listFilters.getString("modulo");
  const moduloQuery = !selectedModulo || selectedModulo === "todos" ? undefined : selectedModulo;

  const {
    data: variables = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useVariablesQuery(moduloQuery);

  const updateMutation = useUpdateVariableMutation();

  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [historialModalOpen, setHistorialModalOpen] = React.useState(false);
  const [selectedVariable, setSelectedVariable] = React.useState<VariableSistema | null>(null);

  const handleEdit = (variable: VariableSistema) => {
    setSelectedVariable(variable);
    setEditModalOpen(true);
  };

  const handleHistorial = (variable: VariableSistema) => {
    setSelectedVariable(variable);
    setHistorialModalOpen(true);
  };

  const handleUpdateSubmit = async (codigo: string, valor: string, motivoCambio: string) => {
    await updateMutation.mutateAsync({
      codigo,
      payload: { valor, motivoCambio },
    });
    setEditModalOpen(false);
  };

  // Filtrado local por término de búsqueda (inmediato con searchInput o valor en URL)
  const searchTerm = (listFilters.searchInput || listFilters.getString("search"))
    .trim()
    .toLowerCase();

  const filteredVariables = React.useMemo(() => {
    if (!searchTerm) return variables;
    return variables.filter(
      (v) =>
        v.codigo.toLowerCase().includes(searchTerm) ||
        v.descripcion.toLowerCase().includes(searchTerm) ||
        v.modulo.toLowerCase().includes(searchTerm),
    );
  }, [variables, searchTerm]);

  const hasActiveFilters = Boolean(searchTerm || (selectedModulo && selectedModulo !== "todos"));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Variables del Sistema"
        description="Administración de parámetros configurables, tolerancias de asistencia, plazos de descargo y pesos de evaluación."
        icon={Settings02Icon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Configuración" },
          { label: "Variables del Sistema" },
        ]}
      />

      {/* Barra de filtros y búsqueda con chips de módulo y recarga */}
      <ListToolbar
        filterDefs={variableFilterDefs}
        listFilters={listFilters}
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
      />

      {/* Contenido principal gestionado por PageState */}
      <PageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => refetch()}
        isEmpty={filteredVariables.length === 0}
        empty={{
          title: hasActiveFilters
            ? "No se encontraron variables"
            : "No hay variables de configuración",
          description: hasActiveFilters
            ? "No se encontraron variables con los criterios de búsqueda o módulo seleccionados."
            : "No se encontraron variables de configuración registradas en el sistema.",
          action: hasActiveFilters ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => listFilters.clearFilters()}
              className="gap-1.5"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
              <span>Limpiar filtros</span>
            </Button>
          ) : undefined,
        }}
      >
        <VariablesGroupedList
          variables={filteredVariables}
          onEdit={handleEdit}
          onHistorial={handleHistorial}
        />
      </PageState>

      {/* Modales */}
      <EditVariableModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        variable={selectedVariable}
        onSubmit={handleUpdateSubmit}
        isSubmitting={updateMutation.isPending}
      />

      <HistorialVariableModal
        open={historialModalOpen}
        onOpenChange={setHistorialModalOpen}
        variable={selectedVariable}
      />
    </div>
  );
}
