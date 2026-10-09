"use client";

import * as React from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  Cancel01Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/common/spinner";
import { SelectOption } from "@/components/common/select";
import {
  TIPO_EQUIPO_OPTIONS,
  PROPOSITO_EQUIPO_OPTIONS,
  USUARIOS_PERMITIDOS_OPTIONS,
} from "../../consts";
import { parseUsuariosPermitidos } from "../../utils";
import { equipoSchema, type EquipoFormValues } from "../../schemas";
import type { Equipo, UsuarioPermitido } from "../../types";

interface EquipoFormProps {
  initialEquipo?: Equipo | null;
  onSubmit: (values: EquipoFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function EquipoForm({
  initialEquipo,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: EquipoFormProps) {
  const isEditing = Boolean(initialEquipo);

  const initialUsuarios: UsuarioPermitido[] = initialEquipo?.usuariosPermitidos
    ? parseUsuariosPermitidos(initialEquipo.usuariosPermitidos)
    : ["estudiantes"];

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<EquipoFormValues>({
    resolver: zodResolver(equipoSchema),
    defaultValues: {
      nombre: initialEquipo?.nombre || "",
      ubicacion: initialEquipo?.ubicacion || "",
      tipo: initialEquipo?.tipo || "kiosko",
      proposito: initialEquipo?.proposito || "marcacion",
      usuariosPermitidos: initialUsuarios.length > 0 ? initialUsuarios : ["estudiantes"],
      numeroSerie: initialEquipo?.numeroSerie || "",
      activo: initialEquipo?.activo ?? true,
    },
  });

  const watchProposito = useWatch({ control, name: "proposito" });
  const watchTipo = useWatch({ control, name: "tipo" });
  const watchUsuarios = useWatch({ control, name: "usuariosPermitidos" }) || [];

  // Regla Gherkin: Si el propósito es 'sesiones', debe ser 'kiosko' y exclusivo de 'docentes'
  React.useEffect(() => {
    if (watchProposito === "sesiones") {
      setValue("tipo", "kiosko", { shouldValidate: true });
      setValue("usuariosPermitidos", ["docentes"], { shouldValidate: true });
    }
  }, [watchProposito, setValue]);

  const toggleUsuarioPermitido = (usuario: UsuarioPermitido) => {
    if (watchProposito === "sesiones") return; // Fijo para sesiones

    if (watchUsuarios.includes(usuario)) {
      setValue(
        "usuariosPermitidos",
        watchUsuarios.filter((u) => u !== usuario),
        { shouldValidate: true },
      );
    } else {
      setValue("usuariosPermitidos", [...watchUsuarios, usuario], {
        shouldValidate: true,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-4">
        {/* Nombre y Ubicación */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="nombre" className="text-xs font-semibold">
              Nombre del equipo <span className="text-destructive">*</span>
            </Label>
            <Input
              id="nombre"
              placeholder="Ej. Kiosko Puerta Principal"
              {...register("nombre")}
              disabled={isSubmitting}
            />
            {errors.nombre && <p className="text-destructive text-xs">{errors.nombre.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ubicacion" className="text-xs font-semibold">
              Ubicación física <span className="text-destructive">*</span>
            </Label>
            <Input
              id="ubicacion"
              placeholder="Ej. Garita de Entrada, Subdirección"
              {...register("ubicacion")}
              disabled={isSubmitting}
            />
            {errors.ubicacion && (
              <p className="text-destructive text-xs">{errors.ubicacion.message}</p>
            )}
          </div>
        </div>

        {/* Propósito y Tipo */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="proposito" className="text-xs font-semibold">
              Propósito operativo <span className="text-destructive">*</span>
            </Label>
            <Controller
              control={control}
              name="proposito"
              render={({ field }) => (
                <SelectOption
                  value={field.value}
                  onSelect={field.onChange}
                  options={PROPOSITO_EQUIPO_OPTIONS}
                  placeholder="Seleccione el propósito"
                  disabled={isSubmitting}
                />
              )}
            />
            {errors.proposito && (
              <p className="text-destructive text-xs">{errors.proposito.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tipo" className="text-xs font-semibold">
              Tipo de dispositivo <span className="text-destructive">*</span>
            </Label>
            <Controller
              control={control}
              name="tipo"
              render={({ field }) => (
                <SelectOption
                  value={field.value}
                  onSelect={field.onChange}
                  options={TIPO_EQUIPO_OPTIONS}
                  placeholder="Seleccione el tipo de dispositivo"
                  disabled={isSubmitting || watchProposito === "sesiones"}
                />
              )}
            />
            {errors.tipo && <p className="text-destructive text-xs">{errors.tipo.message}</p>}
          </div>
        </div>

        {/* Número de Serie (si es biométrico) */}
        {watchTipo === "biometrico" && (
          <div className="border-warning/20 bg-warning/10 space-y-1.5 rounded-xl border p-3">
            <Label htmlFor="numeroSerie" className="text-foreground text-xs font-semibold">
              Número de serie del reloj biométrico (Opcional)
            </Label>
            <Input
              id="numeroSerie"
              placeholder="Ej. ZK-TECO-MB360-99482"
              {...register("numeroSerie")}
              disabled={isSubmitting}
            />
            <p className="text-muted-foreground text-[11px]">
              Identificador de hardware para sincronización de huellas en versiones futuras.
            </p>
            {errors.numeroSerie && (
              <p className="text-destructive text-xs">{errors.numeroSerie.message}</p>
            )}
          </div>
        )}

        {/* Quién puede usar este equipo */}
        <div className="bg-muted/20 space-y-2 rounded-xl border p-3.5">
          <Label className="text-xs font-semibold">
            ¿Quién puede usar este equipo? <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-1 gap-2.5 pt-1 sm:grid-cols-3">
            {USUARIOS_PERMITIDOS_OPTIONS.map((opt) => {
              const isChecked = watchUsuarios.includes(opt.value);
              const isLocked = watchProposito === "sesiones";

              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleUsuarioPermitido(opt.value)}
                  disabled={isSubmitting || isLocked}
                  aria-pressed={isChecked}
                  className={`flex min-h-[44px] items-center gap-2 rounded-lg border p-2.5 text-xs font-medium transition-all ${
                    isChecked
                      ? "bg-primary/10 border-primary/40 text-primary font-semibold"
                      : "bg-background border-border text-muted-foreground hover:bg-muted/60"
                  } ${isLocked ? "cursor-not-allowed opacity-80" : ""}`}
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded border text-[10px] ${
                      isChecked
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-muted-foreground/40 bg-background"
                    }`}
                  >
                    {isChecked ? "✓" : ""}
                  </span>
                  {opt.label}
                </button>
              );
            })}
          </div>
          {watchProposito === "sesiones" && (
            <p className="text-info pt-1 text-[11px] font-medium">
              * Para firma de sesiones, el kiosko está reservado exclusivamente para Docentes.
            </p>
          )}
          {errors.usuariosPermitidos && (
            <p className="text-destructive text-xs">{errors.usuariosPermitidos.message}</p>
          )}
        </div>

        {/* Estado Activo */}
        <div className="bg-muted/20 flex items-center justify-between rounded-xl border p-3.5">
          <div className="space-y-0.5">
            <Label htmlFor="activo" className="text-xs font-semibold">
              Equipo activo
            </Label>
            <p className="text-muted-foreground text-[11px]">
              Al desactivarlo, la pantalla del kiosko dejará de permitir marcaciones de inmediato.
            </p>
          </div>
          <Controller
            control={control}
            name="activo"
            render={({ field }) => (
              <Switch
                id="activo"
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isSubmitting}
              />
            )}
          />
        </div>

        {/* Nota explicativa de autorización */}
        <div className="border-info/20 bg-info/10 text-foreground flex items-start gap-2.5 rounded-lg border p-3 text-xs">
          <HugeiconsIcon
            icon={InformationCircleIcon}
            className="text-info mt-0.5 h-4 w-4 shrink-0"
          />
          <p>
            <strong>Paso posterior:</strong> Tras guardar este registro, un miembro de Soporte TI o
            Administrador debe presionar el botón <strong>&quot;Autorizar este equipo&quot;</strong>{" "}
            directamente desde la PC o tablet física donde operará el kiosko.
          </p>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex items-center justify-end gap-2.5 pt-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="h-10 gap-1.5 rounded-full px-4.5 text-xs font-semibold"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
          <span>Cancelar</span>
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="shadow-primary/20 h-10 gap-1.5 rounded-full px-5 text-xs font-semibold shadow-md"
        >
          {isSubmitting ? (
            <Spinner className="size-3.5" />
          ) : (
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
          )}
          <span>{isEditing ? "Guardar cambios" : "Registrar equipo"}</span>
        </Button>
      </div>
    </form>
  );
}
