"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { BookOpen01Icon, TeacherIcon, UserGroupIcon } from "@hugeicons/core-free-icons";

export interface CursoHeroBannerProps {
  seccionNombre?: string | null;
  gradoNombre?: string | null;
  periodoActualLabel?: string | null;
  cursoNombre?: string | null;
  docenteNombre?: string | null;
  totalEstudiantes?: number | null;
  gradient: string;
}

export function CursoHeroBanner({
  seccionNombre,
  gradoNombre,
  periodoActualLabel,
  cursoNombre,
  docenteNombre,
  totalEstudiantes,
  gradient,
}: CursoHeroBannerProps) {
  const inicialDocente = docenteNombre ? docenteNombre.charAt(0).toUpperCase() : "D";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-linear-to-r p-6 md:p-8 ${gradient} border border-white/15 text-white shadow-lg`}
    >
      {/* Patrón decorativo translúcido de fondo */}
      <div className="pointer-events-none absolute -right-4 -bottom-6 opacity-15">
        <HugeiconsIcon icon={BookOpen01Icon} size={160} />
      </div>

      <div className="relative z-10 flex flex-col justify-between gap-5">
        {/* Chips superiores de ubicación curricular */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-bold tracking-wide text-white shadow-xs backdrop-blur-md">
            {seccionNombre || "Sección"}
          </span>
          <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/95 shadow-xs backdrop-blur-sm">
            {gradoNombre || "Secundaria"}
          </span>
          {periodoActualLabel && (
            <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/95 shadow-xs backdrop-blur-sm">
              {periodoActualLabel}
            </span>
          )}
          {typeof totalEstudiantes === "number" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/95 shadow-xs backdrop-blur-sm">
              <HugeiconsIcon icon={UserGroupIcon} size={14} />
              <span>
                {totalEstudiantes > 0
                  ? `${totalEstudiantes} ${totalEstudiantes === 1 ? "alumno matriculado" : "alumnos matriculados"}`
                  : "Sin alumnos matriculados"}
              </span>
            </span>
          )}
        </div>

        {/* Título de la materia y ficha del docente */}
        <div className="space-y-3">
          <h1 className="text-2xl font-extrabold tracking-tight text-white drop-shadow-md sm:text-3xl md:text-4xl">
            {cursoNombre || "Materia"}
          </h1>

          <div className="flex items-center gap-2.5 text-sm font-medium text-white/90">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/25 text-xs font-bold text-white backdrop-blur-xs">
              {inicialDocente}
            </div>
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon icon={TeacherIcon} size={15} className="text-white/80" />
              <span>Docente a cargo:</span>
              <span className="font-semibold text-white drop-shadow-xs">
                {docenteNombre || "Por asignar"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
