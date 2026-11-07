"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Persona } from "../types/personas.types";
import { fichaVigenteAlRegistrar, type TipoFichaAcademica } from "../utils/ficha-academica";

export const MOTIVO_BAJA_MIN = 5;

interface BajaFichaActualFieldProps {
  persona: Persona | null;
  /** Condición en la que se está registrando a la persona. */
  destino: TipoFichaAcademica;
  motivo: string;
  onMotivoChange: (motivo: string) => void;
  error?: string | null;
  disabled?: boolean;
}

/**
 * RF-007 V4: si la persona ya tiene la otra ficha académica vigente, avisa que se dará de baja
 * y pide el motivo (confirmación). No muestra nada si no hay conflicto.
 */
export function BajaFichaActualField({
  persona,
  destino,
  motivo,
  onMotivoChange,
  error,
  disabled,
}: BajaFichaActualFieldProps) {
  const conflicto = persona ? fichaVigenteAlRegistrar(persona, destino) : null;
  if (!conflicto) return null;

  return (
    <div className="space-y-2 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3.5 text-xs">
      <p className="text-foreground text-sm font-semibold">
        Cambio de condición: de {conflicto.tipo} a {destino}
      </p>
      <p className="text-muted-foreground">
        Esta persona tiene una ficha de <strong>{conflicto.tipo}</strong> activa. Al guardar se dará
        de baja esa ficha y se creará la de {destino}. Una persona solo puede tener una ficha
        académica vigente.
      </p>
      <div className="space-y-1.5">
        <Label htmlFor="motivoBajaFicha" className="text-sm font-medium">
          Motivo de la baja *
        </Label>
        <Textarea
          id="motivoBajaFicha"
          value={motivo}
          onChange={(e) => onMotivoChange(e.target.value)}
          placeholder={`Ej. Pasa a ser ${destino} del colegio`}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          className="min-h-16 text-xs"
        />
        {error && <p className="text-destructive text-xs">{error}</p>}
      </div>
    </div>
  );
}
