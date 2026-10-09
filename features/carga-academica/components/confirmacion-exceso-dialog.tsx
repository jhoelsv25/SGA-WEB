"use client";

import * as React from "react";
import { ConfirmDialog } from "@/components/common/confirm-dialog";

export interface ConfirmacionExcesoEstado {
  open: boolean;
  cursoSeccionId: string;
  docenteId: string | null;
  mensaje: string;
}

export interface ConfirmacionExcesoDialogProps {
  confirmacion: ConfirmacionExcesoEstado | null;
  onClose: () => void;
  onConfirm: (cursoSeccionId: string, docenteId: string | null) => Promise<void>;
  isLoading: boolean;
}

export function ConfirmacionExcesoDialog({
  confirmacion,
  onClose,
  onConfirm,
  isLoading,
}: ConfirmacionExcesoDialogProps) {
  if (!confirmacion) return null;

  return (
    <ConfirmDialog
      open={confirmacion.open}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      variant="warning"
      title="Exceso de carga horaria"
      description={confirmacion.mensaje}
      confirmText="Confirmar asignación"
      cancelText="Cancelar"
      isLoading={isLoading}
      onConfirm={async () => {
        await onConfirm(confirmacion.cursoSeccionId, confirmacion.docenteId);
        onClose();
      }}
      onCancel={onClose}
    />
  );
}
