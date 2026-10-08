"use client";

import { RefreshIcon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { useReabrirAnioMutation } from "../../hooks";
import { ReabrirForm } from "../forms/reabrir-form";

interface ReabrirAnioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anioId: string | null;
}

export function ReabrirAnioModal({ open, onOpenChange, anioId }: ReabrirAnioModalProps) {
  const reabrir = useReabrirAnioMutation();

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Reabrir año cerrado"
      description="Indica el motivo y la fecha límite. Al día siguiente el año vuelve a cerrado."
      icon={RefreshIcon}
      size="md"
    >
      {anioId ? (
        <ReabrirForm
          key={anioId}
          isSubmitting={reabrir.isPending}
          onCancel={() => onOpenChange(false)}
          onSubmit={async (values) => {
            await reabrir.mutateAsync({ id: anioId, payload: values });
            onOpenChange(false);
          }}
        />
      ) : null}
    </Modal>
  );
}
