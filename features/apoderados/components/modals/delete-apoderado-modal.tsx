"use client";

import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { useDeleteApoderadoMutation } from "../../hooks/use-apoderados";
import type { Apoderado } from "../../types/apoderados.types";

interface DeleteApoderadoModalProps {
  apoderado: Apoderado | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteApoderadoModal({ apoderado, open, onOpenChange }: DeleteApoderadoModalProps) {
  const deleteMutation = useDeleteApoderadoMutation();

  if (!apoderado) return null;

  const handleConfirm = async () => {
    try {
      await deleteMutation.mutateAsync(apoderado.id);
      onOpenChange(false);
    } catch {
      // Error manejado en mutation toast
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Eliminar Ficha de Apoderado"
      description={`¿Estás seguro de que deseas dar de baja la ficha de apoderado de "${apoderado.persona.nombreCompleto}"? La persona continuará existiendo en el padrón único.`}
      confirmText="Eliminar ficha"
      cancelText="Cancelar"
      variant="danger"
      isLoading={deleteMutation.isPending}
      onConfirm={handleConfirm}
      onCancel={() => onOpenChange(false)}
    />
  );
}
