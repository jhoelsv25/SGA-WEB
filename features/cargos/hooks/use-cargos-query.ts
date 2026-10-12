import { useQuery } from "@tanstack/react-query";
import { cargosApi } from "../api/cargos.api";

export const cargosKeys = {
  all: ["cargos"] as const,
  lists: () => [...cargosKeys.all, "list"] as const,
  list: (vigentes?: boolean) => [...cargosKeys.lists(), { vigentes }] as const,
  details: () => [...cargosKeys.all, "detail"] as const,
  detail: (id: string) => [...cargosKeys.details(), id] as const,
};

export function useCargosQuery(vigentes = true) {
  return useQuery({
    queryKey: cargosKeys.list(vigentes),
    queryFn: () => cargosApi.getCargos(vigentes),
    staleTime: 1000 * 60 * 10,
  });
}
