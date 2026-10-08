"use client";

import { Modal } from "@/components/common/modal";
import { UserAdd01Icon } from "@hugeicons/core-free-icons";
import { CreateUserForm } from "../forms/create-user-form";
import { useCreateUserMutation } from "../../hooks/use-users-mutations";
import type { CreateUserFormValues } from "../../schemas/users.schema";
import type { CreateUserResponse } from "../../types/users.types";

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated: (res: CreateUserResponse) => void;
}

export function CreateUserModal({ open, onOpenChange, onUserCreated }: CreateUserModalProps) {
  const createMutation = useCreateUserMutation((data) => {
    onOpenChange(false);
    onUserCreated(data);
  });

  const handleSubmit = async (values: CreateUserFormValues) => {
    await createMutation.mutateAsync({
      personaId: values.personaId,
      rolId: values.rolId,
      nombreUsuario: values.nombreUsuario,
    });
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Crear Cuenta de Usuario"
      description="Vincula una persona registrada en el padrón a un rol y genera su cuenta de acceso."
      icon={UserAdd01Icon}
      size="lg"
    >
      <CreateUserForm
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
        onCancel={() => onOpenChange(false)}
      />
    </Modal>
  );
}
