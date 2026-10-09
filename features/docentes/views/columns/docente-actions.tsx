"use client";

import * as React from "react";
import { TableRowActions } from "@/components/common/row-actions";
import {
  PrinterIcon,
  RefreshIcon,
  ShieldCheckIcon,
  UserRemove01Icon,
} from "@hugeicons/core-free-icons";
import type { Docente } from "../../types/docentes.types";

interface DocenteActionsProps {
  docente: Docente;
  onEdit: (docente: Docente) => void;
  onCesar: (docente: Docente) => void;
  onPrintCarne?: (docente: Docente) => void;
  onReemitirCredencial?: (docente: Docente) => void;
  onVerHistorial?: (docente: Docente) => void;
}

export function DocenteActions({
  docente,
  onEdit,
  onCesar,
  onPrintCarne,
  onReemitirCredencial,
  onVerHistorial,
}: DocenteActionsProps) {
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
      items={[
        ...(onPrintCarne && docente.estado !== "cesado"
          ? [
              {
                key: "print-carne",
                label: "Imprimir carné docente",
                icon: PrinterIcon,
                onClick: () => onPrintCarne(docente),
              },
            ]
          : []),
        ...(onReemitirCredencial && docente.estado !== "cesado"
          ? [
              {
                key: "reemitir-credencial",
                label: "Carné perdido (Reemitir)",
                icon: RefreshIcon,
                onClick: () => onReemitirCredencial(docente),
              },
            ]
          : []),
        ...(onVerHistorial
          ? [
              {
                key: "historial-critico",
                label: "Bitácora de correcciones (RF-007)",
                icon: ShieldCheckIcon,
                onClick: () => onVerHistorial(docente),
              },
            ]
          : []),
        ...(docente.estado !== "cesado"
          ? [
              {
                key: "cesar",
                label: "Registrar cese laboral",
                icon: UserRemove01Icon,
                variant: "destructive" as const,
                onClick: () => onCesar(docente),
              },
            ]
          : []),
      ]}
    />
  );
}
