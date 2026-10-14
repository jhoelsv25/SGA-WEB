"use client";

import * as React from "react";
import { Task01Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { TareaForm } from "../forms/tarea-form";
import type { Tarea } from "../../types";

export interface TareaModalProps {
  open?: boolean;
  abierto?: boolean;
  onOpenChange: (abierto: boolean) => void;
  cursoSeccionId: string;
  tarea?: Tarea | null;
  unidadIdDefecto?: string;
  periodoIdDefecto?: string;
}

export function TareaModal({
  open,
  abierto,
  onOpenChange,
  cursoSeccionId,
  tarea,
  unidadIdDefecto,
  periodoIdDefecto,
}: TareaModalProps) {
  const isOpen = abierto ?? open ?? false;
  const esEdicion = Boolean(tarea);

  return (
    <Modal
      open={isOpen}
      onOpenChange={onOpenChange}
      title={esEdicion ? "Editar tarea o evaluación" : "Crear nueva tarea o evaluación"}
      description="Configure las instrucciones, fecha límite y reglas de evaluación."
      icon={Task01Icon}
      size="3xl"
    >
      {isOpen && (
        <TareaForm
          key={tarea?.id ?? "nueva"}
          cursoSeccionId={cursoSeccionId}
          tarea={tarea}
          unidadIdDefecto={unidadIdDefecto}
          periodoIdDefecto={periodoIdDefecto}
          onCancel={() => onOpenChange(false)}
          onSuccess={() => onOpenChange(false)}
        />
      )}
    </Modal>
  );
}
