"use client";

import * as React from "react";
import { TableRowActions } from "@/components/common/row-actions";
import {
  ShieldCheckIcon,
  IdVerifiedIcon,
  UserRemove01Icon,
  UserCheck01Icon,
} from "@hugeicons/core-free-icons";
import type { Persona } from "../../types/personas.types";
import { esFichaVigente, estadoFicha, type TipoFichaAcademica } from "../../utils/ficha-academica";
import type { AccionFicha } from "../../components/modals/ficha-baja-modal";

interface PersonaActionsProps {
  persona: Persona;
  onEdit: (persona: Persona) => void;
  onDelete: (persona: Persona) => void;
  onVerHistorial?: (persona: Persona) => void;
  onChangeCargo?: (persona: Persona) => void;
  onFichaAccion?: (persona: Persona, tipo: TipoFichaAcademica, accion: AccionFicha) => void;
  isDeleting?: boolean;
}

export function PersonaActions({
  persona,
  onEdit,
  onDelete,
  onVerHistorial,
  onChangeCargo,
  onFichaAccion,
  isDeleting = false,
}: PersonaActionsProps) {
  const docTipo = persona.tipoDocumento.toUpperCase();

  // RF-007 V4: dar de baja (si está vigente) o reactivar (si está de baja) cada ficha académica
  const fichaItems = onFichaAccion
    ? (["docente", "estudiante"] as const).flatMap((tipo) => {
        const estado = estadoFicha(persona, tipo);
        const id = tipo === "docente" ? persona.fichas.docenteId : persona.fichas.estudianteId;
        if (!estado || !id) return [];
        const vigente = esFichaVigente(tipo, estado);
        if (!vigente && tipo === "estudiante" && estado === "egresado") return [];
        return [
          {
            key: `${vigente ? "baja" : "reactivar"}-${tipo}`,
            label: `${vigente ? "Dar de baja" : "Reactivar"} ficha de ${tipo}`,
            icon: vigente ? UserRemove01Icon : UserCheck01Icon,
            onClick: () => onFichaAccion(persona, tipo, vigente ? "baja" : "reactivar"),
          },
        ];
      })
    : [];

  const items = [
    ...fichaItems,
    ...(onChangeCargo
      ? [
          {
            key: "cambiar-cargo",
            label: "Cambiar cargo",
            icon: IdVerifiedIcon,
            onClick: () => onChangeCargo(persona),
          },
        ]
      : []),
    ...(onVerHistorial
      ? [
          {
            key: "historial-critico",
            label: "Bitácora de correcciones",
            icon: ShieldCheckIcon,
            onClick: () => onVerHistorial(persona),
          },
        ]
      : []),
  ];

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
      items={items.length > 0 ? items : undefined}
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
