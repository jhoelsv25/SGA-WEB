import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiClientError } from "@/lib/api-client";
import { personasApi } from "../api/personas.api";
import type {
  CargoAsignadoResponse,
  ChangeCargoInput,
  CreatePersonaInput,
  HistorialCorreccionCritica,
  PaginatedPersonasResponse,
  Persona,
  PersonaQueryParams,
  SearchPersonaResult,
  UpdatePersonaInput,
} from "../types/personas.types";

export const PERSONAS_QUERY_KEY = ["personas"] as const;

export function usePersonasQuery(params: PersonaQueryParams = {}) {
  return useQuery<PaginatedPersonasResponse, ApiClientError>({
    queryKey: [...PERSONAS_QUERY_KEY, params],
    queryFn: () => personasApi.getPersonas(params),
  });
}

export function usePersonaQuery(id?: string) {
  return useQuery<Persona, ApiClientError>({
    queryKey: [...PERSONAS_QUERY_KEY, "detail", id],
    queryFn: () => personasApi.getPersonaById(id!),
    enabled: Boolean(id),
  });
}

export function useSearchPersonasQuery(params: PersonaQueryParams, enabled = true) {
  return useQuery<SearchPersonaResult, ApiClientError>({
    queryKey: [...PERSONAS_QUERY_KEY, "search", params],
    queryFn: () => personasApi.searchPersonas(params),
    enabled: enabled && Boolean(params.search?.trim()),
  });
}

export function useCreatePersonaMutation() {
  const queryClient = useQueryClient();

  return useMutation<Persona, ApiClientError, CreatePersonaInput>({
    mutationFn: (input: CreatePersonaInput) => personasApi.createPersona(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PERSONAS_QUERY_KEY });
      toast.success("Persona registrada correctamente en el padrón.", {
        description: `${data.nombreCompleto} (${data.numeroDocumento})`,
      });
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "No se pudo registrar la persona.");
    },
  });
}

export function useUpdatePersonaMutation() {
  const queryClient = useQueryClient();

  return useMutation<Persona, ApiClientError, { id: string; input: UpdatePersonaInput }>({
    mutationFn: ({ id, input }) => personasApi.updatePersona(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PERSONAS_QUERY_KEY });
      toast.success("Datos de la persona actualizados correctamente.", {
        description: `${data.nombreCompleto}`,
      });
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "No se pudo actualizar la persona.");
    },
  });
}

export function useDeletePersonaMutation() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, ApiClientError, string>({
    mutationFn: (id: string) => personasApi.deletePersona(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PERSONAS_QUERY_KEY });
      toast.success("Persona eliminada del padrón.");
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "No se pudo eliminar la persona.");
    },
  });
}

export function useChangeCargoMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    CargoAsignadoResponse,
    ApiClientError,
    { id: string; input: ChangeCargoInput }
  >({
    mutationFn: ({ id, input }) => personasApi.changeCargo(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PERSONAS_QUERY_KEY });
      toast.success(`Cargo actualizado a "${data.cargoVigente}".`, {
        description:
          data.rolesSugeridosIds.length > 0
            ? "Se sugirieron nuevos roles para la cuenta; revísalos en Gestión de Usuarios."
            : undefined,
      });
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "No se pudo cambiar el cargo de la persona.");
    },
  });
}

export function useHistorialCriticoQuery(personaId?: string) {
  return useQuery<HistorialCorreccionCritica[], ApiClientError>({
    queryKey: [...PERSONAS_QUERY_KEY, "historial-critico", personaId],
    queryFn: () => personasApi.getHistorialCritico(personaId!),
    enabled: Boolean(personaId),
  });
}
