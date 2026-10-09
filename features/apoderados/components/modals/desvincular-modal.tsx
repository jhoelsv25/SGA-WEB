"use client";

import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { useDesvincularEstudianteMutation } from "../../hooks/use-apoderados";

interface DesvincularModalProps {
  estudianteId: string;
  apoderadoId: string;
  estudianteNombre?: string;
  apoderadoNombre?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DesvincularModal({
  estudianteId,
  apoderadoId,
  estudianteNombre,
  apoderadoNombre,
  open,
  onOpenChange,
}: DesvincularModalProps) {
  const desvincularMutation = useDesvincularEstudianteMutation();

  const handleConfirm = async () => {
    try {
      await desvincularMutation.mutateAsync({ estudianteId, apoderadoId });
      onOpenChange(false);
    } catch {
      // Error manejado en mutation toast
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Retirar Vínculo Familiar"
      description={`¿Estás seguro de que deseas desvincular a "${apoderadoNombre || "este apoderado"}" del estudiante "${estudianteNombre || "este estudiante"}"? Ni la persona ni la ficha de apoderado serán eliminadas del padrón.`}
      confirmText="Retirar vínculo"
      cancelText="Cancelar"
      variant="warning"
      isLoading={desvincularMutation.isPending}
      onConfirm={handleConfirm}
      onCancel={() => onOpenChange(false)}
    />
  );
}
