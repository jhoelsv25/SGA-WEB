"use client";

import * as React from "react";
import { Note01Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { CrearObservacionForm } from "../forms/crear-observacion-form";

export interface ModalCrearObservacionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMatriculaId?: string;
}

export function ModalCrearObservacion({
  open,
  onOpenChange,
  defaultMatriculaId,
}: ModalCrearObservacionProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Nueva Observación Formativa / Tutorial"
      description="Registre acompañamiento pedagógico, socioemocional o acuerdos con la familia."
      icon={Note01Icon}
      size="lg"
    >
      {open && (
        <CrearObservacionForm
          defaultMatriculaId={defaultMatriculaId}
          onCancel={() => onOpenChange(false)}
          onSuccess={() => onOpenChange(false)}
        />
      )}
    </Modal>
  );
}
