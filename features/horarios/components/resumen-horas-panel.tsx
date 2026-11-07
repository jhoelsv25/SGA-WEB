"use client";

import { useMemo, useState } from "react";
import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/status-badge";
import type { ResumenHorasCurso } from "../types";

interface ResumenHorasPanelProps {
  resumenHoras: ResumenHorasCurso[];
}

export function ResumenHorasPanel({ resumenHoras }: ResumenHorasPanelProps) {
  const [colapsado, setColapsado] = useState(false);

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

  const porcentaje = totales.plan > 0 ? Math.round((totales.horario / totales.plan) * 100) : 0;
  const estaCompleto = totales.horario === totales.plan && totales.plan > 0;

  return (
    <div className="border-border/80 bg-card rounded-xl border p-4 shadow-sm transition-all">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-foreground text-sm font-semibold">Horas vs. Plan de estudios</h3>
            <StatusBadge tone={estaCompleto ? "success" : "warning"} size="sm">
              {estaCompleto
                ? "Cuadrado 100%"
                : `${totales.horario} de ${totales.plan} h (${porcentaje}%)`}
            </StatusBadge>
          </div>
          <p className="text-muted-foreground text-xs">
            Comparativa de horas semanales planificadas frente a la malla curricular de la sección
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setColapsado(!colapsado)}
          className="text-muted-foreground hover:text-foreground h-7 gap-1 px-2.5 text-xs"
        >
          <span>
            {colapsado ? `Mostrar asignaturas (${resumenHoras.length})` : "Ocultar panel"}
          </span>
          <HugeiconsIcon icon={colapsado ? ArrowDown01Icon : ArrowUp01Icon} className="size-3.5" />
        </Button>
      </div>

      {/* Barra de progreso visual */}
      <div className="bg-muted/60 mt-2.5 h-1.5 w-full overflow-hidden rounded-full">
        <div
          className={`h-full transition-all duration-300 ${
            estaCompleto ? "bg-emerald-500" : "bg-primary"
          }`}
          style={{ width: `${Math.min(100, porcentaje)}%` }}
        />
      </div>

      {!colapsado && (
        <div className="mt-3.5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
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
                className="border-border/60 bg-muted/20 hover:bg-muted/40 flex items-center justify-between rounded-lg border p-2.5 text-xs transition-colors"
              >
                <div className="min-w-0 pr-2">
                  <p className="text-foreground truncate font-medium">{curso.cursoNombre}</p>
                  <p className="text-muted-foreground text-[11px]">
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
      )}
    </div>
  );
}
