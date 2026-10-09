"use client";

import { Clock01Icon, Copy01Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";

interface HorariosHeaderActionsProps {
  puedeGestionar: boolean;
  seccionId: string | null;
  seccionesMismoGradoCount: number;
  isLoadingPropuesta: boolean;
  onProponerGrilla: () => void;
  onCopiarHorario: () => void;
  onNuevoBloque: () => void;
}

export function HorariosHeaderActions({
  puedeGestionar,
  seccionId,
  seccionesMismoGradoCount,
  isLoadingPropuesta,
  onProponerGrilla,
  onCopiarHorario,
  onNuevoBloque,
}: HorariosHeaderActionsProps) {
  if (!puedeGestionar || !seccionId) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onProponerGrilla}
        disabled={isLoadingPropuesta}
        className="h-11 min-h-11 min-w-11 gap-1.5 rounded-full px-4 text-xs font-semibold"
      >
        <HugeiconsIcon icon={Clock01Icon} className="size-3.5" />
        <span>Proponer grilla</span>
      </Button>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onCopiarHorario}
        disabled={seccionesMismoGradoCount === 0}
        className="h-11 min-h-11 min-w-11 gap-1.5 rounded-full px-4 text-xs font-semibold"
      >
        <HugeiconsIcon icon={Copy01Icon} className="size-3.5" />
        <span>Copiar horario</span>
      </Button>

      <Button
        type="button"
        size="sm"
        onClick={onNuevoBloque}
        className="shadow-primary/20 h-11 min-h-11 min-w-11 gap-1.5 rounded-full px-4 text-xs font-semibold shadow-md"
      >
        <HugeiconsIcon icon={PlusSignIcon} className="size-3.5" />
        <span>Nuevo bloque</span>
      </Button>
    </div>
  );
}
