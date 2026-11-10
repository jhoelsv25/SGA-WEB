"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  Cancel01Icon,
  FilterIcon,
  User02Icon,
  Book02Icon,
  HierarchySquare02Icon,
} from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DatePicker } from "@/components/common/date-picker";
import { SelectOption, type SelectOptionItem } from "@/components/common/select";
import type { Bimestre } from "@/features/anio-escolar/types";
import { useCursosQuery } from "@/features/cursos/hooks";
import { useDocentesQuery } from "@/features/docentes/hooks/use-docentes";
import type { FiltroIndicadoresQueryDto } from "@/features/indicadores";
import { useSeccionesQuery } from "@/features/secciones/hooks";

interface TableroFiltrosProps {
  filtros: FiltroIndicadoresQueryDto;
  onChange: (nuevosFiltros: FiltroIndicadoresQueryDto) => void;
  onLimpiar: () => void;
  bimestres?: Bimestre[];
  cargando?: boolean;
  /** «apoyo» quita las referencias a CSP, ISA e IGM de las etiquetas (RF-020 V2). */
  modo?: "tesis" | "apoyo";
  /** El docente solo ve lo suyo: no se ofrece el filtro por docente. */
  ocultarDocente?: boolean;
}

/**
 * Barra y panel de filtros interactivos para el Tablero de Indicadores (RF-020).
 * Soporta filtrado por bimestre, rango de fechas, docente, curso y sección.
 */
export function TableroFiltros({
  filtros,
  onChange,
  onLimpiar,
  bimestres = [],
  cargando = false,
  modo = "tesis",
  ocultarDocente = false,
}: TableroFiltrosProps) {
  const esTesis = modo === "tesis";
  const [mostrarAvanzados, setMostrarAvanzados] = React.useState(false);

  // Consultas de catálogos para los selectores
  const { data: docentesResponse } = useDocentesQuery({ limit: 100, estado: "activo" });
  const { data: cursosResponse } = useCursosQuery();
  const { data: seccionesResponse } = useSeccionesQuery();

  // Opciones de bimestres con nombres claros y formato legible
  const opcionesBimestres = React.useMemo<SelectOptionItem<string>[]>(() => {
    return [
      {
        value: "all",
        label: "Año completo (Todos los bimestres)",
        description: "Métricas consolidadas del ciclo lectivo",
      },
      ...bimestres.map((b) => {
        const nombreLimpio = b.nombre.toLowerCase().includes("bimestre")
          ? b.nombre
          : `Bimestre ${b.nombre}`;

        const estadoDesc =
          b.estado === "en_curso"
            ? "En curso actualmente"
            : b.estado === "cerrado"
              ? "Cerrado"
              : "Planificado";

        const rangoFechas =
          b.fechaInicio && b.fechaFin
            ? ` · (${b.fechaInicio.slice(5).replace("-", "/")} al ${b.fechaFin.slice(5).replace("-", "/")})`
            : "";

        return {
          value: b.id,
          label: nombreLimpio,
          description: `${estadoDesc}${rangoFechas}`,
        };
      }),
    ];
  }, [bimestres]);

  // Opciones de docentes
  const opcionesDocentes = React.useMemo<SelectOptionItem<string>[]>(() => {
    const lista = docentesResponse?.data ?? [];
    return [
      { value: "all", label: "Todos los docentes" },
      ...lista.map((d) => ({
        value: d.id,
        label: d.persona.nombreCompleto,
        description: d.codigo ? `Cód: ${d.codigo}` : undefined,
      })),
    ];
  }, [docentesResponse?.data]);

  // Opciones de cursos
  const opcionesCursos = React.useMemo<SelectOptionItem<string>[]>(() => {
    const lista = Array.isArray(cursosResponse) ? cursosResponse : [];
    return [
      { value: "all", label: "Todos los cursos" },
      ...lista.map((c) => ({
        value: c.id,
        label: c.nombre,
        description: c.areaCurricularNombre ? `${c.codigo} • ${c.areaCurricularNombre}` : c.codigo,
      })),
    ];
  }, [cursosResponse]);

  // Opciones de secciones
  const opcionesSecciones = React.useMemo<SelectOptionItem<string>[]>(() => {
    const lista = Array.isArray(seccionesResponse) ? seccionesResponse : [];
    return [
      { value: "all", label: "Todas las secciones" },
      ...lista.map((s) => ({
        value: s.id,
        label: `${s.gradoNombre} "${s.nombre}"`,
        description: s.aula ? `Aula: ${s.aula}` : undefined,
      })),
    ];
  }, [seccionesResponse]);

  // Conteo de filtros activos diferentes al valor por defecto
  const cantidadFiltrosActivos = React.useMemo(() => {
    let cuenta = 0;
    if (filtros.periodoId && filtros.periodoId !== "all") cuenta++;
    if (filtros.fechaInicio) cuenta++;
    if (filtros.fechaFin) cuenta++;
    if (filtros.docenteId && filtros.docenteId !== "all") cuenta++;
    if (filtros.cursoId && filtros.cursoId !== "all") cuenta++;
    if (filtros.seccionId && filtros.seccionId !== "all") cuenta++;
    return cuenta;
  }, [filtros]);

  const manejarCambioBimestre = (valor: string) => {
    onChange({
      ...filtros,
      periodoId: valor === "all" ? undefined : valor,
    });
  };

  const manejarCambioDocente = (valor: string) => {
    onChange({
      ...filtros,
      docenteId: valor === "all" ? undefined : valor,
    });
  };

  const manejarCambioCurso = (valor: string) => {
    onChange({
      ...filtros,
      cursoId: valor === "all" ? undefined : valor,
    });
  };

  const manejarCambioSeccion = (valor: string) => {
    onChange({
      ...filtros,
      seccionId: valor === "all" ? undefined : valor,
    });
  };

  const manejarCambioFechaInicio = (fecha?: Date) => {
    onChange({
      ...filtros,
      fechaInicio: fecha ? fecha.toISOString().split("T")[0] : undefined,
    });
  };

  const manejarCambioFechaFin = (fecha?: Date) => {
    onChange({
      ...filtros,
      fechaFin: fecha ? fecha.toISOString().split("T")[0] : undefined,
    });
  };

  const fechaInicioObj = filtros.fechaInicio
    ? new Date(`${filtros.fechaInicio}T00:00:00`)
    : undefined;
  const fechaFinObj = filtros.fechaFin ? new Date(`${filtros.fechaFin}T00:00:00`) : undefined;

  return (
    <Card className="border-border/60">
      <CardContent className="space-y-4 p-4 sm:p-5">
        {/* Fila Primaria: Bimestre principal y botones de acción */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            {/* Selector de Bimestre */}
            <div className="w-full sm:w-72 lg:w-80">
              <label htmlFor="select-bimestre-indicadores" className="sr-only">
                Seleccionar Bimestre
              </label>
              <SelectOption
                options={opcionesBimestres}
                value={filtros.periodoId ?? "all"}
                onSelect={manejarCambioBimestre}
                placeholder="Seleccionar período o bimestre"
                searchPlaceholder="Buscar bimestre..."
                disabled={cargando}
              />
            </div>

            {/* Alternar Filtros Avanzados */}
            <Button
              type="button"
              variant={mostrarAvanzados ? "secondary" : "outline"}
              size="default"
              onClick={() => setMostrarAvanzados((prev) => !prev)}
              className="gap-2"
              aria-expanded={mostrarAvanzados}
              aria-label="Alternar filtros avanzados de docente, curso, sección y fechas"
            >
              <HugeiconsIcon icon={FilterIcon} size={16} strokeWidth={2} />
              <span>Filtros avanzados</span>
              {cantidadFiltrosActivos > 0 && (
                <Badge variant="default" className="size-5 rounded-full p-0 text-[11px]">
                  {cantidadFiltrosActivos}
                </Badge>
              )}
            </Button>
          </div>

          {/* Botón Limpiar Filtros */}
          {cantidadFiltrosActivos > 0 && (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onLimpiar}
                className="text-muted-foreground hover:text-foreground gap-1.5 text-xs"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={2} />
                <span>Limpiar filtros</span>
              </Button>
            </div>
          )}
        </div>

        {/* Fila Secundaria: Filtros Avanzados Desplegables */}
        {mostrarAvanzados && (
          <div
            className={`border-border/60 grid grid-cols-1 gap-3 border-t pt-4 sm:grid-cols-2 ${
              ocultarDocente ? "lg:grid-cols-3" : "lg:grid-cols-4"
            }`}
          >
            {/* Filtro por Docente */}
            {!ocultarDocente && (
              <div className="space-y-1.5">
                <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                  <HugeiconsIcon icon={User02Icon} size={14} />
                  {esTesis ? "Docente (CSP / IGM)" : "Docente"}
                </span>
                <SelectOption
                  options={opcionesDocentes}
                  value={filtros.docenteId ?? "all"}
                  onSelect={manejarCambioDocente}
                  placeholder="Todos los docentes"
                  searchPlaceholder="Buscar docente..."
                  disabled={cargando}
                />
              </div>
            )}

            {/* Filtro por Curso */}
            <div className="space-y-1.5">
              <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                <HugeiconsIcon icon={Book02Icon} size={14} />
                {esTesis ? "Curso (CSP / IGM)" : "Curso"}
              </span>
              <SelectOption
                options={opcionesCursos}
                value={filtros.cursoId ?? "all"}
                onSelect={manejarCambioCurso}
                placeholder="Todos los cursos"
                searchPlaceholder="Buscar curso..."
                disabled={cargando}
              />
            </div>

            {/* Filtro por Sección */}
            <div className="space-y-1.5">
              <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                <HugeiconsIcon icon={HierarchySquare02Icon} size={14} />
                {esTesis ? "Sección (ISA)" : "Sección"}
              </span>
              <SelectOption
                options={opcionesSecciones}
                value={filtros.seccionId ?? "all"}
                onSelect={manejarCambioSeccion}
                placeholder="Todas las secciones"
                searchPlaceholder="Buscar sección..."
                disabled={cargando}
              />
            </div>

            {/* Rango de Fechas */}
            <div className="space-y-1.5">
              <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                <HugeiconsIcon icon={Calendar03Icon} size={14} />
                Rango de fechas
              </span>
              <div className="flex items-center gap-2">
                <DatePicker
                  date={fechaInicioObj}
                  onSelect={manejarCambioFechaInicio}
                  placeholder="Desde"
                  disabled={cargando}
                  className="w-full"
                />
                <DatePicker
                  date={fechaFinObj}
                  onSelect={manejarCambioFechaFin}
                  placeholder="Hasta"
                  disabled={cargando}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
