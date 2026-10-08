"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/common/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { updateUsernameSchema, type UpdateUsernameFormValues } from "../../schemas/users.schema";
import type { UserItem } from "../../types/users.types";

interface UpdateUsernameFormProps {
  user: UserItem;
  onSubmit: (values: UpdateUsernameFormValues) => Promise<void> | void;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function UpdateUsernameForm({
  user,
  onSubmit,
  isLoading = false,
  onCancel,
}: UpdateUsernameFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUsernameFormValues>({
    resolver: zodResolver(updateUsernameSchema),
    defaultValues: {
      nombreUsuario: user.nombreUsuario,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="nombreUsuario" className="text-sm font-medium">
          Nombre de usuario *
        </Label>
        <Input
          id="nombreUsuario"
          {...register("nombreUsuario")}
          placeholder="Ej. jdoe.admin"
          disabled={isLoading}
          aria-invalid={!!errors.nombreUsuario}
        />
        <p className="text-muted-foreground text-xs">Debe ser único en el sistema.</p>
        {errors.nombreUsuario && (
          <p className="text-destructive text-xs font-medium">{errors.nombreUsuario.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2.5 pt-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="h-10 gap-1.5 rounded-full px-4.5 text-xs font-semibold"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
            <span>Cancelar</span>
          </Button>
        )}
        <Button
          type="submit"
          disabled={isLoading}
          className="shadow-primary/20 h-10 gap-1.5 rounded-full px-5 text-xs font-semibold shadow-md"
        >
          {isLoading ? (
            <Spinner className="size-3.5" />
          ) : (
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
          )}
          <span>Actualizar usuario</span>
        </Button>
      </div>
    </form>
  );
}
