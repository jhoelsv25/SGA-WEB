import { useQuery } from "@tanstack/react-query";
import { rolesApi } from "../api/roles.api";

export const rolesKeys = {
  all: ["roles"] as const,
  lists: () => [...rolesKeys.all, "list"] as const,
  list: (soloActivos?: boolean) => [...rolesKeys.lists(), { soloActivos }] as const,
  details: () => [...rolesKeys.all, "detail"] as const,
  detail: (id: string) => [...rolesKeys.details(), id] as const,
  permissions: () => [...rolesKeys.all, "permissions"] as const,
};

export function useRolesQuery(soloActivos?: boolean) {
  return useQuery({
    queryKey: rolesKeys.list(soloActivos),
    queryFn: () => rolesApi.getRoles(soloActivos),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export function useRoleDetailQuery(id?: string) {
  return useQuery({
    queryKey: rolesKeys.detail(id ?? ""),
    queryFn: () => rolesApi.getRoleById(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 2,
  });
}

export function usePermissionsCatalogQuery() {
  return useQuery({
    queryKey: rolesKeys.permissions(),
    queryFn: () => rolesApi.getPermissionsCatalog(),
    staleTime: 1000 * 60 * 15, // Catálogo relativamente estático
  });
}
