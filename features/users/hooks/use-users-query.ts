import { useQuery } from "@tanstack/react-query";
import { usersApi } from "../api/users.api";
import type { UserQueryParams } from "../types/users.types";

export const usersKeys = {
  all: ["users"] as const,
  lists: () => [...usersKeys.all, "list"] as const,
  list: (params: UserQueryParams) => [...usersKeys.lists(), params] as const,
  details: () => [...usersKeys.all, "detail"] as const,
  detail: (id: string) => [...usersKeys.details(), id] as const,
  eligiblePersonas: (search?: string) =>
    [...usersKeys.all, "eligible-personas", { search }] as const,
};

export function useUsersQuery(params: UserQueryParams = {}) {
  return useQuery({
    queryKey: usersKeys.list(params),
    queryFn: () => usersApi.getUsers(params),
    staleTime: 1000 * 60 * 2,
  });
}

export function useUserDetailQuery(id?: string) {
  return useQuery({
    queryKey: usersKeys.detail(id ?? ""),
    queryFn: () => usersApi.getUserById(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 2,
  });
}

export function useEligiblePersonasQuery(search?: string) {
  return useQuery({
    queryKey: usersKeys.eligiblePersonas(search),
    queryFn: () => usersApi.getEligiblePersonas(search),
    staleTime: 1000 * 30, // 30 segundos
  });
}
