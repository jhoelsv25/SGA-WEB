"use client";

import { Clock01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";

interface GrillaEmptyStateProps {
  puedeGestionar: boolean;
  onProponerGrilla?: () => void;
}

export function GrillaEmptyState({ puedeGestionar, onProponerGrilla }: GrillaEmptyStateProps) {
  return (
    <div className="border-border/80 bg-card rounded-xl border border-dashed p-6 shadow-sm">
      <EmptyState
        title="Sin bloques de horario registrados"
        description="Esta sección escolar no tiene horas de clase planificadas todavía. Haz clic en 'Generar horario base' para crear automáticamente los bloques de clase y recreos de la semana, o utiliza 'Nuevo bloque' para agregar una hora manualmente."
        icon={Clock01Icon}
        action={
          puedeGestionar && onProponerGrilla ? (
            <Button
              type="button"
              onClick={onProponerGrilla}
              className="h-11 min-h-11 min-w-11 gap-2 rounded-full px-5 text-xs font-semibold shadow-md"
            >
              <HugeiconsIcon icon={Clock01Icon} className="size-4" />
              <span>Generar horario base semanal</span>
            </Button>
          ) : undefined
        }
      />
    </div>
  );
}
