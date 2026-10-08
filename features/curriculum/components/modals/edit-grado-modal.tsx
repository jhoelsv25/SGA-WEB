"use client";

import * as React from "react";
import { School01Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { EditGradoForm } from "../forms/edit-grado-form";
import type { Grado } from "../../types";
import type { UpdateGradoFormValues } from "../../schemas";

interface EditGradoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  grado?: Grado | null;
  onSubmit: (values: UpdateGradoFormValues) => Promise<void>;
  isLoading: boolean;
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
      title={`Editar Nombre de ${grado.numero}.° Grado`}
      description="Personaliza cómo se muestra el grado en todas las pantallas del sistema."
      icon={School01Icon}
      size="sm"
    >
      <EditGradoForm
        key={grado.id}
        grado={grado}
        onSubmit={onSubmit}
        isLoading={isLoading}
        onCancel={() => onOpenChange(false)}
      />
    </Modal>
  );
}
