"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { TableRowActions } from "@/components/common/row-actions";
import { BookOpen01Icon, UserRemove01Icon } from "@hugeicons/core-free-icons";
import type { RowActionCustomItem } from "@/components/common/row-actions/types";
import type { Docente } from "../../types/docentes.types";

interface DocenteActionsProps {
  docente: Docente;
  onEdit: (docente: Docente) => void;
  onCesar: (docente: Docente) => void;
}

export function DocenteActions({ docente, onEdit, onCesar }: DocenteActionsProps) {
  const router = useRouter();

  const customItems: RowActionCustomItem[] = [
    {
      key: "carga-academica",
      label: "Carga académica",
      icon: BookOpen01Icon,
      href: `/admin/docentes/${docente.id}/carga`,
      onClick: () => {
        router.push(`/admin/docentes/${docente.id}/carga`);
      },
    },
    ...(docente.estado !== "cesado"
      ? [
          {
            key: "cesar",
            label: "Registrar cese laboral",
            icon: UserRemove01Icon,
            onClick: () => onCesar(docente),
          },
        ]
      : []),
  ];

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
      items={customItems}
      triggerAriaLabel={`Abrir menú de opciones para ${docente.persona.nombreCompleto}`}
    />
  );
}
