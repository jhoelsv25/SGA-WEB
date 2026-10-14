"use client";

import * as React from "react";
import { Edit02Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import type { AusenciaResponseDto } from "@/features/ausencias-docente/types";
import { FormularioCorregirAusencia } from "./formulario-corregir-ausencia";

interface ModalCorregirAusenciaProps {
  ausencia: AusenciaResponseDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal contenedor para corregir los datos de una ausencia docente registrada (RF-012 HU2).
 */
export function ModalCorregirAusencia({
  ausencia,
  open,
  onOpenChange,
}: ModalCorregirAusenciaProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Corregir ausencia docente"
      description="Modifique los datos de la ausencia. La corrección generará una nueva versión con trazabilidad."
      icon={Edit02Icon}
      size="lg"
    >
      {ausencia ? (
        <FormularioCorregirAusencia ausencia={ausencia} onCerrar={() => onOpenChange(false)} />
      ) : null}
    </Modal>
  );
}
