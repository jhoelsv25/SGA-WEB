"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/common/spinner";
import { SelectOption } from "@/components/common/select";
import { ApiClientError } from "@/lib/api-client";
import { useGradosQuery, type Grado } from "@/features/grados";
import { useDocentesQuery } from "@/features/docentes";
import {
  createSeccionSchema,
  updateSeccionSchema,
  type CreateSeccionFormValues,
  type SeccionFormValues,
  type UpdateSeccionFormValues,
} from "../../schemas";
import type { Seccion } from "../../types";

interface SeccionFormProps {
  mode: "create" | "edit";
  seccion?: Seccion;
  grados?: Grado[];
  defaultGradoId?: string;
  onSubmit: (values: CreateSeccionFormValues | UpdateSeccionFormValues) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export function SeccionForm({
  mode,
  seccion,
  grados: initialGrados,
  defaultGradoId,
  onSubmit,
  isLoading,
  onCancel,
}: SeccionFormProps) {
  const { data: fetchedGrados = [] } = useGradosQuery();
  const grados = initialGrados && initialGrados.length > 0 ? initialGrados : fetchedGrados;

  const { data: docentesResponse } = useDocentesQuery({ estado: "activo", limit: 100 });

  const isCreate = mode === "create";

  const {
    register,
    handleSubmit,
    setValue,
    control,
    setError,
    formState: { errors },
  } = useForm<SeccionFormValues>({
    resolver: zodResolver(isCreate ? createSeccionSchema : updateSeccionSchema),
    defaultValues: {
      gradoId: isCreate ? (defaultGradoId ?? grados[0]?.id ?? "") : (seccion?.gradoId ?? ""),
      nombre: isCreate ? "" : (seccion?.nombre ?? ""),
      aula: isCreate ? "" : (seccion?.aula ?? ""),
      vacantes: isCreate ? 30 : (seccion?.vacantes ?? 30),
      tutorId: isCreate ? "" : (seccion?.tutor?.id ?? ""),
    },
  });

  const selectedGradoId = useWatch({ control, name: "gradoId" });
  const selectedTutorId = useWatch({ control, name: "tutorId" });

  const gradoOptions = React.useMemo(() => {
    return grados.map((g) => ({
      value: g.id,
      label: `${g.nombre} (${g.numero}.° de secundaria)`,
    }));
  }, [grados]);

  const tutorOptions = React.useMemo(() => {
    const list = [
      { value: "", label: "Sin tutor asignado" },
      ...(docentesResponse?.data ?? []).map((d) => ({
        value: d.id,
        label: `${d.persona.nombreCompleto} (${d.codigo})`,
      })),
    ];

    if (seccion?.tutor && !list.some((opt) => opt.value === seccion.tutor?.id)) {
      list.push({
        value: seccion.tutor.id,
        label: `${seccion.tutor.nombreCompleto} (${seccion.tutor.codigo})`,
      });
    }

    return list;
  }, [docentesResponse?.data, seccion]);

  const onFormSubmit = async (values: SeccionFormValues) => {
    try {
      if (isCreate) {
        if (!values.gradoId) {
          setError("gradoId", { type: "manual", message: "El grado es obligatorio." });
          return;
        }
        await onSubmit(values as CreateSeccionFormValues);
      } else {
        await onSubmit(values as UpdateSeccionFormValues);
      }
    } catch (error) {
      if (error instanceof ApiClientError) {
        if (error.message.includes("Ya existe la sección")) {
          setError("nombre", { type: "manual", message: error.message });
        } else if (error.message.includes("vacantes") || error.message.includes("Vacantes")) {
          setError("vacantes", { type: "manual", message: error.message });
        } else if (error.message.includes("tutor") || error.message.includes("Tutor")) {
          setError("tutorId", { type: "manual", message: error.message });
        }
        if (error.errors) {
          Object.entries(error.errors).forEach(([field, messages]) => {
            setError(field as keyof SeccionFormValues, {
              type: "manual",
              message: messages[0],
            });
          });
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4" noValidate>
      {/* Selector de Grado (solo editable en creación) */}
      {isCreate ? (
        <div className="space-y-1.5">
          <Label htmlFor="gradoId" className="text-sm font-medium">
            Grado escolar *
          </Label>
          <SelectOption
            options={gradoOptions}
            value={selectedGradoId ?? ""}
            onSelect={(val) => setValue("gradoId", val, { shouldValidate: true })}
            placeholder="Seleccionar grado..."
            searchPlaceholder="Buscar grado..."
            emptyMessage="No hay grados configurados."
            disabled={isLoading}
          />
          <p className="text-muted-foreground text-xs">
            La sección se creará con los cursos del plan de estudios de este grado.
          </p>
          {errors.gradoId && (
            <p className="text-destructive text-xs font-medium">{errors.gradoId.message}</p>
          )}
        </div>
      ) : (
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Grado escolar</Label>
          <div className="bg-muted text-muted-foreground flex h-10 w-full items-center rounded-md border px-3 text-sm">
            {seccion?.gradoNombre ?? "Grado escolar"}
          </div>
          <p className="text-muted-foreground text-xs">
            El grado de una sección no se puede cambiar después de su creación.
          </p>
        </div>
      )}

      {/* Nombre o letra de la sección */}
      <div className="space-y-1.5">
        <Label htmlFor="nombre" className="text-sm font-medium">
          Nombre o letra de la sección *
        </Label>
        <Input
          id="nombre"
          placeholder="Ej. A, B o Única"
          disabled={isLoading}
          aria-invalid={!!errors.nombre}
          maxLength={10}
          {...register("nombre")}
        />
        <p className="text-muted-foreground text-xs">
          Identificador único de la sección en este grado y año (máx. 10 caracteres).
        </p>
        {errors.nombre && (
          <p className="text-destructive text-xs font-medium">{errors.nombre.message}</p>
        )}
      </div>

      {/* Aula asignada */}
      <div className="space-y-1.5">
        <Label htmlFor="aula" className="text-sm font-medium">
          Aula o ambiente (Opcional)
        </Label>
        <Input
          id="aula"
          placeholder="Ej. Pab. B – 201"
          disabled={isLoading}
          aria-invalid={!!errors.aula}
          maxLength={50}
          {...register("aula")}
        />
        <p className="text-muted-foreground text-xs">
          Ambiente físico asignado para las clases habituales de la sección.
        </p>
        {errors.aula && (
          <p className="text-destructive text-xs font-medium">{errors.aula.message}</p>
        )}
      </div>

      {/* Vacantes */}
      <div className="space-y-1.5">
        <Label htmlFor="vacantes" className="text-sm font-medium">
          Capacidad de vacantes *
        </Label>
        <Input
          id="vacantes"
          type="number"
          min={1}
          placeholder="Ej. 35"
          disabled={isLoading}
          aria-invalid={!!errors.vacantes}
          {...register("vacantes", { valueAsNumber: true })}
        />
        <p className="text-muted-foreground text-xs">
          Capacidad máxima de estudiantes (debe ser mayor que 0).
        </p>
        {errors.vacantes && (
          <p className="text-destructive text-xs font-medium">{errors.vacantes.message}</p>
        )}
      </div>

      {/* Docente Tutor */}
      <div className="space-y-1.5">
        <Label htmlFor="tutorId" className="text-sm font-medium">
          Docente tutor (Opcional)
        </Label>
        <SelectOption
          options={tutorOptions}
          value={selectedTutorId ?? ""}
          onSelect={(val) => setValue("tutorId", val, { shouldValidate: true })}
          placeholder="Seleccionar tutor o sin tutor..."
          searchPlaceholder="Buscar docente activo por nombre o código..."
          emptyMessage="No se encontraron docentes activos disponibles."
          disabled={isLoading}
        />
        <p className="text-muted-foreground text-xs">
          Un docente activo puede ser tutor de una sola sección por año académico.
        </p>
        {errors.tutorId && (
          <p className="text-destructive text-xs font-medium">{errors.tutorId.message}</p>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-2.5 pt-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="h-10 min-h-[44px] gap-1.5 rounded-full px-4.5 text-xs font-semibold sm:min-h-10"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
          <span>Cancelar</span>
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="shadow-primary/20 h-10 min-h-[44px] gap-1.5 rounded-full px-5 text-xs font-semibold shadow-md sm:min-h-10"
        >
          {isLoading ? (
            <Spinner className="size-3.5" />
          ) : (
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
          )}
          <span>{isCreate ? "Crear sección" : "Guardar cambios"}</span>
        </Button>
      </div>
    </form>
  );
}
