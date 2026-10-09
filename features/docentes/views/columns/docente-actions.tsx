"use client";

import * as React from "react";
import { TableRowActions } from "@/components/common/row-actions";
import { UserRemove01Icon } from "@hugeicons/core-free-icons";
import type { Docente } from "../../types/docentes.types";

interface DocenteActionsProps {
  docente: Docente;
  onEdit: (docente: Docente) => void;
  onCesar: (docente: Docente) => void;
}

export function DocenteActions({ docente, onEdit, onCesar }: DocenteActionsProps) {
  return (
    <TableRowActions
      header={{
        title: docente.persona.nombreCompleto,
        subtitle: `Docente: ${docente.codigo}`,
      }}
      copy={{
        text: docente.codigo,
        label: "Copiar código de docente",
        successMessage: `Código ${docente.codigo} copiado`,
      }}
      onEdit={() => onEdit(docente)}
      editLabel="Editar ficha docente"
      items={
        docente.estado !== "cesado"
          ? [
              {
                key: "cesar",
                label: "Registrar cese laboral",
                icon: UserRemove01Icon,
                onClick: () => onCesar(docente),
              },
            ]
          : []
      }
    />
  );
}
