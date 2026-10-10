"use client";

import * as React from "react";
import { PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import type { Grado } from "@/features/grados";
import { SeccionForm } from "../forms/seccion-form";
import type { UpdateSeccionFormValues } from "../../schemas";
import type { Seccion } from "../../types";

interface EditSeccionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seccion: Seccion | null;
  grados?: Grado[];
  onSubmit: (values: UpdateSeccionFormValues) => Promise<void>;
  isLoading: boolean;
}

export function EditSeccionModal({
  open,
  onOpenChange,
  seccion,
  grados,
  onSubmit,
  isLoading,
}: EditSeccionModalProps) {
  if (!seccion) return null;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={`Editar sección ${seccion.gradoNombre} "${seccion.nombre}"`}
      description="Modifica los datos del aula, vacantes o reasigna el docente tutor."
      icon={PencilEdit02Icon}
      size="md"
    >
      <SeccionForm
        mode="edit"
        seccion={seccion}
        grados={grados}
        onSubmit={async (values) => {
          await onSubmit(values as UpdateSeccionFormValues);
        }}
        isLoading={isLoading}
        onCancel={() => onOpenChange(false)}
      />
    </Modal>
  );
}
