"use client";

import * as React from "react";
import { UserRemove01Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { RegistrarAusenciaForm } from "./registrar-ausencia-form";
import type { SesionParaRegistroAusencia } from "./types";

interface RegistrarAusenciaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sesion: SesionParaRegistroAusencia | null;
  onExito?: () => void;
}

/**
 * Modal contenedor para registrar una ausencia docente en una sesión de clase (RF-012 HU1).
 */
export function RegistrarAusenciaModal({
  open,
  onOpenChange,
  sesion,
  onExito,
}: RegistrarAusenciaModalProps) {
  if (!sesion) return null;

  const handleExito = () => {
    onOpenChange(false);
    onExito?.();
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Registrar ausencia docente"
      description="Constata el tramo en que el docente no se encontró en el aula durante su clase."
      icon={UserRemove01Icon}
      size="lg"
    >
      <RegistrarAusenciaForm
        sesion={sesion}
        onExito={handleExito}
        onCancel={() => onOpenChange(false)}
      />
    </Modal>
  );
}
