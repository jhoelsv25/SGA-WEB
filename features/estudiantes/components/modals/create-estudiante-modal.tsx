"use client";

import { Modal } from "@/components/common/modal";
import { StudentIcon } from "@hugeicons/core-free-icons";
import { CreateEstudianteForm } from "../forms/create-estudiante-form";
import { useCreateEstudianteMutation } from "../../hooks/use-estudiantes";
import type {
  CreateEstudianteInput,
  CreateEstudianteResponse,
} from "../../types/estudiantes.types";

interface CreateEstudianteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreatedSuccess?: (data: CreateEstudianteResponse) => void;
}

export function CreateEstudianteModal({
  open,
  onOpenChange,
  onCreatedSuccess,
}: CreateEstudianteModalProps) {
  const createMutation = useCreateEstudianteMutation((data) => {
    onOpenChange(false);
    onCreatedSuccess?.(data);
  });

  const handleSubmit = async (input: CreateEstudianteInput) => {
    try {
      await createMutation.mutateAsync(input);
    } catch {
      // Error manejado en mutation toast
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Registrar Estudiante"
      description="Crea la ficha escolar, vincula o registra la persona y emite sus credenciales automáticas según RF-007."
      icon={StudentIcon}
      size="2xl"
    >
      <CreateEstudianteForm
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
        onCancel={() => onOpenChange(false)}
      />
    </Modal>
  );
}
