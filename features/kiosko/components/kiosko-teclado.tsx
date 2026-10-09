"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

interface KioskoTecladoProps {
  onPulsarNumero: (digito: string) => void;
  onBorrarTodo: () => void;
  onBorrarUltimo: () => void;
  onEnviar: () => void;
  deshabilitado?: boolean;
  puedeEnviar: boolean;
  textoBoton?: string;
}

export function KioskoTeclado({
  onPulsarNumero,
  onBorrarTodo,
  onBorrarUltimo,
  onEnviar,
  deshabilitado = false,
  puedeEnviar,
  textoBoton = "Continuar Marcación",
}: KioskoTecladoProps) {
  return (
    <div className="space-y-4">
      {/* Matriz del teclado numérico con teclas de mínimo 64 px */}
      <div className="grid grid-cols-3 gap-3" role="group" aria-label="Teclado numérico táctil">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            type="button"
            disabled={deshabilitado}
            onClick={() => onPulsarNumero(num.toString())}
            className="border-border/80 bg-muted/70 text-foreground hover:bg-muted active:bg-primary active:text-primary-foreground focus-visible:ring-primary/40 flex h-16 min-h-16 items-center justify-center rounded-2xl border text-2xl font-black shadow-2xs transition-all outline-none select-none focus-visible:ring-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
          >
            {num}
          </button>
        ))}

        {/* Tecla BORRAR */}
        <button
          type="button"
          disabled={deshabilitado}
          onClick={onBorrarTodo}
          aria-label="Borrar código ingresado"
          className="border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/20 active:bg-destructive/30 focus-visible:ring-destructive/40 flex h-16 min-h-16 items-center justify-center rounded-2xl border text-xs font-black tracking-wider transition-all outline-none select-none focus-visible:ring-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
        >
          BORRAR
        </button>

        {/* Tecla 0 */}
        <button
          type="button"
          disabled={deshabilitado}
          onClick={() => onPulsarNumero("0")}
          className="border-border/80 bg-muted/70 text-foreground hover:bg-muted active:bg-primary active:text-primary-foreground focus-visible:ring-primary/40 flex h-16 min-h-16 items-center justify-center rounded-2xl border text-2xl font-black shadow-2xs transition-all outline-none select-none focus-visible:ring-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
        >
          0
        </button>

        {/* Tecla retroceso ⌫ */}
        <button
          type="button"
          disabled={deshabilitado}
          onClick={onBorrarUltimo}
          aria-label="Borrar último dígito"
          className="border-border/80 bg-muted/70 text-foreground hover:bg-muted active:bg-primary active:text-primary-foreground focus-visible:ring-primary/40 flex h-16 min-h-16 items-center justify-center rounded-2xl border text-xl font-black shadow-2xs transition-all outline-none select-none focus-visible:ring-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
        >
          ⌫
        </button>
      </div>

      {/* Botón de envío manual (para teclado táctil o si no se auto-envió) */}
      <Button
        type="button"
        variant="default"
        size="lg"
        disabled={!puedeEnviar || deshabilitado}
        onClick={onEnviar}
        className="h-14 w-full gap-2 rounded-2xl text-sm font-bold shadow-md"
      >
        <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-5" aria-hidden="true" />
        <span>{textoBoton}</span>
      </Button>
    </div>
  );
}
