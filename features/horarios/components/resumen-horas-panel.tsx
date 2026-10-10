"use client";

import { useMemo } from "react";
import { StatusBadge } from "@/components/common/status-badge";
import type { ResumenHorasCurso } from "../types";

interface ResumenHorasPanelProps {
  resumenHoras: ResumenHorasCurso[];
}

export function ResumenHorasPanel({ resumenHoras }: ResumenHorasPanelProps) {
  const totales = useMemo(() => {
    return resumenHoras.reduce(
      (acc, item) => {
        acc.horario += item.horasHorario;
        acc.plan += item.horasPlan;
        return acc;
      },
      { horario: 0, plan: 0 },
    );
  }, [resumenHoras]);

  if (resumenHoras.length === 0) return null;

  return (
    <div className="border-border/80 bg-card rounded-xl border p-4 shadow-sm">
      <div className="border-border/60 flex items-center justify-between border-b pb-2.5">
        <div>
          <h3 className="text-foreground text-sm font-semibold">Horas vs. Plan de estudios</h3>
          <p className="text-muted-foreground text-xs">
            Comparativa de horas semanales planificadas frente a la malla curricular
          </p>
        </div>
        <div className="text-right">
          <span className="text-foreground text-xs font-semibold">
            Total: {totales.horario} / {totales.plan} h
          </span>
        </div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {resumenHoras.map((curso) => {
          const diferencia = curso.horasHorario - curso.horasPlan;
          let tone: "success" | "warning" | "danger" = "success";
          let estadoTexto = "Completo";

          if (diferencia < 0) {
            tone = "warning";
            estadoTexto = `Falta ${Math.abs(diferencia)} h`;
          } else if (diferencia > 0) {
            tone = "danger";
            estadoTexto = `Exceso +${diferencia} h`;
          }

          return (
            <div
              key={curso.cursoId}
              className="border-border/60 bg-muted/20 flex items-center justify-between rounded-lg border p-2.5 text-xs"
            >
              <div className="min-w-0 pr-2">
                <p className="text-foreground truncate font-medium">{curso.cursoNombre}</p>
                <p className="text-muted-foreground">
                  {curso.horasHorario} de {curso.horasPlan} horas
                </p>
              </div>
              <StatusBadge tone={tone} size="sm">
                {estadoTexto}
              </StatusBadge>
            </div>
          );
        })}
      </div>
    </div>
  );
}
