"use client";

import { Controller, type FieldValues } from "react-hook-form";
import { DatePicker } from "@/components/common/date-picker";
import { Label } from "@/components/ui/label";
import type { CampoFechaProps } from "./types";

function fechaDeIso(iso: string | null | undefined): Date | undefined {
  if (!iso) return undefined;
  const [anio, mes, dia] = iso.slice(0, 10).split("-").map(Number);
  if (!anio || !mes || !dia) return undefined;
  return new Date(anio, mes - 1, dia);
}

function isoDeFecha(fecha: Date | undefined): string {
  if (!fecha) return "";
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

export function CampoFecha<T extends FieldValues>({
  control,
  name,
  label,
  hint,
  error,
  disabled = false,
  required = false,
  placeholder = "Seleccionar fecha",
  dateFormat = "dd/MM/yyyy",
  clearable = false,
}: CampoFechaProps<T>) {
  const textoEtiqueta = required && !label.includes("*") ? `${label} *` : label;

  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{textoEtiqueta}</Label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <DatePicker
            date={fechaDeIso(typeof field.value === "string" ? field.value : undefined)}
            onSelect={(fecha) => field.onChange(isoDeFecha(fecha))}
            disabled={disabled}
            clearable={clearable}
            dateFormat={dateFormat}
            placeholder={placeholder}
            className={error ? "border-destructive ring-destructive/20 w-full ring-1" : "w-full"}
          />
        )}
      />
      {hint ? <p className="text-muted-foreground text-xs">{hint}</p> : null}
      {error ? <p className="text-destructive text-xs font-medium">{error}</p> : null}
    </div>
  );
}
