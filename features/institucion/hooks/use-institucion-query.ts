"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { ApiClientError } from "@/lib/api-client";
import { getInstitucion, updateInstitucion, uploadInstitucionLogo } from "../api";
import type { UpdateInstitucionPayload } from "../types";

export const institucionKeys = {
  all: ["institucion"] as const,
  detail: () => [...institucionKeys.all, "detail"] as const,
};

export function useInstitucionQuery() {
  return useQuery({
    queryKey: institucionKeys.detail(),
    queryFn: getInstitucion,
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
}

export function useUpdateInstitucionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateInstitucionPayload) => updateInstitucion(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(institucionKeys.detail(), data);
      toast.success("Los datos se guardaron correctamente.");
    },
    onError: (error: unknown) => {
      if (error instanceof ApiClientError) {
        toast.error(error.message || "Error al actualizar los datos de la institución.");
      } else {
        toast.error("Ocurrió un error inesperado al actualizar la institución.");
      }
    },
  });
}

export function useUploadLogoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadInstitucionLogo(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: institucionKeys.detail() });
      toast.success("Logo actualizado correctamente.");
    },
    onError: (error: unknown) => {
      if (error instanceof ApiClientError) {
        toast.error(error.message || "El logo debe ser una imagen PNG o JPG de hasta 1 MB.");
      } else {
        toast.error("Error al subir el archivo de logo.");
      }
    },
  });
}
