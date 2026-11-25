import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiClientError } from "@/lib/api-client";
import { apoderadosApi, type ApoderadosQueryParams } from "../api/apoderados.api";
import type {
  Apoderado,
  CreateApoderadoPayload,
  CreateApoderadoResponse,
  PaginatedApoderadosResponse,
  ResumenApoderadosResponse,
  UpdateApoderadoPayload,
  VincularEstudiantePayload,
  VinculoFamiliar,
} from "../types/apoderados.types";

export const APODERADOS_QUERY_KEY = ["apoderados"] as const;

export function useApoderadosQuery(params: ApoderadosQueryParams = {}) {
  return useQuery<PaginatedApoderadosResponse, ApiClientError>({
    queryKey: [...APODERADOS_QUERY_KEY, params],
    queryFn: () => apoderadosApi.getApoderados(params),
    placeholderData: keepPreviousData,
  });
}

export function useResumenApoderadosQuery(
  params: Omit<ApoderadosQueryParams, "cursor" | "limit"> = {},
) {
  return useQuery<ResumenApoderadosResponse, ApiClientError>({
    queryKey: [...APODERADOS_QUERY_KEY, "resumen", params],
    queryFn: () => apoderadosApi.getResumenApoderados(params),
    placeholderData: keepPreviousData,
  });
}

export function useApoderadoQuery(id?: string) {
  return useQuery<Apoderado, ApiClientError>({
    queryKey: [...APODERADOS_QUERY_KEY, "detail", id],
    queryFn: () => apoderadosApi.getApoderadoById(id!),
    enabled: Boolean(id),
  });
}

export function useApoderadosByEstudianteQuery(estudianteId?: string) {
  return useQuery<Apoderado[], ApiClientError>({
    queryKey: [...APODERADOS_QUERY_KEY, "estudiante", estudianteId],
    queryFn: () => apoderadosApi.getApoderadosByEstudiante(estudianteId!),
    enabled: Boolean(estudianteId),
  });
}

export function useCreateApoderadoMutation(
  onSuccessCallback?: (data: CreateApoderadoResponse) => void,
) {
  const queryClient = useQueryClient();

  return useMutation<CreateApoderadoResponse, ApiClientError, CreateApoderadoPayload>({
    mutationFn: (payload: CreateApoderadoPayload) => apoderadosApi.createApoderado(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: APODERADOS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["personas"] });
      queryClient.invalidateQueries({ queryKey: ["estudiantes"] });
      toast.success("Apoderado registrado exitosamente.", {
        description: `${data.apoderado.persona.nombreCompleto}`,
      });
      onSuccessCallback?.(data);
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "No se pudo registrar el apoderado.");
    },
  });
}

export function useUpdateApoderadoMutation() {
  const queryClient = useQueryClient();

  return useMutation<Apoderado, ApiClientError, { id: string; payload: UpdateApoderadoPayload }>({
    mutationFn: ({ id, payload }) => apoderadosApi.updateApoderado(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: APODERADOS_QUERY_KEY });
      toast.success("Ficha del apoderado actualizada correctamente.", {
        description: `${data.persona.nombreCompleto}`,
      });
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "No se pudo actualizar los datos del apoderado.");
    },
  });
}

export function useDeleteApoderadoMutation() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, ApiClientError, string>({
    mutationFn: (id: string) => apoderadosApi.deleteApoderado(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: APODERADOS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["personas"] });
      toast.success(data.message || "Ficha de apoderado eliminada.");
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "No se pudo eliminar el apoderado.");
    },
  });
}

export function useVincularEstudianteMutation() {
  const queryClient = useQueryClient();

  return useMutation<VinculoFamiliar, ApiClientError, VincularEstudiantePayload>({
    mutationFn: (payload: VincularEstudiantePayload) => apoderadosApi.vincularEstudiante(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APODERADOS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["estudiantes"] });
      toast.success("Vínculo familiar registrado correctamente.");
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "No se pudo vincular el apoderado con el estudiante.");
    },
  });
}

export function useDesvincularEstudianteMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    { message: string },
    ApiClientError,
    { estudianteId: string; apoderadoId: string }
  >({
    mutationFn: ({ estudianteId, apoderadoId }) =>
      apoderadosApi.desvincularEstudiante(estudianteId, apoderadoId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: APODERADOS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["estudiantes"] });
      toast.success(data.message || "Vínculo familiar retirado.");
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "No se pudo retirar el vínculo familiar.");
    },
  });
}
