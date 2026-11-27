"use client";

import * as React from "react";
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
import { PersonaVinculadaCard } from "../../../personas/components/persona-vinculada-card";
import {
  BajaFichaActualField,
  MOTIVO_BAJA_MIN,
} from "../../../personas/components/baja-ficha-actual-field";
import { fichaVigenteAlRegistrar } from "../../../personas/utils/ficha-academica";
import { createDocenteSchema, type CreateDocenteFormValues } from "../../schemas/docentes.schema";
import { parseIsoDate, formatToIsoDate } from "../../utils/dates";
import type { CreateDocenteInput, JornadaHoras, TipoContrato } from "../../types/docentes.types";
import type { Persona, TipoDocumento } from "../../../personas/types/personas.types";

const contratoOptions: { value: TipoContrato; label: string }[] = [
  { value: "nombrado", label: "Nombrado" },
  { value: "contratado", label: "Contratado" },
  { value: "destacado", label: "Destacado" },
  { value: "encargado", label: "Encargado" },
  { value: "practicante", label: "Practicante" },
];

const jornadaOptions: { value: string; label: string }[] = [
  { value: "20", label: "20 horas pedagógicas" },
  { value: "24", label: "24 horas pedagógicas" },
  { value: "30", label: "30 horas pedagógicas" },
  { value: "40", label: "40 horas pedagógicas" },
];

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

interface CreateDocenteFormProps {
  onSubmit: (input: CreateDocenteInput) => Promise<void> | void;
  isLoading?: boolean;
  onCancel: () => void;
  /** Persona del padrón elegida en la búsqueda; sin ella se registra una persona nueva. */
  persona?: Persona | null;
}

export function CreateDocenteForm({
  onSubmit,
  isLoading = false,
  onCancel,
  persona = null,
}: CreateDocenteFormProps) {
  const personaVinculada = persona;
  const modo = personaVinculada ? "buscar" : "registrar";
  const requiereBaja = personaVinculada
    ? fichaVigenteAlRegistrar(personaVinculada, "docente") !== null
    : false;
  const [motivoBaja, setMotivoBaja] = React.useState("");
  const [errorMotivoBaja, setErrorMotivoBaja] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateDocenteFormValues>({
    resolver: zodResolver(createDocenteSchema),
    defaultValues: {
      personaId: persona?.id ?? "",
      codigo: "",
      especialidad: "",
      tituloProfesional: "",
      tipoContrato: "nombrado",
      jornadaHoras: 30,
      fechaIngreso: formatToIsoDate(new Date()),
      nuevaPersona: persona
        ? undefined
        : {
            tipoDocumento: "dni",
            numeroDocumento: "",
            nombres: "",
            apellidoPaterno: "",
            apellidoMaterno: "",
            sexo: "M",
            fechaNacimiento: "",
            celular: "",
            correo: "",
          },
    },
  });

  const handleFormSubmit = async (values: CreateDocenteFormValues) => {
    if (requiereBaja && motivoBaja.trim().length < MOTIVO_BAJA_MIN) {
      setErrorMotivoBaja(`Indique el motivo de la baja (mínimo ${MOTIVO_BAJA_MIN} caracteres).`);
      return;
    }
    setErrorMotivoBaja(null);

    if (personaVinculada) {
      await onSubmit({
        personaId: personaVinculada.id,
        darBajaFichaActual: requiereBaja ? { motivo: motivoBaja.trim() } : undefined,
        codigo: values.codigo?.trim() || undefined,
        especialidad: values.especialidad?.trim() || undefined,
        tituloProfesional: values.tituloProfesional?.trim() || undefined,
        tipoContrato: values.tipoContrato,
        jornadaHoras: values.jornadaHoras,
        fechaIngreso: values.fechaIngreso,
        cargoId: values.cargoId || undefined,
      });
    } else if (values.nuevaPersona) {
      await onSubmit({
        nuevaPersona: {
          tipoDocumento: values.nuevaPersona.tipoDocumento,
          numeroDocumento: values.nuevaPersona.numeroDocumento.trim(),
          nombres: values.nuevaPersona.nombres.trim(),
          apellidoPaterno: values.nuevaPersona.apellidoPaterno.trim(),
          apellidoMaterno: values.nuevaPersona.apellidoMaterno?.trim() || undefined,
          sexo: values.nuevaPersona.sexo,
          fechaNacimiento: values.nuevaPersona.fechaNacimiento || undefined,
          celular: values.nuevaPersona.celular?.trim() || undefined,
          correo: values.nuevaPersona.correo?.trim() || undefined,
        },
        codigo: values.codigo?.trim() || undefined,
        especialidad: values.especialidad?.trim() || undefined,
        tituloProfesional: values.tituloProfesional?.trim() || undefined,
        tipoContrato: values.tipoContrato,
        jornadaHoras: values.jornadaHoras,
        fechaIngreso: values.fechaIngreso,
        cargoId: values.cargoId || undefined,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
      {personaVinculada && <PersonaVinculadaCard persona={personaVinculada} />}
      <BajaFichaActualField
        persona={personaVinculada}
        destino="docente"
        motivo={motivoBaja}
        onMotivoChange={setMotivoBaja}
        error={errorMotivoBaja}
        disabled={isLoading}
      />

      {/* 2. Datos personales (Solo si se registra una nueva persona) */}
      {modo === "registrar" && (
        <div className="border-border/70 space-y-3 rounded-xl border p-3.5">
          <Label className="text-foreground text-sm font-semibold">
            1. Datos de la nueva persona a incorporar
          </Label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Tipo de documento *</Label>
              <Controller
                control={control}
                name="nuevaPersona.tipoDocumento"
                render={({ field }) => (
                  <SelectOption
                    options={tipoDocOptions}
                    value={field.value}
                    onSelect={(val) => field.onChange(val as TipoDocumento)}
                    placeholder="Tipo de documento..."
                    disabled={isLoading}
                  />
                )}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="numeroDocumento" className="text-sm font-medium">
                Número de documento *
              </Label>
              <Input
                id="numeroDocumento"
                placeholder="Ej. 45678912"
                disabled={isLoading}
                {...register("nuevaPersona.numeroDocumento")}
              />
              {errors.nuevaPersona?.numeroDocumento && (
                <p className="text-destructive text-xs font-medium">
                  {errors.nuevaPersona.numeroDocumento.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="nombres" className="text-sm font-medium">
              Nombres *
            </Label>
            <Input
              id="nombres"
              placeholder="Ej. Diego Alonso"
              disabled={isLoading}
              {...register("nuevaPersona.nombres")}
            />
            {errors.nuevaPersona?.nombres && (
              <p className="text-destructive text-xs font-medium">
                {errors.nuevaPersona.nombres.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="apellidoPaterno" className="text-sm font-medium">
                Apellido paterno *
              </Label>
              <Input
                id="apellidoPaterno"
                placeholder="Ej. Ramos"
                disabled={isLoading}
                {...register("nuevaPersona.apellidoPaterno")}
              />
              {errors.nuevaPersona?.apellidoPaterno && (
                <p className="text-destructive text-xs font-medium">
                  {errors.nuevaPersona.apellidoPaterno.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="apellidoMaterno" className="text-sm font-medium">
                Apellido materno (Opcional)
              </Label>
              <Input
                id="apellidoMaterno"
                placeholder="Ej. Flores"
                disabled={isLoading}
                {...register("nuevaPersona.apellidoMaterno")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Sexo biológico *</Label>
              <Controller
                control={control}
                name="nuevaPersona.sexo"
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
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Fecha de nacimiento (Opcional)</Label>
              <Controller
                control={control}
                name="nuevaPersona.fechaNacimiento"
                render={({ field }) => (
                  <DatePicker
                    date={parseIsoDate(field.value)}
                    onSelect={(date) => field.onChange(formatToIsoDate(date))}
                    disabled={isLoading}
                    clearable={true}
                    dateFormat="dd/MM/yyyy"
                    placeholder="Seleccionar fecha"
                    className="w-full"
                  />
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="celular" className="text-sm font-medium">
                Celular (Opcional)
              </Label>
              <Input
                id="celular"
                placeholder="Ej. 987654321"
                disabled={isLoading}
                {...register("nuevaPersona.celular")}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="correo" className="text-sm font-medium">
                Correo electrónico (Opcional)
              </Label>
              <Input
                id="correo"
                type="email"
                placeholder="docente@ejemplo.com"
                disabled={isLoading}
                {...register("nuevaPersona.correo")}
              />
              {errors.nuevaPersona?.correo && (
                <p className="text-destructive text-xs font-medium">
                  {errors.nuevaPersona.correo.message}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {
        <>
          {/* 3. Ficha Laboral del Docente */}
          <div className="border-border/70 space-y-3 rounded-xl border p-3.5">
            <Label className="text-foreground text-sm font-semibold">
              2. Ficha Laboral Docente
            </Label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="codigo" className="text-sm font-medium">
                  Código de docente{" "}
                  <span className="text-muted-foreground font-normal">(opcional)</span>
                </Label>
                <Input
                  id="codigo"
                  placeholder="Auto: 20261124000001"
                  disabled={isLoading}
                  {...register("codigo")}
                />
                {errors.codigo && (
                  <p className="text-destructive text-xs font-medium">{errors.codigo.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Fecha de ingreso *</Label>
                <Controller
                  control={control}
                  name="fechaIngreso"
                  render={({ field }) => (
                    <DatePicker
                      date={parseIsoDate(field.value)}
                      onSelect={(date) => field.onChange(formatToIsoDate(date))}
                      disabled={isLoading}
                      clearable={false}
                      dateFormat="dd/MM/yyyy"
                      placeholder="Seleccionar fecha de ingreso"
                      className={
                        errors.fechaIngreso
                          ? "border-destructive ring-destructive/20 w-full ring-1"
                          : "w-full"
                      }
                    />
                  )}
                />
                {errors.fechaIngreso && (
                  <p className="text-destructive text-xs font-medium">
                    {errors.fechaIngreso.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="especialidad" className="text-sm font-medium">
                  Especialidad pedagógica (Opcional)
                </Label>
                <Input
                  id="especialidad"
                  placeholder="Ej. Matemáticas, Comunicación..."
                  disabled={isLoading}
                  {...register("especialidad")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tituloProfesional" className="text-sm font-medium">
                  Título profesional (Opcional)
                </Label>
                <Input
                  id="tituloProfesional"
                  placeholder="Ej. Licenciado en Educación"
                  disabled={isLoading}
                  {...register("tituloProfesional")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Régimen de contrato *</Label>
                <Controller
                  control={control}
                  name="tipoContrato"
                  render={({ field }) => (
                    <SelectOption
                      options={contratoOptions}
                      value={field.value}
                      onSelect={(val) => field.onChange(val as TipoContrato)}
                      placeholder="Seleccionar contrato..."
                      disabled={isLoading}
                    />
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Jornada laboral *</Label>
                <Controller
                  control={control}
                  name="jornadaHoras"
                  render={({ field }) => (
                    <SelectOption
                      options={jornadaOptions}
                      value={String(field.value)}
                      onSelect={(val) => field.onChange(Number(val) as JornadaHoras)}
                      placeholder="Seleccionar jornada..."
                      disabled={isLoading}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </>
      }

      {/* Botones de acción */}
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
          <span>Guardar docente</span>
        </Button>
      </div>
    </form>
  );
}
