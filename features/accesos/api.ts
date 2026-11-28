import { apiClient, handleApiError } from "@/lib/api-client";

export interface PersonaEncontrada {
  personaId: string;
  documento: string;
  nombreCompleto: string;
  grupos: string[];
}

export interface AccesosPersona extends PersonaEncontrada {
  codigoBiometrico: string | null;
  credencial: { codigo: string; tienePin: boolean; emitidaEn: string } | null;
  cuenta: {
    id: string;
    nombreUsuario: string;
    estado: string;
    esAdministrador: boolean;
  } | null;
}

export async function buscarPersonas(q: string): Promise<PersonaEncontrada[]> {
  try {
    const { data } = await apiClient.get<PersonaEncontrada[]>("/accesos/personas", {
      params: { q },
    });
    return data;
  } catch (error) {
    handleApiError(error, "Error al buscar personas.");
  }
}

export async function getAccesos(personaId: string): Promise<AccesosPersona> {
  try {
    const { data } = await apiClient.get<AccesosPersona>(`/accesos/personas/${personaId}`);
    return data;
  } catch (error) {
    handleApiError(error, "Error al consultar los accesos de la persona.");
  }
}
