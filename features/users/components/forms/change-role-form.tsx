"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SelectOption } from "@/components/common/select";
import { Spinner } from "@/components/common/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { useRolesQuery } from "../../../roles/hooks/use-roles-query";
import { changeRoleSchema, type ChangeRoleFormValues } from "../../schemas/users.schema";
import type { UserItem } from "../../types/users.types";

interface ChangeRoleFormProps {
  user: UserItem;
  onSubmit: (values: ChangeRoleFormValues) => Promise<void> | void;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function ChangeRoleForm({
  user,
  onSubmit,
  isLoading = false,
  onCancel,
}: ChangeRoleFormProps) {
  const { data: roles = [], isLoading: isLoadingRoles } = useRolesQuery(true);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ChangeRoleFormValues>({
    resolver: zodResolver(changeRoleSchema),
    defaultValues: {
      rolId: user.rol.id,
    },
  });

  const roleOptions = React.useMemo(() => {
    return roles
      .filter((r) => r.activo)
      .map((r) => ({
        value: r.id,
        label: `${r.nombre} ${r.esSistema ? "(Sistema)" : ""}`,
      }));
  }, [roles]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="bg-muted/30 text-muted-foreground rounded-lg border p-3 text-xs">
        Usuario: <strong className="text-foreground">{user.nombreUsuario}</strong> (
        {user.persona.nombres} {user.persona.apellidoPaterno})
        <br />
        Rol actual: <strong className="text-foreground">{user.rol.nombre}</strong>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="rolId" className="text-sm font-medium">
          Nuevo Rol *
        </Label>
        <Controller
          control={control}
          name="rolId"
          render={({ field }) => (
            <SelectOption
              options={roleOptions}
              value={field.value}
              onSelect={(val) => field.onChange(val)}
              placeholder={isLoadingRoles ? "Cargando roles..." : "Seleccionar nuevo rol..."}
              disabled={isLoading || isLoadingRoles}
            />
          )}
        />
        {errors.rolId && (
          <p className="text-destructive text-xs font-medium">{errors.rolId.message}</p>
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
          <span>Actualizar rol</span>
        </Button>
      </div>
    </form>
  );
}
