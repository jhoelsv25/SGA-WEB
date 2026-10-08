"use client";

import * as React from "react";
import { TableRowActions } from "@/components/common/row-actions";
import { ShieldCheckIcon, PencilEdit02Icon } from "@hugeicons/core-free-icons";
import { useDeleteRoleMutation } from "../../../hooks/use-roles-mutations";
import type { RoleItem } from "../../../types/roles.types";

interface RoleActionsProps {
  role: RoleItem;
  onEdit: (role: RoleItem) => void;
  onAssignPermissions: (role: RoleItem) => void;
}

export function RoleActions({ role, onEdit, onAssignPermissions }: RoleActionsProps) {
  const deleteMutation = useDeleteRoleMutation();

  const isSystemRole = role.esSistema;
  const hasAssignedUsers = role.usuariosCount > 0;

  return (
    <TableRowActions
      header={{
        title: role.nombre,
        subtitle: isSystemRole ? "Rol protegido del sistema" : "Rol adicional",
      }}
      copy={{
        text: role.id,
        label: "Copiar ID del rol",
        successMessage: "ID copiado al portapapeles",
      }}
      items={[
        {
          label: "Configurar permisos",
          icon: ShieldCheckIcon,
          onClick: () => onAssignPermissions(role),
        },
        ...(!isSystemRole
          ? [
              {
                label: "Editar descripción",
                icon: PencilEdit02Icon,
                onClick: () => onEdit(role),
              },
            ]
          : []),
      ]}
      deleteAction={
        !isSystemRole && !hasAssignedUsers
          ? {
              label: "Desactivar rol",
              title: `¿Desactivar el rol "${role.nombre}"?`,
              description:
                "Esta acción desactivará el rol en el sistema. Puedes volver a activarlo más adelante.",
              confirmText: "Sí, desactivar",
              isPending: deleteMutation.isPending,
              onConfirm: async () => {
                await deleteMutation.mutateAsync(role.id);
              },
            }
          : undefined
      }
    />
  );
}
