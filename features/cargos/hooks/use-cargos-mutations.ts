import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { cargosApi } from "../api/cargos.api";
import type { CreateCargoInput, UpdateCargoInput } from "../types/cargos.types";
import { cargosKeys } from "./use-cargos-query";

export function useCreateCargoMutation(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCargoInput) => cargosApi.createCargo(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: cargosKeys.all });
      toast.success(`Cargo "${data.nombre}" creado exitosamente.`);
      onSuccessCallback?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear el cargo.");
    },
  });
}

export function useUpdateCargoMutation(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCargoInput }) =>
      cargosApi.updateCargo(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: cargosKeys.all });
      toast.success(`Cargo "${data.nombre}" actualizado.`);
      onSuccessCallback?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar el cargo.");
    },
  });
}

export function useDeactivateCargoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cargosApi.deactivateCargo(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: cargosKeys.all });
      toast.success(`Cargo "${data.nombre}" desactivado.`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al desactivar el cargo.");
    },
  });
}

export function useReactivateCargoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cargosApi.reactivateCargo(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: cargosKeys.all });
      toast.success(`Cargo "${data.nombre}" reactivado.`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al reactivar el cargo.");
    },
  });
}
