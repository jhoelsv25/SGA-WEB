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
  /** RF-001 V3: false cuando después de las credenciales sigue la selección de rol. */
  redirect?: boolean;
}

/** Destino tras ingresar: cambio obligatorio de contraseña o la página pedida. */
function destinoTrasIngresar(data: AuthResponse, redirectTo?: string): string {
  return data.user?.mustChangePassword ? "/change-password" : redirectTo || "/admin/dashboard";
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
      queryClient.setQueryData(["auth", "session"], data);

      // Primer ingreso: antes de elegir rol debe cambiar la contraseña temporal
      if (data.user?.mustChangePassword) {
        toast.info(
          "Por seguridad institucional, debes actualizar tu contraseña antes de continuar.",
        );
        router.push("/change-password");
        router.refresh();
        return;
      }

      options?.onSuccess?.(data);
      toast.success(data.message || "Bienvenido al sistema");
      queryClient.invalidateQueries({ queryKey: ["auth", "session"] });

      if (options?.redirect === false) return;

      router.push(options?.redirectTo || "/admin/dashboard");
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
    onSuccess: async (data) => {
      options?.onSuccess?.(data);
      // La sesión con clave temporal se cierra: debe ingresar con la contraseña nueva
      try {
        await authApi.logout();
      } catch {
        // Si falla el cierre en el servidor, igual se limpia la sesión local
      }
      setAccessToken(null);
      queryClient.clear();
      toast.success(
        data.message
          ? `${data.message} Ingresa con tu nueva contraseña.`
          : "Contraseña actualizada. Ingresa con tu nueva contraseña.",
      );
      router.replace(options?.redirectTo || "/login");
      router.refresh();
    },
    onError: (error) => {
      options?.onError?.(error);
      toast.error(error.message);
    },
  });
}

export interface UseSelectRoleOptions {
  redirectTo?: string;
}

/**
 * RF-001 V3: segundo paso del inicio de sesión. Fija el rol con el que se ingresa
 * (el servidor emite el token definitivo, aunque sea el principal) y entra al sistema.
 * Dentro del sistema no se cambia de rol: para usar otro, se vuelve a iniciar sesión.
 */
export function useSelectRole(options?: UseSelectRoleOptions) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, ApiClientError, string>({
    mutationKey: ["auth", "select-role"],
    mutationFn: (roleId) => authApi.switchRole(roleId),
    onSuccess: (data) => {
      if (data.accessToken) {
        setAccessToken(data.accessToken);
      }
      // El menú y los datos cargados dependen del rol elegido
      queryClient.removeQueries({ predicate: (q) => q.queryKey[0] !== "auth" });
      queryClient.setQueryData(["auth", "session"], data);
      router.push(destinoTrasIngresar(data, options?.redirectTo));
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Inicia una vista simulada como otro usuario (exclusivo Administrador / Soporte TI).
 */
export function useImpersonate() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, ApiClientError, { userId: string; roleId?: string }>({
    mutationKey: ["auth", "impersonate"],
    mutationFn: ({ userId, roleId }) => authApi.impersonate(userId, roleId),
    onSuccess: (data) => {
      if (data.accessToken) {
        setAccessToken(data.accessToken);
      }
      queryClient.removeQueries({ predicate: (q) => q.queryKey[0] !== "auth" });
      queryClient.setQueryData(["auth", "session"], data);
      toast.success(data.message ?? "Vista simulada iniciada.");
      router.push(destinoTrasIngresar(data));
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

/**
 * Sale de la vista simulada y restaura la sesión del Administrador o Soporte TI.
 */
export function useStopImpersonate() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, ApiClientError, void>({
    mutationKey: ["auth", "stop-impersonate"],
    mutationFn: () => authApi.stopImpersonate(),
    onSuccess: (data) => {
      if (data.accessToken) {
        setAccessToken(data.accessToken);
      }
      queryClient.removeQueries({ predicate: (q) => q.queryKey[0] !== "auth" });
      queryClient.setQueryData(["auth", "session"], data);
      toast.success(data.message ?? "Sesión restaurada.");
      router.push("/admin/users");
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
