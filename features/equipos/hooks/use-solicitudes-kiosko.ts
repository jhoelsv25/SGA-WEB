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
import {
  ESTADO_SOLICITUD_KIOSKO,
  KIOSK_SECRETO_STORAGE_KEY,
  KIOSK_TOKEN_STORAGE_KEY,
} from "../consts";
import { equipoKeys } from "./use-equipos-query";

const solicitudKeys = {
  lista: ["solicitudes-kiosko", "lista"] as const,
  propia: ["solicitudes-kiosko", "propia"] as const,
};

/** Se crea una sola vez por navegador. getRandomValues también funciona sin HTTPS. */
function obtenerSecretoKiosko(): string {
  let secreto = localStorage.getItem(KIOSK_SECRETO_STORAGE_KEY);
  if (!secreto) {
    secreto = Array.from(crypto.getRandomValues(new Uint8Array(32)), (b) =>
      b.toString(16).padStart(2, "0"),
    ).join("");
    localStorage.setItem(KIOSK_SECRETO_STORAGE_KEY, secreto);
  }
  return secreto;
}

/** Lado kiosko: pide aprobación, consulta cada 10 s y activa el equipo al aprobarse. */
export function useSolicitudKiosko(onAprobado: () => void) {
  const consulta = useQuery({
    queryKey: solicitudKeys.propia,
    queryFn: () => registrarSolicitudKiosko(obtenerSecretoKiosko()),
    refetchInterval: 10_000,
    gcTime: 0,
  });
  const estado = consulta.data?.estado;

  React.useEffect(() => {
    if (estado !== ESTADO_SOLICITUD_KIOSKO.APROBADA) return;
    const secreto = obtenerSecretoKiosko();
    // Solo una vez: si el equipo está desactivado no se debe reintentar en bucle
    if (localStorage.getItem(KIOSK_TOKEN_STORAGE_KEY) === secreto) return;
    localStorage.setItem(KIOSK_TOKEN_STORAGE_KEY, secreto);
    // El evento "storage" no se emite en la misma pestaña
    window.dispatchEvent(new Event("storage"));
    onAprobado();
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
