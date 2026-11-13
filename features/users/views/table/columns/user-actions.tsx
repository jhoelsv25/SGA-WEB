"use client";

import * as React from "react";
import { TableRowActions } from "@/components/common/row-actions";
import {
  ShieldCheckIcon,
  PencilEdit02Icon,
  Key01Icon,
  LockKeyIcon,
  CheckmarkCircle02Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { useImpersonate, useSession } from "@/features/auth";
import {
  useDeactivateUserMutation,
  useReactivateUserMutation,
  useUnlockUserMutation,
} from "../../../hooks/use-users-mutations";
import type { UserItem } from "../../../types/users.types";

interface UserActionsProps {
  user: UserItem;
  currentUserId?: string;
  onChangeRole: (user: UserItem) => void;
  onUpdateUsername: (user: UserItem) => void;
  onResetPassword: (user: UserItem) => void;
}

export function UserActions({
  user,
  currentUserId,
  onChangeRole,
  onUpdateUsername,
  onResetPassword,
}: UserActionsProps) {
  const { data: session } = useSession();
  const impersonateMutation = useImpersonate();
  const unlockMutation = useUnlockUserMutation();
  const deactivateMutation = useDeactivateUserMutation();
  const reactivateMutation = useReactivateUserMutation();

  const isSelf = currentUserId === user.id;
  const isBlocked = user.estado === "bloqueado";
  const isInactive = user.estado === "inactivo";
  const isActive = user.estado === "activo";

  const rolActivo = session?.user?.activeRoleName ?? session?.user?.roles?.[0] ?? "";
  const puedeSimular =
    ["Administrador", "Soporte TI"].includes(rolActivo) &&
    !session?.user?.impersonatedBy &&
    isActive &&
    !isSelf;

  const actionItems = [];

  if (puedeSimular) {
    actionItems.push({
      label: "Ver como este usuario",
      icon: ViewIcon,
      onClick: () => impersonateMutation.mutate({ userId: user.id }),
    });
  }

  // Gestionar roles (un usuario activo puede agregar o cambiar sus roles secundarios)
  if (!isInactive) {
    actionItems.push({
      label: "Gestionar roles",
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

  // Restablecer contraseña (solo para otras cuentas; la propia se cambia desde el menú de perfil)
  if (!isSelf) {
    actionItems.push({
      label: "Restablecer contraseña",
      icon: Key01Icon,
      onClick: () => onResetPassword(user),
    });
  }

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
