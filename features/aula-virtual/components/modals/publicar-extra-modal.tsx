"use client";

import * as React from "react";
import { FileAddIcon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { PublicarExtraForm } from "../forms/publicar-extra-form";

interface PublicarExtraModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unidadId: string;
  tamanoMaximoMb: number;
}

export function PublicarExtraModal({
  open,
  onOpenChange,
  unidadId,
  tamanoMaximoMb,
}: PublicarExtraModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Publicar material extra"
      description="Se ve igual que los demás, pero no cuenta en el IGM."
      icon={FileAddIcon}
      size="md"
    >
      {open && (
        <PublicarExtraForm
          key={unidadId}
          unidadId={unidadId}
          tamanoMaximoMb={tamanoMaximoMb}
          onCancel={() => onOpenChange(false)}
          onSuccess={() => onOpenChange(false)}
        />
      )}
    </Modal>
  );
}
