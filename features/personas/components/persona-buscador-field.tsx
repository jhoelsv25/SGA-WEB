"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BuscarPersonaModal, type DestinoFichaUnica } from "./modals/buscar-persona-modal";
import type { Persona } from "../types/personas.types";

interface PersonaBuscadorFieldProps {
  destino: DestinoFichaUnica;
  value: Persona | null;
  onChange: (persona: Persona | null) => void;
  disabled?: boolean;
  id?: string;
}

/** Campo estándar para elegir una persona del padrón: texto + botón «Buscar» → tabla de 5 en 5. */
export function PersonaBuscadorField({
  destino,
  value,
  onChange,
  disabled,
  id,
}: PersonaBuscadorFieldProps) {
  const [termino, setTermino] = React.useState("");
  const [abierto, setAbierto] = React.useState(false);

  if (value) {
    return (
      <div className="border-primary/30 bg-primary/5 flex items-center justify-between rounded-lg border p-3 text-xs">
        <div className="space-y-0.5">
          <p className="text-foreground text-sm font-medium">{value.nombreCompleto}</p>
          <p className="text-muted-foreground font-mono text-xs">
            {value.tipoDocumento.toUpperCase()}: {value.numeroDocumento}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => onChange(null)}
          className="h-7 text-xs"
        >
          Cambiar
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <HugeiconsIcon
          icon={Search01Icon}
          className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
        />
        <Input
          id={id}
          placeholder="Ingrese DNI o nombre..."
          value={termino}
          onChange={(e) => setTermino(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              setAbierto(true);
            }
          }}
          disabled={disabled}
          className="pl-9 text-xs"
        />
      </div>
      <Button
        type="button"
        size="sm"
        onClick={() => setAbierto(true)}
        disabled={disabled}
        className="h-10 rounded-full px-5 text-xs"
      >
        Buscar
      </Button>
      <BuscarPersonaModal
        open={abierto}
        onOpenChange={setAbierto}
        destino={destino}
        terminoInicial={termino}
        onSeleccionar={onChange}
      />
    </div>
  );
}
