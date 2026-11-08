"use client";

import * as React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { SelectOption } from "@/components/common/select";
import type { CursoAula } from "../../types";

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
        className="hover:bg-muted border-border/80 gap-2 self-start rounded-xl text-xs font-semibold shadow-2xs"
      >
        <Link href="/admin/aula-virtual" onClick={onVolverCursos}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={15} />
          <span>Volver al catálogo</span>
        </Link>
      </Button>

      {/* Selectores rápidos superiores */}
      <div className="flex flex-wrap items-center gap-2">
        {cursos.length > 1 && (
          <div className="max-w-72 min-w-56">
            <SelectOption
              options={cursos.map((c) => ({
                value: c.cursoSeccionId,
                label: `${c.cursoNombre} (${c.seccionNombre})`,
              }))}
              value={cursoId}
              onSelect={onSelectCurso}
              placeholder="Cambiar de curso"
              searchPlaceholder="Buscar materia..."
              className="h-8.5 text-xs"
            />
          </div>
        )}

        {opcionesPeriodo.length > 0 && (
          <div className="w-44">
            <SelectOption
              options={opcionesPeriodo}
              value={periodoId}
              onSelect={onSelectPeriodo}
              placeholder="Periodo"
              searchPlaceholder="Buscar periodo..."
              className="h-8.5 text-xs"
            />
          </div>
        )}

        {esApoderado && (hijosEnCurso?.length ?? 0) > 1 && (
          <div className="w-52">
            <SelectOption
              options={(hijosEnCurso ?? []).map((h) => ({
                value: h.estudianteId,
                label: h.nombreCompleto,
              }))}
              value={estudianteActivoId ?? ""}
              onSelect={onSelectEstudiante}
              placeholder="Seleccionar estudiante"
              searchPlaceholder="Buscar estudiante..."
              className="h-8.5 text-xs"
            />
          </div>
        )}

        {puedeAdministrar && (
          <Button
            type="button"
            size="sm"
            onClick={onNuevaUnidad}
            className="h-8.5 gap-1.5 rounded-xl text-xs font-semibold shadow-xs"
          >
            <HugeiconsIcon icon={PlusSignIcon} size={15} />
            <span>Nueva unidad</span>
          </Button>
        )}
      </div>
    </div>
  );
}
