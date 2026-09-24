"use client";

import { useMutation } from "@tanstack/react-query";
import type { UseFormSetError } from "react-hook-form";
import { authApi } from "../api/auth.api";
import type { ForgotPasswordPayload } from "../types/auth.types";
import type { RecoverFormValues } from "../schemas/recover.schema";
import { handleFormApiErrors } from "../utils/auth-error.utils";
import { ApiClientError } from "@/lib/api-client";
import { toast } from "@/lib/toast";

export interface UseRecoverPasswordMutationOptions {
  setError?: UseFormSetError<RecoverFormValues>;
  onSuccess?: (data: { message?: string }) => void;
  onError?: (error: ApiClientError) => void;
}

export function useRecoverPasswordMutation(options?: UseRecoverPasswordMutationOptions) {
  return useMutation<{ message?: string }, ApiClientError, ForgotPasswordPayload>({
    mutationKey: ["auth", "recover-password"],
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
      toast.error(
        error.message ||
          "No se pudo procesar la solicitud. Verifica el usuario y tu fecha de nacimiento.",
      );
    },
  });
}
