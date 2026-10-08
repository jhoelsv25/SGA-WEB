"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Book02Icon,
  Delete02Icon,
  Edit01Icon,
  PlusSignIcon,
  RefreshIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/common/spinner";
import { EmptyState } from "@/components/common/empty-state";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { SelectOption } from "@/components/common/select";
import { CursoModal } from "./modals/curso-modal";
import {
  useCreateCursoMutation,
  useCursosQuery,
  useDesactivarCursoMutation,
  useReactivarCursoMutation,
  useUpdateCursoMutation,
} from "../hooks";
import { AREA_CURRICULAR_OPTIONS } from "../consts";
import type { AreaCurricular, CreateCursoPayload, Curso } from "../types";
import type { CursoFormValues } from "../schemas";

export function CursosTab() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedArea, setSelectedArea] = React.useState<string>("");
  const [statusFilter, setStatusFilter] = React.useState<"todos" | "activo" | "inactivo">("todos");

  // Queries & Mutations
  const { data: cursos = [], isLoading } = useCursosQuery({
    estado: statusFilter,
    areaCurricular: (selectedArea as AreaCurricular) || undefined,
    search: searchTerm.trim() || undefined,
  });

  const createMutation = useCreateCursoMutation();
  const updateMutation = useUpdateCursoMutation();
  const desactivarMutation = useDesactivarCursoMutation();
  const reactivarMutation = useReactivarCursoMutation();

  // Modals state
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedCurso, setSelectedCurso] = React.useState<Curso | null>(null);
  const [cursoToDeactivate, setCursoToDeactivate] = React.useState<Curso | null>(null);

  const handleOpenCreate = () => {
    setSelectedCurso(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (curso: Curso) => {
    setSelectedCurso(curso);
    setModalOpen(true);
  };

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

  const handleConfirmDeactivate = async () => {
    if (!cursoToDeactivate) return;
    await desactivarMutation.mutateAsync(cursoToDeactivate.id);
    setCursoToDeactivate(null);
  };

  const handleReactivate = async (curso: Curso) => {
    await reactivarMutation.mutateAsync(curso.id);
  };

  return (
    <div className="space-y-6">
      {/* Barra de Filtros y Búsqueda */}
      <div className="border-border/80 bg-card/60 flex flex-col gap-3 rounded-2xl border p-4 shadow-xs backdrop-blur-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          {/* Input de Búsqueda */}
          <div className="relative w-full sm:w-64">
            <HugeiconsIcon
              icon={Search01Icon}
              className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
            />
            <Input
              type="text"
              placeholder="Buscar por código o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 rounded-xl pl-9 text-xs"
            />
          </div>

          {/* Filtro por Área */}
          <div className="w-full sm:w-56">
            <SelectOption
              options={[{ value: "", label: "Todas las áreas" }, ...AREA_CURRICULAR_OPTIONS]}
              value={selectedArea}
              onSelect={setSelectedArea}
              placeholder="Filtrar por área..."
              searchPlaceholder="Buscar área..."
              clearable
            />
          </div>

          {/* Selector de Estado */}
          <Tabs
            value={statusFilter}
            onValueChange={(val) => setStatusFilter(val as "todos" | "activo" | "inactivo")}
          >
            <TabsList className="bg-muted/40 h-9 rounded-xl p-1">
              <TabsTrigger value="todos" className="rounded-lg px-3 text-xs font-medium">
                Todos
              </TabsTrigger>
              <TabsTrigger value="activo" className="rounded-lg px-3 text-xs font-medium">
                Activos
              </TabsTrigger>
              <TabsTrigger value="inactivo" className="rounded-lg px-3 text-xs font-medium">
                Inactivos
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Botón Nuevo Curso */}
        <Button
          type="button"
          size="sm"
          onClick={handleOpenCreate}
          className="shadow-primary/20 h-9 shrink-0 gap-1.5 rounded-xl px-4 text-xs font-semibold shadow-xs"
        >
          <HugeiconsIcon icon={PlusSignIcon} className="size-3.5" />
          <span>Nuevo Curso</span>
        </Button>
      </div>

      {/* Contenido / Listado de Cursos */}
      {isLoading ? (
        <div className="border-border/60 bg-card/40 flex h-56 items-center justify-center rounded-2xl border">
          <Spinner className="size-7" />
        </div>
      ) : cursos.length === 0 ? (
        <EmptyState
          icon={Book02Icon}
          title="No se encontraron cursos"
          description={
            searchTerm || selectedArea || statusFilter !== "todos"
              ? "No hay asignaturas que coincidan con los filtros aplicados. Intenta restablecer la búsqueda."
              : "El catálogo de cursos se encuentra vacío."
          }
          action={
            <Button
              size="sm"
              onClick={handleOpenCreate}
              className="mt-2 gap-1.5 rounded-xl text-xs"
            >
              <HugeiconsIcon icon={PlusSignIcon} className="size-3.5" />
              <span>Registrar primer curso</span>
            </Button>
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
                    Nombre
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Área Curricular
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Descripción
                  </th>
                  <th scope="col" className="px-4 py-3 text-center">
                    Estado
                  </th>
                  <th scope="col" className="px-4 py-3 text-right">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border/60 divide-y">
                {cursos.map((c) => (
                  <tr
                    key={c.id}
                    className={`hover:bg-muted/30 transition-colors ${
                      !c.activo ? "bg-muted/10 opacity-70" : ""
                    }`}
                  >
                    {/* Código con Color Pill */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="size-3 shrink-0 rounded-full border border-black/10 dark:border-white/10"
                          style={{ backgroundColor: c.colorHex || "#2563EB" }}
                          title={`Color: ${c.colorHex || "#2563EB"}`}
                        />
                        <span className="text-foreground font-mono font-bold">{c.codigo}</span>
                      </div>
                    </td>

                    {/* Nombre */}
                    <td className="px-4 py-3.5">
                      <p className="text-foreground font-semibold">{c.nombre}</p>
                    </td>

                    {/* Área Curricular */}
                    <td className="px-4 py-3.5">
                      <Badge
                        variant="secondary"
                        className="rounded-lg px-2.5 py-0.5 text-[11px] font-medium"
                      >
                        {c.areaCurricularNombre}
                      </Badge>
                    </td>

                    {/* Descripción */}
                    <td className="max-w-xs px-4 py-3.5">
                      <p className="text-muted-foreground line-clamp-1 text-[11px]">
                        {c.descripcion || "—"}
                      </p>
                    </td>

                    {/* Estado */}
                    <td className="px-4 py-3.5 text-center">
                      {c.activo ? (
                        <Badge
                          variant="default"
                          className="rounded-lg border border-emerald-600/30 bg-emerald-600/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400"
                        >
                          Activo
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-muted text-muted-foreground rounded-lg px-2 py-0.5 text-[10px] font-semibold"
                        >
                          Inactivo
                        </Badge>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(c)}
                          className="text-muted-foreground hover:text-foreground size-8 rounded-lg"
                          title="Editar curso"
                          aria-label={`Editar ${c.nombre}`}
                        >
                          <HugeiconsIcon icon={Edit01Icon} className="size-3.5" />
                        </Button>

                        {c.activo ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCursoToDeactivate(c)}
                            className="text-destructive/80 hover:bg-destructive/10 hover:text-destructive size-8 rounded-lg"
                            title="Desactivar curso"
                            aria-label={`Desactivar ${c.nombre}`}
                          >
                            <HugeiconsIcon icon={Delete02Icon} className="size-3.5" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleReactivate(c)}
                            className="size-8 rounded-lg text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/40"
                            title="Reactivar curso"
                            aria-label={`Reactivar ${c.nombre}`}
                          >
                            <HugeiconsIcon icon={RefreshIcon} className="size-3.5" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Crear / Editar Curso */}
      <CursoModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        curso={selectedCurso}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Diálogo de Confirmación para Desactivar */}
      <ConfirmDialog
        open={Boolean(cursoToDeactivate)}
        onOpenChange={(open) => !open && setCursoToDeactivate(null)}
        title="¿Desactivar asignatura del catálogo?"
        description={
          cursoToDeactivate
            ? `¿Confirmas la desactivación de "${cursoToDeactivate.nombre}"? Un curso inactivo no se podrá agregar a nuevos planes ni horarios. Si tiene carga académica activa en el año escolar en curso, el sistema bloqueará la operación.`
            : ""
        }
        confirmText="Desactivar Curso"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={handleConfirmDeactivate}
        isLoading={desactivarMutation.isPending}
      />
    </div>
  );
}
