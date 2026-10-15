"use client";

import * as React from "react";
import { HelpCircleIcon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { FormularioSolicitarRevision } from "../forms/formulario-solicitar-revision";

export interface ModalSolicitarRevisionProps {
  consolidadoId: string;
  bimestreNombre: string;
  abierto: boolean;
  onOpenChange: (abierto: boolean) => void;
}

export function ModalSolicitarRevision({
  consolidadoId,
  bimestreNombre,
  abierto,
  onOpenChange,
}: ModalSolicitarRevisionProps) {
  return (
    <Modal
      open={abierto}
      onOpenChange={onOpenChange}
      title="Solicitar Revisión de Consolidado"
      description="Presente su reconsideración fundamentada sobre las horas o ausencias del bimestre."
      icon={HelpCircleIcon}
      size="md"
    >
      <FormularioSolicitarRevision
        key={consolidadoId}
        consolidadoId={consolidadoId}
        bimestreNombre={bimestreNombre}
        onCerrar={() => onOpenChange(false)}
      />
    </Modal>
  );
}
