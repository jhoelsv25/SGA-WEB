"use client";

import { Clock01Icon, Copy01Icon, PlusSignIcon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";

interface HorariosHeaderActionsProps {
  puedeGestionar: boolean;
  seccionId: string | null;
  seccionesMismoGradoCount: number;
  isLoadingPropuesta: boolean;
  grillaPropuestaActiva?: boolean;
  onProponerGrilla: () => void;
  onDescartarPropuesta?: () => void;
  onCopiarHorario: () => void;
  onNuevoBloque: () => void;
}

export function HorariosHeaderActions({
  puedeGestionar,
  seccionId,
  seccionesMismoGradoCount,
  isLoadingPropuesta,
  grillaPropuestaActiva = false,
  onProponerGrilla,
  onDescartarPropuesta,
  onCopiarHorario,
  onNuevoBloque,
}: HorariosHeaderActionsProps) {
  if (!puedeGestionar || !seccionId) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {grillaPropuestaActiva ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onDescartarPropuesta}
          className="text-destructive border-destructive/30 hover:bg-destructive/10 h-11 min-h-11 min-w-11 gap-1.5 rounded-full px-4 text-xs font-semibold"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
          <span>Descartar propuesta</span>
        </Button>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onProponerGrilla}
          disabled={isLoadingPropuesta}
          className="h-11 min-h-11 min-w-11 gap-1.5 rounded-full px-4 text-xs font-semibold"
        >
          <HugeiconsIcon icon={Clock01Icon} className="size-3.5" />
          <span>Generar horario base</span>
        </Button>
      )}

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
        className="shadow-primary/20 h-11 min-h-11 min-w-11 gap-1.5 rounded-full px-5 text-xs font-semibold shadow-md"
      >
        <HugeiconsIcon icon={PlusSignIcon} className="size-3.5" />
        <span>Nuevo bloque</span>
      </Button>
    </div>
  );
}
