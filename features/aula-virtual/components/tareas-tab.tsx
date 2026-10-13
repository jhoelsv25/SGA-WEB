"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Delete02Icon,
  FileEditIcon,
  LockIcon,
  Task01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { PageState } from "@/components/common/page-state";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { SelectOption } from "@/components/common/select";
import { formatDate } from "@/lib/formatters/date";
import { useCerrarTarea, useEliminarTarea, usePublicarTarea, useTareas } from "../hooks";
import { TareaModal } from "./tarea-modal";
import { EntregasTareaModal } from "./entregas-tarea-modal";
import { ResolverTareaModal } from "./resolver-tarea-modal";
import type { Tarea, TipoTarea, Unidad } from "../types";

const TIPOS_FILTRO = [
  { value: "todos", label: "Todos los tipos" },
  { value: "trabajo", label: "Trabajos" },
  { value: "proyecto", label: "Proyectos" },
  { value: "cuestionario", label: "Cuestionarios" },
  { value: "examen", label: "Exámenes" },
];

const ESTADOS_FILTRO = [
  { value: "todos", label: "Todos los estados" },
  { value: "publicada", label: "Publicadas" },
  { value: "borrador", label: "Borradores" },
  { value: "cerrada", label: "Cerradas" },
];

export function TareasTab({
  cursoSeccionId,
  periodoId,
  puedeAdministrar,
  unidades = [],
}: {
  cursoSeccionId: string;
  periodoId?: string;
  puedeAdministrar: boolean;
  unidades?: Unidad[];
}) {
  const {
    data: tareas = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useTareas(cursoSeccionId, periodoId);

  const publicar = usePublicarTarea();
  const cerrar = useCerrarTarea();
  const eliminar = useEliminarTarea();

  // Filtros
  const [ahoraMs] = React.useState(() => Date.now());
  const [busqueda, setBusqueda] = React.useState("");
  const [tipoFiltro, setTipoFiltro] = React.useState("todos");
  const [estadoFiltro, setEstadoFiltro] = React.useState("todos");

  // Modales
  const [modalTarea, setModalTarea] = React.useState<{
    abierto: boolean;
    tarea?: Tarea | null;
  }>({ abierto: false, tarea: null });

  const [modalEntregas, setModalEntregas] = React.useState<{
    abierto: boolean;
    tarea: Tarea | null;
  }>({ abierto: false, tarea: null });

  const [modalResolver, setModalResolver] = React.useState<{
    abierto: boolean;
    tareaId: string | null;
  }>({ abierto: false, tareaId: null });

  const [tareaAEliminar, setTareaAEliminar] = React.useState<Tarea | null>(null);

  // Filtrado de tareas
  const tareasFiltradas = React.useMemo(() => {
    return tareas.filter((t) => {
      if (tipoFiltro !== "todos" && t.tipo !== tipoFiltro) return false;
      if (estadoFiltro !== "todos" && t.estado !== estadoFiltro) return false;
      if (
        busqueda.trim() &&
        !t.titulo.toLowerCase().includes(busqueda.toLowerCase()) &&
        !t.instrucciones?.toLowerCase().includes(busqueda.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [tareas, tipoFiltro, estadoFiltro, busqueda]);

  const obtenerTipoTone = (tipo: TipoTarea): "brand" | "info" | "danger" | "neutral" => {
    switch (tipo) {
      case "trabajo":
        return "brand";
      case "proyecto":
        return "info";
      case "cuestionario":
        return "brand";
      case "examen":
        return "danger";
      default:
        return "neutral";
    }
  };

  const formatearTipo = (tipo: TipoTarea) => {
    switch (tipo) {
      case "trabajo":
        return "Trabajo";
      case "proyecto":
        return "Proyecto";
      case "cuestionario":
        return "Cuestionario";
      case "examen":
        return "Examen";
      default:
        return tipo;
    }
  };

  return (
    <div className="space-y-4">
      {/* Barra de acciones y filtros */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-64 flex-1 flex-wrap items-center gap-2">
          <Input
            placeholder="Buscar por título o instrucción..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="h-9 max-w-xs"
          />
          <div className="w-44">
            <SelectOption
              options={TIPOS_FILTRO}
              value={tipoFiltro}
              onSelect={setTipoFiltro}
              placeholder="Tipo"
            />
          </div>
          {puedeAdministrar && (
            <div className="w-44">
              <SelectOption
                options={ESTADOS_FILTRO}
                value={estadoFiltro}
                onSelect={setEstadoFiltro}
                placeholder="Estado"
              />
            </div>
          )}
        </div>

        {puedeAdministrar && (
          <Button
            type="button"
            className="min-h-9 gap-1.5"
            onClick={() => setModalTarea({ abierto: true, tarea: null })}
          >
            <HugeiconsIcon icon={Add01Icon} size={16} />
            Nueva tarea o evaluación
          </Button>
        )}
      </div>

      <PageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        errorTitle="No se pudieron cargar las tareas"
      >
        {tareasFiltradas.length === 0 ? (
          <EmptyState
            title={
              tareas.length === 0
                ? "No hay tareas ni evaluaciones"
                : "No se encontraron coincidencias"
            }
            description={
              tareas.length === 0
                ? puedeAdministrar
                  ? "Crea trabajos, proyectos, cuestionarios o exámenes para evaluar a los estudiantes."
                  : "El docente aún no ha publicado actividades evaluativas en este curso."
                : "Prueba ajustando los filtros de búsqueda."
            }
            icon={Task01Icon}
            action={
              puedeAdministrar && tareas.length === 0 ? (
                <Button
                  type="button"
                  onClick={() => setModalTarea({ abierto: true, tarea: null })}
                  className="gap-2"
                >
                  <HugeiconsIcon icon={Add01Icon} size={16} />
                  Crear primera tarea
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="grid gap-3">
            {tareasFiltradas.map((tarea) => {
              const esVencida = new Date(tarea.fechaLimite).getTime() < ahoraMs;
              const miEntrega = tarea.miEntrega;

              return (
                <div
                  key={tarea.id}
                  className="group bg-card hover:border-foreground/20 relative flex flex-wrap items-center justify-between gap-4 rounded-xl border p-4 transition-all hover:shadow-2xs"
                >
                  {/* Información principal */}
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-semibold tracking-tight">{tarea.titulo}</span>
                      <StatusBadge tone={obtenerTipoTone(tarea.tipo)}>
                        {formatearTipo(tarea.tipo)}
                      </StatusBadge>

                      {puedeAdministrar ? (
                        <StatusBadge
                          tone={
                            tarea.estado === "publicada"
                              ? "success"
                              : tarea.estado === "borrador"
                                ? "neutral"
                                : "danger"
                          }
                        >
                          {tarea.estado.toUpperCase()}
                        </StatusBadge>
                      ) : // Para estudiante: estado de su entrega
                      miEntrega ? (
                        <StatusBadge
                          tone={
                            miEntrega.estado === "calificada"
                              ? "success"
                              : miEntrega.estado === "devuelta"
                                ? "warning"
                                : "brand"
                          }
                        >
                          {miEntrega.estado === "calificada"
                            ? `Calificada (${miEntrega.nota ?? 0}/20)`
                            : miEntrega.estado === "devuelta"
                              ? "Devuelta para corrección"
                              : "Entregada"}
                        </StatusBadge>
                      ) : esVencida ? (
                        <StatusBadge tone="danger">Vencida</StatusBadge>
                      ) : (
                        <StatusBadge tone="warning">Pendiente</StatusBadge>
                      )}

                      {tarea.permiteEntregaTardia && (
                        <span className="text-muted-foreground bg-muted rounded-md px-2 py-0.5 text-[11px]">
                          Permite entrega tardía
                        </span>
                      )}
                    </div>

                    {tarea.instrucciones && (
                      <p className="text-muted-foreground line-clamp-2 text-sm">
                        {tarea.instrucciones}
                      </p>
                    )}

                    <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                      <span className="flex items-center gap-1">
                        <HugeiconsIcon icon={Calendar03Icon} size={14} />
                        Límite: {formatDate(tarea.fechaLimite)}
                      </span>

                      {tarea.limiteTiempoMinutos && (
                        <span className="flex items-center gap-1">
                          <HugeiconsIcon icon={Clock01Icon} size={14} />
                          {tarea.limiteTiempoMinutos} min
                        </span>
                      )}

                      <span>Puntaje: {tarea.puntajeMaximo} pts</span>

                      {tarea.tipo === "cuestionario" || tarea.tipo === "examen" ? (
                        <span>
                          Intentos máx: {tarea.intentosMaximos}
                          {typeof tarea.intentosRestantes === "number" &&
                            ` (${tarea.intentosRestantes} restantes)`}
                        </span>
                      ) : (
                        <span>1 intento (editable)</span>
                      )}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-wrap items-center gap-2">
                    {puedeAdministrar ? (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="min-h-9 gap-1.5"
                          onClick={() => setModalEntregas({ abierto: true, tarea })}
                        >
                          <HugeiconsIcon icon={UserGroupIcon} size={16} />
                          Entregas
                        </Button>

                        {tarea.estado === "borrador" && (
                          <Button
                            type="button"
                            size="sm"
                            className="min-h-9 gap-1.5"
                            onClick={() => publicar.mutate(tarea.id)}
                            disabled={publicar.isPending}
                          >
                            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
                            Publicar
                          </Button>
                        )}

                        {tarea.estado === "publicada" && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="min-h-9 gap-1.5 text-amber-600 hover:text-amber-700"
                            onClick={() => cerrar.mutate(tarea.id)}
                            disabled={cerrar.isPending}
                          >
                            <HugeiconsIcon icon={LockIcon} size={16} />
                            Cerrar
                          </Button>
                        )}

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="min-h-9 gap-1.5"
                          onClick={() => setModalTarea({ abierto: true, tarea })}
                        >
                          <HugeiconsIcon icon={FileEditIcon} size={16} />
                          Editar
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive min-h-9 gap-1.5"
                          onClick={() => setTareaAEliminar(tarea)}
                        >
                          <HugeiconsIcon icon={Delete02Icon} size={16} />
                        </Button>
                      </>
                    ) : (
                      // Estudiante
                      <Button
                        type="button"
                        variant={miEntrega ? "outline" : "default"}
                        size="sm"
                        className="min-h-9 gap-1.5"
                        onClick={() => setModalResolver({ abierto: true, tareaId: tarea.id })}
                      >
                        {miEntrega?.estado === "calificada" ? (
                          <>
                            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} />
                            Ver retroalimentación
                          </>
                        ) : miEntrega ? (
                          <>
                            <HugeiconsIcon icon={FileEditIcon} size={16} />
                            Modificar entrega
                          </>
                        ) : (
                          <>
                            <HugeiconsIcon icon={Task01Icon} size={16} />
                            {tarea.tipo === "cuestionario" || tarea.tipo === "examen"
                              ? "Comenzar evaluación"
                              : "Entregar tarea"}
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </PageState>

      {/* Modales */}
      {modalTarea.abierto && (
        <TareaModal
          abierto={modalTarea.abierto}
          onOpenChange={(abierto) => setModalTarea({ abierto, tarea: modalTarea.tarea })}
          cursoSeccionId={cursoSeccionId}
          tarea={modalTarea.tarea}
          unidadIdDefecto={unidades[0]?.id}
          periodoIdDefecto={periodoId}
        />
      )}

      {modalEntregas.abierto && modalEntregas.tarea && (
        <EntregasTareaModal
          abierto={modalEntregas.abierto}
          onOpenChange={(abierto) => setModalEntregas({ abierto, tarea: modalEntregas.tarea })}
          tarea={modalEntregas.tarea}
        />
      )}

      {modalResolver.abierto && modalResolver.tareaId && (
        <ResolverTareaModal
          abierto={modalResolver.abierto}
          onOpenChange={(abierto) => setModalResolver({ abierto, tareaId: modalResolver.tareaId })}
          tareaId={modalResolver.tareaId}
        />
      )}

      <ConfirmDialog
        open={Boolean(tareaAEliminar)}
        onOpenChange={(abierto) => !abierto && setTareaAEliminar(null)}
        title="Eliminar tarea o evaluación"
        description={`¿Estás seguro de que deseas eliminar "${tareaAEliminar?.titulo}"? Esta acción borrará todas las preguntas y entregas asociadas.`}
        confirmText="Eliminar permanentemente"
        variant="danger"
        onConfirm={() => {
          if (tareaAEliminar) {
            eliminar.mutate(tareaAEliminar.id);
            setTareaAEliminar(null);
          }
        }}
      />
    </div>
  );
}
