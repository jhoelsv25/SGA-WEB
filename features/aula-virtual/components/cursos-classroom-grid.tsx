"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  BookOpen01Icon,
  FilterIcon,
  RotateLeft01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SelectOption, type SelectOptionItem } from "@/components/common/select";
import { useSession } from "@/features/auth";
import type { CursoAula } from "../types";
import { obtenerEstiloCurso } from "../utils";

export { obtenerEstiloCurso };

interface CursosClassroomGridProps {
  cursos: CursoAula[];
  onSelectCurso?: (cursoSeccionId: string) => void;
  basePath?: string;
}

export function CursosClassroomGrid({
  cursos,
  onSelectCurso,
  basePath = "/admin/aula-virtual",
}: CursosClassroomGridProps) {
  const { data: sessionData } = useSession();
  const rolNombre = sessionData?.user?.activeRoleName ?? sessionData?.user?.roles?.[0] ?? "";
  const esDirectivoOAdmin = ["Administrador", "Director", "Subdirector"].includes(rolNombre);
  const esDocente = rolNombre === "Docente";
  const esEstudiante = rolNombre === "Estudiante";
  const esApoderado = rolNombre === "Apoderado";

  const [busqueda, setBusqueda] = React.useState("");
  const [gradoFiltro, setGradoFiltro] = React.useState<string>("");
  const [seccionFiltro, setSeccionFiltro] = React.useState<string>("");
  const [materiaFiltro, setMateriaFiltro] = React.useState<string>("");
  const [docenteFiltro, setDocenteFiltro] = React.useState<string>("");

  // Grados disponibles
  const gradosDisponibles = React.useMemo(() => {
    const mapa = new Set<string>();
    for (const c of cursos) {
      if (c.gradoNombre) mapa.add(c.gradoNombre);
    }
    return Array.from(mapa).sort();
  }, [cursos]);

  // Secciones disponibles (dependen del grado seleccionado si lo hay)
  const seccionesDisponibles = React.useMemo(() => {
    const mapa = new Set<string>();
    for (const c of cursos) {
      if (!gradoFiltro || c.gradoNombre === gradoFiltro) {
        if (c.seccionNombre) mapa.add(c.seccionNombre);
      }
    }
    return Array.from(mapa).sort();
  }, [cursos, gradoFiltro]);

  // Materias únicas
  const materiasDisponibles = React.useMemo(() => {
    const mapa = new Set<string>();
    for (const c of cursos) {
      if (c.cursoNombre) mapa.add(c.cursoNombre);
    }
    return Array.from(mapa).sort();
  }, [cursos]);

  // Docentes disponibles
  const docentesDisponibles = React.useMemo(() => {
    const mapa = new Set<string>();
    for (const c of cursos) {
      if (c.docenteNombre && c.docenteNombre.trim()) {
        mapa.add(c.docenteNombre.trim());
      }
    }
    return Array.from(mapa).sort();
  }, [cursos]);

  // Opciones para SelectOption
  const opcionesGrados: SelectOptionItem<string>[] = React.useMemo(
    () => [
      { value: "", label: "Todos los grados" },
      ...gradosDisponibles.map((g) => ({ value: g, label: g })),
    ],
    [gradosDisponibles],
  );

  const opcionesSecciones: SelectOptionItem<string>[] = React.useMemo(
    () => [
      { value: "", label: "Todas las secciones" },
      ...seccionesDisponibles.map((s) => ({ value: s, label: s })),
    ],
    [seccionesDisponibles],
  );

  const opcionesMaterias: SelectOptionItem<string>[] = React.useMemo(
    () => [
      { value: "", label: "Todas las materias" },
      ...materiasDisponibles.map((m) => ({ value: m, label: m })),
    ],
    [materiasDisponibles],
  );

  const opcionesDocentes: SelectOptionItem<string>[] = React.useMemo(
    () => [
      { value: "", label: "Todos los docentes" },
      { value: "sin_asignar", label: "⚠️ Sin docente asignado" },
      ...docentesDisponibles.map((d) => ({ value: d, label: d })),
    ],
    [docentesDisponibles],
  );

  // Filtrado reactivo multidimensional
  const cursosFiltrados = React.useMemo(() => {
    return cursos.filter((c) => {
      const matchBusqueda =
        !busqueda ||
        c.cursoNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.seccionNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        (c.docenteNombre && c.docenteNombre.toLowerCase().includes(busqueda.toLowerCase()));

      const matchGrado = !gradoFiltro || c.gradoNombre === gradoFiltro;
      const matchSeccion = !seccionFiltro || c.seccionNombre === seccionFiltro;
      const matchMateria = !materiaFiltro || c.cursoNombre === materiaFiltro;
      const matchDocente =
        !docenteFiltro ||
        (docenteFiltro === "sin_asignar"
          ? !c.docenteNombre || c.docenteNombre.trim() === ""
          : c.docenteNombre === docenteFiltro);

      return matchBusqueda && matchGrado && matchSeccion && matchMateria && matchDocente;
    });
  }, [cursos, busqueda, gradoFiltro, seccionFiltro, materiaFiltro, docenteFiltro]);

  const hayFiltrosActivos = Boolean(
    busqueda || gradoFiltro || seccionFiltro || materiaFiltro || docenteFiltro,
  );

  const limpiarFiltros = () => {
    setBusqueda("");
    setGradoFiltro("");
    setSeccionFiltro("");
    setMateriaFiltro("");
    setDocenteFiltro("");
  };

  return (
    <div className="space-y-6">
      {/* Panel Superior: Contexto de Rol y Barra de Filtros */}
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
                ? `Mostrando ${cursosFiltrados.length} de ${cursos.length} materias`
                : `${cursos.length} ${cursos.length === 1 ? "materia encontrada" : "materias en total"}`}
            </span>
          </div>

          {hayFiltrosActivos && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={limpiarFiltros}
              className="text-muted-foreground hover:text-foreground hover:bg-muted/60 h-8 gap-1.5 self-start rounded-lg text-xs font-medium sm:self-auto"
            >
              <HugeiconsIcon icon={RotateLeft01Icon} size={14} />
              <span>Limpiar filtros</span>
            </Button>
          )}
        </div>

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
              onChange={(e) => setBusqueda(e.target.value)}
              className="h-9.5 rounded-xl pr-4 pl-9 text-xs sm:text-sm"
            />
          </div>

          {/* Filtro por Grado / Año (solo si el usuario tiene cursos en > 1 grado) */}
          {gradosDisponibles.length > 1 && (
            <div className="w-full sm:w-44 md:w-48">
              <SelectOption
                options={opcionesGrados}
                value={gradoFiltro}
                onSelect={(val) => {
                  setGradoFiltro(val);
                  setSeccionFiltro("");
                }}
                placeholder="Grado / Año"
                searchPlaceholder="Buscar grado..."
                className="h-9.5 text-xs"
              />
            </div>
          )}

          {/* Filtro por Sección (solo si el usuario tiene cursos en > 1 sección) */}
          {seccionesDisponibles.length > 1 && (
            <div className="w-full sm:w-40 md:w-44">
              <SelectOption
                options={opcionesSecciones}
                value={seccionFiltro}
                onSelect={setSeccionFiltro}
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
                onSelect={setMateriaFiltro}
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
                onSelect={setDocenteFiltro}
                placeholder="Docente a cargo"
                searchPlaceholder="Buscar docente..."
                className="h-9.5 text-xs"
              />
            </div>
          )}
        </div>

        {/* Chips de sección rápidos (si hay pocas secciones para alternar con 1 clic) */}
        {seccionesDisponibles.length > 1 && seccionesDisponibles.length <= 6 && (
          <div className="border-border/60 flex flex-wrap items-center gap-1.5 border-t pt-3">
            <span className="text-muted-foreground mr-1 text-[11px] font-medium">
              Sección rápida:
            </span>
            <button
              type="button"
              onClick={() => setSeccionFiltro("")}
              className={`cursor-pointer rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                seccionFiltro === ""
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              Todas ({cursos.length})
            </button>
            {seccionesDisponibles.map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => setSeccionFiltro(seccionFiltro === sec ? "" : sec)}
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

      {/* Grid de Materias tipo Google Classroom */}
      {cursosFiltrados.length === 0 ? (
        <div className="border-border/80 bg-card/40 rounded-2xl border border-dashed p-12 text-center">
          <HugeiconsIcon
            icon={BookOpen01Icon}
            size={40}
            className="text-muted-foreground/60 mx-auto mb-3"
          />
          <h3 className="text-foreground text-base font-semibold">No se encontraron materias</h3>
          <p className="text-muted-foreground mt-1 text-xs">
            {hayFiltrosActivos
              ? "Prueba cambiando los filtros seleccionados o limpiándolos para ver todas las materias."
              : "No tienes materias asignadas en este periodo escolar."}
          </p>
          {hayFiltrosActivos && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={limpiarFiltros}
              className="mt-4 gap-1.5 rounded-xl text-xs font-medium"
            >
              <HugeiconsIcon icon={RotateLeft01Icon} size={14} />
              <span>Limpiar filtros</span>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cursosFiltrados.map((curso) => {
            const estilo = obtenerEstiloCurso(curso);
            const inicialDocente = curso.docenteNombre
              ? curso.docenteNombre.charAt(0).toUpperCase()
              : "D";
            const rutaCurso = `${basePath}/${curso.cursoSeccionId}`;

            return (
              <Link
                key={curso.cursoSeccionId}
                href={rutaCurso}
                onClick={() => onSelectCurso?.(curso.cursoSeccionId)}
                className="group border-border/70 bg-card hover:border-border focus-visible:ring-primary relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:ring-2 focus-visible:outline-none"
              >
                {/* Banner de Cabecera tipo Classroom con degradado vibrante */}
                <div
                  className={`relative flex h-36 flex-col justify-between bg-linear-to-br p-4 ${estilo.gradient} text-white`}
                >
                  {/* Patrón decorativo sutil en la esquina */}
                  <div className="pointer-events-none absolute right-2 -bottom-2 opacity-15">
                    <HugeiconsIcon icon={BookOpen01Icon} size={88} />
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-white backdrop-blur-md">
                      {curso.seccionNombre}
                    </span>
                    <span className="text-[11px] font-medium text-white/80">
                      {curso.gradoNombre || "Secundaria"}
                    </span>
                  </div>

                  <div>
                    <h3 className="line-clamp-2 text-lg leading-snug font-bold text-white drop-shadow-sm">
                      {curso.cursoNombre}
                    </h3>
                  </div>
                </div>

                {/* Cuerpo de la tarjeta */}
                <div className="bg-card flex flex-1 flex-col justify-between gap-4 p-4">
                  {/* Información del Docente */}
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                      {inicialDocente}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-muted-foreground text-[11px] font-medium">
                        Docente a cargo
                      </p>
                      <p className="text-foreground truncate text-xs font-semibold">
                        {curso.docenteNombre || "Por asignar"}
                      </p>
                    </div>
                  </div>

                  {/* Botón de acción tipo Classroom */}
                  <div className="border-border/50 border-t pt-2">
                    <div className="group-hover:bg-primary bg-primary/90 text-primary-foreground flex h-9 w-full items-center justify-center gap-2 rounded-xl text-xs font-medium transition-all group-hover:shadow-md">
                      <span>Entrar al aula</span>
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        size={15}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
