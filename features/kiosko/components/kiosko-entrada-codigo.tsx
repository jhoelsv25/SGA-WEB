"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";

interface KioskoEntradaCodigoProps {
  valor: string;
  onCambiar: (nuevoValor: string) => void;
  onEnter: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  deshabilitado?: boolean;
  esModoPin?: boolean;
  etiqueta?: string;
  placeholder?: string;
}

export function KioskoEntradaCodigo({
  valor,
  onCambiar,
  onEnter,
  inputRef,
  deshabilitado = false,
  esModoPin = false,
  etiqueta = "Código de Estudiante o DNI",
  placeholder = "Digite su código o pase su tarjeta...",
}: KioskoEntradaCodigoProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Acepta únicamente caracteres numéricos
    const limpio = e.target.value.replace(/\D/g, "");
    onCambiar(limpio);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onEnter();
    }
  };

  return (
    <div className="space-y-2">
      <Label
        htmlFor="entrada-kiosko"
        className="text-muted-foreground block text-center text-xs font-bold tracking-wider uppercase select-none"
      >
        {etiqueta}
      </Label>

      <div className="border-border/80 bg-card focus-within:border-primary focus-within:ring-primary/20 relative flex min-h-16 w-full items-center justify-center rounded-2xl border px-4 py-3 shadow-inner transition-all focus-within:ring-2">
        <input
          id="entrada-kiosko"
          ref={inputRef}
          type={esModoPin ? "password" : "text"}
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          disabled={deshabilitado}
          value={valor}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label={etiqueta}
          className="text-foreground placeholder:text-muted-foreground/40 w-full bg-transparent text-center font-mono text-3xl font-black tracking-widest transition-all outline-none disabled:opacity-50 sm:text-4xl"
        />
      </div>
    </div>
  );
}
