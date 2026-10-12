import { useQuery } from "@tanstack/react-query";
import { rolesApi } from "../api/roles.api";

export const rolesKeys = {
  all: ["roles"] as const,
  lists: () => [...rolesKeys.all, "list"] as const,
  list: (soloActivos?: boolean) => [...rolesKeys.lists(), { soloActivos }] as const,
  details: () => [...rolesKeys.all, "detail"] as const,
  detail: (id: string) => [...rolesKeys.details(), id] as const,
  menuItems: () => [...rolesKeys.all, "menu-items"] as const,
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

export function useMenuItemsCatalogQuery() {
  return useQuery({
    queryKey: rolesKeys.menuItems(),
    queryFn: () => rolesApi.getMenuItemsCatalog(),
    staleTime: 1000 * 60 * 60 * 24, // 24 horas (catálogo cuasi-estático)
    gcTime: 1000 * 60 * 60 * 24, // 24 horas en caché de memoria
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}
