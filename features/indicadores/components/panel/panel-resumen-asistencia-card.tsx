"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import type { ResumenAsistenciaHoyDto, ResumenTardanzasHoyDto } from "../../types";

export interface PanelResumenAsistenciaCardProps {
  asistencia: ResumenAsistenciaHoyDto;
  tardanzas: ResumenTardanzasHoyDto;
  className?: string;
}

/**
 * Tarjeta de asistencia y tardanzas del día en el colegio para el panel directivo.
 */
export function PanelResumenAsistenciaCard({
  asistencia,
  tardanzas,
  className = "",
}: PanelResumenAsistenciaCardProps) {
  const tieneAlumnos = asistencia.totalEstudiantesMatriculados > 0;

  return (
    <div
      className={`border-border/60 bg-card flex flex-col justify-between rounded-2xl border p-5 shadow-xs ${className}`}
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span
              className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl"
              aria-hidden="true"
            >
              <HugeiconsIcon icon={UserGroupIcon} size={22} strokeWidth={2} />
            </span>
            <div>
              <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Control de asistencia
              </span>
              <h3 className="text-foreground text-base font-semibold">Asistencia al colegio hoy</h3>
            </div>
          </div>

          <Badge
            variant={asistencia.porcentajeAsistencia >= 90 ? "secondary" : "outline"}
            className="text-xs"
          >
            {asistencia.porcentajeAsistenciaTexto}
          </Badge>
        </div>

        {/* Métricas destacadas */}
        <div className="mt-5 grid grid-cols-2 gap-3 border-b pb-4">
          <div>
            <div className="text-foreground text-2xl font-extrabold sm:text-3xl">
              {asistencia.estudiantesConIngreso}
            </div>
            <p className="text-muted-foreground text-xs">
              de {asistencia.totalEstudiantesMatriculados} matriculados
            </p>
          </div>

          <div className="border-border/60 border-l pl-3">
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon
                icon={Clock01Icon}
                size={18}
                className="shrink-0 text-amber-600 dark:text-amber-400"
              />
              <span className="text-foreground text-2xl font-extrabold sm:text-3xl">
                {tardanzas.totalTardanzas}
              </span>
            </div>
            <p className="text-muted-foreground text-xs">tardanzas en puerta hoy</p>
          </div>
        </div>
      </div>

      {/* Barra de progreso visual */}
      <div className="mt-4 space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Efectividad de asistencia</span>
          <span className="text-foreground font-semibold">
            {tieneAlumnos ? asistencia.porcentajeAsistenciaTexto : "Sin alumnos"}
          </span>
        </div>
        <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
          <div
            className="bg-primary h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.max(0, Math.min(100, asistencia.porcentajeAsistencia))}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
