"use client";

import * as React from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectOption } from "@/components/common/select";
import { Spinner } from "@/components/common/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { useEligiblePersonasQuery } from "../../hooks/use-users-query";
import { useRolesQuery } from "../../../roles/hooks/use-roles-query";
import { createUserSchema, type CreateUserFormValues } from "../../schemas/users.schema";

interface Props {
  onSubmit: (values: CreateUserFormValues) => Promise<void> | void;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function CreateUserForm({ onSubmit, isLoading = false, onCancel }: Props) {
  const [personaSearch] = React.useState("");
  const { data: eligiblePersonas = [], isLoading: isLoadingPersonas } =
    useEligiblePersonasQuery(personaSearch);
  const { data: roles = [], isLoading: isLoadingRoles } = useRolesQuery(true);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      personaId: "",
      rolId: "",
      nombreUsuario: "",
    },
  });

  const selectedPersonaId = useWatch({ control, name: "personaId" });

  // Cuando se selecciona una persona, sugerir automáticamente su número de documento como usuario
  React.useEffect(() => {
    if (selectedPersonaId) {
      const persona = eligiblePersonas.find((p) => p.id === selectedPersonaId);
      if (persona) {
        setValue("nombreUsuario", persona.numeroDocumento, { shouldValidate: true });
      }
    }
  }, [selectedPersonaId, eligiblePersonas, setValue]);

  const personaOptions = React.useMemo(() => {
    return eligiblePersonas.map((p) => ({
      value: p.id,
      label: `${p.apellidoPaterno} ${p.apellidoMaterno ?? ""}, ${p.nombres} (${p.tipoDocumento.toUpperCase()}: ${p.numeroDocumento})`,
    }));
  }, [eligiblePersonas]);

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
      <div className="space-y-1.5">
        <Label htmlFor="personaId" className="text-sm font-medium">
          Persona del padrón *
        </Label>
        <Controller
          control={control}
          name="personaId"
          render={({ field }) => (
            <SelectOption
              options={personaOptions}
              value={field.value}
              onSelect={(val) => field.onChange(val)}
              placeholder={
                isLoadingPersonas ? "Cargando personas..." : "Seleccionar persona sin cuenta..."
              }
              searchPlaceholder="Buscar por nombre o documento..."
              emptyMessage="No hay personas disponibles sin cuenta."
              disabled={isLoading || isLoadingPersonas}
            />
          )}
        />
        <p className="text-muted-foreground text-xs">
          Solo se muestran personas registradas que aún no tienen cuenta activa.
        </p>
        {errors.personaId && (
          <p className="text-destructive text-xs font-medium">{errors.personaId.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="rolId" className="text-sm font-medium">
          Rol asignado *
        </Label>
        <Controller
          control={control}
          name="rolId"
          render={({ field }) => (
            <SelectOption
              options={roleOptions}
              value={field.value}
              onSelect={(val) => field.onChange(val)}
              placeholder={isLoadingRoles ? "Cargando roles..." : "Seleccionar rol..."}
              searchPlaceholder="Buscar rol..."
              disabled={isLoading || isLoadingRoles}
            />
          )}
        />
        {errors.rolId && (
          <p className="text-destructive text-xs font-medium">{errors.rolId.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="nombreUsuario" className="text-sm font-medium">
          Nombre de usuario *
        </Label>
        <Input
          id="nombreUsuario"
          {...register("nombreUsuario")}
          placeholder="Ej. 12345678"
          disabled={isLoading}
          aria-invalid={!!errors.nombreUsuario}
        />
        <p className="text-muted-foreground text-xs">
          Por defecto se sugiere el DNI/código. Puedes personalizarlo antes de guardar.
        </p>
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
          <span>Guardar cuenta</span>
        </Button>
      </div>
    </form>
  );
}
