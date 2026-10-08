import { apiClient, handleApiError } from "@/lib/api-client";
import type {
  AuthResponse,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginCredentials,
} from "../types/auth.types";

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data } = await apiClient.post<AuthResponse>("/auth/login", credentials);
      return data;
    } catch (error) {
      handleApiError(error, "Ocurrió un error al procesar el inicio de sesión.");
    }
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<{ message?: string }> {
    try {
      const { data } = await apiClient.post<{ message?: string }>("/auth/forgot-password", payload);
      return data;
    } catch (error) {
      handleApiError(
        error,
        "No se pudo procesar la solicitud. Verifica el usuario y tu fecha de nacimiento.",
      );
    }
  },

  async changePassword(payload: ChangePasswordPayload): Promise<{ message?: string }> {
    try {
      const { data } = await apiClient.post<{ message?: string }>("/auth/change-password", payload);
      return data;
    } catch (error) {
      handleApiError(error, "No se pudo actualizar la contraseña. Verifica los datos ingresados.");
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.get("/auth/logout");
    } catch (error) {
      handleApiError(error, "Ocurrió un error al cerrar sesión.");
    }
  },

  /** RF-001 V3: fija el rol elegido en el segundo paso del inicio de sesión. */
  async switchRole(roleId: string): Promise<AuthResponse> {
    try {
      const { data } = await apiClient.post<AuthResponse>("/auth/switch-role", { roleId });
      return data;
    } catch (error) {
      handleApiError(error, "No se pudo cambiar de rol.");
    }
  },

  async checkToken(): Promise<AuthResponse> {
    try {
      const { data } = await apiClient.get<AuthResponse>("/auth/check-token");
      return data;
    } catch (error) {
      handleApiError(error, "No se pudo verificar el estado de la sesión.");
    }
  },
};
