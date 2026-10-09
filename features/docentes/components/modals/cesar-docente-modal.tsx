"use client";

import { Modal } from "@/components/common/modal";
import { UserRemove01Icon } from "@hugeicons/core-free-icons";
import { CesarDocenteForm } from "../forms/cesar-docente-form";
import { useCesarDocenteMutation } from "../../hooks/use-docentes";
import type { Docente } from "../../types/docentes.types";
import type { CesarDocenteFormValues } from "../../schemas/docentes.schema";

interface CesarDocenteModalProps {
  docente: Docente | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CesarDocenteModal({ docente, open, onOpenChange }: CesarDocenteModalProps) {
  const cesarMutation = useCesarDocenteMutation();

  if (!docente) return null;

  const handleSubmit = async (values: CesarDocenteFormValues) => {
    try {
      await cesarMutation.mutateAsync({
        id: docente.id,
        input: {
          fechaCese: values.fechaCese,
          motivo: values.motivo?.trim() || undefined,
        },
      });
      onOpenChange(false);
    } catch {
      // Error manejado en mutation toast
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Registrar Cese de Docente"
      description="Concluye las labores del docente y actualiza sus accesos según RF-007."
      icon={UserRemove01Icon}
      size="md"
    >
      <CesarDocenteForm
        docente={docente}
        onSubmit={handleSubmit}
        isLoading={cesarMutation.isPending}
        onCancel={() => onOpenChange(false)}
      />
    </Modal>
  );
}
