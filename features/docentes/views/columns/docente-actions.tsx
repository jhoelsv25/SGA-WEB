"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { TableRowActions } from "@/components/common/row-actions";
import {
  BookOpen01Icon,
  FingerPrintIcon,
  Key01Icon,
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
  onCambiarPin?: (docente: Docente) => void;
  onCodigoBiometrico?: (docente: Docente) => void;
}

export function DocenteActions({
  docente,
  onEdit,
  onCesar,
  onPrintCarne,
  onReemitirCredencial,
  onVerHistorial,
  onCambiarPin,
  onCodigoBiometrico,
}: DocenteActionsProps) {
  const router = useRouter();

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
        {
          key: "carga-academica",
          label: "Carga académica",
          icon: BookOpen01Icon,
          href: `/admin/docentes/${docente.id}/carga`,
          onClick: () => router.push(`/admin/docentes/${docente.id}/carga`),
        },
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
        ...(onCodigoBiometrico && docente.estado !== "cesado"
          ? [
              {
                key: "codigo-biometrico",
                label: "Código biométrico",
                icon: FingerPrintIcon,
                onClick: () => onCodigoBiometrico(docente),
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
        ...(onCambiarPin && docente.estado !== "cesado"
          ? [
              {
                key: "cambiar-pin",
                label: "Cambiar PIN de marcación",
                icon: Key01Icon,
                onClick: () => onCambiarPin(docente),
              },
            ]
          : []),
        ...(onVerHistorial
          ? [
              {
                key: "historial-critico",
                label: "Bitácora de correcciones",
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
      triggerAriaLabel={`Abrir menú de opciones para ${docente.persona.nombreCompleto}`}
    />
  );
}
