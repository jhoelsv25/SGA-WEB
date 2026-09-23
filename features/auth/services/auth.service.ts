import { apiClient } from "@/lib/api-client";
import type { AuthResponse, LoginCredentials } from "../types/auth.types";

export const authService = {
  /**
   * Envía credenciales de autenticación al backend.
   * Las cookies HttpOnly son almacenadas automáticamente por el navegador vía withCredentials.
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>("/auth/login", credentials);
    return data;
  },

  /**
   * Cierra la sesión activa.
   */
  async logout(): Promise<void> {
    await apiClient.get("/auth/logout");
  },

  /**
   * Verifica la validez del token de sesión actual.
   */
  async checkToken(): Promise<AuthResponse> {
    const { data } = await apiClient.get<AuthResponse>("/auth/check-token");
    return data;
  },
};
