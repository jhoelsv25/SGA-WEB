"use client";

import { AlertCircleIcon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { CrearIncidenciaForm } from "../forms/crear-incidencia-form";

export interface ModalCrearIncidenciaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMatriculaId?: string;
}

export function ModalCrearIncidencia({
  open,
  onOpenChange,
  defaultMatriculaId,
}: ModalCrearIncidenciaProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Registro de Incidencia Escolar"
      description="Registre una falta al reglamento o un mérito formativo para el estudiante."
      icon={AlertCircleIcon}
      size="lg"
    >
      {open && (
        <CrearIncidenciaForm
          defaultMatriculaId={defaultMatriculaId}
          onCancel={() => onOpenChange(false)}
          onSuccess={() => onOpenChange(false)}
        />
      )}
    </Modal>
  );
}
