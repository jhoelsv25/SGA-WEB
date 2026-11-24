"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ListToolbar } from "@/components/common/list-toolbar";
import { useListFilters } from "@/hooks/use-list-filters";
import { useCursorPagination } from "@/hooks/use-cursor-pagination";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/common/data-table";
import {
  CheckmarkCircle02Icon,
  Download01Icon,
  Upload01Icon,
  UserRemove01Icon,
  ArrowRight01Icon,
  UserGroupIcon,
  UserAdd01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";
import { ImportarModal } from "@/features/importacion";
import { descargarMatriculasExcel } from "@/features/reportes";
import { getMatriculaColumns } from "./columns";
import {
  ModalBuscarEstudiante,
  ModalMatriculaIndividual,
  ModalMatriculaMasiva,
  ModalOperacionMatricula,
  ModalConstanciaPdf,
  type OperacionMatriculaTipo,
} from "../components";
import { useMatriculasQuery, useResumenMatriculasQuery } from "../hooks";
import { useSeccionesQuery } from "@/features/secciones";
import type { Seccion } from "@/features/secciones/types";
import { useGradosQuery } from "@/features/grados/hooks";
import type { Grado } from "@/features/grados/types";
import type { Estudiante } from "@/features/estudiantes/types/estudiantes.types";
import type { EstadoMatricula, MatriculaItem, TipoMatricula } from "../types";
import { createMatriculaFilterDefs } from "./matricula-filters.config";

interface MatriculasTableProps {
  puedeGestionar?: boolean;
}

export function MatriculasTable({ puedeGestionar = true }: MatriculasTableProps) {
  // Estado de modales
  const [modalIndividualOpen, setModalIndividualOpen] = React.useState(false);
  const [buscarOpen, setBuscarOpen] = React.useState(false);
  const [estudianteElegido, setEstudianteElegido] = React.useState<Estudiante | null>(null);
  const [modalMasivaOpen, setModalMasivaOpen] = React.useState(false);
  const [modalImportarOpen, setModalImportarOpen] = React.useState(false);
  const [operacionActiva, setOperacionActiva] = React.useState<{
    matricula: MatriculaItem | null;
    tipo: OperacionMatriculaTipo;
  }>({ matricula: null, tipo: null });
  const [constanciaSeleccionada, setConstanciaSeleccionada] = React.useState<MatriculaItem | null>(
    null,
  );

  // Consultas de catálogos
  const { data: gradosData } = useGradosQuery();
  const { data: seccionesData } = useSeccionesQuery();

  // Filtros declarativos con ListToolbar (máximo 2 inline, el resto en Popover 'Filtros')
  const filterDefs = React.useMemo(() => {
    const grados =
      (gradosData as Grado[] | undefined)?.map((g) => ({
        id: g.id,
        numero: g.numero,
      })) ?? [];
    const secciones =
      (seccionesData as Seccion[] | undefined)?.map((s) => ({
        id: s.id,
        gradoNumero: s.gradoNumero,
        nombre: s.nombre,
      })) ?? [];
    return createMatriculaFilterDefs(grados, secciones);
  }, [gradosData, seccionesData]);

  const listFilters = useListFilters(filterDefs);
  const search = listFilters.getString("search");
  const gradoId = listFilters.getString("gradoId");
  const seccionId = listFilters.getString("seccionId");
  const tipo = listFilters.getString("tipo");
  const estado = listFilters.getString("estado");

  // Paginación por cursores mediante hook global
  const limit = 20;
  const pagination = useCursorPagination({
    resetDeps: [search, gradoId, seccionId, tipo, estado],
  });

  // Consulta de matrículas conectada a cursor y filtros
  const filtrosResumen = React.useMemo(
    () => ({
      search: search && search.length >= 2 ? search : undefined,
      gradoId: gradoId && gradoId !== "all" ? gradoId : undefined,
      seccionId: seccionId && seccionId !== "all" ? seccionId : undefined,
      tipo: tipo && tipo !== "all" ? (tipo as TipoMatricula) : undefined,
    }),
    [search, gradoId, seccionId, tipo],
  );

  const {
    data: matriculasData,
    isLoading,
    refetch,
    isFetching,
  } = useMatriculasQuery({
    cursor: pagination.cursor,
    limit,
    ...filtrosResumen,
    estado: estado && estado !== "all" ? (estado as EstadoMatricula) : undefined,
  });

  const { data: resumenData, refetch: refetchResumen } = useResumenMatriculasQuery(filtrosResumen);

  const matriculas = React.useMemo(() => matriculasData?.data ?? [], [matriculasData]);

  // Métricas reales del año lectivo respetando los filtros activos
  const metricas = React.useMemo(
    () => ({
      totalMatriculados: resumenData?.totalMatriculados ?? 0,
      totalRetirados: resumenData?.totalRetirados ?? 0,
      totalTrasladados: resumenData?.totalTrasladados ?? 0,
      vacantesLibres: resumenData?.vacantesDisponibles ?? 0,
      vacantesTotales: resumenData?.vacantesTotales ?? 0,
    }),
    [resumenData],
  );

  // Columnas de TanStack Table
  const columns = React.useMemo(
    () =>
      getMatriculaColumns({
        puedeGestionar,
        onDescargarConstancia: (mat) => setConstanciaSeleccionada(mat),
        onCambiarSeccion: (mat) => setOperacionActiva({ matricula: mat, tipo: "cambiar-seccion" }),
        onRetirar: (mat) => setOperacionActiva({ matricula: mat, tipo: "retirar" }),
        onTrasladar: (mat) => setOperacionActiva({ matricula: mat, tipo: "trasladar" }),
        onAnular: (mat) => setOperacionActiva({ matricula: mat, tipo: "anular" }),
      }),
    [puedeGestionar],
  );

  return (
    <div className="space-y-6">
      {/* Tarjetas de Métricas de Matrícula */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60">
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium">Total Matriculados</p>
              <p className="text-2xl font-bold">{metricas.totalMatriculados}</p>
            </div>
            <div className="rounded-full bg-emerald-500/10 p-2.5 text-emerald-600">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium">Vacantes Disponibles</p>
              <div className="flex items-baseline gap-1.5">
                <p className="text-primary text-2xl font-bold">{metricas.vacantesLibres}</p>
                {metricas.vacantesTotales > 0 && (
                  <span className="text-muted-foreground text-xs">
                    / {metricas.vacantesTotales}
                  </span>
                )}
              </div>
            </div>
            <div className="bg-primary/10 text-primary rounded-full p-2.5">
              <HugeiconsIcon icon={UserGroupIcon} className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium">Retiros Registrados</p>
              <p className="text-destructive text-2xl font-bold">{metricas.totalRetirados}</p>
            </div>
            <div className="bg-destructive/10 text-destructive rounded-full p-2.5">
              <HugeiconsIcon icon={UserRemove01Icon} className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium">Traslados Registrados</p>
              <p className="text-2xl font-bold text-purple-600">{metricas.totalTrasladados}</p>
            </div>
            <div className="rounded-full bg-purple-500/10 p-2.5 text-purple-600">
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barra de Herramientas Estándar con ListToolbar */}
      <ListToolbar
        filterDefs={filterDefs}
        listFilters={listFilters}
        onRefresh={() => {
          void refetch();
          void refetchResumen();
        }}
        isRefreshing={isFetching}
        actions={
          puedeGestionar ? (
            <Button size="sm" className="h-10 gap-2" onClick={() => setBuscarOpen(true)}>
              <HugeiconsIcon icon={UserAdd01Icon} className="size-4" />
              Matricular estudiante
            </Button>
          ) : undefined
        }
        secondaryActions={
          <>
            {puedeGestionar ? (
              <>
                <DropdownMenuItem onSelect={() => setModalImportarOpen(true)}>
                  <HugeiconsIcon icon={Upload01Icon} className="size-4" />
                  Importar desde Excel
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setModalMasivaOpen(true)}>
                  <HugeiconsIcon icon={UserGroupIcon} className="size-4" />
                  Matrícula masiva
                </DropdownMenuItem>
              </>
            ) : null}
            <DropdownMenuItem
              onSelect={() => {
                void descargarMatriculasExcel({
                  gradoId: gradoId && gradoId !== "all" ? gradoId : undefined,
                  seccionId: seccionId && seccionId !== "all" ? seccionId : undefined,
                  tipo: tipo && tipo !== "all" ? tipo : undefined,
                  estado: estado && estado !== "all" ? estado : undefined,
                  search: search && search.length >= 2 ? search : undefined,
                })
                  .then((nombre) => toast.success(`Nómina descargada: ${nombre}`))
                  .catch((err: unknown) =>
                    toast.error(
                      err instanceof Error ? err.message : "No se pudo exportar la nómina.",
                    ),
                  );
              }}
            >
              <HugeiconsIcon icon={Download01Icon} className="size-4" />
              Exportar Excel
            </DropdownMenuItem>
          </>
        }
      />

      {/* Tabla con Paginación por Cursores */}
      <DataTable
        columns={columns}
        data={matriculas}
        isLoading={isLoading}
        cursorPagination={{
          ...pagination.getPaginationProps(matriculasData),
          isLoading: isFetching,
          loadedCount: matriculas.length,
        }}
        emptyMessage="No se encontraron matrículas con los criterios seleccionados."
      />

      {/* Modales de Gestión */}
      <ModalBuscarEstudiante
        open={buscarOpen}
        onOpenChange={setBuscarOpen}
        onSeleccionar={(est) => {
          setEstudianteElegido(est);
          setModalIndividualOpen(true);
        }}
      />

      <ModalMatriculaIndividual
        key={estudianteElegido?.id ?? "sin-estudiante"}
        open={modalIndividualOpen}
        onOpenChange={setModalIndividualOpen}
        estudianteInicial={estudianteElegido}
      />

      <ModalMatriculaMasiva open={modalMasivaOpen} onOpenChange={setModalMasivaOpen} />

      <ImportarModal
        open={modalImportarOpen}
        onOpenChange={setModalImportarOpen}
        tipo="matriculas"
        onSuccess={() => {
          void refetch();
          void refetchResumen();
        }}
      />

      <ModalOperacionMatricula
        matricula={operacionActiva.matricula}
        tipo={operacionActiva.tipo}
        open={Boolean(operacionActiva.tipo)}
        onOpenChange={(op) => !op && setOperacionActiva({ matricula: null, tipo: null })}
      />

      {/* Modal Visor Oficial de Constancia con Colores del Colegio */}
      <ModalConstanciaPdf
        open={Boolean(constanciaSeleccionada)}
        onOpenChange={(op) => !op && setConstanciaSeleccionada(null)}
        matriculaId={constanciaSeleccionada?.id || ""}
        matriculaCodigo={constanciaSeleccionada?.codigo || ""}
        estudianteNombre={
          constanciaSeleccionada?.estudiante
            ? `${constanciaSeleccionada.estudiante.apellidos}, ${constanciaSeleccionada.estudiante.nombres}`
            : undefined
        }
      />
    </div>
  );
}
