"use client";

import { Clock01Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { ProponerGrillaForm } from "../forms/proponer-grilla-form";

interface ProponerGrillaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProponer: (horaEntrada?: string) => void;
  isLoading?: boolean;
}

export function ProponerGrillaModal({
  open,
  onOpenChange,
  onProponer,
  isLoading = false,
}: ProponerGrillaModalProps) {
  const handleSubmit = (horaEntrada?: string) => {
    onProponer(horaEntrada);
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Generar Horas de Clase y Recreos"
      description="Calcula automáticamente los bloques de clase (horas pedagógicas) y recreos de lunes a viernes según el turno escolar."
      icon={Clock01Icon}
      size="md"
    >
      {open ? (
        <ProponerGrillaForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
        />
      ) : null}
    </Modal>
  );
}
