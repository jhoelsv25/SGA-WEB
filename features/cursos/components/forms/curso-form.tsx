"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, CheckmarkCircle02Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/common/spinner";
import { SelectOption } from "@/components/common/select";
import { AREA_CURRICULAR_OPTIONS, COLOR_PRESETS } from "../../consts";
import { cursoFormSchema, type CursoFormValues } from "../../schemas";
import type { AreaCurricular, Curso } from "../../types";

interface CursoFormProps {
  curso?: Curso | null;
  onSubmit: (values: CursoFormValues) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export function CursoForm({ curso, onSubmit, isLoading, onCancel }: CursoFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<CursoFormValues>({
    resolver: zodResolver(cursoFormSchema),
    defaultValues: {
      codigo: curso?.codigo ?? "",
      nombre: curso?.nombre ?? "",
      areaCurricular: curso?.areaCurricular ?? "matematica",
      descripcion: curso?.descripcion ?? "",
      colorHex: curso?.colorHex ?? "#2563EB",
    },
  });

  const selectedArea = useWatch({ control, name: "areaCurricular" });
  const selectedColor = useWatch({ control, name: "colorHex" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Código y Nombre */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5 sm:col-span-1">
          <Label htmlFor="codigo" className="text-sm font-medium">
            Código *
          </Label>
          <Input
            id="codigo"
            placeholder="Ej. MAT, TCOMP"
            disabled={isLoading}
            className="font-mono uppercase"
            maxLength={20}
            aria-invalid={!!errors.codigo}
            {...register("codigo")}
          />
          <p className="text-muted-foreground text-xs">Identificador único (mayúsculas).</p>
          {errors.codigo && (
            <p className="text-destructive text-xs font-medium">{errors.codigo.message}</p>
          )}
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="nombre" className="text-sm font-medium">
            Nombre del Curso *
          </Label>
          <Input
            id="nombre"
            placeholder="Ej. Matemática, Taller de Computación"
            disabled={isLoading}
            maxLength={100}
            aria-invalid={!!errors.nombre}
            {...register("nombre")}
          />
          {errors.nombre && (
            <p className="text-destructive text-xs font-medium">{errors.nombre.message}</p>
          )}
        </div>
      </div>

      {/* Área Curricular */}
      <div className="space-y-1.5">
        <Label htmlFor="areaCurricular" className="text-sm font-medium">
          Área Curricular *
        </Label>
        <SelectOption
          options={AREA_CURRICULAR_OPTIONS}
          value={selectedArea}
          onSelect={(val) =>
            setValue("areaCurricular", val as AreaCurricular, { shouldValidate: true })
          }
          placeholder="Seleccionar área curricular..."
          searchPlaceholder="Buscar área..."
          disabled={isLoading}
        />
        {errors.areaCurricular && (
          <p className="text-destructive text-xs font-medium">{errors.areaCurricular.message}</p>
        )}
      </div>

      {/* Color Identificador */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Color identificador</Label>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.hex}
              type="button"
              disabled={isLoading}
              onClick={() => setValue("colorHex", preset.hex, { shouldValidate: true })}
              className="relative size-8 rounded-full border border-black/10 transition-transform hover:scale-110 focus:ring-2 focus:ring-offset-2 focus:outline-none dark:border-white/10"
              style={{ backgroundColor: preset.hex }}
              title={preset.label}
              aria-label={preset.label}
            >
              {selectedColor?.toUpperCase() === preset.hex.toUpperCase() && (
                <span className="text-primary-foreground absolute inset-0 flex items-center justify-center drop-shadow-md">
                  <HugeiconsIcon icon={Tick02Icon} className="size-4" strokeWidth={3} />
                </span>
              )}
            </button>
          ))}
          <div className="flex items-center gap-2 pl-2">
            <label htmlFor="colorPicker" className="sr-only">
              Color personalizado
            </label>
            <input
              type="color"
              id="colorPicker"
              aria-label="Color personalizado"
              value={selectedColor || "#2563EB"}
              onChange={(e) =>
                setValue("colorHex", e.target.value.toUpperCase(), { shouldValidate: true })
              }
              disabled={isLoading}
              className="border-input size-8 cursor-pointer rounded border bg-transparent p-0"
              title="Selector personalizado"
            />
            <span className="text-muted-foreground font-mono text-xs uppercase">
              {selectedColor || "#2563EB"}
            </span>
          </div>
        </div>
        {errors.colorHex && (
          <p className="text-destructive text-xs font-medium">{errors.colorHex.message}</p>
        )}
      </div>

      {/* Descripción (Opcional) */}
      <div className="space-y-1.5">
        <Label htmlFor="descripcion" className="text-sm font-medium">
          Descripción <span className="text-muted-foreground font-normal">(Opcional)</span>
        </Label>
        <Textarea
          id="descripcion"
          placeholder="Sumilla o propósito formativo del curso..."
          rows={3}
          disabled={isLoading}
          maxLength={500}
          aria-invalid={!!errors.descripcion}
          {...register("descripcion")}
        />
        {errors.descripcion && (
          <p className="text-destructive text-xs font-medium">{errors.descripcion.message}</p>
        )}
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
          disabled={isLoading}
          className="shadow-primary/20 h-10 gap-1.5 rounded-full px-5 text-xs font-semibold shadow-md"
        >
          {isLoading ? (
            <Spinner className="size-3.5" />
          ) : (
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-3.5" />
          )}
          <span>{curso ? "Guardar cambios" : "Crear curso"}</span>
        </Button>
      </div>
    </form>
  );
}
