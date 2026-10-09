"use client";

import * as React from "react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import type { Grado } from "@/features/grados";
import { SeccionForm } from "../forms/seccion-form";
import type { CreateSeccionFormValues } from "../../schemas";

interface CreateSeccionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  grados?: Grado[];
  defaultGradoId?: string;
  onSubmit: (values: CreateSeccionFormValues) => Promise<void>;
  isLoading: boolean;
}

export function CreateSeccionModal({
  open,
  onOpenChange,
  grados,
  defaultGradoId,
  onSubmit,
  isLoading,
}: CreateSeccionModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Crear nueva sección"
      description="Registra una sección para el año académico y genera automáticamente su carga académica."
      icon={PlusSignIcon}
      size="md"
    >
      <SeccionForm
        mode="create"
        grados={grados}
        defaultGradoId={defaultGradoId}
        onSubmit={async (values) => {
          await onSubmit(values as CreateSeccionFormValues);
        }}
        isLoading={isLoading}
        onCancel={() => onOpenChange(false)}
      />
    </Modal>
  );
}
