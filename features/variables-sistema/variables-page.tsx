"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Settings02Icon, Search01Icon, RefreshIcon } from "@hugeicons/core-free-icons";
import { PageHeader } from "@/components/common/page-header";
import { Spinner } from "@/components/common/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateVariableMutation, useVariablesQuery } from "./hooks";
import { VariablesGroupedList } from "./components/variables-grouped-list";
import { EditVariableModal } from "./components/modals/edit-variable-modal";
import { HistorialVariableModal } from "./components/modals/historial-variable-modal";
import type { VariableSistema } from "./types";

const MODULO_FILTROS = [
  { id: "todos", label: "Todos" },
  { id: "seguridad", label: "Seguridad" },
  { id: "sesiones", label: "Sesiones" },
  { id: "supervision", label: "Supervisión" },
  { id: "aula_virtual", label: "Aula Virtual" },
  { id: "libretas", label: "Libretas" },
  { id: "organizacion", label: "Jornada" },
  { id: "auditoria", label: "Auditoría" },
  { id: "convivencia", label: "Convivencia" },
];

export function VariablesPage() {
  const [selectedModulo, setSelectedModulo] = React.useState<string>("todos");
  const [searchTerm, setSearchTerm] = React.useState("");

  const moduloQuery = selectedModulo === "todos" ? undefined : selectedModulo;
  const { data: variables = [], isLoading, isError, refetch } = useVariablesQuery(moduloQuery);
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
  };

  // Filtrado local por término de búsqueda
  const filteredVariables = React.useMemo(() => {
    if (!searchTerm.trim()) return variables;
    const term = searchTerm.toLowerCase();
    return variables.filter(
      (v) =>
        v.codigo.toLowerCase().includes(term) ||
        v.descripcion.toLowerCase().includes(term) ||
        v.modulo.toLowerCase().includes(term),
    );
  }, [variables, searchTerm]);

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
        actions={
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5">
            <HugeiconsIcon icon={RefreshIcon} className="h-4 w-4" />
            Actualizar
          </Button>
        }
      />

      {/* Barra de filtros y búsqueda */}
      <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex scrollbar-none items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {MODULO_FILTROS.map((f) => (
            <Button
              key={f.id}
              variant={selectedModulo === f.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedModulo(f.id)}
              className="h-8 text-xs whitespace-nowrap"
            >
              {f.label}
            </Button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <HugeiconsIcon
            icon={Search01Icon}
            className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4"
          />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por código..."
            className="h-8 pl-8 text-xs"
          />
        </div>
      </div>

      {/* Contenido principal */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner className="text-primary h-8 w-8" />
        </div>
      ) : isError ? (
        <div className="border-destructive/20 bg-destructive/5 rounded-xl border p-8 text-center">
          <p className="text-destructive text-sm font-medium">
            Error al cargar las variables del sistema.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3">
            Reintentar
          </Button>
        </div>
      ) : (
        <VariablesGroupedList
          variables={filteredVariables}
          onEdit={handleEdit}
          onHistorial={handleHistorial}
        />
      )}

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
