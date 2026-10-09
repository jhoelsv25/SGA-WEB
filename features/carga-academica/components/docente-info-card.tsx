"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert02Icon, CheckmarkCircle02Icon, Clock01Icon } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import type { Docente } from "@/features/docentes";
import type { CargaDocenteDetalle } from "../types";

export interface DocenteInfoCardProps {
  docente: Docente;
  carga?: CargaDocenteDetalle;
}

export function DocenteInfoCard({ docente, carga }: DocenteInfoCardProps) {
  return (
    <div className="border-border/80 bg-card rounded-2xl border p-4 shadow-2xs sm:p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1">
          <span className="text-muted-foreground text-xs font-medium">Docente</span>
          <p className="text-foreground truncate text-base font-bold">
            {docente.persona.nombreCompleto}
          </p>
          <p className="text-muted-foreground font-mono text-xs">Código: {docente.codigo}</p>
        </div>

        <div className="space-y-1">
          <span className="text-muted-foreground text-xs font-medium">Contrato y Estado</span>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="capitalize">
              {docente.tipoContrato}
            </Badge>
            <Badge
              variant={docente.estado === "activo" ? "default" : "secondary"}
              className="capitalize"
            >
              {docente.estado}
            </Badge>
          </div>
          {docente.especialidad && (
            <p className="text-muted-foreground truncate text-xs">{docente.especialidad}</p>
          )}
        </div>

        <div className="space-y-1">
          <span className="text-muted-foreground text-xs font-medium">Horas Asignadas</span>
          <div className="flex items-center gap-1.5">
            <HugeiconsIcon icon={Clock01Icon} className="text-primary size-4" />
            <p className="text-foreground text-lg font-bold">
              {carga ? carga.horasAsignadas : "—"} hrs
            </p>
          </div>
          <p className="text-muted-foreground text-xs">
            Jornada contractual: {carga?.jornadaHoras ?? docente.jornadaHoras} hrs/sem
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-muted-foreground text-xs font-medium">Estado de Carga</span>
          {carga && (
            <div>
              {carga.excede ? (
                <Badge variant="destructive" className="font-semibold">
                  <HugeiconsIcon icon={Alert02Icon} className="mr-1 size-3" />
                  Supera jornada (+{carga.horasAsignadas - carga.jornadaHoras}h)
                </Badge>
              ) : carga.horasAsignadas === carga.jornadaHoras ? (
                <Badge variant="default" className="font-semibold">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} className="mr-1 size-3" />
                  Jornada completa (100%)
                </Badge>
              ) : (
                <Badge variant="outline" className="border-border text-foreground font-semibold">
                  {carga.jornadaHoras - carga.horasAsignadas}h disponibles
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
