"use client";

import { Clock01Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { ProponerIaForm, type ProponerIaValores } from "../forms/proponer-ia-form";

interface ProponerIaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProponer: (valores: ProponerIaValores) => void;
  isLoading?: boolean;
}

export function ProponerIaModal({
  open,
  onOpenChange,
  onProponer,
  isLoading = false,
}: ProponerIaModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={(siguiente) => {
        if (isLoading) return;
        onOpenChange(siguiente);
      }}
      title="Proponer horario con IA"
      description="Indica la hora de entrada y, si quieres, cómo prefieres repartir los cursos."
      icon={Clock01Icon}
      size="md"
    >
      {open ? (
        <ProponerIaForm
          onSubmit={onProponer}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      ) : null}
    </Modal>
  );
}
