import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiClientError } from "@/lib/api-client";
import { estudiantesApi } from "../api/estudiantes.api";
import type {
  CreateEstudianteInput,
  CreateEstudianteResponse,
  Estudiante,
  EstudianteQueryParams,
  PaginatedEstudiantesResponse,
  UpdateEstudianteInput,
} from "../types/estudiantes.types";

export const ESTUDIANTES_QUERY_KEY = ["estudiantes"] as const;

export function useEstudiantesQuery(params: EstudianteQueryParams = {}) {
  return useQuery<PaginatedEstudiantesResponse, ApiClientError>({
    queryKey: [...ESTUDIANTES_QUERY_KEY, params],
    queryFn: () => estudiantesApi.getEstudiantes(params),
  });
}

export function useEstudianteQuery(id?: string) {
  return useQuery<Estudiante, ApiClientError>({
    queryKey: [...ESTUDIANTES_QUERY_KEY, "detail", id],
    queryFn: () => estudiantesApi.getEstudianteById(id!),
    enabled: Boolean(id),
  });
}

export function useCreateEstudianteMutation(
  onSuccessCallback?: (data: CreateEstudianteResponse) => void,
) {
  const queryClient = useQueryClient();

  return useMutation<CreateEstudianteResponse, ApiClientError, CreateEstudianteInput>({
    mutationFn: (input: CreateEstudianteInput) => estudiantesApi.createEstudiante(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ESTUDIANTES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["personas"] });
      toast.success("Estudiante registrado exitosamente.", {
        description: `${data.estudiante.persona.nombreCompleto} (SIAGIE: ${data.estudiante.codigo})`,
      });
      onSuccessCallback?.(data);
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "No se pudo registrar el estudiante.");
    },
  });
}

export function useUpdateEstudianteMutation() {
  const queryClient = useQueryClient();

  return useMutation<Estudiante, ApiClientError, { id: string; input: UpdateEstudianteInput }>({
    mutationFn: ({ id, input }) => estudiantesApi.updateEstudiante(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ESTUDIANTES_QUERY_KEY });
      toast.success("Ficha del estudiante actualizada correctamente.", {
        description: `${data.persona.nombreCompleto} (${data.codigo})`,
      });
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "No se pudo actualizar la ficha del estudiante.");
    },
  });
}

export function useDeleteEstudianteMutation() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, ApiClientError, string>({
    mutationFn: (id: string) => estudiantesApi.deleteEstudiante(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ESTUDIANTES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["personas"] });
      toast.success("Ficha del estudiante eliminada correctamente.");
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "No se pudo eliminar la ficha del estudiante.");
    },
  });
}
