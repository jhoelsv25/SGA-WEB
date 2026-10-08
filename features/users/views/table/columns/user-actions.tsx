"use client";

import * as React from "react";
import { TableRowActions } from "@/components/common/row-actions";
import {
  ShieldCheckIcon,
  PencilEdit02Icon,
  Key01Icon,
  LockKeyIcon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import {
  useDeactivateUserMutation,
  useReactivateUserMutation,
  useResetPasswordMutation,
  useUnlockUserMutation,
} from "../../../hooks/use-users-mutations";
import type { TempPasswordResetResponse, UserItem } from "../../../types/users.types";

interface UserActionsProps {
  user: UserItem;
  currentUserId?: string;
  onChangeRole: (user: UserItem) => void;
  onUpdateUsername: (user: UserItem) => void;
  onPasswordReset: (data: TempPasswordResetResponse, username: string) => void;
}

export function UserActions({
  user,
  currentUserId,
  onChangeRole,
  onUpdateUsername,
  onPasswordReset,
}: UserActionsProps) {
  const unlockMutation = useUnlockUserMutation();
  const deactivateMutation = useDeactivateUserMutation();
  const reactivateMutation = useReactivateUserMutation();
  const resetPasswordMutation = useResetPasswordMutation((data) => {
    onPasswordReset(data, user.nombreUsuario);
  });

  const isSelf = currentUserId === user.id;
  const isBlocked = user.estado === "bloqueado";
  const isInactive = user.estado === "inactivo";
  const isActive = user.estado === "activo";

  const actionItems = [];

  // Cambiar rol (no puede cambiarse su propio rol)
  if (!isSelf && !isInactive) {
    actionItems.push({
      label: "Cambiar rol",
      icon: ShieldCheckIcon,
      onClick: () => onChangeRole(user),
    });
  }

  // Modificar nombre de usuario
  actionItems.push({
    label: "Modificar nombre de usuario",
    icon: PencilEdit02Icon,
    onClick: () => onUpdateUsername(user),
  });

  // Restablecer contraseña
  actionItems.push({
    label: "Restablecer contraseña",
    icon: Key01Icon,
    onClick: () => resetPasswordMutation.mutate(user.id),
  });

  // Desbloquear si está bloqueado
  if (isBlocked) {
    actionItems.push({
      label: "Desbloquear cuenta",
      icon: LockKeyIcon,
      onClick: () => unlockMutation.mutate(user.id),
    });
  }

  // Reactivar si está inactivo
  if (isInactive) {
    actionItems.push({
      label: "Reactivar cuenta",
      icon: CheckmarkCircle02Icon,
      onClick: () => reactivateMutation.mutate(user.id),
    });
  }

  return (
    <TableRowActions
      header={{
        title: user.nombreUsuario,
        subtitle: `${user.persona.nombres} ${user.persona.apellidoPaterno} (${user.rol.nombre})`,
      }}
      copy={{
        text: user.nombreUsuario,
        label: "Copiar usuario",
        successMessage: "Nombre de usuario copiado",
      }}
      items={actionItems}
      deleteAction={
        !isSelf && (isActive || isBlocked)
          ? {
              label: "Desactivar cuenta",
              title: `¿Desactivar la cuenta de "${user.nombreUsuario}"?`,
              description:
                "Esta acción cerrará todas sus sesiones abiertas e impedirá el acceso al sistema hasta que sea reactivada.",
              confirmText: "Sí, desactivar cuenta",
              isPending: deactivateMutation.isPending,
              onConfirm: async () => {
                await deactivateMutation.mutateAsync(user.id);
              },
            }
          : undefined
      }
    />
  );
}
