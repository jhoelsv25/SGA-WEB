"use client";

import { TableRowActions } from "@/components/common/row-actions";
import { PencilEdit02Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import {
  useDeactivateCargoMutation,
  useReactivateCargoMutation,
} from "../../../hooks/use-cargos-mutations";
import type { CargoItem } from "../../../types/cargos.types";

interface CargoActionsProps {
  cargo: CargoItem;
  onEdit: (cargo: CargoItem) => void;
}

export function CargoActions({ cargo, onEdit }: CargoActionsProps) {
  const deactivateMutation = useDeactivateCargoMutation();
  const reactivateMutation = useReactivateCargoMutation();

  const hasAssignedPersons = cargo.personasCount > 0;

  const actionItems = [
    {
      label: "Editar cargo",
      icon: PencilEdit02Icon,
      onClick: () => onEdit(cargo),
    },
  ];

  if (!cargo.vigente) {
    actionItems.push({
      label: "Reactivar cargo",
      icon: CheckmarkCircle02Icon,
      onClick: () => reactivateMutation.mutate(cargo.id),
    });
  }

  return (
    <TableRowActions
      header={{
        title: cargo.nombre,
        subtitle: cargo.vigente ? "Cargo vigente" : "Cargo desactivado",
      }}
      copy={{
        text: cargo.id,
        label: "Copiar ID del cargo",
        successMessage: "ID copiado al portapapeles",
      }}
      items={actionItems}
      deleteAction={
        cargo.vigente && !hasAssignedPersons
          ? {
              label: "Desactivar cargo",
              title: `¿Desactivar el cargo "${cargo.nombre}"?`,
              description:
                "Esta acción desactivará el cargo. Puedes volver a activarlo más adelante.",
              confirmText: "Sí, desactivar",
              isPending: deactivateMutation.isPending,
              onConfirm: async () => {
                await deactivateMutation.mutateAsync(cargo.id);
              },
            }
          : undefined
      }
    />
  );
}
