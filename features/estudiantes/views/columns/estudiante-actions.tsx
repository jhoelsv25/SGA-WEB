"use client";

import { TableRowActions } from "@/components/common/row-actions";
import { Delete02Icon } from "@hugeicons/core-free-icons";
import type { Estudiante } from "../../types/estudiantes.types";

interface EstudianteActionsProps {
  estudiante: Estudiante;
  onEdit: (estudiante: Estudiante) => void;
  onDelete: (estudiante: Estudiante) => void;
}

export function EstudianteActions({ estudiante, onEdit, onDelete }: EstudianteActionsProps) {
  return (
    <TableRowActions
      header={{
        title: estudiante.persona.nombreCompleto,
        subtitle: `SIAGIE: ${estudiante.codigo}`,
      }}
      copy={{
        text: estudiante.codigo,
        label: "Copiar código SIAGIE",
        successMessage: `Código SIAGIE ${estudiante.codigo} copiado`,
      }}
      onEdit={() => onEdit(estudiante)}
      editLabel="Editar ficha de estudiante"
      items={[
        {
          key: "delete",
          label: "Eliminar ficha de estudiante",
          icon: Delete02Icon,
          variant: "destructive",
          onClick: () => onDelete(estudiante),
        },
      ]}
    />
  );
}
