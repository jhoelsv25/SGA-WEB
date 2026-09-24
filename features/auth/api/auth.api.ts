import axios from "axios";
import { apiClient, ApiClientError, type ApiErrorPayload } from "@/lib/api-client";
import type { AuthResponse, ForgotPasswordPayload, LoginCredentials } from "../types/auth.types";

function handleAuthApiError(error: unknown): never {
  if (error instanceof ApiClientError) {
    throw error;
  }

  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorPayload | undefined;
    const message =
      data?.message ||
      error.message ||
      "Ocurrió un error al procesar la solicitud de autenticación.";

    throw new ApiClientError({
      message,
      statusCode: error.response?.status,
      errors: data?.errors,
      code: data?.code,
    });
  }

  if (error instanceof Error) {
    throw new ApiClientError({
      message: error.message,
    });
  }

  throw new ApiClientError({
    message: "Error inesperado en la comunicación con el servidor.",
  });
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data } = await apiClient.post<AuthResponse>("/auth/login", credentials);
      return data;
    } catch (error) {
      handleAuthApiError(error);
    }
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<{ message?: string }> {
    try {
      const { data } = await apiClient.post<{ message?: string }>("/auth/forgot-password", payload);
      return data;
    } catch (error) {
      handleAuthApiError(error);
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.get("/auth/logout");
    } catch (error) {
      handleAuthApiError(error);
    }
  },

  async checkToken(): Promise<AuthResponse> {
    try {
      const { data } = await apiClient.get<AuthResponse>("/auth/check-token");
      return data;
    } catch (error) {
      handleAuthApiError(error);
    }
  },
};
