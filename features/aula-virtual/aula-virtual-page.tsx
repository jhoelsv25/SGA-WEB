"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { BookOpen01Icon } from "@hugeicons/core-free-icons";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useAnioLectivo } from "@/features/anio-escolar/anio-lectivo-context";
import {
  ActividadRecursoModal,
  AulaNavHeader,
  AulaTabsNav,
  ChatFlotante,
  CursoHeroBanner,
  CursosClassroomGrid,
  LibroNotasTab,
  MaterialesTab,
  MisNotasTab,
  ModeracionTab,
  MuroTab,
  PlanificarMaterialModal,
  PublicarExtraModal,
  PublicarMaterialModal,
  SolicitarCambioFechaModal,
  TareasTab,
  UnidadModal,
  type RecursoActividadTarget,
} from "./components";
import { obtenerEstiloCurso } from "./utils";
import { useAula, useMisCursos, useRegistrarActividad, useRetirarMaterial } from "./hooks";
import type { Material, Unidad } from "./types";

export function AulaVirtualPage({
  cursoSeccionId,
  initialTab,
  initialTareaId,
}: {
  cursoSeccionId?: string;
  initialTab?: string;
  initialTareaId?: string;
}) {
  const router = useRouter();
  const { data: cursos = [] } = useMisCursos();
  const { anio } = useAnioLectivo();
  const cursoId = cursoSeccionId ?? "";
  const [periodoId, setPeriodoId] = React.useState<string>("");
  const [tabActiva, setTabActiva] = React.useState<string>(
    initialTareaId ? "tareas" : initialTab || "materiales",
  );
  const [estudianteIdSeleccionado, setEstudianteIdSeleccionado] = React.useState<string>("");

  const handleSeleccionarCurso = (id: string) => {
    router.push(`/admin/aula-virtual/${id}`);
  };

  const handleVolverCursos = () => {
    router.push("/admin/aula-virtual");
  };

  const { data: aula, isLoading, isError, error, refetch } = useAula(cursoId);

  // Estados de modales de acción
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

  // 1. Si no hay curso seleccionado: Renderizar catálogo de materias tipo Google Classroom con filtros
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

  // 2. Si hay curso seleccionado: Renderizar la vista interior del curso modularizada
  return (
    <div className="animate-in fade-in-50 flex flex-col gap-6 duration-300">
      {/* Barra superior de navegación interna */}
      <AulaNavHeader
        cursos={cursos}
        cursoId={cursoId}
        onSelectCurso={handleSeleccionarCurso}
        onVolverCursos={handleVolverCursos}
        opcionesPeriodo={opcionesPeriodo}
        periodoId={periodoId}
        onSelectPeriodo={setPeriodoId}
        esApoderado={esApoderado}
        hijosEnCurso={aula?.hijosEnCurso}
        estudianteActivoId={estudianteActivoId}
        onSelectEstudiante={setEstudianteIdSeleccionado}
        puedeAdministrar={Boolean(aula?.puedeAdministrar)}
        onNuevaUnidad={() => setUnidadModal({ abierto: true, unidad: null })}
      />

      {/* Hero Banner estilo Google Classroom */}
      <CursoHeroBanner
        seccionNombre={cursoInfo?.seccionNombre || aula?.seccionNombre}
        gradoNombre={cursoInfo?.gradoNombre}
        periodoActualLabel={periodoId !== "" ? periodoActualLabel : undefined}
        cursoNombre={cursoInfo?.cursoNombre || aula?.cursoNombre}
        docenteNombre={cursoInfo?.docenteNombre}
        totalEstudiantes={cursoInfo?.totalEstudiantes}
        gradient={estiloCurso.gradient}
      />

      <PageState
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={() => void refetch()}
        errorTitle="No se pudo cargar el aula virtual"
      >
        {aula && (
          <Tabs value={tabActiva} onValueChange={setTabActiva} className="w-full space-y-6">
            {/* Navegación por pestañas moderna estilo Google Classroom */}
            <AulaTabsNav
              unidadesCount={unidadesFiltradas.length}
              puedeAdministrar={aula.puedeAdministrar}
              puedeVerModeracion={aula.puedeVerModeracion}
              esDirectivo={esDirectivo}
              esApoderado={esApoderado}
            />

            {/* Pestaña: Materiales de Reforzamiento */}
            <TabsContent value="materiales" className="space-y-4">
              <MaterialesTab
                unidades={unidadesFiltradas}
                puedeAdministrar={aula.puedeAdministrar}
                onPlanificarMaterial={setUnidadParaMaterial}
                onMaterialExtra={setUnidadParaExtra}
                onEditarUnidad={(unidad) => setUnidadModal({ abierto: true, unidad })}
                onPublicarMaterial={setMaterialPublicar}
                onEditarMaterial={(unidadId, mat) => setMaterialEditar({ unidadId, material: mat })}
                onSolicitarCambio={setMaterialCambio}
                onRetirarMaterial={setMaterialRetirar}
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
            </TabsContent>

            {/* Pestaña: Tareas y Evaluaciones */}
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

            {/* Pestaña: Muro de publicaciones */}
            {!esApoderado && (
              <TabsContent value="muro">
                <MuroTab
                  cursoSeccionId={aula.cursoSeccionId}
                  puedeAdministrar={aula.puedeAdministrar}
                  anioCerrado={anioCerrado}
                  soloLectura={esDirectivo}
                />
              </TabsContent>
            )}

            {/* Pestañas condicionales según rol */}
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

      {/* Modales de Gestión de Unidades y Materiales */}
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

      {/* Chat Flotante en vivo */}
      {aula && !esApoderado && (
        <ChatFlotante
          cursoSeccionId={aula.cursoSeccionId}
          cursoNombre={cursoInfo?.cursoNombre || aula.cursoNombre}
          seccionNombre={cursoInfo?.seccionNombre || aula.seccionNombre}
          puedeAdministrar={aula.puedeAdministrar}
          anioCerrado={anioCerrado}
          soloLectura={false}
        />
      )}
    </div>
  );
}
