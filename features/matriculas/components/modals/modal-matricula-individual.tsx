"use client";

import { Modal } from "@/components/common/modal";
import { UserAdd01Icon } from "@hugeicons/core-free-icons";
import { MatriculaIndividualForm } from "../forms/matricula-individual-form";

interface ModalMatriculaIndividualProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anioAcademicoId?: string;
}

export function ModalMatriculaIndividual({
  open,
  onOpenChange,
  anioAcademicoId,
}: ModalMatriculaIndividualProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Matricular Estudiante"
      description="Registra la matrícula de un estudiante activo asignándolo a un grado y sección con vacantes."
      icon={UserAdd01Icon}
      size="lg"
    >
      <MatriculaIndividualForm
        anioAcademicoId={anioAcademicoId}
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
      />
    </Modal>
  );
}
