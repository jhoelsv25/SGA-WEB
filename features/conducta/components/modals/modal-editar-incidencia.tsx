"use client";

import * as React from "react";
import { Edit02Icon } from "@hugeicons/core-free-icons";
import { Modal } from "@/components/common/modal";
import { EditarIncidenciaForm } from "../forms/editar-incidencia-form";
import type { IncidenciaItem } from "../../types";

export interface ModalEditarIncidenciaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incidencia: IncidenciaItem | null;
}

export function ModalEditarIncidencia({
  open,
  onOpenChange,
  incidencia,
}: ModalEditarIncidenciaProps) {
  if (!incidencia) return null;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={`Corregir Incidencia (${incidencia.estudianteNombre})`}
      description="Permitido dentro de las 24 horas posteriores al registro por el autor o director."
      icon={Edit02Icon}
      size="lg"
    >
      <EditarIncidenciaForm
        key={incidencia.id}
        incidencia={incidencia}
        onCancel={() => onOpenChange(false)}
        onSuccess={() => onOpenChange(false)}
      />
    </Modal>
  );
}
