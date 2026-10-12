import { apiClient, handleApiError } from "@/lib/api-client";
import type {
  CreateRoleInput,
  MenuOptionCatalogItem,
  ModuleCatalogItem,
  RoleDetail,
  RoleItem,
  UpdateRoleInput,
} from "../types/roles.types";

export const rolesApi = {
  async getRoles(soloActivos?: boolean): Promise<RoleItem[]> {
    try {
      const params = soloActivos !== undefined ? { soloActivos } : {};
      const { data } = await apiClient.get<RoleItem[]>("/roles", { params });
      return data;
    } catch (error) {
      handleApiError(error, "Error al cargar la lista de roles.");
    }
  },

  async getRoleById(id: string): Promise<RoleDetail> {
    try {
      const { data } = await apiClient.get<RoleDetail>(`/roles/${id}`);
      return data;
    } catch (error) {
      handleApiError(error, "Error al cargar el detalle del rol.");
    }
  },

  async getMenuItemsCatalog(): Promise<MenuOptionCatalogItem[]> {
    try {
      const { data } = await apiClient.get<MenuOptionCatalogItem[]>("/menus/items");
      return data;
    } catch (error) {
      handleApiError(error, "Error al cargar el catálogo de menús.");
    }
  },

  async getModulesCatalog(): Promise<ModuleCatalogItem[]> {
    try {
      const { data } = await apiClient.get<ModuleCatalogItem[]>("/menus/modules", {
        params: { soloVigentes: true },
      });
      return data;
    } catch (error) {
      handleApiError(error, "Error al cargar el catálogo de módulos.");
    }
  },

  async createRole(input: CreateRoleInput): Promise<RoleItem> {
    try {
      const { data } = await apiClient.post<RoleItem>("/roles", input);
      return data;
    } catch (error) {
      handleApiError(error, "Error al crear el rol.");
    }
  },

  async updateRole(id: string, input: UpdateRoleInput): Promise<RoleItem> {
    try {
      const { data } = await apiClient.put<RoleItem>(`/roles/${id}`, input);
      return data;
    } catch (error) {
      handleApiError(error, "Error al actualizar el rol.");
    }
  },

  async deleteRole(id: string): Promise<{ message: string }> {
    try {
      const { data } = await apiClient.delete<{ message: string }>(`/roles/${id}`);
      return data;
    } catch (error) {
      handleApiError(error, "Error al desactivar el rol.");
    }
  },

  async assignMenus(id: string, menuIds: string[]): Promise<{ message: string; count: number }> {
    try {
      const { data } = await apiClient.put<{ message: string; count: number }>(
        `/roles/${id}/menus`,
        { menuIds },
      );
      return data;
    } catch (error) {
      handleApiError(error, "Error al asignar los menús del rol.");
    }
  },
};
