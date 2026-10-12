"use client";

import { Modal } from "@/components/common/modal";
import { IdVerifiedIcon } from "@hugeicons/core-free-icons";
import { ChangeCargoForm, type ChangeCargoFormValues } from "../forms/change-cargo-form";
import { useChangeCargoMutation } from "../../hooks/use-personas";
import type { Persona } from "../../types/personas.types";

interface ChangeCargoModalProps {
  persona: Persona | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangeCargoModal({ persona, open, onOpenChange }: ChangeCargoModalProps) {
  const mutation = useChangeCargoMutation();

  if (!persona) return null;

  const handleSubmit = async (values: ChangeCargoFormValues) => {
    await mutation.mutateAsync({
      id: persona.id,
      input: {
        cargoId: values.cargoId,
        fechaInicio: values.fechaInicio || undefined,
      },
    });
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Cambiar cargo de la persona"
      description="El cargo anterior termina y queda en el historial laboral; el nuevo cargo solo sugiere roles, no los asigna."
      icon={IdVerifiedIcon}
      size="md"
    >
      <ChangeCargoForm
        persona={persona}
        onSubmit={handleSubmit}
        isLoading={mutation.isPending}
        onCancel={() => onOpenChange(false)}
      />
    </Modal>
  );
}
