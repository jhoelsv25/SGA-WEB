import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiClientError } from "@/lib/api-client";
import { docentesApi } from "../api/docentes.api";
import type {
  CesarDocenteInput,
  CreateDocenteInput,
  CreateDocenteResponse,
  Docente,
  DocenteQueryParams,
  PaginatedDocentesResponse,
  UpdateDocenteInput,
} from "../types/docentes.types";

export const DOCENTES_QUERY_KEY = ["docentes"] as const;

export function useDocentesQuery(params: DocenteQueryParams = {}) {
  return useQuery<PaginatedDocentesResponse, ApiClientError>({
    queryKey: [...DOCENTES_QUERY_KEY, params],
    queryFn: () => docentesApi.getDocentes(params),
  });
}

export function useDocenteQuery(id?: string) {
  return useQuery<Docente, ApiClientError>({
    queryKey: [...DOCENTES_QUERY_KEY, "detail", id],
    queryFn: () => docentesApi.getDocenteById(id!),
    enabled: Boolean(id),
  });
}

export function useCreateDocenteMutation(
  onSuccessCallback?: (data: CreateDocenteResponse) => void,
) {
  const queryClient = useQueryClient();

  return useMutation<CreateDocenteResponse, ApiClientError, CreateDocenteInput>({
    mutationFn: (input: CreateDocenteInput) => docentesApi.createDocente(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: DOCENTES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["personas"] });
      toast.success("Docente registrado exitosamente.", {
        description: `${data.docente.persona.nombreCompleto} (${data.docente.codigo})`,
      });
      onSuccessCallback?.(data);
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "No se pudo registrar el docente.");
    },
  });
}

export function useUpdateDocenteMutation() {
  const queryClient = useQueryClient();

  return useMutation<Docente, ApiClientError, { id: string; input: UpdateDocenteInput }>({
    mutationFn: ({ id, input }) => docentesApi.updateDocente(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: DOCENTES_QUERY_KEY });
      toast.success("Ficha del docente actualizada correctamente.", {
        description: `${data.persona.nombreCompleto} (${data.codigo})`,
      });
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "No se pudo actualizar el docente.");
    },
  });
}

export function useCesarDocenteMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    { docente: Docente; message: string },
    ApiClientError,
    { id: string; input: CesarDocenteInput }
  >({
    mutationFn: ({ id, input }) => docentesApi.cesarDocente(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: DOCENTES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["personas"] });
      toast.success(data.message, {
        description: `${data.docente.persona.nombreCompleto} (${data.docente.codigo})`,
      });
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "No se pudo registrar el cese del docente.");
    },
  });
}

export function useReactivarDocenteMutation() {
  const queryClient = useQueryClient();

  return useMutation<{ docente: Docente; message: string }, ApiClientError, { id: string }>({
    mutationFn: ({ id }) => docentesApi.reactivarDocente(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: DOCENTES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["personas"] });
      toast.success(data.message, {
        description: `${data.docente.persona.nombreCompleto} (${data.docente.codigo})`,
      });
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "No se pudo reactivar al docente.");
    },
  });
}
