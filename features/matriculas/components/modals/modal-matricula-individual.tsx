"use client";

import { Modal } from "@/components/common/modal";
import { UserAdd01Icon } from "@hugeicons/core-free-icons";
import type { Estudiante } from "@/features/estudiantes/types/estudiantes.types";
import { MatriculaIndividualForm } from "../forms/matricula-individual-form";

interface ModalMatriculaIndividualProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anioAcademicoId?: string;
  estudianteInicial?: Estudiante | null;
}

export function ModalMatriculaIndividual({
  open,
  onOpenChange,
  anioAcademicoId,
  estudianteInicial,
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
        estudianteInicial={estudianteInicial}
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
      />
    </Modal>
  );
}
