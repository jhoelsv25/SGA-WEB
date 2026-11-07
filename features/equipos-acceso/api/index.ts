import { apiClient } from "@/lib/api-client";
import type { AccionEquipoAcceso, EquipoAcceso, EstadoEquipoAcceso } from "../types";

export async function getEquiposAcceso(estado?: EstadoEquipoAcceso): Promise<EquipoAcceso[]> {
  const response = await apiClient.get<EquipoAcceso[]>("/equipos-acceso", {
    params: estado === undefined ? undefined : { estado },
  });
  return response.data;
}

/** Autoriza, rechaza o revoca un equipo; `motivo` solo aplica a rechazar y revocar. */
export async function resolverEquipoAcceso(
  id: string,
  accion: AccionEquipoAcceso,
  motivo?: string,
): Promise<EquipoAcceso> {
  const response = await apiClient.post<EquipoAcceso>(
    `/equipos-acceso/${id}/${accion}`,
    accion === "autorizar" ? {} : { motivo: motivo?.trim() || undefined },
  );
  return response.data;
}
