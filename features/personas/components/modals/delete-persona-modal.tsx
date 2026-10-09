"use client";

import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { useDeletePersonaMutation } from "../../hooks/use-personas";
import type { Persona } from "../../types/personas.types";

interface DeletePersonaModalProps {
  persona: Persona | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeletePersonaModal({ persona, open, onOpenChange }: DeletePersonaModalProps) {
  const deleteMutation = useDeletePersonaMutation();

  if (!persona) return null;

  const handleConfirm = async () => {
    try {
      await deleteMutation.mutateAsync(persona.id);
      onOpenChange(false);
    } catch {
      // Error manejado en mutation toast
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Eliminar Persona Provisional"
      description={`¿Estás seguro de que deseas eliminar del padrón a "${persona.nombreCompleto}" (${persona.tipoDocumento.toUpperCase()}: ${persona.numeroDocumento})? Esta acción removerá el registro del padrón único escolar.`}
      confirmText="Eliminar persona"
      cancelText="Cancelar"
      variant="danger"
      isLoading={deleteMutation.isPending}
      onConfirm={handleConfirm}
      onCancel={() => onOpenChange(false)}
    />
  );
}
