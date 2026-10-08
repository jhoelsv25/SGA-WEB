"use client";

import * as React from "react";
import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HugeiconsIcon } from "@hugeicons/react";
import { BookOpen01Icon, Clock01Icon, Copy01Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { getPlanColumns } from "./columns/plan-columns";
import { AddCursoPlanModal } from "../../components/modals/add-curso-plan-modal";
import { UpdateHorasModal } from "../../components/modals/update-horas-modal";
import { CopyPlanModal } from "../../components/modals/copy-plan-modal";
import {
  useAddCursoPlanMutation,
  useCopyPlanMutation,
  useCursosQuery,
  usePlanEstudioQuery,
  useRemoveCursoPlanMutation,
  useUpdateHorasPlanMutation,
} from "../../hooks";
import type { Grado, PlanEstudioItem } from "../../types";
import type {
  AddCursoPlanFormValues,
  CopyPlanFormValues,
  UpdateHorasPlanFormValues,
} from "../../schemas";

interface PlanEstudiosTableProps {
  grados: Grado[];
  selectedGradoId: string;
  onSelectGrado: (gradoId: string) => void;
}

export function PlanEstudiosTable({
  grados,
  selectedGradoId,
  onSelectGrado,
}: PlanEstudiosTableProps) {
  const currentGrado = grados.find((g) => g.id === selectedGradoId) ?? grados[0];

  // Queries
  const { data: planData, isLoading: isLoadingPlan } = usePlanEstudioQuery(currentGrado?.id);
  const { data: allCursos = [] } = useCursosQuery({ estado: "activo" });

  // Mutations
  const addMutation = useAddCursoPlanMutation(currentGrado?.id);
  const updateHorasMutation = useUpdateHorasPlanMutation(currentGrado?.id);
  const removeMutation = useRemoveCursoPlanMutation(currentGrado?.id);
  const copyMutation = useCopyPlanMutation(currentGrado?.id);

  // Modals state
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [copyModalOpen, setCopyModalOpen] = React.useState(false);
  const [selectedItemForHoras, setSelectedItemForHoras] = React.useState<PlanEstudioItem | null>(
    null,
  );

  // Available courses (active courses not already in this grade)
  const availableCursos = React.useMemo(() => {
    if (!planData) return allCursos;
    const existingCursoIds = new Set(planData.cursos.map((c) => c.cursoId));
    return allCursos.filter((c) => !existingCursoIds.has(c.id));
  }, [allCursos, planData]);

  const handleAddSubmit = async (values: AddCursoPlanFormValues) => {
    await addMutation.mutateAsync(values);
    setAddModalOpen(false);
  };

  const handleUpdateHorasSubmit = async (values: UpdateHorasPlanFormValues) => {
    if (!selectedItemForHoras) return;
    await updateHorasMutation.mutateAsync({
      id: selectedItemForHoras.id,
      payload: values,
    });
    setSelectedItemForHoras(null);
  };

  const handleCopySubmit = async (values: CopyPlanFormValues) => {
    await copyMutation.mutateAsync(values.origenGradoId);
    setCopyModalOpen(false);
  };

  const handleRemove = React.useCallback(
    async (item: PlanEstudioItem) => {
      await removeMutation.mutateAsync(item.id);
    },
    [removeMutation],
  );

  const handleEditHoras = React.useCallback((item: PlanEstudioItem) => {
    setSelectedItemForHoras(item);
  }, []);

  const columns = React.useMemo(
    () =>
      getPlanColumns({
        onEditHoras: handleEditHoras,
        onRemove: handleRemove,
        isRemoving: removeMutation.isPending,
      }),
    [handleEditHoras, handleRemove, removeMutation.isPending],
  );

  return (
    <div className="space-y-6">
      {/* Selector de Grados (Pestañas 1.° a 5.° de secundaria) */}
      <Tabs value={currentGrado?.id} onValueChange={onSelectGrado} className="w-full">
        <TabsList className="bg-muted/50 h-10 w-fit rounded-xl p-1">
          {grados.map((g) => (
            <TabsTrigger
              key={g.id}
              value={g.id}
              className="rounded-lg px-4 text-xs font-medium data-active:font-semibold"
            >
              {g.nombre}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Header del Grado Seleccionado */}
      <div className="border-border/80 bg-card/60 flex flex-col gap-4 rounded-2xl border p-4 shadow-xs backdrop-blur-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl">
            <HugeiconsIcon icon={BookOpen01Icon} className="size-5" />
          </div>
          <div>
            <h2 className="text-foreground text-base font-bold tracking-tight">
              Plan de Estudios — {currentGrado?.nombre}
            </h2>
            <p className="text-muted-foreground text-xs">
              Asignaturas curriculares oficiales y horas pedagógicas semanales.
            </p>
          </div>
        </div>

        {/* Indicador de Total de Horas y Acciones */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="border-border/70 bg-muted/30 flex items-center gap-2 rounded-xl border px-3.5 py-1.5 shadow-2xs">
            <HugeiconsIcon icon={Clock01Icon} className="text-primary size-4" />
            <span className="text-muted-foreground text-xs font-medium">Total semanal:</span>
            <span className="text-foreground text-xs font-bold">
              {planData?.totalHoras ?? 0} hrs
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setCopyModalOpen(true)}
            className="h-9 gap-1.5 rounded-xl px-3 text-xs font-semibold"
          >
            <HugeiconsIcon icon={Copy01Icon} className="size-3.5" />
            <span>Copiar plan de...</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => setAddModalOpen(true)}
            disabled={availableCursos.length === 0}
            className="shadow-primary/20 h-9 gap-1.5 rounded-xl px-3.5 text-xs font-semibold shadow-xs"
          >
            <HugeiconsIcon icon={PlusSignIcon} className="size-3.5" />
            <span>Agregar Asignatura</span>
          </Button>
        </div>
      </div>

      {/* TanStack Data Table */}
      <DataTable
        columns={columns}
        data={planData?.cursos ?? []}
        isLoading={isLoadingPlan}
        pagination={false}
        emptyMessage={`El grado ${currentGrado?.nombre ?? ""} aún no tiene asignaturas asignadas. Puedes agregar cursos uno a uno o copiar el plan de otro grado.`}
      />

      {/* Modales */}
      <AddCursoPlanModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        grado={currentGrado}
        availableCursos={availableCursos}
        onSubmit={handleAddSubmit}
        isLoading={addMutation.isPending}
      />

      <UpdateHorasModal
        open={Boolean(selectedItemForHoras)}
        onOpenChange={(open) => !open && setSelectedItemForHoras(null)}
        item={selectedItemForHoras}
        onSubmit={handleUpdateHorasSubmit}
        isLoading={updateHorasMutation.isPending}
      />

      <CopyPlanModal
        open={copyModalOpen}
        onOpenChange={setCopyModalOpen}
        currentGrado={currentGrado}
        allGrados={grados}
        onSubmit={handleCopySubmit}
        isLoading={copyMutation.isPending}
      />
    </div>
  );
}
