"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/common/spinner";

export interface SeccionCargaActionsProps {
  cursoSeccionId: string;
  cursoNombre: string;
  valorSeleccionado: string;
  docenteOriginalId: string;
  isSaving: boolean;
  onGuardar: (cursoSeccionId: string, docenteId: string | null) => void;
}

export function SeccionCargaActions({
  cursoSeccionId,
  cursoNombre,
  valorSeleccionado,
  docenteOriginalId,
  isSaving,
  onGuardar,
}: SeccionCargaActionsProps) {
  const tieneCambios = valorSeleccionado !== docenteOriginalId;

  return (
    <Button
      type="button"
      size="sm"
      disabled={!tieneCambios || isSaving}
      aria-label={`Guardar docente para ${cursoNombre}`}
      onClick={() => {
        const nuevoDocenteId = valorSeleccionado === "" ? null : valorSeleccionado;
        onGuardar(cursoSeccionId, nuevoDocenteId);
      }}
      className="min-h-11 min-w-24 rounded-full px-4 text-xs font-semibold sm:min-h-9"
    >
      {isSaving ? (
        <>
          <Spinner className="mr-1 size-3.5" />
          <span>Guardando...</span>
        </>
      ) : (
        <>
          <HugeiconsIcon icon={CheckmarkCircle02Icon} className="mr-1 size-3.5" />
          <span>Guardar</span>
        </>
      )}
    </Button>
  );
}
