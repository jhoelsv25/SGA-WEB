"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Award01Icon,
  BookOpen01Icon,
  Calendar03Icon,
  ChartBarLineIcon,
  CloudUploadIcon,
  Delete02Icon,
  FileAddIcon,
  FileEditIcon,
  PlusSignIcon,
  Task01Icon,
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
  LibroNotasTab,
  MisNotasTab,
  PlanificarMaterialModal,
  PublicarExtraModal,
  PublicarMaterialModal,
  SolicitarCambioFechaModal,
  TareasTab,
  UnidadModal,
} from "./components";
import { PLAZO_CONFIG } from "./consts";
import { useAula, useMisCursos, useRetirarMaterial } from "./hooks";
import type { Material, Unidad } from "./types";

function MaterialFila({
  material,
  puedeAdministrar,
  onPublicar,
  onSolicitarCambio,
  onRetirar,
}: {
  material: Material;
  puedeAdministrar: boolean;
  onPublicar: (material: Material) => void;
  onSolicitarCambio: (material: Material) => void;
  onRetirar: (material: Material) => void;
}) {
  const plazo = material.plazo ? PLAZO_CONFIG[material.plazo] : null;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
      <div className="min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium">{material.titulo}</p>
          {material.esExtra && <StatusBadge tone="brand">Extra</StatusBadge>}
          {plazo && <StatusBadge tone={plazo.tone}>{plazo.label}</StatusBadge>}
          {material.solicitudAbierta && (
            <StatusBadge tone="warning">Solicitud pendiente</StatusBadge>
          )}
        </div>
        <p className="text-muted-foreground text-xs">
          {material.fechaProgramada && `Programado: ${formatDate(material.fechaProgramada)}`}
          {material.publicadoEn && ` · Publicado: ${formatDate(material.publicadoEn)}`}
          {material.sesionClase?.fecha && ` · Clase: ${formatDate(material.sesionClase.fecha)}`}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {material.url && (
          <Button asChild variant="outline" size="sm" className="min-h-9">
            <Link href={urlDeArchivo(material.url)} target="_blank" rel="noreferrer">
              Ver
            </Link>
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

export function AulaVirtualPage({ cursoSeccionId }: { cursoSeccionId?: string }) {
  const { data: cursos = [] } = useMisCursos();
  const { anio } = useAnioLectivo();
  const [cursoId, setCursoId] = React.useState(cursoSeccionId ?? "");
  const [periodoId, setPeriodoId] = React.useState<string>("");
  const cursoActual = cursoId || cursos[0]?.cursoSeccionId || "";

  const { data: aula, isLoading, isError, error, refetch } = useAula(cursoActual);

  const [unidadModal, setUnidadModal] = React.useState<{
    abierto: boolean;
    unidad?: Unidad | null;
  }>({
    abierto: false,
  });
  const [unidadParaMaterial, setUnidadParaMaterial] = React.useState<string | null>(null);
  const [unidadParaExtra, setUnidadParaExtra] = React.useState<string | null>(null);
  const [materialPublicar, setMaterialPublicar] = React.useState<Material | null>(null);
  const [materialCambio, setMaterialCambio] = React.useState<Material | null>(null);
  const [materialRetirar, setMaterialRetirar] = React.useState<Material | null>(null);

  const retirar = useRetirarMaterial();

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

  return (
    <div className="animate-in fade-in-50 flex flex-col gap-6 duration-300">
      <PageHeader
        title="Aula virtual"
        description="Materiales, tareas, evaluaciones y libro de calificaciones."
        icon={BookOpen01Icon}
        breadcrumbs={[{ label: "Inicio", href: "/admin/dashboard" }, { label: "Aula virtual" }]}
        actions={
          aula?.puedeAdministrar && (
            <Button
              type="button"
              className="min-h-10 gap-2"
              onClick={() => setUnidadModal({ abierto: true, unidad: null })}
            >
              <HugeiconsIcon icon={PlusSignIcon} size={18} />
              Nueva unidad
            </Button>
          )
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="w-full max-w-80">
          <SelectOption
            options={cursos.map((c) => ({
              value: c.cursoSeccionId,
              label: `${c.cursoNombre} · ${c.seccionNombre}`,
            }))}
            value={cursoActual}
            onSelect={setCursoId}
            placeholder="Curso"
            searchPlaceholder="Buscar curso"
          />
        </div>
        {opcionesPeriodo.length > 1 && (
          <div className="w-full max-w-56">
            <SelectOption
              options={opcionesPeriodo}
              value={periodoId}
              onSelect={setPeriodoId}
              placeholder="Periodo"
            />
          </div>
        )}
      </div>

      {!cursoActual ? (
        <EmptyState
          title="No tienes aulas virtuales"
          description="No dictas ni cursas ningún curso con carga académica este año."
          icon={BookOpen01Icon}
        />
      ) : (
        <PageState
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={() => void refetch()}
          errorTitle="No se pudo cargar el aula virtual"
        >
          {aula && (
            <Tabs defaultValue="materiales" className="w-full space-y-6">
              <TabsList variant="line" className="w-full justify-start gap-4 border-b">
                <TabsTrigger value="materiales" className="gap-2">
                  <HugeiconsIcon icon={BookOpen01Icon} size={16} />
                  Materiales de Reforzamiento
                </TabsTrigger>
                <TabsTrigger value="tareas" className="gap-2">
                  <HugeiconsIcon icon={Task01Icon} size={16} />
                  Tareas y Evaluaciones
                </TabsTrigger>
                {aula.puedeAdministrar ? (
                  <TabsTrigger value="libro-notas" className="gap-2">
                    <HugeiconsIcon icon={ChartBarLineIcon} size={16} />
                    Libro de Calificaciones
                  </TabsTrigger>
                ) : (
                  <TabsTrigger value="mis-notas" className="gap-2">
                    <HugeiconsIcon icon={Award01Icon} size={16} />
                    Mis Calificaciones
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="materiales" className="space-y-4">
                {aula.unidades.length === 0 ? (
                  <EmptyState
                    title="Aún no hay unidades"
                    description="Crea la primera unidad para empezar a planificar materiales."
                    icon={BookOpen01Icon}
                  />
                ) : (
                  aula.unidades.map((unidad) => (
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
                              onSolicitarCambio={setMaterialCambio}
                              onRetirar={setMaterialRetirar}
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
                />
              </TabsContent>

              {aula.puedeAdministrar ? (
                <TabsContent value="libro-notas">
                  <LibroNotasTab
                    cursoSeccionId={aula.cursoSeccionId}
                    periodoId={periodoId || undefined}
                  />
                </TabsContent>
              ) : (
                <TabsContent value="mis-notas">
                  <MisNotasTab periodoId={periodoId || undefined} />
                </TabsContent>
              )}
            </Tabs>
          )}
        </PageState>
      )}

      {aula && (
        <UnidadModal
          open={unidadModal.abierto}
          onOpenChange={(abierto) => setUnidadModal({ abierto, unidad: unidadModal.unidad })}
          cursoSeccionId={aula.cursoSeccionId}
          bimestres={anio?.bimestres ?? []}
          unidad={unidadModal.unidad}
        />
      )}
      {aula && unidadParaMaterial && (
        <PlanificarMaterialModal
          open={Boolean(unidadParaMaterial)}
          onOpenChange={(abierto) => !abierto && setUnidadParaMaterial(null)}
          unidadId={unidadParaMaterial}
          bloques={aula.bloques}
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
    </div>
  );
}
