"use client";

import * as React from "react";
import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { PlanificarMaterialForm } from "../forms/planificar-material-form";
import type { BloqueCurso, Material } from "../../types";

interface PlanificarMaterialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unidadId: string;
  bloques: BloqueCurso[];
  material?: Material | null;
}

export function PlanificarMaterialModal({
  open,
  onOpenChange,
  unidadId,
  bloques,
  material,
}: PlanificarMaterialModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={material ? "Editar material" : "Planificar material"}
      description={
        material
          ? "Actualiza los datos del material y su visibilidad."
          : "Compromete un material de reforzamiento con su fecha. Cuenta en el IGM."
      }
      icon={Calendar03Icon}
      size="md"
    >
      {open && (
        <PlanificarMaterialForm
          key={material?.id ?? unidadId}
          unidadId={unidadId}
          bloques={bloques}
          material={material}
          onCancel={() => onOpenChange(false)}
          onSuccess={() => onOpenChange(false)}
        />
      )}
    </Modal>
  );
}
