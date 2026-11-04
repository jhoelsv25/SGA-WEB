"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { BookOpen01Icon, Search01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { CursoAula } from "../types";

interface CursosClassroomGridProps {
  cursos: CursoAula[];
  onSelectCurso: (cursoSeccionId: string) => void;
}

// Paletas inspiradas en Google Classroom según área curricular o nombre
const PALETAS_AREA: Record<string, { gradient: string; accent: string }> = {
  matematica: {
    gradient: "from-blue-600 via-blue-700 to-indigo-800",
    accent: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
  },
  comunicacion: {
    gradient: "from-red-600 via-rose-700 to-pink-800",
    accent: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300",
  },
  ingles: {
    gradient: "from-purple-600 via-violet-700 to-indigo-900",
    accent: "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300",
  },
  arte_cultura: {
    gradient: "from-pink-500 via-fuchsia-600 to-purple-700",
    accent: "bg-pink-50 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300",
  },
  ciencias_sociales: {
    gradient: "from-amber-600 via-orange-700 to-yellow-800",
    accent: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
  },
  ciencia_tecnologia: {
    gradient: "from-emerald-600 via-teal-700 to-cyan-800",
    accent: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
  },
  dpcc: {
    gradient: "from-teal-600 via-emerald-700 to-green-800",
    accent: "bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300",
  },
  educacion_fisica: {
    gradient: "from-orange-500 via-amber-600 to-red-700",
    accent: "bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300",
  },
  educacion_religiosa: {
    gradient: "from-indigo-600 via-blue-700 to-sky-800",
    accent: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300",
  },
  ept: {
    gradient: "from-cyan-600 via-sky-700 to-blue-800",
    accent: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300",
  },
};

export function obtenerEstiloCurso(curso: {
  cursoNombre: string;
  areaCurricular?: string | null;
  colorHex?: string | null;
}) {
  const area = (curso.areaCurricular || "").toLowerCase();
  if (PALETAS_AREA[area]) return PALETAS_AREA[area];

  const nombre = curso.cursoNombre.toLowerCase();
  if (nombre.includes("matem")) return PALETAS_AREA.matematica;
  if (nombre.includes("comun")) return PALETAS_AREA.comunicacion;
  if (nombre.includes("ingl")) return PALETAS_AREA.ingles;
  if (nombre.includes("arte")) return PALETAS_AREA.arte_cultura;
  if (nombre.includes("social") || nombre.includes("historia"))
    return PALETAS_AREA.ciencias_sociales;
  if (nombre.includes("cienc") || nombre.includes("quim") || nombre.includes("fisic"))
    return PALETAS_AREA.ciencia_tecnologia;
  if (nombre.includes("relig")) return PALETAS_AREA.educacion_religiosa;
  if (nombre.includes("fisica")) return PALETAS_AREA.educacion_fisica;

  return {
    gradient: "from-slate-700 via-slate-800 to-zinc-900",
    accent: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
  };
}

export function CursosClassroomGrid({ cursos, onSelectCurso }: CursosClassroomGridProps) {
  const [busqueda, setBusqueda] = React.useState("");
  const [seccionFiltro, setSeccionFiltro] = React.useState<string>("todas");

  // Obtener secciones únicas para los chips de filtro
  const seccionesDisponibles = React.useMemo(() => {
    const mapa = new Set<string>();
    for (const c of cursos) {
      if (c.seccionNombre) mapa.add(c.seccionNombre);
    }
    return Array.from(mapa);
  }, [cursos]);

  const cursosFiltrados = React.useMemo(() => {
    return cursos.filter((c) => {
      const matchBusqueda =
        !busqueda ||
        c.cursoNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.seccionNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        (c.docenteNombre && c.docenteNombre.toLowerCase().includes(busqueda.toLowerCase()));

      const matchSeccion = seccionFiltro === "todas" || c.seccionNombre === seccionFiltro;

      return matchBusqueda && matchSeccion;
    });
  }, [cursos, busqueda, seccionFiltro]);

  return (
    <div className="space-y-6">
      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <HugeiconsIcon
            icon={Search01Icon}
            size={18}
            className="text-muted-foreground absolute top-1/2 left-3.5 -translate-y-1/2"
          />
          <Input
            placeholder="Buscar por materia, sección o docente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="h-10.5 rounded-xl pr-4 pl-10 text-sm"
          />
        </div>

        {seccionesDisponibles.length > 1 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSeccionFiltro("todas")}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                seccionFiltro === "todas"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/70 text-muted-foreground hover:bg-muted"
              }`}
            >
              Todas las secciones ({cursos.length})
            </button>
            {seccionesDisponibles.map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => setSeccionFiltro(sec)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  seccionFiltro === sec
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted"
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
        <div className="border-border/80 rounded-2xl border border-dashed p-12 text-center">
          <HugeiconsIcon
            icon={BookOpen01Icon}
            size={40}
            className="text-muted-foreground/60 mx-auto mb-3"
          />
          <h3 className="text-foreground text-base font-semibold">No se encontraron materias</h3>
          <p className="text-muted-foreground mt-1 text-xs">
            {busqueda
              ? "Prueba cambiando el término de búsqueda o limpiando los filtros."
              : "No tienes materias asignadas en este periodo escolar."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {cursosFiltrados.map((curso) => {
            const estilo = obtenerEstiloCurso(curso);
            const inicialDocente = curso.docenteNombre
              ? curso.docenteNombre.charAt(0).toUpperCase()
              : "D";

            return (
              <div
                key={curso.cursoSeccionId}
                onClick={() => onSelectCurso(curso.cursoSeccionId)}
                className="group border-border/70 bg-card hover:border-border relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Banner de Cabecera tipo Classroom con degradado vibrante */}
                <div
                  className={`relative flex h-36 flex-col justify-between bg-gradient-to-br p-4 ${estilo.gradient} text-white`}
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
                    <h3 className="line-clamp-2 text-lg leading-snug font-bold text-white drop-shadow-sm group-hover:underline">
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
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      className="group-hover:bg-primary w-full gap-2 rounded-xl font-medium transition-all group-hover:shadow-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCurso(curso.cursoSeccionId);
                      }}
                    >
                      <span>Entrar al aula</span>
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        size={15}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
