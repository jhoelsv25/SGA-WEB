"use client";

import * as React from "react";
import { Modal } from "@/components/common/modal";
import { Clock01Icon } from "@hugeicons/core-free-icons";
import { TurnoForm } from "../forms/turno-form";
import type { Turno } from "../../types";
import type { TurnoFormValues } from "../../schemas";

interface TurnoEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  turno?: Turno | null;
  onSubmit: (values: TurnoFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

export function TurnoEditModal({
  open,
  onOpenChange,
  turno,
  onSubmit,
  isSubmitting = false,
}: TurnoEditModalProps) {
  const isEditing = Boolean(turno);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? `Configurar turno: ${turno?.tipoPersona}` : "Nuevo turno escolar"}
      description="Establece los horarios oficiales, ventanas de marcación y tolerancia reglamentaria."
      icon={Clock01Icon}
      size="2xl"
    >
      <TurnoForm
        initialTurno={turno}
        onSubmit={async (values) => {
          await onSubmit(values);
          onOpenChange(false);
        }}
        onCancel={() => onOpenChange(false)}
        isSubmitting={isSubmitting}
      />
    </Modal>
  );
}
