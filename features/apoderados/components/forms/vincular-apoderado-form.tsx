"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SelectOption } from "@/components/common/select";
import { Spinner } from "@/components/common/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import {
  vincularApoderadoSchema,
  type VincularApoderadoFormValues,
} from "../../schemas/apoderados.schema";
import type { Apoderado, Parentesco } from "../../types/apoderados.types";

const parentescoOptions: { value: Parentesco; label: string }[] = [
  { value: "madre", label: "Madre" },
  { value: "padre", label: "Padre" },
  { value: "tutor_legal", label: "Tutor(a) Legal" },
  { value: "abuela", label: "Abuela" },
  { value: "abuelo", label: "Abuelo" },
  { value: "tia", label: "Tía" },
  { value: "tio", label: "Tío" },
  { value: "hermana", label: "Hermana mayor" },
  { value: "hermano", label: "Hermano mayor" },
  { value: "otro", label: "Otro parentesco / familiar" },
];

interface VincularApoderadoFormProps {
  estudianteId: string;
  estudianteNombre?: string;
  apoderado?: Apoderado;
  onSubmit: (values: VincularApoderadoFormValues) => Promise<void> | void;
  isLoading?: boolean;
  onCancel: () => void;
}

export function VincularApoderadoForm({
  estudianteId,
  estudianteNombre,
  apoderado,
  onSubmit,
  isLoading = false,
  onCancel,
}: VincularApoderadoFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<VincularApoderadoFormValues>({
    resolver: zodResolver(vincularApoderadoSchema),
    defaultValues: {
      estudianteId,
      apoderadoId: apoderado?.id || "",
      parentesco: "madre",
      esPrincipal: false,
      viveConEstudiante: true,
      autorizadoRecoger: true,
      contactoEmergencia: true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Contexto del estudiante y del apoderado */}
      <div className="border-border/60 bg-muted/30 space-y-2 rounded-xl border p-3.5">
        {estudianteNombre && (
          <div>
            <span className="text-muted-foreground text-xs">Estudiante:</span>
            <p className="text-foreground text-sm font-semibold">{estudianteNombre}</p>
          </div>
        )}
        {apoderado && (
          <div>
            <span className="text-muted-foreground text-xs">Apoderado:</span>
            <p className="text-foreground text-sm font-semibold">
              {apoderado.persona.nombreCompleto}
            </p>
            <p className="text-muted-foreground font-mono text-xs">
              {apoderado.persona.tipoDocumento.toUpperCase()}: {apoderado.persona.numeroDocumento}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Parentesco con el estudiante *</Label>
        <Controller
          control={control}
          name="parentesco"
          render={({ field }) => (
            <SelectOption
              options={parentescoOptions}
              value={field.value || "madre"}
              onChange={field.onChange}
              disabled={isLoading}
            />
          )}
        />
        {errors.parentesco && (
          <p className="text-destructive text-xs">{errors.parentesco.message}</p>
        )}
      </div>

      <div className="border-border/60 space-y-2 border-t pt-2">
        <label className="text-foreground flex cursor-pointer items-center gap-2 text-xs font-medium">
          <input
            type="checkbox"
            {...register("esPrincipal")}
            disabled={isLoading}
            className="border-border rounded"
          />
          Apoderado Principal (Si ya existe otro, se cambiará automáticamente)
        </label>

        <label className="text-foreground flex cursor-pointer items-center gap-2 text-xs font-medium">
          <input
            type="checkbox"
            {...register("viveConEstudiante")}
            disabled={isLoading}
            className="border-border rounded"
          />
          Convive en el mismo domicilio que el estudiante
        </label>

        <label className="text-foreground flex cursor-pointer items-center gap-2 text-xs font-medium">
          <input
            type="checkbox"
            {...register("autorizadoRecoger")}
            disabled={isLoading}
            className="border-border rounded"
          />
          Autorizado para retirar al estudiante de la institución
        </label>

        <label className="text-foreground flex cursor-pointer items-center gap-2 text-xs font-medium">
          <input
            type="checkbox"
            {...register("contactoEmergencia")}
            disabled={isLoading}
            className="border-border rounded"
          />
          Contacto de emergencia preferente
        </label>
      </div>

      <div className="flex items-center justify-end gap-3 pt-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="gap-2"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading} className="gap-2">
          {isLoading ? (
            <Spinner className="h-4 w-4" />
          ) : (
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-4 w-4" />
          )}
          Confirmar Vínculo
        </Button>
      </div>
    </form>
  );
}
