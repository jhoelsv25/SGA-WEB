"use client";

import { useMemo } from "react";
import { Clock01Icon, AlertCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/status-badge";
import type { ResumenHorasCurso } from "../../types";

interface ModalResumenHorasProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumenHoras: ResumenHorasCurso[];
  advertencias?: string[];
  mensajeVigencia?: string | null;
}

export function ModalResumenHoras({
  open,
  onOpenChange,
  resumenHoras,
  advertencias = [],
  mensajeVigencia,
}: ModalResumenHorasProps) {
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

  const porcentaje = totales.plan > 0 ? Math.round((totales.horario / totales.plan) * 100) : 0;
  const estaCompleto = totales.horario === totales.plan && totales.plan > 0;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Consistencia de Horas vs. Plan de Estudios"
      description="Comparativa de horas semanales planificadas en el horario frente a la malla curricular oficial."
      icon={Clock01Icon}
      size="6xl"
    >
      <div className="space-y-4">
        {/* Tarjeta de Resumen General con Progreso */}
        <div className="border-border/80 bg-muted/30 space-y-3 rounded-2xl border p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-muted-foreground text-xs font-medium">
                Avance de Horas Planificadas
              </span>
              <div className="text-foreground text-xl font-bold">
                {totales.horario} de {totales.plan} horas semanales
              </div>
            </div>
            <StatusBadge tone={estaCompleto ? "success" : "warning"} size="md">
              {estaCompleto
                ? "Cuadrado 100%"
                : `${totales.plan - totales.horario} h pendientes (${porcentaje}%)`}
            </StatusBadge>
          </div>

          <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
            <div
              className={`h-full transition-all duration-300 ${
                estaCompleto ? "bg-emerald-500" : "bg-primary"
              }`}
              style={{ width: `${Math.min(100, porcentaje)}%` }}
            />
          </div>
        </div>

        {/* Mensaje de Vigencia si existe */}
        {mensajeVigencia && (
          <div className="border-info/30 bg-info/12 text-info-text rounded-xl border p-3 text-xs">
            {mensajeVigencia}
          </div>
        )}

        {/* Advertencias de Descuadre */}
        {advertencias.length > 0 && (
          <div className="space-y-2 rounded-xl border border-amber-500/25 bg-amber-500/10 p-3.5 text-xs text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-2 font-semibold">
              <HugeiconsIcon
                icon={AlertCircleIcon}
                className="size-4 shrink-0 text-amber-600 dark:text-amber-400"
              />
              <span>
                {advertencias.length === 1
                  ? "1 curso con horas pendientes frente al plan de estudios:"
                  : `${advertencias.length} cursos con horas pendientes o descuadres:`}
              </span>
            </div>
            <ul className="max-h-36 list-inside list-disc space-y-1 overflow-y-auto pl-1 text-[11px] text-amber-800/90 dark:text-amber-300/90">
              {advertencias.map((adv, idx) => (
                <li key={idx}>{adv}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Grilla de Cursos */}
        <div className="space-y-2">
          <span className="text-foreground text-xs font-semibold">
            Detalle por Asignatura ({resumenHoras.length} cursos)
          </span>
          <div className="grid max-h-72 gap-2 overflow-y-auto p-1 sm:grid-cols-2">
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
                  className="border-border/60 bg-card flex items-center justify-between rounded-xl border p-3 text-xs shadow-2xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-foreground truncate font-medium">{curso.cursoNombre}</p>
                    <p className="text-muted-foreground text-[11px]">
                      {curso.horasHorario} de {curso.horasPlan} horas asignadas
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

        <div className="border-border/40 flex justify-end border-t pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-9 rounded-full px-5 text-xs"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
