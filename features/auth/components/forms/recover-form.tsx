"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { recoverSchema, type RecoverFormValues } from "../../schemas/recover.schema";
import { useRecover } from "../../hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/common/date-picker";
import { Spinner } from "@/components/common/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  CheckmarkCircle02Icon,
  HelpCircleIcon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";

export function RecoverForm() {
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RecoverFormValues>({
    resolver: zodResolver(recoverSchema),
    defaultValues: {
      username: "",
    },
  });

  const {
    mutate: recoverPassword,
    isPending: isSubmitting,
    error,
  } = useRecover({
    onSuccess: (res) => {
      setSuccessMessage(
        res.message ||
          "Solicitud enviada exitosamente. Sigue el flujo definido por la institución educativa para continuar.",
      );
    },
  });

  const onSubmit = (values: RecoverFormValues) => {
    setSuccessMessage(null);
    const birthdateStr = format(values.birthdate, "yyyy-MM-dd");

    recoverPassword({
      username: values.username,
      birthdate: birthdateStr,
    });
  };

  if (successMessage) {
    return (
      <div className="border-primary/20 bg-primary/5 space-y-4 rounded-2xl border p-5 text-center shadow-xs">
        <div className="bg-primary/10 text-primary mx-auto flex size-12 items-center justify-center rounded-full">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-6" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-foreground text-sm font-bold">Solicitud procesada</h3>
          <p className="text-muted-foreground text-xs leading-relaxed">{successMessage}</p>
        </div>
        <div className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setSuccessMessage(null)}
            className="h-10 w-full rounded-full text-xs font-semibold"
          >
            Volver a consultar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Alerta de Error del Servidor */}
      {error && (
        <div
          role="alert"
          className="bg-destructive/10 border-destructive/20 text-destructive animate-in fade-in flex items-start gap-2.5 rounded-xl border p-3 text-xs font-medium duration-200"
        >
          <HugeiconsIcon icon={AlertCircleIcon} className="mt-0.5 size-4 shrink-0" />
          <div className="flex-1 space-y-0.5">
            <p className="leading-tight font-semibold">Error de solicitud</p>
            <p className="text-[11px] leading-relaxed opacity-90">{error.message}</p>
          </div>
        </div>
      )}

      {/* Campo Usuario o Código */}
      <div className="space-y-1.5">
        <Label htmlFor="username">Usuario o DNI *</Label>
        <Input
          id="username"
          type="text"
          autoComplete="username"
          disabled={isSubmitting}
          placeholder="Ej: 74839201 o docente01"
          startIcon={<HugeiconsIcon icon={UserIcon} className="size-4" />}
          {...register("username")}
          aria-invalid={!!errors.username}
        />
        {errors.username && (
          <p className="text-destructive px-2 text-[11px] font-medium">{errors.username.message}</p>
        )}
      </div>

      {/* Campo Fecha de Nacimiento con DatePicker */}
      <div className="space-y-1.5">
        <Label htmlFor="birthdate">Fecha de nacimiento *</Label>
        <Controller
          control={control}
          name="birthdate"
          render={({ field }) => (
            <DatePicker
              date={field.value}
              onSelect={field.onChange}
              disabled={isSubmitting}
              placeholder="Selecciona tu fecha de nacimiento"
              captionLayout="dropdown"
              startMonth={new Date(1940, 0)}
              endMonth={new Date()}
              maxDate={new Date()}
              className={
                errors.birthdate ? "border-destructive ring-destructive/20 w-full ring-1" : "w-full"
              }
            />
          )}
        />
        {errors.birthdate && (
          <p className="text-destructive px-2 text-[11px] font-medium">
            {errors.birthdate.message}
          </p>
        )}
      </div>

      {/* Aviso informativo */}
      <div className="bg-muted/40 text-muted-foreground flex items-start gap-2.5 rounded-xl p-3 text-xs">
        <HugeiconsIcon icon={HelpCircleIcon} className="mt-0.5 size-4 shrink-0" />
        <p className="leading-relaxed">
          Tu fecha de nacimiento valida tu identidad en el registro institucional. Si tus datos no
          coinciden, comunícate con la secretaría del colegio.
        </p>
      </div>

      {/* Botón Solicitar Recuperación */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="shadow-primary/20 h-11 w-full gap-2 rounded-full text-sm font-bold shadow-md transition-all hover:shadow-lg"
        >
          {isPendingOrSubmitting(isSubmitting)}
        </Button>
      </div>
    </form>
  );
}

function isPendingOrSubmitting(isSubmitting: boolean) {
  if (isSubmitting) {
    return (
      <>
        <Spinner size="sm" />
        <span>Verificando datos...</span>
      </>
    );
  }
  return <span>Recuperar contraseña</span>;
}
