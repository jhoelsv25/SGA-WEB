"use client";

import * as React from "react";
import { TableRowActions } from "@/components/common/row-actions";
import { ShieldCheckIcon, PencilEdit02Icon, PowerIcon } from "@hugeicons/core-free-icons";
import type { Equipo } from "../../../types";

interface EquiposActionsProps {
  equipo: Equipo;
  onEdit: (equipo: Equipo) => void;
  onAutorizar: (equipo: Equipo) => void;
  onToggleActivo: (equipo: Equipo, activo: boolean) => Promise<void>;
  isToggling?: boolean;
}

export function EquiposActions({
  equipo,
  onEdit,
  onAutorizar,
  onToggleActivo,
  isToggling = false,
}: EquiposActionsProps) {
  return (
    <TableRowActions
      header={{
        title: equipo.nombre,
        subtitle: `${equipo.ubicacion} (${equipo.tipo})`,
      }}
      copy={{
        text: equipo.id,
        label: "Copiar ID del equipo",
        successMessage: "ID copiado al portapapeles",
      }}
      items={[
        {
          label:
            equipo.tipo === "biometrico" ? "Clave de la app puente" : "Autorizar este dispositivo",
          icon: ShieldCheckIcon,
          onClick: () => onAutorizar(equipo),
        },
        {
          label: "Editar equipo",
          icon: PencilEdit02Icon,
          onClick: () => onEdit(equipo),
        },
        {
          label: equipo.activo ? "Desactivar equipo" : "Activar equipo",
          icon: PowerIcon,
          onClick: () => onToggleActivo(equipo, !equipo.activo),
        },
      ]}
      deleteAction={
        equipo.activo
          ? {
              label: "Desactivar terminal",
              title: `¿Desactivar "${equipo.nombre}"?`,
              description:
                "El equipo dejará de permitir marcaciones o firmas de inmediato en las pantallas de kiosko.",
              confirmText: "Sí, desactivar",
              isPending: isToggling,
              onConfirm: async () => {
                await onToggleActivo(equipo, false);
              },
            }
          : undefined
      }
    />
  );
}
