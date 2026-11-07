"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { BookOpen01Icon, TeacherIcon } from "@hugeicons/core-free-icons";

export interface CursoHeroBannerProps {
  seccionNombre?: string | null;
  gradoNombre?: string | null;
  periodoActualLabel?: string | null;
  cursoNombre?: string | null;
  docenteNombre?: string | null;
  gradient: string;
}

export function CursoHeroBanner({
  seccionNombre,
  gradoNombre,
  periodoActualLabel,
  cursoNombre,
  docenteNombre,
  gradient,
}: CursoHeroBannerProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-linear-to-r p-6 md:p-8 ${gradient} border border-white/10 text-white shadow-md`}
    >
      <div className="pointer-events-none absolute right-4 -bottom-6 opacity-15">
        <HugeiconsIcon icon={BookOpen01Icon} size={150} />
      </div>
      <div className="relative z-10 flex flex-col justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold tracking-wide text-white! shadow-xs backdrop-blur-md">
            {seccionNombre || "Sección"}
          </span>
          <span className="text-xs font-medium text-white/90!">{gradoNombre || "Secundaria"}</span>
          {periodoActualLabel && (
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/95! shadow-xs backdrop-blur-sm">
              {periodoActualLabel}
            </span>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white! drop-shadow-md md:text-3xl">
            {cursoNombre || "Materia"}
          </h1>
          <p className="mt-1 flex items-center gap-2 text-sm font-medium text-white/90!">
            <HugeiconsIcon icon={TeacherIcon} size={16} />
            <span>Docente: {docenteNombre || "Docente asignado"}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
