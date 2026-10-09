"use client";

import { Modal } from "@/components/common/modal";
import { Edit02Icon } from "@hugeicons/core-free-icons";
import { EditVariableForm } from "../forms/edit-variable-form";
import { cleanDescription } from "../../utils";
import type { VariableSistema } from "../../types";

interface EditVariableModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variable: VariableSistema | null;
  onSubmit: (codigo: string, valor: string, motivoCambio: string) => Promise<void>;
  isSubmitting?: boolean;
}

export function EditVariableModal({
  open,
  onOpenChange,
  variable,
  onSubmit,
  isSubmitting = false,
}: EditVariableModalProps) {
  if (!variable) return null;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Modificar variable del sistema"
      description={`Actualiza el valor de «${cleanDescription(variable.descripcion)}» (${variable.codigo}).`}
      icon={Edit02Icon}
      size="md"
    >
      <EditVariableForm
        key={variable.codigo}
        variable={variable}
        onCancel={() => onOpenChange(false)}
        onSubmit={onSubmit}
        isLoading={isSubmitting}
      />
    </Modal>
  );
}
