"use client";

import * as React from "react";
import { Modal } from "@/components/common/modal";
import { ShieldCheckIcon } from "@hugeicons/core-free-icons";
import { RoleForm } from "../forms/role-form";
import { useCreateRoleMutation, useUpdateRoleMutation } from "../../hooks/use-roles-mutations";
import type { RoleItem } from "../../types/roles.types";
import type { CreateRoleFormValues } from "../../schemas/roles.schema";

interface RoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleToEdit?: RoleItem | null;
}

export function RoleModal({ open, onOpenChange, roleToEdit }: RoleModalProps) {
  const createMutation = useCreateRoleMutation(() => onOpenChange(false));
  const updateMutation = useUpdateRoleMutation(() => onOpenChange(false));

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (values: CreateRoleFormValues) => {
    if (roleToEdit) {
      await updateMutation.mutateAsync({
        id: roleToEdit.id,
        input: {
          nombre: values.nombre,
          descripcion: values.descripcion,
        },
      });
    } else {
      await createMutation.mutateAsync({
        nombre: values.nombre,
        descripcion: values.descripcion,
      });
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={roleToEdit ? "Editar Rol" : "Crear Rol Adicional"}
      description={
        roleToEdit
          ? "Modifica los datos del rol. Los roles del sistema tienen restricciones de nombre."
          : "Define un nuevo rol con responsabilidades personalizadas para la institución."
      }
      icon={ShieldCheckIcon}
      size="md"
    >
      <RoleForm
        initialData={roleToEdit}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        onCancel={() => onOpenChange(false)}
      />
    </Modal>
  );
}
