import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import {
  HEADER_ANIO_ACADEMICO,
  idAnioLectivoActivo,
} from "@/features/anio-escolar/anio-lectivo-activo";

export interface ApiErrorPayload {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
  code?: string;
}

export class ApiClientError extends Error {
  public statusCode?: number;
  public errors?: Record<string, string[]>;
  public code?: string;

  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.name = "ApiClientError";
    this.statusCode = payload.statusCode;
    this.errors = payload.errors;
    this.code = payload.code;
  }
}

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean; _csrfRetry?: boolean };

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

/**
 * Origen del backend (protocolo + host), derivado de API_BASE_URL.
 * Se usa para archivos estáticos (/uploads) y sockets, que no cuelgan de /api.
 */
export function getBackendOrigin(): string {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return "http://localhost:3000";
  }
}

/** Convierte una ruta relativa del backend (ej. /uploads/logo.png) en URL absoluta. */
export function resolveBackendUrl(url: string): string {
  if (/^https?:\/\//.test(url)) return url;
  return `${getBackendOrigin()}${url.startsWith("/") ? "" : "/"}${url}`;
}

/**
 * Cliente centralizado de Axios para la comunicación con el Backend.
 * withCredentials: true asegura el envío/recepción de cookies HttpOnly (sesión, refresh token).
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let csrfTokenEnMemoria: string | null = null;
let csrfPromise: Promise<string | null> | null = null;

async function obtenerCsrfToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  if (csrfTokenEnMemoria) return csrfTokenEnMemoria;

  csrfPromise ??= axios
    .create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      withCredentials: true,
    })
    .get<{ csrfToken: string }>("/auth/csrf-token")
    .then((res) => {
      csrfTokenEnMemoria = res.data?.csrfToken ?? null;
      return csrfTokenEnMemoria;
    })
    .catch(() => null)
    .finally(() => {
      csrfPromise = null;
    });

  return csrfPromise;
}

// Interceptor de solicitudes: la autenticación viaja en cookie HttpOnly (withCredentials: true)
apiClient.interceptors.request.use(async (config) => {
  const anioId = idAnioLectivoActivo();
  if (anioId) {
    config.headers[HEADER_ANIO_ACADEMICO] = anioId;
  }

  const metodo = (config.method ?? "get").toLowerCase();
  const url = config.url ?? "";
  const esMutacion =
    metodo === "post" || metodo === "put" || metodo === "patch" || metodo === "delete";
  const omiteCsrf = url.includes("/auth/login") || url.includes("/auth/register");

  if (esMutacion && !omiteCsrf) {
    const csrf = await obtenerCsrfToken();
    if (csrf) {
      config.headers["x-csrf-token"] = csrf;
    }
  }

  return config;
});

let refreshPromise: Promise<boolean> | null = null;

/**
 * Solicita renovación silenciosa de tokens (GET /auth/refresh-token).
 */
async function refreshSessionTokens(): Promise<boolean> {
  try {
    const refreshAxios = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      withCredentials: true,
    });

    await refreshAxios.get("/auth/refresh-token");
    csrfTokenEnMemoria = null;
    return true;
  } catch {
    return false;
  }
}

// Interceptor de respuestas para refresco silencioso y normalización de errores
apiClient.interceptors.response.use(
  (response) => {
    const url = response.config?.url ?? "";
    if (
      url.includes("/auth/login") ||
      url.includes("/auth/switch-role") ||
      url.includes("/auth/logout")
    ) {
      csrfTokenEnMemoria = null;
    }
    return response;
  },
  async (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorPayload>;
      const originalRequest = axiosError.config as RetryConfig | undefined;
      const status = axiosError.response?.status;

      const mensajeError = axiosError.response?.data?.message ?? "";
      const codigoError = axiosError.response?.data?.code ?? "";
      if (
        status === 403 &&
        originalRequest &&
        !originalRequest._csrfRetry &&
        (mensajeError.toLowerCase().includes("csrf") || codigoError.toUpperCase().includes("CSRF"))
      ) {
        originalRequest._csrfRetry = true;
        csrfTokenEnMemoria = null;
        const nuevoCsrf = await obtenerCsrfToken();
        if (nuevoCsrf) {
          originalRequest.headers["x-csrf-token"] = nuevoCsrf;
          return apiClient(originalRequest);
        }
      }

      const url = originalRequest?.url || "";
      const isAuthRoute =
        url.includes("/auth/login") ||
        url.includes("/auth/refresh-token") ||
        url.includes("/auth/register");

      // Si es 401 y no es petición de autenticación recursiva
      if (status === 401 && originalRequest && !originalRequest._retry && !isAuthRoute) {
        originalRequest._retry = true;

        refreshPromise ??= refreshSessionTokens().finally(() => {
          refreshPromise = null;
        });

        const refreshed = await refreshPromise;

        if (refreshed) {
          return apiClient(originalRequest);
        }

        // Si falló el refresh y estamos en el cliente, redirigir a login
        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.href = `/login?expired=true&redirectTo=${encodeURIComponent(
            window.location.pathname,
          )}`;
        }
      }

      const data = axiosError.response?.data;
      let detailedMessage =
        data?.message || axiosError.message || "Ocurrió un error inesperado en la solicitud.";

      if (Array.isArray(data?.errors) && data.errors.length > 0) {
        const errorsList = data.errors.filter(Boolean).join(", ");
        if (errorsList && !detailedMessage.includes(errorsList)) {
          detailedMessage = `${detailedMessage}: ${errorsList}`;
        }
      } else if (typeof data?.errors === "object" && data.errors !== null) {
        const errorStrings = Object.values(data.errors).flat().filter(Boolean).join(", ");
        if (errorStrings && !detailedMessage.includes(errorStrings)) {
          detailedMessage = `${detailedMessage}: ${errorStrings}`;
        }
      }

      const normalizedError = new ApiClientError({
        message: detailedMessage,
        statusCode: status,
        errors: data?.errors,
        code: data?.code,
      });

      return Promise.reject(normalizedError);
    }

    return Promise.reject(error);
  },
);

/**
 * Intercepta y normaliza cualquier error de petición HTTP garantizando
 * el lanzamiento de una instancia de ApiClientError con message amigable y errors estructurados.
 */
export function handleApiError(
  error: unknown,
  defaultMessage = "Error inesperado en la comunicación con el servidor.",
): never {
  if (error instanceof ApiClientError) {
    throw error;
  }

  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorPayload | undefined;
    const message = data?.message || error.message || defaultMessage;

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
    message: defaultMessage,
  });
}
