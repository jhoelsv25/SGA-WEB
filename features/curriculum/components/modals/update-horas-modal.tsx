"use client";

import * as React from "react";
import { Clock01Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { UpdateHorasForm } from "../forms/update-horas-form";
import type { PlanEstudioItem } from "../../types";
import type { UpdateHorasPlanFormValues } from "../../schemas";

interface UpdateHorasModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: PlanEstudioItem | null;
  onSubmit: (values: UpdateHorasPlanFormValues) => Promise<void>;
  isLoading: boolean;
}

export function UpdateHorasModal({
  open,
  onOpenChange,
  item,
  onSubmit,
  isLoading,
}: UpdateHorasModalProps) {
  if (!item) return null;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Ajustar Horas Semanales"
      description="Modifica la carga horaria pedagógica asignada a este curso."
      icon={Clock01Icon}
      size="sm"
    >
      <UpdateHorasForm
        key={item.id}
        item={item}
        onSubmit={onSubmit}
        isLoading={isLoading}
        onCancel={() => onOpenChange(false)}
      />
    </Modal>
  );
}
