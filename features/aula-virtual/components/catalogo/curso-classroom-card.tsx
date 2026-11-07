"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, BookOpen01Icon } from "@hugeicons/core-free-icons";
import type { CursoAula } from "../../types";
import { obtenerEstiloCurso } from "../../utils";

export interface CursoClassroomCardProps {
  curso: CursoAula;
  basePath?: string;
  onSelect?: (cursoSeccionId: string) => void;
}

export function CursoClassroomCard({
  curso,
  basePath = "/admin/aula-virtual",
  onSelect,
}: CursoClassroomCardProps) {
  const estilo = obtenerEstiloCurso(curso);
  const inicialDocente = curso.docenteNombre ? curso.docenteNombre.charAt(0).toUpperCase() : "D";
  const rutaCurso = `${basePath}/${curso.cursoSeccionId}`;

  return (
    <Link
      href={rutaCurso}
      onClick={() => onSelect?.(curso.cursoSeccionId)}
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
            <p className="text-muted-foreground text-[11px] font-medium">Docente a cargo</p>
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
}
