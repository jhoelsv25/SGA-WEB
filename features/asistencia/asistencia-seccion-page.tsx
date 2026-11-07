"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserGroupIcon,
  Search01Icon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  Calendar03Icon,
  Clock01Icon,
  RefreshIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { EmptyState } from "@/components/common/empty-state";
import { Modal } from "@/components/common/modal";
import { PageHeader } from "@/components/common/page-header";
import { PageState } from "@/components/common/page-state";
import { SelectOption } from "@/components/common/select";
import { UserAvatar } from "@/components/common/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  DetalleAsistenciaEstudiante,
  JustificarFaltaModal,
  SelectorBimestre,
  useRangoBimestre,
  type FaltaAJustificar,
} from "./components";
import { useAsistenciaSeccion, useMisSecciones } from "./hooks";
import type { ResumenEstudianteSeccion } from "./types";

type FiltroEstado = "todos" | "faltas" | "tardanzas" | "perfecta";

export function AsistenciaSeccionPage() {
  const { data: secciones = [] } = useMisSecciones();
  const { bimestres, bimestreId, setElegido, rango } = useRangoBimestre();
  const [seccionId, setSeccionId] = React.useState("");
  const [estudiante, setEstudiante] = React.useState<ResumenEstudianteSeccion | null>(null);
  const [falta, setFalta] = React.useState<FaltaAJustificar | null>(null);

  // Filtros de búsqueda en la lista de estudiantes
  const [busqueda, setBusqueda] = React.useState("");
  const [filtroEstado, setFiltroEstado] = React.useState<FiltroEstado>("todos");

  const seccionActual = seccionId || secciones[0]?.id || "";
  const { data, isLoading, isError, error, refetch, isFetching } = useAsistenciaSeccion(
    seccionActual,
    rango,
  );

  // Normalizador para búsqueda insensible a acentos y mayúsculas
  const normalizar = (texto: string) =>
    texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  // Cálculos estadísticos de la sección
  const estudiantes = React.useMemo(() => data?.estudiantes ?? [], [data?.estudiantes]);
  const totalEstudiantes = estudiantes.length;
  const totalFaltasColegio = estudiantes.reduce((acc, e) => acc + e.faltasColegio, 0);
  const totalTardanzasColegio = estudiantes.reduce((acc, e) => acc + e.tardanzasColegio, 0);

  const conFaltasCount = estudiantes.filter(
    (e) => e.faltasColegio > 0 || e.clases.faltas + e.clases.faltasJustificadas > 0,
  ).length;
  const conTardanzasCount = estudiantes.filter(
    (e) => e.tardanzasColegio > 0 || e.clases.tardanzas > 0,
  ).length;
  const perfectaCount = estudiantes.filter(
    (e) =>
      e.faltasColegio === 0 &&
      e.tardanzasColegio === 0 &&
      e.clases.faltas === 0 &&
      e.clases.faltasJustificadas === 0 &&
      e.clases.tardanzas === 0,
  ).length;

  // Filtrado reactivo de estudiantes
  const estudiantesFiltrados = React.useMemo(() => {
    return estudiantes.filter((e) => {
      // 1. Filtro por texto de búsqueda
      if (busqueda.trim()) {
        const term = normalizar(busqueda.trim());
        if (!normalizar(e.nombreCompleto).includes(term)) {
          return false;
        }
      }

      // 2. Filtro rápido por estado
      if (filtroEstado === "faltas") {
        return e.faltasColegio > 0 || e.clases.faltas + e.clases.faltasJustificadas > 0;
      }
      if (filtroEstado === "tardanzas") {
        return e.tardanzasColegio > 0 || e.clases.tardanzas > 0;
      }
      if (filtroEstado === "perfecta") {
        return (
          e.faltasColegio === 0 &&
          e.tardanzasColegio === 0 &&
          e.clases.faltas === 0 &&
          e.clases.faltasJustificadas === 0 &&
          e.clases.tardanzas === 0
        );
      }

      return true;
    });
  }, [estudiantes, busqueda, filtroEstado]);

  return (
    <div className="animate-in fade-in-50 flex flex-col gap-6 duration-300">
      <PageHeader
        title="Asistencia de mi sección"
        description="Faltas y tardanzas al colegio y por curso de cada estudiante en el periodo elegido."
        icon={UserGroupIcon}
        breadcrumbs={[
          { label: "Inicio", href: "/admin/dashboard" },
          { label: "Asistencia de mi sección" },
        ]}
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="h-9 gap-1.5 rounded-xl px-3 text-xs font-semibold shadow-2xs"
          >
            <HugeiconsIcon
              icon={RefreshIcon}
              className={cn("size-3.5", isFetching && "animate-spin")}
            />
            <span className="hidden sm:inline">Actualizar</span>
          </Button>
        }
      />

      {/* Selectores de Sección y Bimestre */}
      <div className="border-border/80 bg-card flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-full sm:w-64">
            <label className="text-muted-foreground mb-1 block text-xs font-medium">
              Sección escolar
            </label>
            <SelectOption
              options={secciones.map((s) => ({ value: s.id, label: s.nombre }))}
              value={seccionActual}
              onSelect={setSeccionId}
              placeholder="Seleccionar sección"
              searchPlaceholder="Buscar sección"
            />
          </div>
          <div>
            <label className="text-muted-foreground mb-1 block text-xs font-medium">
              Periodo / Bimestre
            </label>
            <SelectorBimestre bimestres={bimestres} valor={bimestreId} onCambiar={setElegido} />
          </div>
        </div>

        {data && (
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <HugeiconsIcon icon={Calendar03Icon} className="text-primary size-4" />
            <span className="text-foreground font-semibold">{data.seccionNombre}:</span>
            <span>{data.diasConClases} días con clases en el periodo</span>
          </div>
        )}
      </div>

      {!seccionActual ? (
        <EmptyState
          title="No hay secciones para consultar"
          description="Solo el tutor de una sección, o la dirección y secretaría, pueden ver su asistencia."
          icon={UserGroupIcon}
        />
      ) : (
        <PageState
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={() => void refetch()}
          errorTitle="No se pudo cargar la asistencia"
        >
          {data && (
            <div className="space-y-6">
              {/* Tarjetas KPI de Resumen de la Sección */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="border-border/70 bg-card rounded-2xl border p-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                      Alumnos
                    </p>
                    <HugeiconsIcon icon={UserGroupIcon} className="text-primary size-4" />
                  </div>
                  <p className="mt-1 text-2xl font-black tabular-nums">{totalEstudiantes}</p>
                  <p className="text-muted-foreground text-[11px]">En la sección activa</p>
                </div>

                <div className="border-border/70 bg-card rounded-2xl border p-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                      Faltas colegio
                    </p>
                    <HugeiconsIcon
                      icon={AlertCircleIcon}
                      className={cn(
                        "size-4",
                        totalFaltasColegio > 0 ? "text-rose-500" : "text-emerald-500",
                      )}
                    />
                  </div>
                  <p
                    className={cn(
                      "mt-1 text-2xl font-black tabular-nums",
                      totalFaltasColegio > 0
                        ? "text-rose-600 dark:text-rose-400"
                        : "text-foreground",
                    )}
                  >
                    {totalFaltasColegio}
                  </p>
                  <p className="text-muted-foreground text-[11px]">Inasistencias al colegio</p>
                </div>

                <div className="border-border/70 bg-card rounded-2xl border p-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                      Tardanzas
                    </p>
                    <HugeiconsIcon
                      icon={Clock01Icon}
                      className={cn(
                        "size-4",
                        totalTardanzasColegio > 0 ? "text-amber-500" : "text-muted-foreground",
                      )}
                    />
                  </div>
                  <p
                    className={cn(
                      "mt-1 text-2xl font-black tabular-nums",
                      totalTardanzasColegio > 0
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-foreground",
                    )}
                  >
                    {totalTardanzasColegio}
                  </p>
                  <p className="text-muted-foreground text-[11px]">Minutos u horas tarde</p>
                </div>

                <div className="border-border/70 bg-card rounded-2xl border p-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                      Asistencia 100%
                    </p>
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      className="size-4 text-emerald-500"
                    />
                  </div>
                  <p className="mt-1 text-2xl font-black text-emerald-600 tabular-nums dark:text-emerald-400">
                    {perfectaCount}
                  </p>
                  <p className="text-muted-foreground text-[11px]">Alumnos sin faltas</p>
                </div>
              </div>

              {/* Barra de Filtros y Búsqueda */}
              <div className="border-border/80 bg-card flex flex-col gap-3 rounded-2xl border p-3.5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 sm:max-w-xs">
                  <HugeiconsIcon
                    icon={Search01Icon}
                    className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2"
                  />
                  <Input
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar estudiante por nombre..."
                    className="h-8.5 rounded-xl pl-8.5 text-xs shadow-2xs"
                    aria-label="Buscar estudiante"
                  />
                </div>

                {/* Filtros rápidos tipo píldora */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setFiltroEstado("todos")}
                    className={cn(
                      "rounded-lg px-2.5 py-1 text-xs font-semibold transition-all select-none",
                      filtroEstado === "todos"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    Todos ({totalEstudiantes})
                  </button>

                  <button
                    type="button"
                    onClick={() => setFiltroEstado("faltas")}
                    className={cn(
                      "rounded-lg px-2.5 py-1 text-xs font-semibold transition-all select-none",
                      filtroEstado === "faltas"
                        ? "bg-rose-600 text-white shadow-xs"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    Con faltas ({conFaltasCount})
                  </button>

                  <button
                    type="button"
                    onClick={() => setFiltroEstado("tardanzas")}
                    className={cn(
                      "rounded-lg px-2.5 py-1 text-xs font-semibold transition-all select-none",
                      filtroEstado === "tardanzas"
                        ? "bg-amber-600 text-white shadow-xs"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    Con tardanzas ({conTardanzasCount})
                  </button>

                  <button
                    type="button"
                    onClick={() => setFiltroEstado("perfecta")}
                    className={cn(
                      "rounded-lg px-2.5 py-1 text-xs font-semibold transition-all select-none",
                      filtroEstado === "perfecta"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    Asistencia perfecta ({perfectaCount})
                  </button>

                  {busqueda && (
                    <button
                      type="button"
                      onClick={() => setBusqueda("")}
                      className="text-primary ml-2 text-xs font-medium hover:underline"
                    >
                      Limpiar búsqueda
                    </button>
                  )}
                </div>
              </div>

              {/* Tabla de Estudiantes */}
              <div className="border-border/80 bg-card overflow-hidden rounded-2xl border shadow-xs">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow className="border-border/60">
                      <TableHead className="w-80 font-bold">Estudiante</TableHead>
                      <TableHead className="text-center font-bold">Faltas al colegio</TableHead>
                      <TableHead className="text-center font-bold">Tardanzas al colegio</TableHead>
                      <TableHead className="text-center font-bold">Faltas en clase</TableHead>
                      <TableHead className="text-center font-bold">Tardanzas en clase</TableHead>
                      <TableHead className="w-28 text-right font-bold">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-border/50 divide-y">
                    {estudiantesFiltrados.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-muted-foreground py-8 text-center text-xs"
                        >
                          {busqueda
                            ? `No se encontraron estudiantes que coincidan con «${busqueda}».`
                            : "No hay estudiantes que coincidan con el filtro seleccionado."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      estudiantesFiltrados.map((e) => {
                        const totalFaltasCursos = e.clases.faltas + e.clases.faltasJustificadas;
                        return (
                          <TableRow
                            key={e.estudianteId}
                            className="hover:bg-muted/30 transition-colors"
                          >
                            <TableCell>
                              <div className="flex items-center gap-2.5">
                                <UserAvatar
                                  name={e.nombreCompleto}
                                  className="size-7.5 text-xs font-bold"
                                />
                                <span className="text-foreground text-xs font-semibold">
                                  {e.nombreCompleto}
                                </span>
                              </div>
                            </TableCell>

                            <TableCell className="text-center">
                              {e.faltasColegio > 0 ? (
                                <Badge
                                  variant="outline"
                                  className="border-rose-500/30 bg-rose-500/10 font-mono text-xs font-bold text-rose-700 dark:text-rose-300"
                                >
                                  {e.faltasColegio}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground/60 font-mono text-xs">
                                  0
                                </span>
                              )}
                            </TableCell>

                            <TableCell className="text-center">
                              {e.tardanzasColegio > 0 ? (
                                <Badge
                                  variant="outline"
                                  className="border-amber-500/30 bg-amber-500/10 font-mono text-xs font-bold text-amber-700 dark:text-amber-300"
                                >
                                  {e.tardanzasColegio}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground/60 font-mono text-xs">
                                  0
                                </span>
                              )}
                            </TableCell>

                            <TableCell className="text-center">
                              {totalFaltasCursos > 0 ? (
                                <Badge
                                  variant="outline"
                                  className="border-rose-500/30 bg-rose-500/10 font-mono text-xs font-bold text-rose-700 dark:text-rose-300"
                                >
                                  {totalFaltasCursos}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground/60 font-mono text-xs">
                                  0
                                </span>
                              )}
                            </TableCell>

                            <TableCell className="text-center">
                              {e.clases.tardanzas > 0 ? (
                                <Badge
                                  variant="outline"
                                  className="border-amber-500/30 bg-amber-500/10 font-mono text-xs font-bold text-amber-700 dark:text-amber-300"
                                >
                                  {e.clases.tardanzas}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground/60 font-mono text-xs">
                                  0
                                </span>
                              )}
                            </TableCell>

                            <TableCell className="text-right">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="hover:border-primary hover:text-primary h-7 gap-1 rounded-lg px-2.5 text-xs font-semibold shadow-2xs"
                                onClick={() => setEstudiante(e)}
                              >
                                <span>Ver detalle</span>
                                <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </PageState>
      )}

      {/* Modal de Detalle de Asistencia por Estudiante */}
      <Modal
        open={Boolean(estudiante)}
        onOpenChange={(abierto) => !abierto && setEstudiante(null)}
        title={estudiante?.nombreCompleto}
        description="Asistencia al colegio y por curso en el periodo elegido."
        icon={UserGroupIcon}
        size="3xl"
      >
        {estudiante && rango && (
          <DetalleAsistenciaEstudiante
            estudianteId={estudiante.estudianteId}
            rango={rango}
            onJustificar={(incidencia, cursoNombre) =>
              setFalta({ id: incidencia.id, cursoNombre, fecha: incidencia.fecha })
            }
          />
        )}
      </Modal>

      <JustificarFaltaModal falta={falta} onOpenChange={(abierto) => !abierto && setFalta(null)} />
    </div>
  );
}
