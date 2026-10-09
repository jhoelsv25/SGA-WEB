"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert02Icon, CheckmarkCircle02Icon, TeacherIcon } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import type { SeccionDetalleHeader } from "../types";

export interface SeccionInfoCardProps {
  seccion: SeccionDetalleHeader;
}

export function SeccionInfoCard({ seccion }: SeccionInfoCardProps) {
  return (
    <div className="border-border/80 bg-card rounded-2xl border p-4 shadow-2xs sm:p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1">
          <span className="text-muted-foreground text-xs font-medium">Grado y Sección</span>
          <p className="text-foreground text-base font-bold">
            {seccion.gradoNombre} &ldquo;{seccion.nombre}&rdquo;
          </p>
          <p className="text-muted-foreground text-xs">
            {seccion.aula ? `Aula: ${seccion.aula}` : "Sin aula fija"}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-muted-foreground text-xs font-medium">Docente Tutor</span>
          <div className="flex items-center gap-1.5">
            <HugeiconsIcon icon={TeacherIcon} className="text-primary size-4 shrink-0" />
            <p className="text-foreground truncate text-sm font-semibold">
              {seccion.tutor?.nombreCompleto ?? "Sin tutor asignado"}
            </p>
          </div>
          {seccion.tutor && (
            <p className="text-muted-foreground font-mono text-xs">{seccion.tutor.codigo}</p>
          )}
        </div>

        <div className="space-y-1">
          <span className="text-muted-foreground text-xs font-medium">Matrícula y Estado</span>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={seccion.estado === "activa" ? "default" : "secondary"}>
              {seccion.estado === "activa" ? "Activa" : "Cerrada"}
            </Badge>
            <span className="text-muted-foreground text-xs">
              {seccion.matriculados} / {seccion.vacantes} vacantes
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-muted-foreground text-xs font-medium">Carga Docente</span>
          <div className="flex items-center gap-2">
            {seccion.cursosSinDocente === 0 ? (
              <Badge variant="outline" className="border-primary/30 text-primary">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} className="mr-1 size-3" />
                Carga completa
              </Badge>
            ) : (
              <Badge variant="outline" className="border-warning/30 text-warning-text">
                <HugeiconsIcon icon={Alert02Icon} className="mr-1 size-3" />
                {seccion.cursosSinDocente} sin docente
              </Badge>
            )}
            <span className="text-muted-foreground text-xs">
              {seccion.totalCursos} cursos en total
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
