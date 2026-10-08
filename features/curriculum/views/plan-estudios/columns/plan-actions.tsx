"use client";

import * as React from "react";
import { TableRowActions } from "@/components/common/row-actions";
import type { PlanEstudioItem } from "../../../types";

interface PlanActionsProps {
  item: PlanEstudioItem;
  onEditHoras: (item: PlanEstudioItem) => void;
  onRemove: (item: PlanEstudioItem) => Promise<void>;
  isRemoving?: boolean;
}

export function PlanActions({ item, onEditHoras, onRemove, isRemoving = false }: PlanActionsProps) {
  return (
    <TableRowActions
      header={{
        title: item.curso.codigo,
        subtitle: item.curso.nombre,
      }}
      copy={{
        text: item.curso.codigo,
        label: "Copiar código",
      }}
      onEdit={() => onEditHoras(item)}
      editLabel="Modificar horas pedagógicas"
      deleteAction={{
        label: "Quitar asignatura del plan",
        title: "¿Quitar asignatura del plan de estudios?",
        description: `¿Estás seguro de que deseas retirar "${item.curso.nombre}" del plan de estudios? Si ya cuenta con carga académica en secciones de este grado en el año en curso, el sistema bloqueará la acción.`,
        confirmText: "Quitar Asignatura",
        onConfirm: () => onRemove(item),
        isPending: isRemoving,
      }}
    />
  );
}
