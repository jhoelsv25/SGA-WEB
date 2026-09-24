"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { UseFormSetError } from "react-hook-form";
import { authApi } from "../api/auth.api";
import type { LoginCredentials, AuthResponse, ForgotPasswordPayload } from "../types/auth.types";
import type { LoginFormValues } from "../schemas/login.schema";
import type { RecoverFormValues } from "../schemas/recover.schema";
import { handleFormApiErrors } from "../utils/auth-error.utils";
import type { ApiClientError } from "@/lib/api-client";
import { toast } from "@/lib/toast";

export interface UseLoginOptions {
  setError?: UseFormSetError<LoginFormValues>;
  onSuccess?: (data: AuthResponse) => void;
  onError?: (error: ApiClientError) => void;
  redirectTo?: string;
}

/**
 * Hook para inicio de sesión institucional.
 * Accede directamente a error.message normalizado por authApi.
 */
export function useLogin(options?: UseLoginOptions) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, ApiClientError, LoginCredentials>({
    mutationKey: ["auth", "login"],
    mutationFn: (credentials) => authApi.login(credentials),
    onSuccess: (data) => {
      options?.onSuccess?.(data);
      toast.success(data.message || "Bienvenido al sistema");
      queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
      router.push(options?.redirectTo || "/dashboard");
      router.refresh();
    },
    onError: (error) => {
      if (error.errors && options?.setError) {
        handleFormApiErrors(error.errors, options.setError);
      }
      options?.onError?.(error);
      toast.error(error.message);
    },
  });
}

export interface UseRecoverOptions {
  setError?: UseFormSetError<RecoverFormValues>;
  onSuccess?: (data: { message?: string }) => void;
  onError?: (error: ApiClientError) => void;
}

/**
 * Hook para recuperación de credenciales institucionales.
 * Accede directamente a error.message normalizado por authApi.
 */
export function useRecover(options?: UseRecoverOptions) {
  return useMutation<{ message?: string }, ApiClientError, ForgotPasswordPayload>({
    mutationKey: ["auth", "recover"],
    mutationFn: (payload) => authApi.forgotPassword(payload),
    onSuccess: (data) => {
      options?.onSuccess?.(data);
      toast.success(
        data.message || "Solicitud procesada. Revisa las instrucciones de tu institución.",
      );
    },
    onError: (error) => {
      if (error.errors && options?.setError) {
        handleFormApiErrors(error.errors, options.setError);
      }
      options?.onError?.(error);
      toast.error(error.message);
    },
  });
}

export interface UseLogoutOptions {
  onSuccess?: () => void;
  onError?: (error: ApiClientError) => void;
}

/**
 * Hook para cierre de sesión institucional y purga de caché.
 */
export function useLogout(options?: UseLogoutOptions) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<void, ApiClientError, void>({
    mutationKey: ["auth", "logout"],
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      options?.onSuccess?.();
      queryClient.clear();
      router.push("/login");
    },
    onError: (error) => {
      options?.onError?.(error);
      toast.error(error.message);
    },
  });
}
