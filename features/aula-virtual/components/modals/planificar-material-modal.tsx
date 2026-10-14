"use client";

import * as React from "react";
import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { PlanificarMaterialForm } from "../forms/planificar-material-form";
import type { BloqueCurso } from "../../types";

interface PlanificarMaterialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unidadId: string;
  bloques: BloqueCurso[];
}

export function PlanificarMaterialModal({
  open,
  onOpenChange,
  unidadId,
  bloques,
}: PlanificarMaterialModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Planificar material"
      description="Compromete un material de reforzamiento con su fecha. Cuenta en el IGM."
      icon={Calendar03Icon}
      size="md"
    >
      {open && (
        <PlanificarMaterialForm
          key={unidadId}
          unidadId={unidadId}
          bloques={bloques}
          onCancel={() => onOpenChange(false)}
          onSuccess={() => onOpenChange(false)}
        />
      )}
    </Modal>
  );
}
