"use client";

import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import type { ForgotPasswordPayload } from "../types/auth.types";
import { ApiClientError } from "@/lib/api-client";
import { toast } from "@/lib/toast";

export function useRecoverPasswordMutation() {
  return useMutation<{ message?: string }, ApiClientError, ForgotPasswordPayload>({
    mutationKey: ["auth", "recover-password"],
    mutationFn: (payload) => authApi.forgotPassword(payload),
    onSuccess: (data) => {
      toast.success(
        data.message || "Solicitud procesada. Revisa las instrucciones de tu institución.",
      );
    },
    onError: (error) => {
      toast.error(
        error.message ||
          "No se pudo procesar la solicitud. Verifica el usuario y tu fecha de nacimiento.",
      );
    },
  });
}
