import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { rolesApi } from "../api/roles.api";
import type { CreateRoleInput, UpdateRoleInput } from "../types/roles.types";
import { rolesKeys } from "./use-roles-query";

export function useCreateRoleMutation(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateRoleInput) => rolesApi.createRole(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.lists() });
      toast.success(`Rol "${data.nombre}" creado exitosamente.`);
      onSuccessCallback?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear el rol.");
    },
  });
}

export function useUpdateRoleMutation(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateRoleInput }) =>
      rolesApi.updateRole(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: rolesKeys.detail(data.id) });
      toast.success(`Rol "${data.nombre}" actualizado.`);
      onSuccessCallback?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar el rol.");
    },
  });
}

export function useDeleteRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rolesApi.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.lists() });
      toast.success("Rol desactivado exitosamente.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al desactivar el rol.");
    },
  });
}

export function useAssignMenusMutation(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, menuIds }: { id: string; menuIds: string[] }) =>
      rolesApi.assignMenus(id, menuIds),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: rolesKeys.lists() });
      toast.success(data.message || "Menús actualizados correctamente.");
      onSuccessCallback?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar los menús del rol.");
    },
  });
}
