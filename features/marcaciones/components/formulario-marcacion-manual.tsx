"use client";

import * as React from "react";
import Link from "next/link";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Clock01Icon,
  Time02Icon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  UserIcon,
  ArrowRight01Icon,
  SecurityLockIcon,
  Login01Icon,
  Logout01Icon,
} from "@hugeicons/core-free-icons";
import { CampoFecha } from "@/components/common/date-field";
import { Spinner } from "@/components/common/spinner";
import { UserAvatar } from "@/components/common/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PersonaBuscadorField } from "@/features/personas/components/persona-buscador-field";
import type { Persona } from "@/features/personas/types/personas.types";
import { cn } from "@/lib/utils";
import { useRegistrarMarcacionManual } from "../hooks";
import { marcacionManualSchema, type MarcacionManualFormValues } from "../schemas";

function hoyIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const MOTIVOS_FRECUENTES = [
  "Kiosko sin conexión",
  "Falla de lector de código de barras",
  "Olvido de carnet o documento",
  "Ingreso justificado por Dirección",
  "Corte temporal de fluido eléctrico",
] as const;

export function FormularioMarcacionManual() {
  const [persona, setPersona] = React.useState<Persona | null>(null);
  const registrar = useRegistrarMarcacionManual();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<MarcacionManualFormValues>({
    resolver: zodResolver(marcacionManualSchema),
    defaultValues: {
      personaId: "",
      tipo: "entrada",
      fecha: hoyIso(),
      hora: "",
      observacion: "",
    },
  });

  const tipoMarcacion = useWatch({ control, name: "tipo" });
  const observacionValor = useWatch({ control, name: "observacion" }) || "";
  const horaValor = useWatch({ control, name: "hora" }) || "";

  const ponerHoraActual = () => {
    const d = new Date();
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    setValue("hora", `${h}:${m}`, { shouldValidate: true });
  };

  const enviar = (values: MarcacionManualFormValues) => {
    registrar.mutate(values, {
      onSuccess: () => {
        setPersona(null);
        reset({
          personaId: "",
          tipo: "entrada",
          fecha: hoyIso(),
          hora: "",
          observacion: "",
        });
      },
    });
  };

  const limpiarFormulario = () => {
    setPersona(null);
    reset({
      personaId: "",
      tipo: "entrada",
      fecha: hoyIso(),
      hora: "",
      observacion: "",
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Columna Principal: Formulario */}
      <div className="lg:col-span-8">
        <Card className="border-border/60 bg-card rounded-2xl shadow-xs">
          <CardHeader className="border-border/40 border-b pb-4">
            <div className="flex items-center gap-3">
              <span className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-xl">
                <HugeiconsIcon icon={Clock01Icon} className="size-5" />
              </span>
              <div>
                <CardTitle className="text-base font-bold">Datos de la Marcación Manual</CardTitle>
                <CardDescription className="text-xs">
                  Ingrese la información requerida. Recuerde que cada registro manual queda
                  auditado.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(enviar)} className="space-y-6" noValidate>
              {/* 1. Selección de Persona */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="busqueda-persona" className="text-sm font-semibold">
                    Persona a registrar <span className="text-destructive">*</span>
                  </Label>
                  {persona && (
                    <span className="text-muted-foreground text-xs">
                      {persona.cargoVigente
                        ? `Cargo: ${persona.cargoVigente}`
                        : "Padrón institucional"}
                    </span>
                  )}
                </div>

                <Controller
                  control={control}
                  name="personaId"
                  render={({ field }) => (
                    <PersonaBuscadorField
                      id="busqueda-persona"
                      destino="cualquiera"
                      value={persona}
                      onChange={(elegida) => {
                        setPersona(elegida);
                        field.onChange(elegida?.id ?? "");
                      }}
                      disabled={registrar.isPending}
                    />
                  )}
                />
                {errors.personaId && (
                  <p className="text-destructive flex items-center gap-1.5 text-xs font-medium">
                    <HugeiconsIcon icon={AlertCircleIcon} className="size-3.5 shrink-0" />
                    {errors.personaId.message}
                  </p>
                )}
              </div>

              {/* 2. Parámetros de Marcación (Tipo, Fecha y Hora) */}
              <div className="bg-muted/20 border-border/40 space-y-4 rounded-xl border p-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
                  {/* Selector visual de Tipo (Entrada / Salida) */}
                  <div className="space-y-2 sm:col-span-5">
                    <Label className="text-foreground text-xs font-semibold">
                      Tipo de marcación <span className="text-destructive">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="tipo"
                      render={({ field }) => (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => field.onChange("entrada")}
                            disabled={registrar.isPending}
                            className={cn(
                              "flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition-all",
                              field.value === "entrada"
                                ? "border-emerald-500/60 bg-emerald-500/15 font-bold text-emerald-600 shadow-2xs ring-1 ring-emerald-500/30 dark:text-emerald-400"
                                : "border-border/50 bg-card hover:bg-muted/40 text-muted-foreground",
                            )}
                          >
                            <HugeiconsIcon icon={Login01Icon} className="size-4 text-emerald-500" />
                            <span>Entrada</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => field.onChange("salida")}
                            disabled={registrar.isPending}
                            className={cn(
                              "flex cursor-pointer items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition-all",
                              field.value === "salida"
                                ? "border-blue-500/60 bg-blue-500/15 font-bold text-blue-600 shadow-2xs ring-1 ring-blue-500/30 dark:text-blue-400"
                                : "border-border/50 bg-card hover:bg-muted/40 text-muted-foreground",
                            )}
                          >
                            <HugeiconsIcon icon={Logout01Icon} className="size-4 text-blue-500" />
                            <span>Salida</span>
                          </button>
                        </div>
                      )}
                    />
                  </div>

                  {/* Fecha */}
                  <div className="sm:col-span-4">
                    <CampoFecha
                      control={control}
                      name="fecha"
                      label="Fecha del evento"
                      required
                      error={errors.fecha?.message}
                    />
                  </div>

                  {/* Hora real con botón "Ahora" */}
                  <div className="space-y-2 sm:col-span-3">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="hora-manual"
                        className="text-foreground text-xs font-semibold"
                      >
                        Hora real <span className="text-destructive">*</span>
                      </Label>
                    </div>
                    <div className="flex gap-1.5">
                      <Input
                        id="hora-manual"
                        type="time"
                        disabled={registrar.isPending}
                        aria-invalid={Boolean(errors.hora)}
                        className="h-9 font-mono text-xs font-semibold"
                        {...register("hora")}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={ponerHoraActual}
                        disabled={registrar.isPending}
                        className="h-9 shrink-0 px-2.5 text-xs font-medium"
                        title="Usar la hora actual del sistema"
                      >
                        <HugeiconsIcon icon={Time02Icon} className="size-3.5" />
                        <span className="hidden sm:inline">Ahora</span>
                      </Button>
                    </div>
                    {errors.hora && (
                      <p className="text-destructive text-xs font-medium">{errors.hora.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. Motivo y Observación */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="observacion-manual" className="text-sm font-semibold">
                    Motivo / Observación justificada <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-muted-foreground text-[11px]">
                    {observacionValor.length} / 500 caracteres
                  </span>
                </div>

                {/* Atajos de motivos frecuentes */}
                <div className="space-y-1.5">
                  <span className="text-muted-foreground block text-[11px] font-medium">
                    Motivos frecuentes (clic para autocompletar):
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {MOTIVOS_FRECUENTES.map((motivo) => (
                      <button
                        key={motivo}
                        type="button"
                        onClick={() => setValue("observacion", motivo, { shouldValidate: true })}
                        disabled={registrar.isPending}
                        className={cn(
                          "border-border/60 bg-muted/40 hover:bg-muted/80 text-muted-foreground hover:text-foreground cursor-pointer rounded-full border px-2.5 py-1 text-[11px] transition-colors",
                          observacionValor === motivo &&
                            "border-primary/50 bg-primary/10 text-primary font-semibold",
                        )}
                      >
                        {motivo}
                      </button>
                    ))}
                  </div>
                </div>

                <Textarea
                  id="observacion-manual"
                  placeholder="Detalle la causa por la que la persona no pudo realizar la marcación en el kiosko..."
                  maxLength={500}
                  rows={3}
                  disabled={registrar.isPending}
                  aria-invalid={Boolean(errors.observacion)}
                  className="resize-none text-xs"
                  {...register("observacion")}
                />
                {errors.observacion && (
                  <p className="text-destructive flex items-center gap-1.5 text-xs font-medium">
                    <HugeiconsIcon icon={AlertCircleIcon} className="size-3.5 shrink-0" />
                    {errors.observacion.message}
                  </p>
                )}
              </div>

              {/* Acciones */}
              <div className="border-border/40 flex items-center justify-between border-t pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={limpiarFormulario}
                  disabled={registrar.isPending}
                  className="text-muted-foreground hover:text-foreground text-xs"
                >
                  Restablecer
                </Button>

                <Button
                  type="submit"
                  size="default"
                  disabled={registrar.isPending || !persona}
                  className="gap-2 font-semibold shadow-xs"
                >
                  {registrar.isPending ? (
                    <Spinner className="size-4" />
                  ) : (
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4" />
                  )}
                  Registrar marcación
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Columna Lateral: Ficha activa y Directrices */}
      <div className="space-y-4 lg:col-span-4">
        {/* Ficha contextual de la persona */}
        <Card className="border-border/60 bg-card rounded-2xl shadow-xs">
          <CardHeader className="border-border/40 border-b pb-3">
            <CardTitle className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              Ficha del Seleccionado
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {persona ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    name={persona.nombreCompleto}
                    avatar={persona.fotoUrl}
                    className="border-primary/20 size-12 border-2 text-sm"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground truncate text-sm font-bold">
                      {persona.nombreCompleto}
                    </p>
                    <p className="text-muted-foreground font-mono text-xs">
                      {persona.tipoDocumento.toUpperCase()}: {persona.numeroDocumento}
                    </p>
                  </div>
                </div>

                <div className="bg-muted/30 border-border/40 space-y-2 rounded-xl border p-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-[11px]">Roles activos:</span>
                    <div className="flex flex-wrap justify-end gap-1">
                      {persona.fichas?.esDocente && (
                        <Badge
                          variant="outline"
                          className="border-emerald-500/40 bg-emerald-500/10 text-[10px] text-emerald-600 dark:text-emerald-400"
                        >
                          Docente
                        </Badge>
                      )}
                      {persona.fichas?.esEstudiante && (
                        <Badge
                          variant="outline"
                          className="border-blue-500/40 bg-blue-500/10 text-[10px] text-blue-600 dark:text-blue-400"
                        >
                          Estudiante
                        </Badge>
                      )}
                      {persona.fichas?.esApoderado && (
                        <Badge
                          variant="outline"
                          className="border-purple-500/40 bg-purple-500/10 text-[10px] text-purple-600 dark:text-purple-400"
                        >
                          Apoderado
                        </Badge>
                      )}
                      {persona.fichas?.tieneUsuario && (
                        <Badge
                          variant="outline"
                          className="border-cyan-500/40 bg-cyan-500/10 text-[10px] text-cyan-600 dark:text-cyan-400"
                        >
                          Cuenta Activa
                        </Badge>
                      )}
                    </div>
                  </div>

                  {persona.cargoVigente && (
                    <div className="border-border/30 flex items-center justify-between border-t pt-1">
                      <span className="text-muted-foreground text-[11px]">
                        Cargo institucional:
                      </span>
                      <strong className="text-foreground font-semibold">
                        {persona.cargoVigente}
                      </strong>
                    </div>
                  )}

                  {persona.celular && (
                    <div className="border-border/30 flex items-center justify-between border-t pt-1">
                      <span className="text-muted-foreground text-[11px]">Contacto:</span>
                      <span className="text-foreground font-mono text-[11px]">
                        {persona.celular}
                      </span>
                    </div>
                  )}
                </div>

                {/* Previsualización del registro */}
                <div className="bg-primary/5 border-primary/20 space-y-1.5 rounded-xl border p-3 text-xs">
                  <span className="text-primary block text-[11px] font-semibold">
                    Resumen de registro:
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-[11px]">Acción:</span>
                    <Badge
                      variant={tipoMarcacion === "entrada" ? "default" : "secondary"}
                      className="text-[10px] font-semibold capitalize"
                    >
                      {tipoMarcacion}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-[11px]">Hora:</span>
                    <strong className="text-foreground font-mono text-xs">
                      {horaValor ? `${horaValor} hrs` : "No indicada aún"}
                    </strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground space-y-2 py-6 text-center text-xs">
                <div className="bg-muted/40 mx-auto flex size-10 items-center justify-center rounded-full">
                  <HugeiconsIcon icon={UserIcon} className="text-muted-foreground size-5" />
                </div>
                <p className="text-foreground font-medium">Sin persona seleccionada</p>
                <p className="text-muted-foreground px-4 text-[11px]">
                  Use el buscador para seleccionar un estudiante, docente o personal y verificar su
                  ficha.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Políticas de Trazabilidad y Acceso */}
        <Card className="border-border/60 bg-card rounded-2xl shadow-xs">
          <CardHeader className="border-border/40 border-b pb-3">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={SecurityLockIcon} className="size-4 text-emerald-500" />
              <CardTitle className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                Trazabilidad y Auditoría
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-3 pt-4 text-xs">
            <p className="text-[11px] leading-relaxed">
              Toda marcación manual se registra de forma <strong>inmutable</strong> en la bitácora
              del sistema, guardando el usuario emisor, la fecha, hora exacta y dirección IP de
              origen.
            </p>

            <div className="divide-border/40 border-border/40 bg-muted/20 divide-y rounded-xl border text-xs">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-9 w-full justify-between px-3 text-xs font-medium"
              >
                <Link href="/admin/marcaciones-hoy">
                  <span>Ver marcaciones de hoy</span>
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    className="text-muted-foreground size-3.5"
                  />
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-9 w-full justify-between px-3 text-xs font-medium"
              >
                <Link href="/admin/audit">
                  <span>Consultar bitácora general</span>
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    className="text-muted-foreground size-3.5"
                  />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
