import { apiClient } from "@/lib/api-client";
import type { UpdateVariablePayload, VariableSistema } from "../types";

export async function getVariables(modulo?: string): Promise<VariableSistema[]> {
  const params = modulo ? { modulo } : undefined;
  const response = await apiClient.get<VariableSistema[]>("/variables-sistema", { params });
  return response.data;
}

export async function getVariableByCodigo(codigo: string): Promise<VariableSistema> {
  const response = await apiClient.get<VariableSistema>(
    `/variables-sistema/${encodeURIComponent(codigo)}`,
  );
  return response.data;
}

export async function getVariableHistorial(codigo: string): Promise<VariableSistema[]> {
  const response = await apiClient.get<VariableSistema[]>(
    `/variables-sistema/${encodeURIComponent(codigo)}/historial`,
  );
  return response.data;
}

export async function updateVariable(
  codigo: string,
  payload: UpdateVariablePayload,
): Promise<VariableSistema> {
  const response = await apiClient.patch<VariableSistema>(
    `/variables-sistema/${encodeURIComponent(codigo)}`,
    payload,
  );
  return response.data;
}
