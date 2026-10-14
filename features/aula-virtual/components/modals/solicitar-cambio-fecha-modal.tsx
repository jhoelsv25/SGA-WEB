"use client";

import * as React from "react";
import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { SolicitarCambioFechaForm } from "../forms/solicitar-cambio-fecha-form";
import type { Material } from "../../types";

interface SolicitarCambioFechaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  material: Material | null;
}

export function SolicitarCambioFechaModal({
  open,
  onOpenChange,
  material,
}: SolicitarCambioFechaModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Solicitar cambio de fecha"
      description={material ? `${material.titulo} · fecha congelada` : undefined}
      icon={Calendar03Icon}
      size="md"
    >
      {material && (
        <SolicitarCambioFechaForm
          key={material.id}
          material={material}
          onCancel={() => onOpenChange(false)}
          onSuccess={() => onOpenChange(false)}
        />
      )}
    </Modal>
  );
}
