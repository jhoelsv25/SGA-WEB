"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/common/date-picker";
import { SelectOption } from "@/components/common/select";
import { Spinner } from "@/components/common/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  ShieldCheckIcon,
  LockKeyIcon,
} from "@hugeicons/core-free-icons";
import { updatePersonaSchema, type UpdatePersonaFormValues } from "../../schemas/personas.schema";
import { parseIsoDate, formatToIsoDate } from "../../utils/dates";
import type { Persona, TipoDocumento } from "../../types/personas.types";

const tipoDocOptions: { value: TipoDocumento; label: string }[] = [
  { value: "dni", label: "DNI" },
  { value: "carne_extranjeria", label: "Carné de Extranjería" },
  { value: "pasaporte", label: "Pasaporte" },
  { value: "partida_nacimiento", label: "Partida de Nacimiento" },
];

const sexoOptions: { value: "M" | "F"; label: string }[] = [
  { value: "M", label: "Masculino (M)" },
  { value: "F", label: "Femenino (F)" },
];

interface EditPersonaFormProps {
  persona: Persona;
  canEditCritical: boolean;
  isProvisional: boolean;
  isAdmin: boolean;
  onSubmit: (values: UpdatePersonaFormValues) => Promise<void> | void;
  isLoading?: boolean;
  onCancel: () => void;
}

export function EditPersonaForm({
  persona,
  canEditCritical,
  isProvisional,
  isAdmin,
  onSubmit,
  isLoading = false,
  onCancel,
}: EditPersonaFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UpdatePersonaFormValues>({
    resolver: zodResolver(updatePersonaSchema),
    defaultValues: {
      tipoDocumento: persona.tipoDocumento,
      numeroDocumento: persona.numeroDocumento,
      nombres: persona.nombres,
      apellidoPaterno: persona.apellidoPaterno,
      apellidoMaterno: persona.apellidoMaterno ?? "",
      sexo: persona.sexo,
      fechaNacimiento: persona.fechaNacimiento ?? "",
      direccion: persona.direccion ?? "",
      distrito: persona.distrito ?? "",
      celular: persona.celular ?? "",
      telefono: persona.telefono ?? "",
      correo: persona.correo ?? "",
      fotoUrl: persona.fotoUrl ?? "",
      motivo: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Advertencia de datos críticos según RF-007 v3.0 */}
      {!isProvisional && (
        <div className="space-y-1.5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 text-xs">
          <div className="flex items-center gap-2 font-semibold text-amber-700 dark:text-amber-400">
            <HugeiconsIcon icon={ShieldCheckIcon} className="h-4 w-4 shrink-0" />
            <span>Protección de Datos Críticos (RF-007 V3)</span>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Esta persona cuenta con fichas institucionales activas. Los datos de identidad están
            protegidos.
            {isAdmin ? (
              <span className="text-foreground font-medium">
                {" "}
                Al ser Administrador puedes corregirlos, indicando obligatoriamente el motivo para
                la bitácora de auditoría.
              </span>
            ) : (
              <span className="text-destructive font-medium">
                {" "}
                Tu rol actual solo puede editar datos libres (contacto y residencia).
              </span>
            )}
          </p>
        </div>
      )}

      {/* Sección 1: Datos de Identidad */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b pb-1.5">
          <h4 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Datos de Identidad {!isProvisional && "(Críticos)"}
          </h4>
          {!canEditCritical && (
            <span className="text-muted-foreground bg-muted flex items-center gap-1 rounded px-2 py-0.5 text-[11px]">
              <HugeiconsIcon icon={LockKeyIcon} className="h-3 w-3" /> Bloqueados
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Tipo de Documento</Label>
            <Controller
              control={control}
              name="tipoDocumento"
              render={({ field }) => (
                <SelectOption
                  options={tipoDocOptions}
                  value={field.value}
                  onSelect={(val) => field.onChange(val as TipoDocumento)}
                  placeholder="Seleccionar tipo..."
                  disabled={!canEditCritical || isLoading}
                />
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-numeroDocumento" className="text-sm font-medium">
              Número de Documento
            </Label>
            <Input
              id="edit-numeroDocumento"
              disabled={!canEditCritical || isLoading}
              {...register("numeroDocumento")}
            />
            {errors.numeroDocumento && (
              <p className="text-destructive text-xs font-medium">
                {errors.numeroDocumento.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="edit-nombres" className="text-sm font-medium">
            Nombres
          </Label>
          <Input
            id="edit-nombres"
            disabled={!canEditCritical || isLoading}
            {...register("nombres")}
          />
          {errors.nombres && (
            <p className="text-destructive text-xs font-medium">{errors.nombres.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="edit-apellidoPaterno" className="text-sm font-medium">
              Apellido Paterno
            </Label>
            <Input
              id="edit-apellidoPaterno"
              disabled={!canEditCritical || isLoading}
              {...register("apellidoPaterno")}
            />
            {errors.apellidoPaterno && (
              <p className="text-destructive text-xs font-medium">
                {errors.apellidoPaterno.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-apellidoMaterno" className="text-sm font-medium">
              Apellido Materno
            </Label>
            <Input
              id="edit-apellidoMaterno"
              disabled={!canEditCritical || isLoading}
              {...register("apellidoMaterno")}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Sexo</Label>
            <Controller
              control={control}
              name="sexo"
              render={({ field }) => (
                <SelectOption
                  options={sexoOptions}
                  value={field.value}
                  onSelect={(val) => field.onChange(val as "M" | "F")}
                  placeholder="Seleccionar sexo..."
                  disabled={!canEditCritical || isLoading}
                />
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Fecha de Nacimiento</Label>
            <Controller
              control={control}
              name="fechaNacimiento"
              render={({ field }) => (
                <DatePicker
                  date={parseIsoDate(field.value)}
                  onSelect={(date) => field.onChange(formatToIsoDate(date))}
                  maxDate={new Date()}
                  disabled={!canEditCritical || isLoading}
                  clearable={true}
                  dateFormat="dd/MM/yyyy"
                  placeholder="Seleccionar fecha"
                  className="w-full"
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* Sección 2: Datos de Contacto y Ubicación */}
      <div className="space-y-3">
        <h4 className="text-muted-foreground border-b pb-1.5 text-xs font-semibold tracking-wider uppercase">
          Datos de Contacto y Residencia (Datos Libres)
        </h4>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="edit-correo" className="text-sm font-medium">
              Correo Electrónico
            </Label>
            <Input id="edit-correo" type="email" disabled={isLoading} {...register("correo")} />
            {errors.correo && (
              <p className="text-destructive text-xs font-medium">{errors.correo.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-celular" className="text-sm font-medium">
              Celular
            </Label>
            <Input id="edit-celular" disabled={isLoading} {...register("celular")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-telefono" className="text-sm font-medium">
              Teléfono Fijo
            </Label>
            <Input id="edit-telefono" disabled={isLoading} {...register("telefono")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-distrito" className="text-sm font-medium">
              Distrito
            </Label>
            <Input id="edit-distrito" disabled={isLoading} {...register("distrito")} />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="edit-direccion" className="text-sm font-medium">
              Dirección Residencial
            </Label>
            <Input id="edit-direccion" disabled={isLoading} {...register("direccion")} />
          </div>
        </div>
      </div>

      {/* Motivo de auditoría si no es provisional y es admin */}
      {!isProvisional && isAdmin && (
        <div className="border-primary/20 bg-primary/5 space-y-1.5 rounded-xl border p-3.5">
          <Label htmlFor="edit-motivo" className="text-foreground text-xs font-semibold">
            Motivo de la corrección de datos críticos (Auditoría RF-003) *
          </Label>
          <Textarea
            id="edit-motivo"
            placeholder="Indique el sustento (ej. Rectificación de RENIEC, corrección autorizada)..."
            rows={2}
            disabled={isLoading}
            {...register("motivo")}
          />
          <p className="text-muted-foreground text-[11px]">
            Requerido únicamente si modificaste algún dato de identidad protegido.
          </p>
        </div>
      )}

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
          <span>Guardar cambios</span>
        </Button>
      </div>
    </form>
  );
}
