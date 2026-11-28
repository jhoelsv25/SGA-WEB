"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { ApiClientError } from "@/lib/api-client";
import {
  aprobarSolicitudKiosko,
  getSolicitudesKiosko,
  rechazarSolicitudKiosko,
  registrarSolicitudKiosko,
} from "../api";
import { ESTADO_SOLICITUD_KIOSKO } from "../consts";
import { equipoKeys } from "./use-equipos-query";

const solicitudKeys = {
  lista: ["solicitudes-kiosko", "lista"] as const,
  propia: ["solicitudes-kiosko", "propia"] as const,
};

// Fuera del hook: la pantalla se vuelve a montar al revalidar y no se debe reintentar en bucle
let activacionAvisada = false;

/** Lado kiosko: pide aprobación, consulta cada 10 s y activa el equipo al aprobarse. */
export function useSolicitudKiosko(onAprobado: () => void) {
  const consulta = useQuery({
    queryKey: solicitudKeys.propia,
    queryFn: registrarSolicitudKiosko,
    refetchInterval: 10_000,
    gcTime: 0,
  });
  const estado = consulta.data?.estado;

  React.useEffect(() => {
    if (estado === undefined) return;
    if (estado !== ESTADO_SOLICITUD_KIOSKO.APROBADA) {
      activacionAvisada = false;
    } else if (!activacionAvisada) {
      activacionAvisada = true;
      onAprobado();
    }
  }, [estado, onAprobado]);

  return consulta;
}

export function useSolicitudesKioskoQuery() {
  return useQuery({
    queryKey: solicitudKeys.lista,
    queryFn: getSolicitudesKiosko,
    refetchInterval: 10_000,
  });
}

export function useResolverSolicitudKioskoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, equipoId }: { id: string; equipoId?: string }) =>
      equipoId ? aprobarSolicitudKiosko(id, equipoId) : rechazarSolicitudKiosko(id),
    onSuccess: (_data, { equipoId }) => {
      queryClient.invalidateQueries({ queryKey: solicitudKeys.lista });
      queryClient.invalidateQueries({ queryKey: equipoKeys.lists() });
      toast.success(
        equipoId ? "Dispositivo aprobado. El kiosko se activará solo." : "Solicitud rechazada.",
      );
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof ApiClientError
          ? error.message || "No se pudo completar la acción."
          : "Ocurrió un error inesperado.",
      );
    },
  });
}
