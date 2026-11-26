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
        "No se pudo verificar la identidad. Revisa el usuario y la fecha de nacimiento.",
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

  /** Inicia una vista simulada como otro usuario (solo Administrador / Soporte TI). */
  async impersonate(userId: string, roleId?: string): Promise<AuthResponse> {
    try {
      const { data } = await apiClient.post<AuthResponse>("/auth/impersonate", {
        userId,
        roleId,
      });
      return data;
    } catch (error) {
      handleApiError(error, "No se pudo ingresar en vista simulada.");
    }
  },

  /** Sale de la vista simulada y restaura la sesión de Administrador / Soporte TI. */
  async stopImpersonate(): Promise<AuthResponse> {
    try {
      const { data } = await apiClient.post<AuthResponse>("/auth/stop-impersonate");
      return data;
    } catch (error) {
      handleApiError(error, "No se pudo restaurar la sesión original.");
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
