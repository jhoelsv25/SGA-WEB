"use client";

import * as React from "react";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { formatDate } from "@/lib/formatters/date";
import { CalificarEntregaForm } from "../forms/calificar-entrega-form";
import type { Entrega, Tarea } from "../../types";

export interface CalificarEntregaModalProps {
  abierto?: boolean;
  open?: boolean;
  onOpenChange: (abierto: boolean) => void;
  entrega: Entrega | null;
  tarea: Tarea | null;
  onCalificada?: () => void;
}

export function CalificarEntregaModal({
  abierto,
  open,
  onOpenChange,
  entrega,
  tarea,
  onCalificada,
}: CalificarEntregaModalProps) {
  const isOpen = abierto ?? open ?? false;

  return (
    <Modal
      open={isOpen}
      onOpenChange={onOpenChange}
      title="Revisar y calificar entrega"
      description={
        entrega
          ? `${entrega.estudianteNombre || "Estudiante"}${entrega.codigo ? ` (${entrega.codigo})` : ""} · Entregado el ${entrega.entregadaEn ? formatDate(entrega.entregadaEn) : "—"}`
          : undefined
      }
      icon={CheckmarkCircle02Icon}
      size="2xl"
    >
      {isOpen && entrega && tarea && (
        <CalificarEntregaForm
          key={entrega.id}
          entrega={entrega}
          tarea={tarea}
          onCancel={() => onOpenChange(false)}
          onSuccess={() => {
            onCalificada?.();
            onOpenChange(false);
          }}
        />
      )}
    </Modal>
  );
}
