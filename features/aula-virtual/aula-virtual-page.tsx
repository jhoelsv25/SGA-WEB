"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Activity01Icon,
  ArrowLeft01Icon,
  Award01Icon,
  BookOpen01Icon,
  BubbleChatIcon,
  Calendar03Icon,
  ChartBarLineIcon,
  CloudUploadIcon,
  Comment01Icon,
  Delete02Icon,
  FileAddIcon,
  FileEditIcon,
  PlusSignIcon,
  ShieldAlertIcon,
  Task01Icon,
  TeacherIcon,
} from "@hugeicons/core-free-icons";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import { SelectOption } from "@/components/common/select";
import { StatusBadge } from "@/components/common/status-badge";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/formatters/date";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import { urlDeArchivo } from "./api";
import {
  ActividadRecursoModal,
  ChatTab,
  CursosClassroomGrid,
  LibroNotasTab,
  MisNotasTab,
  ModeracionTab,
  MuroTab,
  PlanificarMaterialModal,
  PublicarExtraModal,
  PublicarMaterialModal,
  SolicitarCambioFechaModal,
  TareasTab,
  UnidadModal,
  obtenerEstiloCurso,
  type RecursoActividadTarget,
} from "./components";
import { PLAZO_CONFIG } from "./consts";
import {
  useAula,
  useChatNoLeidos,
  useMisCursos,
  useRegistrarActividad,
  useRetirarMaterial,
} from "./hooks";
import type { Material, Unidad } from "./types";

function MaterialFila({
  material,
  puedeAdministrar,
  onPublicar,
  onEditar,
  onSolicitarCambio,
  onRetirar,
  onVerActividad,
  onRegistrarVisualizacion,
}: {
  material: Material;
  puedeAdministrar: boolean;
  onPublicar: (material: Material) => void;
  onEditar?: (material: Material) => void;
  onSolicitarCambio: (material: Material) => void;
  onRetirar: (material: Material) => void;
  onVerActividad?: (material: Material) => void;
  onRegistrarVisualizacion?: (material: Material, accion: "visualizo" | "descargo") => void;
}) {
  const plazo = material.plazo ? PLAZO_CONFIG[material.plazo] : null;
  const ultimoCambio =
    material.cambiosDeFecha.length > 0
      ? material.cambiosDeFecha[material.cambiosDeFecha.length - 1]
      : null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-medium">{material.titulo}</p>
          {material.esExtra && <StatusBadge tone="brand">Extra</StatusBadge>}
          {plazo && <StatusBadge tone={plazo.tone}>{plazo.label}</StatusBadge>}
          {puedeAdministrar && !material.visible && (
            <StatusBadge tone="neutral">Oculto</StatusBadge>
          )}
          {material.solicitudAbierta && (
            <StatusBadge tone="warning">Solicitud pendiente</StatusBadge>
          )}
          {!material.solicitudAbierta && ultimoCambio?.estado === "aprobada" && (
            <StatusBadge tone="success">Cambio de fecha aprobado</StatusBadge>
          )}
          {!material.solicitudAbierta && ultimoCambio?.estado === "rechazada" && (
            <StatusBadge tone="danger">Cambio de fecha rechazado</StatusBadge>
          )}
        </div>
        {material.descripcion && (
          <p className="text-muted-foreground text-xs">{material.descripcion}</p>
        )}
        <p className="text-muted-foreground text-xs">
          {material.fechaProgramada && `Programado: ${formatDate(material.fechaProgramada)}`}
          {material.publicadoEn && ` · Publicado: ${formatDate(material.publicadoEn)}`}
          {material.sesionClase?.fecha && ` · Clase: ${formatDate(material.sesionClase.fecha)}`}
        </p>
        {puedeAdministrar && ultimoCambio && (
          <p className="text-muted-foreground text-[11px]">
            Historial de fecha: {formatDate(ultimoCambio.fechaAnterior)} →{" "}
            {formatDate(ultimoCambio.fechaSolicitada)} ({ultimoCambio.estado})
            {ultimoCambio.respuesta ? ` · Respuesta: ${ultimoCambio.respuesta}` : ""}
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {material.url && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="min-h-9"
            onClick={() =>
              onRegistrarVisualizacion?.(
                material,
                material.tipo === "enlace" ? "visualizo" : "descargo",
              )
            }
          >
            <Link href={urlDeArchivo(material.url)} target="_blank" rel="noreferrer">
              {material.tipo === "enlace" ? "Abrir enlace" : "Ver"}
            </Link>
          </Button>
        )}
        {puedeAdministrar && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-9 gap-1.5"
            onClick={() => onVerActividad?.(material)}
          >
            <HugeiconsIcon icon={Activity01Icon} size={16} />
            Actividad
          </Button>
        )}
        {puedeAdministrar && onEditar && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="min-h-9 gap-1.5"
            onClick={() => onEditar(material)}
          >
            <HugeiconsIcon icon={FileEditIcon} size={16} />
            Editar
          </Button>
        )}
        {puedeAdministrar && !material.publicadoEn && (
          <Button
            type="button"
            size="sm"
            className="min-h-9 gap-1.5"
            onClick={() => onPublicar(material)}
          >
            <HugeiconsIcon icon={CloudUploadIcon} size={16} />
            Publicar
          </Button>
        )}
        {puedeAdministrar && material.publicadoEn && material.vigente && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-9 gap-1.5"
            onClick={() => onPublicar(material)}
          >
            <HugeiconsIcon icon={CloudUploadIcon} size={16} />
            Reemplazar
          </Button>
        )}
        {puedeAdministrar &&
          material.esPlanificado &&
          material.fechaCongelada &&
          !material.solicitudAbierta && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="min-h-9 gap-1.5"
              onClick={() => onSolicitarCambio(material)}
            >
              <HugeiconsIcon icon={FileEditIcon} size={16} />
              Cambiar fecha
            </Button>
          )}
        {puedeAdministrar && material.publicadoEn && material.vigente && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive min-h-9 gap-1.5"
            onClick={() => onRetirar(material)}
          >
            <HugeiconsIcon icon={Delete02Icon} size={16} />
            Retirar
          </Button>
        )}
      </div>
    </div>
  );
}

export function AulaVirtualPage({
  cursoSeccionId,
  initialTab,
  initialTareaId,
}: {
  cursoSeccionId?: string;
  initialTab?: string;
  initialTareaId?: string;
}) {
  const { data: cursos = [] } = useMisCursos();
  const { anio } = useAnioLectivo();
  const [cursoId, setCursoId] = React.useState(cursoSeccionId ?? "");
  const [periodoId, setPeriodoId] = React.useState<string>("");
  const [tabActiva, setTabActiva] = React.useState<string>(
    initialTareaId ? "tareas" : initialTab || "materiales",
  );
  const [estudianteIdSeleccionado, setEstudianteIdSeleccionado] = React.useState<string>("");

  const handleSeleccionarCurso = (id: string) => {
    setCursoId(id);
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", `/admin/aula-virtual/${id}`);
    }
  };

  const handleVolverCursos = () => {
    setCursoId("");
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", "/admin/aula-virtual");
    }
  };

  const { data: aula, isLoading, isError, error, refetch } = useAula(cursoId);

  const [unidadModal, setUnidadModal] = React.useState<{
    abierto: boolean;
    unidad?: Unidad | null;
  }>({
    abierto: false,
  });
  const [unidadParaMaterial, setUnidadParaMaterial] = React.useState<string | null>(null);
  const [materialEditar, setMaterialEditar] = React.useState<{
    unidadId: string;
    material: Material;
  } | null>(null);
  const [unidadParaExtra, setUnidadParaExtra] = React.useState<string | null>(null);
  const [materialPublicar, setMaterialPublicar] = React.useState<Material | null>(null);
  const [materialCambio, setMaterialCambio] = React.useState<Material | null>(null);
  const [materialRetirar, setMaterialRetirar] = React.useState<Material | null>(null);
  const [recursoActividad, setRecursoActividad] = React.useState<RecursoActividadTarget | null>(
    null,
  );

  const retirar = useRetirarMaterial();
  const registrarActividad = useRegistrarActividad();
  const esApoderado = aula?.rolEnAula === "apoderado";
  const esDirectivo = aula?.rolEnAula === "directivo";
  const { data: chatNoLeidos } = useChatNoLeidos(
    !esApoderado && aula?.cursoSeccionId ? aula.cursoSeccionId : "",
  );
  const anioCerrado = anio?.estado === "cerrado";

  const estudianteActivoId = React.useMemo(() => {
    if (!esApoderado || !aula?.hijosEnCurso?.length) return undefined;
    const existe = aula.hijosEnCurso.some((h) => h.estudianteId === estudianteIdSeleccionado);
    return existe ? estudianteIdSeleccionado : aula.hijosEnCurso[0]?.estudianteId;
  }, [esApoderado, aula?.hijosEnCurso, estudianteIdSeleccionado]);

  const unidadesFiltradas = React.useMemo(() => {
    if (!aula) return [];
    if (!periodoId) return aula.unidades;
    return aula.unidades.filter((u) => !u.periodoId || u.periodoId === periodoId);
  }, [aula, periodoId]);

  const opcionesPeriodo = React.useMemo(
    () => [
      { value: "", label: "Todos los periodos" },
      ...(anio?.bimestres ?? []).map((b) => ({
        value: b.id,
        label: `Bimestre ${b.nombre}`,
      })),
    ],
    [anio?.bimestres],
  );

  const cursoInfo = cursos.find((c) => c.cursoSeccionId === cursoId);
  const estiloCurso = obtenerEstiloCurso(
    cursoInfo || { cursoNombre: aula?.cursoNombre || "Materia" },
  );
  const periodoActualLabel = opcionesPeriodo.find((p) => p.value === periodoId)?.label;

  // 1. Si no hay curso seleccionado: Renderizar la cuadrícula de tarjetas tipo Google Classroom
  if (!cursoId) {
    return (
      <div className="animate-in fade-in-50 flex flex-col gap-6 duration-300">
        <PageHeader
          title="Aula virtual"
          description="Selecciona una materia o curso para ingresar a sus materiales, tareas y muro de interacción."
          icon={BookOpen01Icon}
          breadcrumbs={[{ label: "Inicio", href: "/admin/dashboard" }, { label: "Aula virtual" }]}
        />

        {cursos.length === 0 ? (
          <EmptyState
            title="No tienes aulas virtuales"
            description="No dictas ni cursas ningún curso con carga académica asignada este año."
            icon={BookOpen01Icon}
          />
        ) : (
          <CursosClassroomGrid cursos={cursos} onSelectCurso={handleSeleccionarCurso} />
        )}
      </div>
    );
  }

  // 2. Si hay curso seleccionado: Renderizar la vista interior del curso con Banner estilo Classroom
  return (
    <div className="animate-in fade-in-50 flex flex-col gap-6 duration-300">
      {/* Barra superior de navegación interna */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="hover:bg-muted gap-2 self-start rounded-xl text-xs font-semibold"
          onClick={handleVolverCursos}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
          <span>Volver a todas las materias</span>
        </Button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Selector rápido para saltar de materia sin salir */}
          <div className="w-56">
            <SelectOption
              options={cursos.map((c) => ({
                value: c.cursoSeccionId,
                label: `${c.cursoNombre} · ${c.seccionNombre}`,
              }))}
              value={cursoId}
              onSelect={handleSeleccionarCurso}
              placeholder="Cambiar de materia"
              searchPlaceholder="Buscar materia..."
            />
          </div>

          {opcionesPeriodo.length > 1 && (
            <div className="w-44">
              <SelectOption
                options={opcionesPeriodo}
                value={periodoId}
                onSelect={setPeriodoId}
                placeholder="Periodo"
              />
            </div>
          )}

          {esApoderado && aula?.hijosEnCurso && aula.hijosEnCurso.length > 0 && (
            <div className="w-56">
              <SelectOption
                options={aula.hijosEnCurso.map((h) => ({
                  value: h.estudianteId,
                  label: `Estudiante: ${h.nombreCompleto}`,
                }))}
                value={estudianteActivoId ?? ""}
                onSelect={setEstudianteIdSeleccionado}
                placeholder="Estudiante"
              />
            </div>
          )}

          {aula?.puedeAdministrar && (
            <Button
              type="button"
              size="sm"
              className="gap-1.5 rounded-xl text-xs font-semibold"
              onClick={() => setUnidadModal({ abierto: true, unidad: null })}
            >
              <HugeiconsIcon icon={PlusSignIcon} size={16} />
              <span>Nueva unidad</span>
            </Button>
          )}
        </div>
      </div>

      {/* Hero Banner estilo Google Classroom */}
      <div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-r p-6 md:p-8 ${estiloCurso.gradient} text-white shadow-md`}
      >
        <div className="pointer-events-none absolute right-4 -bottom-6 opacity-15">
          <HugeiconsIcon icon={BookOpen01Icon} size={150} />
        </div>
        <div className="relative z-10 flex flex-col justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold tracking-wide backdrop-blur-md">
              {cursoInfo?.seccionNombre || aula?.seccionNombre}
            </span>
            <span className="text-xs font-medium text-white/90">
              {cursoInfo?.gradoNombre || "Secundaria"}
            </span>
            {periodoActualLabel && periodoId !== "" && (
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
                {periodoActualLabel}
              </span>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white drop-shadow-sm md:text-3xl">
              {cursoInfo?.cursoNombre || aula?.cursoNombre}
            </h1>
            <p className="mt-1 flex items-center gap-2 text-sm text-white/80">
              <HugeiconsIcon icon={TeacherIcon} size={16} />
              <span>Docente: {cursoInfo?.docenteNombre || "Docente asignado"}</span>
            </p>
          </div>
        </div>
      </div>

      <PageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        errorTitle="No se pudo cargar el aula virtual"
      >
        {aula && (
          <Tabs value={tabActiva} onValueChange={setTabActiva} className="w-full space-y-6">
            <TabsList variant="line" className="w-full justify-start gap-4 border-b">
              <TabsTrigger value="materiales" className="gap-2">
                <HugeiconsIcon icon={BookOpen01Icon} size={16} />
                Materiales de Reforzamiento
              </TabsTrigger>
              <TabsTrigger value="tareas" className="gap-2">
                <HugeiconsIcon icon={Task01Icon} size={16} />
                Tareas y Evaluaciones
              </TabsTrigger>
              {!esApoderado && (
                <>
                  <TabsTrigger value="muro" className="gap-2">
                    <HugeiconsIcon icon={Comment01Icon} size={16} />
                    Muro
                  </TabsTrigger>
                  <TabsTrigger value="chat" className="gap-2">
                    <HugeiconsIcon icon={BubbleChatIcon} size={16} />
                    <span>Chat</span>
                    {Boolean(chatNoLeidos?.noLeidos && chatNoLeidos.noLeidos > 0) && (
                      <span className="bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-[10px] leading-none font-bold">
                        {chatNoLeidos?.noLeidos}
                      </span>
                    )}
                  </TabsTrigger>
                </>
              )}
              {aula.puedeAdministrar || esDirectivo ? (
                <>
                  <TabsTrigger value="libro-notas" className="gap-2">
                    <HugeiconsIcon icon={ChartBarLineIcon} size={16} />
                    Libro de Calificaciones
                  </TabsTrigger>
                  {(aula.puedeAdministrar || aula.puedeVerModeracion) && (
                    <TabsTrigger value="moderacion" className="gap-2">
                      <HugeiconsIcon icon={ShieldAlertIcon} size={16} />
                      Moderación
                    </TabsTrigger>
                  )}
                </>
              ) : (
                <TabsTrigger value="mis-notas" className="gap-2">
                  <HugeiconsIcon icon={Award01Icon} size={16} />
                  {esApoderado ? "Calificaciones" : "Mis Calificaciones"}
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="materiales" className="space-y-4">
              {unidadesFiltradas.length === 0 ? (
                <EmptyState
                  title="Aún no hay unidades"
                  description="Crea la primera unidad para empezar a planificar materiales."
                  icon={BookOpen01Icon}
                />
              ) : (
                unidadesFiltradas.map((unidad) => (
                  <div key={unidad.id} className="rounded-xl border p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold">{unidad.titulo}</p>
                        {unidad.descripcion && (
                          <p className="text-muted-foreground text-sm">{unidad.descripcion}</p>
                        )}
                        <p className="text-muted-foreground text-xs">
                          {unidad.fechaInicio && formatDate(unidad.fechaInicio)} –{" "}
                          {unidad.fechaFin && formatDate(unidad.fechaFin)}
                          {!unidad.publicada && " · Oculta"}
                        </p>
                      </div>
                      {aula.puedeAdministrar && (
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="min-h-9 gap-1.5"
                            onClick={() => setUnidadParaMaterial(unidad.id)}
                          >
                            <HugeiconsIcon icon={Calendar03Icon} size={16} />
                            Planificar
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="min-h-9 gap-1.5"
                            onClick={() => setUnidadParaExtra(unidad.id)}
                          >
                            <HugeiconsIcon icon={FileAddIcon} size={16} />
                            Material extra
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="min-h-9"
                            onClick={() => setUnidadModal({ abierto: true, unidad })}
                          >
                            Editar
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 space-y-2">
                      {unidad.materiales.length === 0 ? (
                        <p className="text-muted-foreground text-sm">Sin materiales todavía.</p>
                      ) : (
                        unidad.materiales.map((material) => (
                          <MaterialFila
                            key={material.id}
                            material={material}
                            puedeAdministrar={aula.puedeAdministrar}
                            onPublicar={setMaterialPublicar}
                            onEditar={(mat) =>
                              setMaterialEditar({ unidadId: unidad.id, material: mat })
                            }
                            onSolicitarCambio={setMaterialCambio}
                            onRetirar={setMaterialRetirar}
                            onVerActividad={(mat) =>
                              setRecursoActividad({
                                tipo: "material",
                                id: mat.id,
                                titulo: mat.titulo,
                              })
                            }
                            onRegistrarVisualizacion={(mat, accion) => {
                              registrarActividad.mutate({ materialId: mat.id, accion });
                            }}
                          />
                        ))
                      )}
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="tareas">
              <TareasTab
                cursoSeccionId={aula.cursoSeccionId}
                periodoId={periodoId || undefined}
                puedeAdministrar={aula.puedeAdministrar}
                unidades={aula.unidades}
                initialTareaId={initialTareaId}
                soloLectura={esApoderado || esDirectivo}
                estudianteId={esApoderado ? estudianteActivoId : undefined}
              />
            </TabsContent>

            {!esApoderado && (
              <>
                <TabsContent value="muro">
                  <MuroTab
                    cursoSeccionId={aula.cursoSeccionId}
                    puedeAdministrar={aula.puedeAdministrar}
                    anioCerrado={anioCerrado}
                    soloLectura={esDirectivo}
                  />
                </TabsContent>

                <TabsContent value="chat">
                  <ChatTab
                    cursoSeccionId={aula.cursoSeccionId}
                    puedeAdministrar={aula.puedeAdministrar}
                    anioCerrado={anioCerrado}
                    soloLectura={esDirectivo}
                  />
                </TabsContent>
              </>
            )}

            {aula.puedeAdministrar || esDirectivo ? (
              <>
                <TabsContent value="libro-notas">
                  <LibroNotasTab
                    cursoSeccionId={aula.cursoSeccionId}
                    periodoId={periodoId || undefined}
                  />
                </TabsContent>
                {(aula.puedeAdministrar || aula.puedeVerModeracion) && (
                  <TabsContent value="moderacion">
                    <ModeracionTab cursoSeccionId={aula.cursoSeccionId} />
                  </TabsContent>
                )}
              </>
            ) : (
              <TabsContent value="mis-notas">
                <MisNotasTab
                  periodoId={periodoId || undefined}
                  estudianteId={esApoderado ? estudianteActivoId : undefined}
                />
              </TabsContent>
            )}
          </Tabs>
        )}
      </PageState>

      {aula && (
        <UnidadModal
          open={unidadModal.abierto}
          onOpenChange={(abierto) => setUnidadModal({ abierto, unidad: unidadModal.unidad })}
          cursoSeccionId={aula.cursoSeccionId}
          bimestres={anio?.bimestres ?? []}
          unidad={unidadModal.unidad}
        />
      )}
      {aula && (unidadParaMaterial || materialEditar) && (
        <PlanificarMaterialModal
          open={Boolean(unidadParaMaterial || materialEditar)}
          onOpenChange={(abierto) => {
            if (!abierto) {
              setUnidadParaMaterial(null);
              setMaterialEditar(null);
            }
          }}
          unidadId={materialEditar?.unidadId ?? unidadParaMaterial ?? ""}
          bloques={aula.bloques}
          material={materialEditar?.material ?? null}
        />
      )}
      {aula && unidadParaExtra && (
        <PublicarExtraModal
          open={Boolean(unidadParaExtra)}
          onOpenChange={(abierto) => !abierto && setUnidadParaExtra(null)}
          unidadId={unidadParaExtra}
          tamanoMaximoMb={aula.tamanoMaximoMb}
        />
      )}
      {aula && (
        <PublicarMaterialModal
          open={Boolean(materialPublicar)}
          onOpenChange={(abierto) => !abierto && setMaterialPublicar(null)}
          material={materialPublicar}
          tamanoMaximoMb={aula.tamanoMaximoMb}
        />
      )}
      <SolicitarCambioFechaModal
        open={Boolean(materialCambio)}
        onOpenChange={(abierto) => !abierto && setMaterialCambio(null)}
        material={materialCambio}
      />
      <ConfirmDialog
        open={Boolean(materialRetirar)}
        onOpenChange={(abierto) => !abierto && setMaterialRetirar(null)}
        title="Retirar material"
        description={`"${materialRetirar?.titulo}" dejará de verse para los estudiantes. Sigue contando en el IGM según su primera publicación.`}
        confirmText="Retirar"
        variant="danger"
        onConfirm={() => {
          if (materialRetirar) retirar.mutate(materialRetirar.id);
          setMaterialRetirar(null);
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
