"use client";

import { File02Icon } from "@hugeicons/core-free-icons";
import { TableRowActions } from "@/components/common/row-actions";
import type { DetalleLibreta } from "../../../types";

interface DetalleLibretaActionsProps {
  libreta: DetalleLibreta;
  onHistorial: (libretaId: string) => void;
}

export function DetalleLibretaActions({ libreta, onHistorial }: DetalleLibretaActionsProps) {
  return (
    <TableRowActions
      header={{
        title: libreta.nombreCompleto,
        subtitle: libreta.codigo,
      }}
      items={[
        {
          label: "Historial",
          icon: File02Icon,
          onClick: () => onHistorial(libreta.libretaId),
        },
      ]}
      triggerAriaLabel={`Acciones de ${libreta.nombreCompleto}`}
    />
  );
}
