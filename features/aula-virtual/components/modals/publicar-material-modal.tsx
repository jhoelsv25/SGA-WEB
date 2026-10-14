"use client";

import * as React from "react";
import { CloudUploadIcon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { PublicarMaterialForm } from "../forms/publicar-material-form";
import type { Material } from "../../types";

interface PublicarMaterialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  material: Material | null;
  tamanoMaximoMb: number;
}

export function PublicarMaterialModal({
  open,
  onOpenChange,
  material,
  tamanoMaximoMb,
}: PublicarMaterialModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={material?.publicadoEn ? "Reemplazar material" : "Publicar material"}
      description={material?.titulo}
      icon={CloudUploadIcon}
      size="md"
    >
      {material && (
        <PublicarMaterialForm
          key={material.id}
          material={material}
          tamanoMaximoMb={tamanoMaximoMb}
          onCancel={() => onOpenChange(false)}
          onSuccess={() => onOpenChange(false)}
        />
      )}
    </Modal>
  );
}
