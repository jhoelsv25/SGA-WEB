"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "../api/auth.api";
import type { LoginCredentials, AuthResponse } from "../types/auth.types";
import { ApiClientError } from "@/lib/api-client";
import { toast } from "@/lib/toast";

export function useLoginMutation() {
  const router = useRouter();

  return useMutation<AuthResponse, ApiClientError, LoginCredentials>({
    mutationKey: ["auth", "login"],
    mutationFn: (credentials) => authApi.login(credentials),
    onSuccess: (data) => {
      toast.success(data.message || "Bienvenido al sistema");
      router.push("/dashboard");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || "Credenciales incorrectas");
    },
  });
}
