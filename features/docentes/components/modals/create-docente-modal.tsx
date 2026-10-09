"use client";

import { Modal } from "@/components/common/modal";
import { UserAdd01Icon } from "@hugeicons/core-free-icons";
import { CreateDocenteForm } from "../forms/create-docente-form";
import { useCreateDocenteMutation } from "../../hooks/use-docentes";
import type { CreateDocenteInput, CreateDocenteResponse } from "../../types/docentes.types";

interface CreateDocenteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreatedSuccess?: (data: CreateDocenteResponse) => void;
}

export function CreateDocenteModal({
  open,
  onOpenChange,
  onCreatedSuccess,
}: CreateDocenteModalProps) {
  const createMutation = useCreateDocenteMutation((data) => {
    onOpenChange(false);
    onCreatedSuccess?.(data);
  });

  const handleSubmit = async (input: CreateDocenteInput) => {
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
      title="Registrar Docente"
      description="Crea la ficha docente, vincula o registra la persona y emite sus credenciales automáticas."
      icon={UserAdd01Icon}
      size="2xl"
    >
      <CreateDocenteForm
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
        onCancel={() => onOpenChange(false)}
      />
    </Modal>
  );
}
