"use client";

import { Modal } from "@/components/common/modal";
import { UserEdit01Icon } from "@hugeicons/core-free-icons";
import { UpdateUsernameForm } from "../forms/update-username-form";
import { useUpdateUsernameMutation } from "../../hooks/use-users-mutations";
import type { UpdateUsernameFormValues } from "../../schemas/users.schema";
import type { UserItem } from "../../types/users.types";

interface UpdateUsernameModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserItem | null;
}

export function UpdateUsernameModal({ open, onOpenChange, user }: UpdateUsernameModalProps) {
  const mutation = useUpdateUsernameMutation(() => onOpenChange(false));

  if (!user) return null;

  const handleSubmit = async (values: UpdateUsernameFormValues) => {
    await mutation.mutateAsync({
      id: user.id,
      input: { nombreUsuario: values.nombreUsuario },
    });
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Modificar Nombre de Usuario"
      description={`Actualiza el identificador de acceso de ${user.persona.nombres} ${user.persona.apellidoPaterno}.`}
      icon={UserEdit01Icon}
      size="md"
    >
      <UpdateUsernameForm
        user={user}
        onSubmit={handleSubmit}
        isLoading={mutation.isPending}
        onCancel={() => onOpenChange(false)}
      />
    </Modal>
  );
}
