"use client";

import * as React from "react";
import { Task01Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { formatDate } from "@/lib/formatters/date";
import { useDetalleTarea } from "../../hooks";
import { ResolverTareaForm } from "../forms/resolver-tarea-form";

export interface ResolverTareaModalProps {
  open?: boolean;
  abierto?: boolean;
  onOpenChange: (abierto: boolean) => void;
  tareaId?: string | null;
}

export function ResolverTareaModal({
  open,
  abierto,
  onOpenChange,
  tareaId,
}: ResolverTareaModalProps) {
  const isOpen = abierto ?? open ?? false;
  const { data: tarea, refetch } = useDetalleTarea(isOpen && tareaId ? tareaId : "");

  return (
    <Modal
      open={isOpen}
      onOpenChange={onOpenChange}
      title={tarea?.titulo ?? "Resolver tarea o evaluación"}
      description={
        tarea
          ? `Fecha límite: ${formatDate(tarea.fechaLimite)}${tarea.permiteEntregaTardia ? " · Acepta entregas tardías" : ""}`
          : undefined
      }
      icon={Task01Icon}
      size="3xl"
    >
      {isOpen && tarea && (
        <ResolverTareaForm
          key={`${tarea.id}-${tarea.miEntrega?.id ?? "nueva"}`}
          tarea={tarea}
          onCancel={() => onOpenChange(false)}
          onSuccess={() => onOpenChange(false)}
          refetchDetalle={() => void refetch()}
        />
      )}
    </Modal>
  );
}
