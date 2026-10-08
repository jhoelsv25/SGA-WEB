"use client";

import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { DatePicker } from "@/components/common/date-picker";
import { Label } from "@/components/ui/label";
import { fechaDeIso, isoDeFecha } from "../../utils";

interface CampoFechaProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
}

export function CampoFecha<T extends FieldValues>({
  control,
  name,
  label,
  hint,
  error,
  disabled = false,
}: CampoFechaProps<T>) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <DatePicker
            date={fechaDeIso(typeof field.value === "string" ? field.value : undefined)}
            onSelect={(fecha) => field.onChange(isoDeFecha(fecha))}
            disabled={disabled}
            clearable={false}
            dateFormat="dd/MM/yyyy"
            placeholder="Seleccionar fecha"
            className={error ? "border-destructive ring-destructive/20 w-full ring-1" : "w-full"}
          />
        )}
      />
      {hint ? <p className="text-muted-foreground text-xs">{hint}</p> : null}
      {error ? <p className="text-destructive text-xs font-medium">{error}</p> : null}
    </div>
  );
}
