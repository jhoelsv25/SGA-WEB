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
  createApoderadoSchema,
  type CreateApoderadoFormValues,
} from "../../schemas/apoderados.schema";
import { parseIsoDate, formatToIsoDate } from "../../utils/dates";
import type { Persona } from "../../../personas/types/personas.types";
import type { GradoInstruccion, Parentesco } from "../../types/apoderados.types";

const gradoInstruccionOptions: { value: GradoInstruccion; label: string }[] = [
  { value: "sin_estudios", label: "Sin estudios" },
  { value: "primaria", label: "Primaria completa/incompleta" },
  { value: "secundaria", label: "Secundaria completa/incompleta" },
  { value: "tecnica", label: "Educación Técnica" },
  { value: "universitaria", label: "Educación Universitaria" },
  { value: "posgrado", label: "Posgrado (Maestría / Doctorado)" },
];

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

interface CreateApoderadoFormProps {
  estudianteId?: string;
  estudianteNombre?: string;
  onSubmit: (values: CreateApoderadoFormValues) => Promise<void> | void;
  isLoading?: boolean;
  onCancel: () => void;
  /** Persona del padrón elegida en la búsqueda; sin ella se registra una persona nueva. */
  persona?: Persona | null;
}

export function CreateApoderadoForm({
  estudianteId,
  estudianteNombre,
  onSubmit,
  isLoading = false,
  onCancel,
  persona = null,
}: CreateApoderadoFormProps) {
  const personaVinculada = persona;
  const modo = personaVinculada ? "buscar" : "registrar";

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateApoderadoFormValues>({
    resolver: zodResolver(createApoderadoSchema),
    defaultValues: {
      personaId: persona?.id ?? "",
      ocupacion: "",
      centroLaboral: "",
      telefonoLaboral: "",
      gradoInstruccion: "universitaria",
      estudianteId: estudianteId || "",
      parentesco: "madre",
      esPrincipal: false,
      viveConEstudiante: true,
      autorizadoRecoger: true,
      contactoEmergencia: true,
      nuevaPersona: persona
        ? undefined
        : {
            tipoDocumento: "dni",
            numeroDocumento: "",
            nombres: "",
            apellidoPaterno: "",
            apellidoMaterno: "",
            sexo: "F",
            fechaNacimiento: "",
            direccion: "",
            distrito: "",
            celular: "",
            correo: "",
          },
    },
  });

  const handleFormSubmit = async (values: CreateApoderadoFormValues) => {
    await onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6" noValidate>
      {/* 1. Contexto de vinculación escolar */}
      {estudianteNombre && (
        <div className="border-primary/20 bg-primary/5 flex items-center justify-between rounded-xl border p-3.5">
          <div className="space-y-0.5">
            <span className="text-primary text-xs font-semibold tracking-wide uppercase">
              Vínculo con estudiante
            </span>
            <p className="text-foreground text-sm font-medium">{estudianteNombre}</p>
          </div>
        </div>
      )}

      {personaVinculada && <PersonaVinculadaCard persona={personaVinculada} />}

      {/* 3. Formulario de Persona Nueva (solo si no se vinculó del padrón) */}
      {modo === "registrar" && (
        <div className="border-border/80 bg-card space-y-4 rounded-xl border p-4">
          <Label className="text-foreground text-sm font-semibold">
            2. Datos Personales del Apoderado
          </Label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Tipo de Documento *</Label>
              <Controller
                control={control}
                name="nuevaPersona.tipoDocumento"
                render={({ field }) => (
                  <SelectOption
                    options={[
                      { value: "dni", label: "DNI (8 dígitos)" },
                      { value: "carne_extranjeria", label: "Carné de Extranjería" },
                      { value: "pasaporte", label: "Pasaporte" },
                    ]}
                    value={field.value || "dni"}
                    onSelect={(val) => field.onChange(val)}
                    disabled={isLoading}
                  />
                )}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="apod-doc" className="text-xs">
                Número de Documento *
              </Label>
              <Input
                id="apod-doc"
                placeholder="45678912"
                {...register("nuevaPersona.numeroDocumento")}
                disabled={isLoading}
                className="h-9 font-mono"
              />
              {errors.nuevaPersona?.numeroDocumento && (
                <p className="text-destructive text-xs">
                  {errors.nuevaPersona.numeroDocumento.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="apod-nombres" className="text-xs">
                Nombres *
              </Label>
              <Input
                id="apod-nombres"
                placeholder="María Elena"
                {...register("nuevaPersona.nombres")}
                disabled={isLoading}
                className="h-9"
              />
              {errors.nuevaPersona?.nombres && (
                <p className="text-destructive text-xs">{errors.nuevaPersona.nombres.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="apod-paterno" className="text-xs">
                Apellido Paterno *
              </Label>
              <Input
                id="apod-paterno"
                placeholder="Mamani"
                {...register("nuevaPersona.apellidoPaterno")}
                disabled={isLoading}
                className="h-9"
              />
              {errors.nuevaPersona?.apellidoPaterno && (
                <p className="text-destructive text-xs">
                  {errors.nuevaPersona.apellidoPaterno.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="apod-materno" className="text-xs">
                Apellido Materno
              </Label>
              <Input
                id="apod-materno"
                placeholder="Condori"
                {...register("nuevaPersona.apellidoMaterno")}
                disabled={isLoading}
                className="h-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Sexo *</Label>
              <Controller
                control={control}
                name="nuevaPersona.sexo"
                render={({ field }) => (
                  <SelectOption
                    options={[
                      { value: "F", label: "Femenino" },
                      { value: "M", label: "Masculino" },
                    ]}
                    value={field.value || "F"}
                    onSelect={(val) => field.onChange(val as "M" | "F")}
                    disabled={isLoading}
                  />
                )}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Fecha de Nacimiento</Label>
              <Controller
                control={control}
                name="nuevaPersona.fechaNacimiento"
                render={({ field }) => (
                  <DatePicker
                    date={parseIsoDate(field.value)}
                    onSelect={(date) => field.onChange(formatToIsoDate(date))}
                    placeholder="dd/mm/aaaa"
                    disabled={isLoading}
                    clearable={true}
                    dateFormat="dd/MM/yyyy"
                    maxDate={new Date()}
                    className="w-full"
                  />
                )}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="apod-celular" className="text-xs">
                Celular principal
              </Label>
              <Input
                id="apod-celular"
                placeholder="987654321"
                {...register("nuevaPersona.celular")}
                disabled={isLoading}
                className="h-9 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="apod-correo" className="text-xs">
                Correo Electrónico
              </Label>
              <Input
                id="apod-correo"
                type="email"
                placeholder="apoderado@ejemplo.com"
                {...register("nuevaPersona.correo")}
                disabled={isLoading}
                className="h-9"
              />
              {errors.nuevaPersona?.correo && (
                <p className="text-destructive text-xs">{errors.nuevaPersona.correo.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="apod-direccion" className="text-xs">
                Dirección domiciliaria
              </Label>
              <Input
                id="apod-direccion"
                placeholder="Av. Los Álamos 123, Tacna"
                {...register("nuevaPersona.direccion")}
                disabled={isLoading}
                className="h-9"
              />
            </div>
          </div>
        </div>
      )}

      {
        <>
          {/* 4. Ficha de Apoderado (Datos laborales e instrucción) */}
          <div className="border-border/80 bg-card space-y-4 rounded-xl border p-4">
            <Label className="text-foreground text-sm font-semibold">2. Ficha de Apoderado</Label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Grado de Instrucción</Label>
                <Controller
                  control={control}
                  name="gradoInstruccion"
                  render={({ field }) => (
                    <SelectOption
                      options={gradoInstruccionOptions}
                      value={field.value || "universitaria"}
                      onSelect={(val) => field.onChange(val as GradoInstruccion)}
                      disabled={isLoading}
                    />
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="apod-ocupacion" className="text-xs">
                  Ocupación / Profesión
                </Label>
                <Input
                  id="apod-ocupacion"
                  placeholder="Contadora, Comerciante, etc."
                  {...register("ocupacion")}
                  disabled={isLoading}
                  className="h-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="apod-centro" className="text-xs">
                  Centro laboral / Empresa
                </Label>
                <Input
                  id="apod-centro"
                  placeholder="Empresa o negocio donde labora"
                  {...register("centroLaboral")}
                  disabled={isLoading}
                  className="h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="apod-tel-lab" className="text-xs">
                  Teléfono laboral / anexo
                </Label>
                <Input
                  id="apod-tel-lab"
                  placeholder="014567890 anexo 12"
                  {...register("telefonoLaboral")}
                  disabled={isLoading}
                  className="h-9 font-mono"
                />
              </div>
            </div>
          </div>

          {/* 5. Vínculo Familiar (si se indica estudianteId o se registra con estudiante) */}
          {estudianteId && (
            <div className="border-border/80 bg-card space-y-4 rounded-xl border p-4">
              <Label className="text-foreground text-sm font-semibold">
                4. Vínculo y Responsabilidades Familiares
              </Label>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Parentesco con el estudiante *</Label>
                  <Controller
                    control={control}
                    name="parentesco"
                    render={({ field }) => (
                      <SelectOption
                        options={parentescoOptions}
                        value={field.value || "madre"}
                        onSelect={(val) => field.onChange(val as Parentesco)}
                        disabled={isLoading}
                      />
                    )}
                  />
                  {errors.parentesco && (
                    <p className="text-destructive text-xs">{errors.parentesco.message}</p>
                  )}
                </div>

                <div className="space-y-2 pt-1">
                  <label className="text-foreground flex cursor-pointer items-center gap-2 text-xs font-medium">
                    <input
                      type="checkbox"
                      {...register("esPrincipal")}
                      disabled={isLoading}
                      className="border-border rounded"
                    />
                    Apoderado Principal (Responsable académico y de pagos)
                  </label>

                  <label className="text-foreground flex cursor-pointer items-center gap-2 text-xs font-medium">
                    <input
                      type="checkbox"
                      {...register("viveConEstudiante")}
                      disabled={isLoading}
                      className="border-border rounded"
                    />
                    Convive con el estudiante
                  </label>

                  <label className="text-foreground flex cursor-pointer items-center gap-2 text-xs font-medium">
                    <input
                      type="checkbox"
                      {...register("autorizadoRecoger")}
                      disabled={isLoading}
                      className="border-border rounded"
                    />
                    Autorizado para recoger al alumno del colegio
                  </label>

                  <label className="text-foreground flex cursor-pointer items-center gap-2 text-xs font-medium">
                    <input
                      type="checkbox"
                      {...register("contactoEmergencia")}
                      disabled={isLoading}
                      className="border-border rounded"
                    />
                    Contacto prioritario de emergencia
                  </label>
                </div>
              </div>
            </div>
          )}
        </>
      }

      {/* Botones de acción */}
      <div className="flex items-center justify-end gap-3 pt-2">
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
          Registrar Apoderado
        </Button>
      </div>
    </form>
  );
}
