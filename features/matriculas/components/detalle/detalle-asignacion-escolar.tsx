"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { SchoolIcon } from "@hugeicons/core-free-icons";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MATRICULA_TIPO_CONFIG } from "../../constants";
import type { MatriculaItem } from "../../types";

interface DetalleAsignacionEscolarProps {
  matricula: MatriculaItem;
}

export function DetalleAsignacionEscolar({ matricula }: DetalleAsignacionEscolarProps) {
  return (
    <Card className="border-border/60 overflow-hidden rounded-2xl shadow-2xs">
      <CardHeader className="bg-muted/30 border-border/50 border-b px-5 py-3.5">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          <HugeiconsIcon icon={SchoolIcon} className="text-primary size-4" />
          Asignación Escolar y Salón
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 p-5 text-xs sm:grid-cols-2">
        <div className="space-y-1">
          <span className="text-muted-foreground block text-[11px]">Grado Escolar</span>
          <span className="text-foreground text-sm font-semibold">{matricula.gradoNombre}</span>
        </div>

        <div className="space-y-1">
          <span className="text-muted-foreground block text-[11px]">Sección Asignada</span>
          <div className="flex items-center gap-2">
            <span className="bg-primary/10 text-primary rounded px-2 py-0.5 text-xs font-bold">
              Sección {matricula.seccionNombre}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-muted-foreground block text-[11px]">Año Académico</span>
          <span className="text-foreground font-medium">{matricula.anioNumero}</span>
        </div>

        <div className="space-y-1">
          <span className="text-muted-foreground block text-[11px]">Modalidad / Tipo</span>
          <span className="text-foreground font-medium">
            {MATRICULA_TIPO_CONFIG[matricula.tipo] || matricula.tipo}
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-muted-foreground block text-[11px]">Condición Académica</span>
          {matricula.esRepitente ? (
            <Badge variant="outline" className="border-amber-400 text-[11px] text-amber-600">
              Repitente del grado
            </Badge>
          ) : (
            <span className="text-foreground font-medium">Regular (Promovido)</span>
          )}
        </div>

        <div className="space-y-1">
          <span className="text-muted-foreground block text-[11px]">
            Fecha Oficial de Matrícula
          </span>
          <span className="text-foreground font-medium">{matricula.fechaMatricula}</span>
        </div>

        {matricula.colegioProcedencia && (
          <div className="border-border/40 space-y-1 border-t pt-2 sm:col-span-2">
            <span className="text-muted-foreground block text-[11px]">Colegio de Procedencia</span>
            <span className="text-foreground font-medium">{matricula.colegioProcedencia}</span>
          </div>
        )}

        {matricula.observaciones && (
          <div className="border-border/40 space-y-1 border-t pt-2 sm:col-span-2">
            <span className="text-muted-foreground block text-[11px]">
              Observaciones del Expediente
            </span>
            <p className="text-muted-foreground italic">{matricula.observaciones}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
