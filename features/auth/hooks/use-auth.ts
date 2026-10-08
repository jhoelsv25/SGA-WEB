"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "../api/auth.api";
import type {
  AuthResponse,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginCredentials,
} from "../types/auth.types";
import { type ApiClientError, setAccessToken } from "@/lib/api-client";
import { toast } from "@/lib/toast";

export interface UseLoginOptions {
  onSuccess?: (data: AuthResponse) => void;
  onError?: (error: ApiClientError) => void;
  redirectTo?: string;
}

/**
 * Hook para consultar y sincronizar la sesión institucional activa (GET /auth/check-token).
 */
export function useSession() {
  return useQuery<AuthResponse, ApiClientError>({
    queryKey: ["auth", "session"],
    queryFn: () => authApi.checkToken(),
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para inicio de sesión institucional.
 * Expone la mutación con mutate, isPending, y error real del servidor.
 * Redirige a /change-password si la cuenta requiere cambio obligatorio.
 */
export function useLogin(options?: UseLoginOptions) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, ApiClientError, LoginCredentials>({
    mutationKey: ["auth", "login"],
    mutationFn: (credentials) => authApi.login(credentials),
    onSuccess: (data) => {
      if (data.accessToken) {
        setAccessToken(data.accessToken);
      }
      options?.onSuccess?.(data);
      toast.success(data.message || "Bienvenido al sistema");
      queryClient.setQueryData(["auth", "session"], data);
      queryClient.invalidateQueries({ queryKey: ["auth", "session"] });

      if (data.user?.mustChangePassword) {
        toast.info(
          "Por seguridad institucional, debes actualizar tu contraseña antes de continuar.",
        );
        router.push("/change-password");
      } else {
        router.push(options?.redirectTo || "/admin/dashboard");
      }
      router.refresh();
    },
    onError: (error) => {
      options?.onError?.(error);
      toast.error(error.message);
    },
  });
}

export interface UseRecoverOptions {
  onSuccess?: (data: { message?: string }) => void;
  onError?: (error: ApiClientError) => void;
}

/**
 * Hook para recuperación de credenciales institucionales.
 * Expone mutate, isPending, y error real del servidor.
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
      options?.onError?.(error);
      toast.error(error.message);
    },
  });
}

export interface UseChangePasswordOptions {
  onSuccess?: (data: { message?: string }) => void;
  onError?: (error: ApiClientError) => void;
  redirectTo?: string;
}

/**
 * Hook para cambio de contraseña institucional (HU2).
 * Guarda la nueva clave, desmarca la obligatoriedad y revoca demás sesiones.
 */
export function useChangePassword(options?: UseChangePasswordOptions) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<{ message?: string }, ApiClientError, ChangePasswordPayload>({
    mutationKey: ["auth", "change-password"],
    mutationFn: (payload) => authApi.changePassword(payload),
    onSuccess: (data) => {
      options?.onSuccess?.(data);
      toast.success(data.message || "Contraseña actualizada exitosamente.");
      queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
      router.push(options?.redirectTo || "/admin/dashboard");
      router.refresh();
    },
    onError: (error) => {
      options?.onError?.(error);
      toast.error(error.message);
    },
  });
}

/**
 * Hook para cambiar el perfil activo (RF-001 V2) sin volver a pedir la contraseña.
 * Guarda el nuevo token, refresca la sesión y descarta los datos del perfil anterior.
 */
export function useSwitchProfile() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, ApiClientError, string>({
    mutationKey: ["auth", "switch-profile"],
    mutationFn: (roleId) => authApi.switchProfile(roleId),
    onSuccess: (data) => {
      if (data.accessToken) {
        setAccessToken(data.accessToken);
      }
      // El menú, los permisos y los datos cargados dependen del perfil activo
      queryClient.removeQueries({ predicate: (q) => q.queryKey[0] !== "auth" });
      queryClient.setQueryData(["auth", "session"], data);
      toast.success(data.message || "Perfil cambiado.");
      router.push("/admin/dashboard");
      router.refresh();
    },
    onError: (error) => {
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
      setAccessToken(null);
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
