"use client";

import * as React from "react";
import { Modal } from "@/components/common/modal";
import { ComputerIcon } from "@hugeicons/core-free-icons";
import { EquipoForm } from "../forms/equipo-form";
import type { Equipo } from "../../types";
import type { EquipoFormValues } from "../../schemas";

interface EquipoFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipo?: Equipo | null;
  onSubmit: (values: EquipoFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

export function EquipoFormModal({
  open,
  onOpenChange,
  equipo,
  onSubmit,
  isSubmitting = false,
}: EquipoFormModalProps) {
  const isEditing = Boolean(equipo);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? `Editar equipo: ${equipo?.nombre}` : "Registrar nuevo equipo autorizado"}
      description="Configura los terminales kiosko y biométricos habilitados para el colegio."
      icon={ComputerIcon}
      size="2xl"
    >
      <EquipoForm
        initialEquipo={equipo}
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
