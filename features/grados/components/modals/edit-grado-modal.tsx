"use client";

import { School01Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { EditGradoForm } from "../forms/edit-grado-form";
import type { Grado } from "../../types";
import type { UpdateGradoFormValues } from "../../schemas";

interface EditGradoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  grado: Grado | null;
  onSubmit: (values: UpdateGradoFormValues) => void;
  isLoading?: boolean;
}

export function EditGradoModal({
  open,
  onOpenChange,
  grado,
  onSubmit,
  isLoading,
}: EditGradoModalProps) {
  if (!grado) return null;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Editar nombre de grado"
      description="Personaliza el nombre oficial con el que se mostrará este grado en reportes y asignaciones."
      icon={School01Icon}
      size="md"
    >
      <EditGradoForm
        grado={grado}
        onSubmit={onSubmit}
        onCancel={() => onOpenChange(false)}
        isLoading={isLoading}
      />
    </Modal>
  );
}
