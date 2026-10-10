"use client";

import * as React from "react";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ListToolbar } from "@/components/common/list-toolbar";
import { useListFilters } from "@/hooks/use-list-filters";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckmarkCircle02Icon,
  UserRemove01Icon,
  ArrowRight01Icon,
  Add01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { getMatriculaColumns } from "./columns";
import {
  ModalMatriculaIndividual,
  ModalMatriculaMasiva,
  ModalOperacionMatricula,
  type OperacionMatriculaTipo,
} from "../components";

import { useDescargarConstancia, useMatriculasQuery } from "../hooks";
import { useSeccionesQuery } from "@/features/secciones";
import type { Seccion } from "@/features/secciones/types";
import { useGradosQuery } from "@/features/grados/hooks";
import type { Grado } from "@/features/grados/types";
import type { EstadoMatricula, MatriculaItem, TipoMatricula } from "../types";
import { createMatriculaFilterDefs } from "./matricula-filters.config";

interface MatriculasTableProps {
  puedeGestionar?: boolean;
}

export function MatriculasTable({ puedeGestionar = true }: MatriculasTableProps) {
  // Estado de modales
  const [modalIndividualOpen, setModalIndividualOpen] = React.useState(false);
  const [modalMasivaOpen, setModalMasivaOpen] = React.useState(false);
  const [operacionActiva, setOperacionActiva] = React.useState<{
    matricula: MatriculaItem | null;
    tipo: OperacionMatriculaTipo;
  }>({ matricula: null, tipo: null });

  // Consultas de catálogos
  const { data: gradosData } = useGradosQuery();
  const { data: seccionesData } = useSeccionesQuery();
  const descargarConstanciaMutation = useDescargarConstancia();

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

  // Consulta de matrículas conectada a los filtros
  const {
    data: matriculasData,
    isLoading,
    refetch,
    isFetching,
  } = useMatriculasQuery({
    search: search && search.length >= 2 ? search : undefined,
    gradoId: gradoId && gradoId !== "all" ? gradoId : undefined,
    seccionId: seccionId && seccionId !== "all" ? seccionId : undefined,
    tipo: tipo && tipo !== "all" ? (tipo as TipoMatricula) : undefined,
    estado: estado && estado !== "all" ? (estado as EstadoMatricula) : undefined,
    limit: 50,
  });

  const matriculas = React.useMemo(() => matriculasData?.items ?? [], [matriculasData]);

  // Métricas de cabecera
  const metricas = React.useMemo(() => {
    const totalMatriculados = matriculas.filter((m) => m.estado === "matriculado").length;
    const totalRetirados = matriculas.filter((m) => m.estado === "retirado").length;
    const totalTrasladados = matriculas.filter((m) => m.estado === "trasladado").length;

    let vacantesTotales = 0;
    let vacantesOcupadas = 0;
    (seccionesData as Seccion[] | undefined)?.forEach((sec: Seccion) => {
      vacantesTotales += sec.vacantes;
      vacantesOcupadas += sec.matriculados;
    });

    return {
      totalMatriculados,
      totalRetirados,
      totalTrasladados,
      vacantesLibres: Math.max(0, vacantesTotales - vacantesOcupadas),
      vacantesTotales,
    };
  }, [matriculas, seccionesData]);

  // Columnas de TanStack Table
  const columns = React.useMemo(
    () =>
      getMatriculaColumns({
        puedeGestionar,
        onDescargarConstancia: (mat) =>
          descargarConstanciaMutation.mutate({ id: mat.id, codigo: mat.codigo }),
        onCambiarSeccion: (mat) => setOperacionActiva({ matricula: mat, tipo: "cambiar-seccion" }),
        onRetirar: (mat) => setOperacionActiva({ matricula: mat, tipo: "retirar" }),
        onTrasladar: (mat) => setOperacionActiva({ matricula: mat, tipo: "trasladar" }),
        onAnular: (mat) => setOperacionActiva({ matricula: mat, tipo: "anular" }),
      }),
    [puedeGestionar, descargarConstanciaMutation],
  );

  const table = useReactTable({
    data: matriculas,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-6">
      {/* Tarjetas de Métricas de Matrícula */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60">
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium">Estudiantes Matriculados</p>
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
              <p className="text-primary text-2xl font-bold">{metricas.vacantesLibres}</p>
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
              <p className="text-muted-foreground text-xs font-medium">Traslados a Otro Colegio</p>
              <p className="text-2xl font-bold text-purple-600">{metricas.totalTrasladados}</p>
            </div>
            <div className="rounded-full bg-purple-500/10 p-2.5 text-purple-600">
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barra de Herramientas Estándar con ListToolbar (Colapsa a Popover si son más de 2 filtros) */}
      <ListToolbar
        filterDefs={filterDefs}
        listFilters={listFilters}
        onRefresh={() => void refetch()}
        isRefreshing={isFetching}
        actions={
          puedeGestionar ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-10 gap-2 rounded-full px-4 text-xs"
                onClick={() => setModalMasivaOpen(true)}
              >
                <HugeiconsIcon icon={UserGroupIcon} className="size-4" />
                Matrícula Masiva
              </Button>
              <Button
                size="sm"
                className="h-10 gap-2 rounded-full px-4 text-xs shadow-sm"
                onClick={() => setModalIndividualOpen(true)}
              >
                <HugeiconsIcon icon={Add01Icon} className="size-4" />
                Matricular Estudiante
              </Button>
            </div>
          ) : undefined
        }
      />

      {/* Tabla de Resultados */}
      <div className="border-border/60 bg-card overflow-hidden rounded-2xl border shadow-2xs">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/30">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-xs font-semibold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-2.5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center">
                  <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 py-6">
                    <HugeiconsIcon
                      icon={UserGroupIcon}
                      className="text-muted-foreground/60 size-8 stroke-1"
                    />
                    <p className="text-foreground text-sm font-medium">
                      No se encontraron matrículas
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {search ||
                      (gradoId && gradoId !== "all") ||
                      (seccionId && seccionId !== "all") ||
                      (tipo && tipo !== "all") ||
                      (estado && estado !== "all")
                        ? "Intente ajustar los filtros de búsqueda seleccionados."
                        : "Aún no se han registrado estudiantes en este año académico. Utilice los botones de matrícula para comenzar."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modales de Gestión */}
      <ModalMatriculaIndividual open={modalIndividualOpen} onOpenChange={setModalIndividualOpen} />

      <ModalMatriculaMasiva open={modalMasivaOpen} onOpenChange={setModalMasivaOpen} />

      <ModalOperacionMatricula
        matricula={operacionActiva.matricula}
        tipo={operacionActiva.tipo}
        open={Boolean(operacionActiva.tipo)}
        onOpenChange={(op) => !op && setOperacionActiva({ matricula: null, tipo: null })}
      />
    </div>
  );
}
