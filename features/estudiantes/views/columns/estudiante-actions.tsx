"use client";

import { TableRowActions } from "@/components/common/row-actions";
import {
  Delete02Icon,
  PrinterIcon,
  RefreshIcon,
  ShieldCheckIcon,
} from "@hugeicons/core-free-icons";
import type { Estudiante } from "../../types/estudiantes.types";

interface EstudianteActionsProps {
  estudiante: Estudiante;
  onEdit: (estudiante: Estudiante) => void;
  onDelete: (estudiante: Estudiante) => void;
  onPrintCarne?: (estudiante: Estudiante) => void;
  onReemitirCredencial?: (estudiante: Estudiante) => void;
  onVerHistorial?: (estudiante: Estudiante) => void;
}

export function EstudianteActions({
  estudiante,
  onEdit,
  onDelete,
  onPrintCarne,
  onReemitirCredencial,
  onVerHistorial,
}: EstudianteActionsProps) {
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
        ...(onPrintCarne
          ? [
              {
                key: "print-carne",
                label: "Imprimir carné escolar",
                icon: PrinterIcon,
                onClick: () => onPrintCarne(estudiante),
              },
            ]
          : []),
        ...(onReemitirCredencial
          ? [
              {
                key: "reemitir-credencial",
                label: "Carné perdido (Reemitir)",
                icon: RefreshIcon,
                onClick: () => onReemitirCredencial(estudiante),
              },
            ]
          : []),
        ...(onVerHistorial
          ? [
              {
                key: "historial-critico",
                label: "Bitácora de correcciones",
                icon: ShieldCheckIcon,
                onClick: () => onVerHistorial(estudiante),
              },
            ]
          : []),
        {
          key: "delete",
          label: "Eliminar ficha de estudiante",
          icon: Delete02Icon,
          variant: "destructive" as const,
          onClick: () => onDelete(estudiante),
        },
      ]}
    />
  );
}
