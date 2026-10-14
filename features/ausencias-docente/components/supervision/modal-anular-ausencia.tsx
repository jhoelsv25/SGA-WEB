"use client";

import * as React from "react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import type { AusenciaResponseDto } from "@/features/ausencias-docente/types";
import { FormularioAnularAusencia } from "./formulario-anular-ausencia";

interface ModalAnularAusenciaProps {
  ausencia: AusenciaResponseDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal contenedor para anular una ausencia docente indicando el motivo obligatorio (RF-012 HU2).
 */
export function ModalAnularAusencia({ ausencia, open, onOpenChange }: ModalAnularAusenciaProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Anular ausencia docente"
      description="Esta acción marcará la ausencia como anulada y dejará de sumar minutos en los reportes."
      icon={Cancel01Icon}
      size="md"
    >
      {ausencia ? (
        <FormularioAnularAusencia ausencia={ausencia} onCerrar={() => onOpenChange(false)} />
      ) : null}
    </Modal>
  );
}
