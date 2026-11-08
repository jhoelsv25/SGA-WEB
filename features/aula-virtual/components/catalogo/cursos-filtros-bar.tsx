"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FilterIcon,
  RotateLeft01Icon,
  Search01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SelectOption, type SelectOptionItem } from "@/components/common/select";

export interface CursosFiltrosBarProps {
  rolNombre: string;
  totalCursos: number;
  totalCursosFiltrados: number;
  hayFiltrosActivos: boolean;
  onLimpiarFiltros: () => void;
  busqueda: string;
  onBusquedaChange: (val: string) => void;
  gradosDisponibles: string[];
  opcionesGrados: SelectOptionItem<string>[];
  gradoFiltro: string;
  onGradoChange: (val: string) => void;
  seccionesDisponibles: string[];
  opcionesSecciones: SelectOptionItem<string>[];
  seccionFiltro: string;
  onSeccionChange: (val: string) => void;
  materiasDisponibles: string[];
  opcionesMaterias: SelectOptionItem<string>[];
  materiaFiltro: string;
  onMateriaChange: (val: string) => void;
  docentesDisponibles: string[];
  opcionesDocentes: SelectOptionItem<string>[];
  docenteFiltro: string;
  onDocenteChange: (val: string) => void;
  soloConAlumnos?: boolean;
  onSoloConAlumnosChange?: (val: boolean) => void;
  totalConAlumnos?: number;
}

export function CursosFiltrosBar({
  rolNombre,
  totalCursos,
  totalCursosFiltrados,
  hayFiltrosActivos,
  onLimpiarFiltros,
  busqueda,
  onBusquedaChange,
  gradosDisponibles,
  opcionesGrados: _opcionesGrados,
  gradoFiltro,
  onGradoChange,
  seccionesDisponibles,
  opcionesSecciones,
  seccionFiltro,
  onSeccionChange,
  materiasDisponibles,
  opcionesMaterias,
  materiaFiltro,
  onMateriaChange,
  docentesDisponibles,
  opcionesDocentes,
  docenteFiltro,
  onDocenteChange,
  soloConAlumnos = false,
  onSoloConAlumnosChange,
  totalConAlumnos,
}: CursosFiltrosBarProps) {
  const esDirectivoOAdmin = ["Administrador", "Director", "Subdirector"].includes(rolNombre);
  const esDocente = rolNombre === "Docente";
  const esEstudiante = rolNombre === "Estudiante";
  const esApoderado = rolNombre === "Apoderado";

  const tieneCursosVacios = typeof totalConAlumnos === "number" && totalConAlumnos < totalCursos;

  return (
    <div className="border-border/80 bg-card space-y-4 rounded-2xl border p-4 shadow-xs sm:p-5">
      {/* Cabecera del Panel: Rol e Indicadores de Conteo */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {esDirectivoOAdmin && (
            <span className="border-primary/20 bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold">
              <HugeiconsIcon icon={FilterIcon} size={14} />
              <span>Supervisión Institucional · Todas las aulas</span>
            </span>
          )}
          {esDocente && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span>Mis Materias Asignadas</span>
            </span>
          )}
          {(esEstudiante || esApoderado) && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <span>{esApoderado ? "Materias de tus Hijos" : "Mis Materias Matriculadas"}</span>
            </span>
          )}

          <span className="text-muted-foreground text-xs font-medium">
            {hayFiltrosActivos
              ? `Mostrando ${totalCursosFiltrados} de ${totalCursos} materias`
              : `${totalCursos} ${totalCursos === 1 ? "materia encontrada" : "materias en total"}`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle rápido para filtrar solo cursos con alumnos matriculados */}
          {tieneCursosVacios && onSoloConAlumnosChange && (
            <div className="bg-muted/60 inline-flex items-center rounded-xl p-0.5">
              <button
                type="button"
                onClick={() => onSoloConAlumnosChange(false)}
                className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  !soloConAlumnos
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Todas ({totalCursos})
              </button>
              <button
                type="button"
                onClick={() => onSoloConAlumnosChange(true)}
                className={`flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  soloConAlumnos
                    ? "bg-card text-primary font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <HugeiconsIcon icon={UserGroupIcon} size={13} />
                <span>Con matriculados ({totalConAlumnos})</span>
              </button>
            </div>
          )}

          {hayFiltrosActivos && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onLimpiarFiltros}
              className="text-muted-foreground hover:text-foreground hover:bg-muted/60 h-8 gap-1.5 rounded-lg text-xs font-medium"
            >
              <HugeiconsIcon icon={RotateLeft01Icon} size={14} />
              <span>Limpiar filtros</span>
            </Button>
          )}
        </div>
      </div>

      {/* Pestañas de Grado tipo Segmented Bar (para navegación ágil e intuitiva) */}
      {gradosDisponibles.length > 1 && (
        <div className="border-border/60 flex flex-wrap items-center gap-1.5 border-t pt-3">
          <span className="text-muted-foreground mr-1 text-[11px] font-semibold tracking-wide uppercase">
            Grados:
          </span>
          <button
            type="button"
            onClick={() => {
              onGradoChange("");
              onSeccionChange("");
            }}
            className={`cursor-pointer rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
              gradoFiltro === ""
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            Todos los grados
          </button>
          {gradosDisponibles.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => {
                onGradoChange(gradoFiltro === g ? "" : g);
                onSeccionChange("");
              }}
              className={`cursor-pointer rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                gradoFiltro === g
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      )}

      {/* Controles de Filtro Dinámicos por Rol */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Buscador de texto en vivo */}
        <div className="relative min-w-60 flex-1">
          <HugeiconsIcon
            icon={Search01Icon}
            size={17}
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
          />
          <Input
            placeholder="Buscar materia, sección o docente..."
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            className="h-9.5 rounded-xl pr-4 pl-9 text-xs sm:text-sm"
          />
        </div>

        {/* Filtro por Sección (solo si el usuario tiene cursos en > 1 sección) */}
        {seccionesDisponibles.length > 1 && (
          <div className="w-full sm:w-40 md:w-44">
            <SelectOption
              options={opcionesSecciones}
              value={seccionFiltro}
              onSelect={onSeccionChange}
              placeholder="Sección"
              searchPlaceholder="Buscar sección..."
              className="h-9.5 text-xs"
            />
          </div>
        )}

        {/* Filtro por Materia / Área Curricular (si hay > 1 materia) */}
        {materiasDisponibles.length > 1 && (
          <div className="w-full sm:w-44 md:w-48">
            <SelectOption
              options={opcionesMaterias}
              value={materiaFiltro}
              onSelect={onMateriaChange}
              placeholder="Materia"
              searchPlaceholder="Buscar materia..."
              className="h-9.5 text-xs"
            />
          </div>
        )}

        {/* Filtro por Docente (exclusivo de supervisión para Admin/Directivos, oculto para Docente y Estudiante) */}
        {!esDocente && !esEstudiante && (esDirectivoOAdmin || docentesDisponibles.length > 1) && (
          <div className="w-full sm:w-48 md:w-52">
            <SelectOption
              options={opcionesDocentes}
              value={docenteFiltro}
              onSelect={onDocenteChange}
              placeholder="Docente a cargo"
              searchPlaceholder="Buscar docente..."
              className="h-9.5 text-xs"
            />
          </div>
        )}
      </div>

      {/* Chips de sección rápidos (si hay secciones dentro del grado seleccionado) */}
      {seccionesDisponibles.length > 1 && seccionesDisponibles.length <= 8 && (
        <div className="border-border/60 flex flex-wrap items-center gap-1.5 border-t pt-3">
          <span className="text-muted-foreground mr-1 text-[11px] font-medium">
            Sección rápida:
          </span>
          <button
            type="button"
            onClick={() => onSeccionChange("")}
            className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
              seccionFiltro === ""
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            Todas
          </button>
          {seccionesDisponibles.map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => onSeccionChange(seccionFiltro === sec ? "" : sec)}
              className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                seccionFiltro === sec
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
