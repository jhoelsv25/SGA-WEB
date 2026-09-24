"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { UseFormSetError } from "react-hook-form";
import { authApi } from "../api/auth.api";
import type { LoginCredentials, AuthResponse } from "../types/auth.types";
import type { LoginFormValues } from "../schemas/login.schema";
import { handleFormApiErrors } from "../utils/auth-error.utils";
import { ApiClientError } from "@/lib/api-client";
import { toast } from "@/lib/toast";

export interface UseLoginMutationOptions {
  setError?: UseFormSetError<LoginFormValues>;
  onSuccess?: (data: AuthResponse) => void;
  onError?: (error: ApiClientError) => void;
}

export function useLoginMutation(options?: UseLoginMutationOptions) {
  const router = useRouter();

  return useMutation<AuthResponse, ApiClientError, LoginCredentials>({
    mutationKey: ["auth", "login"],
    mutationFn: (credentials) => authApi.login(credentials),
    onSuccess: (data) => {
      options?.onSuccess?.(data);
      toast.success(data.message || "Bienvenido al sistema");
      router.push("/dashboard");
      router.refresh();
    },
    onError: (error) => {
      if (error.errors && options?.setError) {
        handleFormApiErrors(error.errors, options.setError);
      }
      options?.onError?.(error);
      toast.error(error.message || "Credenciales incorrectas");
    },
  });
}
