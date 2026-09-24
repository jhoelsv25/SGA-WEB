"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { recoverSchema, type RecoverFormValues } from "../schemas/recover.schema";
import { useRecoverPasswordMutation } from "./use-recover-password-mutation";

export function useRecoverForm() {
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const form = useForm<RecoverFormValues>({
    resolver: zodResolver(recoverSchema),
    defaultValues: {
      username: "",
    },
  });

  const recoverMutation = useRecoverPasswordMutation({
    setError: form.setError,
  });

  const onSubmit = form.handleSubmit((values: RecoverFormValues) => {
    setSuccessMessage(null);
    const birthdateStr = format(values.birthdate, "yyyy-MM-dd");

    recoverMutation.mutate(
      {
        username: values.username,
        birthdate: birthdateStr,
      },
      {
        onSuccess: (res) => {
          setSuccessMessage(
            res.message ||
              "Solicitud enviada exitosamente. Sigue el flujo definido por la institución educativa para continuar.",
          );
        },
      },
    );
  });

  return {
    form,
    register: form.register,
    control: form.control,
    handleSubmit: form.handleSubmit,
    onSubmit,
    errors: form.formState.errors,
    isSubmitting: recoverMutation.isPending,
    successMessage,
    clearSuccessMessage: () => setSuccessMessage(null),
    setError: form.setError,
  };
}
