"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiClientError } from "@/lib/api-client";
import { toast } from "@/lib/toast";
import {
  crearComentarioMuro,
  crearPublicacionMuro,
  editarComentarioMuro,
  editarPublicacionMuro,
  enviarMensajeChat,
  fijarPublicacionMuro,
  getActividadMaterial,
  getActividadTarea,
  getChatNoLeidos,
  getComentariosMuro,
  getHistorialModeracion,
  getMensajesChat,
  getPublicacionesMuro,
  marcarChatLeido,
  ocultarContenido,
  registrarActividad,
  restaurarContenido,
} from "../api";
import type { TipoModeracion } from "../types";
import { aulaKeys } from "./query-keys";

// ── RF-017: Interacción y Actividad Hooks ──

// ── Muro ──

export function usePublicacionesMuro(cursoSeccionId: string) {
  return useQuery({
    queryKey: aulaKeys.muro(cursoSeccionId),
    queryFn: () => getPublicacionesMuro(cursoSeccionId),
    enabled: Boolean(cursoSeccionId),
    staleTime: 10_000,
  });
}

export function useCrearPublicacionMuro(cursoSeccionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      payload,
      archivo,
    }: {
      payload: { contenido?: string; enlaceAdjunto?: string };
      archivo?: File | null;
    }) => crearPublicacionMuro(cursoSeccionId, payload, archivo),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: aulaKeys.muro(cursoSeccionId) });
      toast.success("Publicación creada.");
    },
    onError: (error: ApiClientError) => toast.error(error.message),
  });
}

export function useEditarPublicacionMuro(cursoSeccionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
      archivo,
    }: {
      id: string;
      payload: { contenido?: string; enlaceAdjunto?: string };
      archivo?: File | null;
    }) => editarPublicacionMuro(id, payload, archivo),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: aulaKeys.muro(cursoSeccionId) });
      toast.success("Publicación editada.");
    },
    onError: (error: ApiClientError) => toast.error(error.message),
  });
}

export function useFijarPublicacionMuro(cursoSeccionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, fijada }: { id: string; fijada: boolean }) =>
      fijarPublicacionMuro(id, fijada),
    onSuccess: (_, { fijada }) => {
      void queryClient.invalidateQueries({ queryKey: aulaKeys.muro(cursoSeccionId) });
      toast.success(fijada ? "Publicación fijada arriba del muro." : "Publicación desfijada.");
    },
    onError: (error: ApiClientError) => toast.error(error.message),
  });
}

// ── Comentarios ──

export function useComentariosMuro(publicacionId: string) {
  return useQuery({
    queryKey: aulaKeys.comentarios(publicacionId),
    queryFn: () => getComentariosMuro(publicacionId),
    enabled: Boolean(publicacionId),
    staleTime: 10_000,
  });
}

export function useCrearComentarioMuro(publicacionId: string, cursoSeccionId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (contenido: string) => crearComentarioMuro(publicacionId, contenido),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: aulaKeys.comentarios(publicacionId) });
      if (cursoSeccionId) {
        void queryClient.invalidateQueries({ queryKey: aulaKeys.muro(cursoSeccionId) });
      }
      toast.success("Comentario publicado.");
    },
    onError: (error: ApiClientError) => toast.error(error.message),
  });
}

export function useEditarComentarioMuro(publicacionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, contenido }: { id: string; contenido: string }) =>
      editarComentarioMuro(id, contenido),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: aulaKeys.comentarios(publicacionId) });
      toast.success("Comentario editado.");
    },
    onError: (error: ApiClientError) => toast.error(error.message),
  });
}

// ── Chat Grupal ──

export function useMensajesChat(cursoSeccionId: string) {
  return useQuery({
    queryKey: aulaKeys.chat(cursoSeccionId),
    queryFn: () => getMensajesChat(cursoSeccionId),
    enabled: Boolean(cursoSeccionId),
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });
}

export function useEnviarMensajeChat(cursoSeccionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      payload,
      archivo,
    }: {
      payload: { mensaje?: string; enlaceAdjunto?: string };
      archivo?: File | null;
    }) => enviarMensajeChat(cursoSeccionId, payload, archivo),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: aulaKeys.chat(cursoSeccionId) });
      void queryClient.invalidateQueries({ queryKey: aulaKeys.chatNoLeidos(cursoSeccionId) });
    },
    onError: (error: ApiClientError) => toast.error(error.message),
  });
}

export function useChatNoLeidos(cursoSeccionId: string) {
  return useQuery({
    queryKey: aulaKeys.chatNoLeidos(cursoSeccionId),
    queryFn: () => getChatNoLeidos(cursoSeccionId),
    enabled: Boolean(cursoSeccionId),
    refetchInterval: 12_000,
  });
}

export function useMarcarChatLeido(cursoSeccionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => marcarChatLeido(cursoSeccionId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: aulaKeys.chatNoLeidos(cursoSeccionId) });
    },
  });
}

// ── Moderación ──

export function useOcultarContenido(cursoSeccionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tipo, id, motivo }: { tipo: TipoModeracion; id: string; motivo: string }) =>
      ocultarContenido(tipo, id, motivo),
    onSuccess: (res) => {
      void queryClient.invalidateQueries({ queryKey: aulaKeys.muro(cursoSeccionId) });
      void queryClient.invalidateQueries({ queryKey: aulaKeys.chat(cursoSeccionId) });
      void queryClient.invalidateQueries({ queryKey: aulaKeys.moderacion(cursoSeccionId) });
      toast.success(res.mensaje);
    },
    onError: (error: ApiClientError) => toast.error(error.message),
  });
}

export function useRestaurarContenido(cursoSeccionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tipo, id }: { tipo: TipoModeracion; id: string }) =>
      restaurarContenido(tipo, id),
    onSuccess: (res) => {
      void queryClient.invalidateQueries({ queryKey: aulaKeys.muro(cursoSeccionId) });
      void queryClient.invalidateQueries({ queryKey: aulaKeys.chat(cursoSeccionId) });
      void queryClient.invalidateQueries({ queryKey: aulaKeys.moderacion(cursoSeccionId) });
      toast.success(res.mensaje);
    },
    onError: (error: ApiClientError) => toast.error(error.message),
  });
}

export function useHistorialModeracion(cursoSeccionId: string) {
  return useQuery({
    queryKey: aulaKeys.moderacion(cursoSeccionId),
    queryFn: () => getHistorialModeracion(cursoSeccionId),
    enabled: Boolean(cursoSeccionId),
    staleTime: 10_000,
  });
}

// ── Actividad ──

export function useRegistrarActividad() {
  return useMutation({
    mutationFn: (payload: {
      materialId?: string;
      tareaId?: string;
      accion: "visualizo" | "descargo" | "abrio" | "completo";
    }) => registrarActividad(payload),
  });
}

export function useActividadMaterial(materialId: string) {
  return useQuery({
    queryKey: aulaKeys.actividadMaterial(materialId),
    queryFn: () => getActividadMaterial(materialId),
    enabled: Boolean(materialId),
    staleTime: 15_000,
  });
}

export function useActividadTarea(tareaId: string) {
  return useQuery({
    queryKey: aulaKeys.actividadTarea(tareaId),
    queryFn: () => getActividadTarea(tareaId),
    enabled: Boolean(tareaId),
    staleTime: 15_000,
  });
}
