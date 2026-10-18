"use client";

import * as React from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { SelectOption } from "@/components/common/select";
import { Spinner } from "@/components/common/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { PersonaBuscadorField } from "@/features/personas/components/persona-buscador-field";
import type { Persona } from "@/features/personas/types/personas.types";
import { useRolesQuery } from "../../../roles/hooks/use-roles-query";
import { useCargosQuery } from "../../../cargos/hooks/use-cargos-query";
import { createUserSchema, type CreateUserFormValues } from "../../schemas/users.schema";
import { cn } from "@/lib/utils";

interface Props {
  onSubmit: (values: CreateUserFormValues) => Promise<void> | void;
  isLoading?: boolean;
  onCancel?: () => void;
}

const TIPO_DOCUMENTO_OPTIONS = [
  { value: "dni", label: "DNI" },
  { value: "carne_extranjeria", label: "Carné de extranjería" },
  { value: "pasaporte", label: "Pasaporte" },
  { value: "partida_nacimiento", label: "Partida de nacimiento" },
];

export function CreateUserForm({ onSubmit, isLoading = false, onCancel }: Props) {
  const [personaElegida, setPersonaElegida] = React.useState<Persona | null>(null);
  const { data: roles = [] } = useRolesQuery(true);
  const { data: cargos = [], isLoading: isLoadingCargos } = useCargosQuery(true);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      tipoPersona: "existente",
      personaId: "",
      cargoId: "",
      rolIds: [],
      nombreUsuario: "",
    },
  });

  const tipoPersona = useWatch({ control, name: "tipoPersona" });
  const selectedPersonaId = useWatch({ control, name: "personaId" });
  const selectedCargoId = useWatch({ control, name: "cargoId" });
  const selectedRolIds = useWatch({ control, name: "rolIds" }) ?? [];

  // Cuando se selecciona una persona existente, sugerir su número de documento como usuario
  React.useEffect(() => {
    if (tipoPersona === "existente" && selectedPersonaId) {
      if (personaElegida) {
        setValue("nombreUsuario", personaElegida.numeroDocumento, { shouldValidate: true });
      }
    }
  }, [tipoPersona, selectedPersonaId, personaElegida, setValue]);

  // Cuando se elige el cargo, sugerir automáticamente sus roles (el usuario puede ajustarlos)
  React.useEffect(() => {
    if (!selectedCargoId) return;
    const cargo = cargos.find((c) => c.id === selectedCargoId);
    if (cargo && cargo.rolesSugeridos.length > 0) {
      setValue(
        "rolIds",
        cargo.rolesSugeridos.map((r) => r.id),
        { shouldValidate: true },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCargoId]);

  const cargoOptions = React.useMemo(() => {
    return cargos.map((c) => ({ value: c.id, label: c.nombre }));
  }, [cargos]);

  const activeRoles = React.useMemo(() => roles.filter((r) => r.activo), [roles]);

  const toggleRol = (rolId: string) => {
    const next = selectedRolIds.includes(rolId)
      ? selectedRolIds.filter((id) => id !== rolId)
      : [...selectedRolIds, rolId];
    setValue("rolIds", next, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Persona: existente o nueva */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Persona *</Label>
        <Controller
          control={control}
          name="tipoPersona"
          render={({ field }) => (
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant={field.value === "existente" ? "default" : "outline"}
                onClick={() => field.onChange("existente")}
                disabled={isLoading}
                className="h-8 rounded-full text-xs"
              >
                Persona del padrón
              </Button>
              <Button
                type="button"
                size="sm"
                variant={field.value === "nueva" ? "default" : "outline"}
                onClick={() => field.onChange("nueva")}
                disabled={isLoading}
                className="h-8 rounded-full text-xs"
              >
                Persona nueva
              </Button>
            </div>
          )}
        />
      </div>

      {tipoPersona === "existente" ? (
        <div className="space-y-1.5">
          <Label htmlFor="personaId" className="text-sm font-medium">
            Persona del padrón *
          </Label>
          <Controller
            control={control}
            name="personaId"
            render={({ field }) => (
              <PersonaBuscadorField
                id="personaId"
                destino="cuenta"
                value={personaElegida}
                onChange={(elegida) => {
                  setPersonaElegida(elegida);
                  field.onChange(elegida?.id ?? "");
                }}
                disabled={isLoading}
              />
            )}
          />
          <p className="text-muted-foreground text-xs">
            Busca por DNI o nombre; las personas que ya tienen cuenta aparecen bloqueadas.
          </p>
          {errors.personaId && (
            <p className="text-destructive text-xs font-medium">{errors.personaId.message}</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Tipo de documento *</Label>
            <Controller
              control={control}
              name="tipoDocumento"
              render={({ field }) => (
                <SelectOption
                  options={TIPO_DOCUMENTO_OPTIONS}
                  value={field.value ?? ""}
                  onSelect={(val) =>
                    field.onChange(
                      val as "dni" | "carne_extranjeria" | "pasaporte" | "partida_nacimiento",
                    )
                  }
                  placeholder="Seleccionar..."
                  disabled={isLoading}
                />
              )}
            />
            {errors.tipoDocumento && (
              <p className="text-destructive text-xs font-medium">{errors.tipoDocumento.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Número de documento *</Label>
            <Input {...register("numeroDocumento")} disabled={isLoading} />
            {errors.numeroDocumento && (
              <p className="text-destructive text-xs font-medium">
                {errors.numeroDocumento.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Nombres *</Label>
            <Input {...register("nombres")} disabled={isLoading} />
            {errors.nombres && (
              <p className="text-destructive text-xs font-medium">{errors.nombres.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Sexo *</Label>
            <Controller
              control={control}
              name="sexo"
              render={({ field }) => (
                <SelectOption
                  options={[
                    { value: "M", label: "Masculino" },
                    { value: "F", label: "Femenino" },
                  ]}
                  value={field.value ?? ""}
                  onSelect={(val) => field.onChange(val as "M" | "F")}
                  placeholder="Seleccionar..."
                  disabled={isLoading}
                />
              )}
            />
            {errors.sexo && (
              <p className="text-destructive text-xs font-medium">{errors.sexo.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Apellido paterno *</Label>
            <Input {...register("apellidoPaterno")} disabled={isLoading} />
            {errors.apellidoPaterno && (
              <p className="text-destructive text-xs font-medium">
                {errors.apellidoPaterno.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Apellido materno</Label>
            <Input {...register("apellidoMaterno")} disabled={isLoading} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Correo</Label>
            <Input type="email" {...register("correo")} disabled={isLoading} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Celular</Label>
            <Input {...register("celular")} disabled={isLoading} />
          </div>
        </div>
      )}

      {/* Cargo */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Cargo *</Label>
        <Controller
          control={control}
          name="cargoId"
          render={({ field }) => (
            <SelectOption
              options={cargoOptions}
              value={field.value}
              onSelect={(val) => field.onChange(val)}
              placeholder={isLoadingCargos ? "Cargando cargos..." : "Seleccionar cargo..."}
              searchPlaceholder="Buscar cargo..."
              disabled={isLoading || isLoadingCargos}
            />
          )}
        />
        <p className="text-muted-foreground text-xs">
          El cargo no da accesos; solo sugiere los roles de la cuenta.
        </p>
        {errors.cargoId && (
          <p className="text-destructive text-xs font-medium">{errors.cargoId.message}</p>
        )}
      </div>

      {/* Roles (sugeridos por el cargo, ajustables) */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Roles de la cuenta *</Label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {activeRoles.map((rol) => {
            const checked = selectedRolIds.includes(rol.id);
            return (
              <label
                key={rol.id}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-lg border p-2 text-xs select-none",
                  checked ? "border-primary/40 bg-primary/5" : "border-border/60",
                )}
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggleRol(rol.id)}
                  disabled={isLoading}
                />
                <span className="font-medium">{rol.nombre}</span>
              </label>
            );
          })}
        </div>
        <p className="text-muted-foreground text-xs">
          Se sugieren automáticamente al elegir el cargo; el primero marcado será el rol principal.
        </p>
        {errors.rolIds && (
          <p className="text-destructive text-xs font-medium">{errors.rolIds.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="nombreUsuario" className="text-sm font-medium">
          Nombre de usuario
        </Label>
        <Input
          id="nombreUsuario"
          {...register("nombreUsuario")}
          placeholder="Ej. 12345678"
          disabled={isLoading}
          aria-invalid={!!errors.nombreUsuario}
        />
        <p className="text-muted-foreground text-xs">
          Por defecto se usa el número de documento. Puedes personalizarlo antes de guardar.
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
