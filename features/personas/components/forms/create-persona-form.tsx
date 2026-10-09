"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/common/date-picker";
import { SelectOption } from "@/components/common/select";
import { Spinner } from "@/components/common/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { createPersonaSchema, type CreatePersonaFormValues } from "../../schemas/personas.schema";
import { parseIsoDate, formatToIsoDate } from "../../utils/dates";
import type { TipoDocumento } from "../../types/personas.types";

const tipoDocOptions: { value: TipoDocumento; label: string }[] = [
  { value: "dni", label: "DNI (8 dígitos)" },
  { value: "carne_extranjeria", label: "Carné de Extranjería" },
  { value: "pasaporte", label: "Pasaporte" },
  { value: "partida_nacimiento", label: "Partida de Nacimiento" },
];

const sexoOptions: { value: "M" | "F"; label: string }[] = [
  { value: "M", label: "Masculino" },
  { value: "F", label: "Femenino" },
];

interface CreatePersonaFormProps {
  onSubmit: (values: CreatePersonaFormValues) => Promise<void> | void;
  isLoading?: boolean;
  onCancel: () => void;
}

export function CreatePersonaForm({
  onSubmit,
  isLoading = false,
  onCancel,
}: CreatePersonaFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreatePersonaFormValues>({
    resolver: zodResolver(createPersonaSchema),
    defaultValues: {
      tipoDocumento: "dni",
      numeroDocumento: "",
      nombres: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      sexo: "M",
      fechaNacimiento: "",
      direccion: "",
      distrito: "",
      celular: "",
      telefono: "",
      correo: "",
      fotoUrl: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Documento de Identidad */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Tipo de documento *</Label>
          <Controller
            control={control}
            name="tipoDocumento"
            render={({ field }) => (
              <SelectOption
                options={tipoDocOptions}
                value={field.value}
                onSelect={(val) => field.onChange(val as TipoDocumento)}
                placeholder="Seleccionar tipo..."
                disabled={isLoading}
              />
            )}
          />
          {errors.tipoDocumento && (
            <p className="text-destructive text-xs font-medium">{errors.tipoDocumento.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="numeroDocumento" className="text-sm font-medium">
            Número de documento *
          </Label>
          <Input
            id="numeroDocumento"
            placeholder="Ej. 71234567"
            disabled={isLoading}
            {...register("numeroDocumento")}
          />
          {errors.numeroDocumento && (
            <p className="text-destructive text-xs font-medium">{errors.numeroDocumento.message}</p>
          )}
        </div>
      </div>

      {/* Nombres y Apellidos */}
      <div className="space-y-1.5">
        <Label htmlFor="nombres" className="text-sm font-medium">
          Nombres *
        </Label>
        <Input
          id="nombres"
          placeholder="Ej. Luis Alberto"
          disabled={isLoading}
          {...register("nombres")}
        />
        {errors.nombres && (
          <p className="text-destructive text-xs font-medium">{errors.nombres.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="apellidoPaterno" className="text-sm font-medium">
            Apellido paterno *
          </Label>
          <Input
            id="apellidoPaterno"
            placeholder="Ej. Quispe"
            disabled={isLoading}
            {...register("apellidoPaterno")}
          />
          {errors.apellidoPaterno && (
            <p className="text-destructive text-xs font-medium">{errors.apellidoPaterno.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="apellidoMaterno" className="text-sm font-medium">
            Apellido materno (Opcional)
          </Label>
          <Input
            id="apellidoMaterno"
            placeholder="Ej. Mamani"
            disabled={isLoading}
            {...register("apellidoMaterno")}
          />
          {errors.apellidoMaterno && (
            <p className="text-destructive text-xs font-medium">{errors.apellidoMaterno.message}</p>
          )}
        </div>
      </div>

      {/* Sexo y Fecha de Nacimiento */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Sexo biológico *</Label>
          <Controller
            control={control}
            name="sexo"
            render={({ field }) => (
              <SelectOption
                options={sexoOptions}
                value={field.value}
                onSelect={(val) => field.onChange(val as "M" | "F")}
                placeholder="Seleccionar sexo..."
                disabled={isLoading}
              />
            )}
          />
          {errors.sexo && (
            <p className="text-destructive text-xs font-medium">{errors.sexo.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Fecha de nacimiento (Opcional)</Label>
          <Controller
            control={control}
            name="fechaNacimiento"
            render={({ field }) => (
              <DatePicker
                date={parseIsoDate(field.value)}
                onSelect={(date) => field.onChange(formatToIsoDate(date))}
                maxDate={new Date()}
                disabled={isLoading}
                clearable={true}
                dateFormat="dd/MM/yyyy"
                placeholder="Seleccionar fecha"
                className="w-full"
              />
            )}
          />
          {errors.fechaNacimiento && (
            <p className="text-destructive text-xs font-medium">{errors.fechaNacimiento.message}</p>
          )}
        </div>
      </div>

      {/* Teléfonos y Contacto */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="celular" className="text-sm font-medium">
            Celular (Opcional)
          </Label>
          <Input
            id="celular"
            placeholder="Ej. 987654321"
            disabled={isLoading}
            {...register("celular")}
          />
          {errors.celular && (
            <p className="text-destructive text-xs font-medium">{errors.celular.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="telefono" className="text-sm font-medium">
            Teléfono fijo (Opcional)
          </Label>
          <Input
            id="telefono"
            placeholder="Ej. 014567890"
            disabled={isLoading}
            {...register("telefono")}
          />
          {errors.telefono && (
            <p className="text-destructive text-xs font-medium">{errors.telefono.message}</p>
          )}
        </div>
      </div>

      {/* Correo Electrónico */}
      <div className="space-y-1.5">
        <Label htmlFor="correo" className="text-sm font-medium">
          Correo electrónico (Opcional)
        </Label>
        <Input
          id="correo"
          type="email"
          placeholder="Ej. usuario@ejemplo.com"
          disabled={isLoading}
          {...register("correo")}
        />
        {errors.correo && (
          <p className="text-destructive text-xs font-medium">{errors.correo.message}</p>
        )}
      </div>

      {/* Domicilio */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="direccion" className="text-sm font-medium">
            Dirección domiciliaria (Opcional)
          </Label>
          <Input
            id="direccion"
            placeholder="Ej. Av. Los Próceres 123"
            disabled={isLoading}
            {...register("direccion")}
          />
          {errors.direccion && (
            <p className="text-destructive text-xs font-medium">{errors.direccion.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="distrito" className="text-sm font-medium">
            Distrito (Opcional)
          </Label>
          <Input
            id="distrito"
            placeholder="Ej. San Juan de Lurigancho"
            disabled={isLoading}
            {...register("distrito")}
          />
          {errors.distrito && (
            <p className="text-destructive text-xs font-medium">{errors.distrito.message}</p>
          )}
        </div>
      </div>

      {/* Acciones */}
      <div className="flex justify-end gap-2.5 pt-3">
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
          <span>Guardar persona</span>
        </Button>
      </div>
    </form>
  );
}
