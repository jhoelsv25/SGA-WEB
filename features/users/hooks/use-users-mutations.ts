import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { usersApi } from "../api/users.api";
import type {
  AddUserRoleInput,
  CreateUserInput,
  CreateUserResponse,
  ResetPasswordInput,
  TempPasswordResetResponse,
  UpdateUsernameInput,
} from "../types/users.types";
import { usersKeys } from "./use-users-query";

export function useCreateUserMutation(onSuccessCallback?: (data: CreateUserResponse) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateUserInput) => usersApi.createUser(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: usersKeys.all });
      toast.success(
        data.cuentaExistente
          ? `Cargo y roles actualizados para "${data.usuario.nombreUsuario}".`
          : `Cuenta para "${data.usuario.nombreUsuario}" creada exitosamente.`,
      );
      onSuccessCallback?.(data);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear la cuenta de usuario.");
    },
  });
}

export function useAddRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: AddUserRoleInput }) =>
      usersApi.addRole(id, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.roles(variables.id) });
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      toast.success("Rol asignado a la cuenta.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al asignar el rol a la cuenta.");
    },
  });
}

export function useSetPrincipalRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, rolId }: { id: string; rolId: string }) =>
      usersApi.setPrincipalRole(id, rolId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.roles(variables.id) });
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      toast.success("Rol principal actualizado. Se aplicará en el siguiente ingreso.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al marcar el rol como principal.");
    },
  });
}

export function useRetireRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, rolId }: { id: string; rolId: string }) => usersApi.retireRole(id, rolId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.roles(variables.id) });
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      toast.success("Rol retirado de la cuenta.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al retirar el rol de la cuenta.");
    },
  });
}

export function useUpdateUsernameMutation(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateUsernameInput }) =>
      usersApi.updateUsername(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(data.id) });
      toast.success(`Nombre de usuario actualizado a "${data.nombreUsuario}".`);
      onSuccessCallback?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar el nombre de usuario.");
    },
  });
}

export function useUnlockUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersApi.unlockUser(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(data.id) });
      toast.success(`Cuenta de "${data.nombreUsuario}" desbloqueada.`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al desbloquear el usuario.");
    },
  });
}

export function useDeactivateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersApi.deactivateUser(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(data.id) });
      toast.success(`Cuenta de "${data.nombreUsuario}" desactivada y sesiones cerradas.`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al desactivar el usuario.");
    },
  });
}

export function useReactivateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersApi.reactivateUser(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(data.id) });
      toast.success(`Cuenta de "${data.nombreUsuario}" reactivada.`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al reactivar el usuario.");
    },
  });
}

export function useResetPasswordMutation(
  onSuccessCallback?: (data: TempPasswordResetResponse) => void,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input?: ResetPasswordInput }) =>
      usersApi.resetPassword(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      toast.success("Contraseña restablecida exitosamente.");
      onSuccessCallback?.(data);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al restablecer la contraseña.");
    },
  });
}
