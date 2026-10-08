"use client";

import * as React from "react";
import { Copy01Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import type { Grado } from "@/features/grados";
import { CopyPlanForm } from "../forms/copy-plan-form";
import type { CopyPlanFormValues } from "../../schemas";

interface CopyPlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentGrado?: Grado | null;
  allGrados: Grado[];
  onSubmit: (values: CopyPlanFormValues) => Promise<void>;
  isLoading: boolean;
}

export function CopyPlanModal({
  open,
  onOpenChange,
  currentGrado,
  allGrados,
  onSubmit,
  isLoading,
}: CopyPlanModalProps) {
  if (!currentGrado) return null;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={`Copiar Plan a ${currentGrado.nombre}`}
      description="Duplica la estructura curricular de otro grado para no comenzar desde cero."
      icon={Copy01Icon}
      size="md"
    >
      <CopyPlanForm
        key={currentGrado.id}
        currentGrado={currentGrado}
        allGrados={allGrados}
        onSubmit={onSubmit}
        isLoading={isLoading}
        onCancel={() => onOpenChange(false)}
      />
    </Modal>
  );
}
