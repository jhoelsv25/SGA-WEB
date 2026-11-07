"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { SelectOption } from "@/components/common/select";
import type { CursoAula } from "../types";

export interface AulaNavHeaderProps {
  cursos: CursoAula[];
  cursoId: string;
  onSelectCurso: (id: string) => void;
  onVolverCursos: () => void;
  opcionesPeriodo: { value: string; label: string }[];
  periodoId: string;
  onSelectPeriodo: (id: string) => void;
  esApoderado: boolean;
  hijosEnCurso?: { estudianteId: string; nombreCompleto: string }[];
  estudianteActivoId?: string;
  onSelectEstudiante: (id: string) => void;
  puedeAdministrar: boolean;
  onNuevaUnidad: () => void;
}

export function AulaNavHeader({
  cursos,
  cursoId,
  onSelectCurso,
  onVolverCursos,
  opcionesPeriodo,
  periodoId,
  onSelectPeriodo,
  esApoderado,
  hijosEnCurso,
  estudianteActivoId,
  onSelectEstudiante,
  puedeAdministrar,
  onNuevaUnidad,
}: AulaNavHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Button
        asChild
        variant="outline"
        size="sm"
        className="hover:bg-muted gap-2 self-start rounded-xl text-xs font-semibold"
      >
        <Link href="/admin/aula-virtual" onClick={onVolverCursos}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
          <span>Volver a todas las materias</span>
        </Link>
      </Button>

      <div className="flex flex-wrap items-center gap-2">
        {/* Selector rápido para saltar de materia sin salir */}
        <div className="w-56">
          <SelectOption
            options={cursos.map((c) => ({
              value: c.cursoSeccionId,
              label: `${c.cursoNombre} · ${c.seccionNombre}`,
            }))}
            value={cursoId}
            onSelect={onSelectCurso}
            placeholder="Cambiar de materia"
            searchPlaceholder="Buscar materia..."
          />
        </div>

        {opcionesPeriodo.length > 1 && (
          <div className="w-44">
            <SelectOption
              options={opcionesPeriodo}
              value={periodoId}
              onSelect={onSelectPeriodo}
              placeholder="Periodo"
            />
          </div>
        )}

        {esApoderado && hijosEnCurso && hijosEnCurso.length > 0 && (
          <div className="w-56">
            <SelectOption
              options={hijosEnCurso.map((h) => ({
                value: h.estudianteId,
                label: `Estudiante: ${h.nombreCompleto}`,
              }))}
              value={estudianteActivoId ?? ""}
              onSelect={onSelectEstudiante}
              placeholder="Estudiante"
            />
          </div>
        )}

        {puedeAdministrar && (
          <Button
            type="button"
            size="sm"
            className="gap-1.5 rounded-xl text-xs font-semibold"
            onClick={onNuevaUnidad}
          >
            <HugeiconsIcon icon={PlusSignIcon} size={16} />
            <span>Nueva unidad</span>
          </Button>
        )}
      </div>
    </div>
  );
}
