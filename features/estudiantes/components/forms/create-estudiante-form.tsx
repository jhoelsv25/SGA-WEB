"use client";

import * as React from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/common/date-picker";
import { SelectOption } from "@/components/common/select";
import { Spinner } from "@/components/common/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Search01Icon,
  Alert02Icon,
  UserCheck01Icon,
} from "@hugeicons/core-free-icons";
import { useSearchPersonasQuery } from "../../../personas/hooks/use-personas";
import {
  createEstudianteSchema,
  type CreateEstudianteFormValues,
} from "../../schemas/estudiantes.schema";
import { parseIsoDate, formatToIsoDate } from "../../utils/dates";
import type { CreateEstudianteInput } from "../../types/estudiantes.types";
import type { Persona, TipoDocumento } from "../../../personas/types/personas.types";

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

const discapacidadOptions: { value: string; label: string }[] = [
  { value: "false", label: "No presenta discapacidad" },
  { value: "true", label: "Sí presenta discapacidad certificada" },
];

interface CreateEstudianteFormProps {
  onSubmit: (input: CreateEstudianteInput) => Promise<void> | void;
  isLoading?: boolean;
  onCancel: () => void;
}

export function CreateEstudianteForm({
  onSubmit,
  isLoading = false,
  onCancel,
}: CreateEstudianteFormProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [personaVinculada, setPersonaVinculada] = React.useState<Persona | null>(null);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: searchResult, isFetching: isSearching } = useSearchPersonasQuery(
    { search: debouncedSearch, destinoFicha: "estudiante" },
    Boolean(debouncedSearch.length >= 3 && !personaVinculada),
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CreateEstudianteFormValues>({
    resolver: zodResolver(createEstudianteSchema),
    defaultValues: {
      personaId: "",
      codigo: "",
      fechaIngreso: formatToIsoDate(new Date()),
      lenguaMaterna: "Castellano",
      religion: "",
      tieneDiscapacidad: false,
      detalleDiscapacidad: "",
      grupoSanguineo: "",
      alergias: "",
      condicionesMedicas: "",
      seguroSalud: "",
      nuevaPersona: {
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

  const tieneDiscapacidadValor = useWatch({ control, name: "tieneDiscapacidad" });

  const handleVincularPersona = (persona: Persona) => {
    setPersonaVinculada(persona);
    setValue("personaId", persona.id, { shouldValidate: true });
    setValue("nuevaPersona", undefined);
  };

  const handleDesvincularPersona = () => {
    setPersonaVinculada(null);
    setValue("personaId", "");
    setValue("nuevaPersona", {
      tipoDocumento: "dni",
      numeroDocumento: "",
      nombres: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      sexo: "M",
      fechaNacimiento: "",
      celular: "",
      correo: "",
    });
    setSearchTerm("");
  };

  const handleFormSubmit = async (values: CreateEstudianteFormValues) => {
    if (searchResult?.yaTieneFicha) return;

    if (personaVinculada) {
      await onSubmit({
        personaId: personaVinculada.id,
        codigo: values.codigo.trim(),
        fechaIngreso: values.fechaIngreso,
        lenguaMaterna: values.lenguaMaterna?.trim() || undefined,
        religion: values.religion?.trim() || undefined,
        tieneDiscapacidad: values.tieneDiscapacidad,
        detalleDiscapacidad: values.tieneDiscapacidad
          ? values.detalleDiscapacidad?.trim() || undefined
          : undefined,
        grupoSanguineo: values.grupoSanguineo?.trim() || undefined,
        alergias: values.alergias?.trim() || undefined,
        condicionesMedicas: values.condicionesMedicas?.trim() || undefined,
        seguroSalud: values.seguroSalud?.trim() || undefined,
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
        codigo: values.codigo.trim(),
        fechaIngreso: values.fechaIngreso,
        lenguaMaterna: values.lenguaMaterna?.trim() || undefined,
        religion: values.religion?.trim() || undefined,
        tieneDiscapacidad: values.tieneDiscapacidad,
        detalleDiscapacidad: values.tieneDiscapacidad
          ? values.detalleDiscapacidad?.trim() || undefined
          : undefined,
        grupoSanguineo: values.grupoSanguineo?.trim() || undefined,
        alergias: values.alergias?.trim() || undefined,
        condicionesMedicas: values.condicionesMedicas?.trim() || undefined,
        seguroSalud: values.seguroSalud?.trim() || undefined,
      });
    }
  };

  const yaTieneFicha = Boolean(searchResult?.yaTieneFicha);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
      {/* 1. Búsqueda preventiva en el padrón */}
      <div className="border-border/70 bg-card space-y-2.5 rounded-xl border p-3.5">
        <Label className="text-foreground text-sm font-semibold">
          1. Búsqueda preventiva en el padrón único
        </Label>
        <p className="text-muted-foreground text-xs">
          Verifica primero si el estudiante ya existe en el padrón escolar antes de registrarlo.
        </p>

        {!personaVinculada ? (
          <>
            <div className="relative">
              <HugeiconsIcon
                icon={Search01Icon}
                className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
              />
              <Input
                placeholder="Ingrese DNI o apellidos para verificar en padrón..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isLoading}
                className="pl-9 text-xs"
              />
              {isSearching && (
                <Spinner className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
              )}
            </div>

            {searchResult?.encontrada && searchResult.persona && (
              <div
                className={`flex items-start gap-2.5 rounded-lg border p-3 ${
                  yaTieneFicha
                    ? "border-destructive/40 bg-destructive/10 text-destructive"
                    : "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
                }`}
              >
                <HugeiconsIcon
                  icon={yaTieneFicha ? Alert02Icon : CheckmarkCircle02Icon}
                  className="mt-0.5 h-5 w-5 shrink-0"
                />
                <div className="flex-1 space-y-0.5">
                  <p className="text-xs font-semibold">{searchResult.mensaje}</p>
                  <p className="text-[11px] opacity-90">
                    {searchResult.persona.nombreCompleto} (
                    {searchResult.persona.tipoDocumento.toUpperCase()}:{" "}
                    {searchResult.persona.numeroDocumento})
                  </p>
                </div>
                {!yaTieneFicha && (
                  <Button
                    type="button"
                    size="sm"
                    className="h-7 gap-1 px-2.5 text-xs"
                    onClick={() => handleVincularPersona(searchResult.persona!)}
                  >
                    <HugeiconsIcon icon={UserCheck01Icon} className="size-3.5" />
                    <span>Vincular</span>
                  </Button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="border-primary/30 bg-primary/5 flex items-center justify-between rounded-lg border p-3 text-xs">
            <div className="space-y-0.5">
              <span className="text-primary block text-[11px] font-semibold">
                Persona vinculada del padrón
              </span>
              <p className="text-foreground text-sm font-medium">
                {personaVinculada.nombreCompleto}
              </p>
              <p className="text-muted-foreground font-mono text-xs">
                {personaVinculada.tipoDocumento.toUpperCase()}: {personaVinculada.numeroDocumento}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDesvincularPersona}
              className="h-7 text-xs"
            >
              Cambiar persona
            </Button>
          </div>
        )}
      </div>

      {/* 2. Datos personales (Si es nueva persona) */}
      {!personaVinculada && (
        <div className="border-border/70 space-y-3 rounded-xl border p-3.5">
          <Label className="text-foreground text-sm font-semibold">
            2. Datos del nuevo estudiante (Padrón Único)
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
              <Label htmlFor="numDoc" className="text-sm font-medium">
                Número de documento *
              </Label>
              <Input
                id="numDoc"
                placeholder="Ej. 71234567"
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
              Nombres completos *
            </Label>
            <Input
              id="nombres"
              placeholder="Ej. Mateo Jesús"
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
              <Label htmlFor="paterno" className="text-sm font-medium">
                Apellido paterno *
              </Label>
              <Input
                id="paterno"
                placeholder="Ej. Quispe"
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
              <Label htmlFor="materno" className="text-sm font-medium">
                Apellido materno (Opcional)
              </Label>
              <Input
                id="materno"
                placeholder="Ej. Mamani"
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
                    maxDate={new Date()}
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
        </div>
      )}

      {/* 3. Ficha Escolar y Médica */}
      <div className="border-border/70 space-y-3 rounded-xl border p-3.5">
        <Label className="text-foreground text-sm font-semibold">
          {personaVinculada ? "2. Ficha Escolar y Médica" : "3. Ficha Escolar y Médica"}
        </Label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="codigo" className="text-sm font-medium">
              Código SIAGIE único *
            </Label>
            <Input
              id="codigo"
              placeholder="Ej. 20261234567890"
              disabled={isLoading}
              {...register("codigo")}
            />
            <p className="text-muted-foreground text-xs">
              Será el usuario de acceso al aula y portal escolar.
            </p>
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
              <p className="text-destructive text-xs font-medium">{errors.fechaIngreso.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="lenguaMaterna" className="text-sm font-medium">
              Lengua materna (Opcional)
            </Label>
            <Input
              id="lenguaMaterna"
              placeholder="Ej. Castellano, Quechua..."
              disabled={isLoading}
              {...register("lenguaMaterna")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="religion" className="text-sm font-medium">
              Religión (Opcional)
            </Label>
            <Input
              id="religion"
              placeholder="Ej. Católica, Evangélica..."
              disabled={isLoading}
              {...register("religion")}
            />
          </div>
        </div>

        {/* Discapacidad */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Discapacidad certificada</Label>
            <Controller
              control={control}
              name="tieneDiscapacidad"
              render={({ field }) => (
                <SelectOption
                  options={discapacidadOptions}
                  value={String(field.value)}
                  onSelect={(val) => field.onChange(val === "true")}
                  placeholder="Seleccionar condición..."
                  disabled={isLoading}
                />
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="detalleDiscapacidad" className="text-sm font-medium">
              Detalle de discapacidad {tieneDiscapacidadValor ? "*" : "(Opcional)"}
            </Label>
            <Input
              id="detalleDiscapacidad"
              placeholder="Ej. Auditiva moderada, motriz..."
              disabled={isLoading || !tieneDiscapacidadValor}
              {...register("detalleDiscapacidad")}
            />
            {errors.detalleDiscapacidad && (
              <p className="text-destructive text-xs font-medium">
                {errors.detalleDiscapacidad.message}
              </p>
            )}
          </div>
        </div>

        {/* Salud y emergencias */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="grupoSanguineo" className="text-sm font-medium">
              Grupo sanguíneo
            </Label>
            <Input
              id="grupoSanguineo"
              placeholder="Ej. O+, A+"
              disabled={isLoading}
              {...register("grupoSanguineo")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="alergias" className="text-sm font-medium">
              Alergias
            </Label>
            <Input
              id="alergias"
              placeholder="Ej. Penicilina..."
              disabled={isLoading}
              {...register("alergias")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="seguroSalud" className="text-sm font-medium">
              Seguro de salud
            </Label>
            <Input
              id="seguroSalud"
              placeholder="Ej. SIS, EsSalud..."
              disabled={isLoading}
              {...register("seguroSalud")}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="condicionesMedicas" className="text-sm font-medium">
            Condiciones médicas relevantes (Opcional)
          </Label>
          <Input
            id="condicionesMedicas"
            placeholder="Ej. Asma bronquial controlada, tratamiento con inhalador..."
            disabled={isLoading}
            {...register("condicionesMedicas")}
          />
        </div>
      </div>

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
          disabled={isLoading || yaTieneFicha}
          className="shadow-primary/20 h-10 gap-1.5 rounded-full px-5 text-xs font-semibold shadow-md"
        >
          {isLoading ? (
            <Spinner className="size-3.5" />
          ) : (
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
          )}
          <span>Guardar estudiante</span>
        </Button>
      </div>
    </form>
  );
}
