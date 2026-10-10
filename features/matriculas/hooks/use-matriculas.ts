import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiClientError } from "@/lib/api-client";
import {
  anularMatricula,
  cambiarSeccionMatricula,
  crearMatricula,
  descargarConstanciaPdf,
  getMatriculas,
  matricularMasivo,
  retirarMatricula,
  trasladarMatricula,
} from "../api";
import type {
  CambiarSeccionPayload,
  CrearMatriculaPayload,
  CrearMatriculaResponse,
  MatriculaItem,
  MatriculaMasivaPayload,
  MatriculaMasivaResponse,
  MatriculaQueryParams,
  RetirarMatriculaPayload,
  TrasladarMatriculaPayload,
} from "../types";

export const MATRICULAS_QUERY_KEY = ["matriculas"] as const;

export function useMatriculasQuery(params: MatriculaQueryParams = {}) {
  return useQuery<{ items: MatriculaItem[]; total: number }, ApiClientError>({
    queryKey: [...MATRICULAS_QUERY_KEY, params],
    queryFn: () => getMatriculas(params),
  });
}

export function useCrearMatriculaMutation(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation<CrearMatriculaResponse, ApiClientError, CrearMatriculaPayload>({
    mutationFn: (payload) => crearMatricula(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: MATRICULAS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["secciones"] });
      toast.success(`Matrícula registrada exitosamente (${data.matricula.codigo}).`);
      if (data.advertencia) {
        toast.warning(data.advertencia, { duration: 6000 });
      }
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Error al registrar la matrícula.");
    },
  });
}

export function useMatriculaMasivaMutation(onSuccess?: (res: MatriculaMasivaResponse) => void) {
  const queryClient = useQueryClient();

  return useMutation<MatriculaMasivaResponse, ApiClientError, MatriculaMasivaPayload>({
    mutationFn: (payload) => matricularMasivo(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: MATRICULAS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["secciones"] });
      toast.success(data.mensaje);
      onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(error.message || "Error en la matrícula masiva.");
    },
  });
}

export function useRetirarMatriculaMutation(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation<
    MatriculaItem,
    ApiClientError,
    { id: string; payload: RetirarMatriculaPayload }
  >({
    mutationFn: ({ id, payload }) => retirarMatricula(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: MATRICULAS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["secciones"] });
      toast.success(`Estudiante retirado (${data.codigo}). Accesos y credenciales desactivados.`);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Error al retirar la matrícula.");
    },
  });
}

export function useTrasladarMatriculaMutation(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation<
    MatriculaItem,
    ApiClientError,
    { id: string; payload: TrasladarMatriculaPayload }
  >({
    mutationFn: ({ id, payload }) => trasladarMatricula(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: MATRICULAS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["secciones"] });
      toast.success(`Estudiante trasladado (${data.codigo}). Accesos desactivados.`);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "Error al trasladar la matrícula.");
    },
  });
}

export function useCambiarSeccionMutation(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation<MatriculaItem, ApiClientError, { id: string; payload: CambiarSeccionPayload }>(
    {
      mutationFn: ({ id, payload }) => cambiarSeccionMatricula(id, payload),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: MATRICULAS_QUERY_KEY });
        queryClient.invalidateQueries({ queryKey: ["secciones"] });
        toast.success(`Cambio a sección ${data.seccionNombre} realizado correctamente.`);
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message || "Error al cambiar de sección.");
      },
    },
  );
}

export function useAnularMatriculaMutation(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, ApiClientError, string>({
    mutationFn: (id) => anularMatricula(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: MATRICULAS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["secciones"] });
      toast.success(data.message || "Matrícula anulada correctamente.");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || "No se pudo anular la matrícula.");
    },
  });
}

export function useDescargarConstancia() {
  return useMutation<void, ApiClientError, { id: string; codigo: string }>({
    mutationFn: ({ id, codigo }) => descargarConstanciaPdf(id, codigo),
    onSuccess: () => {
      toast.success("Constancia de matrícula descargada.");
    },
    onError: (error) => {
      toast.error(error.message || "Error al descargar la constancia.");
    },
  });
}
