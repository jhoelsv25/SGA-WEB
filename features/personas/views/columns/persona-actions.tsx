"use client";

import * as React from "react";
import { TableRowActions } from "@/components/common/row-actions";
import { ShieldCheckIcon } from "@hugeicons/core-free-icons";
import type { Persona } from "../../types/personas.types";

interface PersonaActionsProps {
  persona: Persona;
  onEdit: (persona: Persona) => void;
  onDelete: (persona: Persona) => void;
  onVerHistorial?: (persona: Persona) => void;
  isDeleting?: boolean;
}

export function PersonaActions({
  persona,
  onEdit,
  onDelete,
  onVerHistorial,
  isDeleting = false,
}: PersonaActionsProps) {
  const docTipo = persona.tipoDocumento.toUpperCase();

  return (
    <TableRowActions
      header={{
        title: persona.nombreCompleto,
        subtitle: `${docTipo}: ${persona.numeroDocumento}`,
      }}
      copy={{
        text: persona.numeroDocumento,
        label: `Copiar ${docTipo}`,
        successMessage: `${docTipo} ${persona.numeroDocumento} copiado`,
      }}
      onEdit={() => onEdit(persona)}
      editLabel="Editar datos de persona"
      items={
        onVerHistorial
          ? [
              {
                key: "historial-critico",
                label: "Bitácora de correcciones (RF-007)",
                icon: ShieldCheckIcon,
                onClick: () => onVerHistorial(persona),
              },
            ]
          : undefined
      }
      deleteAction={
        persona.esProvisional
          ? {
              label: "Eliminar del padrón",
              title: "¿Eliminar persona provisional?",
              description: `¿Estás seguro de eliminar a "${persona.nombreCompleto}"? Al ser una persona provisional sin fichas ni cuentas activas, se eliminará del padrón único.`,
              confirmText: "Eliminar Persona",
              onConfirm: () => onDelete(persona),
              isPending: isDeleting,
            }
          : undefined
      }
    />
  );
}
