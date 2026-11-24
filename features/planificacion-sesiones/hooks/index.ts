"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/features/auth";
import { toast } from "@/lib/toast";
import {
  comentarPlanificacion,
  copiarPlanificacion,
  crearDesempeno,
  editarDesempeno,
  getAreas,
  getCompetencias,
  getDesempenos,
  getDocumento,
  getEnfoques,
  getOpciones,
  getPanelSupervision,
  getPlanificacion,
  getPlanificacionSupervision,
  getSemana,
  guardarPlanificacion,
  marcarLista,
  registrarHorasReales,
} from "../api";
import type { GuardarPlanificacionPayload, HorasRealesPayload } from "../types";

export const planKeys = {
  all: ["planificacion-sesiones"] as const,
  semana: (fecha?: string) => [...planKeys.all, "semana", fecha ?? "hoy"] as const,
  detalle: (id: string) => [...planKeys.all, "detalle", id] as const,
  documento: (id: string) => [...planKeys.all, "documento", id] as const,
  catalogo: ["catalogo-curricular"] as const,
  supervision: (fecha?: string) => [...planKeys.all, "supervision", fecha ?? "hoy"] as const,
  supervisionDetalle: (id: string) => [...planKeys.all, "supervision-detalle", id] as const,
};

export function useSemana(fecha?: string) {
  return useQuery({ queryKey: planKeys.semana(fecha), queryFn: () => getSemana(fecha) });
}

export function usePlanificacion(id?: string) {
  return useQuery({
    queryKey: planKeys.detalle(id ?? ""),
    queryFn: () => getPlanificacion(id as string),
    enabled: Boolean(id),
  });
}

export function useDocumento(id?: string, habilitado = true) {
  return useQuery({
    queryKey: planKeys.documento(id ?? ""),
    queryFn: () => getDocumento(id as string),
    enabled: Boolean(id) && habilitado,
  });
}

export function useAreas() {
  return useQuery({
    queryKey: [...planKeys.catalogo, "areas"],
    queryFn: getAreas,
    staleTime: 300_000,
  });
}

export function useCompetencias(area?: string) {
  return useQuery({
    queryKey: [...planKeys.catalogo, "competencias", area ?? "todas"],
    queryFn: () => getCompetencias(area),
    staleTime: 300_000,
  });
}

export function useDesempenos(competenciaId?: string, grado?: number) {
  return useQuery({
    queryKey: [...planKeys.catalogo, "desempenos", competenciaId, grado ?? "todos"],
    queryFn: () => getDesempenos(competenciaId as string, grado),
    enabled: Boolean(competenciaId),
    staleTime: 300_000,
  });
}

export function useEnfoques() {
  return useQuery({
    queryKey: [...planKeys.catalogo, "enfoques"],
    queryFn: getEnfoques,
    staleTime: 300_000,
  });
}

export function useOpciones() {
  return useQuery({
    queryKey: [...planKeys.catalogo, "opciones"],
    queryFn: () => getOpciones(),
    staleTime: 300_000,
  });
}

export function useGuardarPlanificacion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: GuardarPlanificacionPayload) => guardarPlanificacion(payload),
    onSuccess: (r) => {
      toast.success(r.mensaje);
      qc.setQueryData(planKeys.detalle(r.planificacion.id), r.planificacion);
      void qc.invalidateQueries({ queryKey: [...planKeys.all, "semana"] });
      void qc.invalidateQueries({ queryKey: planKeys.documento(r.planificacion.id) });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useMarcarLista() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => marcarLista(id),
    onSuccess: (r) => {
      toast.success(r.mensaje);
      qc.setQueryData(planKeys.detalle(r.planificacion.id), r.planificacion);
      void qc.invalidateQueries({ queryKey: [...planKeys.all, "semana"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useCopiarPlanificacion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { id: string; destinos: { horarioId: string; fecha: string }[] }) =>
      copiarPlanificacion(v.id, v.destinos),
    onSuccess: (r) => {
      toast.success(r.mensaje);
      void qc.invalidateQueries({ queryKey: [...planKeys.all, "semana"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

// ─── Supervisión ───
export function usePanelSupervision(fecha?: string) {
  return useQuery({
    queryKey: planKeys.supervision(fecha),
    queryFn: () => getPanelSupervision(fecha),
  });
}

export function usePlanificacionSupervision(id: string) {
  return useQuery({
    queryKey: planKeys.supervisionDetalle(id),
    queryFn: () => getPlanificacionSupervision(id),
  });
}

export function useComentarPlanificacion(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (texto: string) => comentarPlanificacion(id, texto),
    onSuccess: (r) => {
      toast.success(r.mensaje);
      void qc.invalidateQueries({ queryKey: planKeys.supervisionDetalle(id) });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useRegistrarHorasReales() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { sesionId: string; payload: HorasRealesPayload }) =>
      registrarHorasReales(v.sesionId, v.payload),
    onSuccess: (r) => {
      toast.success(r.mensaje);
      void qc.invalidateQueries({ queryKey: [...planKeys.all, "supervision"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

// ─── Catálogo (Dirección) ───
export function useCrearDesempeno() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: crearDesempeno,
    onSuccess: () => {
      toast.success("Desempeño agregado.");
      void qc.invalidateQueries({ queryKey: planKeys.catalogo });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useEditarDesempeno() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { id: string; texto: string }) => editarDesempeno(v.id, v.texto),
    onSuccess: () => {
      toast.success("Desempeño corregido. Las sesiones ya planificadas conservan su texto.");
      void qc.invalidateQueries({ queryKey: planKeys.catalogo });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useEsDocente() {
  const { data } = useSession();
  const rol = data?.user.activeRoleName ?? data?.user.roles?.[0] ?? "";
  return rol === "Docente";
}
