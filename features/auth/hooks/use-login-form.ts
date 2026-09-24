"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "../schemas/login.schema";
import { useLoginMutation } from "./use-login-mutation";
import { getInitialLoginValues, saveRememberedUsername } from "../utils/auth-storage.utils";

export function useLoginForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const initialValues = React.useMemo(() => getInitialLoginValues(), []);
  const [rememberUser, setRememberUser] = React.useState(initialValues.rememberUser);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: initialValues,
  });

  const loginMutation = useLoginMutation({
    setError: form.setError,
  });

  const onSubmit = form.handleSubmit((values: LoginFormValues) => {
    saveRememberedUsername(values.username, values.rememberUser);

    loginMutation.mutate({
      username: values.username,
      password: values.password,
      rememberMe: values.rememberUser,
    });
  });

  const handleRememberUserChange = (checked: boolean) => {
    setRememberUser(checked);
    form.setValue("rememberUser", checked, {
      shouldValidate: false,
      shouldDirty: true,
    });
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return {
    form,
    register: form.register,
    handleSubmit: form.handleSubmit,
    onSubmit,
    errors: form.formState.errors,
    isSubmitting: loginMutation.isPending,
    showPassword,
    toggleShowPassword,
    rememberUser,
    handleRememberUserChange,
    setValue: form.setValue,
    setError: form.setError,
  };
}
