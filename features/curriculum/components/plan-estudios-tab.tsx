"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BookOpen01Icon,
  Clock01Icon,
  Copy01Icon,
  Delete02Icon,
  Edit01Icon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/common/empty-state";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Spinner } from "@/components/common/spinner";
import { AddCursoPlanModal } from "./modals/add-curso-plan-modal";
import { UpdateHorasModal } from "./modals/update-horas-modal";
import { CopyPlanModal } from "./modals/copy-plan-modal";
import {
  useAddCursoPlanMutation,
  useCopyPlanMutation,
  useCursosQuery,
  usePlanEstudioQuery,
  useRemoveCursoPlanMutation,
  useUpdateHorasPlanMutation,
} from "../hooks";
import type { Grado, PlanEstudioItem } from "../types";
import type {
  AddCursoPlanFormValues,
  CopyPlanFormValues,
  UpdateHorasPlanFormValues,
} from "../schemas";

interface PlanEstudiosTabProps {
  grados: Grado[];
  selectedGradoId: string;
  onSelectGrado: (gradoId: string) => void;
}

export function PlanEstudiosTab({ grados, selectedGradoId, onSelectGrado }: PlanEstudiosTabProps) {
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
  const [itemToDelete, setItemToDelete] = React.useState<PlanEstudioItem | null>(null);

  // Available courses (active courses not already in the plan of this grade)
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

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    await removeMutation.mutateAsync(itemToDelete.id);
    setItemToDelete(null);
  };

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
            <div className="flex items-center gap-2">
              <h2 className="text-foreground text-base font-bold tracking-tight">
                Plan de Estudios — {currentGrado?.nombre}
              </h2>
            </div>
            <p className="text-muted-foreground text-xs">
              Asignaturas curriculares oficiales y horas pedagógicas semanales.
            </p>
          </div>
        </div>

        {/* Indicador de Total de Horas y Acciones */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Badge Informativo de Horas Totales */}
          <div className="border-border/70 bg-muted/30 flex items-center gap-2 rounded-xl border px-3.5 py-1.5 shadow-2xs">
            <HugeiconsIcon icon={Clock01Icon} className="text-primary size-4" />
            <span className="text-muted-foreground text-xs font-medium">Total semanal:</span>
            <span className="text-foreground text-xs font-bold">
              {planData?.totalHoras ?? 0} hrs
            </span>
          </div>

          {/* Botón Copiar Plan */}
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

          {/* Botón Agregar Asignatura */}
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

      {/* Contenido / Tabla del Plan */}
      {isLoadingPlan ? (
        <div className="border-border/60 bg-card/40 flex h-56 items-center justify-center rounded-2xl border">
          <Spinner className="size-7" />
        </div>
      ) : !planData || planData.cursos.length === 0 ? (
        <EmptyState
          icon={BookOpen01Icon}
          title="Plan de estudios vacío"
          description={`El grado ${currentGrado?.nombre} aún no tiene asignaturas asignadas. Puedes agregar cursos uno a uno o copiar el plan de otro grado.`}
          action={
            <div className="mt-2 flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCopyModalOpen(true)}
                className="gap-1.5 rounded-xl text-xs"
              >
                <HugeiconsIcon icon={Copy01Icon} className="size-3.5" />
                <span>Copiar plan de otro grado</span>
              </Button>
              <Button
                size="sm"
                onClick={() => setAddModalOpen(true)}
                disabled={availableCursos.length === 0}
                className="gap-1.5 rounded-xl text-xs"
              >
                <HugeiconsIcon icon={PlusSignIcon} className="size-3.5" />
                <span>Agregar Asignatura</span>
              </Button>
            </div>
          }
        />
      ) : (
        <div className="border-border/80 bg-card overflow-hidden rounded-2xl border shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-border/60 bg-muted/40 text-muted-foreground border-b text-[11px] font-semibold tracking-wider uppercase">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    Código
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Asignatura
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Área Curricular
                  </th>
                  <th scope="col" className="px-4 py-3 text-center">
                    Horas Semanales
                  </th>
                  <th scope="col" className="px-4 py-3 text-right">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border/60 divide-y">
                {planData.cursos.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    {/* Código con indicador de color */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="size-3 shrink-0 rounded-full border border-black/10 dark:border-white/10"
                          style={{ backgroundColor: item.curso.colorHex || "#2563EB" }}
                          title={`Color: ${item.curso.colorHex || "#2563EB"}`}
                        />
                        <span className="text-foreground font-mono font-bold">
                          {item.curso.codigo}
                        </span>
                      </div>
                    </td>

                    {/* Nombre y descripción */}
                    <td className="px-4 py-3.5">
                      <div>
                        <p className="text-foreground font-semibold">{item.curso.nombre}</p>
                        {item.curso.descripcion && (
                          <p className="text-muted-foreground line-clamp-1 text-[11px]">
                            {item.curso.descripcion}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Área Curricular */}
                    <td className="px-4 py-3.5">
                      <Badge
                        variant="secondary"
                        className="rounded-lg px-2.5 py-0.5 text-[11px] font-medium"
                      >
                        {item.curso.areaCurricularNombre}
                      </Badge>
                    </td>

                    {/* Horas Semanales */}
                    <td className="px-4 py-3.5 text-center">
                      <div className="border-border/60 bg-muted/30 inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1">
                        <span className="text-foreground text-xs font-bold">
                          {item.horasSemanales}
                        </span>
                        <span className="text-muted-foreground text-[10px]">hrs/sem</span>
                      </div>
                    </td>

                    {/* Acciones */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedItemForHoras(item)}
                          className="text-muted-foreground hover:text-foreground size-8 rounded-lg"
                          title="Modificar horas"
                          aria-label={`Modificar horas de ${item.curso.nombre}`}
                        >
                          <HugeiconsIcon icon={Edit01Icon} className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setItemToDelete(item)}
                          className="text-destructive/80 hover:bg-destructive/10 hover:text-destructive size-8 rounded-lg"
                          title="Quitar asignatura del plan"
                          aria-label={`Quitar ${item.curso.nombre} del plan`}
                        >
                          <HugeiconsIcon icon={Delete02Icon} className="size-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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

      {/* Confirmación para quitar curso */}
      <ConfirmDialog
        open={Boolean(itemToDelete)}
        onOpenChange={(open) => !open && setItemToDelete(null)}
        title="¿Quitar asignatura del plan de estudios?"
        description={
          itemToDelete
            ? `¿Estás seguro de que deseas retirar "${itemToDelete.curso.nombre}" del plan de ${currentGrado?.nombre}? Si ya cuenta con carga académica en secciones de este grado en el año en curso, el sistema bloqueará la acción.`
            : ""
        }
        confirmText="Quitar Asignatura"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={handleConfirmDelete}
        isLoading={removeMutation.isPending}
      />
    </div>
  );
}
