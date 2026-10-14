"use client";

import * as React from "react";
import { AlertCircleIcon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { AnularIncidenciaForm } from "../forms/anular-incidencia-form";
import type { IncidenciaItem } from "../../types";

export interface ModalAnularIncidenciaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incidencia: IncidenciaItem | null;
}

export function ModalAnularIncidencia({
  open,
  onOpenChange,
  incidencia,
}: ModalAnularIncidenciaProps) {
  if (!incidencia) return null;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Anular Registro de Incidencia"
      description="Esta acción dará de baja la incidencia y se registrará un evento inmutable en la bitácora de auditoría del sistema."
      icon={AlertCircleIcon}
      size="md"
    >
      <AnularIncidenciaForm
        key={incidencia.id}
        incidencia={incidencia}
        onCancel={() => onOpenChange(false)}
        onSuccess={() => onOpenChange(false)}
      />
    </Modal>
  );
}
