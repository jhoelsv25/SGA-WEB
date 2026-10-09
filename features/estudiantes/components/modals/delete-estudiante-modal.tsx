"use client";

import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { useDeleteEstudianteMutation } from "../../hooks/use-estudiantes";
import type { Estudiante } from "../../types/estudiantes.types";

interface DeleteEstudianteModalProps {
  estudiante: Estudiante | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteEstudianteModal({
  estudiante,
  open,
  onOpenChange,
}: DeleteEstudianteModalProps) {
  const deleteMutation = useDeleteEstudianteMutation();

  if (!estudiante) return null;

  const handleConfirm = async () => {
    try {
      await deleteMutation.mutateAsync(estudiante.id);
      onOpenChange(false);
    } catch {
      // Error manejado en mutation toast
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Eliminar Ficha de Estudiante"
      description={`¿Estás seguro de que deseas eliminar la ficha de "${estudiante.persona.nombreCompleto}" (SIAGIE: ${estudiante.codigo})? La ficha quedará archivada en el padrón escolar.`}
      confirmText="Eliminar ficha"
      cancelText="Cancelar"
      variant="danger"
      isLoading={deleteMutation.isPending}
      onConfirm={handleConfirm}
      onCancel={() => onOpenChange(false)}
    />
  );
}
