"use client";

import { Modal } from "@/components/common/modal";
import { ShieldCheckIcon } from "@hugeicons/core-free-icons";
import { ChangeRoleForm } from "../forms/change-role-form";
import { useChangeRoleMutation } from "../../hooks/use-users-mutations";
import type { ChangeRoleFormValues } from "../../schemas/users.schema";
import type { UserItem } from "../../types/users.types";

interface ChangeRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserItem | null;
}

export function ChangeRoleModal({ open, onOpenChange, user }: ChangeRoleModalProps) {
  const mutation = useChangeRoleMutation(() => onOpenChange(false));

  if (!user) return null;

  const handleSubmit = async (values: ChangeRoleFormValues) => {
    await mutation.mutateAsync({
      id: user.id,
      input: { rolId: values.rolId },
    });
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Cambiar rol de usuario"
      description="El cambio de rol actualizará los permisos y accesos del menú de esta cuenta."
      icon={ShieldCheckIcon}
      size="md"
    >
      <ChangeRoleForm
        user={user}
        onSubmit={handleSubmit}
        isLoading={mutation.isPending}
        onCancel={() => onOpenChange(false)}
      />
    </Modal>
  );
}
