import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiClientError } from "@/lib/api-client";
import { credencialesApi } from "../api/credenciales.api";
import type {
  CambiarPinInput,
  CarneDatos,
  CredencialResponse,
  ReemitirCredencialInput,
} from "../types/credenciales.types";

export const CREDENCIALES_QUERY_KEY = ["credenciales"] as const;

export function useCarneDatosQuery(personaId?: string) {
  return useQuery<CarneDatos, ApiClientError>({
    queryKey: [...CREDENCIALES_QUERY_KEY, "carne", personaId],
    queryFn: () => credencialesApi.getCarneDatos(personaId!),
    enabled: Boolean(personaId),
  });
}

export function useCredencialActivaQuery(personaId?: string) {
  return useQuery<CredencialResponse, ApiClientError>({
    queryKey: [...CREDENCIALES_QUERY_KEY, "activa", personaId],
    queryFn: () => credencialesApi.getCredencialActiva(personaId!),
    enabled: Boolean(personaId),
  });
}

export function useReemitirCredencialMutation(
  onSuccessCallback?: (data: CredencialResponse) => void,
) {
  const queryClient = useQueryClient();

  return useMutation<CredencialResponse, ApiClientError, ReemitirCredencialInput>({
    mutationFn: (input: ReemitirCredencialInput) => credencialesApi.reemitirCredencial(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CREDENCIALES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["estudiantes"] });
      queryClient.invalidateQueries({ queryKey: ["docentes"] });
      toast.success("Credencial reemitida correctamente.", {
        description: data.mensaje || "La credencial anterior quedó anulada y se emitió una nueva.",
      });
      onSuccessCallback?.(data);
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "No se pudo reemitir la credencial.");
    },
  });
}

export function useCambiarPinMutation(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation<
    { mensaje: string },
    ApiClientError,
    { personaId: string; input: CambiarPinInput }
  >({
    mutationFn: ({ personaId, input }) => credencialesApi.cambiarPinPersona(personaId, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CREDENCIALES_QUERY_KEY });
      toast.success("PIN de marcación actualizado.", {
        description: data.mensaje,
      });
      onSuccessCallback?.();
    },
    onError: (error: ApiClientError) => {
      toast.error(error.message || "No se pudo actualizar el PIN.");
    },
  });
}
