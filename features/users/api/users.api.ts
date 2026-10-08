import { apiClient, handleApiError } from "@/lib/api-client";
import type {
  ChangeUserRoleInput,
  CreateUserInput,
  CreateUserResponse,
  EligiblePersona,
  PaginatedUsersResponse,
  TempPasswordResetResponse,
  UpdateUsernameInput,
  UserItem,
  UserQueryParams,
} from "../types/users.types";

export const usersApi = {
  async getUsers(params: UserQueryParams = {}): Promise<PaginatedUsersResponse> {
    try {
      const { data } = await apiClient.get<PaginatedUsersResponse>("/users", { params });
      return data;
    } catch (error) {
      handleApiError(error, "Error al cargar la lista de usuarios.");
    }
  },

  async getUserById(id: string): Promise<UserItem> {
    try {
      const { data } = await apiClient.get<UserItem>(`/users/${id}`);
      return data;
    } catch (error) {
      handleApiError(error, "Error al cargar el detalle del usuario.");
    }
  },

  async getEligiblePersonas(search?: string): Promise<EligiblePersona[]> {
    try {
      const params = search ? { search } : {};
      const { data } = await apiClient.get<EligiblePersona[]>("/users/eligible-personas", {
        params,
      });
      return data;
    } catch (error) {
      handleApiError(error, "Error al buscar personas disponibles.");
    }
  },

  async createUser(input: CreateUserInput): Promise<CreateUserResponse> {
    try {
      const { data } = await apiClient.post<CreateUserResponse>("/users", input);
      return data;
    } catch (error) {
      handleApiError(error, "Error al crear la cuenta de usuario.");
    }
  },

  async changeRole(id: string, input: ChangeUserRoleInput): Promise<UserItem> {
    try {
      const { data } = await apiClient.put<UserItem>(`/users/${id}/role`, input);
      return data;
    } catch (error) {
      handleApiError(error, "Error al cambiar el rol del usuario.");
    }
  },

  async updateUsername(id: string, input: UpdateUsernameInput): Promise<UserItem> {
    try {
      const { data } = await apiClient.put<UserItem>(`/users/${id}/username`, input);
      return data;
    } catch (error) {
      handleApiError(error, "Error al actualizar el nombre de usuario.");
    }
  },

  async unlockUser(id: string): Promise<UserItem> {
    try {
      const { data } = await apiClient.patch<UserItem>(`/users/${id}/unlock`);
      return data;
    } catch (error) {
      handleApiError(error, "Error al desbloquear el usuario.");
    }
  },

  async deactivateUser(id: string): Promise<UserItem> {
    try {
      const { data } = await apiClient.patch<UserItem>(`/users/${id}/deactivate`);
      return data;
    } catch (error) {
      handleApiError(error, "Error al desactivar el usuario.");
    }
  },

  async reactivateUser(id: string): Promise<UserItem> {
    try {
      const { data } = await apiClient.patch<UserItem>(`/users/${id}/reactivate`);
      return data;
    } catch (error) {
      handleApiError(error, "Error al reactivar el usuario.");
    }
  },

  async resetPassword(id: string): Promise<TempPasswordResetResponse> {
    try {
      const { data } = await apiClient.post<TempPasswordResetResponse>(
        `/users/${id}/reset-password`,
      );
      return data;
    } catch (error) {
      handleApiError(error, "Error al restablecer la contraseña.");
    }
  },
};
