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
import { Input } from "@/components/ui/input";
import { SelectOption, type SelectOptionItem } from "@/components/common/select";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

import {
  Search01Icon,
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

interface MatriculasTableProps {
  puedeGestionar?: boolean;
}

export function MatriculasTable({ puedeGestionar = true }: MatriculasTableProps) {
  // Filtros de estado local
  const [search, setSearch] = React.useState("");
  const [gradoId, setGradoId] = React.useState<string>("all");
  const [seccionId, setSeccionId] = React.useState<string>("all");
  const [tipo, setTipo] = React.useState<string>("all");
  const [estado, setEstado] = React.useState<string>("all");

  // Estado de modales
  const [modalIndividualOpen, setModalIndividualOpen] = React.useState(false);
  const [modalMasivaOpen, setModalMasivaOpen] = React.useState(false);
  const [operacionActiva, setOperacionActiva] = React.useState<{
    matricula: MatriculaItem | null;
    tipo: OperacionMatriculaTipo;
  }>({ matricula: null, tipo: null });

  // Consultas
  const { data: gradosData } = useGradosQuery();
  const { data: seccionesData } = useSeccionesQuery();
  const descargarConstanciaMutation = useDescargarConstancia();

  const { data: matriculasData, isLoading } = useMatriculasQuery({
    search: search.length >= 2 ? search : undefined,
    gradoId: gradoId !== "all" ? gradoId : undefined,
    seccionId: seccionId !== "all" ? seccionId : undefined,
    tipo: tipo !== "all" ? (tipo as TipoMatricula) : undefined,
    estado: estado !== "all" ? (estado as EstadoMatricula) : undefined,
    limit: 50,
  });

  const matriculas = React.useMemo(() => matriculasData?.items ?? [], [matriculasData]);

  // Métricas rápidas de cabecera
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

  // Secciones filtradas por grado
  const seccionesFiltradas = React.useMemo(() => {
    if (!seccionesData) return [];
    const list = seccionesData as Seccion[];
    if (gradoId === "all") return list;
    return list.filter((s: Seccion) => s.gradoId === gradoId);
  }, [seccionesData, gradoId]);

  // Opciones formateadas para SelectOption (labels cortos, limpios y descriptivos)
  const gradoOptions: SelectOptionItem<string>[] = React.useMemo(() => {
    const list: SelectOptionItem<string>[] = [{ value: "all", label: "Todos los grados" }];
    (gradosData as Grado[] | undefined)?.forEach((g: Grado) => {
      list.push({ value: g.id, label: `${g.numero}.° Secundaria` });
    });
    return list;
  }, [gradosData]);

  const seccionOptions: SelectOptionItem<string>[] = React.useMemo(() => {
    const list: SelectOptionItem<string>[] = [{ value: "all", label: "Todas las secciones" }];
    seccionesFiltradas.forEach((s: Seccion) => {
      list.push({
        value: s.id,
        label: `${s.gradoNumero}.° ${s.nombre}`,
        description: `${s.vacantes - s.matriculados} vacantes libres`,
      });
    });
    return list;
  }, [seccionesFiltradas]);

  const tipoOptions: SelectOptionItem<string>[] = React.useMemo(
    () => [
      { value: "all", label: "Todos los tipos" },
      { value: "nuevo", label: "Nuevo ingreso" },
      { value: "continuador", label: "Continuador" },
      { value: "traslado", label: "Traslado" },
    ],
    [],
  );

  const estadoOptions: SelectOptionItem<string>[] = React.useMemo(
    () => [
      { value: "all", label: "Todos los estados" },
      { value: "matriculado", label: "Matriculado" },
      { value: "retirado", label: "Retirado" },
      { value: "traslado", label: "Trasladado" },
      { value: "culminado", label: "Culminado" },
    ],
    [],
  );

  const hayFiltrosActivos =
    Boolean(search) ||
    gradoId !== "all" ||
    seccionId !== "all" ||
    tipo !== "all" ||
    estado !== "all";

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

      {/* Barra de Acciones y Filtros Unificada */}
      <div className="border-border/60 bg-card/60 flex flex-col gap-3 rounded-2xl border p-3.5 shadow-2xs backdrop-blur-xs lg:flex-row lg:items-center lg:justify-between lg:p-4">
        {/* Controles de filtrado con SelectOption */}
        <div className="grid min-w-0 flex-1 grid-cols-1 items-center gap-2.5 sm:grid-cols-2 lg:flex lg:flex-wrap">
          {/* Búsqueda por texto */}
          <div className="relative w-full min-w-[180px] sm:w-64">
            <HugeiconsIcon
              icon={Search01Icon}
              className="text-muted-foreground absolute top-2.5 left-3 size-4"
            />
            <Input
              placeholder="Buscar por DNI o apellidos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-border/80 h-10 rounded-full pl-9 text-xs"
            />
          </div>

          {/* Filtro Grado */}
          <div className="w-full min-w-[140px] sm:w-44">
            <SelectOption
              options={gradoOptions}
              value={gradoId}
              onSelect={(val) => {
                setGradoId(val);
                setSeccionId("all");
              }}
              placeholder="Grado..."
              searchPlaceholder="Buscar grado..."
              className="h-10 truncate text-xs"
            />
          </div>

          {/* Filtro Sección */}
          <div className="w-full min-w-[150px] sm:w-48">
            <SelectOption
              options={seccionOptions}
              value={seccionId}
              onSelect={(val) => setSeccionId(val)}
              placeholder="Sección..."
              searchPlaceholder="Buscar sección..."
              className="h-10 truncate text-xs"
            />
          </div>

          {/* Filtro Tipo */}
          <div className="w-full min-w-[130px] sm:w-40">
            <SelectOption
              options={tipoOptions}
              value={tipo}
              onSelect={(val) => setTipo(val)}
              placeholder="Tipo..."
              searchPlaceholder="Buscar tipo..."
              className="h-10 truncate text-xs"
            />
          </div>

          {/* Filtro Estado */}
          <div className="w-full min-w-[130px] sm:w-40">
            <SelectOption
              options={estadoOptions}
              value={estado}
              onSelect={(val) => setEstado(val)}
              placeholder="Estado..."
              searchPlaceholder="Buscar estado..."
              className="h-10 truncate text-xs"
            />
          </div>

          {/* Botón para Limpiar Filtros */}
          {hayFiltrosActivos && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch("");
                setGradoId("all");
                setSeccionId("all");
                setTipo("all");
                setEstado("all");
              }}
              className="text-muted-foreground hover:text-foreground h-10 px-3 text-xs"
            >
              Limpiar filtros
            </Button>
          )}
        </div>

        {/* Botones de Matrícula */}
        {puedeGestionar && (
          <div className="border-border/40 flex shrink-0 items-center gap-2 border-t pt-2 lg:border-t-0 lg:pt-0">
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
        )}
      </div>

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
                      gradoId !== "all" ||
                      seccionId !== "all" ||
                      tipo !== "all" ||
                      estado !== "all"
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
