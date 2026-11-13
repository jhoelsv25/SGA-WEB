"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Activity01Icon,
  Add01Icon,
  Award01Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Delete02Icon,
  FileEditIcon,
  Folder01Icon,
  LockIcon,
  Search01Icon,
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
import {
  useCerrarTarea,
  useEliminarTarea,
  usePublicarTarea,
  useRegistrarActividad,
  useTareas,
} from "../../hooks";
import { TareaModal } from "../modals/tarea-modal";
import { EntregasTareaModal } from "../modals/entregas-tarea-modal";
import { ResolverTareaModal } from "../modals/resolver-tarea-modal";
import {
  ActividadRecursoModal,
  type RecursoActividadTarget,
} from "../modals/actividad-recurso-modal";
import type { Tarea, TipoTarea, Unidad } from "../../types";

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
  initialTareaId,
  soloLectura = false,
  estudianteId,
}: {
  cursoSeccionId: string;
  periodoId?: string;
  puedeAdministrar: boolean;
  unidades?: Unidad[];
  initialTareaId?: string;
  soloLectura?: boolean;
  estudianteId?: string;
}) {
  const router = useRouter();
  const {
    data: tareas = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useTareas(cursoSeccionId, periodoId, estudianteId);

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
  }>({ abierto: Boolean(initialTareaId && !puedeAdministrar), tareaId: initialTareaId ?? null });

  const [tareaAEliminar, setTareaAEliminar] = React.useState<Tarea | null>(null);
  const [tareaACerrar, setTareaACerrar] = React.useState<{
    tarea: Tarea;
    asignarCero: boolean;
  } | null>(null);
  const [recursoActividad, setRecursoActividad] = React.useState<RecursoActividadTarget | null>(
    null,
  );

  const registrarActividad = useRegistrarActividad();

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

  const obtenerConfigTipo = (tipo: TipoTarea) => {
    switch (tipo) {
      case "trabajo":
        return {
          icon: Task01Icon,
          color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
          label: "Trabajo",
          tone: "brand" as const,
        };
      case "proyecto":
        return {
          icon: Folder01Icon,
          color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
          label: "Proyecto",
          tone: "info" as const,
        };
      case "cuestionario":
        return {
          icon: Task01Icon,
          color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
          label: "Cuestionario",
          tone: "brand" as const,
        };
      case "examen":
        return {
          icon: Award01Icon,
          color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
          label: "Examen",
          tone: "danger" as const,
        };
      default:
        return {
          icon: Task01Icon,
          color: "bg-primary/10 text-primary border-primary/20",
          label: tipo,
          tone: "neutral" as const,
        };
    }
  };

  return (
    <div className="space-y-5">
      {/* Barra de acciones y filtros moderna */}
      <div className="border-border/80 bg-card flex flex-col justify-between gap-3.5 rounded-2xl border p-4 shadow-xs sm:flex-row sm:items-center">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          <div className="relative min-w-56 flex-1 sm:max-w-xs">
            <HugeiconsIcon
              icon={Search01Icon}
              size={16}
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
            />
            <Input
              placeholder="Buscar por título o instrucción..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="h-9 rounded-xl pr-3 pl-9 text-xs"
            />
          </div>

          <div className="w-40">
            <SelectOption
              options={TIPOS_FILTRO}
              value={tipoFiltro}
              onSelect={setTipoFiltro}
              placeholder="Tipo"
              className="h-9 text-xs"
            />
          </div>

          {puedeAdministrar && (
            <div className="w-40">
              <SelectOption
                options={ESTADOS_FILTRO}
                value={estadoFiltro}
                onSelect={setEstadoFiltro}
                placeholder="Estado"
                className="h-9 text-xs"
              />
            </div>
          )}
        </div>

        {puedeAdministrar && (
          <Button
            type="button"
            className="h-9 gap-1.5 rounded-xl text-xs font-semibold shadow-xs"
            onClick={() => setModalTarea({ abierto: true, tarea: null })}
          >
            <HugeiconsIcon icon={Add01Icon} size={15} />
            <span>Nueva evaluación</span>
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
          <div className="space-y-3">
            {tareasFiltradas.map((tarea) => {
              const esVencida = new Date(tarea.fechaLimite).getTime() < ahoraMs;
              const miEntrega = tarea.miEntrega;
              const config = obtenerConfigTipo(tarea.tipo);

              return (
                <div
                  key={tarea.id}
                  className="group border-border/80 bg-card hover:border-border flex flex-col justify-between gap-4 rounded-2xl border p-4 transition-all hover:shadow-2xs sm:flex-row sm:items-center"
                >
                  {/* Información principal con icono de tipo */}
                  <div className="flex min-w-0 items-start gap-3.5">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${config.color}`}
                    >
                      <HugeiconsIcon icon={config.icon} size={20} />
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-foreground text-sm font-bold tracking-tight">
                          {tarea.titulo}
                        </span>
                        <StatusBadge tone={config.tone}>{config.label}</StatusBadge>

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
                        ) : miEntrega ? (
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
                          <span className="bg-muted text-muted-foreground rounded-md px-1.5 py-0.5 text-[10px] font-medium">
                            Entrega tardía permitida
                          </span>
                        )}
                      </div>

                      {tarea.instrucciones && (
                        <p className="text-muted-foreground line-clamp-2 text-xs">
                          {tarea.instrucciones}
                        </p>
                      )}

                      <div className="text-muted-foreground flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[11px]">
                        <span className="flex items-center gap-1 font-medium">
                          <HugeiconsIcon
                            icon={Calendar03Icon}
                            size={12}
                            className="text-muted-foreground/70"
                          />
                          <span>Límite: {formatDate(tarea.fechaLimite)}</span>
                        </span>

                        {tarea.limiteTiempoMinutos && (
                          <span className="flex items-center gap-1">
                            <HugeiconsIcon
                              icon={Clock01Icon}
                              size={12}
                              className="text-muted-foreground/70"
                            />
                            <span>{tarea.limiteTiempoMinutos} min</span>
                          </span>
                        )}

                        <span>· Escala: 0 a {tarea.puntajeMaximo}</span>

                        {tarea.tipo === "cuestionario" || tarea.tipo === "examen" ? (
                          <span>
                            · Intentos máx: {tarea.intentosMaximos}
                            {typeof tarea.intentosRestantes === "number" &&
                              ` (${tarea.intentosRestantes} restantes)`}
                          </span>
                        ) : (
                          <span>· 1 intento</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                    {puedeAdministrar ? (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8.5 gap-1.5 rounded-xl text-xs font-medium"
                          onClick={() =>
                            router.push(`/admin/aula-virtual/${cursoSeccionId}/tareas/${tarea.id}`)
                          }
                        >
                          <HugeiconsIcon icon={UserGroupIcon} size={14} />
                          <span>Entregas</span>
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8.5 gap-1.5 rounded-xl text-xs font-medium"
                          onClick={() =>
                            setRecursoActividad({
                              tipo: "tarea",
                              id: tarea.id,
                              titulo: tarea.titulo,
                            })
                          }
                        >
                          <HugeiconsIcon icon={Activity01Icon} size={14} />
                          <span className="hidden md:inline">Actividad</span>
                        </Button>

                        {tarea.estado === "borrador" && (
                          <Button
                            type="button"
                            size="sm"
                            className="h-8.5 gap-1.5 rounded-xl text-xs font-semibold"
                            onClick={() => publicar.mutate(tarea.id)}
                            disabled={publicar.isPending}
                          >
                            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
                            <span>Publicar</span>
                          </Button>
                        )}

                        {tarea.estado === "publicada" && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8.5 gap-1.5 rounded-xl text-xs font-medium text-amber-600 hover:text-amber-700"
                            onClick={() =>
                              setTareaACerrar({
                                tarea,
                                asignarCero: new Date(tarea.fechaLimite).getTime() <= Date.now(),
                              })
                            }
                            disabled={cerrar.isPending}
                          >
                            <HugeiconsIcon icon={LockIcon} size={14} />
                            <span>Cerrar</span>
                          </Button>
                        )}

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8.5 gap-1.5 rounded-xl text-xs font-medium"
                          onClick={() => setModalTarea({ abierto: true, tarea })}
                        >
                          <HugeiconsIcon icon={FileEditIcon} size={14} />
                          <span>Editar</span>
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10 h-8.5 rounded-xl text-xs"
                          onClick={() => setTareaAEliminar(tarea)}
                        >
                          <HugeiconsIcon icon={Delete02Icon} size={14} />
                        </Button>
                      </>
                    ) : (
                      // Estudiante o Apoderado
                      <Button
                        type="button"
                        variant={miEntrega || soloLectura ? "outline" : "default"}
                        size="sm"
                        className="min-h-9 gap-1.5"
                        onClick={() => {
                          if (!soloLectura) {
                            registrarActividad.mutate({ tareaId: tarea.id, accion: "abrio" });
                          }
                          setModalResolver({ abierto: true, tareaId: tarea.id });
                        }}
                      >
                        {soloLectura ? (
                          <>
                            <HugeiconsIcon icon={Task01Icon} size={16} />
                            Ver detalle y entrega
                          </>
                        ) : miEntrega?.estado === "calificada" ? (
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
          unidades={unidades}
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
          soloLectura={soloLectura}
          estudianteId={estudianteId}
        />
      )}

      <ConfirmDialog
        open={Boolean(tareaACerrar)}
        onOpenChange={(abierto) => !abierto && setTareaACerrar(null)}
        title="Cerrar actividad evaluativa"
        description={
          tareaACerrar
            ? `¿Deseas cerrar "${tareaACerrar.tarea.titulo}"? Ya no se recibirán nuevas entregas.`
            : ""
        }
        confirmText="Cerrar actividad"
        onConfirm={() => {
          if (tareaACerrar) {
            cerrar.mutate({
              tareaId: tareaACerrar.tarea.id,
              asignarCeroSinEntrega: tareaACerrar.asignarCero,
            });
            setTareaACerrar(null);
          }
        }}
      >
        {tareaACerrar && (
          <label className="mt-2 flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-xs">
            <input
              type="checkbox"
              checked={tareaACerrar.asignarCero}
              onChange={(e) =>
                setTareaACerrar((prev) =>
                  prev ? { ...prev, asignarCero: e.target.checked } : null,
                )
              }
              className="accent-primary"
            />
            <span>
              Asignar nota <strong>00</strong> automáticamente a los estudiantes que no registraron
              entrega.
            </span>
          </label>
        )}
      </ConfirmDialog>

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

      <ActividadRecursoModal
        open={Boolean(recursoActividad)}
        onOpenChange={(abierto) => !abierto && setRecursoActividad(null)}
        recurso={recursoActividad}
      />
    </div>
  );
}
