import { useQuery } from "@tanstack/react-query";
import { buscarPersonas, getAccesos } from "./api";

export const accesosKeys = ["accesos"] as const;

export function useBuscarPersonas(q: string) {
  return useQuery({
    queryKey: [...accesosKeys, "buscar", q],
    queryFn: () => buscarPersonas(q),
    enabled: q.length >= 3,
  });
}

export function useAccesos(personaId: string | null) {
  return useQuery({
    queryKey: [...accesosKeys, "persona", personaId],
    queryFn: () => getAccesos(personaId as string),
    enabled: Boolean(personaId),
  });
}
