"use client";

import * as React from "react";
import { TableRowActions } from "@/components/common/row-actions";
import { RefreshIcon } from "@hugeicons/core-free-icons";
import type { Curso } from "../../../types";

interface CursoActionsProps {
  curso: Curso;
  onEdit: (curso: Curso) => void;
  onDeactivate: (curso: Curso) => Promise<void>;
  onReactivate: (curso: Curso) => Promise<void>;
  isDeactivating?: boolean;
}

export function CursoActions({
  curso,
  onEdit,
  onDeactivate,
  onReactivate,
  isDeactivating = false,
}: CursoActionsProps) {
  return (
    <TableRowActions
      header={{
        title: `Curso: ${curso.codigo}`,
        subtitle: curso.nombre,
      }}
      copy={{
        text: curso.codigo,
        label: "Copiar código",
        successMessage: `Código ${curso.codigo} copiado`,
      }}
      onEdit={() => onEdit(curso)}
      editLabel="Editar datos del curso"
      items={
        !curso.activo
          ? [
              {
                key: "reactivate",
                label: "Reactivar curso",
                icon: RefreshIcon,
                onClick: () => onReactivate(curso),
              },
            ]
          : []
      }
      deleteAction={
        curso.activo
          ? {
              label: "Desactivar curso",
              title: "¿Desactivar asignatura del catálogo?",
              description: `¿Confirmas la desactivación de "${curso.nombre}"? Un curso inactivo no se podrá agregar a nuevos planes ni horarios. Si tiene carga académica activa en el año escolar en curso, el sistema bloqueará la operación.`,
              confirmText: "Desactivar Curso",
              onConfirm: () => onDeactivate(curso),
              isPending: isDeactivating,
            }
          : undefined
      }
    />
  );
}
